'use client';

import { useState, useRef } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
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

function SocialIcon({ label }: { label: string }) {
  const l = label.toLowerCase();
  if (l.includes('discord'))
    return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.03.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.04.001-.088-.041-.104a13.09 13.09 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>;
  if (l.includes('github'))
    return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>;
  if (l.includes('linkedin'))
    return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
  if (l.includes('twitter') || l.includes(' x ') || l === 'x')
    return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
  if (l.includes('instagram'))
    return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>;
  if (l.includes('youtube'))
    return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>;
  if (l.includes('facebook'))
    return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
  // generic link icon
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>;
}

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

const inputBase = 'w-full bg-white text-slate-900 placeholder:text-slate-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 transition-all dark:bg-[#111a2e] dark:text-white dark:placeholder:text-slate-600';
const inputClass = `${inputBase} border border-slate-300 focus:border-violet-400 focus:ring-violet-400/30 dark:border-[#1e2d45] dark:focus:border-violet-500/50 dark:focus:ring-violet-500/30`;
const inputError = `${inputBase} border border-red-400 focus:border-red-400 focus:ring-red-400/20 dark:border-red-500/60 dark:focus:border-red-500/60`;
const labelClass = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2';

function FieldError({ msg }: { msg: string }) {
  return <p className="mt-1.5 text-xs text-red-500 dark:text-red-400 flex items-center gap-1"><svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>{msg}</p>;
}

function validateEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

const HCAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY ?? '';

