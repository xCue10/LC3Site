'use client';

import { useState, useEffect } from 'react';

const SCREEN_DURATION = 3200;
const FADE_DURATION = 280;

function BrowserChrome({ url, children }: { url: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl overflow-hidden shadow-2xl" style={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.08)' }}>
      {/* Title bar */}
      <div className="flex items-center gap-2 px-3 py-2.5" style={{ background: '#161b22', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
        </div>
        <div className="flex-1 mx-2 px-2.5 py-0.5 rounded text-xs text-slate-500 font-mono truncate" style={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.06)' }}>
          {url}
        </div>
      </div>
      <div className="p-3">
        {children}
      </div>
    </div>
  );
}

function ScreenJobs() {
  const jobs = [
    { title: 'Cloud Engineer', company: 'Google', location: 'Remote', salary: '$120k–160k', match: 94, source: 'Remote', sourceColor: '#8b5cf6' },
    { title: 'Frontend Developer', company: 'Stripe', location: 'Remote', salary: '$95k–130k', match: 81, source: 'Remote', sourceColor: '#8b5cf6' },
    { title: 'IT Specialist', company: 'US Army', location: 'Las Vegas, NV', salary: '$55k–72k', match: 67, source: 'Federal', sourceColor: '#3b82f6' },
  ];
  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs font-semibold text-white">Job Board</span>
        <span className="text-[9px] text-slate-500">42 matches found</span>
      </div>
      <div className="space-y-1.5">
        {jobs.map(({ title, company, location, salary, match, source, sourceColor }) => {
          const matchColor = match >= 80 ? '#22c55e' : match >= 60 ? '#f59e0b' : '#ef4444';
          return (
            <div key={title} className="rounded-lg p-2.5" style={{ background: '#161b22', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[8px] font-semibold px-1.5 py-0.5 rounded" style={{ background: `${sourceColor}22`, color: sourceColor }}>{source}</span>
                  </div>
                  <div className="text-[10px] font-semibold text-white leading-tight">{title}</div>
                  <div className="text-[9px] text-slate-400">{company} · {location}</div>
                </div>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md shrink-0" style={{ color: matchColor, background: `${matchColor}18`, border: `1px solid ${matchColor}33` }}>
                  {match}%
                </span>
              </div>
              <div className="text-[9px] text-slate-500 mt-1">{salary}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ScreenCoverLetter() {
  const [tick, setTick] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setTick(p => !p), 600);
    return () => clearInterval(t);
  }, []);

  const lines = [
    'Dear Hiring Manager,',
    '',
    'I am excited to apply for the Cloud',
    'Engineer role at Google. My hands-on',
    'experience with Azure and React at',
    'CSN directly aligns with your team\'s',
    'focus on scalable infrastructure...',
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs font-semibold text-white">Cover Letter</span>
        <span className="text-[9px] px-1.5 py-0.5 rounded font-semibold" style={{ background: 'rgba(139,92,246,0.15)', color: '#a78bfa' }}>✦ Claude AI</span>
      </div>
      {/* Job selector */}
      <div className="flex items-center gap-1.5 mb-2.5 px-2 py-1.5 rounded-md text-[9px]" style={{ background: '#161b22', border: '1px solid rgba(255,255,255,0.08)' }}>
        <span className="text-slate-400">Job:</span>
        <span className="text-blue-300 font-medium">Cloud Engineer · Google</span>
        <span className="text-slate-600 ml-auto">▼</span>
      </div>
      {/* Letter body */}
      <div className="rounded-md p-2.5 text-[9px] leading-relaxed" style={{ background: '#161b22', border: '1px solid rgba(255,255,255,0.06)' }}>
        {lines.map((line, i) => (
          <div key={i} className={line === '' ? 'h-2' : ''}>
            {line && <span className="text-slate-300">{line}</span>}
          </div>
        ))}
        <span className="inline-block w-px h-3 ml-px align-middle" style={{ background: '#a78bfa', opacity: tick ? 1 : 0 }} />
      </div>
      <div className="flex gap-1.5 mt-2">
        <div className="flex-1 text-center py-1 rounded text-[9px] font-semibold text-white" style={{ background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)' }}>Generate</div>
        <div className="px-2 py-1 rounded text-[9px] text-slate-400" style={{ background: 'rgba(255,255,255,0.05)' }}>Copy</div>
      </div>
    </div>
  );
}

function ScreenResume() {
  const skills = [
    { name: 'React', pct: 82, color: '#3b82f6' },
    { name: 'Azure', pct: 61, color: '#8b5cf6' },
    { name: 'Python', pct: 90, color: '#22c55e' },
    { name: 'Docker', pct: 38, color: '#f59e0b' },
  ];
  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs font-semibold text-white">Resume Analysis</span>
        <span className="text-[9px] font-bold text-emerald-400">78% match</span>
      </div>
      {/* Skills bars */}
      <div className="space-y-2 mb-2.5">
        {skills.map(({ name, pct, color }) => (
          <div key={name}>
            <div className="flex justify-between text-[9px] mb-0.5">
              <span className="text-slate-300">{name}</span>
              <span className="font-semibold" style={{ color }}>{pct}%</span>
            </div>
            <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div className="h-1.5 rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
            </div>
          </div>
        ))}
      </div>
      {/* Tip */}
      <div className="rounded-md p-2 text-[9px] flex items-start gap-1.5" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
        <span className="text-amber-400 shrink-0">💡</span>
        <span className="text-amber-300">Add Docker projects to your resume to boost match score by ~15%</span>
      </div>
    </div>
  );
}

function ScreenInsights() {
  const stats = [
    { label: 'Applications', value: '12', delta: '+3 this week', up: true },
    { label: 'Saved Jobs', value: '28', delta: '8 expiring soon', up: false },
    { label: 'Avg Match', value: '74%', delta: '+6% vs last month', up: true },
  ];
  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs font-semibold text-white">Market Insights</span>
        <span className="text-[9px] text-slate-500">Updated today</span>
      </div>
      <div className="grid grid-cols-3 gap-1.5 mb-2.5">
        {stats.map(({ label, value, delta, up }) => (
          <div key={label} className="rounded-lg p-2 text-center" style={{ background: '#161b22', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-sm font-bold text-white">{value}</div>
            <div className="text-[8px] text-slate-400">{label}</div>
            <div className={`text-[8px] mt-0.5 ${up ? 'text-green-400' : 'text-amber-400'}`}>{delta}</div>
          </div>
        ))}
      </div>
      {/* Trending roles */}
      <div className="text-[9px] text-slate-500 mb-1.5">Trending roles in Las Vegas, NV</div>
      {['Cloud Architect', 'DevOps Engineer', 'Security Analyst'].map(r => (
        <div key={r} className="flex items-center justify-between text-[9px] py-1" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <span className="text-slate-300">{r}</span>
          <span className="text-green-400">↑ High demand</span>
        </div>
      ))}
    </div>
  );
}

const SCREENS = [
  { url: 'lc3.club/careers/jobs', label: 'Jobs', component: <ScreenJobs /> },
  { url: 'lc3.club/careers/cover-letter', label: 'Cover Letter', component: <ScreenCoverLetter /> },
  { url: 'lc3.club/careers/resume', label: 'Resume', component: <ScreenResume /> },
  { url: 'lc3.club/careers/insights', label: 'Insights', component: <ScreenInsights /> },
];

export default function CareersDashboardPreview() {
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
              background: i === active ? '#3b82f6' : 'rgba(255,255,255,0.15)',
            }}
            aria-label={s.label}
          />
        ))}
      </div>
    </div>
  );
}
