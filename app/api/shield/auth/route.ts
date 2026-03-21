import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';

const VALID_CODES = ['LC3MEMBER', 'LC3ADMIN'];

// Simple in-memory rate limiter: max 10 attempts per IP per 15 minutes
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 10;
const WINDOW_MS = 15 * 60 * 1000;

function getIp(req: NextRequest) {
  return req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = attempts.get(ip);
  if (!record || now > record.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  record.count++;
  return record.count > MAX_ATTEMPTS;
}

export async function POST(req: NextRequest) {
  const ip = getIp(req);
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 });
  }

  const { code, password } = await req.json();
  if (!code || !password) {
    return NextResponse.json({ error: 'Code and password required' }, { status: 400 });
  }

  const upperCode = code.trim().toUpperCase();
  if (!VALID_CODES.includes(upperCode)) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const envKey = `${upperCode}_PASSWORD`;
  const expectedPassword = process.env[envKey];

  if (!expectedPassword) {
    return NextResponse.json({ error: 'Auth not configured — contact your instructor' }, { status: 503 });
  }

  // Timing-safe comparison to prevent timing attacks
  let passwordMatches = false;
  try {
    const a = Buffer.from(password);
    const b = Buffer.from(expectedPassword);
    passwordMatches = a.length === b.length && timingSafeEqual(a, b);
  } catch {
    passwordMatches = false;
  }

  if (!passwordMatches) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  return NextResponse.json({ ok: true, code: upperCode, isAdmin: upperCode === 'LC3ADMIN' });
}
