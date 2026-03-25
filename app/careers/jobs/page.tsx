'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CareersNav from '../components/CareersNav';
import { LS_AUTH, LS_PROFILE, LS_SAVED, LS_JOBS_CACHE, JOB_TYPES, INDUSTRIES } from '../types';
import type { Job, CareerProfile, SavedJob } from '../types';

function MatchBadge({ score }: { score?: number }) {
  if (score === undefined) return null;
  const color = score >= 70 ? '#22c55e' : score >= 40 ? '#f59e0b' : '#ef4444';
  const bg = score >= 70 ? 'rgba(34,197,94,0.1)' : score >= 40 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)';
  return (
    <span className="text-xs font-bold px-2 py-1 rounded-lg" style={{ color, background: bg, border: `1px solid ${color}33` }}>
      {score}% match
    </span>
  );
}

function JobCard({ job, onSave, saved }: { job: Job; onSave: (job: Job) => void; saved: boolean }) {
  const sourceColors: Record<string, string> = {
    usajobs: '#3b82f6',
    remotive: '#8b5cf6',
    arbeitnow: '#f59e0b',
  };
  const sourceLabels: Record<string, string> = {
    usajobs: 'Federal',
    remotive: 'Remote',
    arbeitnow: 'Tech',
  };

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3 transition-all hover:scale-[1.01] hover:border-white/20"
      style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span
              className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
              style={{ background: `${sourceColors[job.source]}22`, color: sourceColors[job.source] }}
            >
              {sourceLabels[job.source]}
            </span>
            {job.jobType.map((t) => (
              <span key={t} className="text-[10px] px-1.5 py-0.5 rounded text-slate-500" style={{ background: 'rgba(255,255,255,0.05)' }}>{t}</span>
            ))}
          </div>
          <h3 className="font-semibold text-white text-sm leading-snug line-clamp-2">{job.title}</h3>
          <p className="text-slate-400 text-xs mt-0.5">{job.company}</p>
        </div>
        <MatchBadge score={job.matchScore} />
      </div>

      <div className="flex items-center gap-3 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {job.location}
        </span>
        {job.salary && (
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {job.salary}
          </span>
        )}
      </div>

      {job.matchReason && (
        <p className="text-xs text-slate-400 leading-relaxed border-l-2 border-blue-500/30 pl-3 italic">
          {job.matchReason}
        </p>
      )}

      {job.skillGaps && job.skillGaps.length > 0 && (
        <div className="flex flex-wrap gap-1">
          <span className="text-[10px] text-slate-600">Skill gaps:</span>
          {job.skillGaps.map((gap) => (
            <span key={gap} className="text-[10px] px-1.5 py-0.5 rounded text-amber-400" style={{ background: 'rgba(245,158,11,0.08)' }}>{gap}</span>
          ))}
        </div>
      )}

      <div className="flex gap-2 mt-1">
        <Link
          href={`/careers/jobs/${encodeURIComponent(job.id)}`}
          className="flex-1 py-2 rounded-xl text-xs font-semibold text-center text-white transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
        >
          View Details
        </Link>
        <button
          onClick={() => onSave(job)}
          className="p-2 rounded-xl transition-all hover:scale-105"
          style={{
            background: saved ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
          title={saved ? 'Saved' : 'Save job'}
        >
          <svg className="w-4 h-4" fill={saved ? '#3b82f6' : 'none'} viewBox="0 0 24 24" stroke={saved ? '#3b82f6' : '#6b7280'} strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-xl transition-all hover:scale-105"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
          title="Apply"
        >
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl p-5 animate-pulse" style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex gap-2 mb-2">
        <div className="h-4 w-12 rounded" style={{ background: 'rgba(255,255,255,0.08)' }} />
        <div className="h-4 w-16 rounded" style={{ background: 'rgba(255,255,255,0.05)' }} />
      </div>
      <div className="h-4 w-3/4 rounded mb-1.5" style={{ background: 'rgba(255,255,255,0.08)' }} />
      <div className="h-3 w-1/2 rounded mb-4" style={{ background: 'rgba(255,255,255,0.05)' }} />
      <div className="h-3 w-full rounded mb-1" style={{ background: 'rgba(255,255,255,0.05)' }} />
      <div className="h-3 w-5/6 rounded mb-4" style={{ background: 'rgba(255,255,255,0.04)' }} />
      <div className="flex gap-2">
        <div className="h-8 flex-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)' }} />
        <div className="h-8 w-8 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }} />
        <div className="h-8 w-8 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }} />
      </div>
    </div>
  );
}

export default function JobFeedPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [profile, setProfile] = useState<CareerProfile | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterScore, setFilterScore] = useState(0);
  const [filterIndustry, setFilterIndustry] = useState('');
  const [page, setPage] = useState(1);
  const [fetchedAt, setFetchedAt] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const PER_PAGE = 12;

  useEffect(() => {
    if (localStorage.getItem(LS_AUTH) !== 'true') {
      router.replace('/careers');
      return;
    }
    const rawProfile = localStorage.getItem(LS_PROFILE);
    if (rawProfile) {
      try { setProfile(JSON.parse(rawProfile)); } catch {}
    }
    const rawSaved = localStorage.getItem(LS_SAVED);
    if (rawSaved) {
      try {
        const saved = JSON.parse(rawSaved) as SavedJob[];
        setSavedIds(new Set(saved.map((s) => s.id)));
      } catch {}
    }
  }, [router]);

  const loadJobs = useCallback(async (force = false) => {
    if (!force) {
      const cached = localStorage.getItem(LS_JOBS_CACHE);
      if (cached) {
        try {
          const { jobs: cachedJobs, fetchedAt: cachedAt } = JSON.parse(cached) as { jobs: Job[]; fetchedAt: number };
          if (Date.now() - cachedAt < 30 * 60 * 1000) {
            setJobs(cachedJobs);
            setFetchedAt(cachedAt);
            setLoading(false);
            return;
          }
        } catch {}
      }
    }

    setLoading(true);
    try {
      const res = await fetch('/api/careers/jobs');
      if (res.ok) {
        const data = await res.json() as { jobs: Job[]; fetchedAt: number };
        setFetchedAt(data.fetchedAt);

        // Analyze with AI if profile exists
        const rawProfile = localStorage.getItem(LS_PROFILE);
        if (rawProfile) {
          const p = JSON.parse(rawProfile) as CareerProfile;
          setLoading(false);
          setJobs(data.jobs);
          setAnalyzing(true);
          try {
            const matchRes = await fetch('/api/careers/match', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ profile: p, jobs: data.jobs }),
            });
            if (matchRes.ok) {
              const { jobs: enriched } = await matchRes.json() as { jobs: Job[] };
              setJobs(enriched);
              localStorage.setItem(LS_JOBS_CACHE, JSON.stringify({ jobs: enriched, fetchedAt: data.fetchedAt }));
            }
          } catch {}
          setAnalyzing(false);
        } else {
          setJobs(data.jobs);
          setLoading(false);
        }
      }
    } catch {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const toggleSave = (job: Job) => {
    const rawSaved = localStorage.getItem(LS_SAVED) ?? '[]';
    let saved: SavedJob[] = [];
    try { saved = JSON.parse(rawSaved); } catch {}

    if (savedIds.has(job.id)) {
      saved = saved.filter((s) => s.id !== job.id);
      setSavedIds((prev) => { const next = new Set(prev); next.delete(job.id); return next; });
    } else {
      saved = [...saved, { id: job.id, job, savedAt: new Date().toISOString() }];
      setSavedIds((prev) => new Set([...prev, job.id]));
      // Check achievement
      const rawProfile = localStorage.getItem(LS_PROFILE);
      if (rawProfile) {
        try {
          const p = JSON.parse(rawProfile) as CareerProfile;
          if (!p.achievements.includes('First Save')) {
            p.achievements.push('First Save');
            localStorage.setItem(LS_PROFILE, JSON.stringify(p));
          }
          if (job.matchScore !== undefined && job.matchScore >= 95 && !p.achievements.includes('Perfect Match')) {
            p.achievements.push('Perfect Match');
            localStorage.setItem(LS_PROFILE, JSON.stringify(p));
          }
        } catch {}
      }
    }
    localStorage.setItem(LS_SAVED, JSON.stringify(saved));
  };

  const filtered = jobs.filter((j) => {
    if (search && !j.title.toLowerCase().includes(search.toLowerCase()) && !j.company.toLowerCase().includes(search.toLowerCase()) && !j.description.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterType && !j.jobType.includes(filterType)) return false;
    if (filterScore && (j.matchScore ?? 0) < filterScore) return false;
    return true;
  });

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  return (
    <div style={{ background: '#0a0f1e', minHeight: '100vh' }}>
      <CareersNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-white">Job Feed</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {loading ? 'Fetching jobs...' : `${filtered.length} jobs found`}
              {fetchedAt && !loading && (
                <span className="ml-2">· Updated {new Date(fetchedAt).toLocaleTimeString()}</span>
              )}
              {analyzing && <span className="ml-2 text-blue-400">· AI scoring...</span>}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="sm:hidden px-3 py-2 rounded-xl text-xs text-slate-400 transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              Filters
            </button>
            <button
              onClick={() => loadJobs(true)}
              disabled={loading}
              className="px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition-all disabled:opacity-50"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              ↻ Refresh
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search jobs by title, company, or keyword..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none"
            style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)' }}
          />
        </div>

        <div className="flex gap-6">
          {/* Sidebar filters */}
          <aside className={`${sidebarOpen ? 'block' : 'hidden'} sm:block w-56 shrink-0 space-y-5`}>
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Job Type</h3>
              <div className="space-y-1">
                <button
                  onClick={() => { setFilterType(''); setPage(1); }}
                  className="w-full text-left text-xs px-3 py-2 rounded-lg transition-all"
                  style={{ background: !filterType ? 'rgba(59,130,246,0.15)' : 'transparent', color: !filterType ? '#60a5fa' : '#6b7280' }}
                >
                  All Types
                </button>
                {JOB_TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() => { setFilterType(t); setPage(1); }}
                    className="w-full text-left text-xs px-3 py-2 rounded-lg transition-all"
                    style={{ background: filterType === t ? 'rgba(59,130,246,0.15)' : 'transparent', color: filterType === t ? '#60a5fa' : '#6b7280' }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Min Match: {filterScore}%
              </h3>
              <input
                type="range" min="0" max="90" step="10"
                value={filterScore}
                onChange={(e) => { setFilterScore(Number(e.target.value)); setPage(1); }}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-slate-600 mt-1">
                <span>Any</span><span>90%+</span>
              </div>
            </div>
          </aside>

          {/* Job grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : paginated.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-4xl mb-4">🔍</div>
                <p className="text-slate-400 font-medium">No jobs match your filters</p>
                <p className="text-slate-600 text-sm mt-1">Try adjusting your search or filters</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paginated.map((job) => (
                    <JobCard key={job.id} job={job} onSave={toggleSave} saved={savedIds.has(job.id)} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 rounded-xl text-sm text-slate-400 disabled:opacity-30 transition-all hover:text-white"
                      style={{ background: 'rgba(255,255,255,0.05)' }}
                    >
                      ←
                    </button>
                    <span className="px-4 py-2 text-sm text-slate-400">
                      {page} / {totalPages}
                    </span>
                    <button
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 rounded-xl text-sm text-slate-400 disabled:opacity-30 transition-all hover:text-white"
                      style={{ background: 'rgba(255,255,255,0.05)' }}
                    >
                      →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
