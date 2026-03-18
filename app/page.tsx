import Link from 'next/link';
import { readJSON, Event, Project, Member, Stats, SiteSettings, Post, SponsorsConfig, CaseStudiesConfig } from '@/lib/data';
import ScrollReveal from './components/ScrollReveal';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'LC3 - Lowcode Cloud Club',
  description: 'LC3 is a student tech club at the College of Southern Nevada focused on low-code platforms, cloud computing, and real-world software projects. Join us to build, learn, and connect.',
  openGraph: {
    images: [{ url: '/banner.svg', width: 680, height: 230, alt: 'LC3 - Lowcode Cloud Club' }],
  },
  twitter: {
    images: ['/banner.svg'],
  },
};

export default function HomePage() {
  const events = readJSON<Event[]>('events.json');
  const featuredProjects = readJSON<Project[]>('projects.json');
  const members = readJSON<Member[]>('members.json');
  const statsOverrides = readJSON<Stats>('stats.json', { activeMembers: '', eventsHosted: '', projectsBuilt: '', yearsActive: '' });
  const settings = readJSON<SiteSettings>('settings.json', { recruitingBanner: '', meetingDay: '', meetingTime: '', meetingLocation: '' });
  const upcomingEvents = events.filter((e) => e.type === 'upcoming').slice(0, 2);
  const latestPosts = readJSON<Post[]>('posts.json').filter((p) => p.published).slice(0, 3);
  const sponsorsConfig = readJSON<SponsorsConfig>('sponsors.json', { live: false, sectionTitle: 'Supported By', sponsors: [] });
  const caseStudiesConfig = readJSON<CaseStudiesConfig>('case-studies.json', { live: false, sectionTitle: 'Past Work', caseStudies: [] });

  const stats = {
    activeMembers: statsOverrides.activeMembers || String(members.length),
    eventsHosted: statsOverrides.eventsHosted || String(events.filter((e) => e.type === 'past').length),
    projectsBuilt: statsOverrides.projectsBuilt || String(featuredProjects.length),
    yearsActive: statsOverrides.yearsActive || '1',
  };

  const missionItems = [
    {
      title: 'Build Projects',
      desc: 'Work on real-world software that matters',
      icon: (
        <svg className="w-5 h-5 text-violet-600 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
    },
    {
      title: 'Learn Skills',
      desc: 'Workshops, talks, and hands-on practice',
      icon: (
        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      title: 'Network',
      desc: 'Connect with peers and industry mentors',
      icon: (
        <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      title: 'Compete',
      desc: 'Hackathons and CTF competitions',
      icon: (
        <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
    },
  ];

  const techStack = ['Power Apps', 'Power Automate', 'Azure', 'GitHub', 'React', 'Python', 'Node.js', 'Copilot Studio'];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden py-14 sm:py-20">
        {/* Background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {/* Light mode: subtle gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-blue-50/40 to-transparent dark:hidden" />
          {/* Dark mode: glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[2px] bg-gradient-to-r from-transparent via-violet-500/40 to-transparent hidden dark:block" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-violet-600/15 rounded-full blur-3xl hidden dark:block" />
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-600/15 rounded-full blur-3xl hidden dark:block" />
          <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-cyan-600/10 rounded-full blur-3xl hidden dark:block" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          {settings.recruitingBanner && (
            <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-200 text-violet-700 text-sm px-4 py-1.5 rounded-full mb-8 dark:bg-violet-500/10 dark:border-violet-500/25 dark:text-violet-300">
              <span className="w-2 h-2 bg-violet-500 rounded-full animate-pulse dark:bg-violet-400" />
              {settings.recruitingBanner}
            </div>
          )}

          {/* Banner — swaps with theme */}
          <div className="w-full max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-xl shadow-violet-500/10 mb-10">
            <img src="/banner-light.svg" alt="LC3 - Lowcode Cloud Club · College of Southern Nevada" className="w-full dark:hidden" />
            <img src="/banner-dark.svg" alt="LC3 - Lowcode Cloud Club · College of Southern Nevada" className="w-full hidden dark:block" />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-violet-500 transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5"
            >
              Join the Club
            </Link>
            <Link
              href="/members"
              className="px-8 py-3.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all hover:-translate-y-0.5 shadow-sm dark:bg-white/5 dark:border-white/15 dark:text-white dark:hover:bg-white/10 dark:hover:border-white/25"
            >
              Meet the Team
            </Link>
          </div>

          {/* Tech stack strip */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="text-xs text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full dark:bg-white/5 dark:border-white/10"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Company CTA */}
          <div className="mt-8 inline-flex items-center gap-4 bg-white border border-slate-200 hover:border-blue-300 rounded-2xl px-6 py-4 transition-all group shadow-sm dark:bg-[#0d1424]/80 dark:border-[#1e2d45] dark:hover:border-blue-500/40">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 dark:bg-gradient-to-br dark:from-blue-500/20 dark:to-violet-500/20 dark:border-blue-500/20">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-slate-900 text-sm font-medium dark:text-white">Are you a company?</p>
              <p className="text-slate-500 text-xs">Partner with us for projects or offer internships to our members.</p>
            </div>
            <Link
              href="/hire"
              className="flex-shrink-0 text-xs font-semibold text-blue-600 group-hover:text-blue-700 border border-blue-200 group-hover:border-blue-300 px-4 py-2 rounded-lg transition-all dark:text-blue-400 dark:group-hover:text-blue-300 dark:border-blue-500/30 dark:group-hover:border-blue-400/50"
            >
              Learn more →
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-slate-200 bg-white dark:border-[#1e2d45] dark:bg-[#0d1424]">
        <ScrollReveal>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: stats.activeMembers, label: 'Active Members' },
            { value: stats.eventsHosted, label: 'Events Hosted' },
            { value: stats.projectsBuilt, label: 'Projects Built' },
            { value: stats.yearsActive, label: 'Years Active' },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-violet-400">
                {value || '—'}
              </div>
              <div className="text-slate-500 text-sm mt-1">{label}</div>
            </div>
          ))}
        </div>
        </ScrollReveal>
      </section>

      {/* About */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-violet-600 dark:text-violet-400 text-sm font-medium mb-2">Who we are</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">About LC3</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              LC3 — Lowcode Cloud Club — is a student-run tech organization focused on low-code platforms, cloud technologies,
              and modern software development. We partner with tools like Microsoft Power Platform and Azure to give members
              hands-on experience that directly translates to industry skills.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              Whether you&apos;re building your first app or already working in tech, LC3 is a place to grow.
              We believe the best way to learn is by shipping real things — together.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/members"
                className="inline-flex items-center gap-2 text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 font-medium transition-colors text-sm"
              >
                Meet the team
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <Link
                href="/events"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors text-sm"
              >
                See upcoming events
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium transition-colors text-sm"
              >
                Learn more
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {missionItems.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-white border border-slate-200 rounded-xl p-5 hover:border-violet-200 hover:shadow-sm transition-all dark:bg-[#0d1424] dark:border-[#1e2d45] dark:hover:border-violet-500/30"
              >
                <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center mb-3 dark:bg-white/5 dark:border-transparent">
                  {icon}
                </div>
                <div className="text-slate-900 dark:text-white font-medium text-sm mb-1">{title}</div>
                <div className="text-slate-500 text-xs leading-relaxed">{desc}</div>
              </div>
            ))}
          </div>
        </div>
        </ScrollReveal>
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="py-20 bg-slate-50 border-t border-slate-200 dark:bg-[#0d1424] dark:border-[#1e2d45]">
          <ScrollReveal>
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-violet-600 dark:text-violet-400 text-sm font-medium mb-1">What we&apos;re building</p>
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">Featured Projects</h2>
              </div>
              <Link href="/members" className="text-slate-500 hover:text-slate-700 dark:hover:text-white text-sm transition-colors hidden sm:block">
                View all members →
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {featuredProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-violet-200 hover:shadow-md transition-all hover:-translate-y-0.5 dark:bg-[#111a2e] dark:border-[#1e2d45] dark:hover:border-violet-500/30 dark:hover:shadow-none"
                >
                  <div className={`h-1.5 bg-gradient-to-r ${project.gradient}`} />
                  <div className="p-6">
                    <h3 className="text-slate-900 dark:text-white font-semibold text-lg mb-2">{project.name}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span key={tag} className="text-xs bg-slate-100 border border-slate-200 text-slate-600 px-2.5 py-1 rounded-md dark:bg-white/5 dark:border-white/10 dark:text-slate-400">
                          {tag}
                        </span>
                      ))}
                    </div>
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-4 text-xs text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
                        </svg>
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          </ScrollReveal>
        </section>
      )}

      {/* Upcoming Events Preview */}
      {upcomingEvents.length > 0 && (
        <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-blue-600 dark:text-blue-400 text-sm font-medium mb-1">Mark your calendar</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">Upcoming Events</h2>
            </div>
            <Link href="/events" className="text-slate-500 hover:text-slate-700 dark:hover:text-white text-sm transition-colors hidden sm:block">
              All events →
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-200 hover:shadow-sm transition-all dark:bg-[#0d1424] dark:border-[#1e2d45] dark:hover:border-blue-500/30">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 text-center bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 min-w-[52px] dark:bg-blue-500/10 dark:border-blue-500/20">
                    <div className="text-blue-600 dark:text-blue-400 text-xs font-medium">
                      {new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                    </div>
                    <div className="text-slate-900 dark:text-white text-2xl font-bold leading-none">
                      {new Date(event.date + 'T00:00:00').getDate()}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-slate-900 dark:text-white font-semibold mb-1">{event.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-2 leading-relaxed line-clamp-2">{event.description}</p>
                    <div className="flex items-center gap-1 text-slate-400 text-xs">
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
          </ScrollReveal>
        </section>
      )}

      {/* Latest Posts */}
      {latestPosts.length > 0 && (
        <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-violet-600 dark:text-violet-400 text-sm font-medium mb-1">What&apos;s new</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">Latest Updates</h2>
            </div>
            <Link href="/blog" className="text-slate-500 hover:text-slate-700 dark:hover:text-white text-sm transition-colors hidden sm:block">
              All posts →
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {latestPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="block bg-white border border-slate-200 rounded-2xl p-6 hover:border-violet-200 hover:shadow-sm transition-all group dark:bg-[#0d1424] dark:border-[#1e2d45] dark:hover:border-violet-500/30"
              >
                <p className="text-xs text-slate-400 mb-3">
                  {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
                )}
              </Link>
            ))}
          </div>
          </ScrollReveal>
        </section>
      )}

      {/* Past Work */}
      {caseStudiesConfig.live && caseStudiesConfig.caseStudies.length > 0 && (
        <section className="py-20 bg-slate-50 border-t border-slate-200 dark:bg-[#0d1424] dark:border-[#1e2d45]">
          <ScrollReveal>
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-1">What we&apos;ve delivered</p>
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">{caseStudiesConfig.sectionTitle}</h2>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {caseStudiesConfig.caseStudies.map((cs) => (
                <div key={cs.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-emerald-200 hover:shadow-md transition-all hover:-translate-y-0.5 dark:bg-[#111a2e] dark:border-[#1e2d45] dark:hover:border-emerald-500/30 dark:hover:shadow-none">
                  <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500" />
                  <div className="p-6">
                    <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-2">{cs.client}</p>
                    <h3 className="text-slate-900 dark:text-white font-semibold text-lg mb-2">{cs.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">{cs.description}</p>
                    {cs.outcome && (
                      <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-xl px-3 py-2 mb-4">
                        <p className="text-emerald-700 dark:text-emerald-400 text-xs font-medium">Outcome</p>
                        <p className="text-emerald-800 dark:text-emerald-300 text-sm mt-0.5">{cs.outcome}</p>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {cs.tags.map((tag) => (
                        <span key={tag} className="text-xs bg-slate-100 border border-slate-200 text-slate-600 px-2.5 py-1 rounded-md dark:bg-white/5 dark:border-white/10 dark:text-slate-400">
                          {tag}
                        </span>
                      ))}
                    </div>
                    {cs.link && (
                      <a href={cs.link} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-4 text-xs text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View project
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          </ScrollReveal>
        </section>
      )}

      {/* Sponsors */}
      {sponsorsConfig.live && sponsorsConfig.sponsors.length > 0 && (
        <section className="border-t border-slate-200 dark:border-[#1e2d45] py-14">
          <ScrollReveal>
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <p className="text-center text-xs font-medium text-slate-400 uppercase tracking-widest mb-10">
              {sponsorsConfig.sectionTitle}
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8">
              {sponsorsConfig.sponsors.map((s) => (
                s.logoUrl ? (
                  <a key={s.id} href={s.website || undefined} target="_blank" rel="noopener noreferrer"
                    className="opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.logoUrl} alt={s.name} className="h-10 object-contain" />
                  </a>
                ) : (
                  <a key={s.id} href={s.website || undefined} target="_blank" rel="noopener noreferrer"
                    className="text-slate-400 hover:text-slate-700 dark:hover:text-white font-semibold text-lg transition-colors">
                    {s.name}
                  </a>
                )
              ))}
            </div>
          </div>
          </ScrollReveal>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 border-t border-slate-200 dark:border-[#1e2d45]">
        <ScrollReveal>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">Ready to join?</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-8">
            Fill out our quick interest form and we&apos;ll get back to you with details about our next meeting.
          </p>
          <Link
            href="/contact"
            className="px-10 py-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-violet-500/20 inline-block"
          >
            Apply to Join LC3
          </Link>
        </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
