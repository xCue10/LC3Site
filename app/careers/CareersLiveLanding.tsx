'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { LS_AUTH, LS_MEMBER_ID, LS_MEMBER_NAME, memberLS } from './types';
import CareersDashboardPreview from '@/app/components/CareersDashboardPreview';

interface Config {
  heading: string;
  tagline: string;
  description: string;
  features: string[];
}

interface Member {
  id: string;
  name: string;
  role: string;
  memberType: string;
  avatarUrl?: string;
}


export default function CareersLiveLanding({ config }: { config: Config }) {
  const router = useRouter();
  const [loginMode, setLoginMode] = useState<'member' | 'admin'>('member');
  const [members, setMembers] = useState<Member[]>([]);
  const [nameQuery, setNameQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const nameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/members').then(r => r.json()).then(setMembers).catch(() => {});
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (nameRef.current && !nameRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    try {
      const authed = localStorage.getItem(LS_AUTH);
      if (authed === 'true' || authed === 'admin') {
        const keys = memberLS();
        const profileRaw = localStorage.getItem(keys.profile);
        if (profileRaw) {
          try {
            const profile = JSON.parse(profileRaw) as { onboardingComplete?: boolean };
            router.replace(profile.onboardingComplete ? '/careers/jobs' : '/careers/onboarding');
          } catch {
            router.replace('/careers/onboarding');
          }
        } else {
          router.replace('/careers/onboarding');
        }
        return;
      }
    } catch {}
    setChecking(false);
  }, [router]);

  const suggestions = nameQuery.trim()
    ? members
        .filter(m => {
          if (loginMode === 'admin' && m.memberType !== 'officer') return false;
          return m.name.toLowerCase().includes(nameQuery.toLowerCase().trim());
        })
        .slice(0, 6)
    : [];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim() || !selectedMember) return;
    setLoading(true);
    setError('');

    try {
      const body = { password: password.trim(), name: selectedMember.name };

      const res = await fetch('/api/careers/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json() as { ok?: boolean; role?: string; memberId?: string; memberName?: string; error?: string };

      if (res.ok && data.ok) {
        const isAdmin = data.role === 'admin';
        localStorage.setItem(LS_AUTH, isAdmin ? 'admin' : 'true');
        localStorage.setItem(LS_MEMBER_ID, data.memberId ?? (isAdmin ? 'admin' : 'guest'));
        localStorage.setItem(LS_MEMBER_NAME, data.memberName ?? (isAdmin ? 'Admin' : ''));

        // Check per-member profile to decide where to redirect
        const memberId = data.memberId ?? (isAdmin ? 'admin' : 'guest');
        const profileKey = `lc3careers-profile-${memberId}`;
        const profileRaw = localStorage.getItem(profileKey);
        if (profileRaw) {
          try {
            const profile = JSON.parse(profileRaw) as { onboardingComplete?: boolean };
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

  return (
    <div style={{ background: '#0a0f1e' }}>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Ambient glow blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-8 blur-3xl"
            style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }}
          />
          <div
            className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full opacity-8 blur-3xl"
            style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }}
          />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-16">
          {/* Full-width header */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Now Live for LC3 Members
            </div>
            <h1 className="text-5xl sm:text-6xl font-black text-white mb-4" style={{ letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              {config.heading}
            </h1>
            <p className="text-xl text-slate-400">
              Find your next opportunity powered by AI
            </p>
          </div>

          {/* Two-column: login + preview */}
          <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
          <form onSubmit={handleLogin} className="w-full">
              <div
                className="rounded-2xl p-6 text-left"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                {/* Mode tabs */}
                <div className="flex gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => { setLoginMode('member'); setError(''); setPassword(''); setNameQuery(''); setSelectedMember(null); }}
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
                    onClick={() => { setLoginMode('admin'); setError(''); setPassword(''); setNameQuery(''); setSelectedMember(null); }}
                    className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{
                      background: loginMode === 'admin' ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.05)',
                      color: loginMode === 'admin' ? '#c4b5fd' : '#6b7280',
                    }}
                  >
                    Admin
                  </button>
                </div>

                <label className="block text-sm font-medium text-slate-300 mb-2">Your Name</label>
                <div ref={nameRef} className="relative mb-3">
                  {selectedMember ? (
                    <div
                      className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                      onClick={() => { setSelectedMember(null); setNameQuery(''); }}
                    >
                      {selectedMember.avatarUrl && (
                        <img src={selectedMember.avatarUrl} alt={selectedMember.name} className="w-7 h-7 rounded-full object-cover shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-medium">{selectedMember.name}</div>
                        <div className="text-xs text-slate-500">{selectedMember.role}</div>
                      </div>
                      <span className="text-xs text-slate-500">Change</span>
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={nameQuery}
                      onChange={(e) => { setNameQuery(e.target.value); setShowSuggestions(true); setError(''); }}
                      onFocus={() => setShowSuggestions(true)}
                      placeholder="Search your name…"
                      autoComplete="off"
                      autoFocus
                      className="w-full px-4 py-3 rounded-xl text-white placeholder-slate-600 focus:outline-none"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                    />
                  )}
                  {!selectedMember && showSuggestions && suggestions.length > 0 && (
                    <div
                      className="absolute top-full mt-1.5 w-full rounded-xl overflow-hidden z-50"
                      style={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
                    >
                      {suggestions.map(m => (
                        <button
                          key={m.id}
                          type="button"
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                          style={{ background: 'transparent' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(59,130,246,0.08)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                          onClick={() => { setSelectedMember(m); setNameQuery(''); setShowSuggestions(false); setError(''); }}
                        >
                          {m.avatarUrl && <img src={m.avatarUrl} alt={m.name} className="w-7 h-7 rounded-full object-cover shrink-0" />}
                          <div>
                            <div className="text-white text-sm font-medium">{m.name}</div>
                            <div className="text-xs text-slate-500">{m.role}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  {!selectedMember && showSuggestions && nameQuery.trim() && suggestions.length === 0 && (
                    <div
                      className="absolute top-full mt-1.5 w-full rounded-xl px-4 py-3 text-center z-50"
                      style={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)', fontSize: '13px', color: '#475569' }}
                    >
                      No members found. Contact your club admin.
                    </div>
                  )}
                </div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {loginMode === 'member' ? 'Member password' : 'Admin password'}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="Enter password"
                  autoFocus={false}
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-slate-600 text-center font-mono text-lg tracking-widest focus:outline-none mb-3"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
                {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
                <button
                  type="submit"
                  disabled={loading || !password.trim() || !selectedMember}
                  className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
                  style={{
                    background: loginMode === 'admin'
                      ? 'linear-gradient(135deg, #8b5cf6, #6d28d9)'
                      : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  }}
                >
                  {loading ? 'Signing in...' : 'Enter LC3 Careers'}
                </button>
                <p className="text-center text-xs text-slate-600 mt-2">
                  {loginMode === 'member'
                    ? 'Get your password at an LC3 club meeting'
                    : 'Admin access is restricted to Club Officers'}
                </p>
              </div>
            </form>
          </div>
          {/* Right: preview */}
          <div className="flex items-start pt-2">
            <div className="w-full">
              <CareersDashboardPreview />
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-10">
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
