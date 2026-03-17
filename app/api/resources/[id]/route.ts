import { NextRequest, NextResponse } from 'next/server';
import { readJSON, writeJSON, Resource } from '@/lib/data';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const resources = readJSON<Resource[]>('resources.json');
  const idx = resources.findIndex((r) => r.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  resources[idx] = { ...resources[idx], ...body, id };
  writeJSON('resources.json', resources);
  return NextResponse.json(resources[idx]);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const resources = readJSON<Resource[]>('resources.json');
  writeJSON('resources.json', resources.filter((r) => r.id !== id));
  return NextResponse.json({ ok: true });
}
