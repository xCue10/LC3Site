import { NextRequest, NextResponse } from 'next/server';
import { readJSON, writeJSON, RSVP } from '@/lib/data';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rsvps = readJSON<RSVP[]>('rsvps.json');
  return NextResponse.json(rsvps.filter((r) => r.eventId === id));
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const rsvps = readJSON<RSVP[]>('rsvps.json');

  if (rsvps.some((r) => r.eventId === id && r.email.toLowerCase() === (body.email || '').toLowerCase())) {
    return NextResponse.json({ error: 'Already RSVPd with this email' }, { status: 409 });
  }

  const newRSVP: RSVP = {
    id: Date.now().toString(),
    eventId: id,
    name: body.name || '',
    email: body.email || '',
    submittedAt: new Date().toISOString(),
  };
  rsvps.push(newRSVP);
  writeJSON('rsvps.json', rsvps);
  return NextResponse.json(newRSVP, { status: 201 });
}
