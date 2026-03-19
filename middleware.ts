import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// API routes that are intentionally public (no admin auth required)
const PUBLIC_API_PATHS = [
  '/api/auth',
  '/api/contact',
  '/api/hire',
  '/api/rsvps',
];

function isAdminAuthed(request: NextRequest): boolean {
  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
  if (!adminPassword) return true; // not configured — open in dev
  const token = request.cookies.get('lc3-admin')?.value;
  return token === adminPassword;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const reqMethod = request.method;

  if (pathname.startsWith('/admin/login')) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin')) {
    if (!isAdminAuthed(request)) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Protect all write operations on API routes
  if (
    pathname.startsWith('/api/') &&
    ['POST', 'PATCH', 'PUT', 'DELETE'].includes(reqMethod) &&
    !PUBLIC_API_PATHS.some((p) => pathname.startsWith(p)) &&
    !pathname.endsWith('/rsvp') // event-level RSVP is public
  ) {
    if (!isAdminAuthed(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};
