import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'APIShield — Zero-ops AI API Gateway',
  description: 'Protect any API or LLM endpoint in minutes. Auth, rate limits, per-key token budgets, and an auto-generated developer portal — free to start.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
