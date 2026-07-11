'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

type KeyMeta = { id: string; name: string; status: string }
type LogEntry = { ts: number; status: number; ms: number; method: string; path: string }

function statusColor(s: number) {
  if (s >= 500 || s === 0) return 'text-red-700 bg-red-50'
  if (s >= 400) return 'text-amber-700 bg-amber-50'
  return 'text-green-700 bg-green-50'
}

function latColor(ms: number) {
  if (ms > 1000) return 'text-red-600'
  if (ms > 400) return 'text-amber-600'
  return 'text-green-600'
}

function fmt(ts: number) {
  return new Date(ts).toLocaleString(undefined, {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  })
}

export default function LogsPage() {
  const searchParams = useSearchParams()
  const [keys, setKeys] = useState<KeyMeta[]>([])
  const [selectedKey, setSelectedKey] = useState<string>(searchParams.get('keyId') || '')
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

  // Load key list
  useEffect(() => {
    fetch('/api/logs').then(r => r.json()).then(d => {
      setKeys(d.keys || [])
      if (!selectedKey && d.keys?.length) setSelectedKey(d.keys[0].id)
    })
  }, [])

  const fetchLogs = useCallback(async (keyId: string) => {
    if (!keyId) return
    setLoading(true)
    try {
      const res = await fetch(`/api/logs?keyId=${keyId}&limit=50`)
      const data = await res.json()
      setLogs(data.logs || [])
      setLastRefresh(new Date())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (selectedKey) fetchLogs(selectedKey)
  }, [selectedKey, fetchLogs])

  // Auto-refresh every 15s
  useEffect(() => {
    if (!selectedKey) return
    const id = setInterval(() => fetchLogs(selectedKey), 15_000)
    return () => clearInterval(id)
  }, [selectedKey, fetchLogs])

  const selectedName = keys.find(k => k.id === selectedKey)?.name || 'Select a key'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-700 text-sm">← Dashboard</Link>
            <span className="text-gray-300">/</span>
            <h1 className="text-gray-900 font-semibold">Request Logs</h1>
          </div>
          <div className="flex items-center gap-3">
            {lastRefresh && (
              <span className="text-xs text-gray-400">
                Updated {lastRefresh.toLocaleTimeString()} · auto-refreshes every 15s
              </span>
            )}
            <button
              onClick={() => fetchLogs(selectedKey)}
              disabled={loading || !selectedKey}
              className="text-sm text-indigo-600 hover:text-indigo-700 disabled:opacity-40"
            >
              {loading ? 'Loading…' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Key selector */}
        <div className="flex items-center gap-4 mb-6">
          <label className="text-sm font-medium text-gray-700">API Key</label>
          {keys.length === 0 ? (
            <span className="text-sm text-gray-500">
              No keys yet —{' '}
              <Link href="/dashboard" className="text-indigo-600 hover:underline">create one</Link>
            </span>
          ) : (
            <select
              value={selectedKey}
              onChange={e => setSelectedKey(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {keys.map(k => (
                <option key={k.id} value={k.id}>
                  {k.name} {k.status === 'revoked' ? '(revoked)' : ''}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Logs table */}
        {!selectedKey ? null : loading && logs.length === 0 ? (
          <div className="text-center py-20 text-gray-400">Loading logs…</div>
        ) : logs.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">📭</div>
            <p className="text-gray-500 font-medium">No requests yet for <span className="font-semibold text-gray-700">{selectedName}</span></p>
            <p className="text-sm text-gray-400 mt-1">Logs appear within seconds of the first proxied request.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Last {logs.length} requests — <span className="text-gray-500">{selectedName}</span>
              </span>
              <span className="text-xs text-gray-400">Showing up to 50 · capped at 200 stored</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    <th className="text-left px-4 py-3">Time</th>
                    <th className="text-left px-4 py-3">Method</th>
                    <th className="text-left px-4 py-3">Path</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-left px-4 py-3">Latency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {logs.map((log, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap font-mono text-xs">
                        {fmt(log.ts)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs font-semibold text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded">
                          {log.method}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-600 max-w-xs truncate">
                        /{log.path}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center font-mono text-xs font-semibold px-2 py-0.5 rounded-full ${statusColor(log.status)}`}>
                          {log.status === 0 ? 'ERR' : log.status}
                        </span>
                      </td>
                      <td className={`px-4 py-3 font-mono text-xs font-semibold ${latColor(log.ms)}`}>
                        {log.ms}ms
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
