'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loadUserData, syncFromServer, saveUserData, pushToServer, gradeColor } from '@/lib/shield-storage';
import { ScanResult, ScanType } from '@/lib/shield-types';
import { UserData } from '@/lib/shield-types';
import ShieldAppLayout from '@/app/shield/components/ShieldAppLayout';
import {
  History, Globe, Code2, Github, Package, Key, Cookie,
  Globe2, Lock, FileSearch, ClipboardCheck,
  ExternalLink, RefreshCw, Loader2, TrendingUp, AlertTriangle, Trash2
} from 'lucide-react';

const SCAN_ICONS: Record<ScanType, React.ElementType> = {
  url: Globe, code: Code2, github: Github, dependencies: Package,
  jwt: Key, cookies: Cookie, dns: Globe2, ssl: Lock,
  'sensitive-files': FileSearch, owasp: ClipboardCheck,
};

const SCAN_LABELS: Record<ScanType, string> = {
  url: 'URL Scan', code: 'Code Scan', github: 'GitHub Scan',
  dependencies: 'Dependency Scan', jwt: 'JWT Analysis', cookies: 'Cookie Check',
  dns: 'DNS Check', ssl: 'SSL Check', 'sensitive-files': 'Sensitive Files', owasp: 'OWASP Checklist',
};

const SCAN_COLORS: Record<ScanType, string> = {
  url: '#3b82f6', code: '#8b5cf6', github: '#6b7280',
  dependencies: '#22c55e', jwt: '#f59e0b', cookies: '#ec4899',
  dns: '#06b6d4', ssl: '#22c55e', 'sensitive-files': '#ef4444', owasp: '#f97316',
};

