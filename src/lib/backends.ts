import { randomBytes } from 'crypto'
import { redis } from './redis'

export type Backend = {
  id: string
  name: string
  url: string            // e.g. https://api.myservice.com
  stripPrefix?: string   // optional path prefix to strip before forwarding
  active: boolean
  createdAt: string
  description?: string
  /** 'rest' (default) or 'llm' — enables token usage tracking from OpenAI-style responses */
  type?: 'rest' | 'llm'
  /** LLM provider for display and future provider-specific handling */
  llmProvider?: 'openai' | 'anthropic' | 'custom'
}

function generateId(): string {
  return randomBytes(8).toString('hex')
}

export async function createBackend(
  name: string,
  url: string,
  stripPrefix?: string,
  description?: string,
  type: 'rest' | 'llm' = 'rest',
  llmProvider?: 'openai' | 'anthropic' | 'custom'
): Promise<Backend> {
  const id = generateId()
  // Normalize: strip trailing slash
  const normalizedUrl = url.replace(/\/$/, '')
  const backend: Backend = {
    id, name,
    url: normalizedUrl,
    stripPrefix,
    active: true,
    createdAt: new Date().toISOString(),
    description,
    type,
    ...(llmProvider ? { llmProvider } : {}),
  }
  await redis.set(`backend:${id}`, JSON.stringify(backend))
  await redis.sadd('backends:list', id)
  return backend
}

export async function getBackend(id: string): Promise<Backend | null> {
  const data = await redis.get(`backend:${id}`)
  if (!data) return null
  return typeof data === 'string' ? JSON.parse(data) : data as Backend
}

export async function listBackends(): Promise<Backend[]> {
  const ids = (await redis.smembers('backends:list')) as string[]
  if (!ids.length) return []
  const backends = await Promise.all(ids.map(getBackend))
  return backends.filter(Boolean) as Backend[]
}

export async function updateBackend(id: string, updates: Partial<Backend>): Promise<Backend | null> {
  const existing = await getBackend(id)
  if (!existing) return null
  if (updates.url) updates.url = updates.url.replace(/\/$/, '')
  const updated = { ...existing, ...updates, id }
  await redis.set(`backend:${id}`, JSON.stringify(updated))
  return updated
}

export async function deleteBackend(id: string): Promise<boolean> {
  const backend = await getBackend(id)
  if (!backend) return false
  await redis.del(`backend:${id}`)
  await redis.srem('backends:list', id)
  return true
}
