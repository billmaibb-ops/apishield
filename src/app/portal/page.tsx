'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

type Backend = {
  id: string
  name: string
  url: string
  active: boolean
  description?: string
  type?: 'rest' | 'llm'
  llmProvider?: string
}

function CodeBlock({ code, lang = 'bash' }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="relative group">
      <pre className={`bg-gray-900 text-gray-100 rounded-xl p-4 text-xs overflow-x-auto font-mono leading-relaxed language-${lang}`}>
        {code}
      </pre>
      <button
        onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
        className="absolute top-3 right-3 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
        {copied ? '✓' : 'Copy'}
      </button>
    </div>
  )
}

export default function PortalPage() {
  const [backends, setBackends] = useState<Backend[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<string | null>(null)
  const [origin, setOrigin] = useState('https://your-app.vercel.app')

  useEffect(() => {
    setOrigin(window.location.origin)
    fetch('/api/backends')
      .then(r => r.json())
      .then(d => {
        const active = (d.backends || []).filter((b: Backend) => b.active)
        setBackends(active)
        if (active.length > 0) setSelected(active[0].id)
      })
      .finally(() => setLoading(false))
  }, [])

  const activeBackend = backends.find(b => b.id === selected)
  const gatewayBase = `${origin}/api/gateway`

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
            { label: '🔀 Backends', href: '/backends' },
            { label: '📈 Analytics', href: '/analytics' },
            { label: '🌐 Developer Portal', href: '/portal', active: true },
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
        {/* Backend selector */}
        {backends.length > 1 && (
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">Backend</div>
            <select
              value={selected ?? ''}
              onChange={e => setSelected(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-gray-700 focus:outline-none focus:border-indigo-400">
              {backends.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
        )}
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Developer Portal</h1>
          <p className="text-gray-500 text-sm">
            Auto-generated API documentation for your gateway endpoints.
          </p>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">Loading…</div>
        ) : backends.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
            <div className="text-4xl mb-3">🌐</div>
            <div className="font-medium text-gray-700 mb-1">No active backends yet</div>
            <div className="text-sm text-gray-500 mb-4">Add and activate a backend server to generate API docs</div>
            <Link href="/backends" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg inline-block">
              + Add Backend
            </Link>
          </div>
        ) : (
          <>
            {/* Overview */}
            <section className="mb-8">
              <div className="bg-gradient-to-br from-indigo-900 to-indigo-700 rounded-2xl p-6 text-white">
                <div className="text-xs font-semibold uppercase tracking-widest text-indigo-300 mb-2">Gateway Base URL</div>
                <div className="font-mono text-lg break-all mb-4 text-white">{gatewayBase}</div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="bg-indigo-800/50 rounded-xl p-3">
                    <div className="text-indigo-300 text-xs mb-1">Authentication</div>
                    <div className="font-medium">API Key or JWT</div>
                  </div>
                  <div className="bg-indigo-800/50 rounded-xl p-3">
                    <div className="text-indigo-300 text-xs mb-1">Rate Limiting</div>
                    <div className="font-medium">Per key, per minute</div>
                  </div>
                  <div className="bg-indigo-800/50 rounded-xl p-3">
                    <div className="text-indigo-300 text-xs mb-1">Protocols</div>
                    <div className="font-medium">REST · GraphQL · WS</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Authentication */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Authentication</h2>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded">Method 1</span>
                    <span className="font-medium text-gray-900">API Key — Query Parameter</span>
                  </div>
                  <CodeBlock code={`curl "${gatewayBase}/your/path?api_key=sk_live_YOUR_KEY"`} />
                </div>
                <div className="p-5 border-b border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded">Method 2</span>
                    <span className="font-medium text-gray-900">API Key — Header</span>
                  </div>
                  <CodeBlock code={`curl "${gatewayBase}/your/path" \\\n  -H "X-API-Key: sk_live_YOUR_KEY"`} />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-0.5 rounded">Method 3</span>
                    <span className="font-medium text-gray-900">JWT — Bearer Token (HS256)</span>
                    <span className="text-xs text-gray-400">when key authType = jwt</span>
                  </div>
                  <CodeBlock code={`curl "${gatewayBase}/your/path" \\\n  -H "X-API-Key: sk_live_YOUR_KEY" \\\n  -H "Authorization: Bearer YOUR_JWT_TOKEN"`} />
                </div>
              </div>
            </section>

            {/* Active backend docs */}
            {activeBackend && (
              <section className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">{activeBackend.name}</h2>
                  {activeBackend.type === 'llm' && (
                    <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2 py-0.5 rounded">AI / LLM</span>
                  )}
                  <span className="text-sm text-gray-400 font-mono">{activeBackend.url}</span>
                </div>
                {activeBackend.description && (
                  <p className="text-gray-600 text-sm mb-5">{activeBackend.description}</p>
                )}

                {/* REST examples */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">curl</h3>
                    <CodeBlock code={`# GET request\ncurl "${gatewayBase}/users" \\\n  -H "X-API-Key: sk_live_YOUR_KEY"\n\n# POST with JSON body\ncurl -X POST "${gatewayBase}/users" \\\n  -H "X-API-Key: sk_live_YOUR_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{"name": "Alice", "email": "alice@example.com"}'`} />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">JavaScript / TypeScript</h3>
                    <CodeBlock lang="javascript" code={`const GATEWAY = "${gatewayBase}";
const API_KEY = "sk_live_YOUR_KEY";

// GET
const res = await fetch(\`\${GATEWAY}/users\`, {
  headers: { "X-API-Key": API_KEY },
});
const data = await res.json();

// POST
const created = await fetch(\`\${GATEWAY}/users\`, {
  method: "POST",
  headers: {
    "X-API-Key": API_KEY,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ name: "Alice" }),
});`} />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Python</h3>
                    <CodeBlock lang="python" code={`import requests

GATEWAY = "${gatewayBase}"
API_KEY = "sk_live_YOUR_KEY"
HEADERS = {"X-API-Key": API_KEY}

# GET
res = requests.get(f"{GATEWAY}/users", headers=HEADERS)
print(res.json())

# POST
res = requests.post(
    f"{GATEWAY}/users",
    headers={**HEADERS, "Content-Type": "application/json"},
    json={"name": "Alice"},
)
print(res.json())`} />
                  </div>

                  {/* GraphQL */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">GraphQL</h3>
                    <CodeBlock code={`curl -X POST "${gatewayBase}/graphql" \\\n  -H "X-API-Key: sk_live_YOUR_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "query": "{ users { id name email } }"\n  }'`} />
                  </div>

                  {/* WebSocket */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">WebSocket</h3>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-3 text-sm text-amber-800">
                      <strong>Note:</strong> Serverless gateways cannot hold persistent WebSocket connections.
                      Call the gateway endpoint with an <code className="bg-amber-100 px-1 rounded">Upgrade: websocket</code> header
                      to validate your key and receive the direct backend WebSocket URL.
                    </div>
                    <CodeBlock lang="javascript" code={`// 1. Get the validated WS URL from the gateway
const res = await fetch(\`${gatewayBase}/ws\`, {
  headers: {
    "X-API-Key": "sk_live_YOUR_KEY",
    "Upgrade": "websocket",
  },
});
const { wsUrl } = await res.json(); // status 426 with wsUrl

// 2. Connect directly to the backend WS
const socket = new WebSocket(wsUrl);
socket.onmessage = (e) => console.log(e.data);`} />
                  </div>

                  {/* LLM-specific */}
                  {activeBackend.type === 'llm' && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">
                        AI / LLM — OpenAI-compatible
                        {activeBackend.llmProvider && (
                          <span className="ml-2 text-gray-400 font-normal">{activeBackend.llmProvider}</span>
                        )}
                      </h3>
                      <CodeBlock lang="python" code={`import openai

# Point the SDK at your APIShield gateway
client = openai.OpenAI(
    api_key="sk_live_YOUR_KEY",          # Your APIShield key
    base_url="${gatewayBase}",           # Gateway as base URL
    default_headers={"X-API-Key": "sk_live_YOUR_KEY"},
)

completion = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello!"}],
)
print(completion.choices[0].message.content)`} />
                      <p className="text-xs text-gray-500 mt-2">
                        Token usage is automatically tracked — visible in Analytics.
                      </p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Rate limit response headers */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Response Headers</h2>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Header</th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {[
                      ['X-RateLimit-Limit', 'Max requests per minute for this key'],
                      ['X-RateLimit-Remaining', 'Requests left in the current window'],
                      ['X-RateLimit-Reset', 'Unix ms when the window resets'],
                      ['X-Response-Time', 'Gateway latency in milliseconds'],
                      ['X-Proxied-By', 'Always APIShield'],
                    ].map(([h, d]) => (
                      <tr key={h} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-indigo-700 text-xs">{h}</td>
                        <td className="px-4 py-3 text-gray-600">{d}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Error codes */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Error Codes</h2>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3 w-20">Code</th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Meaning</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {[
                      ['401', 'Missing or invalid API key / expired JWT'],
                      ['403', 'Key revoked or IP not in allowlist'],
                      ['413', 'Request body exceeds size policy'],
                      ['426', 'WebSocket upgrade — wsUrl provided in body'],
                      ['429', 'Rate limit exceeded — retry after X-RateLimit-Reset'],
                      ['502', 'Backend unreachable'],
                      ['503', 'Backend inactive or Redis not configured'],
                    ].map(([code, msg]) => (
                      <tr key={code} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded ${
                            code.startsWith('4') ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                          }`}>{code}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{msg}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  )
}
