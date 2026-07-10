import { NextResponse } from 'next/server'
import { listKeys, getDailyCallCount, getTotalCallsToday } from '@/lib/keys'
import { isRedisConfigured } from '@/lib/redis'
import { redis } from '@/lib/redis'

// GET /api/analytics — aggregated usage stats
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
        const count = await redis.get(`calls:total:${day}`)
        return { date: day, calls: count ? Number(count) : 0 }
      })
    )

    // Per-key stats for today
    const keyStats = await Promise.all(
      keys.map(async (k) => ({
        id: k.id,
        name: k.name,
        status: k.status,
        rateLimit: k.rateLimit,
        callsToday: await getDailyCallCount(k.id, today),
      }))
    )

    const totalToday = await getTotalCallsToday()
    const activeKeys = keys.filter(k => k.status === 'active').length

    return NextResponse.json({
      configured: true,
      today: {
        totalCalls: totalToday,
        activeKeys,
        totalKeys: keys.length,
      },
      dailyTotals: dailyCounts,
      keyStats,
    })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch analytics', details: String(err) }, { status: 500 })
  }
}
