import Link from 'next/link'

const featureSections = [
  {
    id: 'routing',
    title: 'Traffic & Routing',
    subtitle: 'Route, rewrite, and cache traffic without touching your API code',
    icon: '🔀',
    features: [
      {
        name: 'Multi-Backend Routing',
        detail: 'Map different URL path prefixes to completely different origin servers. /api/users can hit server A while /api/orders hits server B — consolidated under one APIShield domain.',
        spec: 'Unlimited backends on Growth and Enterprise',
      },
      {
        name: 'URL Rewriting & Path Prefixes',
        detail: 'Strip, add, or rewrite URL path prefixes before requests reach your backend. Ship /v2 externally while your backend still expects /v1.',
        spec: 'Regex-based rewrite rules supported',
      },
      {
        name: 'Response Caching',
        detail: 'Cache GET responses per-endpoint with configurable TTL. Cache is header-aware and respects Cache-Control from your backend.',
        spec: 'TTL from 1 second to 1 year, per backend',
      },
      {
        name: 'Load Balancing',
        detail: 'Distribute traffic across multiple backend instances. Health checks automatically mark unhealthy instances and route around them.',
        spec: 'Round-robin, IP hash, least-connections modes',
      },
      {
        name: 'Website Backends',
        detail: 'Serve a static site or developer portal through the same gateway as your API — same domain, clean URL separation, no extra infrastructure.',
        spec: 'Static files and reverse-proxied web apps',
      },
      {
        name: 'HTTP Header Control',
        detail: 'Inject, remove, or override any request or response header at the gateway layer. Add CORS headers, inject user context, strip internal debug headers.',
        spec: 'Separate rules for request and response headers; template variables supported',
      },
    ],
  },
  {
    id: 'security',
    title: 'Security & Auth',
    subtitle: 'Seven layers of protection that fire before a request reaches your code',
    icon: '🔐',
    features: [
      {
        name: 'API Key Authentication',
        detail: 'Every request must include a valid API key passed as a header or query parameter. Keys are tied to individual users, roles, and rate limit buckets.',
        spec: 'Header: X-Api-Key  or  query: ?api_key=...',
      },
      {
        name: 'JWT Token Validation',
        detail: 'Verify JWTs using a configured public key or JWKS endpoint. Expired, tampered, or unrecognized tokens are rejected at the gateway — before hitting your code.',
        spec: 'RS256 and HS256; configurable required claims',
      },
      {
        name: 'OAuth 2.0 Bearer Tokens',
        detail: 'Accept OAuth 2.0 Bearer tokens and validate against your auth server. Works with Auth0, Okta, Google, or any RFC 6749-compliant provider.',
        spec: 'RFC 6750 Bearer Token Usage',
      },
      {
        name: 'IP Allowlisting & Blocklisting',
        detail: 'Restrict API access to specific IP addresses or CIDR blocks. Block known bad actors at the gateway layer before they reach your backend at all.',
        spec: 'IPv4 and IPv6, CIDR notation, per-backend rules',
      },
      {
        name: 'Role-Based Endpoint Restrictions',
        detail: 'Lock down specific URL patterns to users who hold specific roles. /admin/* requires role:admin — configured in the gateway, not your codebase.',
        spec: 'Arbitrary role strings, wildcard path matching',
      },
      {
        name: 'HTTPS / TLS Termination',
        detail: 'APIShield terminates TLS so your internal backend can stay on plain HTTP. Automatic certificate provisioning and renewal.',
        spec: 'TLS 1.2 and 1.3, SNI, A+ SSL Labs rating',
      },
    ],
  },
  {
    id: 'rate-limiting',
    title: 'Rate Limiting',
    subtitle: 'Granular, multi-window limits that protect your backend and your revenue',
    icon: '⚡',
    features: [
      {
        name: 'Per-Second Limiting',
        detail: 'Prevent burst floods with sub-minute windows. A user can\'t send 1,000 requests in one second even if their per-minute budget allows it.',
        spec: 'Sliding window algorithm; sub-100ms enforcement',
      },
      {
        name: 'Per-Minute / Per-Hour Limits',
        detail: 'Standard windows for sustained-use limits. Block scripts that run indefinitely while allowing legitimate bursts within the window.',
        spec: 'Multiple windows stack and are enforced independently',
      },
      {
        name: 'Monthly Quota Management',
        detail: 'Monthly call quotas that align to billing tiers. Callers receive a 429 when quota is exhausted. Quota resets automatically on the 1st of each month.',
        spec: 'Configurable soft (alert) and hard (429) thresholds',
      },
      {
        name: 'Per-Endpoint Overrides',
        detail: 'Override the global rate limit on specific paths. Apply tighter limits to expensive ML inference endpoints while leaving cheap read endpoints open.',
        spec: 'URL path-pattern matching with regex',
      },
      {
        name: 'Shared Quota Groups',
        detail: 'Group multiple API keys under a shared rate limit bucket. All keys in an organization share one monthly quota pool instead of getting individual allowances.',
        spec: 'Available on Enterprise',
      },
      {
        name: 'Rate Limit Response Headers',
        detail: 'Every response includes X-RateLimit-Limit, X-RateLimit-Remaining, and X-RateLimit-Reset so clients can implement backoff without guessing.',
        spec: 'Follows IETF draft-ietf-httpapi-ratelimit-headers',
      },
    ],
  },
  {
    id: 'analytics',
    title: 'Analytics & Observability',
    subtitle: 'Know exactly what\'s happening with every request, in real time',
    icon: '📊',
    features: [
      {
        name: 'Real-Time Request Logs',
        detail: 'Every request stored with timestamp, method, path, status code, backend latency, user, IP, and API key. Searchable via Elasticsearch within seconds.',
        spec: 'Full-text search across all log fields',
      },
      {
        name: 'Traffic Volume Charts',
        detail: 'Call volume over time, breakable down by hour, day, or month. Filter by backend, endpoint, status code family, or specific user.',
        spec: 'Time ranges from 1 hour to 1 year',
      },
      {
        name: 'Latency Percentiles',
        detail: 'p50, p75, p95, and p99 response time per endpoint. Gateway overhead shown separately from backend latency so you know where the slowness lives.',
        spec: 'Updated every 60 seconds',
      },
      {
        name: 'Error Rate Tracking',
        detail: 'Track 4xx and 5xx error rates over time. Webhook alert fires when the error rate crosses your configured threshold.',
        spec: 'Breakdown by status code family and specific error codes',
      },
      {
        name: 'Per-User Analytics',
        detail: 'Drill into any API key or user to see their complete usage history: call volume, quota remaining, top endpoints, error rate, and last-seen timestamp.',
        spec: 'Retention: 7 days (Starter), 90 days (Growth), unlimited (Enterprise)',
      },
      {
        name: 'Geographic Breakdown',
        detail: 'Request origin by country and region based on IP address. Identify where your API consumers are coming from without adding any client-side tracking.',
        spec: 'MaxMind GeoIP2 database',
      },
    ],
  },
  {
    id: 'devportal',
    title: 'Developer Portal',
    subtitle: 'Let developers self-serve — no more "can I get an API key?" support tickets',
    icon: '👩‍💻',
    features: [
      {
        name: 'Self-Service Key Signup',
        detail: 'Developers visit your portal URL, enter their name and email, and receive an API key immediately — or after admin approval if you enable it.',
        spec: 'Instant or approval-gated flows; configurable per backend',
      },
      {
        name: 'Auto-Generated API Docs',
        detail: 'Import your OpenAPI 3.0 spec and the portal renders interactive documentation automatically. Try-it-in-browser without leaving the docs page.',
        spec: 'OpenAPI 3.0 and Swagger 2.0 import',
      },
      {
        name: 'Developer Usage Dashboard',
        detail: 'Developers can see their own keys, current usage against quota, and recent request logs — without emailing you to ask "how many calls do I have left?"',
        spec: 'Per-user self-serve view of quota and activity',
      },
      {
        name: 'Email Notifications',
        detail: 'Automatic emails on key approval, key revocation, quota warnings at 80%, 95%, and 100%, and monthly usage summary — all configurable via SMTP.',
        spec: 'Customizable email templates via SMTP config',
      },
      {
        name: 'Custom Domain & White-Label',
        detail: 'Host the developer portal on your own subdomain — portal.yourapi.com — with your logo and brand. Visitors never see "apishield.io".',
        spec: 'Growth and Enterprise plans',
      },
      {
        name: 'Multiple Auth Options for Developers',
        detail: 'Developers can authenticate with email/password, GitHub OAuth, Google OAuth, or your own SSO provider. API keys are scoped to their authenticated account.',
        spec: 'SSO/SAML on Enterprise; GitHub and Google on all plans',
      },
    ],
  },
  {
    id: 'admin',
    title: 'Admin & Operations',
    subtitle: 'Run multi-team, multi-product API programs at any scale',
    icon: '⚙️',
    features: [
      {
        name: 'Multi-Organization Admin Groups',
        detail: 'Assign admin access scoped to specific API prefixes or backends. The payments team can\'t see user API logs, and the user team can\'t touch payment rate limits.',
        spec: 'Scoped by URL prefix or specific backend',
      },
      {
        name: 'Granular Admin Permissions',
        detail: 'Analytics-only admins who can view logs but not change config. Key managers who can approve/revoke keys but can\'t touch rate limits. Any combination you need.',
        spec: 'View analytics / manage keys / manage backends / full access',
      },
      {
        name: 'REST Management API',
        detail: 'Create backends, manage users, update rate limits, publish config — all via REST API. Automate new-customer onboarding in your CI/CD pipeline.',
        spec: 'Full CRUD for all resources; machine-to-machine token auth',
      },
      {
        name: 'Multi-Server Horizontal Scaling',
        detail: 'Run multiple APIShield gateway nodes behind a load balancer. State is shared via Redis and Elasticsearch — scale out as traffic grows.',
        spec: 'Active-active; tested at tens of millions of requests/day',
      },
      {
        name: 'Docker & Kubernetes Deployment',
        detail: 'Official Docker image on GitHub Container Registry. Helm chart for Kubernetes. Deploy on AWS, GCP, Azure, or your own data center.',
        spec: 'ghcr.io/nrel/api-umbrella; Helm chart available',
      },
      {
        name: 'Audit Logs',
        detail: 'Every admin action is logged: who changed what, when, and from which IP. Required for SOC 2 Type II and most enterprise compliance frameworks.',
        spec: 'Enterprise plan; immutable, tamper-evident log store',
      },
    ],
  },
]

