import { NextResponse } from 'next/server';
import { readJSON, RSVP } from '@/lib/data';

export async function GET() {
  const rsvps = readJSON<RSVP[]>('rsvps.json');
  return NextResponse.json(rsvps);
}
