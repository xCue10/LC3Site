'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CareersNav from '../components/CareersNav';
import { isCareerAuthed, LS_PROFILE, LS_JOBS_CACHE } from '../types';
import type { CareerProfile, Job } from '../types';

interface Insight {
  topSkills: { skill: string; demand: number; avgSalary: string; trend: string }[];
  salaryByRole: { role: string; lasVegas: string; remote: string }[];
  trendingCategories: { category: string; growth: string; description: string }[];
  federalMarket: string;
  topCompaniesHiring: { company: string; type: string; hiring: string }[];
  marketSummary: string;
}

export default function InsightsPage() {
  const router = useRouter();
  const [insights, setInsights] = useState<Insight | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isCareerAuthed()) { router.replace('/careers'); return; }
    loadInsights();
  }, [router]);

  const loadInsights = async () => {
    setLoading(true);
    setError('');
    try {
      const rawProfile = localStorage.getItem(LS_PROFILE);
      const profile: Partial<CareerProfile> = rawProfile ? JSON.parse(rawProfile) : {};

      const cache = localStorage.getItem(LS_JOBS_CACHE);
      let jobData = { titles: [] as string[], tags: [] as string[] };
      if (cache) {
        const { jobs } = JSON.parse(cache) as { jobs: Job[] };
        jobData = {
          titles: jobs.slice(0, 30).map((j) => j.title),
          tags: jobs.flatMap((j) => j.tags ?? []).slice(0, 50),
        };
      }

      const res = await fetch('/api/careers/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skills: profile.skills?.map((s) => s.name) ?? [],
          industries: profile.industries ?? [],
          jobData,
        }),
      });

      if (res.ok) {
        setInsights(await res.json() as Insight);
      } else {
        setError('Failed to load insights. Please try again.');
      }
    } catch {
      setError('Network error.');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div style={{ background: '#0a0f1e', minHeight: '100vh' }}>
        <CareersNav />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Generating market insights with Claude AI...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ background: '#0a0f1e', minHeight: '100vh' }}>
        <CareersNav />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button onClick={loadInsights} className="px-6 py-3 rounded-xl text-white text-sm font-semibold" style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>Try Again</button>
        </div>
      </div>
    );
  }

  if (!insights) return null;

  return (
    <div style={{ background: '#0a0f1e', minHeight: '100vh' }}>
      <CareersNav />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-white">Market Insights</h1>
            <p className="text-slate-400 text-sm">Tech job market data for Las Vegas & remote roles</p>
          </div>
          <button
            onClick={loadInsights}
            className="px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white transition-all"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            ↻ Refresh
          </button>
        </div>

        <div className="space-y-6">
          {/* Summary */}
          <div className="rounded-2xl p-5" style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)' }}>
            <p className="text-sm text-blue-200 leading-relaxed">{insights.marketSummary}</p>
          </div>

          {/* Top Skills */}
          <div className="rounded-2xl p-6" style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 className="text-sm font-semibold text-white mb-5">Most In-Demand Skills</h2>
            <div className="space-y-3">
              {insights.topSkills.map((s) => (
                <div key={s.skill} className="flex items-center gap-3">
                  <div className="w-28 text-xs text-slate-400 shrink-0">{s.skill}</div>
                  <div className="flex-1 h-5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${s.demand}%`,
                        background: s.demand >= 85 ? 'linear-gradient(90deg, #22c55e, #16a34a)' : s.demand >= 70 ? 'linear-gradient(90deg, #3b82f6, #1d4ed8)' : 'linear-gradient(90deg, #8b5cf6, #6d28d9)',
                      }}
                    />
                  </div>
                  <div className="w-16 text-right text-xs text-slate-400">{s.avgSalary}</div>
                  <div className="w-12 text-right">
                    <span className={`text-[10px] font-medium ${s.trend === 'rising' ? 'text-green-400' : 'text-slate-500'}`}>
                      {s.trend === 'rising' ? '↑' : '→'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Salary by Role */}
          <div className="rounded-2xl p-6" style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 className="text-sm font-semibold text-white mb-5">Average Salaries</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left text-xs text-slate-500 pb-3">Role</th>
                    <th className="text-right text-xs text-slate-500 pb-3">Las Vegas</th>
                    <th className="text-right text-xs text-slate-500 pb-3">Remote</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                  {insights.salaryByRole.map((r) => (
                    <tr key={r.role}>
                      <td className="py-3 text-slate-300 text-xs">{r.role}</td>
                      <td className="py-3 text-right text-xs text-blue-300">{r.lasVegas}</td>
                      <td className="py-3 text-right text-xs text-violet-300">{r.remote}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Trending Categories */}
          <div className="rounded-2xl p-6" style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 className="text-sm font-semibold text-white mb-4">Trending Job Categories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {insights.trendingCategories.map((cat) => (
                <div key={cat.category} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-white">{cat.category}</span>
                    <span className="text-xs font-bold text-green-400">{cat.growth}</span>
                  </div>
                  <p className="text-xs text-slate-500">{cat.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Federal Market */}
          <div className="rounded-2xl p-6" style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)' }}>
            <h2 className="text-sm font-semibold text-blue-300 mb-3">🏛️ Federal Cybersecurity Market</h2>
            <p className="text-sm text-slate-400 leading-relaxed">{insights.federalMarket}</p>
          </div>

          {/* Top Companies */}
          <div className="rounded-2xl p-6" style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 className="text-sm font-semibold text-white mb-4">Top Companies Hiring Students</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {insights.topCompaniesHiring.map((co) => (
                <div key={co.company} className="flex items-center gap-3 rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                    style={{ background: 'rgba(59,130,246,0.1)' }}
                  >
                    {co.company[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{co.company}</p>
                    <p className="text-xs text-slate-500">{co.type} · {co.hiring}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
