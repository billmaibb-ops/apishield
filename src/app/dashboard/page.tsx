'use client'
import { useState, useEffect, useCallback } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

type ApiKey = {
  id: string
  name: string
  key: string
  status: 'active' | 'revoked'
  rateLimit: number
  backendId: string
  createdAt: string
  callsToday: number
  tokensToday?: number
  authType?: 'api_key' | 'jwt'
}

type Backend = {
  id: string
  name: string
  url: string
  active: boolean
}

function maskKey(key: string): string {
  return key.slice(0, 14) + '••••' + key.slice(-4)
}

interface OnboardingProps {
  hasBackend: boolean
  hasKey: boolean
  hasCalls: boolean
  gatewayKey: string | null
  origin: string
  onCreateKey: () => void
}

function OnboardingChecklist({ hasBackend, hasKey, hasCalls, gatewayKey, origin, onCreateKey }: OnboardingProps) {
  const [copied, setCopied] = useState(false)
  const allDone = hasBackend && hasKey && hasCalls

  if (allDone) return null

  const curlCmd = gatewayKey
    ? `curl ${origin}/api/gateway/get \\\n  -H "Authorization: Bearer ${gatewayKey}"`
    : null

  const steps = [
    {
      n: 1,
      done: hasBackend,
      title: 'Add a backend',
      desc: 'Tell APIShield where to proxy your traffic — any REST API or LLM endpoint.',
      action: <Link href="/backends" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">Add backend →</Link>,
    },
    {
      n: 2,
      done: hasKey,
      title: 'Create an API key',
      desc: 'Generate a key to authenticate requests through the gateway.',
      action: hasBackend
        ? <button onClick={onCreateKey} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">Create key →</button>
        : <span className="text-sm text-gray-400">Add a backend first</span>,
    },
    {
      n: 3,
      done: hasCalls,
      title: 'Send your first request',
      desc: 'Route a real request through the gateway and watch analytics populate.',
      action: curlCmd ? (
        <div className="mt-2">
          <div className="bg-gray-900 rounded-lg p-3 font-mono text-xs text-green-400 whitespace-pre">{curlCmd}</div>
          <button
            onClick={() => { navigator.clipboard.writeText(curlCmd.replace(/\\\n  /g, ' ')); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
            className="text-xs text-gray-500 hover:text-gray-700 mt-1">
            {copied ? '✓ Copied' : 'Copy command'}
          </button>
        </div>
      ) : <span className="text-sm text-gray-400">Complete steps 1 & 2 first</span>,
    },
  ]

  const doneCount = [hasBackend, hasKey, hasCalls].filter(Boolean).length

  return (
    <div className="bg-white border border-indigo-200 rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-semibold text-gray-900">Getting started</h2>
          <p className="text-xs text-gray-500 mt-0.5">{doneCount} of 3 steps complete</p>
        </div>
        <div className="flex gap-1">
          {[1,2,3].map(i => (
            <div key={i} className={`h-1.5 w-12 rounded-full ${i <= doneCount ? 'bg-indigo-500' : 'bg-gray-200'}`} />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        {steps.map((s) => (
          <div key={s.n} className={`flex gap-3 p-3 rounded-lg ${s.done ? 'bg-green-50' : 'bg-gray-50'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
              s.done ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {s.done ? '✓' : s.n}
            </div>
            <div className="flex-1 min-w-0">
              <div className={`text-sm font-medium ${s.done ? 'text-green-700 line-through' : 'text-gray-900'}`}>{s.title}</div>
              {!s.done && (
                <>
                  <div className="text-xs text-gray-500 mt-0.5">{s.desc}</div>
                  <div className="mt-1.5">{s.action}</div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [backends, setBackends] = useState<Backend[]>([])
  const [loading, setLoading] = useState(true)
  const [configured, setConfigured] = useState(true)
  const [totalCallsToday, setTotalCallsToday] = useState(0)
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newLimit, setNewLimit] = useState('1000')
  const [newBackendId, setNewBackendId] = useState('')
  const [newAuthType, setNewAuthType] = useState<'api_key' | 'jwt'>('api_key')
  const [newJwtSecret, setNewJwtSecret] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [testResults, setTestResults] = useState<Record<string, { status: number; ms: number } | 'loading'>>({})
  const [toast, setToast] = useState<string | null>(null)
  const [origin, setOrigin] = useState('https://apishield.vercel.app')

  useEffect(() => { setOrigin(window.location.origin) }, [])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [keysRes, backendsRes, analyticsRes] = await Promise.all([
        fetch('/api/keys'),
        fetch('/api/backends'),
        fetch('/api/analytics'),
      ])
      const keysData = await keysRes.json()
      const backendsData = await backendsRes.json()
      const analyticsData = await analyticsRes.json()

      const isConfigured = keysData.configured ?? false
      setConfigured(isConfigured)

      if (isConfigured) {
        setBackends(backendsData.backends || [])
        setTotalCallsToday(analyticsData.today?.totalCalls || 0)
        // Merge tokensToday from keyStats into key rows
        const statsById: Record<string, number> = {}
        for (const ks of analyticsData.keyStats ?? []) {
          statsById[ks.id] = ks.tokensToday ?? 0
        }
        setKeys(prev => (keysData.keys || []).map((k: ApiKey) => ({ ...k, tokensToday: statsById[k.id] ?? 0 })))
      }
    } catch {
      setConfigured(false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const createKey = async () => {
    if (!newName.trim() || !newBackendId) return
    if (newAuthType === 'jwt' && !newJwtSecret.trim()) { showToast('JWT secret is required'); return }
    try {
      const res = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName.trim(),
          rateLimit: parseInt(newLimit) || 1000,
          backendId: newBackendId,
          authType: newAuthType,
          jwtSecret: newAuthType === 'jwt' ? newJwtSecret.trim() : undefined,
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        showToast(`Error: ${err.error}`)
        return
      }
      setNewName('')
      setNewLimit('1000')
      setNewBackendId('')
      setNewAuthType('api_key')
      setNewJwtSecret('')
      setShowCreate(false)
      await loadData()
      showToast('API key created!')
    } catch {
      showToast('Failed to create key')
    }
  }

  const toggleStatus = async (k: ApiKey) => {
    const newStatus = k.status === 'active' ? 'revoked' : 'active'
    await fetch(`/api/keys/${k.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    await loadData()
    showToast(newStatus === 'active' ? 'Key activated' : 'Key revoked')
  }

  const copyKey = (k: ApiKey) => {
    navigator.clipboard.writeText(k.key)
    setCopiedId(k.id)
    showToast('API key copied to clipboard!')
    setTimeout(() => setCopiedId(null), 2000)
  }

  const deleteKey = async (id: string) => {
    if (!confirm('Delete this API key? This cannot be undone.')) return
    await fetch(`/api/keys/${id}`, { method: 'DELETE' })
    await loadData()
    showToast('Key deleted')
  }

  const testKey = async (k: ApiKey) => {
    setTestResults(prev => ({ ...prev, [k.id]: 'loading' }))
    const t0 = Date.now()
    try {
      const res = await fetch('/api/gateway/get', {
        headers: { 'Authorization': `Bearer ${k.key}` },
      })
      setTestResults(prev => ({ ...prev, [k.id]: { status: res.status, ms: Date.now() - t0 } }))
    } catch {
      setTestResults(prev => ({ ...prev, [k.id]: { status: 0, ms: Date.now() - t0 } }))
    }
  }

  const activeCount = keys.filter(k => k.status === 'active').length
  const revokedCount = keys.filter(k => k.status === 'revoked').length
  const firstActiveKey = keys.find(k => k.status === 'active')
  const hasCalls = totalCallsToday > 0 || keys.some(k => k.callsToday > 0)

  // ─── Redis not configured: setup banner ─────────────────────────────────
  const SetupBanner = () => (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
      <div className="flex items-start gap-3">
        <div className="text-2xl">🔧</div>
        <div>
          <div className="font-semibold text-amber-900 mb-2">Connect Redis to activate the gateway</div>
          <p className="text-sm text-amber-700 mb-4">
            APIShield uses Upstash Redis to store API keys and track rate limits. Set up a free instance in 2 minutes:
          </p>
          <ol className="text-sm text-amber-700 space-y-2 list-decimal list-inside mb-4">
            <li>Go to <a href="https://upstash.com" target="_blank" rel="noopener" className="underline font-medium">upstash.com</a> → Create a free Redis database (no CC required)</li>
            <li>Click <strong>REST API</strong> tab → copy <code className="bg-amber-100 px-1 rounded text-xs">UPSTASH_REDIS_REST_URL</code> and <code className="bg-amber-100 px-1 rounded text-xs">UPSTASH_REDIS_REST_TOKEN</code></li>
            <li>In Vercel → your project → <strong>Settings → Environment Variables</strong> → paste both values</li>
            <li>Redeploy: <code className="bg-amber-100 px-1 rounded text-xs">git commit --allow-empty -m &quot;add redis env&quot; &amp;&amp; git push</code></li>
          </ol>
          <div className="text-xs text-amber-600 bg-amber-100 rounded-lg p-3 font-mono">
            <div>UPSTASH_REDIS_REST_URL=https://&lt;your-db&gt;.upstash.io</div>
            <div>UPSTASH_REDIS_REST_TOKEN=AY&lt;your-token&gt;</div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <Link href="/" className="text-gray-900 font-bold text-lg">🛡️ APIShield</Link>
        </div>
        <nav className="p-4 flex-1 space-y-1">
          {[
            { label: '📊 Dashboard', href: '/dashboard', active: true },
            { label: '🔑 API Keys', href: '/dashboard' },
            { label: '🔀 Backends', href: '/backends' },
            { label: '📈 Analytics', href: '/analytics' },
            { label: '🌐 Developer Portal', href: '/portal' },
            { label: '📖 Docs', href: '/docs' },
            { label: '💰 Pricing', href: '/pricing' },
          ].map(item => (
            <Link key={item.label} href={item.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                item.active ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-100'
              }`}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200 space-y-3">
          {session?.user && (
            <div className="flex items-center gap-2 px-1">
              {session.user.image && (
                <img src={session.user.image} alt="" className="w-7 h-7 rounded-full" />
              )}
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-gray-900 truncate">{session.user.name}</div>
                <div className="text-xs text-gray-400 truncate">{session.user.email}</div>
              </div>
              <button onClick={() => signOut({ callbackUrl: '/login' })} className="text-gray-400 hover:text-gray-600 text-xs flex-shrink-0" title="Sign out">⏻</button>
            </div>
          )}
          <div className={`rounded-lg p-3 text-xs ${configured ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
            <div className="font-medium mb-1">{configured ? '● Gateway Active' : '○ Gateway Offline'}</div>
            {configured ? (
              <>
                <div className="text-green-500">{totalCallsToday.toLocaleString()} calls today</div>
                <Link href="/pricing" className="text-green-600 font-medium hover:underline mt-1 block">Upgrade to Growth ($19/mo) →</Link>
              </>
            ) : (
              <div className="text-amber-600">Connect Redis to activate →</div>
            )}
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8">
        {toast && (
          <div className="fixed top-6 right-6 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-lg text-sm z-50 transition-all">
            ✓ {toast}
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">API Keys</h1>
            <p className="text-gray-500 text-sm mt-1">Manage keys and monitor gateway traffic</p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            disabled={!configured || backends.length === 0}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            + Create API Key
          </button>
        </div>

        {/* Setup banner when Redis not configured */}
        {!configured && !loading && <SetupBanner />}

        {/* Onboarding checklist */}
        {configured && !loading && (
          <OnboardingChecklist
            hasBackend={backends.length > 0}
            hasKey={keys.length > 0}
            hasCalls={hasCalls}
            gatewayKey={firstActiveKey?.key ?? null}
            origin={origin}
            onCreateKey={() => setShowCreate(true)}
          />
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Keys', value: loading ? '—' : keys.length, icon: '🔑' },
            { label: 'Active', value: loading ? '—' : activeCount, icon: '✅' },
            { label: 'Revoked', value: loading ? '—' : revokedCount, icon: '🚫' },
            { label: 'Calls Today', value: loading ? '—' : totalCallsToday.toLocaleString(), icon: '📊' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              <div className="text-gray-500 text-sm">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Gateway URL info */}
        {configured && (
          <div className="bg-gray-900 rounded-xl p-4 mb-6 text-sm">
            <div className="text-gray-400 mb-1 text-xs uppercase tracking-wide">Your Gateway URL</div>
            <div className="text-green-400 font-mono">
              {origin}/api/gateway/<span className="text-gray-400">{'{path}'}</span>
            </div>
            <div className="text-gray-500 text-xs mt-1">Auth: <span className="text-gray-300 font-mono">Authorization: Bearer sk_live_xxx</span> or <span className="text-gray-300 font-mono">X-API-Key: sk_live_xxx</span></div>
          </div>
        )}

        {/* Create form */}
        {showCreate && configured && (
          <div className="bg-white rounded-xl border border-indigo-200 p-6 mb-6">
            <h2 className="font-semibold text-gray-900 mb-4">Create New API Key</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Key Name</label>
                <input
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="e.g. Mobile App v2"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Rate Limit (req/min)</label>
                <input
                  value={newLimit}
                  onChange={e => setNewLimit(e.target.value)}
                  type="number"
                  placeholder="1000"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Backend</label>
                <select
                  value={newBackendId}
                  onChange={e => setNewBackendId(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500">
                  <option value="">Select backend…</option>
                  {backends.filter(b => b.active).map(b => (
                    <option key={b.id} value={b.id}>{b.name} — {b.url}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Auth Type</label>
                <select
                  value={newAuthType}
                  onChange={e => setNewAuthType(e.target.value as 'api_key' | 'jwt')}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500">
                  <option value="api_key">API Key only (default)</option>
                  <option value="jwt">API Key + JWT (HS256)</option>
                </select>
              </div>
              {newAuthType === 'jwt' && (
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">JWT Secret (HS256)</label>
                  <input
                    value={newJwtSecret}
                    onChange={e => setNewJwtSecret(e.target.value)}
                    placeholder="Your shared signing secret"
                    type="password"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={createKey}
                disabled={!newName.trim() || !newBackendId || (newAuthType === 'jwt' && !newJwtSecret.trim())}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors">
                Generate Key
              </button>
              <button onClick={() => setShowCreate(false)} className="text-gray-500 hover:text-gray-700 text-sm py-2 px-3">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Keys table */}
        {loading ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
            Loading…
          </div>
        ) : keys.length === 0 && configured ? (
          <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
            <div className="text-4xl mb-3">🔑</div>
            <div className="font-medium text-gray-700 mb-1">No API keys yet</div>
            <div className="text-sm text-gray-500 mb-4">
              {backends.length === 0
                ? 'Add a backend first, then create your first API key'
                : 'Create your first API key to start using the gateway'
              }
            </div>
            {backends.length > 0 && (
              <button onClick={() => setShowCreate(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg">
                + Create API Key
              </button>
            )}
          </div>
        ) : keys.length > 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Name', 'API Key', 'Backend', 'Status', 'Rate Limit', 'Calls Today', 'Est. Cost', 'Test', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {keys.map(k => {
                  const backend = backends.find(b => b.id === k.backendId)
                  return (
                    <tr key={k.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">{k.name}</td>
                      <td className="px-4 py-4 text-sm font-mono text-gray-600">{maskKey(k.key)}</td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {backend ? (
                          <span title={backend.url} className="truncate max-w-[120px] block">{backend.name}</span>
                        ) : <span className="text-red-400">—</span>}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          k.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {k.status === 'active' ? '● Active' : '● Revoked'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">{k.rateLimit.toLocaleString()}/min</td>
                      <td className="px-4 py-4 text-sm text-gray-900 font-medium">{k.callsToday.toLocaleString()}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {(k.tokensToday ?? 0) > 0
                          ? `$${((k.tokensToday! / 1_000_000) * 2).toFixed(4)}`
                          : <span className="text-gray-300">—</span>
                        }
                      </td>
                      <td className="px-4 py-4">
                        {k.status === 'active' ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => testKey(k)}
                              disabled={testResults[k.id] === 'loading'}
                              className="text-xs font-medium text-indigo-600 hover:text-indigo-800 disabled:opacity-50">
                              {testResults[k.id] === 'loading' ? '…' : 'Test'}
                            </button>
                            {testResults[k.id] && testResults[k.id] !== 'loading' && (() => {
                              const r = testResults[k.id] as { status: number; ms: number }
                              const ok = r.status >= 200 && r.status < 300
                              return (
                                <span className={`text-xs px-1.5 py-0.5 rounded font-mono ${ok ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                  {ok ? '✓' : '✗'} {r.status} · {r.ms}ms
                                </span>
                              )
                            })()}
                          </div>
                        ) : <span className="text-gray-300 text-xs">—</span>}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => copyKey(k)} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
                            {copiedId === k.id ? '✓' : 'Copy'}
                          </button>
                          <button onClick={() => toggleStatus(k)}
                            className={`text-xs font-medium transition-colors ${
                              k.status === 'active' ? 'text-red-500 hover:text-red-700' : 'text-green-600 hover:text-green-800'
                            }`}>
                            {k.status === 'active' ? 'Revoke' : 'Activate'}
                          </button>
                          <button onClick={() => deleteKey(k.id)} className="text-xs text-gray-400 hover:text-gray-600 font-medium">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : null}
      </main>
    </div>
  )
}
