import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { readJSON, writeJSON, Member } from '@/lib/data';
import { UserData } from '@/lib/shield-types';

interface SessionRecord extends UserData {
  displayName: string;
  createdAt: number;
  lastActiveAt: number;
}

type SessionStore = Record<string, SessionRecord>;

const STORE = 'shield-sessions.json';

// In-memory rate limiter
const attempts = new Map<string, { count: number; resetAt: number }>();
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const r = attempts.get(ip);
  if (!r || now > r.resetAt) { attempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 }); return false; }
  r.count++;
  return r.count > 10;
}
function getIp(req: NextRequest) {
  return req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
}

function makeToken(password: string, name: string): string {
  return createHmac('sha256', password)
    .update(name.toLowerCase().trim())
    .digest('hex')
    .slice(0, 40);
}

function verifyPassword(input: string, envVar: string): boolean {
  const expected = process.env[envVar];
  if (!expected) return false;
  try {
    const a = Buffer.from(input);
    const b = Buffer.from(expected);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch { return false; }
}

function getToken(req: NextRequest): string | null {
  const auth = req.headers.get('authorization');
  return auth?.startsWith('Bearer ') ? auth.slice(7) : null;
}

// POST /api/shield/session — login, create or restore session
export async function POST(req: NextRequest) {
  if (isRateLimited(getIp(req))) {
    return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 });
  }

  const { password, displayName: rawName = '', adminMode = false } = await req.json();
  if (!password) return NextResponse.json({ error: 'Password required' }, { status: 400 });

  const envVar = adminMode ? 'LC3ADMIN_PASSWORD' : 'LC3MEMBER_PASSWORD';
  if (!verifyPassword(password, envVar)) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const displayName = rawName.trim();
  if (!adminMode) {
    if (!displayName) return NextResponse.json({ error: 'Please select your name.' }, { status: 400 });
    const members = readJSON<Member[]>('members.json', []);
    const match = members.find(m => m.name.toLowerCase() === displayName.toLowerCase());
    if (!match) return NextResponse.json({ error: 'Name not found in the member list. Contact your club admin.' }, { status: 403 });
  }

  const resolvedName = adminMode ? 'Admin' : displayName;
  const passwordEnv = process.env[envVar]!;
  const token = makeToken(passwordEnv, resolvedName);
  const isAdmin = adminMode;
  const accessCode = adminMode ? 'LC3ADMIN' : 'LC3MEMBER';
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const sessions = readJSON<SessionStore>(STORE, {});

  if (sessions[token]) {
    const s = sessions[token];
    if (s.lastLoginDate === yesterday) s.loginStreak = (s.loginStreak || 1) + 1;
    else if (s.lastLoginDate !== today) s.loginStreak = 1;
    s.lastLoginDate = today;
    s.lastActiveAt = Date.now();
    s.isAdmin = isAdmin;
    s.accessCode = accessCode;
    s.loggedIn = true;
    writeJSON(STORE, sessions);
    return NextResponse.json({ token, userData: s });
  }

  const fresh: SessionRecord = {
    displayName: resolvedName,
    accessCode,
    isAdmin,
    mode: 'beginner',
    scanHistory: [],
    badges: [],
    totalScans: 0,
    totalIssuesFound: 0,
    loginStreak: 1,
    lastLoginDate: today,
    lastScanDate: today,
    scansToday: 0,
    loggedIn: true,
    createdAt: Date.now(),
    lastActiveAt: Date.now(),
  };
  sessions[token] = fresh;
  writeJSON(STORE, sessions);
  return NextResponse.json({ token, userData: fresh });
}

// GET /api/shield/session — fetch session data
export async function GET(req: NextRequest) {
  const token = getToken(req);
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const sessions = readJSON<SessionStore>(STORE, {});
  const session = sessions[token];
  if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

  return NextResponse.json({ ...session, loggedIn: true });
}

// PATCH /api/shield/session — update session (scan save, mark fixed, etc.)
export async function PATCH(req: NextRequest) {
  const token = getToken(req);
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const sessions = readJSON<SessionStore>(STORE, {});
  if (!sessions[token]) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

  const updates = await req.json() as Partial<SessionRecord>;
  // Whitelist what can be updated
  const allowed: (keyof SessionRecord)[] = [
    'scanHistory', 'badges', 'totalScans', 'totalIssuesFound',
    'scansToday', 'lastScanDate', 'loginStreak', 'lastLoginDate', 'mode',
  ];
  for (const key of allowed) {
    if (key in updates) {
      (sessions[token] as unknown as Record<string, unknown>)[key] = updates[key as keyof typeof updates];
    }
  }
  sessions[token].lastActiveAt = Date.now();
  writeJSON(STORE, sessions);
  return NextResponse.json({ ...sessions[token], loggedIn: true });
}
