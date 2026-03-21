'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadUserData, consumeScan } from '@/lib/shield-storage';
import ShieldScannerLayout from '@/app/shield/components/ShieldScannerLayout';
import { ClipboardCheck, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { OWASP_QUESTIONS } from '@/lib/owasp-questions';

type Answer = 'yes' | 'no' | 'unsure';

const CATEGORIES = [
  'Broken Access Control',
  'Cryptographic Failures',
  'Injection',
  'Insecure Design',
  'Security Misconfiguration',
  'Vulnerable Components',
  'Authentication Failures',
  'Data Integrity Failures',
  'Logging Failures',
  'SSRF',
];

export default function OwaspPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'beginner' | 'advanced'>('beginner');
  const [activeCategory, setActiveCategory] = useState(0);

  useEffect(() => {
    const data = loadUserData();
    if (!data) { router.push('/shield/login'); return; }
    setMode(data.mode);
  }, [router]);

  const setAnswer = (id: string, answer: Answer) => {
    setAnswers(prev => ({ ...prev, [id]: answer }));
  };

  const categoryQuestions = OWASP_QUESTIONS.filter(q => q.category === CATEGORIES[activeCategory]);
  const totalAnswered = Object.keys(answers).length;
  const totalQuestions = OWASP_QUESTIONS.length;
  const progress = Math.round((totalAnswered / totalQuestions) * 100);

  const handleSubmit = async () => {
    if (totalAnswered < totalQuestions) {
      if (!confirm(`You've answered ${totalAnswered}/${totalQuestions} questions. Submit anyway? Unanswered questions will be treated as "unsure".`)) return;
    }

    if (!consumeScan()) {
      setError('Daily scan limit reached (10 scans/day). Come back tomorrow!');
      setSubmitting(false);
      return;
    }
    setSubmitting(true);
    const finalAnswers = { ...answers };
    OWASP_QUESTIONS.forEach(q => {
      if (!finalAnswers[q.id]) finalAnswers[q.id] = 'unsure';
    });

    try {
      const res = await fetch('/api/shield/owasp-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: finalAnswers, mode }),
      });

      if (!res.ok) throw new Error('Analysis failed');
      const data = await res.json();
      sessionStorage.setItem('lc3shield_pending_result', JSON.stringify(data.result));
      router.push('/shield/results');
    } catch {
      setSubmitting(false);
      alert('Analysis failed. Please try again.');
    }
  };

  const SEVERITY_STYLES: Record<string, { bg: string; color: string }> = {
    Critical: { bg: 'rgba(239,68,68,0.1)', color: '#f87171' },
    High: { bg: 'rgba(249,115,22,0.1)', color: '#fb923c' },
    Medium: { bg: 'rgba(234,179,8,0.1)', color: '#fbbf24' },
    Low: { bg: 'rgba(59,130,246,0.1)', color: '#60a5fa' },
  };

  const ANSWER_STYLES: Record<Answer, { bg: string; border: string; color: string }> = {
    yes: { bg: 'rgba(34,197,94,0.1)', border: '#22c55e', color: '#4ade80' },
    no: { bg: 'rgba(239,68,68,0.1)', border: '#ef4444', color: '#f87171' },
    unsure: { bg: 'rgba(234,179,8,0.1)', border: '#eab308', color: '#fbbf24' },
  };

  return (
    <ShieldScannerLayout
      title="OWASP Top 10 Checklist"
      description="Interactive self-assessment covering all 10 OWASP Top 10 security risks with AI-powered analysis."
      icon={ClipboardCheck}
     
    >
      <div className="space-y-4">
        {/* Progress */}
        <div className="rounded-xl p-4" style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex justify-between text-sm mb-2">
            <span style={{ color: '#64748b' }}>Progress</span>
            <span className="font-medium" style={{ color: '#e2e8f0' }}>{totalAnswered}/{totalQuestions} answered</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #3b82f6, #22c55e)' }}
            />
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {CATEGORIES.map((cat, i) => {
            const catQuestions = OWASP_QUESTIONS.filter(q => q.category === cat);
            const catAnswered = catQuestions.filter(q => answers[q.id]).length;
            const allDone = catAnswered === catQuestions.length;

            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(i)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0"
                style={
                  activeCategory === i
                    ? { background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: '#fff' }
                    : allDone
                    ? { background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', color: '#4ade80' }
                    : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b' }
                }
              >
                <span className="opacity-60">A0{i + 1}</span>
                {cat.split(' ').slice(0, 2).join(' ')}
                {allDone && <span>✓</span>}
                {catAnswered > 0 && !allDone && <span className="opacity-60">({catAnswered}/{catQuestions.length})</span>}
              </button>
            );
          })}
        </div>

        {/* Current category */}
        <div className="rounded-2xl p-6" style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3 mb-4">
            <span
              className="px-3 py-1 text-xs font-bold rounded-full"
              style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#60a5fa' }}
            >
              A0{activeCategory + 1}
            </span>
            <h2 className="text-lg font-bold" style={{ color: '#e2e8f0' }}>{CATEGORIES[activeCategory]}</h2>
          </div>

          <div className="space-y-4">
            {categoryQuestions.map((q) => {
              const sevStyle = SEVERITY_STYLES[q.failSeverity] || SEVERITY_STYLES['Low'];
              return (
                <div
                  key={q.id}
                  className="p-4 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded shrink-0 mt-0.5"
                      style={{ background: sevStyle.bg, color: sevStyle.color }}
                    >
                      {q.failSeverity}
                    </span>
                    <p className="text-sm" style={{ color: '#c4cfe8' }}>{q.question}</p>
                  </div>
                  <div className="flex gap-2">
                    {(['yes', 'no', 'unsure'] as Answer[]).map((ans) => {
                      const isSelected = answers[q.id] === ans;
                      const ansStyle = ANSWER_STYLES[ans];
                      return (
                        <button
                          key={ans}
                          onClick={() => setAnswer(q.id, ans)}
                          className="flex-1 py-2 rounded-lg text-sm font-medium transition-all capitalize"
                          style={
                            isSelected
                              ? { background: ansStyle.bg, border: `2px solid ${ansStyle.border}`, color: ansStyle.color }
                              : { background: 'rgba(0,0,0,0.2)', border: '2px solid rgba(255,255,255,0.06)', color: '#64748b' }
                          }
                        >
                          {ans === 'yes' ? '✓ Yes' : ans === 'no' ? '✗ No' : '? Unsure'}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <button
              onClick={() => setActiveCategory(Math.max(0, activeCategory - 1))}
              disabled={activeCategory === 0}
              className="px-4 py-2 text-sm transition-colors disabled:opacity-30"
              style={{ color: '#64748b' }}
              onMouseEnter={(e) => { if (activeCategory !== 0) (e.currentTarget as HTMLButtonElement).style.color = '#e2e8f0'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#64748b'; }}
            >
              ← Previous
            </button>
            {activeCategory < CATEGORIES.length - 1 ? (
              <button
                onClick={() => setActiveCategory(activeCategory + 1)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all text-white"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-2 rounded-lg font-semibold text-white transition-all disabled:opacity-40"
                style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', boxShadow: '0 0 20px rgba(34,197,94,0.25)' }}
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ClipboardCheck className="w-4 h-4" />}
                {submitting ? 'Analyzing...' : 'Get AI Analysis'}
              </button>
            )}
          </div>
        </div>

        {totalAnswered > 0 && (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all"
            style={{
              background: 'rgba(34,197,94,0.06)',
              border: '1px solid rgba(34,197,94,0.2)',
              color: '#4ade80',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(34,197,94,0.1)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(34,197,94,0.06)'; }}
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ClipboardCheck className="w-4 h-4" />}
            {submitting ? 'Claude AI is analyzing...' : `Submit Assessment (${totalAnswered}/${totalQuestions} answered)`}
          </button>
        )}

        {error && (
          <div className="flex items-center gap-2 p-4 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}
      </div>
    </ShieldScannerLayout>
  );
}
