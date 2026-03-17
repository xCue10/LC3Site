'use client';

import { useState } from 'react';

const projectTypes = [
  'Web Application',
  'Mobile App',
  'Data Analysis / Dashboard',
  'Automation / Scripting',
  'Cloud / DevOps',
  'AI / Machine Learning',
  'UI/UX Design',
  'Other',
];

const timelines = [
  'ASAP',
  '1–3 months',
  '3–6 months',
  '6+ months',
  'Flexible',
];

export default function HireForm() {
  const [form, setForm] = useState({
    companyName: '',
    contactName: '',
    email: '',
    projectType: '',
    description: '',
    timeline: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setError('');
    try {
      const res = await fetch('/api/hire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Submission failed');
      setStatus('success');
      setForm({ companyName: '', contactName: '', email: '', projectType: '', description: '', timeline: '' });
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
        <h2 className="text-3xl font-bold text-white mb-4">Inquiry Received!</h2>
        <p className="text-slate-400 leading-relaxed mb-8">
          Thanks for reaching out. We&apos;ll review your project and get back to you within a few business days.
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

        {/* Left: Value Props */}
        <div>
          <p className="text-blue-400 text-sm font-medium mb-2">Work with student talent</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">Partner with LC3</h1>
          <p className="text-slate-400 leading-relaxed mb-8">
            LC3 - Lowcode Cloud Club connects companies with motivated, skilled students ready to build
            real-world solutions. Whether you need a prototype, a data pipeline, or a full product — our
            teams deliver.
          </p>

          <div className="space-y-4 mb-10">
            {[
              {
                title: 'Vetted Student Teams',
                desc: 'Work with students who build projects, win hackathons, and learn on their own time.',
                icon: (
                  <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
              },
              {
                title: 'Low Cost, High Value',
                desc: 'Sponsor a project at a fraction of agency rates while giving students real experience.',
                icon: (
                  <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
              {
                title: 'Flexible Engagements',
                desc: 'From a weekend prototype to a semester-long project — we work around your timeline.',
                icon: (
                  <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
              },
              {
                title: 'Tech Stack Depth',
                desc: 'Web apps, mobile, cloud infra, data pipelines, automation, and AI integrations.',
                icon: (
                  <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                ),
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#0f0f1a] border border-[#1e1e2e] rounded-xl flex items-center justify-center flex-shrink-0">
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
          <h2 className="text-xl font-semibold text-white mb-6">Project Inquiry</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-slate-300 mb-2">
                  Company Name <span className="text-violet-400">*</span>
                </label>
                <input
                  id="companyName" name="companyName" type="text" required
                  value={form.companyName} onChange={handleChange}
                  placeholder="Acme Corp"
                  className="w-full bg-[#13131f] border border-[#1e1e2e] text-white placeholder:text-slate-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all"
                />
              </div>
              <div>
                <label htmlFor="contactName" className="block text-sm font-medium text-slate-300 mb-2">
                  Your Name <span className="text-violet-400">*</span>
                </label>
                <input
                  id="contactName" name="contactName" type="text" required
                  value={form.contactName} onChange={handleChange}
                  placeholder="Jane Smith"
                  className="w-full bg-[#13131f] border border-[#1e1e2e] text-white placeholder:text-slate-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Work Email <span className="text-violet-400">*</span>
              </label>
              <input
                id="email" name="email" type="email" required
                value={form.email} onChange={handleChange}
                placeholder="jane@company.com"
                className="w-full bg-[#13131f] border border-[#1e1e2e] text-white placeholder:text-slate-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="projectType" className="block text-sm font-medium text-slate-300 mb-2">
                  Project Type <span className="text-violet-400">*</span>
                </label>
                <select
                  id="projectType" name="projectType" required
                  value={form.projectType} onChange={handleChange}
                  className="w-full bg-[#13131f] border border-[#1e1e2e] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select type...</option>
                  {projectTypes.map((t) => <option key={t} value={t} className="bg-[#13131f]">{t}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="timeline" className="block text-sm font-medium text-slate-300 mb-2">
                  Timeline <span className="text-violet-400">*</span>
                </label>
                <select
                  id="timeline" name="timeline" required
                  value={form.timeline} onChange={handleChange}
                  className="w-full bg-[#13131f] border border-[#1e1e2e] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select timeline...</option>
                  {timelines.map((t) => <option key={t} value={t} className="bg-[#13131f]">{t}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">
                Project Description <span className="text-violet-400">*</span>
              </label>
              <textarea
                id="description" name="description" required rows={5}
                value={form.description} onChange={handleChange}
                placeholder="Describe what you need built, the problem it solves, and any technical requirements or constraints..."
                className="w-full bg-[#13131f] border border-[#1e1e2e] text-white placeholder:text-slate-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all resize-none"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">{error}</div>
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
                  Sending...
                </span>
              ) : 'Send Inquiry'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
