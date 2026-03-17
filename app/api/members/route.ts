import { NextRequest, NextResponse } from 'next/server';
import { readJSON, writeJSON, Member } from '@/lib/data';

export async function GET() {
  const members = readJSON<Member[]>('members.json');
  return NextResponse.json(members);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const members = readJSON<Member[]>('members.json');
  const newMember: Member = {
    id: Date.now().toString(),
    name: body.name || '',
    role: body.role || '',
    memberType: body.memberType || 'member',
    major: body.major || '',
    focusArea: body.focusArea || '',
    projects: Array.isArray(body.projects) ? body.projects : (body.projects || '').split(',').map((p: string) => p.trim()).filter(Boolean),
    github: body.github || '',
    linkedin: body.linkedin || '',
    twitter: body.twitter || '',
  };
  members.push(newMember);
  writeJSON('members.json', members);
  return NextResponse.json(newMember, { status: 201 });
}
