import Link from 'next/link'

const sections = [
  { id: 'quickstart', title: 'Quickstart' },
  { id: 'backends', title: 'API Backends' },
  { id: 'api-keys', title: 'API Keys & Users' },
  { id: 'rate-limits', title: 'Rate Limits' },
  { id: 'analytics', title: 'Analytics' },
  { id: 'headers', title: 'HTTP Headers' },
  { id: 'roles', title: 'Roles & Restrictions' },
  { id: 'portal', title: 'Developer Portal' },
  { id: 'mgmt-api', title: 'Management API' },
  { id: 'deployment', title: 'Self-Hosted Deployment' },
]

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur z-50 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <Link href="/" className="text-gray-900 font-bold text-xl">🛡️ APIShield</Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <Link href="/features" className="hover:text-gray-900">Features</Link>
            <Link href="/docs" className="text-indigo-600 font-medium">Docs</Link>
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

      <div className="pt-16 flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden lg:block w-60 border-r border-gray-200 fixed top-16 left-0 bottom-0 pt-8 px-5 bg-gray-50 overflow-y-auto">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Documentation</div>
          <nav className="space-y-0.5">
            {sections.map(s => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="block text-sm text-gray-600 hover:text-indigo-600 py-2 px-2 rounded-lg hover:bg-white transition-colors"
              >
                {s.title}
              </a>
            ))}
          </nav>
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-xs text-gray-400 mb-2 font-medium">Open Source</div>
            <a
              href="https://github.com/NREL/api-umbrella"
              className="text-sm text-indigo-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              api-umbrella on GitHub →
            </a>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 lg:ml-60 px-6 lg:px-16 py-12 max-w-4xl">

          {/* Quickstart */}
          <section id="quickstart" className="mb-16 scroll-mt-20">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quickstart</h1>
            <p className="text-gray-600 text-lg mb-10">
              Get your first API live behind APIShield in under 5 minutes.
            </p>

            <div className="space-y-6">
              {[
                {
                  step: 1,
                  title: 'Create your account',
                  desc: 'Sign up at apishield.io. You\'ll land in the admin dashboard with a default API backend ready to configure.',
                  code: null,
                },
                {
                  step: 2,
                  title: 'Add your API backend',
                  desc: 'Click "Add Backend" in the dashboard. Enter your origin URL and a frontend URL prefix. APIShield starts proxying traffic immediately.',
                  code: `# Example: your API lives at
https://api.yourapp.com/v1/

# After adding backend, it's accessible via:
https://gateway.apishield.io/yourapp/v1/`,
                },
                {
                  step: 3,
                  title: 'Make your first authenticated request',
                  desc: 'Your account comes with a test API key. Try it:',
                  code: `curl https://gateway.apishield.io/yourapp/v1/users \\
  -H "X-Api-Key: sk_test_YOUR_KEY_HERE"

# APIShield adds rate limit headers automatically:
# X-RateLimit-Limit: 1000
# X-RateLimit-Remaining: 999
# X-RateLimit-Reset: 1704067200`,
                },
                {
                  step: 4,
                  title: 'Share your developer portal',
                  desc: 'Send developers to your portal URL. They self-signup and get an API key in 60 seconds — no support ticket needed.',
                  code: `# Your developer portal:
https://portal.apishield.io/yourapp

# Developers enter their email and get a key.
# You can enable manual approval if preferred.`,
                },
              ].map(s => (
                <div key={s.step} className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="flex items-center gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <div className="w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {s.step}
                    </div>
                    <h3 className="font-semibold text-gray-900">{s.title}</h3>
                  </div>
                  <div className="px-6 py-5">
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{s.desc}</p>
                    {s.code && (
                      <pre className="bg-slate-900 text-green-400 font-mono text-xs p-4 rounded-xl overflow-x-auto leading-relaxed">
                        {s.code}
                      </pre>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Backends */}
          <section id="backends" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">API Backends</h2>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              An API backend defines the origin server APIShield should forward traffic to, and how to transform requests and responses along the way.
            </p>

            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Configuration fields</h3>
            <div className="overflow-x-auto rounded-xl border border-gray-200 mb-8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Field</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Description</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Example</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    ['Name', 'Human-readable name for this backend', 'Production API'],
                    ['Frontend Prefix', 'URL prefix APIShield listens on', '/yourapp/v1/'],
                    ['Backend Protocol', 'http or https', 'https'],
                    ['Backend Host', 'Origin server hostname', 'api.yourapp.com'],
                    ['Backend Prefix', 'Path prefix on the origin', '/v1/'],
                    ['Caching', 'Cache TTL for GET responses', '60 (seconds)'],
                    ['Default Rate Limit', 'Calls per minute for this backend', '1000'],
                  ].map(([field, desc, ex]) => (
                    <tr key={field} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs text-indigo-700 font-medium">{field}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{desc}</td>
                      <td className="px-4 py-3 text-gray-500 font-mono text-xs">{ex}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Create a backend via Management API</h3>
            <pre className="bg-slate-900 text-green-400 font-mono text-xs p-4 rounded-xl overflow-x-auto leading-relaxed">
              {`POST /api-umbrella/v1/apis
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json

{
  "api": {
    "name": "Production API",
    "frontend_host": "gateway.apishield.io",
    "frontend_prefix": "/yourapp/v1/",
    "backend_protocol": "https",
    "backend_host": "api.yourapp.com",
    "backend_prefix": "/v1/",
    "settings": {
      "rate_limit_mode": "custom",
      "rate_limits": [
        {
          "duration": 60,
          "limit_by": "api_key",
          "limit": 1000,
          "response_headers": true
        }
      ]
    }
  }
}`}
            </pre>
          </section>

          {/* API Keys */}
          <section id="api-keys" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">API Keys & Users</h2>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              Every API consumer gets an API key tied to their user account. Keys are sent in the request header or query string.
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {[
                { label: 'Header', code: 'X-Api-Key: sk_live_xxxxxxxx' },
                { label: 'Query string', code: 'GET /endpoint?api_key=sk_live_xxxxxxxx' },
              ].map(item => (
                <div key={item.label} className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600">
                    {item.label}
                  </div>
                  <pre className="px-4 py-3 font-mono text-xs text-indigo-700">{item.code}</pre>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
              <strong>Tip:</strong> Use the header method in production. Query string keys appear in server logs, which is a security risk.
            </div>
          </section>

          {/* Rate Limits */}
          <section id="rate-limits" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Rate Limits</h2>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              Rate limits enforce independent windows that all apply simultaneously. A user who hits the per-second limit gets a 429 even if their per-minute budget isn&apos;t exhausted.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {[
                { window: 'Per-second', use: 'Prevent burst attacks and script floods.' },
                { window: 'Per-minute', use: 'Standard sustained-use limit for typical APIs.' },
                { window: 'Per-hour', use: 'Hourly budgets for expensive compute endpoints.' },
                { window: 'Per-day', use: 'Daily caps for crawlers and batch importers.' },
              ].map(item => (
                <div key={item.window} className="border border-gray-200 rounded-xl p-4">
                  <div className="font-semibold text-gray-900 text-sm mb-1">{item.window}</div>
                  <p className="text-gray-500 text-xs">{item.use}</p>
                </div>
              ))}
            </div>

            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Rate limit response headers</h3>
            <pre className="bg-slate-900 text-green-400 font-mono text-xs p-4 rounded-xl leading-relaxed">
              {`HTTP/1.1 200 OK
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 847
X-RateLimit-Reset: 1704067200

# When limit exceeded:
HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 0
Retry-After: 23
Content-Type: application/json

{"error":{"code":"OVER_RATE_LIMIT","message":"You have exceeded your rate limit."}}`}
            </pre>
          </section>

          {/* Analytics */}
          <section id="analytics" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics</h2>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              All request logs are stored in Elasticsearch, giving you real-time full-text search over your complete API traffic history.
            </p>

            <div className="space-y-3">
              {[
                { metric: 'Request volume', fields: 'Total calls, by endpoint, by status code family, by specific user or key' },
                { metric: 'Latency', fields: 'p50, p75, p95, p99 — gateway overhead vs backend latency tracked separately' },
                { metric: 'Error rates', fields: '4xx and 5xx rates over time; drillable by path, status code, and user' },
                { metric: 'User activity', fields: 'Per-API-key call history, quota consumed, last-seen timestamp' },
                { metric: 'Geographic data', fields: 'Request origin by country and region (MaxMind GeoIP2)' },
                { metric: 'Log search', fields: 'Full-text search across all log fields — find any request by IP, path, key, or response code' },
              ].map(item => (
                <div key={item.metric} className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl">
                  <span className="text-indigo-600 font-semibold text-xs w-28 flex-shrink-0 pt-0.5">{item.metric}</span>
                  <span className="text-gray-600 text-xs leading-relaxed">{item.fields}</span>
                </div>
              ))}
            </div>
          </section>

          {/* HTTP Headers */}
          <section id="headers" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">HTTP Header Control</h2>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              Inject, remove, or override headers on requests sent to your backend, or on responses returned to clients. No code changes in your API needed.
            </p>
            <pre className="bg-slate-900 text-green-400 font-mono text-xs p-4 rounded-xl leading-relaxed overflow-x-auto">
              {`// In backend settings JSON:

"request_headers": [
  // Inject authenticated user ID from APIShield context:
  { "key": "X-Api-User-Id",    "value": "{api_key_user_id}" },
  // Add a shared secret your backend validates:
  { "key": "X-Internal-Token", "value": "my-internal-secret" },
  // Strip the user's API key before it reaches your code:
  { "key": "X-Api-Key",        "value": null }
],

"response_headers": [
  // Add CORS headers at the gateway layer:
  { "key": "Access-Control-Allow-Origin",  "value": "*" },
  { "key": "Access-Control-Allow-Methods", "value": "GET, POST, OPTIONS" },
  // Remove internal debug headers from responses:
  { "key": "X-Debug-Trace-Id", "value": null }
]`}
            </pre>
          </section>

          {/* Roles */}
          <section id="roles" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Roles & Restrictions</h2>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              Assign roles to API users and lock specific URL patterns to users who hold those roles. The check happens at the gateway — no backend logic needed.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-800">
              <strong>Example:</strong> Users with role <code className="bg-amber-100 px-1 rounded">admin</code> can access <code className="bg-amber-100 px-1 rounded">/yourapp/v1/admin/*</code>. Regular users who try that path get a 403 Forbidden — before the request ever reaches your backend.
            </div>
            <pre className="bg-slate-900 text-green-400 font-mono text-xs p-4 rounded-xl leading-relaxed">
              {`// Backend sub-settings for a restricted path:
"sub_settings": [
  {
    "http_method": "any",
    "regex": "^/yourapp/v1/admin",
    "settings": {
      "required_roles": ["admin"],
      "required_roles_override": true
    }
  }
]

// Response when role check fails:
HTTP/1.1 403 Forbidden
{"error":{"code":"API_KEY_UNAUTHORIZED","message":"Your API key is not authorized to access the given resource."}}`}
            </pre>
          </section>

          {/* Developer Portal */}
          <section id="portal" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Developer Portal</h2>
            <p className="text-gray-600 mb-4 text-sm leading-relaxed">
              The developer portal is the public-facing page where external developers sign up for API keys and read your documentation.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <p className="text-blue-800 text-sm leading-relaxed">
                <strong>How it works:</strong> A developer visits your portal URL, enters their name, email, and optional fields you configure. They receive an API key immediately (or after admin approval). APIShield sends a welcome email with their key and a link to the docs.
              </p>
            </div>

            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Portal configuration</h3>
            <div className="space-y-2 mb-6">
              {[
                { option: 'Instant approval', desc: 'Keys issued immediately upon signup. Good for public APIs.' },
                { option: 'Manual approval', desc: 'Admin reviews signups before keys are issued. Good for paid APIs.' },
                { option: 'Custom form fields', desc: 'Add required fields to the signup form (company, use case, website).' },
                { option: 'Custom branding', desc: 'Your logo, company name, and accent color. Growth and Enterprise.' },
                { option: 'Custom domain', desc: 'portal.yourapi.com instead of apishield.io. Growth and Enterprise.' },
                { option: 'SSO login for developers', desc: 'GitHub, Google, or your SAML provider. Enterprise.' },
              ].map(item => (
                <div key={item.option} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
                  <span className="text-green-500 font-bold flex-shrink-0 text-sm">✓</span>
                  <div className="text-sm">
                    <span className="font-medium text-gray-900">{item.option}</span>
                    <span className="text-gray-500"> — {item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Management API */}
          <section id="mgmt-api" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Management API</h2>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              Every admin action is available via REST API. Use it to automate onboarding, sync users from your own database, or integrate with CI/CD.
            </p>
            <div className="overflow-x-auto rounded-xl border border-gray-200 mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 font-semibold text-gray-700 text-xs">Resource</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700 text-xs">Methods</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700 text-xs">Endpoint</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    ['API Backends', 'GET POST PUT DELETE', '/api-umbrella/v1/apis'],
                    ['API Users', 'GET POST PUT DELETE', '/api-umbrella/v1/users'],
                    ['Admin Accounts', 'GET POST PUT DELETE', '/api-umbrella/v1/admins'],
                    ['Analytics Summary', 'GET', '/api-umbrella/v1/analytics/summary'],
                    ['Request Logs', 'GET', '/api-umbrella/v1/logs'],
                    ['Config Publish', 'POST', '/api-umbrella/v1/config/publish'],
                    ['Health Check', 'GET', '/api-umbrella/v1/health'],
                  ].map(([resource, methods, endpoint]) => (
                    <tr key={resource} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900 text-xs">{resource}</td>
                      <td className="px-4 py-3 text-gray-500 font-mono text-xs">{methods}</td>
                      <td className="px-4 py-3 text-indigo-700 font-mono text-xs">{endpoint}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <pre className="bg-slate-900 text-green-400 font-mono text-xs p-4 rounded-xl leading-relaxed overflow-x-auto">
              {`# Authenticate with admin token:
curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \\
     https://gateway.apishield.io/api-umbrella/v1/health

# Create a new API user programmatically:
curl -X POST \\
     -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \\
     -H "Content-Type: application/json" \\
     -d '{"user":{"first_name":"Jane","last_name":"Dev","email":"jane@acme.com"}}' \\
     https://gateway.apishield.io/api-umbrella/v1/users`}
            </pre>
          </section>

          {/* Self-Hosted Deployment */}
          <section id="deployment" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Self-Hosted Deployment</h2>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              APIShield&apos;s open-source core (api-umbrella) can be deployed on your own infrastructure. Enterprise plan customers get a license for the full admin UI on their own servers.
            </p>

            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Docker (quickest path)</h3>
            <pre className="bg-slate-900 text-green-400 font-mono text-xs p-4 rounded-xl leading-relaxed overflow-x-auto mb-6">
              {`# Pull the official image:
docker pull ghcr.io/nrel/api-umbrella:latest

# Run with a config file:
docker run -d \\
  -p 80:80 -p 443:443 \\
  -v /path/to/config.yml:/etc/api-umbrella/api-umbrella.yml \\
  ghcr.io/nrel/api-umbrella:latest`}
            </pre>

            <h3 className="font-semibold text-gray-900 mb-3 text-sm">System requirements</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { item: 'OS', req: 'Ubuntu 20.04+ or RHEL 8+' },
                { item: 'CPU', req: '2+ cores per gateway node' },
                { item: 'RAM', req: '4 GB minimum, 8 GB recommended' },
                { item: 'Storage', req: '20 GB for logs (scales with traffic)' },
                { item: 'Elasticsearch', req: '7.x or 8.x' },
                { item: 'Redis', req: '6.x or 7.x' },
              ].map(item => (
                <div key={item.item} className="border border-gray-200 rounded-xl p-3">
                  <div className="text-xs font-semibold text-gray-500 mb-1">{item.item}</div>
                  <div className="text-sm text-gray-800">{item.req}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Next steps */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6">
            <h3 className="font-bold text-indigo-900 mb-4">Ready to go deeper?</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { title: 'Dashboard', desc: 'Manage backends, keys, and settings', href: '/dashboard' },
                { title: 'Analytics', desc: 'View your API traffic and logs', href: '/analytics' },
                { title: 'All Features', desc: 'Full feature breakdown with specs', href: '/features' },
                { title: 'Pricing', desc: 'Pick a plan that fits your scale', href: '/pricing' },
              ].map(item => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="flex items-start justify-between gap-3 p-4 bg-white rounded-xl border border-indigo-200 hover:border-indigo-400 hover:shadow-sm transition-all"
                >
                  <div>
                    <div className="font-semibold text-indigo-900 text-sm">{item.title}</div>
                    <div className="text-indigo-600 text-xs">{item.desc}</div>
                  </div>
                  <span className="text-indigo-400 flex-shrink-0">→</span>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 py-8 px-6 lg:ml-60">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-white font-bold text-lg">🛡️ APIShield</div>
          <div className="text-gray-500 text-sm">Built on api-umbrella (MIT). © 2024 APIShield.</div>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link href="/features" className="hover:text-white">Features</Link>
            <Link href="/pricing" className="hover:text-white">Pricing</Link>
            <a href="#" className="hover:text-white">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
