import { readJSON, Event, RSVP } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import EventRSVPForm from '../EventRSVPForm';

export const revalidate = 30;

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const event = readJSON<Event[]>('events.json').find((e) => e.id === id);
  if (!event) return {};
  return { title: event.title, description: event.description };
}

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = readJSON<Event[]>('events.json').find((e) => e.id === id);
  if (!event) notFound();

  const rsvpCount = readJSON<RSVP[]>('rsvps.json').filter((r) => r.eventId === id).length;
  const isUpcoming = event.type === 'upcoming';

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <Link
        href="/events"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white text-sm mb-10 transition-colors group"
      >
        <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        All Events
      </Link>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden dark:bg-[#0d1424] dark:border-[#1e2d45]">
        <div className={`h-1.5 ${isUpcoming ? 'bg-gradient-to-r from-blue-500 to-violet-600' : 'bg-gradient-to-r from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700'}`} />

        <div className="p-8">
          {/* Date + Status + Title */}
          <div className="flex items-start gap-4 mb-6">
            <div className={`flex-shrink-0 text-center rounded-xl px-4 py-3 min-w-[64px] ${isUpcoming ? 'bg-blue-50 border border-blue-100 dark:bg-blue-500/10 dark:border-blue-500/20' : 'bg-slate-100 border border-slate-200 dark:bg-slate-700/20 dark:border-slate-700/30'}`}>
              <div className={`text-xs font-semibold uppercase tracking-wide ${isUpcoming ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>
                {new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })}
              </div>
              <div className={`text-3xl font-bold leading-tight ${isUpcoming ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                {new Date(event.date + 'T00:00:00').getDate()}
              </div>
              <div className="text-slate-400 text-xs">{new Date(event.date + 'T00:00:00').getFullYear()}</div>
            </div>
            <div className="flex-1 min-w-0">
              {isUpcoming ? (
                <span className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 text-xs font-medium uppercase tracking-wide mb-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse dark:bg-blue-400" />
                  Upcoming
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-slate-400 text-xs font-medium uppercase tracking-wide mb-2">
                  <span className="w-2 h-2 bg-slate-400 rounded-full" />
                  Past Event
                </span>
              )}
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-tight">{event.title}</h1>
            </div>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-6 pb-6 border-b border-slate-200 dark:border-[#1e2d45]">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(event.date)}
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {event.location}
            </span>
          </div>

          {/* Description */}
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[15px] mb-8 whitespace-pre-wrap">{event.description}</p>

          {/* External Sign Up CTA */}
          {isUpcoming && event.rsvpUrl && (
            <a
              href={event.rsvpUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-base font-semibold px-6 py-3.5 rounded-xl hover:opacity-90 transition-opacity shadow-md mb-6"
            >
              Sign Up for this Event
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          )}

          {/* RSVP section */}
          {isUpcoming && (
            <div className="bg-slate-50 dark:bg-[#111a2e] rounded-xl p-5 border border-slate-200 dark:border-[#1e2d45] mb-4">
              <h2 className="text-slate-900 dark:text-white font-semibold mb-1">RSVP for this event</h2>
              <p className="text-slate-500 text-sm mb-4">Let us know you&apos;re coming so we can plan accordingly.</p>
              <EventRSVPForm eventId={event.id} initialCount={rsvpCount} />
            </div>
          )}

          {/* Add to calendar */}
          {isUpcoming && (
            <a
              href={`/api/events/${event.id}/ics`}
              download
              className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Add to Calendar
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
