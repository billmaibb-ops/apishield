'use client'
import { useState } from 'react'
import Link from 'next/link'

const PLANS = [
  {
    name: 'Free',
    monthlyPrice: 0,
    annualPrice: 0,
    description: 'Everything you need to get started.',
    cta: 'Start for free',
    ctaHref: '/dashboard',
    highlight: false,
    features: [
      '1M requests / month',
      '3 API keys',
      '3 backends',
      '7-day analytics',
      'Rate limiting (per-minute)',
      'IP allowlist policies',
      'LLM token tracking',
      'Community support',
    ],
    missing: ['Request log viewer', 'Usage email alerts', 'Key rotation', 'Priority support'],
  },
  {
    name: 'Pro',
    monthlyPrice: 19,
    annualPrice: 15,
    description: 'For teams shipping real products.',
    cta: 'Start Pro free for 14 days',
    ctaHref: '/dashboard',
    highlight: true,
    features: [
      '10M requests / month',
      'Unlimited API keys',
      'Unlimited backends',
      '30-day analytics',
      'Rate limiting (per-minute)',
      'IP allowlist policies',
      'LLM token tracking',
      'Request log viewer (last 200 per key)',
      'Usage email alerts (milestones + spikes)',
      'One-click key rotation',
      'JWT / HS256 auth',
      'GraphQL + WebSocket passthrough',
      'Priority email support',
    ],
    missing: [],
  },
  {
    name: 'Scale',
    monthlyPrice: 49,
    annualPrice: 39,
    description: 'High-volume APIs, zero surprises.',
    cta: 'Contact us',
    ctaHref: 'mailto:hello@apishield.io',
    highlight: false,
    features: [
      '100M requests / month',
      'Everything in Pro',
      'Custom domains (coming soon)',
      'SLA — 99.9% uptime guarantee',
      'Slack connect support',
      'Dedicated onboarding call',
      'Invoice billing',
    ],
    missing: [],
  },
]

const FAQ = [
  {
    q: 'What counts as a request?',
    a: 'Any HTTP request proxied through your APIShield gateway URL. Requests that fail authentication before reaching your backend are not counted.',
  },
  {
    q: 'What happens when I exceed my monthly limit?',
    a: 'On the Free plan requests are rate-limited at the per-minute level; you won\'t be charged overages. On Pro and Scale we send you an alert and continue serving traffic — your card is never charged automatically for overages.',
  },
  {
    q: 'How does the 14-day Pro trial work?',
    a: 'No credit card required. Start immediately, get full Pro features for 14 days, then choose to stay on Free or enter payment details to continue Pro.',
  },
  {
    q: 'How does APIShield compare to Kong or Zuplo?',
    a: 'Kong\'s cheapest paid tier starts at ~$105/month. Zuplo charges $25/month plus per-request overages. APIShield Pro is $19/month with no overage charges. See our detailed comparisons.',
  },
  {
    q: 'Can I self-host APIShield?',
    a: 'Not currently — APIShield runs on Vercel Edge Runtime globally. Self-hosting is on the roadmap for Scale enterprise customers.',
  },
  {
    q: 'Is there a free tier permanently?',
    a: 'Yes. The Free plan is not a time-limited trial. 1M requests/month, 3 keys, forever.',
  },
]

