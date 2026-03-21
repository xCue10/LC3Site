import { NextRequest, NextResponse } from 'next/server';
import { readJSON, writeJSON, Member } from '@/lib/data';
import { timingSafeEqual } from 'crypto';

const MEMBER_CODE = process.env.LC3MEMBER_PASSWORD;

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { code, bio, github, linkedin, twitter, avatarUrl, skills, majors } = await req.json();

  // Verify the LC3MEMBER code
  if (!MEMBER_CODE) {
    return NextResponse.json({ error: 'Auth not configured' }, { status: 503 });
  }
  let valid = false;
  try {
    const a = Buffer.from(code ?? '');
    const b = Buffer.from(MEMBER_CODE);
    valid = a.length === b.length && timingSafeEqual(a, b);
  } catch {
    valid = false;
  }
  if (!valid) {
    return NextResponse.json({ error: 'Invalid code' }, { status: 401 });
  }

  const members = readJSON<Member[]>('members.json', []);
  const idx = members.findIndex(m => m.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: 'Member not found' }, { status: 404 });
  }

  // Only allow editing safe fields
  if (bio !== undefined) members[idx].bio = String(bio).slice(0, 500);
  if (github !== undefined) members[idx].github = String(github).slice(0, 200);
  if (linkedin !== undefined) members[idx].linkedin = String(linkedin).slice(0, 200);
  if (twitter !== undefined) members[idx].twitter = String(twitter).slice(0, 200);
  if (avatarUrl !== undefined) members[idx].avatarUrl = String(avatarUrl).slice(0, 500);
  if (Array.isArray(skills)) members[idx].skills = skills.map(String).slice(0, 20);
  if (Array.isArray(majors)) members[idx].majors = majors.map(String).slice(0, 10);

  writeJSON('members.json', members);
  return NextResponse.json({ ok: true, member: members[idx] });
}
