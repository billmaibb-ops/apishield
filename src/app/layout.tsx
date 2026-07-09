import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'APIShield — API Gateway & Management Platform',
  description: 'Protect and manage your APIs with rate limiting, analytics, and key management. Built for startups and SMBs.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
