import Link from 'next/link'

const featureGroups = [
  {
    category: 'Traffic & Routing',
    icon: '🔀',
    features: [
      { title: 'Multi-Backend Routing', desc: 'Map different URL paths to different origin servers. /api/users on server A, /api/orders on server B — one gateway, one domain.' },
      { title: 'Response Caching', desc: 'Cache GET responses per-endpoint with configurable TTL. Cut backend load without code changes.' },
      { title: 'URL Rewriting', desc: 'Strip path prefixes, rewrite URLs, translate between API versions. Your backend never needs to change.' },
      { title: 'Load Balancing', desc: 'Distribute traffic across multiple backend instances with automatic failover and health checks.' },
    ],
  },
  {
    category: 'Security & Auth',
    icon: '🔐',
    features: [
      { title: 'API Key Authentication', desc: 'Generate, rotate, and revoke API keys instantly. Every key is tied to a user, a role, and a rate limit bucket.' },
      { title: 'JWT & OAuth 2.0', desc: 'Validate JWTs and OAuth 2.0 Bearer tokens before requests reach your backend. Works with Auth0, Okta, Google.' },
      { title: 'IP Filtering', desc: 'Allowlist or blocklist by IP address or CIDR range at the gateway layer, before traffic hits your code.' },
      { title: 'Role-Based Restrictions', desc: 'Lock specific URL patterns to users with specific roles. /admin/* needs role:admin — zero backend logic.' },
    ],
  },
  {
    category: 'Rate Limiting',
    icon: '⚡',
    features: [
      { title: 'Per-Second Limiting', desc: 'Prevent burst floods. A user can\'t send 1,000 requests in one second even if their per-minute budget allows it.' },
      { title: 'Quota Management', desc: 'Monthly call quotas per plan tier. Automatic 429 when exhausted. Resets on the 1st of each month.' },
      { title: 'Per-Endpoint Overrides', desc: 'Tighter limits on expensive endpoints, looser limits on cheap reads. Path-pattern matching.' },
      { title: 'Rate Limit Headers', desc: 'Every response includes X-RateLimit-Limit, Remaining, Reset — so clients backoff gracefully.' },
    ],
  },
  {
    category: 'Analytics & Logs',
    icon: '📊',
    features: [
      { title: 'Real-Time Request Logs', desc: 'Every request logged with status, latency, user, IP, and endpoint. Full-text searchable via Elasticsearch.' },
      { title: 'Latency Percentiles', desc: 'p50, p75, p95, p99 per endpoint. Find the slow backends before your users file support tickets.' },
      { title: 'Error Rate Tracking', desc: 'Track 4xx and 5xx rates over time. Webhook alert when error rate crosses your threshold.' },
      { title: 'Per-User Breakdown', desc: 'Drill into any API key to see full usage history, quota remaining, and last-seen timestamp.' },
    ],
  },
  {
    category: 'Developer Portal',
    icon: '👩‍💻',
    features: [
      { title: 'Self-Service Key Signup', desc: 'Developers visit your portal, enter their email, and get a key in 60 seconds. No support tickets.' },
      { title: 'Auto-Generated Docs', desc: 'Import your OpenAPI spec and get interactive documentation instantly. Try-it-in-browser included.' },
      { title: 'Email Notifications', desc: 'Automatic emails on key approval, revocation, quota warnings (80%, 95%, 100%), and monthly summaries.' },
      { title: 'Custom Domain & Branding', desc: 'White-label portal on portal.yourapi.com with your logo and colors. Growth and Enterprise.' },
    ],
  },
  {
    category: 'Admin & Operations',
    icon: '⚙️',
    features: [
      { title: 'Multi-Org Admin Groups', desc: 'Different teams get admin access only to their own APIs. Payments team can\'t see user API logs.' },
      { title: 'Granular Permissions', desc: 'Analytics-only admins, key managers who can\'t touch rate limits, full-access API managers. Mix and match.' },
      { title: 'REST Management API', desc: 'Create backends, manage users, update rate limits — all via API. Automate onboarding in CI/CD.' },
      { title: 'HTTP Header Control', desc: 'Inject, remove, or override any request or response header at the gateway layer. CORS, auth context, debug strip.' },
    ],
  },
]

const stats = [
  { value: '60s', label: 'To go live — no code changes' },
  { value: '$0', label: 'Free tier, forever' },
  { value: 'MIT', label: 'Open source core' },
  { value: '24', label: 'Features included on every plan' },
]

const integrations = [
  { name: 'Node.js', icon: '🟢' },
  { name: 'Python', icon: '🐍' },
  { name: 'Go', icon: '🔵' },
  { name: 'Ruby', icon: '💎' },
  { name: 'Java', icon: '☕' },
  { name: 'PHP', icon: '🐘' },
  { name: 'Rust', icon: '🦀' },
  { name: 'Any REST API', icon: '🌐' },
]

