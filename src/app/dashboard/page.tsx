'use client'
import { useState } from 'react'
import Link from 'next/link'

type ApiKey = {
  id: string
  name: string
  key: string
  status: 'active' | 'revoked'
  rateLimit: number
  created: string
  callsToday: number
}

const INITIAL_KEYS: ApiKey[] = [
  { id: '1', name: 'Production App', key: 'sk_live_a3f9b2c1d4e5', status: 'active', rateLimit: 1000, created: '2024-01-15', callsToday: 23847 },
  { id: '2', name: 'Mobile iOS', key: 'sk_live_b7e2c8f1a9d3', status: 'active', rateLimit: 500, created: '2024-02-03', callsToday: 15234 },
  { id: '3', name: 'Partner Integration', key: 'sk_live_c1d4e7f2b8a5', status: 'active', rateLimit: 2000, created: '2024-02-20', callsToday: 7891 },
  { id: '4', name: 'Staging Environment', key: 'sk_live_d5e8f1c2a4b7', status: 'active', rateLimit: 100, created: '2024-03-01', callsToday: 342 },
  { id: '5', name: 'Analytics Service', key: 'sk_live_e9f2d5c8b1a4', status: 'revoked', rateLimit: 300, created: '2024-01-01', callsToday: 0 },
]

function maskKey(key: string): string {
  return key.slice(0, 12) + '••••' + key.slice(-4)
}

function randomKey(): string {
  const chars = '0123456789abcdef'
  return 'sk_live_' + Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export default function DashboardPage() {
  const [keys, setKeys] = useState<ApiKey[]>(INITIAL_KEYS)
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newLimit, setNewLimit] = useState('1000')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const createKey = () => {
    if (!newName.trim()) return
    const newKey: ApiKey = {
      id: Math.random().toString(36).slice(2),
      name: newName.trim(),
      key: randomKey(),
      status: 'active',
      rateLimit: parseInt(newLimit) || 1000,
      created: new Date().toISOString().split('T')[0],
      callsToday: 0,
    }
    setKeys(prev => [newKey, ...prev])
    setNewName('')
    setNewLimit('1000')
    setShowCreate(false)
    showToast('API key created successfully!')
  }

  const toggleStatus = (id: string) => {
    setKeys(prev => prev.map(k => k.id === id ? { ...k, status: k.status === 'active' ? 'revoked' : 'active' } : k))
  }

  const copyKey = (k: ApiKey) => {
    navigator.clipboard.writeText(k.key)
    setCopiedId(k.id)
    showToast('API key copied to clipboard!')
    setTimeout(() => setCopiedId(null), 2000)
  }

  const totalCalls = keys.reduce((s, k) => s + k.callsToday, 0)
  const activeCount = keys.filter(k => k.status === 'active').length
  const revokedCount = keys.filter(k => k.status === 'revoked').length

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
            { label: '🔑 API Keys', href: '/dashboard', active: false },
            { label: '🔀 Backends', href: '/dashboard', active: false },
            { label: '📈 Analytics', href: '/analytics', active: false },
            { label: '📖 Docs', href: '/docs', active: false },
            { label: '💰 Pricing', href: '/pricing', active: false },
            { label: '⚙️ Settings', href: '#', active: false },
          ].map(item => (
            <Link key={item.label} href={item.href} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${item.active ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <div className="bg-indigo-50 rounded-lg p-3 text-xs text-indigo-700">
            <div className="font-medium mb-1">Free Plan</div>
            <div className="text-indigo-500">47,382 / 50,000 calls used</div>
            <div className="w-full bg-indigo-200 rounded-full h-1 my-1">
              <div className="bg-indigo-600 h-1 rounded-full" style={{ width: '94%' }}></div>
            </div>
            <Link href="/pricing" className="text-indigo-600 font-medium hover:underline">Upgrade to Growth ($19/mo) →</Link>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8">
        {/* Toast */}
        {toast && (
          <div className="fixed top-6 right-6 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-lg text-sm z-50 transition-all">
            ✓ {toast}
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">API Keys</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your API keys and access permissions</p>
          </div>
          <button onClick={() => setShowCreate(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            + Create API Key
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Keys', value: keys.length, icon: '🔑' },
            { label: 'Active', value: activeCount, icon: '✅' },
            { label: 'Revoked', value: revokedCount, icon: '🚫' },
            { label: 'Calls Today', value: totalCalls.toLocaleString(), icon: '📊' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              <div className="text-gray-500 text-sm">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Create form */}
        {showCreate && (
          <div className="bg-white rounded-xl border border-indigo-200 p-6 mb-6">
            <h2 className="font-semibold text-gray-900 mb-4">Create New API Key</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Key Name</label>
                <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Mobile App v2" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Rate Limit (req/min)</label>
                <input value={newLimit} onChange={e => setNewLimit(e.target.value)} type="number" placeholder="1000" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" />
              </div>
              <div className="flex items-end gap-3">
                <button onClick={createKey} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 rounded-lg transition-colors">Generate Key</button>
                <button onClick={() => setShowCreate(false)} className="text-gray-500 hover:text-gray-700 text-sm py-2 px-3">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Keys table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Name', 'API Key', 'Status', 'Rate Limit', 'Created', 'Calls Today', 'Actions'].map(h => (
                  <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {keys.map(k => (
                <tr key={k.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{k.name}</td>
                  <td className="px-4 py-4 text-sm font-mono text-gray-600">{maskKey(k.key)}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${k.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {k.status === 'active' ? '● Active' : '● Revoked'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">{k.rateLimit.toLocaleString()}/min</td>
                  <td className="px-4 py-4 text-sm text-gray-500">{k.created}</td>
                  <td className="px-4 py-4 text-sm text-gray-900 font-medium">{k.callsToday.toLocaleString()}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => copyKey(k)} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
                        {copiedId === k.id ? '✓' : 'Copy'}
                      </button>
                      <button onClick={() => toggleStatus(k.id)} className={`text-xs font-medium transition-colors ${k.status === 'active' ? 'text-red-500 hover:text-red-700' : 'text-green-600 hover:text-green-800'}`}>
                        {k.status === 'active' ? 'Revoke' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
