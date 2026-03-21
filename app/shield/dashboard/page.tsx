'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loadUserData, BADGES, getBadgeInfo, gradeColor } from '@/lib/shield-storage';
import { UserData } from '@/lib/shield-types';
import ShieldAppLayout from '@/app/shield/components/ShieldAppLayout';
import {
  Shield, Globe, Code2, Github, Package, Key, Cookie,
  Globe2, Lock, FileSearch, ClipboardCheck,
  AlertTriangle, Trophy, Loader2, ExternalLink,
  TrendingUp, ChevronRight
} from 'lucide-react';

const SCANNERS = [
  { href: '/shield/scan/url', icon: Globe, label: 'URL Scanner', desc: 'Security headers & HTTPS', color: '#3b82f6' },
  { href: '/shield/scan/code', icon: Code2, label: 'Code Scanner', desc: 'AI vulnerability analysis', color: '#8b5cf6' },
  { href: '/shield/scan/github', icon: Github, label: 'GitHub Repo', desc: 'Exposed secrets in repos', color: '#6b7280' },
  { href: '/shield/scan/dependencies', icon: Package, label: 'Dependencies', desc: 'CVE database check', color: '#22c55e' },
  { href: '/shield/scan/jwt', icon: Key, label: 'JWT Analyzer', desc: 'Decode & audit tokens', color: '#f59e0b' },
  { href: '/shield/scan/cookies', icon: Cookie, label: 'Cookie Checker', desc: 'Verify security flags', color: '#ec4899' },
  { href: '/shield/scan/dns', icon: Globe2, label: 'DNS Checker', desc: 'SPF, DMARC, DKIM', color: '#06b6d4' },
  { href: '/shield/scan/ssl', icon: Lock, label: 'SSL/TLS', desc: 'Certificate validation', color: '#22c55e' },
  { href: '/shield/scan/sensitive-files', icon: FileSearch, label: 'Sensitive Files', desc: 'Find exposed files', color: '#ef4444' },
  { href: '/shield/scan/owasp', icon: ClipboardCheck, label: 'OWASP Top 10', desc: 'Security checklist', color: '#f97316' },
];

