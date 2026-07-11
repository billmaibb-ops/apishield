import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token) {
    // API routes — return 401 JSON so the dashboard can handle it gracefully
    if (req.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    // Page routes — redirect to login, preserve intended destination
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/backends/:path*',
    '/analytics/:path*',
    '/api/keys/:path*',
    '/api/backends/:path*',
    '/api/analytics/:path*',
  ],
}
