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
              <textarea id="reason" name="reason" required rows={4} value={form.reason} onChange={handleChange}
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
