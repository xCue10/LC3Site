import { NextRequest, NextResponse } from 'next/server';
import { readJSON, writeJSON, Member } from '@/lib/data';

export async function PUT(req: NextRequest) {
  const { ids } = await req.json() as { ids: string[] };
  const members = readJSON<Member[]>('members.json');
  const map = new Map(members.map((m) => [m.id, m]));
  const reordered = ids.map((id) => map.get(id)).filter(Boolean) as Member[];
  // Append any members not in the ids list at the end (safety)
  members.forEach((m) => { if (!ids.includes(m.id)) reordered.push(m); });
  writeJSON('members.json', reordered);
  return NextResponse.json(reordered);
}
