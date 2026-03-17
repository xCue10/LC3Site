import { NextRequest, NextResponse } from 'next/server';
import { readJSON, writeJSON, Member } from '@/lib/data';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const members = readJSON<Member[]>('members.json');
  const index = members.findIndex((m) => m.id === id);
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  members[index] = {
    ...members[index],
    name: body.name ?? members[index].name,
    role: body.role ?? members[index].role,
    memberType: body.memberType ?? members[index].memberType,
    majors: Array.isArray(body.majors)
      ? body.majors
      : (body.majors || '').split(',').map((s: string) => s.trim()).filter(Boolean),
    focusArea: body.focusArea ?? members[index].focusArea,
    status: body.status ?? members[index].status ?? '',
    avatarUrl: body.avatarUrl ?? members[index].avatarUrl ?? '',
    bio: body.bio ?? members[index].bio ?? '',
    skills: Array.isArray(body.skills)
      ? body.skills
      : (body.skills || '').split(',').map((s: string) => s.trim()).filter(Boolean),
    projects: Array.isArray(body.projects)
      ? body.projects
      : (body.projects || '').split(',').map((p: string) => p.trim()).filter(Boolean),
    github: body.github ?? members[index].github,
    linkedin: body.linkedin ?? members[index].linkedin,
    twitter: body.twitter ?? members[index].twitter,
  };
  writeJSON('members.json', members);
  return NextResponse.json(members[index]);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const members = readJSON<Member[]>('members.json');
  const filtered = members.filter((m) => m.id !== id);
  if (filtered.length === members.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  writeJSON('members.json', filtered);
  return NextResponse.json({ success: true });
}
