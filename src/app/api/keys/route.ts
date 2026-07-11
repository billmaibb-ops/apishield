import { NextRequest, NextResponse } from 'next/server'
import { listKeys, createKey } from '@/lib/keys'
import { getDailyCallCount } from '@/lib/keys'
import { isRedisConfigured } from '@/lib/redis'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/keys — list all keys with today's call counts
export async function GET() {
  if (!isRedisConfigured()) {
    return NextResponse.json({ configured: false, keys: [] })
  }
  try {
    const keys = await listKeys()
    const today = new Date().toISOString().split('T')[0]
    const keysWithCounts = await Promise.all(
      keys.map(async (k) => ({
        ...k,
        callsToday: await getDailyCallCount(k.id, today),
      }))
    )
    return NextResponse.json({ configured: true, keys: keysWithCounts })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to list keys', details: String(err) }, { status: 500 })
  }
}

// POST /api/keys — create a new key
export async function POST(req: NextRequest) {
  if (!isRedisConfigured()) {
    return NextResponse.json({ error: 'Redis not configured' }, { status: 503 })
  }
  try {
    const body = await req.json()
    const session = await getServerSession(authOptions)
    const ownerEmail = session?.user?.email ?? undefined

    const {
      name,
      rateLimit = 1000,
      backendId,
      description,
      authType = 'api_key',
      jwtSecret,
      policies,
    } = body

    if (!name?.trim()) {
      return NextResponse.json({ error: 'name is required' }, { status: 400 })
    }
    if (!backendId?.trim()) {
      return NextResponse.json({ error: 'backendId is required' }, { status: 400 })
    }
    if (authType === 'jwt' && !jwtSecret?.trim()) {
      return NextResponse.json({ error: 'jwtSecret is required when authType is jwt' }, { status: 400 })
    }

    const key = await createKey(
      name.trim(),
      Number(rateLimit),
      backendId.trim(),
      description,
      authType,
      jwtSecret?.trim() || undefined,
      policies || undefined,
      ownerEmail
    )
    return NextResponse.json({ key }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create key', details: String(err) }, { status: 500 })
  }
}
