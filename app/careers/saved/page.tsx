'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CareersNav from '../components/CareersNav';
import { isCareerAuthed, memberLS } from '../types';
import type { SavedJob } from '../types';

export default function SavedJobsPage() {
  const router = useRouter();
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesValues, setNotesValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isCareerAuthed()) { router.replace('/careers'); return; }
    const raw = localStorage.getItem(memberLS().saved) ?? '[]';
    try {
      const jobs = JSON.parse(raw) as SavedJob[];
      setSavedJobs(jobs);
      const notes: Record<string, string> = {};
      jobs.forEach((j) => { notes[j.id] = j.notes ?? ''; });
      setNotesValues(notes);
    } catch {}
  }, [router]);

  const removeJob = (id: string) => {
    const updated = savedJobs.filter((j) => j.id !== id);
    setSavedJobs(updated);
    localStorage.setItem(memberLS().saved, JSON.stringify(updated));
  };

  const saveNotes = (id: string) => {
    const updated = savedJobs.map((j) => j.id === id ? { ...j, notes: notesValues[id] } : j);
    setSavedJobs(updated);
    localStorage.setItem(memberLS().saved, JSON.stringify(updated));
    setEditingNotes(null);
  };

  const matchColor = (score?: number) =>
    score === undefined ? '#6b7280' : score >= 70 ? '#22c55e' : score >= 40 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ background: '#0a0f1e', minHeight: '100vh' }}>
      <CareersNav />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-xl font-bold text-white mb-2">Saved Jobs</h1>
        <p className="text-slate-400 text-sm mb-8">{savedJobs.length} saved job{savedJobs.length !== 1 ? 's' : ''}</p>

        {savedJobs.length === 0 ? (
          <div className="text-center py-20 rounded-2xl" style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-4xl mb-4">★</div>
            <p className="text-slate-400 font-medium">No saved jobs yet</p>
            <p className="text-slate-600 text-sm mt-1 mb-6">Bookmark jobs from the Job Feed</p>
            <Link
              href="/careers/jobs"
              className="px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
            >
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {savedJobs.map((saved) => {
              const job = saved.job;
              const score = job.matchScore;
              return (
                <div
                  key={saved.id}
                  className="rounded-2xl p-5 flex flex-col gap-3"
                  style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white text-sm leading-snug truncate">{job.title}</h3>
                      <p className="text-slate-400 text-xs mt-0.5">{job.company}</p>
                      <p className="text-slate-600 text-xs mt-0.5">📍 {job.location}</p>
                    </div>
                    {score !== undefined && (
                      <span className="text-xs font-bold px-2 py-1 rounded-lg shrink-0" style={{ color: matchColor(score), background: `${matchColor(score)}18` }}>
                        {score}%
                      </span>
                    )}
                  </div>

                  {job.matchReason && (
                    <p className="text-xs text-slate-500 leading-relaxed italic border-l-2 pl-3" style={{ borderColor: 'rgba(59,130,246,0.3)' }}>
                      {job.matchReason}
                    </p>
                  )}

                  {/* Notes */}
                  {editingNotes === saved.id ? (
                    <div>
                      <textarea
                        value={notesValues[saved.id] ?? ''}
                        onChange={(e) => setNotesValues((n) => ({ ...n, [saved.id]: e.target.value }))}
                        rows={2}
                        placeholder="Add a note..."
                        className="w-full px-3 py-2 rounded-xl text-xs text-slate-300 placeholder-slate-600 focus:outline-none resize-none mb-2"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                      />
                      <div className="flex gap-2">
                        <button onClick={() => saveNotes(saved.id)} className="text-xs px-3 py-1.5 rounded-lg text-white font-medium" style={{ background: 'rgba(59,130,246,0.3)' }}>Save</button>
                        <button onClick={() => setEditingNotes(null)} className="text-xs text-slate-500">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditingNotes(saved.id)}
                      className="text-left text-xs text-slate-600 hover:text-slate-400 transition-colors"
                    >
                      {notesValues[saved.id] ? `📝 ${notesValues[saved.id]}` : '+ Add note'}
                    </button>
                  )}

                  <div className="text-xs text-slate-600">
                    Saved {new Date(saved.savedAt).toLocaleDateString()}
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/careers/jobs/${encodeURIComponent(job.id)}`}
                      className="flex-1 py-2 rounded-xl text-xs font-semibold text-center text-white transition-all hover:opacity-90"
                      style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
                    >
                      View Details
                    </Link>
                    <Link
                      href={`/careers/cover-letter?jobId=${encodeURIComponent(job.id)}`}
                      className="flex-1 py-2 rounded-xl text-xs font-semibold text-center text-violet-300 transition-all hover:opacity-90"
                      style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)' }}
                    >
                      Cover Letter
                    </Link>
                    <button
                      onClick={() => removeJob(saved.id)}
                      className="p-2 rounded-xl transition-all hover:scale-105 text-red-500/60 hover:text-red-400"
                      style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.1)' }}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
