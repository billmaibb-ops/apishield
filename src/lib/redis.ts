import { Redis } from '@upstash/redis'

// Upstash Redis client — set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN in env
// Free tier: https://upstash.com → Create Database → REST API tab
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || 'https://placeholder.upstash.io',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || 'placeholder',
})

export const isRedisConfigured = () =>
  Boolean(
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN &&
    !process.env.UPSTASH_REDIS_REST_URL.includes('placeholder')
  )
