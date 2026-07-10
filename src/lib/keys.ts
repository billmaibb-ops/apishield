import { randomBytes } from 'crypto'
import { redis } from './redis'

export type ApiKey = {
  id: string
  name: string
  key: string
  status: 'active' | 'revoked'
  rateLimit: number   // requests per minute
  backendId: string
  createdAt: string
  description?: string
}

function generateId(): string {
  return randomBytes(8).toString('hex')
}

function generateApiKey(): string {
  return `sk_live_${randomBytes(16).toString('hex')}`
}

export async function createKey(
  name: string,
  rateLimit: number,
  backendId: string,
  description?: string
): Promise<ApiKey> {
  const id = generateId()
  const key = generateApiKey()
  const apiKey: ApiKey = {
    id, name, key,
    status: 'active',
    rateLimit,
    backendId,
    createdAt: new Date().toISOString(),
    description,
  }
  await redis.set(`key:${id}`, JSON.stringify(apiKey))
  await redis.set(`keylookup:${key}`, id)
  await redis.sadd('keys:list', id)
  return apiKey
}

export async function getKey(id: string): Promise<ApiKey | null> {
  const data = await redis.get(`key:${id}`)
  if (!data) return null
  return typeof data === 'string' ? JSON.parse(data) : data as ApiKey
}

export async function getKeyByValue(keyValue: string): Promise<ApiKey | null> {
  const id = await redis.get(`keylookup:${keyValue}`)
  if (!id) return null
  return getKey(id as string)
}

export async function listKeys(): Promise<ApiKey[]> {
  const ids = (await redis.smembers('keys:list')) as string[]
  if (!ids.length) return []
  const keys = await Promise.all(ids.map(getKey))
  return keys.filter(Boolean) as ApiKey[]
}

export async function updateKey(id: string, updates: Partial<ApiKey>): Promise<ApiKey | null> {
  const existing = await getKey(id)
  if (!existing) return null
  const updated = { ...existing, ...updates, id } // id is immutable
  await redis.set(`key:${id}`, JSON.stringify(updated))
  return updated
}

export async function deleteKey(id: string): Promise<boolean> {
  const key = await getKey(id)
  if (!key) return false
  await redis.del(`key:${id}`)
  await redis.del(`keylookup:${key.key}`)
  await redis.srem('keys:list', id)
  return true
}

export async function getDailyCallCount(keyId: string, date?: string): Promise<number> {
  const d = date || new Date().toISOString().split('T')[0]
  const count = await redis.get(`calls:${keyId}:${d}`)
  return count ? Number(count) : 0
}

export async function getTotalCallsToday(): Promise<number> {
  const today = new Date().toISOString().split('T')[0]
  const count = await redis.get(`calls:total:${today}`)
  return count ? Number(count) : 0
}
