import Link from 'next/link';
import { readJSON } from '@/lib/data';
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

function ShieldLiveLanding({ config }: { config: ShieldPageConfig }) {
  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-violet-50/30 dark:from-[#080d18] dark:via-[#0a1020] dark:to-[#0d1424] -z-10" />
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <svg className="absolute -top-40 -right-40 w-[600px] h-[600px] opacity-[0.04] dark:opacity-[0.06]" viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="80" stroke="url(#sg1)" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="60" stroke="url(#sg1)" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="40" stroke="url(#sg1)" strokeWidth="0.5" />
          <defs>
            <linearGradient id="sg1" x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
              <stop stopColor="#8b5cf6" />
              <stop offset="1" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-20 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #ef4444, #b91c1c)', boxShadow: '0 0 48px rgba(239,68,68,0.3)' }}
          >
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
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
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-violet-50/30 dark:from-[#080d18] dark:via-[#0a1020] dark:to-[#0d1424] -z-10" />

      {/* Animated SVG background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <svg
          className="absolute -top-32 -right-32 w-[700px] h-[700px] opacity-[0.035] dark:opacity-[0.06]"
          viewBox="0 0 400 400"
          fill="none"
        >
          <circle cx="200" cy="200" r="180" stroke="url(#cs-g1)" strokeWidth="0.6">
            <animateTransform attributeName="transform" type="rotate" from="0 200 200" to="360 200 200" dur="60s" repeatCount="indefinite" />
          </circle>
          <circle cx="200" cy="200" r="140" stroke="url(#cs-g1)" strokeWidth="0.6">
            <animateTransform attributeName="transform" type="rotate" from="360 200 200" to="0 200 200" dur="40s" repeatCount="indefinite" />
          </circle>
          <circle cx="200" cy="200" r="100" stroke="url(#cs-g1)" strokeWidth="0.6">
            <animateTransform attributeName="transform" type="rotate" from="0 200 200" to="360 200 200" dur="25s" repeatCount="indefinite" />
          </circle>
          <defs>
            <linearGradient id="cs-g1" x1="20" y1="20" x2="380" y2="380" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ef4444" />
              <stop offset="0.5" stopColor="#8b5cf6" />
              <stop offset="1" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </svg>

        <svg
          className="absolute -bottom-20 -left-20 w-[400px] h-[400px] opacity-[0.025] dark:opacity-[0.04]"
          viewBox="0 0 200 200"
          fill="none"
        >
          <path d="M100 20 L180 60 L180 140 L100 180 L20 140 L20 60 Z" stroke="url(#cs-g2)" strokeWidth="0.8">
            <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="30s" repeatCount="indefinite" />
          </path>
          <path d="M100 40 L160 70 L160 130 L100 160 L40 130 L40 70 Z" stroke="url(#cs-g2)" strokeWidth="0.8">
            <animateTransform attributeName="transform" type="rotate" from="360 100 100" to="0 100 100" dur="20s" repeatCount="indefinite" />
          </path>
          <defs>
            <linearGradient id="cs-g2" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ef4444" />
              <stop offset="1" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-20">
        {/* Coming Soon badge */}
        <div className="flex justify-center mb-8">
          <span className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-600 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            {config.tagline}
          </span>
        </div>

        {/* Shield icon */}
        <div className="flex justify-center mb-8">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #ef4444, #b91c1c)', boxShadow: '0 0 48px rgba(239,68,68,0.25)' }}
          >
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-6">
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
