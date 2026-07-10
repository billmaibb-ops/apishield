import { NextRequest, NextResponse } from 'next/server'
import { getBackend, updateBackend, deleteBackend } from '@/lib/backends'
import { isRedisConfigured } from '@/lib/redis'

type Params = { params: { id: string } }

export async function GET(_req: NextRequest, { params }: Params) {
  if (!isRedisConfigured()) return NextResponse.json({ error: 'Redis not configured' }, { status: 503 })
  const backend = await getBackend(params.id)
  if (!backend) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ backend })
}

export async function PATCH(req: NextRequest, { params }: Params) {
  if (!isRedisConfigured()) return NextResponse.json({ error: 'Redis not configured' }, { status: 503 })
  try {
    const body = await req.json()
    const allowed = ['name', 'url', 'stripPrefix', 'active', 'description']
    const updates: Record<string, unknown> = {}
    for (const field of allowed) {
      if (field in body) updates[field] = body[field]
    }
    if (updates.url) {
      try { new URL(updates.url as string) } catch {
        return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
      }
    }
    const updated = await updateBackend(params.id, updates)
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ backend: updated })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update', details: String(err) }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  if (!isRedisConfigured()) return NextResponse.json({ error: 'Redis not configured' }, { status: 503 })
  const deleted = await deleteBackend(params.id)
  if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ success: true })
}
