/**
 * APIShield Gateway Proxy
 *
 * This is the real gateway. Every request to:
 *   /api/gateway/{path}?api_key=sk_live_xxx
 * or with header:
 *   X-API-Key: sk_live_xxx
 *
 * 1. Validates the API key against Redis
 * 2. Enforces per-minute rate limits
 * 3. Forwards the request to the key's configured backend
 * 4. Returns the upstream response with APIShield rate-limit headers
 */

import { NextRequest, NextResponse } from 'next/server'
import { redis, isRedisConfigured } from '@/lib/redis'
import type { ApiKey } from '@/lib/keys'
import type { Backend } from '@/lib/backends'

// ─── Helpers ───────────────────────────────────────────────────────────────

function extractApiKey(req: NextRequest): string | null {
  return (
    req.headers.get('x-api-key') ||
    req.nextUrl.searchParams.get('api_key') ||
    req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ||
    null
  )
}

async function resolveKey(keyValue: string): Promise<ApiKey | null> {
  const id = await redis.get(`keylookup:${keyValue}`) as string | null
  if (!id) return null
  const data = await redis.get(`key:${id}`)
  if (!data) return null
  return typeof data === 'string' ? JSON.parse(data) : data as ApiKey
}

async function resolveBackend(backendId: string): Promise<Backend | null> {
  const data = await redis.get(`backend:${backendId}`)
  if (!data) return null
  return typeof data === 'string' ? JSON.parse(data) : data as Backend
}

async function enforceRateLimit(
  keyId: string,
  limit: number
): Promise<{ allowed: boolean; calls: number; resetAt: number }> {
  const minute = Math.floor(Date.now() / 60000)
  const rlKey = `rl:${keyId}:${minute}`
  const calls = await redis.incr(rlKey)
  if (calls === 1) await redis.expire(rlKey, 120) // 2-min TTL covers window overlap
  const resetAt = (minute + 1) * 60000
  return { allowed: calls <= limit, calls, resetAt }
}

async function trackCall(keyId: string): Promise<void> {
  const today = new Date().toISOString().split('T')[0]
  // Fire-and-forget — don't await so it doesn't slow the proxy
  Promise.all([
    redis.incr(`calls:${keyId}:${today}`),
    redis.expire(`calls:${keyId}:${today}`, 86400 * 8),
    redis.incr(`calls:total:${today}`),
    redis.expire(`calls:total:${today}`, 86400 * 8),
  ]).catch(() => { /* non-critical */ })
}

// ─── Main handler ─────────────────────────────────────────────────────────

async function handle(
  req: NextRequest,
  { params }: { params: { path: string[] } }
): Promise<NextResponse> {

  // 0. Redis must be configured
  if (!isRedisConfigured()) {
    return NextResponse.json(
      {
        error: 'Gateway not configured',
        message: 'Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN environment variables.',
        docs: 'https://upstash.com → Create Database → REST API tab',
      },
      { status: 503 }
    )
  }

  // 1. Extract and validate API key
  const keyValue = extractApiKey(req)
  if (!keyValue) {
    return NextResponse.json(
      {
        error: 'Missing API key',
        hint: 'Pass your key via ?api_key= query param or X-API-Key header',
        example: `${req.nextUrl.origin}/api/gateway/your/path?api_key=sk_live_xxx`,
      },
      { status: 401 }
    )
  }

  const keyData = await resolveKey(keyValue)
  if (!keyData) {
    return NextResponse.json(
      { error: 'Invalid API key' },
      { status: 403 }
    )
  }

  if (keyData.status !== 'active') {
    return NextResponse.json(
      { error: 'API key is revoked' },
      { status: 403 }
    )
  }

  // 2. Rate limiting
  const { allowed, calls, resetAt } = await enforceRateLimit(keyData.id, keyData.rateLimit)
  const remaining = Math.max(0, keyData.rateLimit - calls)

  const rateLimitHeaders = {
    'X-RateLimit-Limit': String(keyData.rateLimit),
    'X-RateLimit-Remaining': String(remaining),
    'X-RateLimit-Reset': String(resetAt),
    'X-RateLimit-Policy': `${keyData.rateLimit};w=60`,
    'X-Proxied-By': 'APIShield',
  }

  if (!allowed) {
    return NextResponse.json(
      {
        error: 'Rate limit exceeded',
        limit: keyData.rateLimit,
        window: '1 minute',
        retryAfter: Math.ceil((resetAt - Date.now()) / 1000),
      },
      {
        status: 429,
        headers: { ...rateLimitHeaders, 'Retry-After': String(Math.ceil((resetAt - Date.now()) / 1000)) },
      }
    )
  }

  // 3. Resolve backend
  const backend = await resolveBackend(keyData.backendId)
  if (!backend || !backend.active) {
    return NextResponse.json(
      {
        error: 'Backend not found or inactive',
        hint: 'Configure a backend at /backends and attach it to this API key',
      },
      { status: 503, headers: rateLimitHeaders }
    )
  }

  // 4. Build target URL
  const path = params.path.join('/')
  const searchParams = new URLSearchParams(req.nextUrl.searchParams)
  searchParams.delete('api_key') // never forward the shield key

  const queryString = searchParams.toString()
  const targetUrl = `${backend.url}/${path}${queryString ? `?${queryString}` : ''}`

  // 5. Forward request
  const forwardHeaders: Record<string, string> = {
    'X-Forwarded-By': 'APIShield',
    'X-API-Key-Name': keyData.name,
    'X-Forwarded-Host': req.headers.get('host') || '',
    'X-Forwarded-For': req.headers.get('x-forwarded-for') || req.ip || '',
    'X-Real-IP': req.ip || '',
  }

  const contentType = req.headers.get('content-type')
  if (contentType) forwardHeaders['Content-Type'] = contentType

  const accept = req.headers.get('accept')
  if (accept) forwardHeaders['Accept'] = accept

  const forwardInit: RequestInit & { duplex?: string } = {
    method: req.method,
    headers: forwardHeaders,
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    forwardInit.body = req.body
    forwardInit.duplex = 'half'
  }

  let upstream: Response
  try {
    upstream = await fetch(targetUrl, forwardInit as RequestInit)
  } catch (err) {
    return NextResponse.json(
      {
        error: 'Backend unreachable',
        backend: backend.url,
        target: targetUrl,
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 502, headers: rateLimitHeaders }
    )
  }

  // 6. Track usage (non-blocking)
  trackCall(keyData.id)

  // 7. Return upstream response with APIShield headers added
  const body = await upstream.arrayBuffer()

  const responseHeaders: Record<string, string> = { ...rateLimitHeaders }

  // Pass through upstream content-type
  const upstreamContentType = upstream.headers.get('content-type')
  if (upstreamContentType) responseHeaders['Content-Type'] = upstreamContentType

  // Pass through useful upstream headers
  const passthroughHeaders = ['cache-control', 'etag', 'last-modified', 'content-encoding']
  for (const h of passthroughHeaders) {
    const v = upstream.headers.get(h)
    if (v) responseHeaders[h] = v
  }

  return new NextResponse(body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  })
}

// Export all HTTP methods — they all go through the same proxy logic
export const GET     = handle
export const POST    = handle
export const PUT     = handle
export const PATCH   = handle
export const DELETE  = handle
export const HEAD    = handle
export const OPTIONS = handle
