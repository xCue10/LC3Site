import { readJSON, Event, RSVP } from '@/lib/data';
import type { Metadata } from 'next';
import Link from 'next/link';
import EventRSVPForm from './EventRSVPForm';
import EventCountdown from '@/app/components/EventCountdown';

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
      <div className="grid md:grid-cols-2 gap-10 items-center mb-14">
        {/* Left: text */}
        <div>
          <p className="text-blue-600 dark:text-blue-400 text-sm font-medium mb-2">Stay in the loop</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">Events</h1>
          <p className="text-slate-500">
            From workshops and hackathons to industry panels — there&apos;s always something going on.
          </p>
        </div>
        {/* Right: SVG */}
        <div className="flex justify-center md:justify-end overflow-hidden">
        <svg width="320" height="140" viewBox="0 0 320 140" fill="none" className="opacity-90 dark:opacity-80" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <style>{`
              @keyframes ev2-dash { to { stroke-dashoffset: -22; } }
              @keyframes ev2-spark { 0%,100%{opacity:0.3;transform:scale(0.9)} 50%{opacity:0.85;transform:scale(1.1)} }
              @keyframes ev2-corner { 0%,100%{opacity:0.35} 50%{opacity:0.8} }
              @keyframes ev2-badge { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
              @keyframes ev2-node2 { 0%,100%{opacity:0.6} 50%{opacity:1} }
              @keyframes ev2-notif { 0%,100%{transform:scale(1);opacity:0.85} 50%{transform:scale(1.15);opacity:1} }
            `}</style>
            <radialGradient id="ev2-g1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35"/>
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
            </radialGradient>
            <radialGradient id="ev2-g2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.5"/>
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0"/>
            </radialGradient>
            <radialGradient id="ev2-g3" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35"/>
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0"/>
            </radialGradient>
          </defs>

          {/* Corner brackets */}
          <path d="M8 8 L8 22 M8 8 L22 8" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5" strokeLinecap="round" style={{animation:'ev2-corner 3s ease-in-out infinite'}}/>
          <path d="M312 8 L312 22 M312 8 L298 8" stroke="rgba(8,145,178,0.4)" strokeWidth="1.5" strokeLinecap="round" style={{animation:'ev2-corner 3s ease-in-out infinite 0.75s'}}/>
          <path d="M8 132 L8 118 M8 132 L22 132" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5" strokeLinecap="round" style={{animation:'ev2-corner 3s ease-in-out infinite 1.5s'}}/>
          <path d="M312 132 L312 118 M312 132 L298 132" stroke="rgba(8,145,178,0.4)" strokeWidth="1.5" strokeLinecap="round" style={{animation:'ev2-corner 3s ease-in-out infinite 2.25s'}}/>

          {/* Timeline baseline */}
          <line x1="48" y1="70" x2="272" y2="70" stroke="rgba(99,102,241,0.12)" strokeWidth="2.5"/>
          <line x1="48" y1="70" x2="272" y2="70" stroke="rgba(99,102,241,0.45)" strokeWidth="1.5" strokeDasharray="6 6" style={{animation:'ev2-dash 1s linear infinite'}}/>

          {/* Node 1 — Workshop */}
          <circle cx="80" cy="70" r="26" fill="url(#ev2-g1)"/>
          <circle cx="80" cy="70" r="16" fill="rgba(59,130,246,0.1)" stroke="rgba(59,130,246,0.5)" strokeWidth="1.5"/>
          <circle cx="80" cy="70" r="6" fill="#3b82f6" opacity="0.85"/>
          <text x="80" y="40" textAnchor="middle" fill="rgba(99,102,241,0.7)" fontSize="8" fontFamily="monospace" fontWeight="600">MAR 15</text>
          <rect x="57" y="94" width="46" height="14" rx="4" fill="rgba(59,130,246,0.08)" stroke="rgba(59,130,246,0.22)" strokeWidth="0.8"/>
          <text x="80" y="104" textAnchor="middle" fill="rgba(59,130,246,0.75)" fontSize="7" fontFamily="monospace">WORKSHOP</text>

          {/* Node 2 — Hackathon (featured) */}
          <circle cx="160" cy="70" r="30" fill="url(#ev2-g2)">
            <animate attributeName="r" values="28;34;28" dur="2.5s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="1;0.55;1" dur="2.5s" repeatCount="indefinite"/>
          </circle>
          <circle cx="160" cy="70" r="19" fill="rgba(139,92,246,0.14)" stroke="rgba(139,92,246,0.65)" strokeWidth="2"/>
          <circle cx="160" cy="70" r="7.5" fill="#8b5cf6" style={{animation:'ev2-node2 1.8s ease-in-out infinite'}}/>
          <rect x="140" y="30" width="40" height="15" rx="7" fill="rgba(139,92,246,0.85)" style={{animation:'ev2-badge 2s ease-in-out infinite', transformOrigin:'160px 37px'}}>
            <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite"/>
          </rect>
          <text x="160" y="41" textAnchor="middle" fill="white" fontSize="7" fontFamily="monospace" fontWeight="700">NEXT UP</text>
          <rect x="132" y="96" width="56" height="14" rx="4" fill="rgba(139,92,246,0.1)" stroke="rgba(139,92,246,0.32)" strokeWidth="0.8"/>
          <text x="160" y="106" textAnchor="middle" fill="rgba(139,92,246,0.9)" fontSize="7" fontFamily="monospace">HACKATHON</text>

          {/* Notification dot */}
          <circle cx="176" cy="53" r="6" fill="#ef4444" style={{animation:'ev2-notif 1.4s ease-in-out infinite', transformOrigin:'176px 53px'}}>
            <animate attributeName="opacity" values="0.8;1;0.8" dur="1.4s" repeatCount="indefinite"/>
          </circle>
          <text x="176" y="56.5" textAnchor="middle" fill="white" fontSize="6.5" fontWeight="700">!</text>

          {/* Node 3 — Speaker */}
          <circle cx="240" cy="70" r="26" fill="url(#ev2-g3)"/>
          <circle cx="240" cy="70" r="16" fill="rgba(6,182,212,0.1)" stroke="rgba(6,182,212,0.42)" strokeWidth="1.5"/>
          <circle cx="240" cy="70" r="6" fill="#06b6d4" opacity="0.78"/>
          <text x="240" y="40" textAnchor="middle" fill="rgba(6,182,212,0.65)" fontSize="8" fontFamily="monospace" fontWeight="600">APR 22</text>
          <rect x="218" y="94" width="44" height="14" rx="4" fill="rgba(6,182,212,0.07)" stroke="rgba(6,182,212,0.22)" strokeWidth="0.8"/>
          <text x="240" y="104" textAnchor="middle" fill="rgba(6,182,212,0.72)" fontSize="7" fontFamily="monospace">SPEAKER</text>

          {/* Sparkle dots */}
          <circle cx="26" cy="26" r="2.5" fill="#6366f1" opacity="0.65" style={{animation:'ev2-spark 2.3s ease-in-out infinite'}}/>
          <circle cx="293" cy="24" r="2" fill="#0891b2" opacity="0.6" style={{animation:'ev2-spark 2.3s ease-in-out infinite 0.7s'}}/>
          <circle cx="26" cy="114" r="2" fill="#818cf8" opacity="0.6" style={{animation:'ev2-spark 2.3s ease-in-out infinite 1.4s'}}/>
          <circle cx="293" cy="114" r="2.5" fill="#0891b2" opacity="0.65" style={{animation:'ev2-spark 2.3s ease-in-out infinite 2.1s'}}/>
        </svg>
        </div>
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

        <EventCountdown events={upcoming.map((e) => ({ id: e.id, title: e.title, date: e.date }))} />

        {upcoming.length > 0 && (
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
