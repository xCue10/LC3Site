import { readJSON, SiteSettings } from '@/lib/data';
import ContactForm from './ContactForm';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Join LC3',
  description: 'Interested in joining LC3 - Lowcode Cloud Club? Fill out our interest form and we\'ll be in touch!',
};

const defaults: SiteSettings = { recruitingBanner: '', meetingDay: '', meetingTime: '', meetingLocation: '', socialLinks: [], socialLinksLive: false };

export default function ContactPage() {
  const settings = readJSON<SiteSettings>('settings.json', defaults);
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200 dark:border-[#1e2d45]">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-violet-50/30 to-transparent dark:from-blue-950/20 dark:via-violet-950/10 dark:to-transparent pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-300/8 dark:bg-blue-500/8 rounded-full blur-3xl pointer-events-none" style={{animation:'hero-float-a 10s ease-in-out infinite'}} />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-18 text-center">
          <p className="text-blue-600 dark:text-blue-400 text-sm font-medium mb-3">Join the club</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Get{' '}
            <span className="bg-gradient-to-r from-blue-500 via-violet-500 to-violet-600 bg-clip-text text-transparent">
              Involved
            </span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Fill out the form below and we&apos;ll reach out with everything you need to get started.
          </p>
        </div>
      </section>
      <ContactForm settings={settings} />
    </div>
  );
}
