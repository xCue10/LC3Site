'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loadUserData, syncFromServer, BADGES, getBadgeInfo, gradeColor } from '@/lib/shield-storage';
import { UserData, ScanType } from '@/lib/shield-types';
import ShieldAppLayout from '@/app/shield/components/ShieldAppLayout';
import ShieldOnboarding from '@/app/shield/components/ShieldOnboarding';
import {
  Shield, Globe, Code2, Github, Package, Key, Cookie,
  Globe2, Lock, FileSearch, ClipboardCheck,
  AlertTriangle, Trophy, Loader2, ExternalLink,
  TrendingUp, ChevronRight, Sparkles, LucideIcon
} from 'lucide-react';

const SCANNERS: { href: string; icon: LucideIcon; label: string; desc: string; color: string; type: ScanType }[] = [
  { href: '/shield/scan/url', icon: Globe, label: 'URL Scanner', desc: 'Security headers & HTTPS', color: '#3b82f6', type: 'url' },
  { href: '/shield/scan/code', icon: Code2, label: 'Code Scanner', desc: 'AI vulnerability analysis', color: '#8b5cf6', type: 'code' },
  { href: '/shield/scan/github', icon: Github, label: 'GitHub Repo', desc: 'Exposed secrets in repos', color: '#6b7280', type: 'github' },
  { href: '/shield/scan/dependencies', icon: Package, label: 'Dependencies', desc: 'CVE database check', color: '#22c55e', type: 'dependencies' },
  { href: '/shield/scan/jwt', icon: Key, label: 'JWT Analyzer', desc: 'Decode & audit tokens', color: '#f59e0b', type: 'jwt' },
  { href: '/shield/scan/cookies', icon: Cookie, label: 'Cookie Checker', desc: 'Verify security flags', color: '#ec4899', type: 'cookies' },
  { href: '/shield/scan/dns', icon: Globe2, label: 'DNS Checker', desc: 'SPF, DMARC, DKIM', color: '#06b6d4', type: 'dns' },
  { href: '/shield/scan/ssl', icon: Lock, label: 'SSL/TLS', desc: 'Certificate validation', color: '#22c55e', type: 'ssl' },
  { href: '/shield/scan/sensitive-files', icon: FileSearch, label: 'Sensitive Files', desc: 'Find exposed files', color: '#ef4444', type: 'sensitive-files' },
  { href: '/shield/scan/owasp', icon: ClipboardCheck, label: 'OWASP Top 10', desc: 'Security checklist', color: '#f97316', type: 'owasp' },
];

const BADGE_HINTS: Record<string, string> = {
  'https-hero': 'Run the URL Scanner on an HTTPS site',
  'no-secrets': 'Run Code Scanner and get clean results',
  'owasp-aware': 'Complete the OWASP Top 10 checklist',
  'a-grade-club': 'Score 90+ on any scan',
  'dependency-guardian': 'Scan dependencies with no CVEs',
  'cookie-monster': 'Run Cookie Checker on a secure site',
  'dns-defender': 'Run DNS Checker with all records passing',
  'clean-repo': 'Scan a GitHub repo with no exposed secrets',
  'quick-fixer': 'Mark 5 issues as fixed from scan results',
  'security-streak': 'Scan every day for 7 days in a row',
};

