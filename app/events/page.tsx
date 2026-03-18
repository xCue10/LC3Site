import { readJSON, Event, RSVP } from '@/lib/data';
import type { Metadata } from 'next';
import Link from 'next/link';
import EventRSVPForm from './EventRSVPForm';

export const dynamic = 'force-dynamic';

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      {/* Header */}
      <div className="text-center mb-14">
        <svg width="72" height="72" viewBox="0 0 72 72" className="mx-auto mb-5 opacity-85 dark:opacity-75" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <style>{`
              @keyframes ev-spark { 0%,100%{opacity:0.3;transform:scale(0.85)} 50%{opacity:0.95;transform:scale(1.15)} }
              @keyframes ev-pulse { 0%,100%{opacity:0.5} 50%{opacity:1} }
              @keyframes ev-ring { 0%,100%{opacity:0.1} 50%{opacity:0.35} }
              @keyframes ev-corner { 0%,100%{opacity:0.4} 50%{opacity:0.9} }
            `}</style>
          </defs>
          <circle cx="36" cy="36" r="33" fill="#3b82f6" fillOpacity="0.07" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.3"/>
          {/* Calendar body */}
          <rect x="16" y="24" width="40" height="32" rx="5" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeOpacity="0.7"/>
          <rect x="16" y="24" width="40" height="11" rx="5" fill="#3b82f6" fillOpacity="0.18"/>
          <rect x="16" y="30" width="40" height="5" fill="#3b82f6" fillOpacity="0.18"/>
          {/* Pegs */}
          <rect x="26" y="20" width="3" height="8" rx="1.5" fill="#6366f1" fillOpacity="0.7"/>
          <rect x="43" y="20" width="3" height="8" rx="1.5" fill="#6366f1" fillOpacity="0.7"/>
          {/* Day dots */}
          <circle cx="26" cy="44" r="2.5" fill="#3b82f6" fillOpacity="0.55"/>
          <circle cx="36" cy="44" r="2.5" fill="#3b82f6" fillOpacity="0.55"/>
          <circle cx="46" cy="44" r="3" fill="#6366f1" fillOpacity="0.75" style={{animation:'ev-pulse 2s ease-in-out infinite'}}/>
          <circle cx="26" cy="52" r="2" fill="#3b82f6" fillOpacity="0.4"/>
          <circle cx="36" cy="52" r="2" fill="#818cf8" fillOpacity="0.45"/>
          {/* Sparkle dots */}
          <circle cx="8" cy="12" r="2.5" fill="#6366f1" fillOpacity="0.7" style={{animation:'ev-spark 2.2s ease-in-out infinite'}}/>
          <circle cx="62" cy="10" r="2" fill="#0891b2" fillOpacity="0.65" style={{animation:'ev-spark 2.2s ease-in-out infinite 0.55s'}}/>
          <circle cx="10" cy="60" r="2" fill="#818cf8" fillOpacity="0.65" style={{animation:'ev-spark 2.2s ease-in-out infinite 1.1s'}}/>
          <circle cx="62" cy="60" r="2.5" fill="#0891b2" fillOpacity="0.7" style={{animation:'ev-spark 2.2s ease-in-out infinite 1.65s'}}/>
          <circle cx="5" cy="36" r="1.5" fill="#6366f1" fillOpacity="0.5" style={{animation:'ev-spark 2.2s ease-in-out infinite 0.8s'}}/>
          <circle cx="67" cy="36" r="1.5" fill="#0891b2" fillOpacity="0.5" style={{animation:'ev-spark 2.2s ease-in-out infinite 1.3s'}}/>
          {/* Outer glow ring */}
          <circle cx="36" cy="36" r="35.5" fill="none" stroke="#6366f1" strokeWidth="1" strokeOpacity="1" style={{animation:'ev-ring 3s ease-in-out infinite'}}/>
          {/* Corner accents */}
          <path d="M12 2 L2 2 L2 12" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{animation:'ev-corner 3s ease-in-out infinite'}}/>
          <path d="M60 2 L70 2 L70 12" fill="none" stroke="#0891b2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{animation:'ev-corner 3s ease-in-out infinite 0.75s'}}/>
          <path d="M12 70 L2 70 L2 60" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{animation:'ev-corner 3s ease-in-out infinite 1.5s'}}/>
          <path d="M60 70 L70 70 L70 60" fill="none" stroke="#0891b2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{animation:'ev-corner 3s ease-in-out infinite 2.25s'}}/>
        </svg>
        <p className="text-blue-600 dark:text-blue-400 text-sm font-medium mb-2">Stay in the loop</p>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">Events</h1>
        <p className="text-slate-500 max-w-xl mx-auto">
          From workshops and hackathons to industry panels — there&apos;s always something going on.
        </p>
      </div>

      {/* Upcoming Events */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Upcoming</h2>
          {upcoming.length > 0 && (
            <span className="bg-blue-50 border border-blue-200 text-blue-600 text-xs font-medium px-2.5 py-1 rounded-full dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-400">
              {upcoming.length} event{upcoming.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {upcoming.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-400 dark:bg-[#0d1424] dark:border-[#1e2d45] dark:text-slate-500">
            No upcoming events scheduled. Check back soon!
          </div>
        ) : (
          <div className="space-y-4">
            {upcoming.map((event) => (
              <div
                key={event.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-200 hover:shadow-sm transition-all group dark:bg-[#0d1424] dark:border-[#1e2d45] dark:hover:border-blue-500/30 dark:hover:shadow-none"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* Date block */}
                  <div className="flex-shrink-0 text-center bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 sm:min-w-[64px] dark:bg-blue-500/10 dark:border-blue-500/20">
                    <div className="text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wide">
                      {new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })}
                    </div>
                    <div className="text-slate-900 dark:text-white text-3xl font-bold leading-tight">
                      {new Date(event.date + 'T00:00:00').getDate()}
                    </div>
                    <div className="text-slate-400 text-xs">
                      {new Date(event.date + 'T00:00:00').getFullYear()}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse dark:bg-blue-400" />
                      <span className="text-blue-600 dark:text-blue-400 text-xs font-medium uppercase tracking-wide">Upcoming</span>
                    </div>
                    <Link href={`/events/${event.id}`} className="hover:underline underline-offset-2 decoration-blue-400">
                      <h3 className="text-slate-900 dark:text-white text-xl font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                        {event.title}
                      </h3>
                    </Link>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4 line-clamp-2">{event.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-4">
                      <span className="flex items-center gap-1.5">
                        <CalendarIcon />
                        {formatDate(event.date)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <LocationIcon />
                        {event.location}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <EventRSVPForm eventId={event.id} initialCount={rsvpCounts[event.id] ?? 0} />
                      <a
                        href={`/api/events/${event.id}/ics`}
                        download
                        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                      >
                        <CalendarIcon />
                        Add to Calendar
                      </a>
                      <Link href={`/events/${event.id}`} className="text-xs text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors ml-auto">
                        View Details →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Past Events */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Past Events</h2>
          {past.length > 0 && (
            <span className="bg-slate-100 border border-slate-200 text-slate-500 text-xs font-medium px-2.5 py-1 rounded-full dark:bg-slate-700/50 dark:border-slate-600/30 dark:text-slate-400">
              {past.length} event{past.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {past.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-400 dark:bg-[#0d1424] dark:border-[#1e2d45] dark:text-slate-500">
            No past events recorded yet.
          </div>
        ) : (
          <div className="space-y-4">
            {past.map((event) => (
              <div
                key={event.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 opacity-80 hover:opacity-100 transition-all group dark:bg-[#0d1424] dark:border-[#1e2d45]"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* Date block */}
                  <div className="flex-shrink-0 text-center bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 sm:min-w-[64px] dark:bg-slate-700/20 dark:border-slate-700/30">
                    <div className="text-slate-400 text-xs font-semibold uppercase tracking-wide">
                      {new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })}
                    </div>
                    <div className="text-slate-600 dark:text-slate-300 text-3xl font-bold leading-tight">
                      {new Date(event.date + 'T00:00:00').getDate()}
                    </div>
                    <div className="text-slate-400 dark:text-slate-600 text-xs">
                      {new Date(event.date + 'T00:00:00').getFullYear()}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 bg-slate-400 dark:bg-slate-600 rounded-full" />
                      <span className="text-slate-400 dark:text-slate-500 text-xs font-medium uppercase tracking-wide">Past</span>
                    </div>
                    <Link href={`/events/${event.id}`} className="hover:underline underline-offset-2 decoration-slate-400">
                      <h3 className="text-slate-700 dark:text-slate-300 text-xl font-semibold mb-2 hover:text-slate-900 dark:hover:text-white transition-colors">{event.title}</h3>
                    </Link>
                    <p className="text-slate-500 leading-relaxed mb-4 line-clamp-2">{event.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <CalendarIcon />
                        {formatDate(event.date)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <LocationIcon />
                        {event.location}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
