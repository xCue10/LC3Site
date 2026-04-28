import Link from 'next/link';
import Image from 'next/image';
import { readJSON, Event, Project, Member, Stats, SiteSettings, Post, SponsorsConfig, CaseStudiesConfig, HomeContent, ProjectStatus } from '@/lib/data';
import ScrollReveal from './components/ScrollReveal';
import HeroTyping from './components/HeroTyping';
import AnimatedStat from './components/AnimatedStat';
import StaggerReveal from './components/StaggerReveal';
import ShieldDashboardPreview from './components/ShieldDashboardPreview';
import CareersDashboardPreview from './components/CareersDashboardPreview';
import { BannerCorners, MissionIcons, NavIcons } from './components/Icons';
import type { Metadata } from 'next';

export const revalidate = 30;

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
      <span className="inline-flex items-center gap-1.5 text-[10px] font-mono-tech px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
        <span className="w-1 h-1 rounded-full bg-amber-500 animate-pulse" />
        In Progress
      </span>
    );
  }
  if (status === 'completed') {
    return (
      <span className="inline-flex items-center gap-1.5 text-[10px] font-mono-tech px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
        Completed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono-tech px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 shrink-0">
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
  const latestPosts = readJSON<Post[]>('posts.json').filter((p) => p.published).slice(0, 3);
  
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
    aboutBody1: 'LC3 — Lowcode Cloud Club — is a student-run tech organization focused on low-code platforms, cloud technologies, and modern software development.',
    aboutBody2: "Whether you're building your first app or already working in tech, LC3 is a place to grow.",
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
    shieldDescription: 'A hands-on cybersecurity scanner built for LC3 members.',
    shieldFeatureTags: ['URL Scanner', 'Code Analysis', 'SSL/TLS'],
    shieldCtaLabel: 'Explore LC3 Shield',
    shieldButtonLabel: 'LC3 Shield',
    shieldFeatureCards: [],
  };
  
  const home = readJSON<HomeContent>('home.json', homeDefaults);
  const homeContent: HomeContent = { ...homeDefaults, ...home };

  const spotlightMember = members.length > 0 ? members[Math.floor(Math.random() * members.length)] : null;

  return (
    <div className="overflow-x-hidden grainy-bg">
      {/* Hero */}
      <section className="relative overflow-hidden py-14 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          {settings.recruitingBanner && (
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-slate-300 font-mono-tech text-[10px] px-4 py-1.5 rounded-full mb-8">
              <span className="w-1.5 h-1.5 bg-cyber-lime rounded-full animate-pulse" />
              {settings.recruitingBanner}
            </div>
          )}

          <div className="relative w-full max-w-5xl mx-auto mb-10">
            <div className="absolute -inset-[4px] -z-10 rounded-[20px] bg-gradient-to-r from-indigo-500/40 via-cyan-400/30 to-indigo-500/40 blur-lg animate-banner-glow" />
            <BannerCorners />
            <div className="rounded-2xl overflow-hidden shadow-xl shadow-violet-500/10">
              <Image src="/banner-light.svg" alt="LC3 Banner" width={1200} height={400} className="w-full dark:hidden" priority />
              <Image src="/banner-dark.svg" alt="LC3 Banner" width={1200} height={400} className="w-full hidden dark:block" priority />
            </div>
          </div>

          <HeroTyping />

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link href="/contact" className="px-8 py-3.5 bg-cyber-lime text-black font-black uppercase tracking-tight rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-cyber-lime/20">
              {homeContent.primaryButtonLabel}
            </Link>
            <Link href="/members" className="px-8 py-3.5 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all">
              {homeContent.secondaryButtonLabel}
            </Link>
          </div>

          {/* Quick-nav */}
          <div className="mt-12 grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-6 gap-4 w-full max-w-3xl mx-auto">
            {[
              { href: '/events', label: 'Events', icon: <NavIcons.Events /> },
              { href: '/projects', label: 'Projects', icon: <NavIcons.Projects /> },
              { href: '/gallery', label: 'Gallery', icon: <NavIcons.Gallery /> },
              { href: '/blog', label: 'Blog', icon: <NavIcons.Blog /> },
              { href: '/members', label: 'Members', icon: <NavIcons.Members /> },
              { href: '/about', label: 'About', icon: <NavIcons.About /> },
            ].map(({ href, label, icon }) => (
              <Link key={href} href={href} className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-violet-400 hover:bg-violet-500/5 transition-all group">
                <span className="text-slate-500 dark:text-slate-400 group-hover:text-violet-400 transition-colors">{icon}</span>
                <span className="text-[10px] font-mono-tech text-slate-500 dark:text-slate-400 group-hover:text-violet-300">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-slate-200 dark:border-white/5 py-12 bg-slate-50/50 dark:bg-white/[0.02]">
        <StaggerReveal className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <AnimatedStat value={statsOverrides.activeMembers || String(members.length)} label="HACKERS" />
          <AnimatedStat value={statsOverrides.eventsHosted || '12'} label="EVENTS" />
          <AnimatedStat value={statsOverrides.projectsBuilt || '8'} label="SHIPPED" />
          <AnimatedStat value={statsOverrides.yearsActive || '1'} label="YEARS" />
        </StaggerReveal>
      </section>

      {/* Member Spotlight & Discord */}
      {settings.showSpotlight && (
        <section className="py-20 max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Discord Card */}
            <div className="md:col-span-2 bg-gradient-to-br from-[#5865F2] to-[#4752c4] rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl group-hover:scale-110 transition-transform duration-700" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.7 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.07 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.086 2.157 2.419 0 1.334-.947 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.086 2.157 2.419 0 1.334-.946 2.419-2.157 2.419z"/></svg>
                </div>
                <h3 className="text-3xl font-black mb-2">Join the Discord</h3>
                <p className="text-blue-100 mb-8 max-w-sm">Chat with other members, get help with projects, and stay updated on meetings.</p>
                <a href="https://discord.gg/your-link" target="_blank" rel="noopener" className="inline-block px-8 py-3 bg-white text-[#5865F2] font-black uppercase tracking-tight rounded-xl hover:bg-blue-50 transition-colors">Open Discord</a>
              </div>
            </div>

            {/* Member Spotlight */}
            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 flex flex-col items-center text-center">
              <span className="font-mono-tech text-[10px] text-violet-500 mb-6 tracking-[0.2em]">Member Spotlight</span>
              {spotlightMember ? (
                <>
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-violet-500/30 p-1">
                    <img src={spotlightMember.avatarUrl || '/avatar-placeholder.svg'} alt={spotlightMember.name} className="w-full h-full object-cover rounded-full" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white">{spotlightMember.name}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{spotlightMember.role}</p>
                  <Link href="/members" className="text-xs font-bold text-violet-500 hover:underline underline-offset-4 tracking-widest">VIEW TEAM</Link>
                </>
              ) : (
                <p className="text-slate-400 text-sm">Meet our community!</p>
              )}
            </div>
          </div>
        </section>
      )}
      {/* Shield Preview */}
      <section className="py-24 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#bef264,transparent_50%)] opacity-5" />
        <div className="max-w-6xl mx-auto px-4">
          <ShieldDashboardPreview content={homeContent} />
        </div>
      </section>

      {/* Projects */}
      <section className="py-24 bg-white dark:bg-[#0a1020]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="font-mono-tech text-[10px] text-blue-500 tracking-[0.2em] mb-3 block">{homeContent.projectsEyebrow}</span>
              <h2 className="text-4xl font-black text-slate-900 dark:text-white">Active Builds</h2>
            </div>
            <Link href="/projects" className="text-sm font-bold text-slate-400 hover:text-blue-500 transition-colors">ALL PROJECTS →</Link>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredProjects.slice(0, 3).map((project) => (
              <div key={project.id} className="group bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2.5rem] overflow-hidden hover:border-blue-500/30 transition-all duration-500">
                <div className={`h-2 bg-gradient-to-r ${project.gradient}`} />
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <HomeStatusBadge status={project.status || 'open'} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{project.name}</h3>
                  <p className="text-slate-500 text-sm mb-6 line-clamp-2">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-mono-tech text-slate-400 bg-slate-200 dark:bg-white/10 px-2 py-1 rounded-md">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto bg-slate-900 border border-white/10 rounded-[3.5rem] p-12 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-transparent to-blue-600/20" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-black mb-6 tracking-tight">{homeContent.ctaHeading}</h2>
            <p className="text-lg text-slate-400 mb-10 leading-relaxed">{homeContent.ctaDescription}</p>
            <Link href="/contact" className="inline-block px-12 py-4 bg-cyber-lime text-black font-black uppercase tracking-tight rounded-2xl hover:scale-105 transition-transform shadow-xl shadow-cyber-lime/20">
              {homeContent.ctaButtonLabel}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
