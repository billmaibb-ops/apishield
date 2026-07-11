import Link from 'next/link'

const featureGroups = [
  {
    category: 'AI & LLM routing',
    icon: '🤖',
    features: [
      { title: 'LLM backend routing', desc: 'Point any key at an OpenAI, Anthropic, or custom LLM endpoint. The gateway forwards the request and parses the response — no code changes.' },
      { title: 'Per-key token tracking', desc: 'Total tokens consumed tracked per API key, per day. Know exactly which customer is burning your OpenAI budget.' },
      { title: 'Token budget enforcement', desc: 'Set a daily or monthly token limit per key. When the budget is exhausted, requests return 429 automatically — before they hit your LLM.' },
      { title: 'OpenAI & Anthropic compatible', desc: 'Parses usage.total_tokens (OpenAI) and usage.input_tokens + output_tokens (Anthropic) natively. Works with any provider that returns a usage object.' },
    ],
  },
  {
    category: 'Auth & security',
    icon: '🔐',
    features: [
      { title: 'API key authentication', desc: 'Pass keys via X-API-Key header, ?api_key= query param, or Authorization: Bearer. All three work out of the box — no config.' },
      { title: 'JWT / HS256 validation', desc: 'Validate signed JWTs before requests reach your backend. Works with any HS256 issuer. Checks exp, nbf, and signature — all in the edge runtime.' },
      { title: 'IP allowlist per key', desc: 'Lock each API key to specific IPs or CIDR ranges. Requests from unlisted IPs get a 403 before touching your backend.' },
      { title: 'Request size policy', desc: 'Reject oversized payloads at the gateway with a 413. Set a per-key byte limit — protects expensive LLM calls from prompt-stuffing attacks.' },
    ],
  },
  {
    category: 'Rate limiting & traffic',
    icon: '⚡',
    features: [
      { title: 'Per-minute rate limits', desc: 'Per-key sliding window rate limiting with X-RateLimit-Limit, X-RateLimit-Remaining, and X-RateLimit-Reset headers on every response.' },
      { title: 'Header inject & strip', desc: 'Inject upstream headers (auth tokens, org IDs, debug flags) and strip client headers before forwarding. Enforced per-key via policy.' },
      { title: 'GraphQL passthrough', desc: 'GraphQL POSTs are forwarded with Content-Type preserved. The gateway is query-agnostic — your schema, your resolvers, zero changes.' },
      { title: 'WebSocket key validation', desc: 'Detect Upgrade: websocket, validate the API key, and return 426 with the validated backend WS URL. Serverless-compatible by design.' },
    ],
  },
  {
    category: 'Developer portal',
    icon: '🌐',
    features: [
      { title: 'Auto-generated docs', desc: 'Every active backend gets a live documentation entry at /portal. Auth methods, code examples, response headers, and error codes — no OpenAPI spec required.' },
      { title: 'Multi-language examples', desc: 'curl, JavaScript/TypeScript, and Python examples auto-generated for every backend. Developers copy-paste and ship.' },
      { title: 'Protocol-aware docs', desc: 'LLM backends get an OpenAI-compatible example. GraphQL backends get a query example. WebSocket backends get the JS connection pattern.' },
      { title: 'Error code reference', desc: 'Every error code (401, 403, 413, 426, 429, 502, 503) documented with its exact meaning in the context of your gateway.' },
    ],
  },
  {
    category: 'Analytics & observability',
    icon: '📊',
    features: [
      { title: 'Per-key latency tracking', desc: 'Average latency per API key per day. Surface the slow backends before your customers do.' },
      { title: 'Error rate per key', desc: 'Track 4xx and 5xx error rates per key. Error rate included in the analytics response alongside call count.' },
      { title: 'Token usage over time', desc: 'Daily token totals per key and globally. Know your LLM cost trajectory before your OpenAI invoice arrives.' },
      { title: '7-day daily totals', desc: 'Rolling 7-day call counts, error counts, and token counts. No time series database required — stored directly in Redis.' },
    ],
  },
  {
    category: 'Zero-ops infrastructure',
    icon: '🚀',
    features: [
      { title: 'Vercel Edge Runtime', desc: "The gateway runs on Vercel's Edge Runtime — 300+ global locations, sub-50ms cold starts, no servers to manage, no YAML to write." },
      { title: 'Upstash Redis backend', desc: 'All keys, backends, rate limit windows, and analytics counters live in Upstash Redis via HTTP. The free Upstash tier covers most startups entirely.' },
      { title: 'Deploy in 5 minutes', desc: 'Fork the repo, set two env vars (UPSTASH_REDIS_REST_URL and TOKEN), deploy to Vercel. Your gateway is live. No ops team required.' },
      { title: 'No YAML, no plugins', desc: 'Everything configured through the admin UI or the management API. No plugin marketplace, no config files, no version-locked YAML schemas.' },
    ],
  },
]

