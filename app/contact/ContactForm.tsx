'use client';

import { useState } from 'react';
import type { SiteSettings } from '@/lib/data';

const majors = [
  'Computer Science',
  'Computer Engineering',
  'Electrical Engineering',
  'Data Science',
  'Information Systems',
  'Software Engineering',
  'Mathematics',
  'Physics',
  'Other',
];

const infoItems = (settings: SiteSettings) => [
  {
    title: 'Weekly Meetings',
    desc: settings.meetingDay && settings.meetingTime
      ? `Every ${settings.meetingDay} at ${settings.meetingTime}${settings.meetingLocation ? ` · ${settings.meetingLocation}` : ''}`
      : 'Check back for meeting details',
    icon: (
      <svg className="w-5 h-5 text-violet-600 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'Project Teams',
    desc: 'Join an existing project or pitch your own idea',
    icon: (
      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    title: 'No Experience Required',
    desc: 'We provide workshops and mentorship for all skill levels',
    icon: (
      <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    title: 'Stay in the Loop',
    desc: 'Get updates on events, workshops, and opportunities',
    icon: (
      <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
];

const inputClass = 'w-full bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400/30 transition-all dark:bg-[#111a2e] dark:border-[#1e2d45] dark:text-white dark:placeholder:text-slate-600 dark:focus:border-violet-500/50 dark:focus:ring-violet-500/30';
const labelClass = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2';

export default function ContactForm({ settings }: { settings: SiteSettings }) {
  const [form, setForm] = useState({ name: '', email: '', major: '', reason: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Submission failed');
      setStatus('success');
      setForm({ name: '', email: '', major: '', reason: '' });
    } catch {
      setStatus('error');
      setError('Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-24 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-violet-500/30">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Application Submitted!</h2>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
          Thanks for your interest in LC3 - Lowcode Cloud Club! We&apos;ll review your application and reach out to your email within a few days.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
        >
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <div className="grid lg:grid-cols-2 gap-16 items-start">
        {/* Left: Info */}
        <div>
          <svg width="72" height="72" viewBox="0 0 72 72" className="mb-5 opacity-85 dark:opacity-75" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <style>{`
                @keyframes cont-spark { 0%,100%{opacity:0.3} 50%{opacity:0.9} }
                @keyframes cont-arrow { 0%,100%{opacity:0.5;transform:translateX(0)} 50%{opacity:1;transform:translateX(2px)} }
                @keyframes cont-ring { 0%,100%{opacity:0.1} 50%{opacity:0.35} }
                @keyframes cont-corner { 0%,100%{opacity:0.4} 50%{opacity:0.9} }
              `}</style>
            </defs>
            <circle cx="36" cy="36" r="33" fill="#7c3aed" fillOpacity="0.07" stroke="#7c3aed" strokeWidth="1" strokeOpacity="0.3"/>
            {/* Envelope body */}
            <rect x="13" y="23" width="46" height="30" rx="5" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeOpacity="0.7"/>
            {/* Envelope flap */}
            <path d="M13 27 L36 43 L59 27" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeOpacity="0.7" strokeLinejoin="round"/>
            {/* Bottom fold lines */}
            <path d="M13 53 L29 39" stroke="#6366f1" strokeWidth="0.8" strokeOpacity="0.3"/>
            <path d="M59 53 L43 39" stroke="#6366f1" strokeWidth="0.8" strokeOpacity="0.3"/>
            {/* Send arrow badge */}
            <circle cx="55" cy="19" r="6" fill="#6366f1" fillOpacity="0.12" stroke="#6366f1" strokeWidth="1.2" strokeOpacity="0.55"/>
            <path d="M52 19 L58 19 M55 16 L58 19 L55 22" fill="none" stroke="#6366f1" strokeWidth="1.3" strokeOpacity="0.75" strokeLinecap="round" strokeLinejoin="round" style={{animation:'cont-arrow 2s ease-in-out infinite'}}/>
            {/* Sparkle dots */}
            <circle cx="8" cy="12" r="2.5" fill="#6366f1" fillOpacity="0.7" style={{animation:'cont-spark 2.2s ease-in-out infinite'}}/>
            <circle cx="62" cy="14" r="2" fill="#818cf8" fillOpacity="0.65" style={{animation:'cont-spark 2.2s ease-in-out infinite 0.55s'}}/>
            <circle cx="10" cy="60" r="2" fill="#0891b2" fillOpacity="0.65" style={{animation:'cont-spark 2.2s ease-in-out infinite 1.1s'}}/>
            <circle cx="62" cy="60" r="2.5" fill="#6366f1" fillOpacity="0.7" style={{animation:'cont-spark 2.2s ease-in-out infinite 1.65s'}}/>
            {/* Outer glow ring */}
            <circle cx="36" cy="36" r="35.5" fill="none" stroke="#6366f1" strokeWidth="1" strokeOpacity="1" style={{animation:'cont-ring 3s ease-in-out infinite'}}/>
            {/* Corner accents */}
            <path d="M12 2 L2 2 L2 12" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{animation:'cont-corner 3s ease-in-out infinite'}}/>
            <path d="M60 2 L70 2 L70 12" fill="none" stroke="#0891b2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{animation:'cont-corner 3s ease-in-out infinite 0.75s'}}/>
            <path d="M12 70 L2 70 L2 60" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{animation:'cont-corner 3s ease-in-out infinite 1.5s'}}/>
            <path d="M60 70 L70 70 L70 60" fill="none" stroke="#0891b2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{animation:'cont-corner 3s ease-in-out infinite 2.25s'}}/>
          </svg>
          <p className="text-violet-600 dark:text-violet-400 text-sm font-medium mb-2">Get involved</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">Join LC3</h1>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
            We welcome students of all skill levels and majors. Whether you&apos;re a seasoned developer or just
            starting out, LC3 has something for you. Fill out the form and we&apos;ll be in touch!
          </p>

          <div className="space-y-4">
            {infoItems(settings).map(({ icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center flex-shrink-0 dark:bg-[#0d1424] dark:border-[#1e2d45]">
                  {icon}
                </div>
                <div>
                  <div className="text-slate-900 dark:text-white font-medium">{title}</div>
                  <div className="text-slate-500 text-sm">{desc}</div>
                </div>
              </div>
            ))}
          </div>

          {(settings.discord || settings.github || settings.linkedin) && (
            <div className="mt-8">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-4">Connect With Us</p>
              <div className="flex flex-wrap gap-3">
                {settings.discord && (
                  <a href={settings.discord} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:border-violet-400 hover:text-violet-600 transition-all dark:bg-[#0d1424] dark:border-[#1e2d45] dark:text-slate-300 dark:hover:border-violet-500 dark:hover:text-violet-400">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.03.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.04.001-.088-.041-.104a13.09 13.09 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                    </svg>
                    Discord
                  </a>
                )}
                {settings.github && (
                  <a href={settings.github} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:border-violet-400 hover:text-violet-600 transition-all dark:bg-[#0d1424] dark:border-[#1e2d45] dark:text-slate-300 dark:hover:border-violet-500 dark:hover:text-violet-400">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
                    </svg>
                    GitHub
                  </a>
                )}
                {settings.linkedin && (
                  <a href={settings.linkedin} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:border-violet-400 hover:text-violet-600 transition-all dark:bg-[#0d1424] dark:border-[#1e2d45] dark:text-slate-300 dark:hover:border-violet-500 dark:hover:text-violet-400">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: Form */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm dark:bg-[#0d1424] dark:border-[#1e2d45] dark:shadow-none">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Interest Form</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className={labelClass}>
                Full Name <span className="text-violet-600 dark:text-violet-400">*</span>
              </label>
              <input id="name" name="name" type="text" required value={form.name} onChange={handleChange}
                placeholder="Your full name"
                className={inputClass} />
            </div>

            <div>
              <label htmlFor="email" className={labelClass}>
                Email Address <span className="text-violet-600 dark:text-violet-400">*</span>
              </label>
              <input id="email" name="email" type="email" required value={form.email} onChange={handleChange}
                placeholder="you@university.edu"
                className={inputClass} />
            </div>

            <div>
              <label htmlFor="major" className={labelClass}>
                Major <span className="text-violet-600 dark:text-violet-400">*</span>
              </label>
              <select id="major" name="major" required value={form.major} onChange={handleChange}
                className={`${inputClass} appearance-none cursor-pointer`}>
                <option value="">Select your major...</option>
                {majors.map((m) => <option key={m} value={m} className="dark:bg-[#111a2e]">{m}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="reason" className={labelClass}>
                Why do you want to join? <span className="text-violet-600 dark:text-violet-400">*</span>
              </label>
              <textarea id="reason" name="reason" required rows={4} maxLength={1000} value={form.reason} onChange={handleChange}
                placeholder="Tell us about yourself, your interests, and what you hope to get out of LC3..."
                className={`${inputClass} resize-none`} />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400">{error}</div>
            )}

            <button type="submit" disabled={status === 'loading'}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-500/20">
              {status === 'loading' ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Submitting...
                </span>
              ) : 'Submit Application'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
