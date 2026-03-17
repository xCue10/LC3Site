import { NextRequest, NextResponse } from 'next/server';
import { readJSON, writeJSON, Project } from '@/lib/data';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const projects = readJSON<Project[]>('projects.json');
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  projects[index] = {
    ...projects[index],
    name: body.name ?? projects[index].name,
    description: body.description ?? projects[index].description,
    tags: Array.isArray(body.tags)
      ? body.tags
      : (body.tags || '').split(',').map((t: string) => t.trim()).filter(Boolean),
    gradient: body.gradient ?? projects[index].gradient,
    github: body.github ?? projects[index].github,
  };
  writeJSON('projects.json', projects);
  return NextResponse.json(projects[index]);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const projects = readJSON<Project[]>('projects.json');
  const filtered = projects.filter((p) => p.id !== id);
  if (filtered.length === projects.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  writeJSON('projects.json', filtered);
  return NextResponse.json({ success: true });
}
