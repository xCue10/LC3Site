import { NextRequest, NextResponse } from 'next/server';
import { readJSON, writeJSON, Event } from '@/lib/data';

export async function GET() {
  const events = readJSON<Event[]>('events.json');
  return NextResponse.json(events);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const events = readJSON<Event[]>('events.json');
  const newEvent: Event = {
    id: Date.now().toString(),
    title: body.title || '',
    date: body.date || '',
    description: body.description || '',
    location: body.location || '',
    type: body.type === 'past' ? 'past' : 'upcoming',
    ...(body.rsvpUrl ? { rsvpUrl: body.rsvpUrl } : {}),
  };
  events.push(newEvent);
  writeJSON('events.json', events);
  return NextResponse.json(newEvent, { status: 201 });
}
