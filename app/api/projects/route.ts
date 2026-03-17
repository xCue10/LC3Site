import { NextRequest, NextResponse } from 'next/server';
import { readJSON, writeJSON, Project } from '@/lib/data';

export async function GET() {
  const projects = readJSON<Project[]>('projects.json');
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const projects = readJSON<Project[]>('projects.json');
  const newProject: Project = {
    id: Date.now().toString(),
    name: body.name || '',
    description: body.description || '',
    tags: Array.isArray(body.tags) ? body.tags : [],
    gradient: body.gradient || 'from-blue-500 to-violet-500',
  };
  projects.push(newProject);
  writeJSON('projects.json', projects);
  return NextResponse.json(newProject, { status: 201 });
}
