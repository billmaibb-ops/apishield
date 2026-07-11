import { NextRequest, NextResponse } from 'next/server'
import { rotateKey } from '@/lib/keys'
import { isRedisConfigured } from '@/lib/redis'

// POST /api/keys/[id]/rotate
export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isRedisConfigured()) {
    return NextResponse.json({ error: 'Redis not configured' }, { status: 503 })
  }
  try {
    const updated = await rotateKey(params.id)
    if (!updated) {
      return NextResponse.json({ error: 'Key not found' }, { status: 404 })
    }
    return NextResponse.json({ key: updated })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to rotate key', details: String(err) }, { status: 500 })
  }
}
