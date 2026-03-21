'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, AlertCircle, ArrowRight, KeyRound } from 'lucide-react';
import { saveUserData, getDefaultUserData, loadUserData } from '@/lib/shield-storage';

const GROUPS = [
  { code: 'LC3MEMBER', label: 'LC3 Club Member' },
  { code: 'CSNSTUDENT', label: 'CSN Student' },
];

export default function ShieldLoginPage() {
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const data = loadUserData();
    if (data) router.push('/shield/dashboard');
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/shield/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      const upperCode = data.code as string;
      const existing = loadUserData();
      if (existing && existing.accessCode === upperCode) {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        if (existing.lastLoginDate === yesterday) existing.loginStreak += 1;
        else if (existing.lastLoginDate !== today) existing.loginStreak = 1;
        existing.lastLoginDate = today;
        saveUserData(existing);
      } else if (!existing) {
        saveUserData(getDefaultUserData(upperCode));
      }
      router.push('/shield/dashboard');
    } catch {
      setError('Connection error. Please try again.');
      setLoading(false);
    }
  };

  const canSubmit = code && password && !loading;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#0d1117',
        overflow: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #ef4444, #b91c1c)', boxShadow: '0 0 24px rgba(239,68,68,0.3)' }}
          >
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-[18px] font-bold leading-none">
              <span className="text-white">LC3</span>
              <span style={{ color: '#f87171' }}> Shield</span>
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Security Scanner</div>
          </div>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{ background: '#161b27', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <h1 className="text-xl font-bold text-white mb-1" style={{ letterSpacing: '-0.02em' }}>
            Sign in
          </h1>
          <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '24px' }}>
            Select your group and enter your password.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">

            {/* Group selector */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#94a3b8', marginBottom: '8px' }}>
                I am a...
              </label>
              <div className="grid grid-cols-2 gap-2">
                {GROUPS.map(({ code: c, label }) => {
                  const active = code === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => { setCode(c); setError(''); }}
                      className="py-3 px-4 rounded-xl text-center transition-all"
                      style={{
                        background: active ? 'rgba(59,130,246,0.15)' : '#0d1117',
                        border: active ? '1.5px solid rgba(59,130,246,0.5)' : '1.5px solid rgba(255,255,255,0.08)',
                        color: active ? '#93c5fd' : '#94a3b8',
                        fontWeight: active ? 600 : 400,
                        fontSize: '13px',
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="flex items-center gap-1.5"
                style={{ fontSize: '13px', fontWeight: 500, color: '#94a3b8', marginBottom: '8px' }}
              >
                <KeyRound className="w-3.5 h-3.5" />
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all text-white"
                  style={{
                    background: '#0d1117',
                    border: error ? '1.5px solid rgba(239,68,68,0.6)' : '1.5px solid rgba(255,255,255,0.1)',
                    fontSize: '14px',
                  }}
                  onFocus={(e) => {
                    if (!error) {
                      e.target.style.borderColor = 'rgba(59,130,246,0.6)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.08)';
                    }
                  }}
                  onBlur={(e) => {
                    if (!error) {
                      e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                />
              </div>
            </div>

            {error && (
              <div
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', fontSize: '13px', color: '#fca5a5' }}
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
                background: canSubmit ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'rgba(59,130,246,0.3)',
                fontSize: '14px',
                cursor: canSubmit ? 'pointer' : 'not-allowed',
                boxShadow: canSubmit ? '0 0 24px rgba(59,130,246,0.3)' : 'none',
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
                <>Access LC3 Shield <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-6" style={{ fontSize: '12px', color: '#475569' }}>
          Built for LC3 Club &amp; CSN Students · Powered by Claude AI
        </p>
      </div>
    </div>
  );
}
