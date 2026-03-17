import { NextRequest, NextResponse } from 'next/server';
import { readJSON, Event } from '@/lib/data';

function escapeIcs(str: string) {
  return str.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const events = readJSON<Event[]>('events.json');
  const event = events.find((e) => e.id === id);
  if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Date as YYYYMMDD
  const dateStr = event.date.replace(/-/g, '');
  // Next day for DTEND (all-day event)
  const d = new Date(event.date + 'T00:00:00');
  d.setDate(d.getDate() + 1);
  const endStr = d.toISOString().slice(0, 10).replace(/-/g, '');

  const uid = `${event.id}@lc3.club`;
  const now = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//LC3 Lowcode Cloud Club//Events//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${now}Z`,
    `DTSTART;VALUE=DATE:${dateStr}`,
    `DTEND;VALUE=DATE:${endStr}`,
    `SUMMARY:${escapeIcs(event.title)}`,
    `DESCRIPTION:${escapeIcs(event.description || '')}`,
    `LOCATION:${escapeIcs(event.location || '')}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  return new NextResponse(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="event-${event.id}.ics"`,
    },
  });
}