export default function HistoryPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [filter, setFilter] = useState<ScanType | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date');

  useEffect(() => {
    const data = loadUserData();
    if (!data) { router.push('/shield/login'); return; }
    setUserData(data);
    syncFromServer().then(fresh => { if (fresh) setUserData(fresh); });
  }, [router]);

  if (!userData) return (
    <ShieldAppLayout>
      <div className="flex items-center justify-center" style={{ height: '80vh' }}>
        <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
      </div>
    </ShieldAppLayout>
  );

  const filtered = userData.scanHistory
    .filter(s => filter === 'all' || s.type === filter)
    .sort((a, b) => sortBy === 'date' ? b.timestamp - a.timestamp : b.score - a.score);

  const scanTypes = [...new Set(userData.scanHistory.map(s => s.type))] as ScanType[];
  const avgScore = userData.scanHistory.length > 0
    ? Math.round(userData.scanHistory.reduce((s, r) => s + r.score, 0) / userData.scanHistory.length)
    : 0;

  const deleteScan = (scanId: string) => {
    const data = loadUserData();
    if (!data) return;
    data.scanHistory = data.scanHistory.filter(s => s.id !== scanId);
    saveUserData(data);
    pushToServer(data);
    setUserData({ ...data });
  };

  const rerunScan = (scan: ScanResult) => {
    const paths: Record<ScanType, string> = {
      url: '/shield/scan/url', code: '/shield/scan/code', github: '/shield/scan/github',
      dependencies: '/shield/scan/dependencies', jwt: '/shield/scan/jwt', cookies: '/shield/scan/cookies',
      dns: '/shield/scan/dns', ssl: '/shield/scan/ssl', 'sensitive-files': '/shield/scan/sensitive-files', owasp: '/shield/scan/owasp',
    };
    router.push(paths[scan.type]);
  };

  return (
    <ShieldAppLayout>
      <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1" style={{ letterSpacing: '-0.03em' }}>
            Scan History
          </h1>
          <p className="text-slate-500 dark:text-slate-400" style={{ fontSize: '14px' }}>
            {userData.scanHistory.length} total scans completed
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-3 mb-8">
          {[
            { label: 'Total Scans', value: userData.scanHistory.length, icon: History, color: '#3b82f6' },
            { label: 'Avg Score', value: `${avgScore}%`, icon: TrendingUp, color: avgScore >= 75 ? '#22c55e' : avgScore >= 50 ? '#f59e0b' : '#ef4444' },
            { label: 'Issues Found', value: userData.totalIssuesFound, icon: AlertTriangle, color: '#ef4444' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-xl px-5 py-3.5 bg-white dark:bg-[#161b27] border border-slate-200/80 dark:border-white/[0.09]"
            >
              <Icon style={{ width: '18px', height: '18px', color }} />
              <div>
                <div className="text-xl font-black text-slate-900 dark:text-white" style={{ letterSpacing: '-0.04em' }}>{value}</div>
                <div className="text-slate-500 dark:text-slate-400" style={{ fontSize: '11px' }}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters + Sort */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all ${filter !== 'all' ? 'text-slate-600 dark:text-slate-400' : ''}`}
            style={{
              background: filter === 'all' ? '#3b82f6' : 'rgba(255,255,255,0.05)',
              color: filter === 'all' ? '#fff' : undefined,
              border: filter === 'all' ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.1)',
            }}
          >
            All ({userData.scanHistory.length})
          </button>
          {scanTypes.map(type => {
            const Icon = SCAN_ICONS[type];
            const count = userData.scanHistory.filter(s => s.type === type).length;
            const active = filter === type;
            const color = SCAN_COLORS[type];
            return (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium transition-all ${!active ? 'text-slate-600 dark:text-slate-400' : ''}`}
                style={{
                  background: active ? `${color}20` : 'rgba(255,255,255,0.05)',
                  color: active ? color : undefined,
                  border: active ? `1px solid ${color}50` : '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <Icon className="w-3 h-3" />
                {SCAN_LABELS[type]} ({count})
              </button>
            );
          })}

          <div className="ml-auto flex items-center gap-1.5">
            <span style={{ fontSize: '12px', color: '#64748b' }}>Sort:</span>
            {(['date', 'score'] as const).map(s => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                className="px-3 py-1 rounded-lg text-[12px] transition-all"
                style={{
                  background: sortBy === s ? 'rgba(59,130,246,0.2)' : 'transparent',
                  color: sortBy === s ? '#93c5fd' : '#64748b',
                  border: sortBy === s ? '1px solid rgba(59,130,246,0.3)' : '1px solid transparent',
                }}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div
            className="text-center py-20 rounded-2xl bg-white dark:bg-[#161b27] border border-slate-200/80 dark:border-white/[0.09]"
          >
            <History className="w-12 h-12 mx-auto mb-3" style={{ color: '#334155' }} />
            <p className="text-slate-500 dark:text-slate-400" style={{ fontSize: '14px' }}>No scans yet. Start scanning to build your history!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((scan) => {
              const Icon = SCAN_ICONS[scan.type] || Globe;
              const color = SCAN_COLORS[scan.type] || '#3b82f6';
              const fixedCount = scan.vulnerabilities.filter(v => v.isFixed).length;
              return (
                <div
                  key={scan.id}
                  className="rounded-xl transition-all bg-white dark:bg-[#161b27] border border-slate-200/80 dark:border-white/[0.09]"
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = '')}
                >
                  <div className="flex items-center justify-between px-4 py-3.5 gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: `${color}18`, border: `1px solid ${color}30` }}
                      >
                        <Icon style={{ width: '16px', height: '16px', color }} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium truncate text-slate-800 dark:text-slate-200" style={{ fontSize: '14px' }}>
                          {scan.target}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                          {SCAN_LABELS[scan.type]} · {new Date(scan.timestamp).toLocaleDateString()}
                          {scan.vulnerabilities.length > 0 && (
                            <span style={{ color: '#f87171' }}> · {scan.vulnerabilities.length} issues</span>
                          )}
                          {fixedCount > 0 && (
                            <span style={{ color: '#4ade80' }}> · {fixedCount} fixed</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-center">
                        <div className={`text-xl font-black ${gradeColor(scan.grade)}`} style={{ letterSpacing: '-0.04em' }}>
                          {scan.grade}
                        </div>
                        <div style={{ fontSize: '10px', color: '#64748b' }}>{scan.score}%</div>
                      </div>
                      <div className="flex gap-1.5">
                        <Link
                          href={`/shield/results?id=${scan.id}`}
                          className="p-2 rounded-lg transition-colors text-slate-500 dark:text-slate-400"
                          style={{ background: 'rgba(255,255,255,0.05)' }}
                          title="View results"
                          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#93c5fd'; (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(59,130,246,0.12)'; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = ''; (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.05)'; }}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => rerunScan(scan)}
                          className="p-2 rounded-lg transition-colors text-slate-500 dark:text-slate-400"
                          style={{ background: 'rgba(255,255,255,0.05)' }}
                          title="Rerun scan"
                          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#93c5fd'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(59,130,246,0.12)'; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = ''; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; }}
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteScan(scan.id)}
                          className="p-2 rounded-lg transition-colors text-slate-500 dark:text-slate-400"
                          style={{ background: 'rgba(255,255,255,0.05)' }}
                          title="Delete scan"
                          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#f87171'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.12)'; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = ''; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ShieldAppLayout>
  );
}
