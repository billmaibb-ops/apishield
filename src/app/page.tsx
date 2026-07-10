import Link from 'next/link'

const features = [
  { icon: '🔑', title: 'API Key Management', desc: 'Generate, rotate, and revoke API keys instantly. Set per-key rate limits and usage quotas.' },
  { icon: '⚡', title: 'Rate Limiting', desc: 'Protect your APIs from abuse with flexible rate limiting: per-second, per-minute, or per-day.' },
  { icon: '📊', title: 'Request Analytics', desc: 'Real-time dashboards showing call volume, latency, error rates, and top consumers.' },
  { icon: '🛡️', title: 'IP Whitelisting', desc: 'Restrict API access by IP address or CIDR range for an extra layer of security.' },
  { icon: '🚀', title: 'Zero Config Setup', desc: 'Point APIShield at your existing API. No code changes required. Live in under 60 seconds.' },
  { icon: '📖', title: 'Developer Portal', desc: 'Auto-generated docs and a self-service portal so developers can get API keys themselves.' },
]

const stats = [
  { value: '60s', label: 'To go live — no code changes' },
  { value: '$0', label: 'To get started, forever free tier' },
  { value: 'MIT', label: 'Open source core, no lock-in' },
  { value: '∞', label: 'Scale as you grow' },
]

const plans = [
  { name: 'Starter', price: '$0', period: '/month', highlight: false, features: ['Up to 10K calls/month', '5 API keys', 'Basic rate limiting', 'Community support', '7-day analytics history'] },
  { name: 'Growth', price: '$49', period: '/month', highlight: true, features: ['Up to 1M calls/month', 'Unlimited API keys', 'Advanced rate limiting', 'Priority support', '90-day analytics', 'IP whitelisting', 'Webhook alerts'] },
  { name: 'Enterprise', price: 'Custom', period: '', highlight: false, features: ['Unlimited calls', 'Unlimited keys', 'Custom SLA', 'Dedicated support', 'SSO/SAML', 'On-premise option', 'API'] },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur z-50 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <Link href="/" className="text-gray-900 font-bold text-xl">🛡️ APIShield</Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <Link href="/dashboard" className="hover:text-gray-900">Dashboard</Link>
            <Link href="/pricing" className="hover:text-gray-900">Pricing</Link>
            <a href="#features" className="hover:text-gray-900">Features</a>
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
            🏛️ Built on US Federal Government open-source technology
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Your API Gateway<br />
            <span className="bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">in 60 Seconds</span>
          </h1>
          <p className="text-xl text-indigo-200 mb-10 max-w-2xl mx-auto leading-relaxed">
            Add authentication, rate limiting, and analytics to any API without touching your code. Built for startups and SMBs who need enterprise-grade API management at startup prices.
          </p>
          <div className="bg-slate-900 rounded-2xl p-6 text-left max-w-xl mx-auto mb-8 border border-slate-700">
            <div className="text-slate-400 text-xs mb-3 font-mono">Add APIShield in 3 lines</div>
            <pre className="text-green-400 font-mono text-sm leading-relaxed">{`# Before: Direct API call
GET https://api.yourapp.com/data

# After: Via APIShield (add auth + limits)
GET https://apishield.io/proxy/your-api/data
X-APIShield-Key: sk_live_xxxxxxxxxxxxxxxx`}</pre>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="bg-white text-indigo-700 font-semibold px-8 py-4 rounded-xl hover:bg-indigo-50 transition-colors">
              Start Free — No credit card
            </Link>
            <Link href="/pricing" className="border border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors">
              View Pricing
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

      {/* Features */}
      <section id="features" className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything you need to ship secure APIs</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Stop building auth and rate limiting from scratch. APIShield handles it so your team can focus on the actual product.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map(f => (
              <div key={f.title} className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-md hover:border-indigo-300 transition-all">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Pricing that scales with you</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map(p => (
              <div key={p.name} className={`rounded-2xl p-8 border ${p.highlight ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-gray-200'}`}>
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
                <Link href="/dashboard" className={`block text-center py-3 rounded-xl font-semibold text-sm transition-colors ${p.highlight ? 'bg-white text-indigo-600 hover:bg-indigo-50' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
                  {p.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-white font-bold text-lg">🛡️ APIShield</div>
          <div className="text-gray-500 text-sm">Built on api-umbrella (US Federal open-source). © 2024 APIShield. All rights reserved.</div>
          <div className="flex gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white">Docs</a>
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
