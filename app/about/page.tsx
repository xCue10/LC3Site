import type { Metadata } from 'next';
import Link from 'next/link';
import { readJSON, AboutContent } from '@/lib/data';
import { CommunityNetwork, LearnBuildLeadPathway } from '../components/Illustrations';

export const revalidate = 30;

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about LC3 - Lowcode Cloud Club: our mission, what we build, who we are, and how to get involved.',
};

const valueIcons = [
  <svg key="code" className="w-6 h-6 text-violet-600 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>,
  <svg key="people" className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  <svg key="briefcase" className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  <svg key="heart" className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
];

const techColors = [
  'text-purple-600 dark:text-purple-400 bg-purple-50 border-purple-200 dark:bg-purple-500/10 dark:border-purple-500/20',
  'text-blue-600 dark:text-blue-400 bg-blue-50 border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/20',
  'text-sky-600 dark:text-sky-400 bg-sky-50 border-sky-200 dark:bg-blue-500/10 dark:border-blue-500/20',
  'text-violet-600 dark:text-violet-400 bg-violet-50 border-violet-200 dark:bg-violet-500/10 dark:border-violet-500/20',
];

const defaults: AboutContent = {
  heroTagline: 'Who we are',
  heroDescription: 'LC3 — the Lowcode Cloud Club — is a university student organization at the intersection of low-code platforms, cloud computing, and real-world software development.',
  mission: "To empower students to build real-world software using modern tools.",
  valuesTitle: 'What we stand for',
  valuesSubtitle: 'The principles that guide everything we do.',
  values: [
    { title: 'Learn by Building', desc: 'We believe the best way to learn is to create.' },
    { title: 'Open to Everyone', desc: 'No prior experience required. We welcome students from all majors.' },
  ],
  techStackTitle: 'What we work with',
  techStackSubtitle: 'Our toolkit spans low-code platforms, cloud services, and modern development frameworks.',
  techStack: ['Power Apps', 'Power Automate', 'Azure', 'Copilot Studio', 'GitHub', 'React', 'Python', 'Node.js'],
  activitiesTitle: 'What we do',
  activitiesSubtitle: 'A look at the activities and programs that make up the LC3 experience.',
  activities: [
    { title: 'Weekly Meetings', desc: 'Regular meetups with workshops, demos, and project standups.' },
  ],
  ctaTitle: 'Ready to join?',
  ctaDescription: "Whether you want to build, learn, or lead — there's a place for you in LC3.",
};

export default function AboutPage() {
  const about = readJSON<AboutContent>('about.json', defaults);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-slate-200 dark:border-[#1e2d45]">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-blue-50/40 to-transparent dark:from-violet-950/25 dark:via-blue-950/15 dark:to-transparent pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-400/40 to-transparent pointer-events-none" />
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
            <div className="flex-1 text-center md:text-left">
              <p className="text-violet-600 dark:text-violet-400 text-sm font-medium mb-3 uppercase tracking-widest">{about.heroTagline}</p>
              <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white mb-4 leading-tight">
                About <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-violet-700 bg-clip-text text-transparent dark:from-blue-400 dark:via-violet-400 dark:to-violet-500">LC3</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">{about.heroDescription}</p>
            </div>
            <div className="flex-shrink-0 w-full max-w-[280px]">
              <CommunityNetwork />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
        <div className="bg-gradient-to-br from-blue-50 via-violet-50/50 to-transparent dark:from-blue-500/5 dark:via-violet-500/5 dark:to-transparent border border-blue-100 dark:border-violet-500/10 rounded-[2.5rem] p-10 mb-24 text-center">
          <p className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-[0.2em] mb-6">Our Mission</p>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-relaxed italic">
            &ldquo;{about.mission}&rdquo;
          </p>
        </div>

        <div className="mb-24">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">{about.valuesTitle}</h2>
          <p className="text-slate-500 mb-10 text-lg">{about.valuesSubtitle}</p>
          <div className="grid sm:grid-cols-2 gap-8">
            {about.values.map(({ title, desc }, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-3xl p-8 dark:bg-white/5 dark:border-white/10 hover:border-violet-500/30 transition-all group">
                <div className="w-12 h-12 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {valueIcons[i % valueIcons.length]}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden bg-slate-900 rounded-[3rem] p-10 sm:p-16 text-white shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-violet-600/20 to-transparent opacity-50" />
          <div className="relative flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-8">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider">Now Recruiting</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 tracking-tight">{about.ctaTitle}</h2>
              <p className="text-blue-100 text-lg mb-10 max-w-md leading-relaxed opacity-90">{about.ctaDescription}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact" className="px-10 py-4 bg-white text-blue-700 font-bold rounded-2xl hover:scale-105 transition-transform text-center shadow-xl shadow-black/20">Apply to Join</Link>
                <Link href="/members" className="px-10 py-4 bg-white/10 border border-white/20 text-white font-bold rounded-2xl hover:bg-white/20 transition-all text-center">Meet the Team</Link>
              </div>
            </div>
            <div className="flex-shrink-0 w-full max-w-[220px]">
              <LearnBuildLeadPathway />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
