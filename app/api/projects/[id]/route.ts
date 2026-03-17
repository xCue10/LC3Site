import { NextRequest, NextResponse } from 'next/server';
import { readJSON, writeJSON, Project } from '@/lib/data';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const projects = readJSON<Project[]>('projects.json');
  const idx = projects.findIndex((p) => p.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  projects[idx] = {
    ...projects[idx],
    name: body.name ?? projects[idx].name,
    description: body.description ?? projects[idx].description,
    tags: Array.isArray(body.tags) ? body.tags : projects[idx].tags,
    gradient: body.gradient ?? projects[idx].gradient,
  };
  writeJSON('projects.json', projects);
  return NextResponse.json(projects[idx]);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const projects = readJSON<Project[]>('projects.json');
  const filtered = projects.filter((p) => p.id !== id);
  if (filtered.length === projects.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  writeJSON('projects.json', filtered);
  return NextResponse.json({ success: true });
}
