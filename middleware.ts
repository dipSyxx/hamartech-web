import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

function isProtectedPath(pathname: string) {
  return (
    pathname === '/min-side' ||
    pathname.startsWith('/min-side/') ||
    pathname === '/reservations' ||
    pathname.startsWith('/reservations/') ||
    pathname === '/checkout' ||
    pathname.startsWith('/checkout/') ||
    pathname === '/approver' ||
    pathname.startsWith('/approver/') ||
    pathname === '/admin' ||
    pathname.startsWith('/admin/')
  )
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl

  if (pathname.startsWith('/api/auth')) return NextResponse.next()
  if (!isProtectedPath(pathname)) return NextResponse.next()

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (pathname.startsWith('/approver')) {
    const role = (token as any)?.role
    if (token && (role === 'ADMIN' || role === 'APPROVER')) {
      return NextResponse.next()
    }
  } else if (pathname.startsWith('/admin')) {
    const role = (token as any)?.role
    if (token && role === 'ADMIN') {
      return NextResponse.next()
    }
  } else if (token) {
    return NextResponse.next()
  }

  const url = req.nextUrl.clone()
  url.pathname = '/login'
  url.searchParams.set('callbackUrl', pathname + search)

  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/min-side/:path*', '/reservations/:path*', '/checkout/:path*', '/admin/:path*'],
}
