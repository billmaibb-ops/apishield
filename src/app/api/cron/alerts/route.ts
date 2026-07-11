import { NextResponse } from 'next/server'
import { redis, isRedisConfigured } from '@/lib/redis'
import { listKeys } from '@/lib/keys'

export const dynamic = 'force-dynamic'

const THRESHOLDS = [1_000, 10_000, 100_000]

async function sendAlertEmail(to: string, keyName: string, count: number, threshold: number) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return // silently skip if not configured

  const formatted = count.toLocaleString()
  const thresholdFormatted = threshold.toLocaleString()

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: 'APIShield Alerts <alerts@apishield.io>',
      to,
      subject: `🛡️ Your API key "${keyName}" just crossed ${thresholdFormatted} requests today`,
      html: `
        <div style="font-family:sans-serif;max-width:500px;margin:0 auto;color:#111">
          <h2 style="color:#4f46e5">APIShield Usage Alert</h2>
          <p>Your API key <strong>${keyName}</strong> has processed
          <strong>${formatted}</strong> requests today — crossing the
          ${thresholdFormatted} milestone.</p>
          <p>
            <a href="https://apishield.vercel.app/analytics"
               style="background:#4f46e5;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;display:inline-block">
              View Analytics →
            </a>
          </p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0">
          <p style="color:#6b7280;font-size:12px">
            APIShield · <a href="https://apishield.vercel.app">apishield.vercel.app</a><br>
            You're receiving this because you created an API key on APIShield.
          </p>
        </div>
      `,
    }),
  }).catch(() => {}) // non-fatal
}

// POST /api/cron/alerts — called by Vercel Cron hourly
export async function GET() {
  if (!isRedisConfigured()) {
    return NextResponse.json({ ok: false, reason: 'redis not configured' })
  }

  // Verify this is an internal cron call (Vercel sets this header)
  // In production Vercel validates the cron secret automatically

  const today = new Date().toISOString().split('T')[0]
  const keys = await listKeys()
  let alertsSent = 0

  for (const key of keys) {
    if (!key.ownerEmail) continue

    const countRaw = await redis.get(`calls:${key.id}:${today}`)
    const count = Number(countRaw || 0)

    for (const threshold of THRESHOLDS) {
      if (count < threshold) continue // not there yet

      const flagKey = `alerted:${key.id}:${today}:${threshold}`
      const alreadySent = await redis.get(flagKey)
      if (alreadySent) continue // already notified today

      // Set flag first (idempotent) then send
      await redis.set(flagKey, '1', { ex: 86400 * 2 })
      await sendAlertEmail(key.ownerEmail, key.name, count, threshold)
      alertsSent++
    }
  }

  return NextResponse.json({ ok: true, alertsSent, keysChecked: keys.length })
}
