import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const token = request.cookies.get('ims_token')?.value
  const { pathname } = request.nextUrl
  
  const isProtectedRoute = pathname.startsWith('/dashboard') || 
                          pathname.startsWith('/inventory') || 
                          pathname.startsWith('/profile') || 
                          pathname.startsWith('/users') || 
                          pathname.startsWith('/team') || 
                          pathname.startsWith('/settings') || 
                          pathname.startsWith('/activity') || 
                          pathname.startsWith('/success')

  // If trying to access a protected route without a token, redirect to login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If logged in and trying to access login, redirect to dashboard
  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

// Config for matching paths
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/inventory/:path*',
    '/profile/:path*',
    '/users/:path*',
    '/team/:path*',
    '/settings/:path*',
    '/activity/:path*',
    '/success/:path*',
    '/login'
  ],
}
