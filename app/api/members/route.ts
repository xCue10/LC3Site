import { NextRequest, NextResponse } from 'next/server';
import { readJSON, Member } from '@/lib/data';

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.get('search')?.toLowerCase().trim();
  const members = readJSON<Member[]>('members.json', []);
  if (!search) return NextResponse.json(members);
  const filtered = members.filter(m => m.name.toLowerCase().includes(search));
  return NextResponse.json(filtered);
}
