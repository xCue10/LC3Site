'use client';

import { useState, useEffect } from 'react';
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
  const [error, setError] = useState('');

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
    <div style={{ background: '#0a0f1e', minHeight: '100vh' }}>
      <CareersNav />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-xl font-bold text-white mb-2">Resume Analyzer</h1>
        <p className="text-slate-400 text-sm mb-8">Get AI-powered feedback on your resume with ATS score and improvement suggestions</p>

        <div className="space-y-5">
          {/* Target role */}
          <div className="rounded-2xl p-5" style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)' }}>
            <label className="block text-sm font-medium text-slate-300 mb-2">Target Role <span className="text-slate-600">(optional)</span></label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Cybersecurity Analyst, Software Engineer..."
              className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none"
              style={inputStyle}
            />
          </div>

          {/* Resume input */}
          <div className="rounded-2xl p-5" style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)' }}>
            <label className="block text-sm font-medium text-slate-300 mb-2">Resume Text</label>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              rows={12}
              placeholder="Paste your resume text here (copy from your Word doc or PDF)..."
              className="w-full px-4 py-3 rounded-xl text-xs text-slate-300 placeholder-slate-600 focus:outline-none resize-none font-mono leading-relaxed"
              style={inputStyle}
            />
            <p className="text-xs text-slate-600 mt-2">{resumeText.length} characters</p>
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
              <div className="rounded-2xl p-6 flex items-center gap-8 flex-wrap" style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)' }}>
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
                <div className="rounded-2xl p-5" style={{ background: '#111827', border: '1px solid rgba(34,197,94,0.15)' }}>
                  <h3 className="text-sm font-semibold text-green-400 mb-3">✓ Strengths</h3>
                  <ul className="space-y-2">
                    {analysis.strengths.map((s, i) => (
                      <li key={i} className="text-xs text-slate-300 flex gap-2">
                        <span className="text-green-500 shrink-0">•</span>{s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl p-5" style={{ background: '#111827', border: '1px solid rgba(239,68,68,0.15)' }}>
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
                <div className="rounded-2xl p-5" style={{ background: '#111827', border: '1px solid rgba(245,158,11,0.15)' }}>
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
                <div className="rounded-2xl p-5 space-y-4" style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <h3 className="text-sm font-semibold text-white">Section Feedback</h3>
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
                <div className="rounded-2xl p-5 space-y-4" style={{ background: '#111827', border: '1px solid rgba(139,92,246,0.15)' }}>
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
