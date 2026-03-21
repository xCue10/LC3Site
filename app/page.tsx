import Link from 'next/link';
import { readJSON, Event, Project, Member, Stats, SiteSettings, Post, SponsorsConfig, CaseStudiesConfig, HomeContent, ProjectStatus } from '@/lib/data';
import ScrollReveal from './components/ScrollReveal';
import HeroTyping from './components/HeroTyping';
import AnimatedStat from './components/AnimatedStat';
import StaggerReveal from './components/StaggerReveal';
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

function HomeStatusBadge({ status }: { status: ProjectStatus }) {
  if (status === 'in-progress') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400 shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
        In Progress
      </span>
    );
  }
  if (status === 'completed') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400 shrink-0">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        Completed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-violet-50 border border-violet-200 text-violet-700 dark:bg-violet-500/10 dark:border-violet-500/20 dark:text-violet-400 shrink-0">
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
      Open
    </span>
  );
}

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
  const homeDefaults: HomeContent = {
    primaryButtonLabel: 'Join the Club',
    secondaryButtonLabel: 'Meet the Team',
    techStack: ['Power Apps', 'Power Automate', 'Azure', 'GitHub', 'React', 'Python', 'Node.js', 'Copilot Studio'],
    companyCtaTitle: 'Are you a company?',
    companyCtaDesc: 'Partner with us for projects or offer internships to our members.',
    missionItems: [
      { title: 'Build Projects', desc: 'Work on real-world software that matters' },
      { title: 'Learn Skills', desc: 'Workshops, talks, and hands-on practice' },
      { title: 'Network', desc: 'Connect with peers and industry mentors' },
      { title: 'Compete', desc: 'Hackathons and CTF competitions' },
    ],
    aboutEyebrow: 'Who we are',
    aboutHeading: 'About LC3',
    aboutBody1: 'LC3 — Lowcode Cloud Club — is a student-run tech organization focused on low-code platforms, cloud technologies, and modern software development. We partner with tools like Microsoft Power Platform and Azure to give members hands-on experience that directly translates to industry skills.',
    aboutBody2: "Whether you're building your first app or already working in tech, LC3 is a place to grow. We believe the best way to learn is by shipping real things — together.",
    projectsEyebrow: "What we're building",
    projectsHeading: 'Featured Projects',
    eventsEyebrow: 'Mark your calendar',
    eventsHeading: 'Upcoming Events',
    blogEyebrow: "What's new",
    blogHeading: 'Latest Updates',
    ctaHeading: 'Ready to join?',
    ctaDescription: "Fill out our quick interest form and we'll get back to you with details about our next meeting.",
    ctaButtonLabel: 'Apply to Join LC3',
    shieldBadgeLabel: 'New Tool',
    shieldHeadingPrefix: 'Introducing',
    shieldDescription: 'A hands-on cybersecurity scanner built for LC3 Club members and CSN students. Powered by Claude AI, Shield helps you analyze URLs, audit code, check SSL certificates, scan GitHub repos, and more — turning security knowledge into real practice.',
    shieldFeatureTags: ['URL Scanner', 'Code Analysis', 'SSL/TLS', 'OWASP Top 10', 'GitHub Audit', 'JWT Analyzer'],
    shieldCtaLabel: 'Explore LC3 Shield',
    shieldButtonLabel: 'LC3 Shield',
    shieldFeatureCards: [
      { icon: '🔍', title: 'Scan anything', desc: 'URLs, code, repos, SSL certs, DNS records' },
      { icon: '🤖', title: 'AI-powered', desc: 'Claude AI explains every finding in plain English' },
      { icon: '🏆', title: 'Earn badges', desc: 'Track your security skills with achievement badges' },
      { icon: '📊', title: 'Track progress', desc: 'History, scores, and learning resources' },
    ],
  };
  const home = readJSON<HomeContent>('home.json', homeDefaults);
  const homeContent: HomeContent = { ...homeDefaults, ...home };

  const stats = {
    activeMembers: statsOverrides.activeMembers || String(members.length),
    eventsHosted: statsOverrides.eventsHosted || String(events.filter((e) => e.type === 'past').length),
    projectsBuilt: statsOverrides.projectsBuilt || String(featuredProjects.length),
    yearsActive: statsOverrides.yearsActive || '1',
  };

  const missionIcons = [
    <svg key="code" className="w-5 h-5 text-violet-600 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>,
    <svg key="book" className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
    <svg key="team" className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    <svg key="award" className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>,
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden py-14 sm:py-20">
        {/* Background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {/* Light mode: subtle animated gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-blue-50/40 to-transparent dark:hidden" style={{animation:'hero-light-shift 8s ease-in-out infinite'}} />
          {/* Dark mode: animated glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[2px] bg-gradient-to-r from-transparent via-violet-500/40 to-transparent hidden dark:block" />
          <div className="absolute top-1/2 left-1/2 w-[700px] h-[700px] bg-violet-600/15 rounded-full blur-3xl hidden dark:block" style={{animation:'hero-blob-a 9s ease-in-out infinite'}} />
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-600/15 rounded-full blur-3xl hidden dark:block" style={{animation:'hero-blob-b 11s ease-in-out infinite 1s'}} />
          <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-purple-600/12 rounded-full blur-3xl hidden dark:block" style={{animation:'hero-blob-c 13s ease-in-out infinite 2s'}} />
          {/* Tech constellation */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 500" fill="none" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <defs>
              <style>{`
                @keyframes hero-node-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
                @keyframes hero-node-glow { 0%,100%{opacity:0.25} 50%{opacity:0.6} }
                @keyframes hero-line-dash { to { stroke-dashoffset: -20; } }
                @keyframes hero-dot-orbit { from{transform:rotate(0deg) translateX(28px)} to{transform:rotate(360deg) translateX(28px)} }
              `}</style>
            </defs>
            {/* Connection lines */}
            <line x1="160" y1="120" x2="340" y2="200" stroke="rgba(139,92,246,0.12)" strokeWidth="1" strokeDasharray="4 6" style={{animation:'hero-line-dash 1.8s linear infinite'}}/>
            <line x1="340" y1="200" x2="560" y2="140" stroke="rgba(59,130,246,0.12)" strokeWidth="1" strokeDasharray="4 6" style={{animation:'hero-line-dash 2.1s linear infinite 0.4s'}}/>
            <line x1="340" y1="200" x2="480" y2="250" stroke="rgba(99,102,241,0.1)" strokeWidth="1" strokeDasharray="4 6" style={{animation:'hero-line-dash 1.6s linear infinite 0.8s'}}/>
            <line x1="840" y1="130" x2="1040" y2="220" stroke="rgba(6,182,212,0.12)" strokeWidth="1" strokeDasharray="4 6" style={{animation:'hero-line-dash 1.9s linear infinite 0.6s'}}/>
            <line x1="1040" y1="220" x2="900" y2="360" stroke="rgba(139,92,246,0.1)" strokeWidth="1" strokeDasharray="4 6" style={{animation:'hero-line-dash 2.2s linear infinite 1s'}}/>
            <line x1="560" y1="140" x2="840" y2="130" stroke="rgba(59,130,246,0.08)" strokeWidth="1" strokeDasharray="4 6" style={{animation:'hero-line-dash 2.4s linear infinite 1.4s'}}/>
            <line x1="100" y1="340" x2="340" y2="200" stroke="rgba(34,197,94,0.08)" strokeWidth="1" strokeDasharray="4 6" style={{animation:'hero-line-dash 2s linear infinite 0.3s'}}/>
            <line x1="1100" y1="380" x2="1040" y2="220" stroke="rgba(245,158,11,0.08)" strokeWidth="1" strokeDasharray="4 6" style={{animation:'hero-line-dash 1.7s linear infinite 1.2s'}}/>
            {/* Tech nodes */}
            {[
              {cx:160, cy:120, r:18, color:'rgba(139,92,246,0.18)', stroke:'rgba(139,92,246,0.35)', dot:'#8b5cf6', label:'React', delay:'0s'},
              {cx:340, cy:200, r:22, color:'rgba(59,130,246,0.16)', stroke:'rgba(59,130,246,0.38)', dot:'#3b82f6', label:'Azure', delay:'0.6s'},
              {cx:560, cy:140, r:16, color:'rgba(6,182,212,0.14)', stroke:'rgba(6,182,212,0.32)', dot:'#06b6d4', label:'Cloud', delay:'1.2s'},
              {cx:840, cy:130, r:19, color:'rgba(99,102,241,0.16)', stroke:'rgba(99,102,241,0.35)', dot:'#6366f1', label:'Node', delay:'0.4s'},
              {cx:1040, cy:220, r:20, color:'rgba(139,92,246,0.15)', stroke:'rgba(139,92,246,0.32)', dot:'#8b5cf6', label:'AI', delay:'1s'},
              {cx:480, cy:250, r:14, color:'rgba(34,197,94,0.12)', stroke:'rgba(34,197,94,0.28)', dot:'#22c55e', label:'API', delay:'1.6s'},
              {cx:900, cy:360, r:15, color:'rgba(245,158,11,0.12)', stroke:'rgba(245,158,11,0.28)', dot:'#f59e0b', label:'Git', delay:'0.8s'},
              {cx:100, cy:340, r:13, color:'rgba(236,72,153,0.1)', stroke:'rgba(236,72,153,0.24)', dot:'#ec4899', label:'UI', delay:'1.8s'},
              {cx:1100, cy:380, r:13, color:'rgba(6,182,212,0.1)', stroke:'rgba(6,182,212,0.24)', dot:'#06b6d4', label:'DB', delay:'2.2s'},
            ].map(({cx,cy,r,color,stroke,dot,label,delay}) => (
              <g key={label} style={{animation:`hero-node-float ${3+Math.random()}s ease-in-out infinite`, animationDelay:delay, transformOrigin:`${cx}px ${cy}px`}}>
                <circle cx={cx} cy={cy} r={r} fill={color} stroke={stroke} strokeWidth="1"/>
                <circle cx={cx} cy={cy} r={r} fill="none" stroke={stroke} strokeWidth="0.8">
                  <animate attributeName="opacity" values="0.3;0.7;0.3" dur="3s" begin={delay} repeatCount="indefinite"/>
                </circle>
                <circle cx={cx} cy={cy} r={4} fill={dot} opacity="0.6"/>
                <text x={cx} y={cy+r+10} textAnchor="middle" fill={stroke} fontSize="8" fontFamily="monospace" opacity="0.7">{label}</text>
              </g>
            ))}
          </svg>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          {settings.recruitingBanner && (
            <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-200 text-violet-700 text-sm px-4 py-1.5 rounded-full mb-8 dark:bg-violet-500/10 dark:border-violet-500/25 dark:text-violet-300">
              <span className="w-2 h-2 bg-violet-500 rounded-full animate-pulse dark:bg-violet-400" />
              {settings.recruitingBanner}
            </div>
          )}

          {/* Banner — swaps with theme */}
          <style>{`
            @keyframes banner-glow { 0%,100%{opacity:0.25} 50%{opacity:0.6} }
            @keyframes banner-corner { 0%,100%{opacity:0.4} 50%{opacity:0.9} }
            @keyframes hero-blob-a { 0%,100%{transform:translate(-50%,-50%) scale(1);opacity:0.15} 50%{transform:translate(-50%,-50%) scale(1.18);opacity:0.22} }
            @keyframes hero-blob-b { 0%,100%{transform:scale(1);opacity:0.15} 50%{transform:scale(1.25);opacity:0.24} }
            @keyframes hero-blob-c { 0%,100%{transform:scale(1);opacity:0.1} 50%{transform:scale(1.2);opacity:0.18} }
            @keyframes hero-light-shift { 0%,100%{opacity:1} 50%{opacity:0.65} }
            @keyframes cursor-blink { 0%,100%{opacity:1} 50%{opacity:0} }
            @keyframes btn-pulse { 0%,100%{box-shadow:0 8px 25px -4px rgba(139,92,246,0.35)} 50%{box-shadow:0 8px 38px 4px rgba(139,92,246,0.6)} }
            @keyframes badge-pulse { 0%,100%{box-shadow:none;border-color:rgb(226,232,240)} 50%{box-shadow:0 0 8px 1px rgba(99,102,241,0.2);border-color:rgba(99,102,241,0.4)} }
            @keyframes badge-pulse-dark { 0%,100%{box-shadow:none} 50%{box-shadow:0 0 10px 2px rgba(139,92,246,0.25)} }
          `}</style>
          <div className="relative w-full max-w-5xl mx-auto mb-10">
            {/* Glow ring */}
            <div className="absolute -inset-[4px] -z-10 rounded-[20px]" style={{background:'linear-gradient(135deg,rgba(99,102,241,0.45),rgba(8,145,178,0.3),rgba(99,102,241,0.45))',filter:'blur(10px)',animation:'banner-glow 3s ease-in-out infinite'}}/>
            {/* Corner accents */}
            <svg className="absolute -top-2 -left-2 w-8 h-8" viewBox="0 0 32 32" fill="none" style={{animation:'banner-corner 3s ease-in-out infinite'}}>
              <path d="M16 2 L2 2 L2 16" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <svg className="absolute -top-2 -right-2 w-8 h-8" viewBox="0 0 32 32" fill="none" style={{animation:'banner-corner 3s ease-in-out infinite 0.75s'}}>
              <path d="M16 2 L30 2 L30 16" stroke="#0891b2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <svg className="absolute -bottom-2 -left-2 w-8 h-8" viewBox="0 0 32 32" fill="none" style={{animation:'banner-corner 3s ease-in-out infinite 1.5s'}}>
              <path d="M16 30 L2 30 L2 16" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <svg className="absolute -bottom-2 -right-2 w-8 h-8" viewBox="0 0 32 32" fill="none" style={{animation:'banner-corner 3s ease-in-out infinite 2.25s'}}>
              <path d="M16 30 L30 30 L30 16" stroke="#0891b2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="rounded-2xl overflow-hidden shadow-xl shadow-violet-500/10">
              <img src="/banner-light.svg" alt="LC3 - Lowcode Cloud Club · College of Southern Nevada" className="w-full dark:hidden" />
              <img src="/banner-dark.svg" alt="LC3 - Lowcode Cloud Club · College of Southern Nevada" className="w-full hidden dark:block" />
            </div>
          </div>

          <HeroTyping />

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-violet-500 transition-all hover:-translate-y-0.5"
              style={{animation:'btn-pulse 2.8s ease-in-out infinite'}}
            >
              {homeContent.primaryButtonLabel}
            </Link>
            <Link
              href="/members"
              className="px-8 py-3.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all hover:-translate-y-0.5 shadow-sm dark:bg-white/5 dark:border-white/15 dark:text-white dark:hover:bg-white/10 dark:hover:border-white/25"
              style={{animation:'btn-pulse 2.8s ease-in-out infinite 1.4s'}}
            >
              {homeContent.secondaryButtonLabel}
            </Link>
            <Link
              href="/shield"
              className="px-8 py-3.5 font-semibold rounded-xl transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #ef4444, #b91c1c)', color: 'white', boxShadow: '0 4px 20px rgba(239,68,68,0.25)' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              {homeContent.shieldButtonLabel}
            </Link>
          </div>

          {/* Quick-nav cards */}
          <div className="mt-10 grid grid-cols-3 sm:grid-cols-6 gap-3 w-full max-w-2xl mx-auto">
            {[
              { href: '/events', label: 'Events', icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              )},
              { href: '/projects', label: 'Projects', icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
              )},
              { href: '/gallery', label: 'Gallery', icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              )},
              { href: '/blog', label: 'Blog', icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
              )},
              { href: '/members', label: 'Members', icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              )},
              { href: '/about', label: 'About', icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              )},
            ].map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-2 py-4 px-2 rounded-2xl bg-white border border-slate-200 hover:border-violet-300 hover:bg-violet-50/50 hover:-translate-y-0.5 shadow-sm transition-all duration-200 text-center group dark:bg-white/5 dark:border-white/10 dark:hover:border-violet-500/40 dark:hover:bg-violet-500/5"
              >
                <span className="text-slate-500 group-hover:text-violet-600 dark:text-slate-400 dark:group-hover:text-violet-400 transition-colors">
                  {icon}
                </span>
                <span className="text-xs font-medium text-slate-600 group-hover:text-violet-700 dark:text-slate-400 dark:group-hover:text-violet-300 transition-colors">{label}</span>
              </Link>
            ))}
          </div>

          {/* Tech stack strip */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {homeContent.techStack.map((tech, i) => (
              <span
                key={tech}
                className="text-xs text-slate-500 bg-white border px-3 py-1 rounded-full transition-all duration-200 hover:text-violet-600 hover:border-violet-300 hover:bg-violet-50 dark:bg-white/5 dark:border-white/10 dark:hover:text-violet-400 dark:hover:border-violet-500/40 dark:hover:bg-violet-500/10"
                style={{animation:`badge-pulse 3.5s ease-in-out infinite ${i * 220}ms`}}
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
              <p className="text-slate-900 text-sm font-medium dark:text-white">{homeContent.companyCtaTitle}</p>
              <p className="text-slate-500 text-xs">{homeContent.companyCtaDesc}</p>
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
        <StaggerReveal className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center" stagger={120}>
          {[
            { value: stats.activeMembers, label: 'Active Members' },
            { value: stats.eventsHosted, label: 'Events Hosted' },
            { value: stats.projectsBuilt, label: 'Projects Built' },
            { value: stats.yearsActive, label: 'Years Active' },
          ].map(({ value, label }) => (
            <AnimatedStat key={label} value={value} label={label} />
          ))}
        </StaggerReveal>
        </ScrollReveal>
      </section>

      {/* About */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-violet-600 dark:text-violet-400 text-sm font-medium mb-2">{homeContent.aboutEyebrow}</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">{homeContent.aboutHeading}</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              {homeContent.aboutBody1}
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              {homeContent.aboutBody2}
            </p>
          </div>

          <StaggerReveal className="grid grid-cols-2 gap-4" stagger={100}>
            {homeContent.missionItems.map(({ title, desc }, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-xl p-5 hover:border-violet-200 hover:shadow-sm transition-all dark:bg-[#0d1424] dark:border-[#1e2d45] dark:hover:border-violet-500/30"
              >
                <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center mb-3 dark:bg-white/5 dark:border-transparent">
                  {missionIcons[i % missionIcons.length]}
                </div>
                <div className="text-slate-900 dark:text-white font-medium text-sm mb-1">{title}</div>
                <div className="text-slate-500 text-xs leading-relaxed">{desc}</div>
              </div>
            ))}
          </StaggerReveal>
        </div>
        </ScrollReveal>
      </section>

      {/* LC3 Shield Feature Section */}
      <section className="py-16 border-t border-slate-200 dark:border-[#1e2d45]">
        <ScrollReveal>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="relative rounded-3xl overflow-hidden border border-red-200/60 dark:border-red-500/15 bg-gradient-to-br from-red-50/60 via-white to-slate-50 dark:from-red-950/20 dark:via-[#0d1424] dark:to-[#0d1424] p-8 sm:p-10">
            {/* Background glow */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-red-500/5 dark:bg-red-500/8 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-violet-500/5 dark:bg-violet-500/8 rounded-full blur-3xl pointer-events-none" />

            <div className="relative grid md:grid-cols-2 gap-8 items-center">
              <div>
                {/* Badge */}
                <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-600 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  {homeContent.shieldBadgeLabel}
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3" style={{ letterSpacing: '-0.02em' }}>
                  {homeContent.shieldHeadingPrefix}{' '}
                  <span className="bg-gradient-to-r from-red-500 to-violet-600 bg-clip-text text-transparent">LC3 Shield</span>
                </h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6 text-sm">
                  {homeContent.shieldDescription}
                </p>
                <div className="flex flex-wrap gap-2 mb-7">
                  {(homeContent.shieldFeatureTags ?? []).map((f) => (
                    <span key={f} className="text-xs px-2.5 py-1 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400">
                      {f}
                    </span>
                  ))}
                </div>
                <Link
                  href="/shield"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-500/20"
                  style={{ background: 'linear-gradient(135deg, #ef4444, #b91c1c)' }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                  {homeContent.shieldCtaLabel}
                </Link>
              </div>

              {/* Right side: mini feature list */}
              <div className="grid grid-cols-2 gap-3">
                {(homeContent.shieldFeatureCards ?? []).map(({ icon, title, desc }) => (
                  <div key={title} className="bg-white/60 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.06] rounded-xl p-4">
                    <div className="text-xl mb-2">{icon}</div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white mb-1">{title}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</div>
                  </div>
                ))}
              </div>
            </div>
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
                <p className="text-violet-600 dark:text-violet-400 text-sm font-medium mb-1">{homeContent.projectsEyebrow}</p>
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">{homeContent.projectsHeading}</h2>
              </div>
              <Link href="/projects" className="text-slate-500 hover:text-slate-700 dark:hover:text-white text-sm transition-colors hidden sm:block">
                View all projects →
              </Link>
            </div>

            <StaggerReveal className="grid md:grid-cols-3 gap-6">
              {featuredProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-violet-200 hover:shadow-md transition-all hover:-translate-y-0.5 dark:bg-[#111a2e] dark:border-[#1e2d45] dark:hover:border-violet-500/30 dark:hover:shadow-none"
                >
                  <div className={`h-1.5 bg-gradient-to-r ${project.gradient}`} />
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-slate-900 dark:text-white font-semibold text-lg">{project.name}</h3>
                      {project.status && <HomeStatusBadge status={project.status} />}
                    </div>
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
            </StaggerReveal>
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
              <p className="text-blue-600 dark:text-blue-400 text-sm font-medium mb-1">{homeContent.eventsEyebrow}</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">{homeContent.eventsHeading}</h2>
            </div>
            <Link href="/events" className="text-slate-500 hover:text-slate-700 dark:hover:text-white text-sm transition-colors hidden sm:block">
              All events →
            </Link>
          </div>

          <StaggerReveal className="grid md:grid-cols-2 gap-6">
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
          </StaggerReveal>
          </ScrollReveal>
        </section>
      )}

      {/* Latest Posts */}
      {latestPosts.length > 0 && (
        <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-violet-600 dark:text-violet-400 text-sm font-medium mb-1">{homeContent.blogEyebrow}</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">{homeContent.blogHeading}</h2>
            </div>
            <Link href="/blog" className="text-slate-500 hover:text-slate-700 dark:hover:text-white text-sm transition-colors hidden sm:block">
              All posts →
            </Link>
          </div>
          <StaggerReveal className="grid md:grid-cols-3 gap-6">
            {latestPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="block bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-violet-200 hover:shadow-sm transition-all group dark:bg-[#0d1424] dark:border-[#1e2d45] dark:hover:border-violet-500/30"
              >
                <div className="h-1.5 bg-gradient-to-r from-violet-500 to-blue-500" />
                <div className="p-6">
                  <p className="text-xs text-slate-400 mb-3">
                    {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
                  )}
                </div>
              </Link>
            ))}
          </StaggerReveal>
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
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">{homeContent.ctaHeading}</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-8">
            {homeContent.ctaDescription}
          </p>
          <Link
            href="/contact"
            className="px-10 py-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-violet-500/20 inline-block"
          >
            {homeContent.ctaButtonLabel}
          </Link>
        </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
