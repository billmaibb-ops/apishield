import Link from 'next/link'

export const metadata = {
  title: 'APIShield vs Kong — API Gateway Comparison 2026',
  description: 'APIShield vs Kong Konnect: starts free vs $105/mo per service. Honest comparison including LLM token tracking, self-hosting, and setup time.',
}

const rows = [
  { feature: 'Free tier',              apishield: '✓ $0 forever',             kong: '✓ OSS (self-managed only)' },
  { feature: 'Managed tier starts at', apishield: '$19/mo',                    kong: '~$105/mo per gateway service' },
  { feature: 'Overage pricing',        apishield: 'None on flat plan',         kong: '+$200 per additional million requests' },
  { feature: 'Deploy model',           apishield: 'Vercel (zero-ops)',          kong: 'Self-host OSS or Kong Cloud' },
  { feature: 'Setup time',             apishield: '5 minutes',                  kong: '30–120 minutes (OSS); minutes (Cloud)' },
  { feature: 'API key auth',           apishield: '✓',                          kong: '✓ (plugin required)' },
  { feature: 'JWT auth',               apishield: '✓ HS256 built-in',          kong: '✓ (plugin required)' },
  { feature: 'Rate limiting',          apishield: '✓ per-key, per-minute',     kong: '✓ (plugin required)' },
  { feature: 'LLM token tracking',     apishield: '✓ OpenAI + Anthropic',      kong: '✓ AI Gateway (paid add-on)' },
  { feature: 'LLM cost estimation',    apishield: '✓ inline $/M tokens',       kong: '✗ (manual reporting only)' },
  { feature: 'Real-time analytics',    apishield: '✓ auto-refreshes 60s',      kong: '✓ Kong Vitals (paid)' },
  { feature: 'Developer portal',       apishield: '✓ included',                 kong: '✓ Dev Portal (paid)' },
  { feature: 'RBAC / roles',           apishield: '✗ (roadmap)',                kong: '✓ Enterprise only' },
  { feature: 'Plugin ecosystem',       apishield: '✗ (custom routes)',          kong: '✓ 80+ plugins' },
  { feature: 'Open source',            apishield: '✓ MIT',                      kong: '✓ OSS core (Apache 2)' },
  { feature: 'Self-hostable',          apishield: '✓ fork & deploy',            kong: '✓ OSS (complex setup)' },
  { feature: 'YAML / declarative cfg', apishield: '✗ (UI + API only)',         kong: '✓ decK / KongOps' },
  { feature: 'GraphQL support',        apishield: '✓ passthrough',              kong: '✓ plugin' },
  { feature: 'WebSocket support',      apishield: '✓ passthrough',              kong: '✓' },
  { feature: 'Kubernetes-native',      apishield: '✗',                          kong: '✓ Ingress Controller' },
]

const shield = (v: string) => v === '✓' || v.startsWith('✓')
const bad    = (v: string) => v === '✗' || v.startsWith('✗')

export default function VsKong() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">APIShield vs Kong</h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Kong is powerful and battle-tested. It also starts at $105/mo per service with complex setup. APIShield is operational in 5 minutes at $0.
          </p>
        </div>

        {/* Score cards */}
        <div className="grid grid-cols-2 gap-6 mb-12">
          {[
            {
              name: '🛡️ APIShield',
              tagline: 'Zero-ops, LLM-aware, starts free',
              price: 'Free → $19/mo',
              pros: ['5-minute setup, no YAML', 'LLM token + cost tracking included', 'MIT open source, fork & deploy', 'No per-request overages'],
              cons: ['No plugin ecosystem yet', 'No Kubernetes ingress controller', 'No RBAC (roadmap)'],
              cta: true,
            },
            {
              name: 'Kong',
              tagline: 'Battle-tested, enterprise-grade',
              price: 'OSS free / ~$105/mo managed',
              pros: ['80+ plugins', 'Kubernetes-native (Ingress Controller)', 'Mature ecosystem', 'RBAC + audit logs'],
              cons: ['Complex self-hosted setup', '$105/mo+ for managed tier', '+$200 per additional 1M requests', 'No built-in LLM cost tracking'],
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

        {/* When to pick which */}
        <div className="grid grid-cols-2 gap-6 mb-12">
          <div className="bg-green-50 border border-green-200 rounded-xl p-5">
            <div className="font-semibold text-green-800 mb-2">Choose APIShield if you…</div>
            <ul className="space-y-1 text-sm text-green-700">
              <li>• Are a solo builder or small team</li>
              <li>• Need a gateway live in minutes, not hours</li>
              <li>• Proxy LLM APIs and want cost visibility</li>
              <li>• Want $0 start with no ops overhead</li>
              <li>• Run on Vercel already</li>
            </ul>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
            <div className="font-semibold text-gray-700 mb-2">Choose Kong if you…</div>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Run Kubernetes in production</li>
              <li>• Need 80+ plugins out of the box</li>
              <li>• Have a dedicated platform team</li>
              <li>• Need enterprise RBAC + audit logs today</li>
              <li>• Budget allows $1,000+/mo at scale</li>
            </ul>
          </div>
        </div>

        {/* Feature table */}
        <h2 className="text-xl font-bold text-gray-900 mb-4">Feature-by-feature comparison</h2>
        <div className="rounded-xl border border-gray-200 overflow-hidden mb-16">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3 w-1/3">Feature</th>
                <th className="text-left text-xs font-medium text-indigo-600 uppercase px-4 py-3 w-1/3">🛡️ APIShield</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3 w-1/3">Kong</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map(r => (
                <tr key={r.feature} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-700">{r.feature}</td>
                  <td className={`px-4 py-3 text-sm font-medium ${shield(r.apishield) ? 'text-green-600' : bad(r.apishield) ? 'text-gray-300' : 'text-gray-700'}`}>
                    {r.apishield}
                  </td>
                  <td className={`px-4 py-3 text-sm ${shield(r.kong) ? 'text-gray-600' : bad(r.kong) ? 'text-red-400' : 'text-gray-500'}`}>
                    {r.kong}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom CTA */}
        <div className="text-center bg-indigo-50 rounded-2xl p-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">From zero to gateway in 5 minutes</h2>
          <p className="text-gray-500 mb-2">No YAML. No Helm charts. No Kubernetes required.</p>
          <p className="text-gray-400 text-sm mb-6">Free tier runs on Upstash + Vercel. You pay nothing until you need more.</p>
          <Link href="/login" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Try APIShield free →
          </Link>
        </div>
      </div>
    </div>
  )
}
