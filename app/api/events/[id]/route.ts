import { NextRequest, NextResponse } from 'next/server';
import { readJSON, writeJSON, Event } from '@/lib/data';

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const events = readJSON<Event[]>('events.json');
  const filtered = events.filter((e) => e.id !== id);
  if (filtered.length === events.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  writeJSON('events.json', filtered);
  return NextResponse.json({ success: true });
}