const stats = [
  { value: '$0', label: 'Free to start, forever' },
  { value: '5 min', label: 'From fork to production' },
  { value: '300+', label: 'Edge locations globally' },
  { value: '<50ms', label: 'Gateway latency' },
]

const integrations = [
  { name: 'OpenAI', icon: '⚡' },
  { name: 'Anthropic', icon: '🧠' },
  { name: 'Node.js', icon: '🟢' },
  { name: 'Python', icon: '🐍' },
  { name: 'Go', icon: '🔵' },
  { name: 'Ruby', icon: '💎' },
  { name: 'Rust', icon: '🦀' },
  { name: 'Any REST API', icon: '🌐' },
]

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    highlight: false,
    sub: 'Forever. No credit card.',
    features: [
      'Unlimited API keys',
      'Unlimited backends',
      'Per-minute rate limiting',
      'JWT + API key auth',
      'IP allowlist policy',
      'Developer portal',
      'LLM token tracking',
      '7-day analytics',
    ],
  },
  {
    name: 'Growth',
    price: '$19',
    period: '/month',
    highlight: true,
    badge: 'Most popular',
    sub: 'For teams scaling fast.',
    features: [
      'Everything in Free',
      'Priority support',
      'Custom domain portal',
      'Webhook alerts',
      '90-day analytics',
      'Team management',
      'SSO / SAML (soon)',
      'SLA guarantee',
    ],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    highlight: false,
    sub: 'Talk to us.',
    features: [
      'Everything in Growth',
      'Unlimited history',
      'Dedicated support',
      'Custom SLA',
      'On-prem option',
      'Audit logs',
      'Management API',
      'White-label portal',
    ],
  },
]

const howItWorks = [
  {
    step: '01',
    title: 'Add a backend',
    desc: 'Paste any API or LLM endpoint URL — your own REST API, OpenAI, Anthropic, or a custom model. Mark it as an AI backend to enable token tracking.',
    code: `# REST backend
Origin: https://api.yourapp.com

# Or an LLM backend
Origin: https://api.openai.com
Type: AI / LLM → OpenAI`,
  },
  {
    step: '02',
    title: 'Issue API keys',
    desc: 'Create a key, set its rate limit, choose the auth type (API key or JWT), and attach a policy. Done in the dashboard — no code.',
    code: `Key: sk_live_xxxxxxxxxxxxxxxx
Rate limit: 100 req/min
Auth: API key
IP allowlist: 10.0.0.0/24`,
  },
  {
    step: '03',
    title: 'Route & observe',
    desc: 'Clients hit /api/gateway/* with their key. You see latency, error rates, and token usage per key in real time.',
    code: `POST /api/gateway/v1/chat/completions
X-API-Key: sk_live_xxxxxxxxxxxxxxxx

← X-Response-Time: 312ms
← X-RateLimit-Remaining: 87
← tokens used today: 41,203`,
  },
]

