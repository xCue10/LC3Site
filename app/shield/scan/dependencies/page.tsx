'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadUserData, consumeScan } from '@/lib/shield-storage';
import ShieldScannerLayout from '@/app/shield/components/ShieldScannerLayout';
import ShieldScanProgress from '@/app/shield/components/ShieldScanProgress';
import { Package, Scan, AlertCircle } from 'lucide-react';

const EXAMPLE_PACKAGE_JSON = `{
  "name": "my-app",
  "version": "1.0.0",
  "dependencies": {
    "express": "4.17.1",
    "lodash": "4.17.15",
    "axios": "0.21.1",
    "jsonwebtoken": "8.5.1",
    "mongoose": "5.9.10",
    "bcryptjs": "2.4.3"
  },
  "devDependencies": {
    "nodemon": "2.0.4"
  }
}`;

export default function DependenciesScannerPage() {
  const router = useRouter();
  const [packageJson, setPackageJson] = useState('');
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'beginner' | 'advanced'>('beginner');

  useEffect(() => {
    const data = loadUserData();
    if (!data) { router.push('/shield/login'); return; }
    setMode(data.mode);
  }, [router]);

  const startScan = async () => {
    if (!packageJson.trim()) return;
    if (!consumeScan()) {
      setError('Daily scan limit reached (10 scans/day). Come back tomorrow!');
      setScanning(false);
      return;
    }
    setScanning(true);
    setProgress(10);
    setLogs(['Parsing package.json...']);
    setError('');

    try {
      const res = await fetch('/api/shield/scan-dependencies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageJson: packageJson.trim(), mode }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Scan failed');
      }

      const data = await res.json();
      if (data.logs) setLogs(data.logs);
      setProgress(100);
      setLogs(prev => [...prev, `✓ Checked ${data.packageCount || 0} packages`]);

      await new Promise(r => setTimeout(r, 500));
      sessionStorage.setItem('lc3shield_pending_result', JSON.stringify(data.result));
      router.push('/shield/results');
    } catch (e: any) {
      setError(e.message || 'Scan failed. Make sure you pasted valid package.json content.');
      setScanning(false);
      setProgress(0);
    }
  };

  return (
    <ShieldScannerLayout
      title="Dependency Vulnerability Scanner"
      description="Check your npm packages against the OSV (Open Source Vulnerabilities) database for known CVEs."
      icon={Package}
     
    >
      <div className="space-y-4">
        {/* Info box */}
        <div className="p-4 rounded-xl" style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)' }}>
          <div className="flex items-start gap-3">
            <Package className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#60a5fa' }} />
            <div>
              <h3 className="text-sm font-semibold mb-1" style={{ color: '#60a5fa' }}>How to get your package.json</h3>
              <p className="text-xs" style={{ color: '#64748b' }}>
                Find the{' '}
                <code
                  className="px-1 rounded"
                  style={{ color: '#93c5fd', background: 'rgba(255,255,255,0.06)', fontFamily: "'JetBrains Mono', monospace" }}
                >
                  package.json
                </code>{' '}
                file in the root of your project folder and paste its contents below.
                This file lists all your dependencies and their versions.
              </p>
            </div>
          </div>
        </div>

        {/* Text area */}
        <div className="rounded-xl overflow-hidden bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-white/[0.06]">
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
          >
            <span className="text-xs font-mono" style={{ color: '#94a3b8' }}>package.json</span>
            <button
              onClick={() => setPackageJson(EXAMPLE_PACKAGE_JSON)}
              className="text-xs transition-colors"
              style={{ color: '#60a5fa' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#93c5fd'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#60a5fa'; }}
            >
              Load example
            </button>
          </div>
          <textarea
            value={packageJson}
            onChange={(e) => setPackageJson(e.target.value)}
            placeholder={'Paste your package.json contents here...\n\nExample:\n{\n  "dependencies": {\n    "express": "4.17.1",\n    "lodash": "4.17.15"\n  }\n}'}
            disabled={scanning}
            rows={16}
            className="w-full px-4 py-4 outline-none resize-none"
            style={{
              background: 'transparent',
              color: '#e2e8f0',
              fontSize: '13px',
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            }}
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={startScan}
            disabled={scanning || !packageJson.trim()}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', boxShadow: '0 0 20px rgba(59,130,246,0.25)' }}
          >
            <Scan className="w-4 h-4" />
            {scanning ? 'Checking CVEs...' : 'Check Vulnerabilities'}
          </button>
        </div>

        {scanning && <ShieldScanProgress progress={progress} logs={logs} scanning={scanning} />}

        {error && (
          <div className="flex items-center gap-2 p-4 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {!scanning && (
          <div className="p-4 rounded-xl text-sm" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <p style={{ color: '#64748b' }}>
              This scanner checks your packages against the{' '}
              <strong style={{ color: '#e2e8f0' }}>OSV (Open Source Vulnerabilities)</strong> database at{' '}
              <code style={{ color: '#60a5fa' }}>osv.dev</code> — the same database used by GitHub Dependabot and Google's security team.
              For each vulnerability found, you'll get the CVE ID, severity score, affected versions, and the exact npm command to fix it.
            </p>
          </div>
        )}
      </div>
    </ShieldScannerLayout>
  );
}
