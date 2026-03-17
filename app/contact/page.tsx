'use client';

import { useState } from 'react';

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

export default function ContactPage() {
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
        <h2 className="text-3xl font-bold text-white mb-4">Application Submitted!</h2>
        <p className="text-slate-400 leading-relaxed mb-8">
          Thanks for your interest in LC3 - Lowcode Cloud Club! We&apos;ll review your application and reach out to your email within
          a few days.
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
          <p className="text-violet-400 text-sm font-medium mb-2">Get involved</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">Join LC3</h1>
          <p className="text-slate-400 leading-relaxed mb-8">
            We welcome students of all skill levels and majors. Whether you&apos;re a seasoned developer or just
            starting out, LC3 has something for you. Fill out the form and we&apos;ll be in touch!
          </p>

          <div className="space-y-4">
            {[
              {
                icon: '📅',
                title: 'Weekly Meetings',
                desc: 'Every Thursday at 6:00 PM in the Engineering Building',
              },
              {
                icon: '🛠️',
                title: 'Project Teams',
                desc: 'Join an existing project or pitch your own idea',
              },
              {
                icon: '🎓',
                title: 'No Experience Required',
                desc: 'We provide workshops and mentorship for all skill levels',
              },
              {
                icon: '✉️',
                title: 'Stay in the Loop',
                desc: 'Get updates on events, workshops, and opportunities',
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#0f0f1a] border border-[#1e1e2e] rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                  {icon}
                </div>
                <div>
                  <div className="text-white font-medium">{title}</div>
                  <div className="text-slate-500 text-sm">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Form */}
        <div className="bg-[#0f0f1a] border border-[#1e1e2e] rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-white mb-6">Interest Form</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                Full Name <span className="text-violet-400">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                className="w-full bg-[#13131f] border border-[#1e1e2e] text-white placeholder:text-slate-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email Address <span className="text-violet-400">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="you@university.edu"
                className="w-full bg-[#13131f] border border-[#1e1e2e] text-white placeholder:text-slate-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all"
              />
            </div>

            <div>
              <label htmlFor="major" className="block text-sm font-medium text-slate-300 mb-2">
                Major <span className="text-violet-400">*</span>
              </label>
              <select
                id="major"
                name="major"
                required
                value={form.major}
                onChange={handleChange}
                className="w-full bg-[#13131f] border border-[#1e1e2e] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all appearance-none cursor-pointer"
              >
                <option value="" className="text-slate-600">Select your major...</option>
                {majors.map((m) => (
                  <option key={m} value={m} className="bg-[#13131f]">
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-slate-300 mb-2">
                Why do you want to join? <span className="text-violet-400">*</span>
              </label>
              <textarea
                id="reason"
                name="reason"
                required
                rows={4}
                value={form.reason}
                onChange={handleChange}
                placeholder="Tell us about yourself, your interests, and what you hope to get out of LC3..."
                className="w-full bg-[#13131f] border border-[#1e1e2e] text-white placeholder:text-slate-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all resize-none"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-500/20"
            >
              {status === 'loading' ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Submitting...
                </span>
              ) : (
                'Submit Application'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
