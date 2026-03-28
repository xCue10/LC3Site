import { readJSON } from '@/lib/data';
import type { Metadata } from 'next';
import CareersLiveLanding from './CareersLiveLanding';
import CareersDashboardPreview from '@/app/components/CareersDashboardPreview';

export const revalidate = 30;

export const metadata: Metadata = {
  title: 'LC3 Careers — AI-Powered Job Board',
  description: 'Find your next tech opportunity powered by AI. LC3 Careers helps CSN students find internships, federal roles, and remote jobs with AI match scoring and cover letter generation.',
};

interface CareersPageConfig {
  live: boolean;
  heading: string;
  tagline: string;
  description: string;
  features: string[];
}

const defaults: CareersPageConfig = {
  live: false,
  heading: 'LC3 Careers',
  tagline: 'Coming Soon',
  description: 'LC3 Careers is an AI-powered job board built for LC3 Club members at the College of Southern Nevada.',
  features: [],
};

export default function CareersPage() {
  const config = readJSON<CareersPageConfig>('careers.json', defaults);

  if (config.live) {
    return <CareersLiveLanding config={config} />;
  }

  return <CareersOffline config={config} />;
}


function CareersOffline({ config }: { config: CareersPageConfig }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/20 dark:from-[#060b18] dark:via-[#080d1c] dark:to-[#0a1020]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: text */}
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-400 uppercase tracking-wider mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              {config.tagline}
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4 mt-2" style={{ letterSpacing: '-0.03em' }}>
              {config.heading} is{' '}
              <span className="bg-gradient-to-r from-blue-500 to-violet-600 bg-clip-text text-transparent">
                coming soon
              </span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              {config.description}
            </p>
            {config.features.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {config.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/60 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.06] rounded-xl px-4 py-3">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(59,130,246,0.1)' }}>
                      <svg className="w-3.5 h-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <span className="text-sm text-slate-700 dark:text-slate-300">{feature}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="inline-flex items-center gap-3 bg-white/60 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.06] rounded-2xl px-6 py-4">
              <svg className="w-5 h-5 text-violet-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Stay tuned</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Available to LC3 Club members at CSN.</p>
              </div>
            </div>
          </div>
          {/* Right: preview */}
          <div>
            <CareersDashboardPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
