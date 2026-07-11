import Link from 'next/link'

export const metadata = {
  title: 'APIShield vs Zuplo — API Gateway Comparison 2026',
  description: 'APIShield vs Zuplo: honest feature-by-feature comparison. Starts free, no per-request overage fees, built-in LLM token tracking.',
}

const rows = [
  { feature: 'Free tier',             apishield: '✓ $0 forever',             zuplo: '✓ 1M req/mo' },
  { feature: 'Paid tier starts at',   apishield: '$19/mo flat',               zuplo: '$25/mo + per-request overage' },
  { feature: 'Deploy model',          apishield: 'Vercel (zero-ops)',          zuplo: 'Zuplo cloud' },
  { feature: 'Setup time',            apishield: '5 minutes',                  zuplo: '10–20 minutes' },
  { feature: 'API key auth',          apishield: '✓',                          zuplo: '✓' },
  { feature: 'JWT auth (HS256)',       apishield: '✓',                          zuplo: '✓' },
  { feature: 'Rate limiting',         apishield: '✓ per-minute, per-key',     zuplo: '✓' },
  { feature: 'LLM token tracking',    apishield: '✓ OpenAI + Anthropic',      zuplo: '✗' },
  { feature: 'LLM cost estimation',   apishield: '✓ $/M tokens inline',       zuplo: '✗' },
  { feature: 'Real-time analytics',   apishield: '✓ auto-refreshes 60s',      zuplo: '✓' },
  { feature: 'Developer portal',      apishield: '✓ included',                 zuplo: '✓ included' },
  { feature: 'RBAC / roles',          apishield: '✗ (roadmap)',                zuplo: '✓' },
  { feature: 'Custom domains',        apishield: 'via Vercel',                 zuplo: '2 on paid' },
  { feature: 'SLA uptime guarantee',  apishield: '✗ (inherits Vercel 99.99%)', zuplo: '✓ Enterprise' },
  { feature: 'Open source',           apishield: '✓ MIT',                      zuplo: '✗ closed' },
  { feature: 'Self-hostable',         apishield: '✓ fork & deploy',            zuplo: '✗' },
  { feature: 'GraphQL support',       apishield: '✓ passthrough',              zuplo: '✓' },
  { feature: 'WebSocket support',     apishield: '✓ passthrough',              zuplo: '✓' },
  { feature: 'IP allowlist',          apishield: '✓',                          zuplo: '✓' },
]

const shield = (v: string) => v === '✓' || v.startsWith('✓')
const bad    = (v: string) => v === '✗' || v.startsWith('✗')

export default function VsZuplo() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-gray-900 text-lg">🛡️ APIShield</Link>
        <Link href="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          Start free →
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full mb-4">
            API Gateway Comparison 2026
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">APIShield vs Zuplo</h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Both start free. The difference: APIShield is open-source, self-hostable, and the only gateway with built-in LLM token cost tracking.
          </p>
        </div>

        {/* Score cards */}
        <div className="grid grid-cols-2 gap-6 mb-12">
          {[
            {
              name: '🛡️ APIShield',
              tagline: 'Zero-ops, open-source, LLM-aware',
              price: 'Free → $19/mo',
              pros: ['MIT open source — fork & self-host', 'LLM token + cost tracking built in', 'Deploy on your Vercel account', '5-minute setup'],
              cons: ['No RBAC yet', 'No uptime SLA (inherits Vercel)'],
              cta: true,
            },
            {
              name: 'Zuplo',
              tagline: 'Developer-friendly, good docs',
              price: 'Free → $25/mo + overages',
              pros: ['Strong documentation', 'Good RBAC + audit logs', 'Uptime SLA on Enterprise'],
              cons: ['Closed source', 'Per-request overages add up', 'No LLM cost tracking', 'No self-hosting'],
              cta: false,
            },
          ].map(c => (
            <div key={c.name} className={`rounded-xl border p-6 ${c.cta ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200'}`}>
              <div className="font-bold text-gray-900 text-lg mb-1">{c.name}</div>
              <div className="text-gray-500 text-sm mb-2">{c.tagline}</div>
              <div className="text-indigo-600 font-semibold text-sm mb-4">{c.price}</div>
              <ul className="space-y-1 mb-4">
                {c.pros.map(p => <li key={p} className="text-sm text-gray-700 flex gap-2"><span className="text-green-500">✓</span>{p}</li>)}
                {c.cons.map(p => <li key={p} className="text-sm text-gray-400 flex gap-2"><span className="text-gray-300">✗</span>{p}</li>)}
              </ul>
              {c.cta && (
                <Link href="/login" className="block text-center bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                  Start free with APIShield →
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Comparison table */}
        <h2 className="text-xl font-bold text-gray-900 mb-4">Feature-by-feature comparison</h2>
        <div className="rounded-xl border border-gray-200 overflow-hidden mb-16">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3 w-1/3">Feature</th>
                <th className="text-left text-xs font-medium text-indigo-600 uppercase px-4 py-3 w-1/3">🛡️ APIShield</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3 w-1/3">Zuplo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map(r => (
                <tr key={r.feature} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-700">{r.feature}</td>
                  <td className={`px-4 py-3 text-sm font-medium ${shield(r.apishield) ? 'text-green-600' : bad(r.apishield) ? 'text-gray-300' : 'text-gray-700'}`}>
                    {r.apishield}
                  </td>
                  <td className={`px-4 py-3 text-sm ${shield(r.zuplo) ? 'text-gray-600' : bad(r.zuplo) ? 'text-red-400' : 'text-gray-500'}`}>
                    {r.zuplo}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom CTA */}
        <div className="text-center bg-indigo-50 rounded-2xl p-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Start free in 5 minutes</h2>
          <p className="text-gray-500 mb-6">No credit card. No YAML. Deploy to Vercel, get a gateway URL, start routing traffic.</p>
          <Link href="/login" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Try APIShield free →
          </Link>
        </div>
      </div>
    </div>
  )
}
