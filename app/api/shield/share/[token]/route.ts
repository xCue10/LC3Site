import { NextRequest, NextResponse } from 'next/server';
import { readJSON } from '@/lib/data';
import { ScanResult } from '@/lib/shield-types';

interface SharedResult {
  result: ScanResult;
  expiresAt: number;
  createdAt: number;
}

type ShareStore = Record<string, SharedResult>;

export async function GET(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const store = readJSON<ShareStore>('shield-shares.json', {});
  const entry = store[token];

  if (!entry) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }
  if (Date.now() > entry.expiresAt) {
    return NextResponse.json({ error: 'expired' }, { status: 410 });
  }

  return NextResponse.json({ result: entry.result, createdAt: entry.createdAt });
}
