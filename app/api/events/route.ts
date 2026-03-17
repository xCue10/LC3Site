import { NextRequest, NextResponse } from 'next/server';
import { readJSON, writeJSON, Event } from '@/lib/data';

export async function GET() {
  const events = readJSON<Event[]>('events.json');
  const today = new Date().toISOString().slice(0, 10);
  let changed = false;
  const updated = events.map((e) => {
    if (e.type === 'upcoming' && e.date && e.date < today) {
      changed = true;
      return { ...e, type: 'past' as const };
    }
    return e;
  });
  if (changed) writeJSON('events.json', updated);
  return NextResponse.json(updated);
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

  const webhookUrl = process.env.DISCORD_EVENT_WEBHOOK_URL;
  if (webhookUrl) {
    const isUpcoming = newEvent.type === 'upcoming';
    const formattedDate = new Date(newEvent.date + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [{
          title: `📅 ${isUpcoming ? 'New Event Scheduled' : 'Past Event Added'}`,
          color: isUpcoming ? 0x3b82f6 : 0x64748b,
          fields: [
            { name: 'Event', value: newEvent.title, inline: false },
            { name: 'Date', value: formattedDate, inline: true },
            { name: 'Location', value: newEvent.location || 'TBD', inline: true },
            ...(newEvent.rsvpUrl ? [{ name: 'RSVP', value: newEvent.rsvpUrl, inline: false }] : []),
            { name: 'Description', value: newEvent.description || '—', inline: false },
          ],
          timestamp: new Date().toISOString(),
          footer: { text: 'LC3 Admin · Event created' },
        }],
      }),
    }).catch(() => {});
  }

  return NextResponse.json(newEvent, { status: 201 });
}
