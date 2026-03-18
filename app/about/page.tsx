import type { Metadata } from 'next';
import Link from 'next/link';
import { readJSON, AboutContent } from '@/lib/data';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about LC3 - Lowcode Cloud Club: our mission, what we build, who we are, and how to get involved.',
};

// Fixed icon set for values — cycles by index
const valueIcons = [
  <svg key="code" className="w-6 h-6 text-violet-600 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>,
  <svg key="people" className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>,
  <svg key="briefcase" className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>,
  <svg key="heart" className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>,
  <svg key="star" className="w-6 h-6 text-pink-600 dark:text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>,
  <svg key="bolt" className="w-6 h-6 text-cyan-600 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>,
];

// Rotating color palette for tech stack badges
const techColors = [
  'text-purple-600 dark:text-purple-400 bg-purple-50 border-purple-200 dark:bg-purple-500/10 dark:border-purple-500/20',
  'text-blue-600 dark:text-blue-400 bg-blue-50 border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/20',
  'text-sky-600 dark:text-sky-400 bg-sky-50 border-sky-200 dark:bg-sky-500/10 dark:border-sky-500/20',
  'text-violet-600 dark:text-violet-400 bg-violet-50 border-violet-200 dark:bg-violet-500/10 dark:border-violet-500/20',
  'text-slate-700 dark:text-slate-300 bg-slate-100 border-slate-200 dark:bg-slate-700/40 dark:border-slate-600/40',
  'text-cyan-600 dark:text-cyan-400 bg-cyan-50 border-cyan-200 dark:bg-cyan-500/10 dark:border-cyan-500/20',
  'text-yellow-600 dark:text-yellow-400 bg-yellow-50 border-yellow-200 dark:bg-yellow-500/10 dark:border-yellow-500/20',
  'text-green-600 dark:text-green-400 bg-green-50 border-green-200 dark:bg-green-500/10 dark:border-green-500/20',
  'text-rose-600 dark:text-rose-400 bg-rose-50 border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/20',
  'text-orange-600 dark:text-orange-400 bg-orange-50 border-orange-200 dark:bg-orange-500/10 dark:border-orange-500/20',
];

const defaults: AboutContent = {
  heroTagline: 'Who we are',
  heroDescription: 'LC3 — the Lowcode Cloud Club — is a university student organization at the intersection of low-code platforms, cloud computing, and real-world software development. We build things that matter, together.',
  mission: "To empower students to build real-world software using modern tools — fostering technical skills, professional growth, and a collaborative community.",
  valuesTitle: 'What we stand for',
  valuesSubtitle: 'The principles that guide everything we do.',
  values: [
    { title: 'Learn by Building', desc: 'We believe the best way to learn is to create. Every semester, members work on real projects that solve actual problems.' },
    { title: 'Open to Everyone', desc: 'No prior experience required. We welcome students from all majors and skill levels — curiosity is the only prerequisite.' },
    { title: 'Industry Connected', desc: 'We bridge the gap between classroom learning and real-world tech through partnerships, guest speakers, and internship pipelines.' },
    { title: 'Community First', desc: "LC3 is more than a club — it's a community. We celebrate wins together, support each other through challenges, and grow as a team." },
  ],
  techStackTitle: 'What we work with',
  techStackSubtitle: 'Our toolkit spans low-code platforms, cloud services, and modern development frameworks.',
  techStack: ['Power Apps', 'Power Automate', 'Azure', 'Copilot Studio', 'GitHub', 'React', 'Python', 'Node.js'],
  activitiesTitle: 'What we do',
  activitiesSubtitle: 'A look at the activities and programs that make up the LC3 experience.',
  activities: [
    { title: 'Weekly Meetings', desc: 'Regular meetups with workshops, demos, and project standups to keep everyone connected and on track.' },
    { title: 'Project Teams', desc: 'Collaborative teams tackle semester-long projects spanning apps, automations, and cloud infrastructure.' },
    { title: 'Workshops', desc: 'Hands-on sessions covering Power Platform, Azure, web dev, APIs, and more — led by members and guest instructors.' },
    { title: 'Hackathons', desc: 'We compete in and host hackathons, giving members a chance to sprint on ideas and showcase skills under pressure.' },
    { title: 'Speaker Series', desc: 'Industry professionals and alumni share real-world experience, career advice, and emerging trends.' },
    { title: 'Partnerships', desc: 'Companies hire LC3 teams for contract projects, and we connect members with internship and job opportunities.' },
  ],
  ctaTitle: 'Ready to join?',
  ctaDescription: "Whether you want to build, learn, or lead — there's a place for you in LC3.",
};