export default function DashboardPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const data = loadUserData();
    if (!data) { router.push('/shield/login'); return; }
    setUserData(data);
    if (!localStorage.getItem('lc3shield_onboarded')) {
      setShowOnboarding(true);
    }
    // Sync from server in background to pick up cross-device history
    syncFromServer().then(fresh => { if (fresh) setUserData(fresh); });
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
  const unearnedBadges = BADGES.filter(b => !userData.badges.includes(b.id));
  const avgScore = userData.scanHistory.length > 0
    ? Math.round(userData.scanHistory.reduce((s, r) => s + r.score, 0) / userData.scanHistory.length)
    : null;

  // Smart scan suggestions
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recentTypes = new Set(
    userData.scanHistory.filter(s => s.timestamp > oneWeekAgo).map(s => s.type)
  );
  const lastUrlScan = userData.scanHistory.find(s => s.type === 'url');
  const relatedScanners = lastUrlScan
    ? SCANNERS.filter(s => ['dns', 'ssl', 'sensitive-files'].includes(s.type) && !recentTypes.has(s.type))
    : [];
  const unusedScanners = SCANNERS.filter(s => !userData.scanHistory.some(h => h.type === s.type));
  const suggestions = [
    ...relatedScanners,
    ...unusedScanners.filter(s => !relatedScanners.includes(s)),
  ].slice(0, 3);

  return (
    <ShieldAppLayout>
      {showOnboarding && (
        <ShieldOnboarding onClose={() => {
          localStorage.setItem('lc3shield_onboarded', '1');
          setShowOnboarding(false);
        }} />
      )}

      <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1" style={{ letterSpacing: '-0.03em' }}>
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
              className="flex items-center gap-3 rounded-xl px-5 py-3.5 bg-white dark:bg-[#161b27] border border-slate-200/80 dark:border-white/[0.09]"
            >
              <Icon style={{ width: '18px', height: '18px', color }} />
              <div>
                <div className="text-xl font-black text-slate-900 dark:text-white" style={{ letterSpacing: '-0.04em' }}>{value}</div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Scanner grid */}
        <div
          className="rounded-2xl overflow-hidden mb-4 bg-white dark:bg-[#161b27] border border-slate-200/80 dark:border-white/[0.09]"
        >
          <div className="px-5 py-4 border-b border-slate-200/80 dark:border-white/[0.07]">
            <h2 className="text-slate-900 dark:text-white font-semibold" style={{ fontSize: '15px' }}>Run a Scan</h2>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>Choose a scanner to get started</p>
          </div>
          <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {SCANNERS.map(({ href, icon: Icon, label, color }) => (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-2 p-3.5 rounded-xl text-center transition-all duration-200 bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.07]"
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = `${color}12`;
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = `${color}50`;
                  (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = '';
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = '';
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

        {/* Smart scan suggestions */}
        {suggestions.length > 0 && (
          <div
            className="rounded-2xl p-4 mb-6 flex flex-wrap items-center gap-3"
            style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)' }}
          >
            <div className="flex items-center gap-2 shrink-0">
              <Sparkles style={{ width: '14px', height: '14px', color: '#60a5fa' }} />
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#60a5fa' }}>Suggested for you</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map(({ href, icon: Icon, label, color, type }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all"
                  style={{ background: `${color}14`, border: `1px solid ${color}30`, fontSize: '12px', color: '#cbd5e1', fontWeight: 500 }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'white'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#cbd5e1'; }}
                >
                  <Icon style={{ width: '12px', height: '12px', color }} />
                  {label}
                  {!userData.scanHistory.some(h => h.type === type) && (
                    <span style={{ fontSize: '10px', color: '#94a3b8', marginLeft: '2px' }}>· new</span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Bottom row: Recent scans + Badges */}
        <div className="grid lg:grid-cols-3 gap-5">

          {/* Recent scans */}
          <div
            className="lg:col-span-2 rounded-2xl overflow-hidden bg-white dark:bg-[#161b27] border border-slate-200/80 dark:border-white/[0.09]"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/80 dark:border-white/[0.07]">
              <h2 className="text-slate-900 dark:text-white font-semibold" style={{ fontSize: '15px' }}>Recent Scans</h2>
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
              <div className="divide-y divide-slate-200/80 dark:divide-white/[0.06]">
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
            className="rounded-2xl overflow-hidden bg-white dark:bg-[#161b27] border border-slate-200/80 dark:border-white/[0.09]"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/80 dark:border-white/[0.07]">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <h2 className="text-slate-900 dark:text-white font-semibold" style={{ fontSize: '15px' }}>Badges</h2>
              </div>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                {userData.badges.length}/{BADGES.length}
              </span>
            </div>

            <div className="p-4">
              {/* Earned badges */}
              {earnedBadges.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {earnedBadges.map(badge => (
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

              {/* Unearned badges with hints */}
              {unearnedBadges.length > 0 && (
                <div style={{ borderTop: earnedBadges.length > 0 ? '1px solid rgba(255,255,255,0.07)' : 'none', paddingTop: earnedBadges.length > 0 ? '12px' : 0 }}>
                  <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                    To unlock
                  </div>
                  <div className="space-y-2">
                    {unearnedBadges.slice(0, 4).map(badge => (
                      <div key={badge.id} className="flex items-start gap-2.5">
                        <span className="text-lg grayscale opacity-30 shrink-0 mt-0.5">{badge.icon}</span>
                        <div className="min-w-0">
                          <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }}>{badge.name}</div>
                          <div style={{ fontSize: '10px', color: '#475569', lineHeight: 1.4 }}>
                            {BADGE_HINTS[badge.id] || badge.description}
                          </div>
                        </div>
                      </div>
                    ))}
                    {unearnedBadges.length > 4 && (
                      <p style={{ fontSize: '10px', color: '#475569', marginTop: '4px' }}>
                        +{unearnedBadges.length - 4} more badges to earn
                      </p>
                    )}
                  </div>
                </div>
              )}

              {unearnedBadges.length === 0 && (
                <div className="text-center py-4">
                  <Trophy className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                  <p style={{ fontSize: '12px', color: '#fbbf24', fontWeight: 600 }}>All badges earned!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ShieldAppLayout>
  );
}
