import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about LC3 - Lowcode Cloud Club: our mission, what we build, who we are, and how to get involved.',
};

const techStack = [
  { name: 'Power Apps', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 border-purple-200 dark:bg-purple-500/10 dark:border-purple-500/20' },
  { name: 'Power Automate', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/20' },
  { name: 'Azure', color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-50 border-sky-200 dark:bg-sky-500/10 dark:border-sky-500/20' },
  { name: 'Copilot Studio', color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 border-violet-200 dark:bg-violet-500/10 dark:border-violet-500/20' },
  { name: 'GitHub', color: 'text-slate-700 dark:text-slate-300', bg: 'bg-slate-100 border-slate-200 dark:bg-slate-700/40 dark:border-slate-600/40' },
  { name: 'React', color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 border-cyan-200 dark:bg-cyan-500/10 dark:border-cyan-500/20' },
  { name: 'Python', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-500/10 dark:border-yellow-500/20' },
  { name: 'Node.js', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 border-green-200 dark:bg-green-500/10 dark:border-green-500/20' },
];

const values = [
  {
    title: 'Learn by Building',
    desc: 'We believe the best way to learn is to create. Every semester, members work on real projects that solve actual problems.',
    icon: (
      <svg className="w-6 h-6 text-violet-600 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    title: 'Open to Everyone',
    desc: 'No prior experience required. We welcome students from all majors and skill levels — curiosity is the only prerequisite.',
    icon: (
      <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: 'Industry Connected',
    desc: 'We bridge the gap between classroom learning and real-world tech through partnerships, guest speakers, and internship pipelines.',
    icon: (
      <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'Community First',
    desc: 'LC3 is more than a club — it\'s a community. We celebrate wins together, support each other through challenges, and grow as a team.',
    icon: (
      <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
];

const activities = [
  { title: 'Weekly Meetings', desc: 'Regular meetups with workshops, demos, and project standups to keep everyone connected and on track.' },
  { title: 'Project Teams', desc: 'Collaborative teams tackle semester-long projects spanning apps, automations, and cloud infrastructure.' },
  { title: 'Workshops', desc: 'Hands-on sessions covering Power Platform, Azure, web dev, APIs, and more — led by members and guest instructors.' },
  { title: 'Hackathons', desc: 'We compete in and host hackathons, giving members a chance to sprint on ideas and showcase skills under pressure.' },
  { title: 'Speaker Series', desc: 'Industry professionals and alumni share real-world experience, career advice, and emerging trends.' },
  { title: 'Partnerships', desc: 'Companies hire LC3 teams for contract projects, and we connect members with internship and job opportunities.' },
];

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">

      {/* Hero */}
      <div className="text-center mb-20">
        <p className="text-violet-600 dark:text-violet-400 text-sm font-medium mb-3">Who we are</p>
        <h1 className="text-4xl sm:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
          About{' '}
          <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-violet-700 bg-clip-text text-transparent dark:from-blue-400 dark:via-violet-400 dark:to-violet-500">
            LC3
          </span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
          LC3 — the Lowcode Cloud Club — is a university student organization at the intersection of
          low-code platforms, cloud computing, and real-world software development. We build
          things that matter, together.
        </p>
      </div>

      {/* Mission */}
      <div className="bg-gradient-to-br from-blue-50 via-violet-50/50 to-transparent dark:from-blue-500/5 dark:via-violet-500/5 dark:to-transparent border border-blue-100 dark:border-violet-500/10 rounded-3xl p-10 mb-16">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-medium text-violet-600 dark:text-violet-400 uppercase tracking-wider mb-4">Our Mission</p>
          <p className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white leading-relaxed">
            &ldquo;To empower students to build real-world software using modern tools — fostering technical
            skills, professional growth, and a collaborative community.&rdquo;
          </p>
        </div>
      </div>

      {/* Values */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">What we stand for</h2>
        <p className="text-slate-500 mb-8">The principles that guide everything we do.</p>
        <div className="grid sm:grid-cols-2 gap-6">
          {values.map(({ title, desc, icon }) => (
            <div key={title} className="bg-white border border-slate-200 rounded-2xl p-6 dark:bg-[#0d1424] dark:border-[#1e2d45]">
              <div className="w-11 h-11 bg-slate-100 dark:bg-white/5 rounded-xl flex items-center justify-center mb-4">
                {icon}
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* What we work with */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">What we work with</h2>
        <p className="text-slate-500 mb-6">Our toolkit spans low-code platforms, cloud services, and modern development frameworks.</p>
        <div className="flex flex-wrap gap-3">
          {techStack.map(({ name, color, bg }) => (
            <span key={name} className={`px-4 py-2 rounded-xl border text-sm font-medium ${color} ${bg}`}>
              {name}
            </span>
          ))}
        </div>
      </div>

      {/* Activities */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">What we do</h2>
        <p className="text-slate-500 mb-8">A look at the activities and programs that make up the LC3 experience.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {activities.map(({ title, desc }) => (
            <div key={title} className="bg-white border border-slate-200 rounded-xl p-5 dark:bg-[#0d1424] dark:border-[#1e2d45]">
              <div className="w-2 h-2 rounded-full bg-violet-500 mb-3" />
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1.5">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-violet-600 rounded-3xl p-10 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to join?</h2>
        <p className="text-white/80 mb-8 max-w-md mx-auto leading-relaxed">
          Whether you want to build, learn, or lead — there&apos;s a place for you in LC3.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/contact"
            className="px-8 py-3.5 bg-white text-violet-700 font-semibold rounded-xl hover:bg-white/90 transition-all shadow-lg"
          >
            Apply to Join
          </Link>
          <Link
            href="/members"
            className="px-8 py-3.5 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all"
          >
            Meet the Team
          </Link>
        </div>
      </div>
    </div>
  );
}
