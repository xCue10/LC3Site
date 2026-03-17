import { NextRequest, NextResponse } from 'next/server';
import { readJSON, writeJSON, Event } from '@/lib/data';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const events = readJSON<Event[]>('events.json');
  const index = events.findIndex((e) => e.id === id);
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  events[index] = {
    ...events[index],
    title: body.title ?? events[index].title,
    date: body.date ?? events[index].date,
    description: body.description ?? events[index].description,
    location: body.location ?? events[index].location,
    type: body.type ?? events[index].type,
    rsvpUrl: body.rsvpUrl ?? events[index].rsvpUrl,
  };
  writeJSON('events.json', events);
  return NextResponse.json(events[index]);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const events = readJSON<Event[]>('events.json');
  const filtered = events.filter((e) => e.id !== id);
  if (filtered.length === events.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  writeJSON('events.json', filtered);
  return NextResponse.json({ success: true });
}
