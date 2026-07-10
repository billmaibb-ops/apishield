'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

type Backend = {
  id: string
  name: string
  url: string
  stripPrefix?: string
  active: boolean
  createdAt: string
  description?: string
}

export default function BackendsPage() {
  const [backends, setBackends] = useState<Backend[]>([])
  const [loading, setLoading] = useState(true)
  const [configured, setConfigured] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', url: '', description: '' })
  const [saving, setSaving] = useState(false)

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/backends')
      const data = await res.json()
      setConfigured(data.configured ?? true)
      setBackends(data.backends || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function createBackend() {
    if (!form.name.trim() || !form.url.trim()) return
    setSaving(true)
    try {
      const res = await fetch('/api/backends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const err = await res.json()
        showToast(`Error: ${err.error}`)
        return
      }
      setForm({ name: '', url: '', description: '' })
      setShowCreate(false)
      await load()
      showToast('Backend added!')
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive(b: Backend) {
    await fetch(`/api/backends/${b.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !b.active }),
    })
    await load()
    showToast(b.active ? 'Backend deactivated' : 'Backend activated')
  }

  async function deleteBackend(id: string) {
    if (!confirm('Delete this backend? Keys pointing to it will stop proxying.')) return
    await fetch(`/api/backends/${id}`, { method: 'DELETE' })
    await load()
    showToast('Backend deleted')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <Link href="/" className="text-gray-900 font-bold text-lg">🛡️ APIShield</Link>
        </div>
        <nav className="p-4 flex-1 space-y-1">
          {[
            { label: '📊 Dashboard', href: '/dashboard' },
            { label: '🔑 API Keys', href: '/dashboard' },
            { label: '🔀 Backends', href: '/backends', active: true },
            { label: '📈 Analytics', href: '/analytics' },
            { label: '📖 Docs', href: '/docs' },
            { label: '💰 Pricing', href: '/pricing' },
            { label: '⚙️ Settings', href: '#' },
          ].map(item => (
            <Link key={item.label} href={item.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                item.active ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-100'
              }`}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <div className="bg-indigo-50 rounded-lg p-3 text-xs text-indigo-700">
            <div className="font-medium mb-1">Free Plan</div>
            <Link href="/pricing" className="text-indigo-600 font-medium hover:underline">Upgrade to Growth ($19/mo) →</Link>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8">
        {toast && (
          <div className="fixed top-6 right-6 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-lg text-sm z-50">
            ✓ {toast}
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Backend Servers</h1>
            <p className="text-gray-500 text-sm mt-1">
              Configure the upstream APIs that APIShield proxies requests to
            </p>
          </div>
          <button onClick={() => setShowCreate(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            + Add Backend
          </button>
        </div>

        {/* Redis not configured */}
        {!configured && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <div className="text-2xl">⚠️</div>
              <div>
                <div className="font-semibold text-amber-900 mb-1">Redis not configured</div>
                <div className="text-sm text-amber-700 mb-3">
                  Backends are stored in Redis. Set up a free Upstash instance to get started.
                </div>
                <ol className="text-sm text-amber-700 space-y-1 list-decimal list-inside">
                  <li>Go to <a href="https://upstash.com" target="_blank" rel="noopener" className="underline">upstash.com</a> → create a free Redis database</li>
                  <li>Copy the <strong>REST URL</strong> and <strong>REST Token</strong></li>
                  <li>Add to Vercel: <code className="bg-amber-100 px-1 rounded">UPSTASH_REDIS_REST_URL</code> and <code className="bg-amber-100 px-1 rounded">UPSTASH_REDIS_REST_TOKEN</code></li>
                  <li>Redeploy</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* How it works */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6 text-sm text-indigo-800">
          <strong>How backends work:</strong> Add your API's base URL here (e.g. <code className="bg-indigo-100 px-1 rounded">https://api.myservice.com</code>).
          Then create API keys that point to this backend. When users call{' '}
          <code className="bg-indigo-100 px-1 rounded">/api/gateway/users?api_key=sk_live_xxx</code>,
          APIShield validates the key, enforces rate limits, and forwards to{' '}
          <code className="bg-indigo-100 px-1 rounded">https://api.myservice.com/users</code>.
        </div>

        {/* Create form */}
        {showCreate && (
          <div className="bg-white rounded-xl border border-indigo-200 p-6 mb-6">
            <h2 className="font-semibold text-gray-900 mb-4">Add Backend Server</h2>
            <div className="grid gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Name</label>
                  <input
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Production API"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Base URL</label>
                  <input
                    value={form.url}
                    onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                    placeholder="https://api.myservice.com"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Description (optional)</label>
                <input
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="What does this backend serve?"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={createBackend}
                  disabled={saving || !form.name.trim() || !form.url.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors">
                  {saving ? 'Adding…' : 'Add Backend'}
                </button>
                <button onClick={() => setShowCreate(false)} className="text-gray-500 hover:text-gray-700 text-sm py-2 px-3">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Backend list */}
        {loading ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
            Loading backends…
          </div>
        ) : backends.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
            <div className="text-4xl mb-3">🔀</div>
            <div className="font-medium text-gray-700 mb-1">No backends yet</div>
            <div className="text-sm text-gray-500 mb-4">Add your first backend to start routing API traffic</div>
            <button onClick={() => setShowCreate(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg">
              + Add Backend
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {backends.map(b => (
              <div key={b.id} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-semibold text-gray-900">{b.name}</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        b.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {b.active ? '● Active' : '○ Inactive'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="text-sm text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-mono">{b.url}</code>
                    </div>
                    {b.description && (
                      <div className="text-sm text-gray-500 mt-1">{b.description}</div>
                    )}
                    <div className="text-xs text-gray-400 mt-2">
                      ID: <span className="font-mono">{b.id}</span> · Added {new Date(b.createdAt).toLocaleDateString()}
                    </div>
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1 font-medium">Example gateway call:</div>
                      <code className="text-xs text-gray-700 break-all">
                        {typeof window !== 'undefined' ? window.location.origin : 'https://apishield.vercel.app'}/api/gateway/your-path?api_key=sk_live_xxx
                        <span className="text-gray-400"> → forwards to: {b.url}/your-path</span>
                      </code>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                    <button
                      onClick={() => toggleActive(b)}
                      className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                        b.active
                          ? 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                          : 'bg-green-50 hover:bg-green-100 text-green-700'
                      }`}>
                      {b.active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => deleteBackend(b.id)}
                      className="text-xs font-medium px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