export default function AboutPage() {
  const about = readJSON<AboutContent>('about.json', defaults);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">

      {/* Hero */}
      <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16 mb-20">
        <div className="flex-1 text-center md:text-left">
          <p className="text-violet-600 dark:text-violet-400 text-sm font-medium mb-3">{about.heroTagline}</p>
          <h1 className="text-4xl sm:text-6xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
            About{' '}
            <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-violet-700 bg-clip-text text-transparent dark:from-blue-400 dark:via-violet-400 dark:to-violet-500">
              LC3
            </span>
          </h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 mb-5">College of Southern Nevada</p>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            {about.heroDescription}
          </p>
        </div>

        {/* Community network SVG */}
        <div className="flex-shrink-0 w-full max-w-[280px]">
          <svg width="280" height="260" viewBox="0 0 300 270" className="w-full opacity-85 dark:opacity-75" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <style>{`
                @keyframes about-dash { to { stroke-dashoffset: -20; } }
                @keyframes about-glow { 0%,100%{opacity:0.12} 50%{opacity:0.22} }
                @keyframes about-dot { 0%,100%{opacity:0.3} 50%{opacity:0.85} }
                @keyframes about-ring { 0%,100%{opacity:0.1} 50%{opacity:0.35} }
                @keyframes about-corner { 0%,100%{opacity:0.4} 50%{opacity:0.9} }
              `}</style>
              <radialGradient id="about-cg" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25"/>
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0"/>
              </radialGradient>
              <linearGradient id="about-lg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#6366f1"/>
                <stop offset="100%" stopColor="#0891b2"/>
              </linearGradient>
            </defs>

            {/* Center ambient glow */}
            <circle cx="150" cy="135" r="65" fill="url(#about-cg)" style={{animation:'about-glow 3s ease-in-out infinite'}}/>

            {/* Connection lines */}
            <line x1="150" y1="135" x2="55" y2="45" stroke="#6366f1" strokeWidth="1" strokeOpacity="0.45" strokeDasharray="5 5" style={{animation:'about-dash 1.8s linear infinite'}}/>
            <line x1="150" y1="135" x2="248" y2="42" stroke="#0891b2" strokeWidth="1" strokeOpacity="0.45" strokeDasharray="5 5" style={{animation:'about-dash 2.1s linear infinite 0.3s'}}/>
            <line x1="150" y1="135" x2="22" y2="155" stroke="#818cf8" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="5 5" style={{animation:'about-dash 1.9s linear infinite 0.6s'}}/>
            <line x1="150" y1="135" x2="278" y2="148" stroke="#0891b2" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="5 5" style={{animation:'about-dash 2.3s linear infinite 0.9s'}}/>
            <line x1="150" y1="135" x2="72" y2="238" stroke="#6366f1" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="5 5" style={{animation:'about-dash 2.0s linear infinite 1.2s'}}/>
            <line x1="150" y1="135" x2="232" y2="232" stroke="#818cf8" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="5 5" style={{animation:'about-dash 2.2s linear infinite 1.5s'}}/>

            {/* Cross connections */}
            <line x1="55" y1="45" x2="248" y2="42" stroke="#6366f1" strokeWidth="0.5" strokeOpacity="0.15" strokeDasharray="3 8"/>
            <line x1="22" y1="155" x2="72" y2="238" stroke="#818cf8" strokeWidth="0.5" strokeOpacity="0.15" strokeDasharray="3 8"/>
            <line x1="278" y1="148" x2="232" y2="232" stroke="#0891b2" strokeWidth="0.5" strokeOpacity="0.15" strokeDasharray="3 8"/>

            {/* Outer node: Top-left */}
            <circle cx="55" cy="45" r="20" fill="#6366f1" fillOpacity="0.08" stroke="#6366f1" strokeWidth="1.5" strokeOpacity="0.5"/>
            <circle cx="55" cy="40" r="5.5" fill="#6366f1" fillOpacity="0.45"/>
            <path d="M46 53 Q55 48 64 53" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeOpacity="0.45" strokeLinecap="round"/>

            {/* Outer node: Top-right */}
            <circle cx="248" cy="42" r="22" fill="#0891b2" fillOpacity="0.08" stroke="#0891b2" strokeWidth="1.5" strokeOpacity="0.5"/>
            <circle cx="248" cy="37" r="6" fill="#0891b2" fillOpacity="0.45"/>
            <path d="M238 51 Q248 46 258 51" fill="none" stroke="#0891b2" strokeWidth="1.5" strokeOpacity="0.45" strokeLinecap="round"/>

            {/* Outer node: Left */}
            <circle cx="22" cy="155" r="18" fill="#818cf8" fillOpacity="0.08" stroke="#818cf8" strokeWidth="1.5" strokeOpacity="0.45"/>
            <circle cx="22" cy="150" r="5" fill="#818cf8" fillOpacity="0.45"/>
            <path d="M14 162 Q22 157 30 162" fill="none" stroke="#818cf8" strokeWidth="1.5" strokeOpacity="0.45" strokeLinecap="round"/>

            {/* Outer node: Right */}
            <circle cx="278" cy="148" r="20" fill="#0891b2" fillOpacity="0.08" stroke="#0891b2" strokeWidth="1.5" strokeOpacity="0.45"/>
            <circle cx="278" cy="143" r="5.5" fill="#0891b2" fillOpacity="0.45"/>
            <path d="M269 156 Q278 151 287 156" fill="none" stroke="#0891b2" strokeWidth="1.5" strokeOpacity="0.45" strokeLinecap="round"/>

            {/* Outer node: Bottom-left */}
            <circle cx="72" cy="238" r="18" fill="#6366f1" fillOpacity="0.08" stroke="#6366f1" strokeWidth="1.5" strokeOpacity="0.4"/>
            <circle cx="72" cy="233" r="5" fill="#6366f1" fillOpacity="0.4"/>
            <path d="M64 245 Q72 240 80 245" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeOpacity="0.4" strokeLinecap="round"/>

            {/* Outer node: Bottom-right */}
            <circle cx="232" cy="232" r="20" fill="#818cf8" fillOpacity="0.08" stroke="#818cf8" strokeWidth="1.5" strokeOpacity="0.4"/>
            <circle cx="232" cy="227" r="5.5" fill="#818cf8" fillOpacity="0.4"/>
            <path d="M223 240 Q232 235 241 240" fill="none" stroke="#818cf8" strokeWidth="1.5" strokeOpacity="0.4" strokeLinecap="round"/>

            {/* Center node */}
            <circle cx="150" cy="135" r="38" fill="#6366f1" fillOpacity="0.1" stroke="url(#about-lg)" strokeWidth="2"/>
            <circle cx="150" cy="135" r="28" fill="#6366f1" fillOpacity="0.06"/>
            <text x="150" y="140" textAnchor="middle" fontSize="16" fontWeight="700" fill="#6366f1" fillOpacity="0.9" fontFamily="system-ui, sans-serif" letterSpacing="-0.5">LC3</text>

            {/* Floating accent dots */}
            <circle cx="108" cy="82" r="2.5" fill="#6366f1" fillOpacity="0.5" style={{animation:'about-dot 2.5s ease-in-out infinite'}}/>
            <circle cx="192" cy="78" r="2" fill="#0891b2" fillOpacity="0.5" style={{animation:'about-dot 2.5s ease-in-out infinite 0.8s'}}/>
            <circle cx="98" cy="182" r="2" fill="#818cf8" fillOpacity="0.5" style={{animation:'about-dot 2.5s ease-in-out infinite 1.4s'}}/>
            <circle cx="202" cy="178" r="2.5" fill="#0891b2" fillOpacity="0.5" style={{animation:'about-dot 2.5s ease-in-out infinite 0.4s'}}/>
            {/* Outer glow ring */}
            <ellipse cx="150" cy="135" rx="148" ry="133" fill="none" stroke="#6366f1" strokeWidth="0.8" strokeOpacity="1" style={{animation:'about-ring 3s ease-in-out infinite'}}/>
            {/* Corner accents */}
            <path d="M20 2 L2 2 L2 20" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{animation:'about-corner 3s ease-in-out infinite'}}/>
            <path d="M280 2 L298 2 L298 20" fill="none" stroke="#0891b2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{animation:'about-corner 3s ease-in-out infinite 0.75s'}}/>
            <path d="M20 268 L2 268 L2 250" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{animation:'about-corner 3s ease-in-out infinite 1.5s'}}/>
            <path d="M280 268 L298 268 L298 250" fill="none" stroke="#0891b2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{animation:'about-corner 3s ease-in-out infinite 2.25s'}}/>
          </svg>
        </div>
      </div>

      {/* Mission */}
      <div className="bg-gradient-to-br from-blue-50 via-violet-50/50 to-transparent dark:from-blue-500/5 dark:via-violet-500/5 dark:to-transparent border border-blue-100 dark:border-violet-500/10 rounded-3xl p-10 mb-16">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-medium text-violet-600 dark:text-violet-400 uppercase tracking-wider mb-4">Our Mission</p>
          <p className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white leading-relaxed">
            &ldquo;{about.mission}&rdquo;
          </p>
        </div>
      </div>

      {/* Values */}
      {about.values.length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{about.valuesTitle}</h2>
          <p className="text-slate-500 mb-8">{about.valuesSubtitle}</p>
          <div className="grid sm:grid-cols-2 gap-6">
            {about.values.map(({ title, desc }, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 dark:bg-[#0d1424] dark:border-[#1e2d45]">
                <div className="w-11 h-11 bg-slate-100 dark:bg-white/5 rounded-xl flex items-center justify-center mb-4">
                  {valueIcons[i % valueIcons.length]}
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tech Stack */}
      {about.techStack.length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{about.techStackTitle}</h2>
          <p className="text-slate-500 mb-6">{about.techStackSubtitle}</p>
          <div className="flex flex-wrap gap-3">
            {about.techStack.map((name, i) => (
              <span key={i} className={`px-4 py-2 rounded-xl border text-sm font-medium ${techColors[i % techColors.length]}`}>
                {name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Activities */}
      {about.activities.length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{about.activitiesTitle}</h2>
          <p className="text-slate-500 mb-8">{about.activitiesSubtitle}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {about.activities.map(({ title, desc }, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 dark:bg-[#0d1424] dark:border-[#1e2d45]">
                <div className="w-2 h-2 rounded-full bg-violet-500 mb-3" />
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1.5">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="relative overflow-hidden bg-white border border-slate-200 dark:bg-[#0d1424] dark:border-[#1e2d45] rounded-3xl p-8 sm:p-10">
        {/* Soft gradient background layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.05] via-violet-500/[0.05] to-transparent dark:from-blue-500/10 dark:via-violet-500/8 dark:to-transparent pointer-events-none rounded-3xl" />
        {/* Top-center accent line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-56 h-px bg-gradient-to-r from-transparent via-violet-400/50 to-transparent dark:via-violet-500/60" />

        <div className="relative flex flex-col md:flex-row items-center gap-8 md:gap-12">

          {/* Text content */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 rounded-full px-3 py-1 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
              <span className="text-xs font-medium text-violet-700 dark:text-violet-400">Now Recruiting</span>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">{about.ctaTitle}</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md leading-relaxed">
              {about.ctaDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Link
                href="/contact"
                className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-violet-500/20"
              >
                Apply to Join
              </Link>
              <Link
                href="/members"
                className="px-8 py-3.5 bg-slate-100 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-all dark:bg-white/5 dark:border-white/10 dark:text-white dark:hover:bg-white/10"
              >
                Meet the Team
              </Link>
            </div>
          </div>

          {/* Custom SVG — LEARN → BUILD → LEAD pathway */}
          <div className="flex-shrink-0 w-full max-w-[220px] opacity-90 dark:opacity-80">
            <svg width="220" height="205" viewBox="0 0 220 205" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <style>{`
                  @keyframes cta-dash  { to { stroke-dashoffset: -16; } }
                  @keyframes cta-pulse { 0%,100%{opacity:0.35} 50%{opacity:0.9} }
                  @keyframes cta-glow  { 0%,100%{opacity:0.08} 50%{opacity:0.22} }
                  @keyframes cta-ring  { 0%,100%{opacity:0.08} 50%{opacity:0.28} }
                  @keyframes cta-corner{ 0%,100%{opacity:0.4}  50%{opacity:0.9} }
                `}</style>
                <radialGradient id="cta-rg-a" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0"/>
                </radialGradient>
                <radialGradient id="cta-rg-b" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity="0.25"/>
                  <stop offset="100%" stopColor="#818cf8" stopOpacity="0"/>
                </radialGradient>
                <radialGradient id="cta-rg-c" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#0891b2" stopOpacity="0.28"/>
                  <stop offset="100%" stopColor="#0891b2" stopOpacity="0"/>
                </radialGradient>
                <linearGradient id="cta-line-g" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0%" stopColor="#6366f1"/>
                  <stop offset="100%" stopColor="#0891b2"/>
                </linearGradient>
              </defs>

              {/* Outer ring */}
              <ellipse cx="110" cy="102" rx="107" ry="99" fill="none" stroke="#6366f1" strokeWidth="0.7" strokeOpacity="1" style={{animation:'cta-ring 4s ease-in-out infinite'}}/>

              {/* Corner brackets */}
              <path d="M14 2 L2 2 L2 14"   fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{animation:'cta-corner 3s ease-in-out infinite'}}/>
              <path d="M206 2 L218 2 L218 14"  fill="none" stroke="#0891b2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{animation:'cta-corner 3s ease-in-out infinite 0.75s'}}/>
              <path d="M14 203 L2 203 L2 191" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{animation:'cta-corner 3s ease-in-out infinite 1.5s'}}/>
              <path d="M206 203 L218 203 L218 191" fill="none" stroke="#0891b2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{animation:'cta-corner 3s ease-in-out infinite 2.25s'}}/>

              {/* ── Node 1: LEARN (bottom-left) ── */}
              <circle cx="45" cy="162" r="30" fill="url(#cta-rg-a)" style={{animation:'cta-glow 3s ease-in-out infinite'}}/>
              <circle cx="45" cy="162" r="21" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeOpacity="0.5"/>
              <circle cx="45" cy="162" r="6.5" fill="#6366f1" fillOpacity="0.55"/>
              <text x="45" y="192" textAnchor="middle" fontSize="8.5" fill="#6366f1" fillOpacity="0.75" fontFamily="system-ui,sans-serif" fontWeight="700" letterSpacing="0.8">LEARN</text>

              {/* Connector: LEARN → BUILD */}
              <line x1="63" y1="146" x2="97" y2="112" stroke="url(#cta-line-g)" strokeWidth="1.2" strokeOpacity="0.45" strokeDasharray="4 5" style={{animation:'cta-dash 1.8s linear infinite'}}/>

              {/* ── Node 2: BUILD (center) ── */}
              <circle cx="113" cy="97" r="32" fill="url(#cta-rg-b)" style={{animation:'cta-glow 3s ease-in-out infinite 1s'}}/>
              <circle cx="113" cy="97" r="22" fill="none" stroke="#818cf8" strokeWidth="1.5" strokeOpacity="0.55"/>
              <circle cx="113" cy="97" r="7.5" fill="#818cf8" fillOpacity="0.55"/>
              <text x="113" y="128" textAnchor="middle" fontSize="8.5" fill="#818cf8" fillOpacity="0.75" fontFamily="system-ui,sans-serif" fontWeight="700" letterSpacing="0.8">BUILD</text>

              {/* Connector: BUILD → LEAD */}
              <line x1="131" y1="80" x2="160" y2="50" stroke="url(#cta-line-g)" strokeWidth="1.2" strokeOpacity="0.45" strokeDasharray="4 5" style={{animation:'cta-dash 2s linear infinite 0.6s'}}/>

              {/* ── Node 3: LEAD (top-right) ── */}
              <circle cx="178" cy="36" r="34" fill="url(#cta-rg-c)" style={{animation:'cta-glow 3s ease-in-out infinite 2s'}}/>
              <circle cx="178" cy="36" r="23" fill="none" stroke="#0891b2" strokeWidth="1.5" strokeOpacity="0.5"/>
              <circle cx="178" cy="36" r="8" fill="#0891b2" fillOpacity="0.55"/>
              <text x="178" y="67" textAnchor="middle" fontSize="8.5" fill="#0891b2" fillOpacity="0.75" fontFamily="system-ui,sans-serif" fontWeight="700" letterSpacing="0.8">LEAD</text>

              {/* Floating accent dots */}
              <circle cx="22"  cy="72"  r="2.5" fill="#6366f1" fillOpacity="0.45" style={{animation:'cta-pulse 2.5s ease-in-out infinite'}}/>
              <circle cx="78"  cy="30"  r="2"   fill="#818cf8" fillOpacity="0.45" style={{animation:'cta-pulse 2.5s ease-in-out infinite 0.7s'}}/>
              <circle cx="200" cy="85"  r="2.5" fill="#0891b2" fillOpacity="0.45" style={{animation:'cta-pulse 2.5s ease-in-out infinite 1.4s'}}/>
              <circle cx="158" cy="158" r="2"   fill="#6366f1" fillOpacity="0.4"  style={{animation:'cta-pulse 2.5s ease-in-out infinite 0.3s'}}/>
              <circle cx="205" cy="155" r="1.5" fill="#818cf8" fillOpacity="0.4"  style={{animation:'cta-pulse 2.5s ease-in-out infinite 2s'}}/>
              <circle cx="30"  cy="130" r="1.5" fill="#0891b2" fillOpacity="0.35" style={{animation:'cta-pulse 2.5s ease-in-out infinite 1.1s'}}/>
            </svg>
          </div>

        </div>
      </div>
    </div>
  );
}
