import { NextRequest, NextResponse } from 'next/server';
import { readJSON, Member } from '@/lib/data';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');
  const memberPassword = process.env.LC3MEMBER_PASSWORD;
  
  if (!key) return NextResponse.json({ error: 'Missing key' }, { status: 400 });

  // Check against the global member password set in Railway
  if (!memberPassword || key !== memberPassword) {
    return NextResponse.json({ error: 'Invalid key' }, { status: 401 });
  }
  
  // If the password is correct, we need to know WHICH member is logging in.
  // For now, let's return a success status. 
  // Optimization: The portal should probably ask for Email + Club Password.
  return NextResponse.json({ authenticated: true });
}
