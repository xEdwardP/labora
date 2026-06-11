import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const isAuthPage = nextUrl.pathname.startsWith('/login') ||
                     nextUrl.pathname.startsWith('/register')
  const isProtectedRoute = nextUrl.pathname.startsWith('/home') ||
                           nextUrl.pathname.startsWith('/dashboard')

  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL('/home', nextUrl))
  }

  if (!isLoggedIn && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}