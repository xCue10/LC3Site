import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { readJSON } from '@/lib/data';

interface Member { id: string; name: string; }

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

  const body = await req.json() as { password?: string; name?: string };
  const { password, name } = body;

  if (!password?.trim()) {
    return NextResponse.json({ error: 'Password required' }, { status: 400 });
  }

  const memberPassword = process.env.LC3MEMBER_PASSWORD;
  const adminPassword = process.env.LC3ADMIN_PASSWORD;

  if (!memberPassword) {
    return NextResponse.json({ error: 'Auth not configured — contact your instructor' }, { status: 503 });
  }

  const members = readJSON<Member[]>('members.json', []);

  // Admin login — name must match a Club Officer in members.json
  if (adminPassword && safeCompare(password, adminPassword)) {
    if (!name?.trim()) {
      return NextResponse.json({ error: 'Name required' }, { status: 400 });
    }

    const match = members.find(
      (m) => m.name.toLowerCase().trim() === name.toLowerCase().trim() && m.memberType === 'officer'
    );

    if (!match) {
      return NextResponse.json({ error: 'Name not found. Admin access is restricted to Club Officers.' }, { status: 401 });
    }

    return NextResponse.json({ ok: true, role: 'admin', memberId: match.id, memberName: match.name });
  }

  // Member login — name must match any member in members.json
  if (safeCompare(password, memberPassword)) {
    if (!name?.trim()) {
      return NextResponse.json({ error: 'Name required' }, { status: 400 });
    }

    const match = members.find(
      (m) => m.name.toLowerCase().trim() === name.toLowerCase().trim()
    );

    if (!match) {
      return NextResponse.json({ error: 'Name not found. Make sure your name matches our member list.' }, { status: 401 });
    }

    return NextResponse.json({ ok: true, role: 'member', memberId: match.id, memberName: match.name });
  }

  return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
}
