import Link from 'next/link';
import { readJSON } from '@/lib/data';
import ShieldDashboardPreview from '@/app/components/ShieldDashboardPreview';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'LC3 Shield — Security Scanner',
  description: 'LC3 Shield is a cybersecurity scanner for LC3 Club members and CSN students. Scan URLs, analyze code, audit GitHub repos, and more — powered by Claude AI.',
};

interface ShieldPageConfig {
  live: boolean;
  heading: string;
  tagline: string;
  description: string;
  features: string[];
}

const defaults: ShieldPageConfig = {
  live: false,
  heading: 'LC3 Shield',
  tagline: 'Coming Soon',
  description: 'LC3 Shield is a hands-on cybersecurity scanner built for LC3 Club members and CSN students.',
  features: [],
};

export default function ShieldPage() {
  const config = readJSON<ShieldPageConfig>('shield.json', defaults);

  if (config.live) {
    // Shield is live — redirect client-side to login
    return <ShieldLiveLanding config={config} />;
  }

  return <ShieldComingSoon config={config} />;
}

function ShieldHeroSVG() {
  return (
    <svg
      width="320"
      height="320"
      viewBox="0 0 320 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto"
    >
      {/* Outer orbital ring */}
      <circle cx="160" cy="160" r="148" stroke="rgba(59,130,246,0.4)" strokeWidth="1">
        <animateTransform attributeName="transform" type="rotate" from="0 160 160" to="360 160 160" dur="18s" repeatCount="indefinite" />
      </circle>
      {/* Middle orbital ring */}
      <circle cx="160" cy="160" r="118" stroke="rgba(59,130,246,0.25)" strokeWidth="1">
        <animateTransform attributeName="transform" type="rotate" from="360 160 160" to="0 160 160" dur="12s" repeatCount="indefinite" />
      </circle>
      {/* Inner orbital ring */}
      <circle cx="160" cy="160" r="88" stroke="rgba(239,68,68,0.2)" strokeWidth="1">
        <animateTransform attributeName="transform" type="rotate" from="0 160 160" to="360 160 160" dur="8s" repeatCount="indefinite" />
      </circle>

      {/* Pulse rings */}
      <circle cx="160" cy="160" r="148" stroke="rgba(239,68,68,0.12)" strokeWidth="2">
        <animate attributeName="r" values="100;155;100" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0;0.5" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="160" cy="160" r="80" stroke="rgba(59,130,246,0.15)" strokeWidth="2">
        <animate attributeName="r" values="60;90;60" dur="4s" repeatCount="indefinite" begin="1s" />
        <animate attributeName="opacity" values="0.4;0;0.4" dur="4s" repeatCount="indefinite" begin="1s" />
      </circle>

      {/* Radar sweep */}
      <path d="M160 160 L308 160" stroke="rgba(239,68,68,0.5)" strokeWidth="1.5">
        <animateTransform attributeName="transform" type="rotate" from="0 160 160" to="360 160 160" dur="3s" repeatCount="indefinite" />
      </path>
      <path d="M160 160 L308 160" stroke="rgba(239,68,68,0.18)" strokeWidth="8">
        <animateTransform attributeName="transform" type="rotate" from="0 160 160" to="360 160 160" dur="3s" repeatCount="indefinite" />
      </path>

      {/* Scan line */}
      <line x1="12" y1="160" x2="308" y2="160" stroke="rgba(59,130,246,0.35)" strokeWidth="1" strokeDasharray="4 6">
        <animate attributeName="y1" values="80;240;80" dur="5s" repeatCount="indefinite" />
        <animate attributeName="y2" values="80;240;80" dur="5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.8;0.2;0.8" dur="5s" repeatCount="indefinite" />
      </line>

      {/* Shield shape */}
      <path
        d="M160 72 L220 96 L220 152 Q220 192 160 216 Q100 192 100 152 L100 96 Z"
        fill="rgba(239,68,68,0.08)"
        stroke="rgba(239,68,68,0.5)"
        strokeWidth="2"
      >
        <animate attributeName="opacity" values="0.6;1;0.6" dur="2.5s" repeatCount="indefinite" />
      </path>
      {/* Shield check */}
      <path
        d="M147 150 L156 160 L174 138"
        stroke="rgba(239,68,68,0.8)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        <animate attributeName="opacity" values="0.5;1;0.5" dur="2.5s" repeatCount="indefinite" />
      </path>

      {/* Floating nodes on outer ring */}
      <circle cx="308" cy="160" r="4" fill="rgba(59,130,246,0.8)">
        <animateTransform attributeName="transform" type="rotate" from="0 160 160" to="360 160 160" dur="18s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="12" cy="160" r="3" fill="rgba(59,130,246,0.6)">
        <animateTransform attributeName="transform" type="rotate" from="0 160 160" to="360 160 160" dur="18s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2.4s" repeatCount="indefinite" begin="0.8s" />
      </circle>
      <circle cx="160" cy="12" r="3.5" fill="rgba(239,68,68,0.7)">
        <animateTransform attributeName="transform" type="rotate" from="0 160 160" to="360 160 160" dur="18s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.8s" repeatCount="indefinite" begin="0.4s" />
      </circle>

      {/* Corner brackets */}
      <path d="M28 16 L16 16 L16 28" stroke="rgba(239,68,68,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <animate attributeName="opacity" values="0.4;0.9;0.4" dur="3s" repeatCount="indefinite" />
      </path>
      <path d="M292 16 L304 16 L304 28" stroke="rgba(59,130,246,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <animate attributeName="opacity" values="0.4;0.9;0.4" dur="3s" repeatCount="indefinite" begin="0.75s" />
      </path>
      <path d="M28 304 L16 304 L16 292" stroke="rgba(239,68,68,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <animate attributeName="opacity" values="0.4;0.9;0.4" dur="3s" repeatCount="indefinite" begin="1.5s" />
      </path>
      <path d="M292 304 L304 304 L304 292" stroke="rgba(59,130,246,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <animate attributeName="opacity" values="0.4;0.9;0.4" dur="3s" repeatCount="indefinite" begin="2.25s" />
      </path>
    </svg>
  );
}

