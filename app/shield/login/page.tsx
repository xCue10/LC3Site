'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowRight, KeyRound, User } from 'lucide-react';
import { saveUserData, loadUserData, setSessionToken } from '@/lib/shield-storage';
import type { Member } from '@/lib/data';


function ShieldBanner() {
  return (
    <div
      className="hidden lg:flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0d1117 0%, #0f1923 50%, #0d1117 100%)' }}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Radial glow center */}
      <div
        className="absolute"
        style={{
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(239,68,68,0.08) 0%, rgba(139,92,246,0.06) 40%, transparent 70%)',
          borderRadius: '50%',
        }}
      />

      {/* Main SVG */}
      <svg width="420" height="420" viewBox="0 0 420 420" fill="none" className="relative z-10">
        {/* Outermost orbit ring */}
        <circle cx="210" cy="210" r="185" stroke="rgba(59,130,246,0.08)" strokeWidth="1" />
        <circle cx="210" cy="210" r="185" stroke="url(#orbit1)" strokeWidth="1.5" strokeDasharray="8 16">
          <animateTransform attributeName="transform" type="rotate" from="0 210 210" to="360 210 210" dur="18s" repeatCount="indefinite" />
        </circle>

        {/* Orbit dots on outer ring */}
        <circle cx="395" cy="210" r="4" fill="#3b82f6" opacity="0.7">
          <animateTransform attributeName="transform" type="rotate" from="0 210 210" to="360 210 210" dur="18s" repeatCount="indefinite" />
        </circle>
        <circle cx="25" cy="210" r="3" fill="#8b5cf6" opacity="0.5">
          <animateTransform attributeName="transform" type="rotate" from="120 210 210" to="480 210 210" dur="18s" repeatCount="indefinite" />
        </circle>
        <circle cx="395" cy="210" r="2.5" fill="#ef4444" opacity="0.6">
          <animateTransform attributeName="transform" type="rotate" from="240 210 210" to="600 210 210" dur="18s" repeatCount="indefinite" />
        </circle>

        {/* Second orbit ring */}
        <circle cx="210" cy="210" r="145" stroke="rgba(139,92,246,0.08)" strokeWidth="1" />
        <circle cx="210" cy="210" r="145" stroke="url(#orbit2)" strokeWidth="1" strokeDasharray="6 20">
          <animateTransform attributeName="transform" type="rotate" from="360 210 210" to="0 210 210" dur="12s" repeatCount="indefinite" />
        </circle>

        {/* Orbit dots on second ring */}
        <circle cx="355" cy="210" r="3.5" fill="#8b5cf6" opacity="0.8">
          <animateTransform attributeName="transform" type="rotate" from="60 210 210" to="420 210 210" dur="12s" repeatCount="indefinite" />
        </circle>
        <circle cx="355" cy="210" r="2.5" fill="#06b6d4" opacity="0.6">
          <animateTransform attributeName="transform" type="rotate" from="200 210 210" to="560 210 210" dur="12s" repeatCount="indefinite" />
        </circle>

        {/* Inner orbit ring */}
        <circle cx="210" cy="210" r="105" stroke="rgba(239,68,68,0.07)" strokeWidth="1" />
        <circle cx="210" cy="210" r="105" stroke="url(#orbit3)" strokeWidth="1.5" strokeDasharray="4 12">
          <animateTransform attributeName="transform" type="rotate" from="0 210 210" to="360 210 210" dur="8s" repeatCount="indefinite" />
        </circle>

        {/* Orbit dot on inner ring */}
        <circle cx="315" cy="210" r="3" fill="#ef4444" opacity="0.9">
          <animateTransform attributeName="transform" type="rotate" from="0 210 210" to="360 210 210" dur="8s" repeatCount="indefinite" />
        </circle>

        {/* Radar sweep */}
        <path d="M210 210 L395 210" stroke="url(#radarGrad)" strokeWidth="1" opacity="0.6">
          <animateTransform attributeName="transform" type="rotate" from="0 210 210" to="360 210 210" dur="4s" repeatCount="indefinite" />
        </path>
        <path d="M210 210 L395 210" stroke="rgba(34,197,94,0.15)" strokeWidth="40">
          <animateTransform attributeName="transform" type="rotate" from="0 210 210" to="360 210 210" dur="4s" repeatCount="indefinite" />
        </path>

        {/* Shield body */}
        <path
          d="M210 82 L290 110 L290 190 C290 235 254 272 210 285 C166 272 130 235 130 190 L130 110 Z"
          fill="url(#shieldFill)"
          stroke="url(#shieldStroke)"
          strokeWidth="1.5"
        />

        {/* Shield inner border */}
        <path
          d="M210 98 L278 122 L278 188 C278 226 248 258 210 270 C172 258 142 226 142 188 L142 122 Z"
          fill="none"
          stroke="rgba(239,68,68,0.2)"
          strokeWidth="1"
        />

        {/* Shield checkmark */}
        <path
          d="M188 183 L204 199 L232 168"
          stroke="url(#checkGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          <animate attributeName="stroke-dasharray" from="0 60" to="60 0" dur="1.5s" begin="0.5s" fill="freeze" />
        </path>

        {/* Pulse rings from shield */}
        <circle cx="210" cy="185" r="55" fill="none" stroke="rgba(239,68,68,0.15)" strokeWidth="1.5">
          <animate attributeName="r" values="55;80;55" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0;0.5" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="210" cy="185" r="55" fill="none" stroke="rgba(239,68,68,0.1)" strokeWidth="1">
          <animate attributeName="r" values="55;95;55" dur="3s" begin="1s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0;0.4" dur="3s" begin="1s" repeatCount="indefinite" />
        </circle>

        {/* Floating security nodes */}
        {[
          { cx: 95, cy: 120, dur: '3.2s', label: 'SSL' },
          { cx: 340, cy: 130, dur: '2.8s', label: 'DNS' },
          { cx: 75, cy: 290, dur: '3.6s', label: 'JWT' },
          { cx: 350, cy: 295, dur: '3s', label: 'CVE' },
          { cx: 155, cy: 335, dur: '2.5s', label: 'XSS' },
          { cx: 270, cy: 340, dur: '3.4s', label: 'SQL' },
        ].map(({ cx, cy, dur, label }) => (
          <g key={label}>
            <rect x={cx - 18} y={cy - 10} width="36" height="20" rx="4"
              fill="rgba(15,25,40,0.9)" stroke="rgba(59,130,246,0.3)" strokeWidth="1">
              <animate attributeName="opacity" values="0.6;1;0.6" dur={dur} repeatCount="indefinite" />
            </rect>
            <text x={cx} y={cy + 4} textAnchor="middle" fill="#60a5fa" fontSize="8" fontFamily="monospace" fontWeight="bold">
              {label}
              <animate attributeName="opacity" values="0.6;1;0.6" dur={dur} repeatCount="indefinite" />
            </text>
            {/* connector line to center */}
            <line x1={cx} y1={cy} x2="210" y2="185" stroke="rgba(59,130,246,0.1)" strokeWidth="0.5" strokeDasharray="3 4" />
          </g>
        ))}

        {/* Scan line */}
        <rect x="130" y="82" width="160" height="2" fill="url(#scanLine)" opacity="0.6" rx="1">
          <animate attributeName="y" values="82;285;82" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.7;0;0.7;0" dur="4s" repeatCount="indefinite" />
        </rect>

        {/* Corner brackets */}
        <path d="M50 50 L50 70 M50 50 L70 50" stroke="rgba(59,130,246,0.3)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M370 50 L370 70 M370 50 L350 50" stroke="rgba(59,130,246,0.3)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M50 370 L50 350 M50 370 L70 370" stroke="rgba(59,130,246,0.3)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M370 370 L370 350 M370 370 L350 370" stroke="rgba(59,130,246,0.3)" strokeWidth="1.5" strokeLinecap="round" />

        <defs>
          <linearGradient id="orbit1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="orbit2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="orbit3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0" />
            <stop offset="50%" stopColor="#ef4444" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="shieldFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(239,68,68,0.12)" />
            <stop offset="100%" stopColor="rgba(185,28,28,0.06)" />
          </linearGradient>
          <linearGradient id="shieldStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#b91c1c" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="checkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#fca5a5" />
          </linearGradient>
          <linearGradient id="radarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="scanLine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity="1" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Text below SVG */}
      <div className="relative z-10 text-center mt-2 px-8">
        <h2 className="text-2xl font-bold mb-2" style={{ letterSpacing: '-0.03em' }}>
          <span className="text-white">LC3</span>
          <span style={{ color: '#f87171' }}> Shield</span>
        </h2>
        <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', maxWidth: '280px', margin: '0 auto' }}>
          AI-powered security scanning for LC3 Club members.
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2 mt-5">
          {['URL Scan', 'SSL/TLS', 'OWASP', 'GitHub', 'DNS', 'JWT'].map((f) => (
            <span
              key={f}
              className="text-xs px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)', color: '#64748b' }}
            >
              {f}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ShieldLoginPage() {
  const [password, setPassword] = useState('');
  const [nameQuery, setNameQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const nameRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/members').then(r => r.json()).then(setMembers).catch(() => {});
  }, []);

  // Close suggestions on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (nameRef.current && !nameRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const suggestions = nameQuery.trim()
    ? members.filter(m => m.name.toLowerCase().includes(nameQuery.toLowerCase().trim())).slice(0, 6)
    : [];

  useEffect(() => {
    const data = loadUserData();
    if (data) router.push('/shield/dashboard');
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/shield/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, displayName: selectedMember?.name ?? '', adminMode }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      setSessionToken(data.token);
      saveUserData({ ...data.userData, loggedIn: true });
      router.push('/shield/dashboard');
    } catch {
      setError('Connection error. Please try again.');
      setLoading(false);
    }
  };

  const canSubmit = password && !loading && (adminMode || selectedMember !== null);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#0d1117',
        overflow: 'auto',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
      }}
    >
      {/* Left — animated banner */}
      <ShieldBanner />

      {/* Right — login form */}
      <div
        className="flex flex-col items-center justify-center px-6 py-10"
        style={{ borderLeft: '1px solid rgba(255,255,255,0.06)' }}
      >
        {/* Mobile logo (hidden on lg) */}
        <div className="flex lg:hidden items-center gap-3 mb-8">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #ef4444, #b91c1c)', boxShadow: '0 0 20px rgba(239,68,68,0.3)' }}
          >
            <svg className="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ width: 18, height: 18 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <div>
            <div className="text-[17px] font-bold leading-none">
              <span className="text-white">LC3</span>
              <span style={{ color: '#f87171' }}> Shield</span>
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Security Scanner</div>
          </div>
        </div>

        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-white mb-1" style={{ letterSpacing: '-0.02em' }}>
            {adminMode ? 'Admin Access' : 'Sign in'}
          </h1>
          <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '28px' }}>
            {adminMode ? 'Owner access — no scan limits.' : 'LC3 Club members only.'}
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Member name picker — skip for admin */}
            {!adminMode && (
              <div ref={nameRef}>
                <label
                  style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <User style={{ width: 12, height: 12 }} />
                  Your Name
                </label>

                {selectedMember ? (
                  <div
                    className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer"
                    style={{ background: 'rgba(59,130,246,0.06)', border: '1.5px solid rgba(59,130,246,0.3)', fontSize: '14px' }}
                    onClick={() => { setSelectedMember(null); setNameQuery(''); }}
                  >
                    {selectedMember.avatarUrl && (
                      <img src={selectedMember.avatarUrl} alt={selectedMember.name} className="w-7 h-7 rounded-full object-cover shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium text-sm">{selectedMember.name}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{selectedMember.role}</div>
                    </div>
                    <span style={{ fontSize: '11px', color: '#475569' }}>Change</span>
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type="text"
                      value={nameQuery}
                      onChange={(e) => { setNameQuery(e.target.value); setShowSuggestions(true); setError(''); }}
                      onFocus={() => setShowSuggestions(true)}
                      placeholder="Search your name…"
                      autoComplete="off"
                      className="w-full px-4 py-3 rounded-xl outline-none transition-all text-white"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1.5px solid rgba(255,255,255,0.07)',
                        fontSize: '14px',
                      }}
                    />
                    {showSuggestions && suggestions.length > 0 && (
                      <div
                        className="absolute top-full mt-1.5 w-full rounded-xl overflow-hidden z-50"
                        style={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
                      >
                        {suggestions.map(m => (
                          <button
                            key={m.id}
                            type="button"
                            onMouseDown={(e) => { e.preventDefault(); setSelectedMember(m); setNameQuery(''); setShowSuggestions(false); setError(''); }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                            style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(59,130,246,0.08)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                          >
                            {m.avatarUrl && <img src={m.avatarUrl} alt={m.name} className="w-7 h-7 rounded-full object-cover shrink-0" />}
                            <div>
                              <div className="text-white text-sm font-medium">{m.name}</div>
                              <div style={{ fontSize: '11px', color: '#475569' }}>{m.role} · {m.memberType}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                    {showSuggestions && nameQuery.trim() && suggestions.length === 0 && (
                      <div
                        className="absolute top-full mt-1.5 w-full rounded-xl px-4 py-3 text-center z-50"
                        style={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)', fontSize: '13px', color: '#475569' }}
                      >
                        No members found. Contact your club admin.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="flex items-center gap-1.5"
                style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}
              >
                <KeyRound className="w-3 h-3" />
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder={adminMode ? 'Admin password' : 'Enter your password'}
                autoComplete="current-password"
                className="w-full px-4 py-3 rounded-xl outline-none transition-all text-white"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: error ? '1.5px solid rgba(239,68,68,0.5)' : '1.5px solid rgba(255,255,255,0.07)',
                  fontSize: '14px',
                }}
                onFocus={(e) => {
                  if (!error) {
                    e.target.style.borderColor = adminMode ? 'rgba(239,68,68,0.5)' : 'rgba(59,130,246,0.5)';
                    e.target.style.boxShadow = adminMode ? '0 0 0 3px rgba(239,68,68,0.07)' : '0 0 0 3px rgba(59,130,246,0.07)';
                  }
                }}
                onBlur={(e) => {
                  if (!error) {
                    e.target.style.borderColor = 'rgba(255,255,255,0.07)';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              />
            </div>

            {error && (
              <div
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl"
                style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', fontSize: '13px', color: '#fca5a5' }}
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all"
              style={{
                background: canSubmit
                  ? adminMode ? 'linear-gradient(135deg, #ef4444, #b91c1c)' : 'linear-gradient(135deg, #3b82f6, #2563eb)'
                  : 'rgba(59,130,246,0.2)',
                fontSize: '14px',
                cursor: canSubmit ? 'pointer' : 'not-allowed',
                boxShadow: canSubmit
                  ? adminMode ? '0 0 20px rgba(239,68,68,0.25)' : '0 0 20px rgba(59,130,246,0.25)'
                  : 'none',
              }}
            >
              {loading ? (
                <>
                  <span
                    className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white"
                    style={{ animation: 'spin 0.7s linear infinite' }}
                  />
                  Verifying...
                </>
              ) : (
                <>{adminMode ? 'Admin Sign In' : 'Access LC3 Shield'} <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="flex items-center justify-between mt-8">
            <p style={{ fontSize: '11px', color: '#334155' }}>
              Built for LC3 Club · Powered by Claude AI
            </p>
            <button
              type="button"
              onClick={() => { setAdminMode(m => !m); setPassword(''); setError(''); }}
              style={{ fontSize: '11px', color: '#334155', background: 'none', border: 'none', cursor: 'pointer' }}
              className="hover:text-slate-500 transition-colors"
            >
              {adminMode ? '← Back' : 'Admin'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
