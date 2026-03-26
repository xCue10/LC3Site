'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CareersNav from '../../components/CareersNav';
import { isCareerAuthed, memberLS, LS_JOBS_CACHE } from '../../types';
import type { Job, SavedJob, Application } from '../../types';

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [saved, setSaved] = useState(false);
  const [applied, setApplied] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!isCareerAuthed()) {
      router.replace('/careers');
      return;
    }
    const decodedId = decodeURIComponent(id);

    // Find job in cache
    const cache = localStorage.getItem(LS_JOBS_CACHE);
    if (cache) {
      try {
        const { jobs } = JSON.parse(cache) as { jobs: Job[] };
        const found = jobs.find((j) => j.id === decodedId);
        if (found) {
          setJob(found);
        } else {
          setNotFound(true);
        }
      } catch { setNotFound(true); }
    } else {
      setNotFound(true);
    }

    // Check saved status
    const keys = memberLS();
    const rawSaved = localStorage.getItem(keys.saved) ?? '[]';
    try {
      const savedJobs = JSON.parse(rawSaved) as SavedJob[];
      setSaved(savedJobs.some((s) => s.id === decodedId));
    } catch {}

    // Check applied status
    const rawApps = localStorage.getItem(keys.apps) ?? '[]';
    try {
      const apps = JSON.parse(rawApps) as Application[];
      setApplied(apps.some((a) => a.jobUrl?.includes(decodedId)));
    } catch {}
  }, [id, router]);

  const toggleSave = () => {
    if (!job) return;
    const keys = memberLS();
    const rawSaved = localStorage.getItem(keys.saved) ?? '[]';
    let savedJobs: SavedJob[] = [];
    try { savedJobs = JSON.parse(rawSaved); } catch {}

    if (saved) {
      savedJobs = savedJobs.filter((s) => s.id !== job.id);
    } else {
      savedJobs = [...savedJobs, { id: job.id, job, savedAt: new Date().toISOString() }];
    }
    localStorage.setItem(keys.saved, JSON.stringify(savedJobs));
    setSaved(!saved);
  };

  const addToTracker = () => {
    if (!job) return;
    const keys = memberLS();
    const rawApps = localStorage.getItem(keys.apps) ?? '[]';
    let apps: Application[] = [];
    try { apps = JSON.parse(rawApps); } catch {}

    const newApp: Application = {
      id: crypto.randomUUID(),
      company: job.company,
      jobTitle: job.title,
      dateApplied: new Date().toISOString().split('T')[0],
      status: 'Saved',
      jobUrl: job.url,
    };
    apps = [...apps, newApp];
    localStorage.setItem(keys.apps, JSON.stringify(apps));
    setApplied(true);
    alert('Added to Application Tracker!');
  };

  if (notFound) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1e]">
        <CareersNav />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <p className="text-4xl mb-4">💼</p>
          <h2 className="text-white font-bold text-xl mb-2">Job not found</h2>
          <p className="text-slate-400 text-sm mb-6">This job may have been removed or the cache expired.</p>
          <Link href="/careers/jobs" className="text-blue-400 hover:text-blue-300 text-sm">← Back to Job Feed</Link>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1e]">
        <CareersNav />
        <div className="max-w-3xl mx-auto px-4 py-12 animate-pulse space-y-4">
          <div className="h-6 w-3/4 rounded" style={{ background: 'rgba(255,255,255,0.08)' }} />
          <div className="h-4 w-1/2 rounded" style={{ background: 'rgba(255,255,255,0.05)' }} />
          <div className="h-40 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)' }} />
        </div>
      </div>
    );
  }

  const matchColor = job.matchScore !== undefined
    ? job.matchScore >= 70 ? '#22c55e' : job.matchScore >= 40 ? '#f59e0b' : '#ef4444'
    : '#6b7280';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1e]">
      <CareersNav />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Back */}
        <Link href="/careers/jobs" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 mb-6 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Jobs
        </Link>

        {/* Header card */}
        <div className="rounded-2xl p-6 mb-6 bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-white/[0.06]">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                {job.jobType.map((t) => (
                  <span key={t} className="text-xs px-2 py-0.5 rounded text-slate-400" style={{ background: 'rgba(255,255,255,0.06)' }}>{t}</span>
                ))}
              </div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{job.title}</h1>
              <p className="text-slate-400">{job.company}</p>
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-500">
                <span>📍 {job.location}</span>
                {job.salary && <span>💰 {job.salary}</span>}
              </div>
            </div>
            {job.matchScore !== undefined && (
              <div className="text-center shrink-0">
                <div className="text-3xl font-black" style={{ color: matchColor }}>{job.matchScore}%</div>
                <div className="text-xs text-slate-500">AI Match</div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mt-6">
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[120px] py-2.5 rounded-xl text-sm font-bold text-center text-white transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
            >
              Apply Now ↗
            </a>
            <Link
              href={`/careers/cover-letter?jobId=${encodeURIComponent(job.id)}`}
              className="flex-1 min-w-[120px] py-2.5 rounded-xl text-sm font-semibold text-center text-white transition-all hover:opacity-90"
              style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.3)' }}
            >
              ✉️ Cover Letter
            </Link>
            <button
              onClick={toggleSave}
              className="py-2.5 px-4 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: saved ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.05)',
                border: saved ? '1px solid rgba(59,130,246,0.4)' : '1px solid rgba(255,255,255,0.08)',
                color: saved ? '#60a5fa' : '#6b7280',
              }}
            >
              {saved ? '★ Saved' : '☆ Save'}
            </button>
            <button
              onClick={addToTracker}
              disabled={applied}
              className="py-2.5 px-4 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
              style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: '#4ade80' }}
            >
              {applied ? '✓ Tracking' : '+ Track'}
            </button>
          </div>
        </div>

        {/* AI Analysis */}
        {(job.matchReason || (job.skillGaps && job.skillGaps.length > 0)) && (
          <div className="rounded-2xl p-6 mb-6 space-y-5 bg-white dark:bg-[#111827] border border-blue-100 dark:border-blue-500/15">
            <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg flex items-center justify-center text-xs" style={{ background: 'rgba(59,130,246,0.2)' }}>AI</span>
              AI Analysis
            </h2>

            {job.matchReason && (
              <div>
                <h3 className="text-xs font-semibold text-green-400 uppercase tracking-wider mb-2">Why you&apos;re a good fit</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{job.matchReason}</p>
              </div>
            )}

            {job.skillGaps && job.skillGaps.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">Skill Gaps</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skillGaps.map((gap) => (
                    <span
                      key={gap}
                      className="px-3 py-1 rounded-lg text-sm text-amber-300"
                      style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}
                    >
                      {gap}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  <Link href="/careers/skills" className="text-blue-400 hover:text-blue-300">View your full skill gap analysis →</Link>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Job Description */}
        <div className="rounded-2xl p-6 bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-white/[0.06]">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Job Description</h2>
          <div className="text-sm text-slate-400 leading-relaxed whitespace-pre-wrap">
            {job.description || 'No description available. Click Apply Now to view the full listing.'}
          </div>
          {job.postedAt && (
            <p className="text-xs text-slate-600 mt-6">Posted: {new Date(job.postedAt).toLocaleDateString()}</p>
          )}
        </div>
      </div>
    </div>
  );
}