function ShieldLiveLanding({ config }: { config: ShieldPageConfig }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-red-50/20 dark:from-[#080d18] dark:via-[#0a1020] dark:to-[#0d1424]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-16 pb-20 text-center">
        {/* Dashboard preview */}
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-md">
            <ShieldDashboardPreview />
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4" style={{ letterSpacing: '-0.03em' }}>
          {config.heading}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10">
          {config.description}
        </p>

        <Link
          href="/shield/login"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-white text-base transition-all hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #ef4444, #b91c1c)', boxShadow: '0 0 32px rgba(239,68,68,0.3)' }}
        >
          Sign In to LC3 Shield
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>

        {config.features.length > 0 && (
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left max-w-2xl mx-auto">
            {config.features.map((f) => (
              <div key={f} className="flex items-start gap-2 bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-700 dark:text-slate-300">
                <svg className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {f}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ShieldComingSoon({ config }: { config: ShieldPageConfig }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-red-50/20 dark:from-[#080d18] dark:via-[#0a1020] dark:to-[#0d1424]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-16 pb-20 text-center">
        {/* Dashboard preview */}
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-md">
            <ShieldDashboardPreview />
          </div>
        </div>

        {/* Coming Soon badge */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-600 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            {config.tagline}
          </span>
        </div>

        {/* Heading */}
        <div className="mb-6">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4" style={{ letterSpacing: '-0.03em' }}>
            {config.heading} is{' '}
            <span className="bg-gradient-to-r from-red-500 to-violet-600 bg-clip-text text-transparent">
              in progress
            </span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {config.description}
          </p>
        </div>

        {/* Feature grid */}
        {config.features.length > 0 && (
          <div className="mt-12">
            <p className="text-center text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-6">
              What&apos;s coming
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
              {config.features.map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-white/60 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.06] rounded-xl px-4 py-3"
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(239,68,68,0.1)' }}>
                    <svg className="w-3.5 h-3.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  </div>
                  <span className="text-sm text-slate-700 dark:text-slate-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stay tuned */}
        <div className="mt-14 text-center">
          <div className="inline-flex flex-col items-center gap-3 bg-white/60 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.06] rounded-2xl px-8 py-6 max-w-sm mx-auto">
            <svg className="w-6 h-6 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Stay tuned</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                LC3 Shield will be available to club members and CSN students.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