const comparisonRows = [
  ['API key authentication', true, true, true, true],
  ['JWT / OAuth 2.0', true, true, true, true],
  ['Rate limiting (multi-window)', true, true, true, true],
  ['Response caching', true, true, true, true],
  ['IP filtering', true, true, true, true],
  ['Real-time request logs', true, true, true, true],
  ['Developer portal', true, true, true, true],
  ['Multi-backend routing', true, true, true, true],
  ['HTTP header control', true, true, true, true],
  ['REST management API', true, true, true, true],
  ['Multi-org admin groups', true, true, true, 'Enterprise'],
  ['Audit logs', true, 'Enterprise', 'Enterprise', 'Enterprise'],
  ['SSO / SAML', true, 'Enterprise', 'Enterprise', 'Enterprise'],
  ['On-premise deployment', true, true, true, true],
  ['Open source (MIT)', true, false, true, false],
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur z-50 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <Link href="/" className="text-gray-900 font-bold text-xl">🛡️ APIShield</Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <Link href="/features" className="text-indigo-600 font-medium">Features</Link>
            <Link href="/docs" className="hover:text-gray-900">Docs</Link>
            <Link href="/pricing" className="hover:text-gray-900">Pricing</Link>
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
      <section className="pt-32 pb-16 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Everything included.<br className="hidden md:block" /> No plugin store.
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
            36 production-ready features across 6 categories. All available on every plan.
            Built on api-umbrella — battle-tested at US federal government scale.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {featureSections.map(s => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="bg-white border border-gray-200 text-gray-600 text-sm px-4 py-2 rounded-full hover:border-indigo-300 hover:text-indigo-600 transition-colors"
              >
                {s.icon} {s.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Feature sections */}
      {featureSections.map((section, idx) => (
        <section
          key={section.id}
          id={section.id}
          className={`py-20 px-6 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
        >
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">{section.icon}</span>
                <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
              </div>
              <p className="text-gray-500 ml-16 text-sm">{section.subtitle}</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.features.map(f => (
                <div
                  key={f.name}
                  className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-indigo-300 hover:shadow-sm transition-all"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">{f.name}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{f.detail}</p>
                  <div className="text-xs text-indigo-600 font-medium bg-indigo-50 px-2 py-1 rounded inline-block">
                    {f.spec}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Competitor comparison */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">How APIShield compares</h2>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700 w-2/5">Feature</th>
                  <th className="text-center px-4 py-4 text-sm font-semibold text-indigo-600">APIShield</th>
                  <th className="text-center px-4 py-4 text-sm font-semibold text-gray-500">Zuplo</th>
                  <th className="text-center px-4 py-4 text-sm font-semibold text-gray-500">Tyk</th>
                  <th className="text-center px-4 py-4 text-sm font-semibold text-gray-500">Kong</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {comparisonRows.map(([feature, apishield, zuplo, tyk, kong], i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm text-gray-700">{feature as string}</td>
                    {[apishield, zuplo, tyk, kong].map((val, j) => (
                      <td key={j} className="px-4 py-3 text-sm text-center">
                        {val === true ? (
                          <span className={`font-bold ${j === 0 ? 'text-indigo-600' : 'text-green-500'}`}>✓</span>
                        ) : val === false ? (
                          <span className="text-gray-300">—</span>
                        ) : (
                          <span className="text-xs text-amber-600 font-medium">{val as string}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="bg-gray-50 border-t-2 border-gray-200">
                  <td className="px-6 py-3 text-sm font-semibold text-gray-900">Starting price</td>
                  <td className="px-4 py-3 text-sm text-center font-bold text-indigo-600">$19/mo</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-500">$20/mo</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-500">$50/mo</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-500">$250/mo</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-center text-xs text-gray-400 mt-4">Comparison based on publicly available pricing and feature pages as of 2024. Enterprise pricing varies.</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-indigo-600">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">All 36 features. Start free.</h2>
          <p className="text-indigo-200 mb-8">
            Free forever on Starter. Growth at $19/month — the cheapest full-featured API gateway on the market.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="bg-white text-indigo-600 font-semibold px-8 py-4 rounded-xl hover:bg-indigo-50 transition-colors">
              Get Started Free
            </Link>
            <Link href="/pricing" className="border border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors">
              See Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-white font-bold text-lg">🛡️ APIShield</div>
          <div className="text-gray-500 text-sm">Built on api-umbrella (US Federal open-source, MIT). © 2024 APIShield.</div>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link href="/docs" className="hover:text-white">Docs</Link>
            <Link href="/pricing" className="hover:text-white">Pricing</Link>
            <a href="#" className="hover:text-white">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
