/**
 * APIShield Gateway Proxy
 *
 * Handles every request to /api/gateway/{path}
 *
 * Feature set:
 *   • API key auth       — X-API-Key / ?api_key= / Authorization: Bearer sk_live_xxx
 *   • JWT / HS256 auth   — Bearer <signed_jwt> (when key.authType = 'jwt')
 *   • Per-minute rate limiting
 *   • IP allowlist policy
 *   • Max request-size policy
 *   • Header injection / stripping policy
 *   • WebSocket upgrade detection + key validation + WS URL redirect
 *   • GraphQL POST passthrough (content-type preserved)
 *   • LLM token usage tracking (OpenAI / Anthropic compatible)
 *   • Per-key latency and error-rate tracking
 *   • Runs on Vercel Edge Runtime for lowest cold-start latency
 */

export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { redis, isRedisConfigured } from '@/lib/redis'
import { verifyJwt } from '@/lib/jwt'
import { enforceIpAllowlist, enforceMaxRequestSize, buildHeaderPolicy } from '@/lib/policies'
import type { ApiKey } from '@/lib/keys'
import type { Backend } from '@/lib/backends'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    ''
  )
}

/** Extract the API key identifier AND any separate Bearer token. */
function extractCredentials(req: NextRequest): {
  keyIdentifier: string | null
  bearerToken: string | null
} {
  const keyHeader = req.headers.get('x-api-key')
  const keyParam  = req.nextUrl.searchParams.get('api_key')
  const authHeader = req.headers.get('authorization')
  const bearerMatch = authHeader?.match(/^Bearer\s+(.+)$/i)
  const bearerToken = bearerMatch?.[1] ?? null

  // For JWT-auth keys: keyIdentifier comes from header/param; bearerToken is the JWT.
  // For api_key auth: keyIdentifier can come from any of the three sources.
  return {
    keyIdentifier: keyHeader || keyParam || bearerToken,
    bearerToken,
  }
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
  const rlKey  = `rl:${keyId}:${minute}`
  // Pipeline INCR + EXPIRE in one round trip (was 1-2 RTTs)
  const p = redis.pipeline()
  p.incr(rlKey)
  p.expire(rlKey, 120)
  const [calls] = await p.exec() as [number, number]
  return { allowed: calls <= limit, calls, resetAt: (minute + 1) * 60000 }
}

/** Fire-and-forget: pipeline all tracking commands + request log into one HTTP round trip. */
function trackAll(
  keyId: string,
  latencyMs: number,
  isError: boolean,
  totalTokens: number,
  method = 'GET',
  reqPath = '/'
): void {
  const today = new Date().toISOString().split('T')[0]
  const ttl   = 86400 * 8
  const p = redis.pipeline()
  // Request log (capped list, 200 entries, 7-day TTL)
  const logEntry = JSON.stringify({ ts: Date.now(), status: isError ? 0 : 200, ms: latencyMs, method, path: reqPath })
  p.lpush(`logs:${keyId}`, logEntry)
  p.ltrim(`logs:${keyId}`, 0, 199)
  p.expire(`logs:${keyId}`, 86400 * 7)
  // Call counters
  p.incr(`calls:${keyId}:${today}`)
  p.expire(`calls:${keyId}:${today}`, ttl)
  p.incr(`calls:total:${today}`)
  p.expire(`calls:total:${today}`, ttl)
  // Latency accumulators
  p.incrby(`lat_total:${keyId}:${today}`, latencyMs)
  p.expire(`lat_total:${keyId}:${today}`, ttl)
  p.incr(`lat_count:${keyId}:${today}`)
  p.expire(`lat_count:${keyId}:${today}`, ttl)
  // Error counters (only when needed)
  if (isError) {
    p.incr(`errors:${keyId}:${today}`)
    p.expire(`errors:${keyId}:${today}`, ttl)
    p.incr(`errors:total:${today}`)
    p.expire(`errors:total:${today}`, ttl)
  }
  // Token counters (LLM traffic)
  if (totalTokens > 0) {
    p.incrby(`tokens:${keyId}:${today}`, totalTokens)
    p.expire(`tokens:${keyId}:${today}`, ttl)
    p.incrby(`tokens:total:${today}`, totalTokens)
    p.expire(`tokens:total:${today}`, ttl)
  }
  p.exec().catch(() => { /* non-critical — never block the response */ })
}

// ─── Main handler ─────────────────────────────────────────────────────────────

