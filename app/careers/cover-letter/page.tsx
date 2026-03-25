'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import CareersNav from '../components/CareersNav';
import { isCareerAuthed, memberLS, LS_JOBS_CACHE } from '../types';
import type { CareerProfile, Job } from '../types';

function CoverLetterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get('jobId');

  const [profile, setProfile] = useState<CareerProfile | null>(null);
  const [job, setJob] = useState<Job | null>(null);
  const [tone, setTone] = useState<'Professional' | 'Enthusiastic' | 'Concise'>('Professional');
  const [letter, setLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState(jobId ?? '');

  useEffect(() => {
    if (!isCareerAuthed()) { router.replace('/careers'); return; }
    const raw = localStorage.getItem(memberLS().profile);
    if (raw) { try { setProfile(JSON.parse(raw)); } catch {} }

    const cache = localStorage.getItem(LS_JOBS_CACHE);
    if (cache) {
      try {
        const { jobs: cachedJobs } = JSON.parse(cache) as { jobs: Job[] };
        setJobs(cachedJobs);
        if (jobId) {
          const found = cachedJobs.find((j) => j.id === decodeURIComponent(jobId));
          if (found) setJob(found);
        }
      } catch {}
    }
  }, [router, jobId]);

  const handleJobSelect = (id: string) => {
    setSelectedJobId(id);
    const found = jobs.find((j) => j.id === id);
    setJob(found ?? null);
    setLetter('');
  };

  const generate = async () => {
    if (!profile || !job) { setError('Please select a job first'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/careers/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, job, tone }),
      });
      if (res.ok) {
        const { letter: generated } = await res.json() as { letter: string };
        setLetter(generated);
        // Achievement
        const profileKey = memberLS().profile;
        const rawProfile = localStorage.getItem(profileKey);
        if (rawProfile) {
          const p = JSON.parse(rawProfile) as CareerProfile;
          if (!p.achievements.includes('Cover Letter Pro')) {
            p.achievements.push('Cover Letter Pro');
            localStorage.setItem(profileKey, JSON.stringify(p));
          }
        }
      } else {
        setError('Failed to generate. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadPDF = () => {
    const blob = new Blob([letter], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cover-letter-${job?.company?.replace(/\s+/g, '-').toLowerCase() ?? 'draft'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ background: '#0a0f1e', minHeight: '100vh' }}>
      <CareersNav />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-xl font-bold text-white mb-2">Cover Letter Generator</h1>
        <p className="text-slate-400 text-sm mb-8">AI-generated, personalized to your profile and the job</p>

        <div className="space-y-5">
          {/* Job selector */}
          <div className="rounded-2xl p-5" style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)' }}>
            <label className="block text-sm font-medium text-slate-300 mb-2">Select a Job</label>
            {jobs.length === 0 ? (
              <p className="text-slate-500 text-sm">No jobs loaded. <a href="/careers/jobs" className="text-blue-400">Visit Job Feed first</a></p>
            ) : (
              <select
                value={selectedJobId}
                onChange={(e) => handleJobSelect(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm text-white focus:outline-none"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <option value="">Choose a job...</option>
                {jobs.slice(0, 50).map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title} — {j.company}
                  </option>
                ))}
              </select>
            )}
            {job && (
              <div className="mt-3 text-xs text-slate-500">
                {job.title} · {job.company} · {job.location}
                {job.matchScore !== undefined && <span className="ml-2 text-green-400">{job.matchScore}% match</span>}
              </div>
            )}
          </div>

          {/* Tone selector */}
          <div className="rounded-2xl p-5" style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)' }}>
            <label className="block text-sm font-medium text-slate-300 mb-3">Tone</label>
            <div className="flex gap-3">
              {(['Professional', 'Enthusiastic', 'Concise'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={{
                    background: tone === t ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'rgba(255,255,255,0.05)',
                    color: tone === t ? '#fff' : '#6b7280',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={generate}
            disabled={loading || !job || !profile}
            className="w-full py-4 rounded-2xl text-base font-bold text-white transition-all hover:opacity-90 disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', boxShadow: loading ? 'none' : '0 0 30px rgba(59,130,246,0.3)' }}
          >
            {loading ? 'Generating with Claude AI...' : '✨ Generate Cover Letter'}
          </button>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          {/* Letter output */}
          {letter && (
            <div className="rounded-2xl overflow-hidden" style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-sm font-medium text-slate-300">Generated Cover Letter</span>
                <div className="flex gap-2">
                  <button
                    onClick={copy}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{
                      background: copied ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.05)',
                      color: copied ? '#4ade80' : '#6b7280',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    {copied ? '✓ Copied' : 'Copy'}
                  </button>
                  <button
                    onClick={downloadPDF}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white transition-all"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    Download
                  </button>
                  <button
                    onClick={generate}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-blue-400 hover:text-blue-300 transition-all"
                    style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}
                  >
                    Regenerate
                  </button>
                </div>
              </div>
              <textarea
                value={letter}
                onChange={(e) => setLetter(e.target.value)}
                rows={20}
                className="w-full px-5 py-4 text-sm text-slate-300 font-mono leading-relaxed focus:outline-none resize-none"
                style={{ background: 'transparent' }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CoverLetterPage() {
  return (
    <Suspense fallback={<div style={{ background: '#0a0f1e', minHeight: '100vh' }} />}>
      <CoverLetterContent />
    </Suspense>
  );
}
