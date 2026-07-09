import Link from 'next/link'

const plans = [
  {
    name: 'Starter',
    price: '$0',
    period: '/month',
    highlight: false,
    badge: null,
    description: 'Perfect for side projects and early-stage prototypes.',
    cta: 'Get Started Free',
    features: [
      { label: 'API calls', value: '10,000 / month' },
      { label: 'API keys', value: '5 keys' },
      { label: 'Rate limiting', value: 'Basic (per-minute)' },
      { label: 'Analytics history', value: '7 days' },
      { label: 'IP whitelisting', value: false },
      { label: 'Webhook alerts', value: false },
      { label: 'Custom domains', value: false },
      { label: 'SSO / SAML', value: false },
      { label: 'SLA', value: false },
      { label: 'Support', value: 'Community' },
    ],
  },
  {
    name: 'Growth',
    price: '$49',
    period: '/month',
    highlight: true,
    badge: 'Most Popular',
    description: 'For startups and growing teams shipping production APIs.',
    cta: 'Start Free Trial',
    features: [
      { label: 'API calls', value: '1,000,000 / month' },
      { label: 'API keys', value: 'Unlimited' },
      { label: 'Rate limiting', value: 'Advanced (per-second, per-day)' },
      { label: 'Analytics history', value: '90 days' },
      { label: 'IP whitelisting', value: true },
      { label: 'Webhook alerts', value: true },
      { label: 'Custom domains', value: true },
      { label: 'SSO / SAML', value: false },
      { label: 'SLA', value: '99.9% uptime' },
      { label: 'Support', value: 'Priority email' },
    ],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    highlight: false,
    badge: null,
    description: 'For companies that need unlimited scale, compliance, and dedicated support.',
    cta: 'Contact Sales',
    features: [
      { label: 'API calls', value: 'Unlimited' },
      { label: 'API keys', value: 'Unlimited' },
      { label: 'Rate limiting', value: 'Fully custom' },
      { label: 'Analytics history', value: 'Unlimited' },
      { label: 'IP whitelisting', value: true },
      { label: 'Webhook alerts', value: true },
      { label: 'Custom domains', value: true },
      { label: 'SSO / SAML', value: true },
      { label: 'SLA', value: '99.99% + custom' },
      { label: 'Support', value: 'Dedicated engineer' },
    ],
  },
]

