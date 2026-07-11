import { NextRequest, NextResponse } from 'next/server'
import { redis, isRedisConfigured } from '@/lib/redis'
import { listKeys } from '@/lib/keys'

export const dynamic = 'force-dynamic'

export type LogEntry = {
  ts: number
  status: number
  ms: number
  method: string
  path: string
}

// GET /api/logs?keyId=X&limit=50
export async function GET(req: NextRequest) {
  if (!isRedisConfigured()) {
    return NextResponse.json({ configured: false, logs: [] })
  }

  const keyId = req.nextUrl.searchParams.get('keyId')
  const limit = Math.min(200, Number(req.nextUrl.searchParams.get('limit') || '50'))

  if (!keyId) {
    // Return all key IDs so the UI can populate the selector
    const keys = await listKeys()
    return NextResponse.json({
      configured: true,
      keys: keys.map((k) => ({ id: k.id, name: k.name, status: k.status })),
    })
  }

  try {
    const raw = (await redis.lrange(`logs:${keyId}`, 0, limit - 1)) as string[]
    const logs: LogEntry[] = raw.map((r) => {
      try { return JSON.parse(r) } catch { return null }
    }).filter(Boolean) as LogEntry[]
    return NextResponse.json({ configured: true, logs })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch logs', details: String(err) }, { status: 500 })
  }
}
