import { NextRequest, NextResponse } from 'next/server';
import { readJSON, Member } from '@/lib/data';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');
  
  if (!key) return NextResponse.json({ error: 'Missing key' }, { status: 400 });
  
  const members = readJSON<Member[]>('members.json', []);
  // In our simplified logic, the key is the member ID itself (or a custom field)
  // For production, we'd use a real auth/hashed token system
  const member = members.find(m => m.id === key);
  
  if (!member) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  
  return NextResponse.json(member);
}