const plans = [
  { name: 'Starter', price: '$0', period: '/month', highlight: false, features: ['Up to 50K calls/month', '5 API keys', 'Basic rate limiting', 'Community support', '7-day analytics'] },
  { name: 'Growth', price: '$19', period: '/month', highlight: true, badge: 'Cheapest in Market', features: ['Up to 1M calls/month', 'Unlimited API keys', 'Advanced rate limiting', 'Priority support', '90-day analytics', 'IP whitelisting', 'Webhook alerts', 'Custom domains'] },
  { name: 'Enterprise', price: 'Custom', period: '', highlight: false, features: ['Unlimited calls', 'Unlimited keys', 'Custom SLA', 'Dedicated support', 'SSO/SAML', 'On-premise option', 'Management API', 'Audit logs'] },
]

const howItWorks = [
  {
    step: '01',
    title: 'Add your backend',
    desc: 'Paste your API\'s origin URL into the APIShield admin. Configure URL prefix, load balancing, and caching.',
    code: 'Origin: https://api.yourapp.com\nPrefix: /v1/\nCaching: 60s for GET requests',
  },
  {
    step: '02',
    title: 'Configure security',
    desc: 'Set rate limits, IP filters, and auth requirements. All via admin UI — no YAML, no config files.',
    code: 'Rate limit: 1000 req/min per key\nAuth: API key required\nIP allowlist: office CIDR',
  },
  {
    step: '03',
    title: 'Ship your developer portal',
    desc: 'Share your portal URL. Developers self-signup, get keys instantly, and read auto-generated docs.',
    code: 'Portal: portal.yourapp.com\nKey type: self-service, instant\nDocs: auto from OpenAPI spec',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur z-50 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <Link href="/" className="text-gray-900 font-bold text-xl">🛡️ APIShield</Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <Link href="/features" className="hover:text-gray-900">Features</Link>
            <Link href="/docs" className="hover:text-gray-900">Docs</Link>
            <Link href="/pricing" className="hover:text-gray-900">Pricing</Link>
            <Link href="/dashboard" className="hover:text-gray-900">Dashboard</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">Sign in</Link>
            <Link href="/dashboard" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6 bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-indigo-200 text-xs px-3 py-1 rounded-full mb-6">
            🏛️ Built on api-umbrella — the open-source gateway powering the US government&apos;s api.data.gov
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Enterprise API Gateway<br />
            <span className="bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">for $19/month</span>
          </h1>
          <p className="text-xl text-indigo-200 mb-10 max-w-2xl mx-auto leading-relaxed">
            Add auth, rate limiting, analytics, and a developer portal to any API — without touching your code. The same gateway infrastructure the US federal government uses, rebundled for startups and SMBs.
          </p>
          <div className="bg-slate-900 rounded-2xl p-6 text-left max-w-xl mx-auto mb-8 border border-slate-700">
            <div className="text-slate-400 text-xs mb-3 font-mono">Route through APIShield in 60 seconds</div>
            <pre className="text-green-400 font-mono text-sm leading-relaxed">{`# Your existing API, unchanged:
GET https://api.yourapp.com/v1/data

# Via APIShield (auth + limits + analytics):
GET https://gateway.apishield.io/yourapp/v1/data
X-Api-Key: sk_live_xxxxxxxxxxxxxxxx

# No code changes. Live in 60 seconds.`}</pre>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="bg-white text-indigo-700 font-semibold px-8 py-4 rounded-xl hover:bg-indigo-50 transition-colors">
              Start Free — No credit card
            </Link>
            <Link href="/docs" className="border border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors">
              Read the Docs →
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="bg-indigo-600 py-6">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map(s => (
            <div key={s.label}>
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-indigo-200 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Works with any stack */}
      <section className="py-10 px-6 bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs text-gray-400 mb-5 font-semibold uppercase tracking-widest">Works with any backend, any language</p>
          <div className="flex flex-wrap justify-center gap-8">
            {integrations.map(i => (
              <div key={i.name} className="flex items-center gap-2 text-gray-600 text-sm font-medium">
                <span className="text-xl">{i.icon}</span>
                {i.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">24 features included on every plan</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">No plugin marketplace. No add-on fees. Everything you need to run a production API program ships on day one.</p>
          </div>
          <div className="space-y-16">
            {featureGroups.map(group => (
              <div key={group.category}>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">{group.icon}</span>
                  <h3 className="text-lg font-bold text-gray-900">{group.category}</h3>
                  <div className="flex-1 h-px bg-gray-200 ml-2" />
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                  {group.features.map(f => (
                    <div key={f.title} className="p-5 rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-sm transition-all">
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm">{f.title}</h4>
                      <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/features" className="text-indigo-600 font-medium hover:underline text-sm">
              Full feature specs with technical details →
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How it works</h2>
            <p className="text-gray-600">APIShield proxies in front of your existing API. Your code stays exactly the same.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map(step => (
              <div key={step.step} className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="text-indigo-600 font-bold text-sm mb-3">{step.step}</div>
                <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{step.desc}</p>
                <pre className="bg-slate-900 text-green-400 font-mono text-xs p-3 rounded-lg leading-relaxed">{step.code}</pre>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/docs" className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors">
              Read the quickstart →
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Pricing that scales with you</h2>
            <p className="text-gray-600">No feature gating between tiers. Limits differ, features don&apos;t.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 items-start">
            {plans.map(p => (
              <div key={p.name} className={`rounded-2xl p-8 border relative ${p.highlight ? 'bg-indigo-600 border-indigo-500 text-white shadow-2xl shadow-indigo-200 scale-105' : 'border-gray-200'}`}>
                {p.highlight && 'badge' in p && p.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">{p.badge}</span>
                  </div>
                )}
                <div className={`text-sm font-medium mb-1 ${p.highlight ? 'text-indigo-200' : 'text-gray-500'}`}>{p.name}</div>
                <div className={`text-4xl font-bold mb-1 ${p.highlight ? 'text-white' : 'text-gray-900'}`}>
                  {p.price}<span className={`text-base font-normal ${p.highlight ? 'text-indigo-200' : 'text-gray-400'}`}>{p.period}</span>
                </div>
                <div className="my-6 h-px bg-current opacity-10"></div>
                <ul className="space-y-3 mb-8">
                  {p.features.map(f => (
                    <li key={f} className={`flex items-center gap-2 text-sm ${p.highlight ? 'text-indigo-100' : 'text-gray-600'}`}>
                      <span className="text-green-400 flex-shrink-0">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link href={p.name === 'Enterprise' ? 'mailto:sales@apishield.io' : '/dashboard'} className={`block text-center py-3 rounded-xl font-semibold text-sm transition-colors ${p.highlight ? 'bg-white text-indigo-600 hover:bg-indigo-50' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
                  {p.name === 'Enterprise' ? 'Contact Sales' : 'Get Started Free'}
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-400 text-sm mt-8">
            <Link href="/pricing" className="hover:text-gray-600 underline">Full pricing comparison with feature matrix →</Link>
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-indigo-600">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Your API deserves enterprise-grade protection.</h2>
          <p className="text-indigo-200 mb-8">Start free. No credit card. Live in 60 seconds.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="bg-white text-indigo-600 font-semibold px-8 py-4 rounded-xl hover:bg-indigo-50 transition-colors">
              Get Started Free
            </Link>
            <Link href="/docs" className="border border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors">
              Read the Docs
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-white font-bold text-lg mb-3">🛡️ APIShield</div>
              <p className="text-gray-400 text-sm leading-relaxed">Enterprise API management built on api-umbrella — the open-source gateway powering the US government&apos;s api.data.gov. MIT licensed.</p>
            </div>
            <div>
              <div className="text-gray-300 font-semibold text-sm mb-3">Product</div>
              <div className="space-y-2 text-gray-400 text-sm">
                <div><Link href="/features" className="hover:text-white">Features</Link></div>
                <div><Link href="/pricing" className="hover:text-white">Pricing</Link></div>
                <div><Link href="/docs" className="hover:text-white">Documentation</Link></div>
                <div><Link href="/dashboard" className="hover:text-white">Dashboard</Link></div>
              </div>
            </div>
            <div>
              <div className="text-gray-300 font-semibold text-sm mb-3">Developers</div>
              <div className="space-y-2 text-gray-400 text-sm">
                <div><Link href="/docs" className="hover:text-white">Quickstart</Link></div>
                <div><Link href="/analytics" className="hover:text-white">Analytics</Link></div>
                <div><a href="https://github.com/NREL/api-umbrella" className="hover:text-white" target="_blank" rel="noopener noreferrer">Open Source Core</a></div>
              </div>
            </div>
            <div>
              <div className="text-gray-300 font-semibold text-sm mb-3">Company</div>
              <div className="space-y-2 text-gray-400 text-sm">
                <div><a href="#" className="hover:text-white">Privacy</a></div>
                <div><a href="#" className="hover:text-white">Terms</a></div>
                <div><a href="mailto:support@apishield.io" className="hover:text-white">support@apishield.io</a></div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <div className="text-gray-500 text-sm">Built on api-umbrella (US Federal open-source, MIT license). © 2024 APIShield. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
