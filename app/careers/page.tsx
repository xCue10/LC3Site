import { readJSON } from '@/lib/data';
import type { Metadata } from 'next';
import CareersLiveLanding from './CareersLiveLanding';

export const dynamic = 'force-dynamic';

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

function CareersHeroSVG() {
  return (
    <svg width="280" height="280" viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
      {/* Outer ring */}
      <circle cx="140" cy="140" r="130" stroke="rgba(59,130,246,0.3)" strokeWidth="1">
        <animateTransform attributeName="transform" type="rotate" from="0 140 140" to="360 140 140" dur="20s" repeatCount="indefinite" />
      </circle>
      <circle cx="140" cy="140" r="100" stroke="rgba(139,92,246,0.2)" strokeWidth="1">
        <animateTransform attributeName="transform" type="rotate" from="360 140 140" to="0 140 140" dur="14s" repeatCount="indefinite" />
      </circle>
      {/* Pulse */}
      <circle cx="140" cy="140" r="75" stroke="rgba(59,130,246,0.15)" strokeWidth="2">
        <animate attributeName="r" values="60;80;60" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0;0.5" dur="4s" repeatCount="indefinite" />
      </circle>
      {/* Briefcase icon center */}
      <rect x="108" y="118" width="64" height="48" rx="6" fill="rgba(59,130,246,0.12)" stroke="rgba(59,130,246,0.6)" strokeWidth="2">
        <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite" />
      </rect>
      <path d="M124 118v-8a4 4 0 014-4h24a4 4 0 014 4v8" stroke="rgba(59,130,246,0.6)" strokeWidth="2" fill="none">
        <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite" />
      </path>
      <line x1="108" y1="140" x2="172" y2="140" stroke="rgba(59,130,246,0.5)" strokeWidth="1.5" />
      {/* Floating dots */}
      <circle cx="270" cy="140" r="4" fill="rgba(59,130,246,0.8)">
        <animateTransform attributeName="transform" type="rotate" from="0 140 140" to="360 140 140" dur="20s" repeatCount="indefinite" />
      </circle>
      <circle cx="140" cy="10" r="3.5" fill="rgba(139,92,246,0.8)">
        <animateTransform attributeName="transform" type="rotate" from="0 140 140" to="360 140 140" dur="20s" repeatCount="indefinite" />
      </circle>
      <circle cx="10" cy="140" r="3" fill="rgba(59,130,246,0.6)">
        <animateTransform attributeName="transform" type="rotate" from="180 140 140" to="540 140 140" dur="20s" repeatCount="indefinite" />
      </circle>
      {/* Corner brackets */}
      <path d="M20 8 L8 8 L8 20" stroke="rgba(59,130,246,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <animate attributeName="opacity" values="0.4;0.9;0.4" dur="3s" repeatCount="indefinite" />
      </path>
      <path d="M260 8 L272 8 L272 20" stroke="rgba(139,92,246,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <animate attributeName="opacity" values="0.4;0.9;0.4" dur="3s" repeatCount="indefinite" begin="0.75s" />
      </path>
      <path d="M20 272 L8 272 L8 260" stroke="rgba(59,130,246,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <animate attributeName="opacity" values="0.4;0.9;0.4" dur="3s" repeatCount="indefinite" begin="1.5s" />
      </path>
      <path d="M260 272 L272 272 L272 260" stroke="rgba(139,92,246,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <animate attributeName="opacity" values="0.4;0.9;0.4" dur="3s" repeatCount="indefinite" begin="2.25s" />
      </path>
    </svg>
  );
}

function CareersOffline({ config }: { config: CareersPageConfig }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/20 dark:from-[#060b18] dark:via-[#080d1c] dark:to-[#0a1020]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-16 pb-20 text-center">
        <div className="flex justify-center mb-6">
          <CareersHeroSVG />
        </div>

        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-400 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            {config.tagline}
          </span>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4" style={{ letterSpacing: '-0.03em' }}>
            {config.heading} is{' '}
            <span className="bg-gradient-to-r from-blue-500 to-violet-600 bg-clip-text text-transparent">
              coming soon
            </span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {config.description}
          </p>
        </div>

        {config.features.length > 0 && (
          <div className="mt-10">
            <p className="text-center text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-6">
              What&apos;s coming
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
              {config.features.map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-white/60 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.06] rounded-xl px-4 py-3"
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(59,130,246,0.1)' }}>
                    <svg className="w-3.5 h-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-sm text-slate-700 dark:text-slate-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-14 text-center">
          <div className="inline-flex flex-col items-center gap-3 bg-white/60 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.06] rounded-2xl px-8 py-6 max-w-sm mx-auto">
            <svg className="w-6 h-6 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Stay tuned</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                LC3 Careers will be available to LC3 Club members at CSN.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
