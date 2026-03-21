import { NextRequest, NextResponse } from 'next/server';
import { readJSON, writeJSON, Member } from '@/lib/data';

export async function GET(req: NextRequest) {
  const members = readJSON<Member[]>('members.json');
  const search = req.nextUrl.searchParams.get('search')?.toLowerCase().trim();
  if (!search) return NextResponse.json(members);
  return NextResponse.json(members.filter(m => m.name.toLowerCase().includes(search)));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const members = readJSON<Member[]>('members.json');
  const newMember: Member = {
    id: Date.now().toString(),
    name: body.name || '',
    role: body.role || '',
    memberType: body.memberType || 'member',
    majors: Array.isArray(body.majors) ? body.majors : (body.majors || '').split(',').map((s: string) => s.trim()).filter(Boolean),
    focusArea: body.focusArea || '',
    status: body.status || '',
    avatarUrl: body.avatarUrl || '',
    bio: body.bio || '',
    skills: Array.isArray(body.skills) ? body.skills : (body.skills || '').split(',').map((s: string) => s.trim()).filter(Boolean),
    projects: Array.isArray(body.projects) ? body.projects : (body.projects || '').split(',').map((p: string) => p.trim()).filter(Boolean),
    github: body.github || '',
    linkedin: body.linkedin || '',
    twitter: body.twitter || '',
  };
  members.push(newMember);
  writeJSON('members.json', members);
  return NextResponse.json(newMember, { status: 201 });
}