const faqs = [
  {
    q: 'What counts as an API call?',
    a: 'Every request that passes through the APIShield proxy counts as one call — regardless of whether it succeeds or fails. Calls blocked by rate limiting do not count against your quota.',
  },
  {
    q: 'Can I upgrade or downgrade at any time?',
    a: 'Yes. You can upgrade instantly and the change takes effect immediately. Downgrades take effect at the end of your current billing cycle.',
  },
  {
    q: 'What happens when I exceed my monthly call limit?',
    a: 'On Starter, calls above the limit will be blocked with a 429 response. On Growth and Enterprise, we\'ll notify you and work with you to increase your quota — we won\'t cut you off mid-month.',
  },
  {
    q: 'Is there a free trial for paid plans?',
    a: 'Yes — the Growth plan comes with a 14-day free trial, no credit card required. You\'ll only be charged if you keep the plan after the trial.',
  },
  {
    q: 'Do you offer discounts for annual billing?',
    a: 'Yes. Annual billing saves you 20% compared to monthly. Contact us to set up an annual plan.',
  },
  {
    q: 'What is APIShield built on?',
    a: 'APIShield is built on api-umbrella, the open-source API management platform originally developed for the US federal government\'s api.data.gov initiative. It\'s battle-tested at scale.',
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur z-50 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <Link href="/" className="text-gray-900 font-bold text-xl">🛡️ APIShield</Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <Link href="/dashboard" className="hover:text-gray-900">Dashboard</Link>
            <Link href="/pricing" className="text-indigo-600 font-medium">Pricing</Link>
            <Link href="/#features" className="hover:text-gray-900">Features</Link>
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
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Start free. Scale as you grow. No surprise bills.
          </p>
          <p className="text-sm text-gray-400">Annual billing saves 20% — <a href="#" className="underline hover:text-gray-600">contact us</a></p>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 items-start">
          {plans.map(p => (
            <div key={p.name} className={`rounded-2xl border p-8 relative ${p.highlight ? 'bg-indigo-600 border-indigo-500 shadow-2xl shadow-indigo-200 scale-105' : 'bg-white border-gray-200'}`}>
              {p.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">{p.badge}</span>
                </div>
              )}
              <div className={`text-sm font-medium mb-1 ${p.highlight ? 'text-indigo-200' : 'text-gray-500'}`}>{p.name}</div>
              <div className={`text-4xl font-bold mb-1 ${p.highlight ? 'text-white' : 'text-gray-900'}`}>
                {p.price}
                {p.period && <span className={`text-base font-normal ${p.highlight ? 'text-indigo-300' : 'text-gray-400'}`}>{p.period}</span>}
              </div>
              <p className={`text-sm mt-2 mb-6 ${p.highlight ? 'text-indigo-200' : 'text-gray-500'}`}>{p.description}</p>

              <Link
                href={p.name === 'Enterprise' ? 'mailto:sales@apishield.io' : '/dashboard'}
                className={`block text-center py-3 rounded-xl font-semibold text-sm transition-colors mb-6 ${p.highlight ? 'bg-white text-indigo-600 hover:bg-indigo-50' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
              >
                {p.cta}
              </Link>

              <div className={`h-px mb-6 ${p.highlight ? 'bg-indigo-500' : 'bg-gray-100'}`} />

              <ul className="space-y-3">
                {p.features.map(f => (
                  <li key={f.label} className="flex items-start justify-between gap-4 text-sm">
                    <span className={p.highlight ? 'text-indigo-200' : 'text-gray-500'}>{f.label}</span>
                    {f.value === true ? (
                      <span className="text-green-400 font-bold">✓</span>
                    ) : f.value === false ? (
                      <span className={p.highlight ? 'text-indigo-400' : 'text-gray-300'}>—</span>
                    ) : (
                      <span className={`font-medium text-right ${p.highlight ? 'text-white' : 'text-gray-900'}`}>{f.value}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Feature comparison table */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">Full feature comparison</h2>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900 w-1/2">Feature</th>
                  <th className="text-center px-4 py-4 text-sm font-semibold text-gray-600">Starter</th>
                  <th className="text-center px-4 py-4 text-sm font-semibold text-indigo-600">Growth</th>
                  <th className="text-center px-4 py-4 text-sm font-semibold text-gray-600">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  ['Monthly API calls', '10,000', '1,000,000', 'Unlimited'],
                  ['API keys', '5', 'Unlimited', 'Unlimited'],
                  ['Rate limiting granularity', 'Per-minute', 'Per-second, per-day', 'Fully custom'],
                  ['Analytics retention', '7 days', '90 days', 'Unlimited'],
                  ['Request logs', '7 days', '90 days', 'Unlimited'],
                  ['IP whitelisting / blacklisting', '—', '✓', '✓'],
                  ['Webhook alerts', '—', '✓', '✓'],
                  ['Custom proxy domains', '—', '✓', '✓'],
                  ['Developer self-service portal', '—', '✓', '✓'],
                  ['Auto-generated API docs', '—', '✓', '✓'],
                  ['SSO / SAML', '—', '—', '✓'],
                  ['Audit logs', '—', '—', '✓'],
                  ['On-premise deployment', '—', '—', '✓'],
                  ['SLA guarantee', '—', '99.9%', '99.99% custom'],
                  ['Support', 'Community', 'Priority email', 'Dedicated engineer'],
                ].map(([feature, starter, growth, enterprise], i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm text-gray-700">{feature}</td>
                    <td className="px-4 py-3 text-sm text-center text-gray-500">{starter}</td>
                    <td className="px-4 py-3 text-sm text-center text-indigo-700 font-medium">{growth}</td>
                    <td className="px-4 py-3 text-sm text-center text-gray-700">{enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">Frequently asked questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-indigo-600">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to protect your APIs?</h2>
          <p className="text-indigo-200 mb-8">Join 500+ companies using APIShield. Start free, upgrade when you need to.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="bg-white text-indigo-600 font-semibold px-8 py-4 rounded-xl hover:bg-indigo-50 transition-colors">
              Get Started Free
            </Link>
            <Link href="mailto:sales@apishield.io" className="border border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors">
              Talk to Sales
            </Link>
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
