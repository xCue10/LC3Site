import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes where POST is public (no auth needed to submit)
const PUBLIC_WRITE_PATHS = [
  '/api/auth',
  '/api/contact',
  '/api/hire',
  '/api/rsvps',
];

// Routes where GET is restricted to admins (contain PII / sensitive data)
const PROTECTED_READ_PATHS = [
  '/api/contact',
  '/api/hire',
  '/api/rsvps',
];

function isAdminAuthed(request: NextRequest): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  // SECURITY: Never default to 'true'. If password is not set, block access.
  if (!adminPassword) return false; 
  
  const token = request.cookies.get('lc3-admin')?.value;
  
  // We expect the token to be a simple hash/obfuscation of the password 
  // to avoid storing the raw password in the browser.
  // For this implementation, we'll use a basic comparison that matches the API logic.
  const expectedToken = Buffer.from(adminPassword).toString('base64');
  return token === expectedToken;
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

  // Protect GET on sensitive data endpoints
  if (
    reqMethod === 'GET' &&
    PROTECTED_READ_PATHS.some((p) => pathname.startsWith(p))
  ) {
    if (!isAdminAuthed(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  // Protect all write operations on API routes
  if (
    pathname.startsWith('/api/') &&
    ['POST', 'PATCH', 'PUT', 'DELETE'].includes(reqMethod) &&
    !PUBLIC_WRITE_PATHS.some((p) => pathname.startsWith(p)) &&
    !pathname.startsWith('/api/shield/') && // Shield routes handle their own auth
    !pathname.startsWith('/api/careers/') && // Careers routes are public (client-side auth)
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