export default function ContactForm({ settings }: { settings: SiteSettings }) {
  const [form, setForm] = useState({ name: '', email: '', major: '', reason: '' });
  const [touched, setTouched] = useState({ name: false, email: false, major: false, reason: false });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const captchaRef = useRef<HCaptcha>(null);

  const fieldErrors = {
    name: !form.name.trim() ? 'Name is required' : '',
    email: !form.email.trim() ? 'Email is required' : !validateEmail(form.email) ? 'Enter a valid email address' : '',
    major: !form.major ? 'Please select your major' : '',
    reason: !form.reason.trim() ? 'Please tell us why you want to join' : form.reason.trim().length < 20 ? 'Must be at least 20 characters' : '',
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (HCAPTCHA_SITE_KEY && !captchaToken) {
      setError('Please complete the captcha.');
      return;
    }
    setStatus('loading');
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, captchaToken }),
      });
      const data = await res.json() as { error?: string };
      if (!res.ok) throw new Error(data.error ?? 'Submission failed');
      setStatus('success');
      setForm({ name: '', email: '', major: '', reason: '' });
      setCaptchaToken('');
      captchaRef.current?.resetCaptcha();
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      captchaRef.current?.resetCaptcha();
      setCaptchaToken('');
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
          <svg width="320" height="140" viewBox="0 0 320 140" fill="none" className="mb-6 opacity-90 dark:opacity-80" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <style>{`
                @keyframes cont2-wave { 0%{opacity:0.6;transform:scale(1)} 100%{opacity:0;transform:scale(1.5)} }
                @keyframes cont2-wave2 { 0%{opacity:0.5;transform:scale(1)} 100%{opacity:0;transform:scale(1.5)} }
                @keyframes cont2-wave3 { 0%{opacity:0.4;transform:scale(1)} 100%{opacity:0;transform:scale(1.5)} }
                @keyframes cont2-packet { 0%{transform:translateX(0)} 100%{transform:translateX(180px)} }
                @keyframes cont2-server { 0%,100%{opacity:0.5} 50%{opacity:1} }
                @keyframes cont2-spark { 0%,100%{opacity:0.3;transform:scale(0.9)} 50%{opacity:0.85;transform:scale(1.1)} }
                @keyframes cont2-corner { 0%,100%{opacity:0.35} 50%{opacity:0.8} }
                @keyframes cont2-arrow { 0%,100%{opacity:0.5;transform:translateX(0)} 50%{opacity:1;transform:translateX(3px)} }
                @keyframes cont2-blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
              `}</style>
            </defs>

            {/* Corner brackets */}
            <path d="M8 8 L8 22 M8 8 L22 8" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5" strokeLinecap="round" style={{animation:'cont2-corner 3s ease-in-out infinite'}}/>
            <path d="M312 8 L312 22 M312 8 L298 8" stroke="rgba(8,145,178,0.4)" strokeWidth="1.5" strokeLinecap="round" style={{animation:'cont2-corner 3s ease-in-out infinite 0.75s'}}/>
            <path d="M8 132 L8 118 M8 132 L22 132" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5" strokeLinecap="round" style={{animation:'cont2-corner 3s ease-in-out infinite 1.5s'}}/>
            <path d="M312 132 L312 118 M312 132 L298 132" stroke="rgba(8,145,178,0.4)" strokeWidth="1.5" strokeLinecap="round" style={{animation:'cont2-corner 3s ease-in-out infinite 2.25s'}}/>

            {/* Antenna tower */}
            <line x1="72" y1="110" x2="72" y2="55" stroke="rgba(99,102,241,0.55)" strokeWidth="2" strokeLinecap="round"/>
            <line x1="60" y1="110" x2="84" y2="110" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="64" y1="96" x2="80" y2="96" stroke="rgba(99,102,241,0.3)" strokeWidth="1" strokeLinecap="round"/>
            <line x1="67" y1="82" x2="77" y2="82" stroke="rgba(99,102,241,0.25)" strokeWidth="1" strokeLinecap="round"/>
            {/* Antenna tip */}
            <circle cx="72" cy="52" r="3.5" fill="rgba(99,102,241,0.7)">
              <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite"/>
            </circle>

            {/* Radio wave arcs (expanding from antenna) */}
            <path d="M72 70 Q95 45 72 20" fill="none" stroke="rgba(99,102,241,0.5)" strokeWidth="1.5" strokeLinecap="round">
              <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite"/>
            </path>
            <path d="M72 70 Q108 32 72 -6" fill="none" stroke="rgba(99,102,241,0.35)" strokeWidth="1.2" strokeLinecap="round">
              <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" begin="0.4s" repeatCount="indefinite"/>
            </path>
            <path d="M72 70 Q122 18 72 -34" fill="none" stroke="rgba(99,102,241,0.2)" strokeWidth="1" strokeLinecap="round">
              <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" begin="0.8s" repeatCount="indefinite"/>
            </path>
            <path d="M72 70 Q49 45 72 20" fill="none" stroke="rgba(99,102,241,0.5)" strokeWidth="1.5" strokeLinecap="round">
              <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" begin="0.2s" repeatCount="indefinite"/>
            </path>
            <path d="M72 70 Q36 32 72 -6" fill="none" stroke="rgba(99,102,241,0.35)" strokeWidth="1.2" strokeLinecap="round">
              <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" begin="0.6s" repeatCount="indefinite"/>
            </path>

            {/* Transmission line */}
            <line x1="90" y1="70" x2="230" y2="70" stroke="rgba(99,102,241,0.15)" strokeWidth="1.5"/>
            <line x1="90" y1="70" x2="230" y2="70" stroke="rgba(99,102,241,0.4)" strokeWidth="1" strokeDasharray="5 5">
              <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="0.8s" repeatCount="indefinite"/>
            </line>

            {/* Traveling envelope packet */}
            <g style={{animation:'cont2-packet 2.2s ease-in-out infinite'}}>
              <rect x="82" y="61" width="20" height="14" rx="2.5" fill="rgba(99,102,241,0.12)" stroke="rgba(99,102,241,0.55)" strokeWidth="1.2"/>
              <path d="M82 64 L92 70 L102 64" fill="none" stroke="rgba(99,102,241,0.55)" strokeWidth="1" strokeLinejoin="round"/>
            </g>

            {/* Server destination */}
            <rect x="236" y="42" width="44" height="56" rx="6" fill="rgba(6,182,212,0.07)" stroke="rgba(6,182,212,0.38)" strokeWidth="1.3"/>
            <rect x="236" y="42" width="44" height="14" rx="6" fill="rgba(6,182,212,0.1)"/>
            <rect x="236" y="48" width="44" height="8" fill="rgba(6,182,212,0.08)"/>
            {/* Server status dot */}
            <circle cx="250" cy="49" r="2.5" fill="#22c55e" style={{animation:'cont2-blink 1.8s ease-in-out infinite'}}/>
            <circle cx="258" cy="49" r="2.5" fill="rgba(6,182,212,0.5)"/>
            <circle cx="266" cy="49" r="2.5" fill="rgba(99,102,241,0.5)"/>
            {/* Server lines */}
            <rect x="243" y="64" width="30" height="2" rx="1" fill="rgba(6,182,212,0.4)"/>
            <rect x="243" y="70" width="22" height="2" rx="1" fill="rgba(6,182,212,0.3)"/>
            <rect x="243" y="76" width="26" height="2" rx="1" fill="rgba(6,182,212,0.35)"/>
            <rect x="243" y="82" width="18" height="2" rx="1" fill="rgba(6,182,212,0.25)"/>
            {/* Received indicator */}
            <circle cx="258" cy="92" r="5" fill="rgba(34,197,94,0.12)" stroke="rgba(34,197,94,0.45)" strokeWidth="1" style={{animation:'cont2-server 2s ease-in-out infinite'}}>
              <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/>
            </circle>
            <path d="M255 92 L257 94 L261 90" fill="none" stroke="rgba(34,197,94,0.65)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>

            {/* Sparkle dots */}
            <circle cx="26" cy="26" r="2.5" fill="#6366f1" opacity="0.65" style={{animation:'cont2-spark 2.3s ease-in-out infinite'}}/>
            <circle cx="294" cy="24" r="2" fill="#0891b2" opacity="0.6" style={{animation:'cont2-spark 2.3s ease-in-out infinite 0.7s'}}/>
            <circle cx="26" cy="114" r="2" fill="#818cf8" opacity="0.6" style={{animation:'cont2-spark 2.3s ease-in-out infinite 1.4s'}}/>
            <circle cx="294" cy="114" r="2.5" fill="#0891b2" opacity="0.65" style={{animation:'cont2-spark 2.3s ease-in-out infinite 2.1s'}}/>
          </svg>
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

          {settings.socialLinksLive && (settings.socialLinks ?? []).filter((l) => l.url).length > 0 && (
            <div className="mt-8">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-4">Connect With Us</p>
              <div className="flex flex-wrap gap-3">
                {(settings.socialLinks ?? []).filter((l) => l.url).map((link, i) => (
                  <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:border-violet-400 hover:text-violet-600 transition-all dark:bg-[#0d1424] dark:border-[#1e2d45] dark:text-slate-300 dark:hover:border-violet-500 dark:hover:text-violet-400">
                    <SocialIcon label={link.label} />
                    {link.label || link.url}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Form */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm dark:bg-[#0d1424] dark:border-[#1e2d45] dark:shadow-none">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Interest Form</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Honeypot — hidden from real users, bots fill it in */}
            <div style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <div>
              <label htmlFor="name" className={labelClass}>
                Full Name <span className="text-violet-600 dark:text-violet-400">*</span>
              </label>
              <input id="name" name="name" type="text" required value={form.name} onChange={handleChange} onBlur={handleBlur}
                placeholder="Your full name"
                className={touched.name && fieldErrors.name ? inputError : inputClass} />
              {touched.name && fieldErrors.name && <FieldError msg={fieldErrors.name} />}
            </div>

            <div>
              <label htmlFor="email" className={labelClass}>
                Email Address <span className="text-violet-600 dark:text-violet-400">*</span>
              </label>
              <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} onBlur={handleBlur}
                placeholder="you@university.edu"
                className={touched.email && fieldErrors.email ? inputError : inputClass} />
              {touched.email && fieldErrors.email && <FieldError msg={fieldErrors.email} />}
            </div>

            <div>
              <label htmlFor="major" className={labelClass}>
                Major <span className="text-violet-600 dark:text-violet-400">*</span>
              </label>
              <select id="major" name="major" required value={form.major} onChange={handleChange} onBlur={handleBlur}
                className={`${touched.major && fieldErrors.major ? inputError : inputClass} appearance-none cursor-pointer`}>
                <option value="">Select your major...</option>
                {majors.map((m) => <option key={m} value={m} className="dark:bg-[#111a2e]">{m}</option>)}
              </select>
              {touched.major && fieldErrors.major && <FieldError msg={fieldErrors.major} />}
            </div>

            <div>
              <label htmlFor="reason" className={labelClass}>
                Why do you want to join? <span className="text-violet-600 dark:text-violet-400">*</span>
              </label>
              <textarea id="reason" name="reason" required rows={4} maxLength={1000} value={form.reason} onChange={handleChange} onBlur={handleBlur}
                placeholder="Tell us about yourself, your interests, and what you hope to get out of LC3..."
                className={`${touched.reason && fieldErrors.reason ? inputError : inputClass} resize-none`} />
              {touched.reason && fieldErrors.reason && <FieldError msg={fieldErrors.reason} />}
            </div>

            {/* hCaptcha widget */}
            {HCAPTCHA_SITE_KEY && (
              <div>
                <HCaptcha
                  ref={captchaRef}
                  sitekey={HCAPTCHA_SITE_KEY}
                  onVerify={setCaptchaToken}
                  onExpire={() => setCaptchaToken('')}
                  theme={typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
                />
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400">{error}</div>
            )}

            <button type="submit" disabled={status === 'loading' || (!!HCAPTCHA_SITE_KEY && !captchaToken)}
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
