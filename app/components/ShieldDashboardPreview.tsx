'use client';

import { useState, useEffect } from 'react';

const SCREEN_DURATION = 3200;
const FADE_DURATION = 280;

function BrowserChrome({ url, children }: { url: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl overflow-hidden shadow-2xl bg-white dark:bg-[#0d1117] border border-slate-200/80 dark:border-white/[0.08]">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-100 dark:bg-[#161b22] border-b border-slate-200/80 dark:border-white/[0.06]">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
        </div>
        <div className="flex-1 mx-2 px-2.5 py-0.5 rounded text-xs text-slate-500 font-mono truncate bg-white dark:bg-[#0d1117] border border-slate-200/60 dark:border-white/[0.06]">
          {url}
        </div>
      </div>
      <div className="p-3" style={{ height: 230, overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  );
}

function ScreenDashboard() {
  const tools = [
    { icon: '🌐', label: 'URL Scanner', color: '#3b82f6' },
    { icon: '</>', label: 'Code Scanner', color: '#8b5cf6' },
    { icon: '🔒', label: 'SSL/TLS', color: '#22c55e' },
    { icon: '🔑', label: 'JWT Analyzer', color: '#f59e0b' },
    { icon: '📦', label: 'Dependencies', color: '#22c55e' },
    { icon: '🌍', label: 'DNS Checker', color: '#06b6d4' },
  ];
  return (
    <div>
      {/* User bar */}
      <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-200/60 dark:border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg,#ef4444,#8b5cf6)' }}>A</div>
          <span className="text-xs text-slate-300 font-medium">Alex M.</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-amber-400 font-semibold">⚡ 340 pts</span>
          <span className="text-xs text-slate-400">🏆 3 badges</span>
        </div>
      </div>
      {/* Scanner grid */}
      <div className="grid grid-cols-3 gap-1.5">
        {tools.map(({ icon, label, color }) => (
          <div key={label} className="rounded-lg p-2 flex flex-col items-center gap-1 cursor-pointer transition-all hover:scale-[1.03] bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.06]">
            <span className="text-base leading-none">{icon}</span>
            <span className="text-[9px] text-center leading-tight" style={{ color }}>{label}</span>
          </div>
        ))}
      </div>
      <div className="mt-2.5 text-center">
        <span className="text-[9px] text-slate-500">10 security tools available</span>
      </div>
    </div>
  );
}

function ScreenURLScan() {
  const findings = [
    { ok: true, label: 'HTTPS enabled' },
    { ok: true, label: 'HSTS header present' },
    { ok: false, label: 'X-Frame-Options missing' },
    { ok: true, label: 'Content-Security-Policy set' },
    { ok: false, label: 'Referrer-Policy not found' },
  ];
  return (
    <div>
      <div className="flex items-center gap-2 mb-2.5">
        <span className="text-xs font-semibold text-slate-900 dark:text-white">URL Scanner</span>
        <span className="text-[9px] px-1.5 py-0.5 rounded font-bold text-white" style={{ background: '#f59e0b' }}>B+</span>
      </div>
      {/* URL input */}
      <div className="flex gap-1.5 mb-3">
        <div className="flex-1 text-[10px] font-mono px-2 py-1.5 rounded-md text-slate-400 truncate bg-slate-100 dark:bg-[#161b22] border border-slate-200/60 dark:border-white/[0.08]">
          https://example.com
        </div>
        <div className="px-2 py-1.5 rounded-md text-[10px] font-semibold text-white" style={{ background: '#3b82f6' }}>Scan</div>
      </div>
      {/* Findings */}
      <div className="space-y-1.5">
        {findings.map(({ ok, label }) => (
          <div key={label} className="flex items-center gap-2 text-[10px]">
            <span className={ok ? 'text-green-400' : 'text-red-400'}>{ok ? '✓' : '✗'}</span>
            <span className={ok ? 'text-slate-300' : 'text-slate-400'}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScreenCodeScan() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2.5">
        <span className="text-xs font-semibold text-slate-900 dark:text-white">Code Scanner</span>
        <span className="text-[9px] px-1.5 py-0.5 rounded font-bold text-white" style={{ background: '#ef4444' }}>2 issues</span>
      </div>
      {/* Code block */}
      <div className="rounded-md p-2.5 mb-2.5 font-mono text-[9px] leading-relaxed overflow-hidden bg-slate-100 dark:bg-[#161b22] border border-slate-200/60 dark:border-white/[0.06]">
        <div className="text-slate-500">{'// user login handler'}</div>
        <div className="text-blue-300">{'const query = '}<span className="text-red-400 underline decoration-red-500">{'`SELECT * FROM users'}</span></div>
        <div className="text-red-400 underline decoration-red-500">{'  WHERE id = ${userId}`'}</div>
        <div className="text-slate-500 mt-1">{'db.query(query);'}</div>
      </div>
      {/* AI findings */}
      <div className="space-y-1.5">
        <div className="flex items-start gap-2 p-1.5 rounded-md" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <span className="text-red-400 text-[9px] font-bold shrink-0 mt-px">HIGH</span>
          <span className="text-[9px] text-red-300">SQL Injection — use parameterized queries</span>
        </div>
        <div className="flex items-start gap-2 p-1.5 rounded-md" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
          <span className="text-amber-400 text-[9px] font-bold shrink-0 mt-px">MED</span>
          <span className="text-[9px] text-amber-300">No input sanitization on userId</span>
        </div>
        <div className="text-[9px] text-slate-500 flex items-center gap-1">
          <span className="text-violet-400">✦</span> Claude AI analysis complete
        </div>
      </div>
    </div>
  );
}

function ScreenSSL() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2.5">
        <span className="text-xs font-semibold text-slate-900 dark:text-white">SSL/TLS Checker</span>
        <span className="text-[9px] px-1.5 py-0.5 rounded font-bold text-white" style={{ background: '#22c55e' }}>A</span>
      </div>
      {/* Certificate info */}
      <div className="rounded-md p-2.5 mb-2 bg-slate-100 dark:bg-[#161b22] border border-slate-200/60 dark:border-white/[0.06]">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[9px] text-slate-400 font-medium">example.com</span>
          <span className="text-[9px] text-green-400 font-semibold">✓ Valid</span>
        </div>
        <div className="space-y-1">
          {[
            ['Protocol', 'TLS 1.3'],
            ['Issuer', "Let's Encrypt"],
            ['Expires', '89 days'],
            ['Cipher', 'AES-256-GCM'],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between text-[9px]">
              <span className="text-slate-500">{k}</span>
              <span className="text-slate-300">{v}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-1">
        {['Certificate chain valid', 'OCSP stapling active', 'No weak ciphers found'].map(f => (
          <div key={f} className="flex items-center gap-2 text-[10px]">
            <span className="text-green-400">✓</span>
            <span className="text-slate-300">{f}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const SCREENS = [
  { url: 'lc3.club/shield/dashboard', label: 'Dashboard', component: <ScreenDashboard /> },
  { url: 'lc3.club/shield/scan/url', label: 'URL Scanner', component: <ScreenURLScan /> },
  { url: 'lc3.club/shield/scan/code', label: 'Code Scanner', component: <ScreenCodeScan /> },
  { url: 'lc3.club/shield/scan/ssl', label: 'SSL/TLS', component: <ScreenSSL /> },
];

export default function ShieldDashboardPreview() {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setActive(prev => (prev + 1) % SCREENS.length);
        setVisible(true);
      }, FADE_DURATION);
    }, SCREEN_DURATION);
    return () => clearInterval(timer);
  }, []);

  const screen = SCREENS[active];

  return (
    <div className="flex flex-col gap-2">
      <BrowserChrome url={screen.url}>
        <div style={{ opacity: visible ? 1 : 0, transition: `opacity ${FADE_DURATION}ms ease` }}>
          {screen.component}
        </div>
      </BrowserChrome>
      {/* Screen indicator dots */}
      <div className="flex justify-center gap-1.5">
        {SCREENS.map((s, i) => (
          <button
            key={s.label}
            onClick={() => { setVisible(false); setTimeout(() => { setActive(i); setVisible(true); }, FADE_DURATION); }}
            className="transition-all"
            style={{
              width: i === active ? 16 : 6,
              height: 6,
              borderRadius: 3,
              background: i === active ? '#ef4444' : 'rgba(255,255,255,0.15)',
            }}
            aria-label={s.label}
          />
        ))}
      </div>
    </div>
  );
}
