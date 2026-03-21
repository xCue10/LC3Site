import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ScanResult } from '@/lib/shield-types';
import { getBadgeInfo } from '@/lib/shield-storage';

const GRADE_COLORS: Record<string, string> = {
  A: '#22c55e', B: '#34d399', C: '#f59e0b', D: '#f97316', F: '#ef4444',
};

const SEV: Record<string, { color: string; bg: string; border: string }> = {
  Critical: { color: '#fca5a5', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)' },
  High:     { color: '#fdba74', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.25)' },
  Medium:   { color: '#fde68a', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)' },
  Low:      { color: '#93c5fd', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.25)' },
  Info:     { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.2)' },
};

async function getShared(token: string): Promise<{ result: ScanResult; createdAt: number } | null> {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${base}/api/shield/share/${token}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function SharedResultPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const data = await getShared(token);
  if (!data) notFound();
  const { result } = data;
  const gc = GRADE_COLORS[result.grade] || GRADE_COLORS.F;

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #080d18, #0a1020)' }}>
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/shield" className="text-sm font-semibold transition-colors" style={{ color: '#ef4444' }}>
            🛡️ LC3 Shield
          </Link>
          <span style={{ fontSize: '12px', color: '#475569' }}>
            Shared report · {new Date(data.createdAt).toLocaleDateString()}
          </span>
        </div>

        {/* Score card */}
        <div className="rounded-2xl overflow-hidden mb-5" style={{ background: '#161b27', border: '1px solid rgba(255,255,255,0.09)' }}>
          <div className="h-1" style={{ background: `linear-gradient(90deg, ${gc}, transparent)` }} />
          <div className="p-6 flex items-center gap-6">
            <div className="text-center shrink-0">
              <div className="text-6xl font-black" style={{ color: gc, letterSpacing: '-0.04em' }}>{result.grade}</div>
              <div className="text-2xl font-bold text-white">
                {result.score}<span style={{ fontSize: '14px', color: '#64748b' }}>/100</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Scan Target</div>
              <div className="font-semibold text-white mb-1" style={{ fontSize: '15px' }}>{result.target}</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                {result.type} · {new Date(result.timestamp).toLocaleString()}
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {(['Critical', 'High', 'Medium', 'Low'] as const).map(sev => {
                  const count = result.vulnerabilities.filter(v => v.severity === sev).length;
                  if (!count) return null;
                  const s = SEV[sev];
                  return (
                    <span key={sev} className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold" style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
                      {count} {sev}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="rounded-2xl p-5 mb-5" style={{ background: '#161b27', border: '1px solid rgba(255,255,255,0.09)' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Summary</div>
          <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.7' }}>{result.summary}</p>
        </div>

        {/* Badges */}
        {result.badgesEarned.length > 0 && (
          <div className="rounded-2xl p-5 mb-5" style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>Badges Earned</div>
            <div className="flex flex-wrap gap-2">
              {result.badgesEarned.map(id => {
                const b = getBadgeInfo(id);
                return (
                  <div key={id} className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
                    <span className="text-lg">{b.icon}</span>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#fbbf24' }}>{b.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Vulnerabilities */}
        {result.vulnerabilities.length > 0 ? (
          <div>
            <h2 className="text-white font-bold mb-3" style={{ fontSize: '16px' }}>
              Issues Found{' '}
              <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 400 }}>
                ({result.vulnerabilities.length})
              </span>
            </h2>
            <div className="space-y-3">
              {(['Critical', 'High', 'Medium', 'Low', 'Info'] as const).flatMap(sev =>
                result.vulnerabilities.filter(v => v.severity === sev).map(vuln => {
                  const s = SEV[sev] || SEV.Info;
                  return (
                    <div key={vuln.id} className="rounded-xl p-4" style={{ background: '#161b27', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <div className="flex items-start gap-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold shrink-0 mt-0.5" style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
                          {sev}
                        </span>
                        <div>
                          <div className="font-semibold text-white mb-1" style={{ fontSize: '13px' }}>{vuln.title}</div>
                          <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.6' }}>{vuln.description}</p>
                          {vuln.fix && (
                            <p style={{ fontSize: '12px', color: '#4ade80', marginTop: '6px' }}>Fix: {vuln.fix}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-16 rounded-2xl" style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)' }}>
            <div className="text-5xl mb-3">✅</div>
            <h2 className="text-white font-bold text-xl mb-2">No Issues Found!</h2>
            <p style={{ fontSize: '14px', color: '#94a3b8' }}>This scan came back clean.</p>
          </div>
        )}

        <div className="mt-10 text-center">
          <p style={{ fontSize: '12px', color: '#334155' }}>Generated by LC3 Shield · Powered by Claude AI</p>
        </div>
      </div>
    </div>
  );
}
