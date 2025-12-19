import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Proteger rutas del dashboard
  if (pathname.startsWith('/dashboard')) {
    const token = request.cookies.get('auth_token')?.value
    
    if (!token || token !== process.env.AUTH_TOKEN) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  
  // Si está autenticado y va a login, redirigir al dashboard
  if (pathname === '/login') {
    const token = request.cookies.get('auth_token')?.value
    
    if (token && token === process.env.AUTH_TOKEN) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
}
