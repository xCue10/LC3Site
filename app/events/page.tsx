import { readJSON, Event, RSVP } from '@/lib/data';
import type { Metadata } from 'next';
import Link from 'next/link';
import EventRSVPForm from './EventRSVPForm';
import EventCountdown from '@/app/components/EventCountdown';
import { EventTimeline } from '../components/Illustrations';

export const revalidate = 30;

export const metadata: Metadata = {
  title: 'Events',
  description: 'Upcoming and past events hosted by LC3 - Lowcode Cloud Club. Workshops, hackathons, speaker sessions, and more.',
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function CalendarIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

export default function EventsPage() {
  const events = readJSON<Event[]>('events.json');
  const rsvps = readJSON<RSVP[]>('rsvps.json');
  const rsvpCounts = rsvps.reduce<Record<string, number>>((acc, r) => {
    acc[r.eventId] = (acc[r.eventId] ?? 0) + 1;
    return acc;
  }, {});
  const upcoming = events.filter((e) => e.type === 'upcoming').sort((a, b) => a.date.localeCompare(b.date));
  const past = events.filter((e) => e.type === 'past').sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200 dark:border-[#1e2d45]">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-violet-50/30 to-transparent dark:from-blue-950/20 dark:via-violet-950/10 dark:to-transparent pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center text-center md:text-left">
            <div>
              <p className="text-blue-600 dark:text-blue-400 text-sm font-bold uppercase tracking-widest mb-3">Stay in the loop</p>
              <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">Events</h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-md">
                From workshops and hackathons to industry panels — there&apos;s always something going on at LC3.
              </p>
            </div>
            <div className="flex justify-center md:justify-end">
              <EventTimeline />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <section className="mb-24">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Upcoming</h2>
            <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-blue-500/20">
              {upcoming.length} LIVE
            </span>
          </div>

          <EventCountdown events={upcoming.map((e) => ({ id: e.id, title: e.title, date: e.date }))} />

          <div className="grid gap-6">
            {upcoming.map((event) => (
              <div key={event.id} className="bg-white border border-slate-200 rounded-3xl p-8 hover:border-blue-400/50 hover:shadow-2xl transition-all group dark:bg-white/5 dark:border-white/10">
                <div className="flex flex-col sm:flex-row gap-8">
                  <div className="flex-shrink-0 text-center bg-blue-600 rounded-2xl px-6 py-5 min-w-[100px] text-white shadow-xl shadow-blue-500/30 group-hover:scale-105 transition-transform">
                    <div className="text-xs font-bold uppercase tracking-widest opacity-90">{new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })}</div>
                    <div className="text-4xl font-black leading-none my-1">{new Date(event.date + 'T00:00:00').getDate()}</div>
                    <div className="text-xs font-bold opacity-70">{new Date(event.date + 'T00:00:00').getFullYear()}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                      <span className="text-blue-600 text-xs font-bold uppercase tracking-wider">Registration Open</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 transition-colors">{event.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-6">{event.description}</p>
                    <div className="flex flex-wrap gap-6 text-sm font-medium text-slate-400 mb-8">
                      <span className="flex items-center gap-2"><CalendarIcon /> {formatDate(event.date)}</span>
                      <span className="flex items-center gap-2"><LocationIcon /> {event.location}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 border-t border-slate-100 dark:border-white/5 pt-6">
                      <EventRSVPForm eventId={event.id} initialCount={rsvpCounts[event.id] ?? 0} />
                      <Link href={`/events/${event.id}`} className="text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors ml-auto">Details →</Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Past Events</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {past.map((event) => (
              <div key={event.id} className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 opacity-80 hover:opacity-100 transition-opacity">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">{formatDate(event.date)}</div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">{event.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{event.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