async function handle(
  req: NextRequest,
  { params }: { params: { path: string[] } }
): Promise<NextResponse> {
  const startTime = Date.now()

  // ── 0. Redis guard ────────────────────────────────────────────────────────
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

  // ── 1. WebSocket upgrade detection ────────────────────────────────────────
  // Serverless can't hold persistent WS connections, so we validate the key
  // and return the direct backend WS URL for the client to connect to.
  if (req.headers.get('upgrade')?.toLowerCase() === 'websocket') {
    const { keyIdentifier } = extractCredentials(req)
    if (!keyIdentifier) {
      return NextResponse.json({ error: 'Missing API key for WebSocket upgrade' }, { status: 401 })
    }
    const wsKey = await resolveKey(keyIdentifier)
    if (!wsKey || wsKey.status !== 'active') {
      return NextResponse.json({ error: 'Invalid or revoked API key' }, { status: 403 })
    }
    const wsBackend = await resolveBackend(wsKey.backendId)
    if (!wsBackend?.active) {
      return NextResponse.json({ error: 'Backend not found or inactive' }, { status: 503 })
    }
    const path = params.path.join('/')
    const sp = new URLSearchParams(req.nextUrl.searchParams)
    sp.delete('api_key')
    const wsBase = wsBackend.url
      .replace(/^https:\/\//, 'wss://')
      .replace(/^http:\/\//, 'ws://')
      .replace(/\/$/, '')
    const wsUrl = `${wsBase}/${path}${sp.toString() ? `?${sp}` : ''}`
    return NextResponse.json(
      {
        error: 'WebSocket upgrade requires a direct connection',
        hint: 'Connect your WebSocket client directly to wsUrl below',
        wsUrl,
        keyName: wsKey.name,
      },
      { status: 426, headers: { Upgrade: 'websocket', 'X-WS-Backend-URL': wsUrl } }
    )
  }

  // ── 2. Extract credentials ────────────────────────────────────────────────
  const { keyIdentifier, bearerToken } = extractCredentials(req)
  if (!keyIdentifier) {
    return NextResponse.json(
      {
        error: 'Missing API key',
        hint: 'Pass via X-API-Key header, ?api_key= query param, or Authorization: Bearer <key>',
        example: `${req.nextUrl.origin}/api/gateway/your/path?api_key=sk_live_xxx`,
      },
      { status: 401 }
    )
  }

  // ── 3. Resolve key record ────────────────────────────────────────────────
  const keyData = await resolveKey(keyIdentifier)
  if (!keyData) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 403 })
  }
  if (keyData.status !== 'active') {
    return NextResponse.json({ error: 'API key is revoked' }, { status: 403 })
  }

  // ── 4. JWT validation (authType = 'jwt') ──────────────────────────────────
  if (keyData.authType === 'jwt') {
    if (!bearerToken) {
      return NextResponse.json(
        {
          error: 'JWT required',
          hint: 'This key requires Authorization: Bearer <jwt_token> in addition to the X-API-Key / ?api_key identifier',
        },
        { status: 401 }
      )
    }
    if (!keyData.jwtSecret) {
      return NextResponse.json(
        { error: 'JWT auth misconfigured — key has no jwtSecret' },
        { status: 500 }
      )
    }
    const payload = await verifyJwt(bearerToken, keyData.jwtSecret)
    if (!payload) {
      return NextResponse.json(
        {
          error: 'Invalid or expired JWT',
          hint: 'Ensure the token is signed with HS256 using the correct secret and has not expired',
        },
        { status: 401 }
      )
    }
  }

  // ── 5. Policy enforcement ─────────────────────────────────────────────────
  if (keyData.policies) {
    const clientIp = getClientIp(req)

    const ipResult = enforceIpAllowlist(clientIp, keyData.policies)
    if (!ipResult.allowed) {
      return NextResponse.json(
        { error: ipResult.error, details: ipResult.details },
        { status: ipResult.status ?? 403 }
      )
    }

    const sizeResult = enforceMaxRequestSize(req.headers.get('content-length'), keyData.policies)
    if (!sizeResult.allowed) {
      return NextResponse.json(
        { error: sizeResult.error, details: sizeResult.details },
        { status: sizeResult.status ?? 413 }
      )
    }
  }

  // ── 6+7. Rate limiting + backend lookup — parallel (independent) ──────────
  const [{ allowed, calls, resetAt }, backend] = await Promise.all([
    enforceRateLimit(keyData.id, keyData.rateLimit),
    resolveBackend(keyData.backendId),
  ])
  const remaining = Math.max(0, keyData.rateLimit - calls)

  const rateLimitHeaders = {
    'X-RateLimit-Limit':     String(keyData.rateLimit),
    'X-RateLimit-Remaining': String(remaining),
    'X-RateLimit-Reset':     String(resetAt),
    'X-RateLimit-Policy':    `${keyData.rateLimit};w=60`,
    'X-Proxied-By':          'APIShield',
  }

  if (!allowed) {
    const retryAfter = Math.ceil((resetAt - Date.now()) / 1000)
    return NextResponse.json(
      {
        error: 'Rate limit exceeded',
        limit: keyData.rateLimit,
        window: '1 minute',
        retryAfter,
      },
      {
        status: 429,
        headers: { ...rateLimitHeaders, 'Retry-After': String(retryAfter) },
      }
    )
  }

  // backend resolved in parallel above
  if (!backend?.active) {
    return NextResponse.json(
      { error: 'Backend not found or inactive' },
      { status: 503, headers: rateLimitHeaders }
    )
  }

  // ── 8. Build target URL ───────────────────────────────────────────────────
  const path = params.path.join('/')
  const searchParams = new URLSearchParams(req.nextUrl.searchParams)
  searchParams.delete('api_key')
  const queryString = searchParams.toString()
  const targetUrl = `${backend.url}/${path}${queryString ? `?${queryString}` : ''}`

  // ── 9. Build forward headers ──────────────────────────────────────────────
  const forwardHeaders: Record<string, string> = {
    'X-Forwarded-By':   'APIShield',
    'X-API-Key-Name':   keyData.name,
    'X-Forwarded-Host': req.headers.get('host') || '',
    'X-Forwarded-For':  getClientIp(req),
  }

  // Policy: inject + strip
  if (keyData.policies) {
    const { inject, strip } = buildHeaderPolicy(keyData.policies)
    Object.assign(forwardHeaders, inject)
    strip.forEach(h => { delete forwardHeaders[h] })

    // Also apply strip to pass-through headers
    const passThrough = ['content-type', 'accept', 'accept-encoding', 'accept-language']
    for (const h of passThrough) {
      if (!strip.has(h)) {
        const v = req.headers.get(h)
        if (v) forwardHeaders[h] = v
      }
    }
  } else {
    // No policy: pass all safe headers through
    for (const h of ['content-type', 'accept', 'accept-encoding', 'accept-language']) {
      const v = req.headers.get(h)
      if (v) forwardHeaders[h] = v
    }
  }

  // ── 10. Proxy request ─────────────────────────────────────────────────────
  const forwardInit: RequestInit = {
    method: req.method,
    headers: forwardHeaders,
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    // In Edge Runtime, pass the ReadableStream directly
    forwardInit.body = req.body
    ;(forwardInit as Record<string, unknown>)['duplex'] = 'half'
  }

  let upstream: Response
  try {
    upstream = await fetch(targetUrl, forwardInit)
  } catch (err) {
    trackAll(keyData.id, Date.now() - startTime, true, 0, req.method, params.path.join('/'))
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

  const latencyMs = Date.now() - startTime
  const isError   = upstream.status >= 400

  // ── 11. Track usage (non-blocking) ───────────────────────────────────────

  // ── 12. Read body + parse LLM tokens, then fire one pipeline trackAll ──────
  const body = await upstream.arrayBuffer()

  let totalTokens = 0
  if (
    backend.type === 'llm' &&
    upstream.headers.get('content-type')?.includes('application/json') &&
    !isError
  ) {
    try {
      const json = JSON.parse(new TextDecoder().decode(body)) as Record<string, unknown>
      const usage = json?.usage as Record<string, number> | undefined
      if (usage) {
        totalTokens = usage.total_tokens
          ?? ((usage.input_tokens ?? 0) + (usage.output_tokens ?? 0))
      }
    } catch { /* non-critical */ }
  }

  // One pipeline call covers calls + latency + errors + tokens
  trackAll(keyData.id, latencyMs, isError, totalTokens, req.method, params.path.join('/'))

  // ── 13. Return upstream response ──────────────────────────────────────────
  const responseHeaders: Record<string, string> = {
    ...rateLimitHeaders,
    'X-Response-Time': `${latencyMs}ms`,
  }

  const upstreamCt = upstream.headers.get('content-type')
  if (upstreamCt) responseHeaders['Content-Type'] = upstreamCt

  for (const h of ['cache-control', 'etag', 'last-modified', 'content-encoding']) {
    const v = upstream.headers.get(h)
    if (v) responseHeaders[h] = v
  }

  return new NextResponse(body, {
    status:     upstream.status,
    statusText: upstream.statusText,
    headers:    responseHeaders,
  })
}

// All HTTP methods go through the same proxy logic
export const GET     = handle
export const POST    = handle
export const PUT     = handle
export const PATCH   = handle
export const DELETE  = handle
export const HEAD    = handle
export const OPTIONS = handle
