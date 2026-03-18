'use client';

import { useState } from 'react';

const projectTypes = [
  'Web Application', 'Mobile App', 'Data Analysis / Dashboard',
  'Automation / Scripting', 'Cloud / DevOps', 'AI / Machine Learning',
  'UI/UX Design', 'Other',
];

const timelines = ['ASAP', '1–3 months', '3–6 months', '6+ months', 'Flexible'];
const durations = ['Summer (3 months)', 'Part-time (ongoing)', 'Full-time', 'Semester-long', 'Flexible'];
const compensations = ['Paid', 'Unpaid', 'Stipend', 'Course Credit', 'TBD'];

const inputClass = 'w-full bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400/30 transition-all dark:bg-[#111a2e] dark:border-[#1e2d45] dark:text-white dark:placeholder:text-slate-600 dark:focus:border-violet-500/50 dark:focus:ring-violet-500/30';
const selectClass = `${inputClass} appearance-none cursor-pointer`;
const labelClass = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2';

export default function HireForm() {
  const [inquiryType, setInquiryType] = useState<'project' | 'internship' | 'speaker'>('project');
  const [form, setForm] = useState({
    companyName: '', contactName: '', email: '', description: '',
    projectType: '', timeline: '',
    positionTitle: '', duration: '', compensation: '', requiredSkills: '',
    topic: '', availability: '',
  });

  const switchInquiryType = (type: 'project' | 'internship' | 'speaker') => {
    setInquiryType(type);
    setForm((prev) => ({
      ...prev,
      // Reset type-specific fields when switching
      projectType: '', timeline: '',
      positionTitle: '', duration: '', compensation: '', requiredSkills: '',
      topic: '', availability: '',
      description: '',
    }));
  };
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
      const res = await fetch('/api/hire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inquiryType, ...form }),
      });
      if (!res.ok) throw new Error('Submission failed');
      setStatus('success');
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
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          {inquiryType === 'internship' ? 'Internship Posting Received!' : inquiryType === 'speaker' ? 'Speaker Request Received!' : 'Inquiry Received!'}
        </h2>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
          {inquiryType === 'internship'
            ? "Thanks for posting an internship opportunity. We'll share it with our members and follow up shortly."
            : inquiryType === 'speaker'
            ? "Thanks for offering to speak! We'll review your request and reach out to schedule a session."
            : "Thanks for reaching out. We'll review your project and get back to you within a few business days."}
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

  const valueProps = inquiryType === 'speaker' ? [
    {
      title: 'Engaged Audience',
      desc: 'Present to students who are actively building skills and hungry for industry insights.',
      colorClass: 'text-violet-600 dark:text-violet-400',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />,
    },
    {
      title: 'Real-World Perspective',
      desc: 'Share your experiences and give members a direct look at what careers in tech actually look like.',
      colorClass: 'text-blue-600 dark:text-blue-400',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />,
    },
    {
      title: 'Flexible Format',
      desc: 'In-person or virtual — 30-minute talks, workshops, panels, Q&As, we can accommodate your style.',
      colorClass: 'text-emerald-600 dark:text-emerald-400',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
    },
    {
      title: 'Brand Visibility',
      desc: "We'll promote your session to our members and feature your company in our club channels.",
      colorClass: 'text-amber-600 dark:text-amber-400',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />,
    },
  ] : inquiryType === 'project' ? [
    {
      title: 'Vetted Student Teams',
      desc: 'Work with students who build projects, win hackathons, and learn on their own time.',
      colorClass: 'text-violet-600 dark:text-violet-400',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />,
    },
    {
      title: 'Low Cost, High Value',
      desc: 'Sponsor a project at a fraction of agency rates while giving students real experience.',
      colorClass: 'text-emerald-600 dark:text-emerald-400',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    },
    {
      title: 'Flexible Engagements',
      desc: 'From a weekend prototype to a semester-long project — we work around your timeline.',
      colorClass: 'text-blue-600 dark:text-blue-400',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
    },
    {
      title: 'Tech Stack Depth',
      desc: 'Web apps, mobile, cloud infra, data pipelines, automation, and AI integrations.',
      colorClass: 'text-amber-600 dark:text-amber-400',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />,
    },
  ] : [
    {
      title: 'Motivated Candidates',
      desc: 'Our members are actively building skills and looking for real-world experience.',
      colorClass: 'text-violet-600 dark:text-violet-400',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />,
    },
    {
      title: 'Diverse Skill Sets',
      desc: 'From Power Platform and cloud to web dev, data, and AI — we cover a wide range.',
      colorClass: 'text-blue-600 dark:text-blue-400',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />,
    },
    {
      title: 'Grow Your Pipeline',
      desc: 'Internships with LC3 members often lead to full-time hires — invest early.',
      colorClass: 'text-emerald-600 dark:text-emerald-400',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />,
    },
    {
      title: 'Simple Process',
      desc: "Fill out the form, we'll match you with members who fit your requirements.",
      colorClass: 'text-amber-600 dark:text-amber-400',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <div className="grid lg:grid-cols-2 gap-16 items-start">

        {/* Left: Value Props */}
        <div>
          <svg width="72" height="72" viewBox="0 0 72 72" className="mb-5 opacity-85 dark:opacity-75" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <style>{`
                @keyframes hire-spark { 0%,100%{opacity:0.3} 50%{opacity:0.9} }
                @keyframes hire-clasp { 0%,100%{opacity:0.5} 50%{opacity:1} }
              `}</style>
            </defs>
            <circle cx="36" cy="36" r="33" fill="#3b82f6" fillOpacity="0.07" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.3"/>
            {/* Briefcase body */}
            <rect x="13" y="30" width="46" height="28" rx="5" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeOpacity="0.7"/>
            {/* Handle */}
            <path d="M25 30 L25 24 Q25 19 30 19 L42 19 Q47 19 47 24 L47 30" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeOpacity="0.7" strokeLinecap="round"/>
            {/* Middle divider */}
            <line x1="13" y1="43" x2="59" y2="43" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.35"/>
            {/* Clasp */}
            <rect x="29" y="39" width="14" height="8" rx="3" fill="#3b82f6" fillOpacity="0.12" stroke="#3b82f6" strokeWidth="1.2" strokeOpacity="0.6"/>
            <circle cx="36" cy="43" r="2.2" fill="#3b82f6" fillOpacity="0.55" style={{animation:'hire-clasp 2s ease-in-out infinite'}}/>
            {/* Sparkle dots */}
            <circle cx="8" cy="12" r="2.5" fill="#3b82f6" fillOpacity="0.7" style={{animation:'hire-spark 2.2s ease-in-out infinite'}}/>
            <circle cx="62" cy="14" r="2" fill="#6366f1" fillOpacity="0.65" style={{animation:'hire-spark 2.2s ease-in-out infinite 0.55s'}}/>
            <circle cx="10" cy="60" r="2" fill="#0891b2" fillOpacity="0.65" style={{animation:'hire-spark 2.2s ease-in-out infinite 1.1s'}}/>
            <circle cx="62" cy="60" r="2.5" fill="#3b82f6" fillOpacity="0.7" style={{animation:'hire-spark 2.2s ease-in-out infinite 1.65s'}}/>
          </svg>
          <p className="text-blue-600 dark:text-blue-400 text-sm font-medium mb-2">Work with student talent</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">Partner with LC3</h1>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
            {inquiryType === 'project'
              ? 'LC3 connects companies with motivated students ready to build real-world solutions. Whether you need a prototype, a data pipeline, or a full product — our teams deliver.'
              : inquiryType === 'speaker'
              ? 'Share your expertise with the next generation of tech professionals. Guest speakers bring real-world context that no classroom can replicate — our members love hearing directly from people in the industry.'
              : 'Offer an internship to LC3 members and get motivated, skilled students who are hungry to learn and contribute. Many of our members are already working in the industry part-time.'}
          </p>

          <div className="space-y-4">
            {valueProps.map(({ colorClass, title, desc, icon }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center flex-shrink-0 dark:bg-[#0d1424] dark:border-[#1e2d45]">
                  <svg className={`w-5 h-5 ${colorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">{icon}</svg>
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

          {/* Type Toggle */}
          <div className="grid grid-cols-3 gap-3 mb-7">
            {([
              {
                id: 'project' as const,
                label: 'Project Collaboration',
                icon: (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                ),
              },
              {
                id: 'internship' as const,
                label: 'Internship Opportunity',
                icon: (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                ),
              },
              {
                id: 'speaker' as const,
                label: 'Guest Speaker',
                icon: (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                ),
              },
            ] as const).map(({ id, label, icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => switchInquiryType(id)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-sm font-medium transition-all ${
                  inquiryType === id
                    ? 'bg-gradient-to-br from-blue-50 to-violet-50 border-violet-300 text-slate-900 dark:from-blue-600/20 dark:to-violet-600/20 dark:border-violet-500/50 dark:text-white'
                    : 'border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:border-[#1e2d45] dark:text-slate-400 dark:hover:text-white dark:hover:border-slate-500/50'
                }`}
              >
                <span className={inquiryType === id ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400 dark:text-slate-500'}>{icon}</span>
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Common fields */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="companyName" className={labelClass}>Company Name <span className="text-violet-600 dark:text-violet-400">*</span></label>
                <input id="companyName" name="companyName" type="text" required value={form.companyName} onChange={handleChange} placeholder="Acme Corp" className={inputClass} />
              </div>
              <div>
                <label htmlFor="contactName" className={labelClass}>Your Name <span className="text-violet-600 dark:text-violet-400">*</span></label>
                <input id="contactName" name="contactName" type="text" required value={form.contactName} onChange={handleChange} placeholder="Jane Smith" className={inputClass} />
              </div>
            </div>

            <div>
              <label htmlFor="email" className={labelClass}>Work Email <span className="text-violet-600 dark:text-violet-400">*</span></label>
              <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="jane@company.com" className={inputClass} />
            </div>

            {/* Project-specific fields */}
            {inquiryType === 'project' && (
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="projectType" className={labelClass}>Project Type <span className="text-violet-600 dark:text-violet-400">*</span></label>
                  <select id="projectType" name="projectType" required value={form.projectType} onChange={handleChange} className={selectClass}>
                    <option value="">Select type...</option>
                    {projectTypes.map((t) => <option key={t} value={t} className="dark:bg-[#111a2e]">{t}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="timeline" className={labelClass}>Timeline <span className="text-violet-600 dark:text-violet-400">*</span></label>
                  <select id="timeline" name="timeline" required value={form.timeline} onChange={handleChange} className={selectClass}>
                    <option value="">Select timeline...</option>
                    {timelines.map((t) => <option key={t} value={t} className="dark:bg-[#111a2e]">{t}</option>)}
                  </select>
                </div>
              </div>
            )}

            {/* Internship-specific fields */}
            {inquiryType === 'internship' && (
              <>
                <div>
                  <label htmlFor="positionTitle" className={labelClass}>Position Title <span className="text-violet-600 dark:text-violet-400">*</span></label>
                  <input id="positionTitle" name="positionTitle" type="text" required value={form.positionTitle} onChange={handleChange} placeholder="Junior Developer Intern" className={inputClass} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="duration" className={labelClass}>Duration <span className="text-violet-600 dark:text-violet-400">*</span></label>
                    <select id="duration" name="duration" required value={form.duration} onChange={handleChange} className={selectClass}>
                      <option value="">Select duration...</option>
                      {durations.map((d) => <option key={d} value={d} className="dark:bg-[#111a2e]">{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="compensation" className={labelClass}>Compensation <span className="text-violet-600 dark:text-violet-400">*</span></label>
                    <select id="compensation" name="compensation" required value={form.compensation} onChange={handleChange} className={selectClass}>
                      <option value="">Select...</option>
                      {compensations.map((c) => <option key={c} value={c} className="dark:bg-[#111a2e]">{c}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="requiredSkills" className={labelClass}>Required Skills / Tech Stack</label>
                  <input id="requiredSkills" name="requiredSkills" type="text" value={form.requiredSkills} onChange={handleChange} placeholder="Power Platform, React, Python, Azure..." className={inputClass} />
                </div>
              </>
            )}

            {/* Speaker-specific fields */}
            {inquiryType === 'speaker' && (
              <>
                <div>
                  <label htmlFor="topic" className={labelClass}>Talk Topic / Title <span className="text-violet-600 dark:text-violet-400">*</span></label>
                  <input id="topic" name="topic" type="text" required value={form.topic} onChange={handleChange} placeholder="e.g. Breaking into cloud engineering, Building with AI..." className={inputClass} />
                </div>
                <div>
                  <label htmlFor="availability" className={labelClass}>Availability</label>
                  <input id="availability" name="availability" type="text" value={form.availability} onChange={handleChange} placeholder="e.g. Weekday evenings, flexible, specific dates..." className={inputClass} />
                </div>
              </>
            )}

            {/* Description */}
            <div>
              <label htmlFor="description" className={labelClass}>
                {inquiryType === 'project' ? 'Project Description' : inquiryType === 'speaker' ? 'Bio / About You' : 'Role Description'} <span className="text-violet-600 dark:text-violet-400">*</span>
              </label>
              <textarea
                id="description" name="description" required rows={4}
                value={form.description} onChange={handleChange}
                placeholder={inquiryType === 'project'
                  ? 'Describe what you need built, the problem it solves, and any technical requirements...'
                  : inquiryType === 'speaker'
                  ? 'Tell us a bit about yourself, your role, and what you\'d like to cover in your talk...'
                  : 'Describe the role, day-to-day responsibilities, and what the intern will learn or build...'}
                className={`${inputClass} resize-none`}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400">{error}</div>
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
              ) : inquiryType === 'project' ? 'Send Project Inquiry' : inquiryType === 'speaker' ? 'Submit Speaker Request' : 'Post Internship'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
