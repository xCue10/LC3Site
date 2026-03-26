'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import CareersNav from '../components/CareersNav';
import { isCareerAuthed, memberLS } from '../types';
import type { CareerProfile } from '../types';

interface ResumeAnalysis {
  overallScore: string;
  atsScore: number;
  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
  extractedSkills: string[];
  improvedBullets: { original: string; improved: string }[];
  sectionFeedback: Record<string, string>;
  overallFeedback: string;
}

function ScoreBadge({ score }: { score: string }) {
  const colors: Record<string, string> = {
    'A+': '#22c55e', 'A': '#22c55e', 'A-': '#22c55e',
    'B+': '#84cc16', 'B': '#84cc16', 'B-': '#a3e635',
    'C+': '#f59e0b', 'C': '#f59e0b', 'C-': '#f97316',
    'D+': '#ef4444', 'D': '#ef4444', 'D-': '#ef4444',
    'F': '#dc2626',
  };
  const color = colors[score] ?? '#6b7280';
  return (
    <div className="text-center">
      <div className="text-5xl font-black" style={{ color }}>{score}</div>
      <div className="text-xs text-slate-500 mt-1">Resume Grade</div>
    </div>
  );
}

export default function ResumePage() {
  const router = useRouter();
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isCareerAuthed()) { router.replace('/careers'); return; }
    const raw = localStorage.getItem(memberLS().profile);
    if (raw) {
      try {
        const p = JSON.parse(raw) as CareerProfile;
        if (p.resumeText) setResumeText(p.resumeText);
      } catch {}
    }
  }, [router]);

  const handleFile = async (file: File) => {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/careers/resume-upload', { method: 'POST', body: form });
      const data = await res.json() as { text?: string; error?: string };
      if (res.ok && data.text) {
        setResumeText(data.text);
        setUploadedFileName(file.name);
      } else {
        setError(data.error ?? 'Failed to read file.');
      }
    } catch {
      setError('Failed to read file. Please try again.');
    }
    setUploading(false);
  };

  const analyze = async () => {
    if (!resumeText.trim()) { setError('Please paste your resume text first'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/careers/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, targetRole }),
      });
      if (res.ok) {
        const data = await res.json() as ResumeAnalysis;
        setAnalysis(data);
        // Save skills to profile and achievement
        const profileKey = memberLS().profile;
        const rawProfile = localStorage.getItem(profileKey);
        if (rawProfile) {
          const p = JSON.parse(rawProfile) as CareerProfile;
          if (!p.achievements.includes('Resume Pro')) {
            p.achievements.push('Resume Pro');
          }
          if (data.extractedSkills?.length) {
            const newSkills = data.extractedSkills
              .filter((s) => !p.skills.find((ps) => ps.name.toLowerCase() === s.toLowerCase()))
              .map((s) => ({ name: s, level: 'Beginner' as const }));
            p.skills = [...p.skills, ...newSkills];
          }
          p.resumeText = resumeText;
          localStorage.setItem(profileKey, JSON.stringify(p));
        }
      } else {
        setError('Analysis failed. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  const inputStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1e]">
      <CareersNav />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Resume Analyzer</h1>
        <p className="text-slate-400 text-sm mb-8">Get AI-powered feedback on your resume with ATS score and improvement suggestions</p>

        <div className="space-y-5">
          {/* Target role */}
          <div className="rounded-2xl p-5 bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-white/[0.06]">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Target Role <span className="text-slate-600">(optional)</span></label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Cybersecurity Analyst, Software Engineer..."
              className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none"
              style={inputStyle}
            />
          </div>

          {/* Resume upload */}
          <div className="rounded-2xl p-5 bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-white/[0.06]">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Resume</label>

            {/* Drop zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
              className="flex flex-col items-center justify-center gap-3 rounded-xl py-8 px-4 cursor-pointer transition-all mb-4"
              style={{
                border: `2px dashed ${dragOver ? 'rgba(59,130,246,0.6)' : 'rgba(255,255,255,0.1)'}`,
                background: dragOver ? 'rgba(59,130,246,0.05)' : 'rgba(255,255,255,0.02)',
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
              />
              {uploading ? (
                <div className="w-5 h-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
              ) : (
                <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              )}
              <div className="text-center">
                {uploadedFileName ? (
                  <>
                    <p className="text-sm font-medium text-green-400">✓ {uploadedFileName}</p>
                    <p className="text-xs text-slate-500 mt-1">Click to replace</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium text-slate-300">Upload your resume</p>
                    <p className="text-xs text-slate-500 mt-1">PDF or TXT · drag & drop or click</p>
                  </>
                )}
              </div>
            </div>

            {/* Fallback paste */}
            <details className="group">
              <summary className="text-xs text-slate-500 cursor-pointer hover:text-slate-400 transition-colors select-none">
                Or paste text manually
              </summary>
              <textarea
                value={resumeText}
                onChange={(e) => { setResumeText(e.target.value); setUploadedFileName(''); }}
                rows={10}
                placeholder="Paste your resume text here..."
                className="w-full mt-3 px-4 py-3 rounded-xl text-xs text-slate-300 placeholder-slate-600 focus:outline-none resize-none font-mono leading-relaxed"
                style={inputStyle}
              />
            </details>
            {resumeText && <p className="text-xs text-slate-600 mt-2">{resumeText.length} characters extracted</p>}
          </div>

          <button
            onClick={analyze}
            disabled={loading || !resumeText.trim()}
            className="w-full py-4 rounded-2xl text-base font-bold text-white transition-all hover:opacity-90 disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', boxShadow: '0 0 30px rgba(59,130,246,0.2)' }}
          >
            {loading ? '🔍 Analyzing with Claude AI...' : '📊 Analyze Resume'}
          </button>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          {analysis && (
            <div className="space-y-4">
              {/* Score overview */}
              <div className="rounded-2xl p-6 flex items-center gap-8 flex-wrap bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-white/[0.06]">
                <ScoreBadge score={analysis.overallScore} />
                <div className="flex-1 min-w-48">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">ATS Compatibility</span>
                    <span className="text-sm font-bold" style={{ color: analysis.atsScore >= 70 ? '#22c55e' : analysis.atsScore >= 50 ? '#f59e0b' : '#ef4444' }}>
                      {analysis.atsScore}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${analysis.atsScore}%`,
                        background: analysis.atsScore >= 70 ? '#22c55e' : analysis.atsScore >= 50 ? '#f59e0b' : '#ef4444',
                      }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-3 leading-relaxed">{analysis.overallFeedback}</p>
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl p-5 bg-white dark:bg-[#111827] border border-green-200/80 dark:border-[rgba(34,197,94,0.15)]">
                  <h3 className="text-sm font-semibold text-green-400 mb-3">✓ Strengths</h3>
                  <ul className="space-y-2">
                    {analysis.strengths.map((s, i) => (
                      <li key={i} className="text-xs text-slate-300 flex gap-2">
                        <span className="text-green-500 shrink-0">•</span>{s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl p-5 bg-white dark:bg-[#111827] border border-red-200/80 dark:border-[rgba(239,68,68,0.15)]">
                  <h3 className="text-sm font-semibold text-red-400 mb-3">✗ Weaknesses</h3>
                  <ul className="space-y-2">
                    {analysis.weaknesses.map((w, i) => (
                      <li key={i} className="text-xs text-slate-300 flex gap-2">
                        <span className="text-red-500 shrink-0">•</span>{w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Missing Keywords */}
              {analysis.missingKeywords?.length > 0 && (
                <div className="rounded-2xl p-5 bg-white dark:bg-[#111827] border border-amber-200/80 dark:border-[rgba(245,158,11,0.15)]">
                  <h3 className="text-sm font-semibold text-amber-400 mb-3">Missing Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missingKeywords.map((kw) => (
                      <span key={kw} className="px-2.5 py-1 rounded-lg text-xs text-amber-300" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Section Feedback */}
              {analysis.sectionFeedback && Object.keys(analysis.sectionFeedback).length > 0 && (
                <div className="rounded-2xl p-5 space-y-4 bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-white/[0.06]">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Section Feedback</h3>
                  {Object.entries(analysis.sectionFeedback).map(([section, feedback]) => (
                    feedback && (
                      <div key={section}>
                        <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1 capitalize">{section}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">{feedback}</p>
                      </div>
                    )
                  ))}
                </div>
              )}

              {/* Improved bullets */}
              {analysis.improvedBullets?.length > 0 && (
                <div className="rounded-2xl p-5 space-y-4 bg-white dark:bg-[#111827] border border-violet-200/80 dark:border-[rgba(139,92,246,0.15)]">
                  <h3 className="text-sm font-semibold text-violet-400">Stronger Bullet Points</h3>
                  {analysis.improvedBullets.map((b, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex gap-2 text-xs text-red-300/70 line-through">
                        <span>✗</span><span>{b.original}</span>
                      </div>
                      <div className="flex gap-2 text-xs text-green-300">
                        <span>✓</span><span>{b.improved}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
