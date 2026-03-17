import Link from 'next/link';
import { readJSON, Member, Event } from '@/lib/data';

const featuredProjects = [
  {
    name: 'AI Study Bot',
    description: 'A GPT-powered study assistant that helps students prep for exams through flashcards and Q&A.',
    tags: ['Python', 'OpenAI', 'FastAPI'],
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'Campus Event Tracker',
    description: 'Real-time dashboard aggregating campus events and club activities in one convenient place.',
    tags: ['Next.js', 'PostgreSQL', 'Tailwind'],
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    name: 'CTF Toolkit',
    description: 'A collection of open-source scripts and tools used by our cybersecurity team in competitions.',
    tags: ['Python', 'Bash', 'Cryptography'],
    gradient: 'from-pink-500 to-rose-500',
  },
];

export default function HomePage() {
  const members = readJSON<Member[]>('members.json');
  const events = readJSON<Event[]>('events.json');
  const upcomingEvents = events.filter((e) => e.type === 'upcoming').slice(0, 2);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-3xl" />
          <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm px-4 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" />
            Now recruiting for Spring 2026
          </div>

          <h1 className="text-5xl sm:text-7xl font-bold text-white mb-6 tracking-tight">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-blue-400 to-violet-500 bg-clip-text text-transparent">
              Tech Club
            </span>
          </h1>

          <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            We are a community of passionate students building real projects, learning from each other, and launching
            careers in tech — one hackathon at a time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40"
            >
              Join the Club
            </Link>
            <Link
              href="/members"
              className="px-8 py-3.5 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
            >
              Meet the Team
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-[#1e1e2e] bg-[#0f0f1a]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: `${members.length}+`, label: 'Active Members' },
            { value: `${events.length}+`, label: 'Events Hosted' },
            { value: '15+', label: 'Projects Built' },
            { value: '3+', label: 'Years Active' },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                {value}
              </div>
              <div className="text-slate-500 text-sm mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              Tech Club exists to bridge the gap between classroom theory and real-world application. We provide
              students with hands-on experience, mentorship from industry professionals, and a collaborative community
              to grow in.
            </p>
            <p className="text-slate-400 leading-relaxed mb-6">
              Whether you&apos;re a curious beginner or an experienced developer, there&apos;s a place for you here.
              We believe the best way to learn is by building — together.
            </p>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 font-medium transition-colors"
            >
              See upcoming events
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: '🚀', title: 'Build Projects', desc: 'Work on real-world software that matters' },
              { icon: '🧠', title: 'Learn Skills', desc: 'Workshops, talks, and hands-on practice' },
              { icon: '🤝', title: 'Network', desc: 'Connect with peers and industry mentors' },
              { icon: '🏆', title: 'Compete', desc: 'Hackathons and CTF competitions' },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-[#0f0f1a] border border-[#1e1e2e] rounded-xl p-5 hover:border-violet-500/30 transition-colors"
              >
                <div className="text-2xl mb-2">{icon}</div>
                <div className="text-white font-medium text-sm mb-1">{title}</div>
                <div className="text-slate-500 text-xs leading-relaxed">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 bg-[#0f0f1a] border-t border-[#1e1e2e]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-violet-400 text-sm font-medium mb-1">What we&apos;re building</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">Featured Projects</h2>
            </div>
            <Link href="/members" className="text-slate-400 hover:text-white text-sm transition-colors hidden sm:block">
              View all members →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <div
                key={project.name}
                className="bg-[#13131f] border border-[#1e1e2e] rounded-2xl overflow-hidden hover:border-violet-500/30 transition-all hover:-translate-y-0.5"
              >
                <div className={`h-1.5 bg-gradient-to-r ${project.gradient}`} />
                <div className="p-6">
                  <h3 className="text-white font-semibold text-lg mb-2">{project.name}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-white/5 border border-white/10 text-slate-400 px-2.5 py-1 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Preview */}
      {upcomingEvents.length > 0 && (
        <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-blue-400 text-sm font-medium mb-1">Mark your calendar</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">Upcoming Events</h2>
            </div>
            <Link href="/events" className="text-slate-400 hover:text-white text-sm transition-colors hidden sm:block">
              All events →
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="bg-[#0f0f1a] border border-[#1e1e2e] rounded-2xl p-6 hover:border-blue-500/30 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 text-center bg-blue-500/10 border border-blue-500/20 rounded-xl px-3 py-2 min-w-[52px]">
                    <div className="text-blue-400 text-xs font-medium">
                      {new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                    </div>
                    <div className="text-white text-2xl font-bold leading-none">
                      {new Date(event.date + 'T00:00:00').getDate()}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold mb-1">{event.title}</h3>
                    <p className="text-slate-400 text-sm mb-2 leading-relaxed line-clamp-2">{event.description}</p>
                    <div className="flex items-center gap-1 text-slate-500 text-xs">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {event.location}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 border-t border-[#1e1e2e]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to join?</h2>
          <p className="text-slate-400 mb-8">
            Fill out our quick interest form and we&apos;ll get back to you with details about our next meeting.
          </p>
          <Link
            href="/contact"
            className="px-10 py-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-violet-500/25 inline-block"
          >
            Apply to Join Tech Club
          </Link>
        </div>
      </section>
    </div>
  );
}
