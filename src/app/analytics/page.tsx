'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface DayTotal {
  date: string
  calls: number
  errors: number
  tokens: number
}

interface KeyStat {
  id: string
  name: string
  status: string
  callsToday: number
  avgLatencyMs: number | null
  errorCount: number
  errorRate: number
  tokensToday: number
}

interface AnalyticsData {
  configured: boolean
  today: {
    totalCalls: number
    activeKeys: number
    totalKeys: number
    avgLatencyMs: number | null
    totalErrors: number
    errorRate: number
    totalTokens: number
  }
  dailyTotals: DayTotal[]
  keyStats: KeyStat[]
}

function fmt(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return String(n)
}

function shortDate(d: string) {
  const [, m, day] = d.split('-')
  return `${Number(m)}/${Number(day)}`
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/analytics')
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        setData(json)
      } catch (e) {
        setError(String(e))
      } finally {
        setLoading(false)
      }
    }
    load()
    const id = setInterval(load, 60_000)
    return () => clearInterval(id)
  }, [])

  const today = data?.today
  const daily = data?.dailyTotals ?? []
  const keys  = data?.keyStats ?? []
  const maxCalls = Math.max(...daily.map(d => d.calls), 1)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <Link href="/" className="text-gray-900 font-bold text-lg">🛡️ APIShield</Link>
        </div>
        <nav className="p-4 flex-1 space-y-1">
          {[
            { label: '📊 Dashboard', href: '/dashboard', active: false },
            { label: '🔑 API Keys', href: '/dashboard', active: false },
            { label: '📈 Analytics', href: '/analytics', active: true },
            { label: '⚙️ Settings', href: '#', active: false },
          ].map(item => (
            <Link key={item.label} href={item.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                item.active ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-100'
              }`}>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          {loading && <span className="text-xs text-gray-400 animate-pulse">Loading…</span>}
          {!loading && !error && <span className="text-xs text-gray-400">Auto-refreshes every 60s</span>}
        </div>
        <p className="text-gray-500 text-sm mb-8">Real-time data from your gateway</p>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
            Failed to load analytics: {error}
          </div>
        )}

        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {[
            {
              label: 'Total Calls Today',
              value: loading ? '—' : fmt(today?.totalCalls ?? 0),
              sub: today?.totalCalls === 0 ? 'No calls yet' : 'calls today',
            },
            {
              label: 'Avg Latency',
              value: loading ? '—' : today?.avgLatencyMs != null ? `${today.avgLatencyMs}ms` : '—',
              sub: today?.avgLatencyMs == null ? 'No traffic yet' : 'round-trip',
            },
            {
              label: 'Errors Today',
              value: loading ? '—' : String(today?.totalErrors ?? 0),
              sub: today?.totalErrors === 0 ? '100% success rate' : `${today?.errorRate ?? 0}% error rate`,
              warn: (today?.totalErrors ?? 0) > 0,
            },
            {
              label: 'LLM Tokens',
              value: loading ? '—' : fmt(today?.totalTokens ?? 0),
              sub: today?.totalTokens === 0 ? 'No LLM traffic yet' : 'proxied today',
            },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className={`text-2xl font-bold mb-1 ${s.warn ? 'text-red-600' : 'text-gray-900'}`}>{s.value}</div>
              <div className="text-gray-500 text-sm mb-1">{s.label}</div>
              <div className="text-xs text-gray-400">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* 7-day chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="font-semibold text-gray-900 mb-6">Calls — last 7 days</h2>
          {loading ? (
            <div className="h-32 flex items-center justify-center text-gray-400 text-sm">Loading…</div>
          ) : daily.every(d => d.calls === 0) ? (
            <div className="h-32 flex flex-col items-center justify-center gap-2">
              <p className="text-gray-400 text-sm">No traffic yet</p>
              <p className="text-gray-300 text-xs">Send requests through your gateway to see data here</p>
            </div>
          ) : (
            <>
              <div className="flex items-end gap-2 h-32">
                {daily.map((d) => (
                  <div key={d.date} className="flex-1 flex flex-col items-center gap-1 group">
                    <div className="relative w-full">
                      <div
                        className="bg-indigo-500 hover:bg-indigo-400 rounded-t transition-colors w-full"
                        style={{ height: `${Math.max((d.calls / maxCalls) * 112, d.calls > 0 ? 4 : 0)}px` }}
                        title={`${d.calls} calls · ${d.errors} errors`}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                {daily.map(d => <span key={d.date}>{shortDate(d.date)}</span>)}
              </div>
            </>
          )}
        </div>

        {/* Per-key table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">API Key Usage — Today</h2>
            <span className="text-xs text-gray-400">
              {today?.activeKeys ?? 0} active / {today?.totalKeys ?? 0} total keys
            </span>
          </div>

          {loading ? (
            <div className="px-6 py-8 text-center text-gray-400 text-sm">Loading…</div>
          ) : keys.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <p className="text-gray-400 text-sm mb-2">No API keys yet</p>
              <Link href="/dashboard" className="text-indigo-600 text-sm hover:underline">
                Create your first key →
              </Link>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {['Key Name', 'Status', 'Calls', 'Avg Latency', 'Errors', 'Tokens'].map(h => (
                    <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {keys.map(k => (
                  <tr key={k.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{k.name}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                        k.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}>{k.status}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{k.callsToday.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {k.avgLatencyMs != null ? `${k.avgLatencyMs}ms` : '—'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {k.errorCount > 0
                        ? <span className="text-red-600 font-medium">{k.errorCount} ({k.errorRate}%)</span>
                        : <span className="text-gray-400">0</span>
                      }
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {k.tokensToday > 0 ? fmt(k.tokensToday) : <span className="text-gray-400">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  )
}
