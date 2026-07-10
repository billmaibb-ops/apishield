import { NextRequest, NextResponse } from 'next/server'
import { getKey, updateKey, deleteKey } from '@/lib/keys'
import { isRedisConfigured } from '@/lib/redis'

type Params = { params: { id: string } }

// GET /api/keys/[id]
export async function GET(_req: NextRequest, { params }: Params) {
  if (!isRedisConfigured()) return NextResponse.json({ error: 'Redis not configured' }, { status: 503 })
  const key = await getKey(params.id)
  if (!key) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ key })
}

// PATCH /api/keys/[id] — update name, status, rateLimit, backendId
export async function PATCH(req: NextRequest, { params }: Params) {
  if (!isRedisConfigured()) return NextResponse.json({ error: 'Redis not configured' }, { status: 503 })
  try {
    const body = await req.json()
    const allowed = ['name', 'status', 'rateLimit', 'backendId', 'description']
    const updates: Record<string, unknown> = {}
    for (const field of allowed) {
      if (field in body) updates[field] = body[field]
    }
    const updated = await updateKey(params.id, updates)
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ key: updated })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update', details: String(err) }, { status: 500 })
  }
}

// DELETE /api/keys/[id]
export async function DELETE(_req: NextRequest, { params }: Params) {
  if (!isRedisConfigured()) return NextResponse.json({ error: 'Redis not configured' }, { status: 503 })
  const deleted = await deleteKey(params.id)
  if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ success: true })
}
