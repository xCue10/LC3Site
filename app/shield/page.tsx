import Link from 'next/link';
import { readJSON } from '@/lib/data';
import ShieldDashboardPreview from '@/app/components/ShieldDashboardPreview';
import type { Metadata } from 'next';

export const revalidate = 30;

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


const SHIELD_FEATURE_CARDS = [
  { icon: '🌐', title: 'URL Scanner', desc: 'Security headers, HTTPS, and redirect chain analysis' },
  { icon: '</>', title: 'Code Scanner', desc: 'AI-powered vulnerability detection across your codebase' },
  { icon: '🔒', title: 'SSL/TLS', desc: 'Certificate validation, cipher strength, and expiry checks' },
  { icon: '🔑', title: 'JWT Analyzer', desc: 'Decode tokens, audit claims, and spot weak signing keys' },
  { icon: '📦', title: 'Dependencies', desc: 'CVE database scan for vulnerable packages' },
  { icon: '🌍', title: 'DNS Checker', desc: 'SPF, DMARC, and DKIM record validation' },
  { icon: '🐙', title: 'GitHub Repo', desc: 'Detect exposed secrets and leaked credentials in repos' },
  { icon: '🍪', title: 'Cookie Checker', desc: 'Verify HttpOnly, Secure, and SameSite flags' },
];

function ShieldLiveLanding({ config }: { config: ShieldPageConfig }) {
  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-red-50/20 dark:from-[#080d18] dark:via-[#0a1020] dark:to-[#0d1424]">
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: text + CTA */}
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4" style={{ letterSpacing: '-0.03em' }}>
                {config.heading}
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-10">
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
            </div>
            {/* Right: preview */}
            <div>
              <ShieldDashboardPreview />
            </div>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SHIELD_FEATURE_CARDS.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl p-6 transition-all hover:scale-[1.02] bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-white/[0.06]"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">{f.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ShieldComingSoon({ config }: { config: ShieldPageConfig }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-red-50/20 dark:from-[#080d18] dark:via-[#0a1020] dark:to-[#0d1424]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: text + badges */}
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-600 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400 uppercase tracking-wider mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              {config.tagline}
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4 mt-2" style={{ letterSpacing: '-0.03em' }}>
              {config.heading} is{' '}
              <span className="bg-gradient-to-r from-red-500 to-violet-600 bg-clip-text text-transparent">
                in progress
              </span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              {config.description}
            </p>
            {config.features.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {config.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/60 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.06] rounded-xl px-4 py-3">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(239,68,68,0.1)' }}>
                      <svg className="w-3.5 h-3.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
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
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Available to LC3 Club members and CSN students.</p>
              </div>
            </div>
          </div>
          {/* Right: preview */}
          <div>
            <ShieldDashboardPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
