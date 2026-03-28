export const dynamic = 'force-dynamic';

import HireForm from './HireForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Partner With Us | LC3 - Lowcode Cloud Club',
  description: 'Partner with LC3 student teams for projects, internships, and sponsorships.',
};

export default function HirePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200 dark:border-[#1e2d45]">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-orange-50/20 to-transparent dark:from-amber-950/15 dark:via-orange-950/10 dark:to-transparent pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/35 to-transparent pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-300/6 dark:bg-amber-500/8 rounded-full blur-3xl pointer-events-none" style={{animation:'hero-float-a 11s ease-in-out infinite'}} />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-18 text-center">
          <p className="text-amber-600 dark:text-amber-400 text-sm font-medium mb-3">For companies &amp; sponsors</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Partner{' '}
            <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
              With Us
            </span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
            Hire LC3 student teams for real projects, offer internships, or sponsor the club. We bring talent, you bring opportunity.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {['Real Projects', 'Talented Students', 'CSN Partnership', 'Internship Pipeline'].map((tag) => (
              <span key={tag} className="text-xs px-3 py-1.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>
      <HireForm />
    </div>
  );
}
