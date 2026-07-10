import { NextRequest, NextResponse } from 'next/server'
import { listBackends, createBackend } from '@/lib/backends'
import { isRedisConfigured } from '@/lib/redis'

// GET /api/backends
export async function GET() {
  if (!isRedisConfigured()) {
    return NextResponse.json({ configured: false, backends: [] })
  }
  try {
    const backends = await listBackends()
    return NextResponse.json({ configured: true, backends })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to list backends', details: String(err) }, { status: 500 })
  }
}

// POST /api/backends — add a new upstream backend
export async function POST(req: NextRequest) {
  if (!isRedisConfigured()) {
    return NextResponse.json({ error: 'Redis not configured' }, { status: 503 })
  }
  try {
    const body = await req.json()
    const { name, url, stripPrefix, description } = body

    if (!name?.trim()) return NextResponse.json({ error: 'name is required' }, { status: 400 })
    if (!url?.trim()) return NextResponse.json({ error: 'url is required' }, { status: 400 })

    // Basic URL validation
    try { new URL(url) } catch {
      return NextResponse.json({ error: 'url must be a valid URL (e.g. https://api.myservice.com)' }, { status: 400 })
    }

    const { type = 'rest', llmProvider } = body
    const backend = await createBackend(name.trim(), url.trim(), stripPrefix, description, type, llmProvider)
    return NextResponse.json({ backend }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create backend', details: String(err) }, { status: 500 })
  }
}
