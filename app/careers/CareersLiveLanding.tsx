'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LS_AUTH, LS_PROFILE } from './types';
import type { CareerProfile } from './types';

interface Config {
  heading: string;
  tagline: string;
  description: string;
  features: string[];
}

export default function CareersLiveLanding({ config }: { config: Config }) {
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false);
  const [loginMode, setLoginMode] = useState<'member' | 'admin'>('member');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    try {
      const authed = localStorage.getItem(LS_AUTH);
      if (authed === 'true' || authed === 'admin') {
        const profileRaw = localStorage.getItem(LS_PROFILE);
        if (profileRaw) {
          const profile = JSON.parse(profileRaw) as CareerProfile;
          router.replace(profile.onboardingComplete ? '/careers/jobs' : '/careers/onboarding');
        } else {
          router.replace('/careers/onboarding');
        }
        return;
      }
    } catch {}
    setChecking(false);
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/careers/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password.trim() }),
      });

      const data = await res.json() as { ok?: boolean; role?: string; error?: string };

      if (res.ok && data.ok) {
        localStorage.setItem(LS_AUTH, data.role === 'admin' ? 'admin' : 'true');
        const profileRaw = localStorage.getItem(LS_PROFILE);
        if (profileRaw) {
          try {
            const profile = JSON.parse(profileRaw) as CareerProfile;
            router.push(profile.onboardingComplete ? '/careers/jobs' : '/careers/onboarding');
          } catch {
            router.push('/careers/onboarding');
          }
        } else {
          router.push('/careers/onboarding');
        }
      } else {
        setError(data.error ?? 'Invalid password');
      }
    } catch {
      setError('Network error. Please try again.');
    }

    setLoading(false);
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0f1e' }}>
        <div className="w-6 h-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  const features = [
    { icon: '🎯', title: 'AI Match Scoring', desc: 'Jobs ranked by how well they fit your skills and goals' },
    { icon: '✉️', title: 'Cover Letter Generator', desc: 'Personalized cover letters in seconds with Claude AI' },
    { icon: '📊', title: 'Skill Gap Analysis', desc: 'Know exactly what to learn for your dream role' },
    { icon: '📋', title: 'Application Tracker', desc: 'Track every application from saved to offer' },
  ];

  const stats = [
    { label: 'Jobs Available', value: '150+' },
    { label: 'Members Helped', value: '200+' },
    { label: 'Avg Match Score', value: '78%' },
  ];

  return (
    <div style={{ background: '#0a0f1e', minHeight: '100vh' }}>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
            style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }}
          />
          <div
            className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
            style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }}
          />
          <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-24 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Now Live for LC3 Members
          </div>

          <h1 className="text-5xl sm:text-6xl font-black text-white mb-6" style={{ letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            {config.heading}
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Find your next opportunity powered by AI
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-12">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-black text-white">{s.value}</div>
                <div className="text-xs text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          {!showLogin ? (
            <div className="flex flex-col items-center gap-3">
              <button
                onClick={() => { setShowLogin(true); setLoginMode('member'); }}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white text-base transition-all hover:scale-105 hover:shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  boxShadow: '0 0 40px rgba(59,130,246,0.3)',
                }}
              >
                Get Started — Member Login
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <button
                onClick={() => { setShowLogin(true); setLoginMode('admin'); }}
                className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
              >
                Admin login
              </button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="max-w-sm mx-auto">
              <div
                className="rounded-2xl p-6 text-left"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                {/* Mode tabs */}
                <div className="flex gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => { setLoginMode('member'); setError(''); setPassword(''); }}
                    className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{
                      background: loginMode === 'member' ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.05)',
                      color: loginMode === 'member' ? '#60a5fa' : '#6b7280',
                    }}
                  >
                    Member
                  </button>
                  <button
                    type="button"
                    onClick={() => { setLoginMode('admin'); setError(''); setPassword(''); }}
                    className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{
                      background: loginMode === 'admin' ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.05)',
                      color: loginMode === 'admin' ? '#c4b5fd' : '#6b7280',
                    }}
                  >
                    Admin
                  </button>
                </div>

                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {loginMode === 'member' ? 'Member password' : 'Admin password'}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="Enter password"
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-slate-600 text-center font-mono text-lg tracking-widest focus:outline-none mb-3"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
                {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
                <button
                  type="submit"
                  disabled={loading || !password.trim()}
                  className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
                  style={{
                    background: loginMode === 'admin'
                      ? 'linear-gradient(135deg, #8b5cf6, #6d28d9)'
                      : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  }}
                >
                  {loading ? 'Signing in...' : 'Enter LC3 Careers'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowLogin(false); setPassword(''); setError(''); }}
                  className="w-full text-center text-xs text-slate-600 hover:text-slate-400 mt-3 transition-colors"
                >
                  Cancel
                </button>
                {loginMode === 'member' && (
                  <p className="text-center text-xs text-slate-600 mt-2">Get your password at an LC3 club meeting</p>
                )}
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl p-6 transition-all hover:scale-[1.02]"
              style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-white text-sm mb-1">{f.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
