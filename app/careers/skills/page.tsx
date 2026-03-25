'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CareersNav from '../components/CareersNav';
import { LS_AUTH, LS_PROFILE } from '../types';
import type { CareerProfile } from '../types';

interface SkillGap {
  skill: string;
  importance: string;
  whyMatters: string;
  jobsUnlocked: number;
  timeToLearn: string;
  resources: { name: string; url: string; type: string }[];
}

interface RoadmapPhase {
  phase: number;
  title: string;
  skills: string[];
  goal: string;
}

interface MarketDemand {
  skill: string;
  demandScore: number;
  hasSkill: boolean;
}

interface SkillsData {
  skillGaps: SkillGap[];
  roadmap: RoadmapPhase[];
  marketDemand: MarketDemand[];
  summary: string;
}

const importanceColors: Record<string, string> = {
  Critical: '#ef4444',
  High: '#f59e0b',
  Medium: '#3b82f6',
};

export default function SkillsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<CareerProfile | null>(null);
  const [data, setData] = useState<SkillsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activePhase, setActivePhase] = useState(1);

  useEffect(() => {
    if (localStorage.getItem(LS_AUTH) !== 'true') { router.replace('/careers'); return; }
    const raw = localStorage.getItem(LS_PROFILE);
    if (raw) {
      try {
        const p = JSON.parse(raw) as CareerProfile;
        setProfile(p);
      } catch {}
    }
  }, [router]);

  const analyze = async () => {
    if (!profile) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/careers/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          targetRoles: profile.industries,
        }),
      });
      if (res.ok) {
        setData(await res.json() as SkillsData);
        // Achievement
        if (profile.skills.length >= 10) {
          const rawProfile = localStorage.getItem(LS_PROFILE);
          if (rawProfile) {
            const p = JSON.parse(rawProfile) as CareerProfile;
            if (!p.achievements.includes('Skill Builder')) {
              p.achievements.push('Skill Builder');
              localStorage.setItem(LS_PROFILE, JSON.stringify(p));
            }
          }
        }
      } else {
        setError('Analysis failed. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  const addSkill = (skillName: string) => {
    const raw = localStorage.getItem(LS_PROFILE);
    if (!raw) return;
    const p = JSON.parse(raw) as CareerProfile;
    if (!p.skills.find((s) => s.name === skillName)) {
      p.skills.push({ name: skillName, level: 'Beginner' });
      localStorage.setItem(LS_PROFILE, JSON.stringify(p));
      setProfile(p);
    }
  };

  return (
    <div style={{ background: '#0a0f1e', minHeight: '100vh' }}>
      <CareersNav />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-xl font-bold text-white mb-2">Skill Gap Dashboard</h1>
        <p className="text-slate-400 text-sm mb-8">Understand what skills to learn to unlock more job opportunities</p>

        {!profile ? (
          <div className="text-center py-12 text-slate-400">Loading profile...</div>
        ) : !data ? (
          <div className="space-y-6">
            {/* Profile summary */}
            <div className="rounded-2xl p-5" style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h2 className="text-sm font-semibold text-white mb-3">Your Current Skills</h2>
              {profile.skills.length === 0 ? (
                <p className="text-slate-500 text-sm">No skills added yet. <a href="/careers/profile" className="text-blue-400">Add skills in your profile →</a></p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((s) => (
                    <span
                      key={s.name}
                      className="px-3 py-1 rounded-lg text-xs font-medium"
                      style={{
                        background: s.level === 'Advanced' ? 'rgba(34,197,94,0.15)' : s.level === 'Intermediate' ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.06)',
                        color: s.level === 'Advanced' ? '#4ade80' : s.level === 'Intermediate' ? '#60a5fa' : '#94a3b8',
                      }}
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={analyze}
              disabled={loading}
              className="w-full py-4 rounded-2xl text-base font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', boxShadow: '0 0 30px rgba(59,130,246,0.2)' }}
            >
              {loading ? '🔍 Analyzing your skill gaps...' : '📊 Analyze My Skill Gaps'}
            </button>
            {error && <p className="text-red-400 text-sm">{error}</p>}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Market demand chart */}
            <div className="rounded-2xl p-6" style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h2 className="text-sm font-semibold text-white mb-4">Market Demand vs Your Skills</h2>
              <div className="space-y-3">
                {data.marketDemand.map((item) => (
                  <div key={item.skill} className="flex items-center gap-3">
                    <div className="w-24 text-xs text-slate-400 shrink-0 text-right">{item.skill}</div>
                    <div className="flex-1 h-5 rounded-full overflow-hidden relative" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${item.demandScore}%`,
                          background: item.hasSkill
                            ? 'linear-gradient(90deg, #22c55e, #16a34a)'
                            : 'linear-gradient(90deg, #3b82f6, #1d4ed8)',
                          opacity: 0.7,
                        }}
                      />
                    </div>
                    <div className="w-8 text-xs text-slate-500">{item.demandScore}</div>
                    <div className="w-16 text-right">
                      {item.hasSkill ? (
                        <span className="text-[10px] text-green-400">✓ Have it</span>
                      ) : (
                        <button
                          onClick={() => addSkill(item.skill)}
                          className="text-[10px] text-blue-400 hover:text-blue-300"
                        >
                          + Add
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-4 text-xs text-slate-600">
                <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded" style={{ background: '#22c55e' }} />Have it</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded" style={{ background: '#3b82f6' }} />Gap</span>
              </div>
            </div>

            {/* Summary */}
            <div className="rounded-2xl p-5" style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)' }}>
              <p className="text-sm text-blue-200">{data.summary}</p>
            </div>

            {/* Skill gaps */}
            <div>
              <h2 className="text-sm font-semibold text-white mb-4">Priority Skill Gaps</h2>
              <div className="space-y-4">
                {data.skillGaps.map((gap) => (
                  <div
                    key={gap.skill}
                    className="rounded-2xl p-5"
                    style={{ background: '#111827', border: `1px solid ${importanceColors[gap.importance] ?? '#334155'}22` }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-white">{gap.skill}</h3>
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded uppercase"
                            style={{
                              color: importanceColors[gap.importance] ?? '#6b7280',
                              background: `${importanceColors[gap.importance] ?? '#6b7280'}15`,
                            }}
                          >
                            {gap.importance}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{gap.whyMatters}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm font-bold text-green-400">+{gap.jobsUnlocked}</div>
                        <div className="text-[10px] text-slate-600">jobs unlocked</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                      <span>⏱ {gap.timeToLearn}</span>
                    </div>

                    <div className="space-y-1.5">
                      <p className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold">Free Resources</p>
                      {gap.resources.map((r) => (
                        <a
                          key={r.name}
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <span className="text-[10px] px-1.5 py-0.5 rounded text-slate-600" style={{ background: 'rgba(255,255,255,0.05)' }}>{r.type}</span>
                          {r.name} ↗
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Roadmap */}
            <div>
              <h2 className="text-sm font-semibold text-white mb-4">Learning Roadmap</h2>
              <div className="flex gap-2 mb-4 flex-wrap">
                {data.roadmap.map((phase) => (
                  <button
                    key={phase.phase}
                    onClick={() => setActivePhase(phase.phase)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{
                      background: activePhase === phase.phase ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'rgba(255,255,255,0.05)',
                      color: activePhase === phase.phase ? '#fff' : '#6b7280',
                    }}
                  >
                    Phase {phase.phase}
                  </button>
                ))}
              </div>
              {data.roadmap.filter((p) => p.phase === activePhase).map((phase) => (
                <div key={phase.phase} className="rounded-2xl p-5" style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <h3 className="font-semibold text-white mb-1">{phase.title}</h3>
                  <p className="text-xs text-slate-400 mb-4">{phase.goal}</p>
                  <div className="flex flex-wrap gap-2">
                    {phase.skills.map((s) => (
                      <span key={s} className="px-3 py-1.5 rounded-lg text-xs font-medium text-blue-300" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setData(null)}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              ← Analyze again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
