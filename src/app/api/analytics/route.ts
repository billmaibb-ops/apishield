import { NextResponse } from 'next/server'
import { listKeys, getDailyCallCount, getTotalCallsToday } from '@/lib/keys'
import { isRedisConfigured } from '@/lib/redis'
import { redis } from '@/lib/redis'

// GET /api/analytics — aggregated usage stats with latency, errors, and token usage
export async function GET() {
  if (!isRedisConfigured()) {
    return NextResponse.json({ configured: false })
  }

  try {
    const keys = await listKeys()
    const today = new Date().toISOString().split('T')[0]

    // Last 7 days
    const days: string[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      days.push(d.toISOString().split('T')[0])
    }

    // Daily totals for last 7 days
    const dailyCounts = await Promise.all(
      days.map(async (day) => {
        const [calls, latTotal, latCount, errors, tokens] = await Promise.all([
          redis.get(`calls:total:${day}`),
          redis.get(`lat_total:all:${day}`),   // not tracked globally yet — use per-key sum below
          redis.get(`lat_count:all:${day}`),
          redis.get(`errors:total:${day}`),
          redis.get(`tokens:total:${day}`),
        ])
        return {
          date: day,
          calls: calls ? Number(calls) : 0,
          errors: errors ? Number(errors) : 0,
          tokens: tokens ? Number(tokens) : 0,
        }
      })
    )

    // Per-key stats for today
    const keyStats = await Promise.all(
      keys.map(async (k) => {
        const [callsToday, latTotal, latCount, errorsToday, tokensToday] = await Promise.all([
          getDailyCallCount(k.id, today),
          redis.get(`lat_total:${k.id}:${today}`),
          redis.get(`lat_count:${k.id}:${today}`),
          redis.get(`errors:${k.id}:${today}`),
          redis.get(`tokens:${k.id}:${today}`),
        ])

        const latTotalNum  = latTotal  ? Number(latTotal)  : 0
        const latCountNum  = latCount  ? Number(latCount)  : 0
        const avgLatencyMs = latCountNum > 0 ? Math.round(latTotalNum / latCountNum) : null
        const errorCount   = errorsToday ? Number(errorsToday) : 0
        const errorRate    = callsToday > 0 ? Math.round((errorCount / callsToday) * 100) : 0

        return {
          id: k.id,
          name: k.name,
          status: k.status,
          rateLimit: k.rateLimit,
          authType: k.authType ?? 'api_key',
          callsToday,
          avgLatencyMs,
          errorCount,
          errorRate,
          tokensToday: tokensToday ? Number(tokensToday) : 0,
        }
      })
    )

    const totalToday  = await getTotalCallsToday()
    const activeKeys  = keys.filter(k => k.status === 'active').length

    // Aggregate latency across all keys for today
    const allLatTotals = await Promise.all(keys.map(k => redis.get(`lat_total:${k.id}:${today}`)))
    const allLatCounts = await Promise.all(keys.map(k => redis.get(`lat_count:${k.id}:${today}`)))
    const sumLatency   = allLatTotals.reduce<number>((s, v) => s + (v ? Number(v) : 0), 0)
    const sumCount     = allLatCounts.reduce<number>((s, v) => s + (v ? Number(v) : 0), 0)
    const avgLatencyMs = sumCount > 0 ? Math.round(sumLatency / sumCount) : null

    // Total errors today
    const allErrors  = await Promise.all(keys.map(k => redis.get(`errors:${k.id}:${today}`)))
    const totalErrors = allErrors.reduce<number>((s, v) => s + (v ? Number(v) : 0), 0)

    // Total tokens today
    const totalTokensRaw = await redis.get(`tokens:total:${today}`)
    const totalTokens = totalTokensRaw ? Number(totalTokensRaw) : 0

    return NextResponse.json({
      configured: true,
      today: {
        totalCalls: totalToday,
        activeKeys,
        totalKeys: keys.length,
        avgLatencyMs,
        totalErrors,
        errorRate: totalToday > 0 ? Math.round((totalErrors / totalToday) * 100) : 0,
        totalTokens,
      },
      dailyTotals: dailyCounts,
      keyStats,
    })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch analytics', details: String(err) }, { status: 500 })
  }
}
