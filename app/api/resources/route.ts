import { NextRequest, NextResponse } from 'next/server';
import { readJSON, writeJSON, Resource } from '@/lib/data';

export async function GET() {
  const resources = readJSON<Resource[]>('resources.json');
  return NextResponse.json(resources);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  writeJSON('resources.json', body);
  return NextResponse.json({ ok: true });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const resources = readJSON<Resource[]>('resources.json');
  const newResource: Resource = {
    id: Date.now().toString(),
    title: body.title || '',
    description: body.description || '',
    url: body.url || '',
    category: body.category || 'General',
  };
  resources.push(newResource);
  writeJSON('resources.json', resources);
  return NextResponse.json(newResource, { status: 201 });
}