export default function DashboardPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const data = loadUserData();
    if (!data) { router.push('/shield/login'); return; }
    setUserData(data);
  }, [router]);

  if (!userData) return (
    <ShieldAppLayout>
      <div className="flex items-center justify-center" style={{ height: '80vh' }}>
        <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
      </div>
    </ShieldAppLayout>
  );

  const recentScans = userData.scanHistory.slice(0, 6);
  const earnedBadges = userData.badges.map(id => getBadgeInfo(id));
  const nextBadge = BADGES.find(b => !userData.badges.includes(b.id));
  const avgScore = userData.scanHistory.length > 0
    ? Math.round(userData.scanHistory.reduce((s, r) => s + r.score, 0) / userData.scanHistory.length)
    : null;

  return (
    <ShieldAppLayout>
      <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1" style={{ letterSpacing: '-0.03em' }}>
            Dashboard
          </h1>
          <p style={{ fontSize: '14px', color: '#94a3b8' }}>
            {userData.isAdmin ? 'LC3 Admin' : 'LC3 Club Member'}
            {' · '}
            <span style={{ color: userData.mode === 'beginner' ? '#4ade80' : '#60a5fa' }}>
              {userData.mode === 'beginner' ? 'Beginner Mode' : 'Advanced Mode'}
            </span>
          </p>
        </div>

        {/* Stats — compact row */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 mb-8">
          {[
            { label: 'Total Scans', value: userData.totalScans, icon: Shield, color: '#3b82f6' },
            { label: 'Avg Score', value: avgScore !== null ? `${avgScore}%` : '—', icon: TrendingUp, color: '#22c55e' },
            { label: 'Issues Found', value: userData.totalIssuesFound, icon: AlertTriangle, color: '#ef4444' },
            { label: 'Badges', value: `${userData.badges.length}/${BADGES.length}`, icon: Trophy, color: '#f59e0b' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-xl px-5 py-3.5"
              style={{ background: '#161b27', border: '1px solid rgba(255,255,255,0.09)' }}
            >
              <Icon style={{ width: '18px', height: '18px', color }} />
              <div>
                <div className="text-xl font-black text-white" style={{ letterSpacing: '-0.04em' }}>{value}</div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Scanner grid */}
        <div
          className="rounded-2xl overflow-hidden mb-6"
          style={{ background: '#161b27', border: '1px solid rgba(255,255,255,0.09)' }}
        >
          <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <h2 className="text-white font-semibold" style={{ fontSize: '15px' }}>Run a Scan</h2>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>Choose a scanner to get started</p>
          </div>
          <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {SCANNERS.map(({ href, icon: Icon, label, color }) => (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-2 p-3.5 rounded-xl text-center transition-all duration-200"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = `${color}12`;
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = `${color}50`;
                  (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.03)';
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.07)';
                  (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: `${color}18`, border: `1px solid ${color}30` }}
                >
                  <Icon style={{ width: '16px', height: '16px', color }} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 500, color: '#cbd5e1', lineHeight: 1.3 }}>{label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom row: Recent scans + Badges */}
        <div className="grid lg:grid-cols-3 gap-5">

          {/* Recent scans */}
          <div
            className="lg:col-span-2 rounded-2xl overflow-hidden"
            style={{ background: '#161b27', border: '1px solid rgba(255,255,255,0.09)' }}
          >
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
            >
              <h2 className="text-white font-semibold" style={{ fontSize: '15px' }}>Recent Scans</h2>
              <Link
                href="/shield/history"
                className="flex items-center gap-1 text-[12px] transition-colors"
                style={{ color: '#64748b' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#93c5fd')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
              >
                View all <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentScans.length === 0 ? (
              <div className="py-14 text-center">
                <Shield className="w-10 h-10 mx-auto mb-3" style={{ color: '#334155' }} />
                <p style={{ fontSize: '14px', color: '#64748b' }}>No scans yet — pick a scanner above to start!</p>
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                {recentScans.map((scan) => (
                  <div
                    key={scan.id}
                    className="flex items-center justify-between px-5 py-3.5 transition-colors"
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate" style={{ fontSize: '13px', color: '#e2e8f0' }}>
                        {scan.target}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                        {scan.type} · {new Date(scan.timestamp).toLocaleDateString()}
                        {scan.vulnerabilities.length > 0 && (
                          <span style={{ color: '#f87171' }}> · {scan.vulnerabilities.length} issues</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-center">
                        <div className={`text-xl font-black ${gradeColor(scan.grade)}`} style={{ letterSpacing: '-0.03em' }}>
                          {scan.grade}
                        </div>
                        <div style={{ fontSize: '10px', color: '#64748b' }}>{scan.score}%</div>
                      </div>
                      <Link
                        href={`/shield/results?id=${scan.id}`}
                        className="p-2 rounded-lg transition-colors"
                        style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8' }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#93c5fd'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#94a3b8'; }}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Badges */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: '#161b27', border: '1px solid rgba(255,255,255,0.09)' }}
          >
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <h2 className="text-white font-semibold" style={{ fontSize: '15px' }}>Badges</h2>
              </div>
              <Link
                href="/shield/badges"
                className="flex items-center gap-1 text-[12px] transition-colors"
                style={{ color: '#64748b' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#93c5fd')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
              >
                All <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="p-4">
              {earnedBadges.length === 0 ? (
                <p style={{ fontSize: '13px', color: '#64748b', textAlign: 'center', padding: '16px 0' }}>
                  Complete scans to earn badges!
                </p>
              ) : (
                <div className="flex flex-wrap gap-2 mb-4">
                  {earnedBadges.slice(0, 8).map(badge => (
                    <div
                      key={badge.id}
                      title={`${badge.name}: ${badge.description}`}
                      className="flex flex-col items-center p-2.5 rounded-xl"
                      style={{
                        background: 'rgba(245,158,11,0.08)',
                        border: '1px solid rgba(245,158,11,0.2)',
                        minWidth: '52px',
                      }}
                    >
                      <span className="text-xl">{badge.icon}</span>
                      <span style={{ fontSize: '9px', color: '#fbbf24', marginTop: '3px', fontWeight: 600, textAlign: 'center' }}>
                        {badge.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {nextBadge && (
                <div className="pt-3" style={{ borderTop: earnedBadges.length > 0 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
                  <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                    Next to unlock
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl grayscale opacity-30">{nextBadge.icon}</span>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8' }}>{nextBadge.name}</div>
                      <div style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.4 }}>{nextBadge.description}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ShieldAppLayout>
  );
}