export default function PricingPage() {
  const [annual, setAnnual] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur z-50 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-gray-900 font-bold text-xl">🛡️ APIShield</Link>
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <Link href="/features" className="hover:text-gray-900">Features</Link>
            <Link href="/docs" className="hover:text-gray-900">Docs</Link>
            <Link href="/pricing" className="text-indigo-600 font-medium">Pricing</Link>
            <Link href="/dashboard" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors">
              Dashboard →
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-28 pb-24 px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Simple pricing. No surprise bills.
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Start free. Upgrade when you need more. Cancel anytime.
          </p>

          {/* Annual toggle */}
          <div className="inline-flex items-center gap-3 bg-gray-100 rounded-full px-2 py-1">
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                !annual ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                annual ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
              }`}
            >
              Annual
              <span className="ml-1.5 text-xs text-green-600 font-semibold">save 20%</span>
            </button>
          </div>
        </div>

        {/* Plan cards */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 mb-20">
          {PLANS.map((plan) => {
            const price = annual ? plan.annualPrice : plan.monthlyPrice
            return (
              <div
                key={plan.name}
                className={`rounded-2xl border p-8 flex flex-col ${
                  plan.highlight
                    ? 'border-indigo-500 shadow-lg shadow-indigo-100 ring-2 ring-indigo-500'
                    : 'border-gray-200'
                }`}
              >
                {plan.highlight && (
                  <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3">
                    Most popular
                  </div>
                )}
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h2>
                  <p className="text-sm text-gray-500 mb-4">{plan.description}</p>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-bold text-gray-900">${price}</span>
                    <span className="text-gray-500 mb-1">/mo</span>
                  </div>
                  {annual && price > 0 && (
                    <p className="text-xs text-gray-400 mt-1">billed ${price * 12}/year</p>
                  )}
                </div>

                <Link
                  href={plan.ctaHref}
                  className={`w-full text-center py-2.5 px-4 rounded-xl font-medium text-sm transition-colors mb-8 ${
                    plan.highlight
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      : 'border border-gray-300 hover:border-gray-400 text-gray-700'
                  }`}
                >
                  {plan.cta}
                </Link>

                <ul className="space-y-2.5 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex gap-2 text-sm text-gray-700">
                      <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                      {f}
                    </li>
                  ))}
                  {plan.missing.map((f) => (
                    <li key={f} className="flex gap-2 text-sm text-gray-400">
                      <span className="mt-0.5 shrink-0">✗</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* vs competitors */}
        <div className="max-w-3xl mx-auto mb-20 bg-gray-50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
            How APIShield compares
          </h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 font-semibold text-gray-700 w-1/3">Product</th>
                <th className="text-left py-2 font-semibold text-gray-700">Cheapest paid plan</th>
                <th className="text-left py-2 font-semibold text-gray-700">Requests included</th>
                <th className="text-left py-2 font-semibold text-gray-700">Overages</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="font-medium text-indigo-700 bg-indigo-50/50">
                <td className="py-3">🛡️ APIShield</td>
                <td className="py-3">$19/mo</td>
                <td className="py-3">10M / mo</td>
                <td className="py-3">None</td>
              </tr>
              <tr className="text-gray-600">
                <td className="py-3">Zuplo</td>
                <td className="py-3">$25/mo</td>
                <td className="py-3">1M / mo</td>
                <td className="py-3">$0.05 / 10k</td>
              </tr>
              <tr className="text-gray-600">
                <td className="py-3">Kong Konnect</td>
                <td className="py-3">~$105/mo</td>
                <td className="py-3">1M / mo</td>
                <td className="py-3">$200 / M</td>
              </tr>
              <tr className="text-gray-600">
                <td className="py-3">Tyk Cloud</td>
                <td className="py-3">Contact sales</td>
                <td className="py-3">—</td>
                <td className="py-3">—</td>
              </tr>
            </tbody>
          </table>
          <div className="mt-4 flex gap-4 text-xs text-gray-500">
            <Link href="/vs-zuplo" className="text-indigo-600 hover:underline">APIShield vs Zuplo →</Link>
            <Link href="/vs-kong" className="text-indigo-600 hover:underline">APIShield vs Kong →</Link>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto mb-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Frequently asked questions
          </h2>
          <div className="space-y-6">
            {FAQ.map((item) => (
              <div key={item.q}>
                <h3 className="font-semibold text-gray-900 mb-1">{item.q}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to ship faster?</h2>
          <p className="text-gray-600 mb-8">No credit card. Live in 5 minutes.</p>
          <Link
            href="/dashboard"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors"
          >
            Start for free →
          </Link>
        </div>
      </div>
    </div>
  )
}
