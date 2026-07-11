import { NextResponse } from 'next/server'
import { redis } from '@/lib/redis'

export const runtime = 'edge'

export async function GET() {
  try {
    // Ping Redis — if this throws, the service is degraded
    await redis.ping()

    return NextResponse.json(
      { status: 'ok', ts: Date.now() },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store',
          'Surrogate-Control': 'no-store',
        },
      }
    )
  } catch (err) {
    return NextResponse.json(
      { status: 'degraded', error: String(err), ts: Date.now() },
      { status: 503 }
    )
  }
}
