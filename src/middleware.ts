
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from './app/lib/session';

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const { pathname } = request.nextUrl;

  // Add CORS headers for all requests
  const response = NextResponse.next();

  // Environment-based CORS configuration
  const isDevelopment = process.env.NODE_ENV === 'development';
  const allowedOrigins = isDevelopment 
    ? ['http://localhost:3000', 'http://localhost:9002', 'http://127.0.0.1:3000', 'http://127.0.0.1:9002']
    : [process.env['NEXTAUTH_URL'] || 'https://your-production-domain.com'];

  const origin = request.headers.get('origin');
  const isAllowedOrigin = !origin || allowedOrigins.includes(origin);

  // Set CORS headers based on environment
  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin || allowedOrigins[0]!);
  }
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Max-Age', '86400'); // 24 hours

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200, headers: response.headers });
  }

  const publicPaths = ['/login', '/landing', '/'];

  const isPublicPath = publicPaths.some(path => pathname === path || pathname.startsWith(path));

  // Exclude API routes and static files from authentication checks
  const isApiRoute = pathname.startsWith('/api');
  const isStaticFile = pathname.includes('.') || pathname.startsWith('/_next') || pathname.startsWith('/public');

  // Allow access to root path (landing page) for everyone
  if (pathname === '/') {
    return response;
  }

  if (!session && !isPublicPath && !isApiRoute && !isStaticFile) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Only redirect to dashboard if user is on login page and already logged in
  if (session && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