const vsCompetitors = [
  { name: 'Kong', price: '$40K+/yr', pain: 'Per-service billing, enterprise sales cycle, weeks to set up' },
  { name: 'Apigee', price: '$500+/mo', pain: '5× surcharge on extensible proxies, Google Cloud lock-in' },
  { name: 'KrakenD', price: 'Custom', pain: 'Self-host only, no free cloud tier, complex config' },
  { name: 'Tyk', price: 'Contact sales', pain: 'Opaque pricing, no transparent free tier' },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <Link href="/" className="text-gray-900 font-bold text-xl">🛡️ APIShield</Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <Link href="/features" className="hover:text-gray-900">Features</Link>
            <Link href="/docs" className="hover:text-gray-900">Docs</Link>
            <Link href="/pricing" className="hover:text-gray-900">Pricing</Link>
            <Link href="/portal" className="hover:text-gray-900">Developer Portal</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">Dashboard</Link>
            <Link href="/dashboard" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
              Start free →
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6 bg-gradient-to-br from-gray-950 via-indigo-950 to-gray-950">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs px-3 py-1.5 rounded-full mb-8 font-medium">
            ✦ LLM token tracking · Edge runtime · Free to start
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
            The zero-ops API gateway<br />
            <span className="text-indigo-400">built for AI builders</span>
          </h1>
          <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Protect any API or LLM endpoint in minutes. Auth, rate limits, per-key token budgets, and an auto-generated developer portal — all on the Vercel Edge. No infra, no YAML, no ops team.
          </p>
          <div className="bg-gray-900 rounded-2xl p-6 text-left max-w-xl mx-auto mb-10 border border-gray-800">
            <div className="text-gray-500 text-xs mb-3 font-mono">Route OpenAI through your gateway</div>
            <pre className="text-green-400 font-mono text-sm leading-relaxed overflow-x-auto">{`POST https://apishield.vercel.app/api/gateway/v1/chat/completions
X-API-Key: sk_live_xxxxxxxxxxxxxxxx

# ← rate limited · token tracked · latency logged
# ← no code changes to your app
# ← live in 5 minutes`}</pre>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors">
              Start free — no credit card
            </Link>
            <Link href="/portal" className="border border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white font-semibold px-8 py-4 rounded-xl transition-colors">
              View developer portal →
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="bg-indigo-600 py-5">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map(s => (
            <div key={s.label}>
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-indigo-200 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Compatible with */}
      <section className="py-8 px-6 bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs text-gray-400 mb-4 font-semibold uppercase tracking-widest">Works with any backend or LLM provider</p>
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

      {/* vs Competitors */}
      <section className="py-16 px-6 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Enterprise gateways charge enterprise prices</h2>
            <p className="text-gray-500">APIShield gives you the same core capabilities, free.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {vsCompetitors.map(c => (
              <div key={c.name} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-400 text-sm font-bold">✕</div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900 text-sm">{c.name}</span>
                    <span className="text-xs text-red-600 font-medium bg-red-50 px-2 py-0.5 rounded">{c.price}</span>
                  </div>
                  <div className="text-gray-500 text-sm">{c.pain}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 rounded-xl bg-indigo-50 border border-indigo-100 flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-sm font-bold">✓</div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-indigo-900 text-sm">APIShield</span>
                <span className="text-xs text-indigo-700 font-medium bg-indigo-100 px-2 py-0.5 rounded">$0 to start</span>
              </div>
              <div className="text-indigo-700 text-sm">Auth, rate limiting, LLM token tracking, developer portal, edge deployment — free forever. No sales call. Live in 5 minutes.</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How it works</h2>
            <p className="text-gray-500">APIShield sits in front of your API or LLM. Your backend code stays unchanged.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {howItWorks.map(step => (
              <div key={step.step} className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="text-indigo-600 font-bold text-xs mb-3 tracking-widest">{step.step}</div>
                <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm mb-4 leading-relaxed">{step.desc}</p>
                <pre className="bg-gray-950 text-green-400 font-mono text-xs p-3 rounded-lg leading-relaxed whitespace-pre-wrap">{step.code}</pre>
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

      {/* Features */}
      <section id="features" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything included. No plugin marketplace.</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">Kong charges per plugin. Apigee charges per million calls. APIShield ships every feature on the free plan.</p>
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
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Transparent pricing. No surprise bills.</h2>
            <p className="text-gray-500">Kong bills per gateway service. Apigee charges per million calls plus environment fees. APIShield publishes real numbers.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 items-start">
            {plans.map(p => (
              <div key={p.name} className={`rounded-2xl p-8 border relative ${p.highlight ? 'bg-indigo-600 border-indigo-500 text-white shadow-xl shadow-indigo-100 scale-105' : 'bg-white border-gray-200'}`}>
                {p.highlight && 'badge' in p && p.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">{p.badge}</span>
                  </div>
                )}
                <div className={`text-sm font-medium mb-1 ${p.highlight ? 'text-indigo-200' : 'text-gray-500'}`}>{p.name}</div>
                <div className={`text-4xl font-bold mb-0.5 ${p.highlight ? 'text-white' : 'text-gray-900'}`}>
                  {p.price}<span className={`text-base font-normal ${p.highlight ? 'text-indigo-200' : 'text-gray-400'}`}>{p.period}</span>
                </div>
                <div className={`text-sm mb-6 ${p.highlight ? 'text-indigo-200' : 'text-gray-400'}`}>{p.sub}</div>
                <div className="my-4 h-px bg-current opacity-10"></div>
                <ul className="space-y-3 mb-8">
                  {p.features.map(f => (
                    <li key={f} className={`flex items-center gap-2 text-sm ${p.highlight ? 'text-indigo-100' : 'text-gray-600'}`}>
                      <span className="text-green-400 flex-shrink-0">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={p.name === 'Enterprise' ? 'mailto:hello@apishield.io' : '/dashboard'}
                  className={`block text-center py-3 rounded-xl font-semibold text-sm transition-colors ${p.highlight ? 'bg-white text-indigo-600 hover:bg-indigo-50' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                >
                  {p.name === 'Enterprise' ? 'Contact us' : p.name === 'Free' ? 'Start building free' : 'Get started'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-br from-gray-950 to-indigo-950">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Stop paying Kong prices.<br />Start shipping today.
          </h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Full API gateway — auth, rate limiting, LLM token tracking, and a developer portal. Free, forever. No sales call. Live in 5 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors">
              Start free →
            </Link>
            <Link href="/docs" className="border border-gray-700 text-gray-300 hover:border-gray-500 font-semibold px-8 py-4 rounded-xl transition-colors">
              Read the docs
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 py-12 px-6 border-t border-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-white font-bold text-lg mb-3">🛡️ APIShield</div>
              <p className="text-gray-500 text-sm leading-relaxed">Zero-ops API gateway for developers and AI builders. Auth, rate limiting, LLM token tracking, and a developer portal — free to start.</p>
            </div>
            <div>
              <div className="text-gray-300 font-semibold text-sm mb-3">Product</div>
              <div className="space-y-2 text-gray-500 text-sm">
                <div><Link href="/features" className="hover:text-white transition-colors">Features</Link></div>
                <div><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></div>
                <div><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></div>
                <div><Link href="/portal" className="hover:text-white transition-colors">Developer Portal</Link></div>
              </div>
            </div>
            <div>
              <div className="text-gray-300 font-semibold text-sm mb-3">Developers</div>
              <div className="space-y-2 text-gray-500 text-sm">
                <div><Link href="/docs" className="hover:text-white transition-colors">Quickstart (5 min)</Link></div>
                <div><Link href="/analytics" className="hover:text-white transition-colors">Analytics</Link></div>
                <div><Link href="/backends" className="hover:text-white transition-colors">Backend management</Link></div>
                <div><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></div>
              </div>
            </div>
            <div>
              <div className="text-gray-300 font-semibold text-sm mb-3">Compare</div>
              <div className="space-y-2 text-gray-500 text-sm">
                <div><span>vs Kong</span></div>
                <div><span>vs Apigee</span></div>
                <div><span>vs Zuplo</span></div>
                <div><a href="mailto:hello@apishield.io" className="hover:text-white transition-colors">hello@apishield.io</a></div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-600 text-sm">© 2026 APIShield. Free to start. Built for AI builders.</div>
            <div className="flex gap-6 text-gray-600 text-sm">
              <a href="#" className="hover:text-gray-400">Privacy</a>
              <a href="#" className="hover:text-gray-400">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
