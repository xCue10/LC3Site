import { NextRequest, NextResponse } from 'next/server';
import { readJSON, writeJSON } from '@/lib/data';
import { ScanResult } from '@/lib/shield-types';
import { randomBytes } from 'crypto';

interface SharedResult {
  result: ScanResult;
  expiresAt: number;
  createdAt: number;
}

type ShareStore = Record<string, SharedResult>;

const EXPIRY_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function pruneExpired(store: ShareStore): ShareStore {
  const now = Date.now();
  return Object.fromEntries(Object.entries(store).filter(([, v]) => v.expiresAt > now));
}

export async function POST(req: NextRequest) {
  try {
    const { result } = await req.json() as { result: ScanResult };
    if (!result || !result.id || !result.type) {
      return NextResponse.json({ error: 'Invalid result' }, { status: 400 });
    }

    const store = pruneExpired(readJSON<ShareStore>('shield-shares.json', {}));
    const token = randomBytes(12).toString('hex');
    store[token] = { result, expiresAt: Date.now() + EXPIRY_MS, createdAt: Date.now() };
    writeJSON('shield-shares.json', store);

    return NextResponse.json({ token });
  } catch {
    return NextResponse.json({ error: 'Failed to create share link' }, { status: 500 });
  }
}
