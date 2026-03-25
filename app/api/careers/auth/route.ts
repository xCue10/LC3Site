import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';

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

function safeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const ip = getIp(req);
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 });
  }

  const { password } = await req.json() as { password: string };
  if (!password?.trim()) {
    return NextResponse.json({ error: 'Password required' }, { status: 400 });
  }

  const memberPassword = process.env.LC3MEMBER_PASSWORD;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!memberPassword) {
    return NextResponse.json({ error: 'Auth not configured — contact your instructor' }, { status: 503 });
  }

  if (safeCompare(password, memberPassword)) {
    return NextResponse.json({ ok: true, role: 'member' });
  }

  if (adminPassword && safeCompare(password, adminPassword)) {
    return NextResponse.json({ ok: true, role: 'admin' });
  }

  return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
}
