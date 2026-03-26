'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loadUserData, consumeScan } from '@/lib/shield-storage';
import { ScanResult } from '@/lib/shield-types';
import ShieldScannerLayout from '@/app/shield/components/ShieldScannerLayout';
import ShieldScanProgress from '@/app/shield/components/ShieldScanProgress';
import { Globe, Scan, AlertCircle } from 'lucide-react';

const SCAN_STEPS = [
  'Resolving domain...',
  'Checking protocol (HTTP/HTTPS)...',
  'Fetching HTTP response headers...',
  'Analyzing Content-Security-Policy...',
  'Checking X-Frame-Options (clickjacking)...',
  'Verifying HSTS configuration...',
  'Checking X-Content-Type-Options...',
  'Checking Referrer-Policy...',
  'Checking Permissions-Policy...',
  'Looking for mixed content signals...',
  'Running AI security analysis...',
  'Calculating security score...',
  'Generating recommendations...',
];

function UrlScannerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [url, setUrl] = useState('');
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'beginner' | 'advanced'>('beginner');

  useEffect(() => {
    const data = loadUserData();
    if (!data) { router.push('/shield/login'); return; }
    setMode(data.mode);
    const prefill = searchParams.get('url');
    if (prefill) setUrl(prefill);
  }, [router, searchParams]);

  const startScan = async () => {
    if (!url.trim()) return;
    if (!consumeScan()) {
      setError('Daily scan limit reached (10 scans/day). Come back tomorrow!');
      setScanning(false);
      return;
    }
    setScanning(true);
    setProgress(0);
    setLogs([]);
    setError('');

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < SCAN_STEPS.length) {
        setLogs(prev => [...prev, SCAN_STEPS[stepIndex]]);
        setProgress(Math.round(((stepIndex + 1) / SCAN_STEPS.length) * 85));
        stepIndex++;
      }
    }, 600);

    try {
      const res = await fetch('/api/shield/scan-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim(), mode }),
      });

      clearInterval(interval);
      setProgress(100);

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Scan failed');
      }

      const data = await res.json();
      const result: ScanResult = data.result;

      if (data.logs) setLogs(prev => [...prev, ...data.logs]);
      setLogs(prev => [...prev, `✓ Scan complete! Found ${result.vulnerabilities.length} issues.`]);

      await new Promise(r => setTimeout(r, 800));
      sessionStorage.setItem('lc3shield_pending_result', JSON.stringify(result));
      router.push('/shield/results');
    } catch (e: any) {
      clearInterval(interval);
      setError(e.message || 'Scan failed. Please try again.');
      setScanning(false);
    }
  };

  return (
    <ShieldScannerLayout
      title="URL Security Scanner"
      description="Check any website for security vulnerabilities including missing headers, XSS risks, and more."
      icon={Globe}
     
    >
      <div
        className="rounded-2xl p-6 bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-white/[0.06]"
      >
        {/* Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-slate-600 dark:text-slate-400">
            Website URL to Scan
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !scanning && startScan()}
              placeholder="https://example.com"
              disabled={scanning}
              className="flex-1 rounded-xl px-4 py-3 outline-none transition-all bg-slate-100 dark:bg-[#0d1117] text-slate-900 dark:text-slate-100"
              style={{
                border: '1px solid rgba(255,255,255,0.08)',
                fontSize: '14px',
              }}
              onFocus={(e) => { e.target.style.borderColor = 'rgba(59,130,246,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.08)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
            />
            <button
              onClick={startScan}
              disabled={scanning || !url.trim()}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', boxShadow: '0 0 20px rgba(59,130,246,0.25)' }}
            >
              <Scan className="w-4 h-4" />
              {scanning ? 'Scanning...' : 'Scan'}
            </button>
          </div>
        </div>

        {/* What we check */}
        {!scanning && logs.length === 0 && (
          <div className="mb-6 rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 className="text-sm font-semibold mb-3 text-slate-800 dark:text-slate-200">What we check:</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                'HTTPS enforcement',
                'Content-Security-Policy',
                'X-Frame-Options (clickjacking)',
                'HSTS (SSL stripping)',
                'X-Content-Type-Options',
                'Referrer-Policy',
                'Permissions-Policy',
                'Mixed content warnings',
              ].map(item => (
                <div key={item} className="flex items-center gap-2 text-sm" style={{ color: '#64748b' }}>
                  <span style={{ color: '#3b82f6' }}>✓</span> {item}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Progress */}
        {scanning && <ShieldScanProgress progress={progress} logs={logs} scanning={scanning} />}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 p-4 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Example URLs */}
        {!scanning && (
          <div className="mt-4">
            <p className="text-xs mb-2 text-slate-500 dark:text-slate-500">Try an example:</p>
            <div className="flex flex-wrap gap-2">
              {['https://example.com', 'https://httpbin.org', 'https://neverssl.com'].map(ex => (
                <button
                  key={ex}
                  onClick={() => setUrl(ex)}
                  className="text-xs px-3 py-1.5 rounded-lg transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#94a3b8'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.15)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#64748b'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.08)'; }}
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </ShieldScannerLayout>
  );
}

export default function UrlScannerPage() {
  return (
    <Suspense>
      <UrlScannerContent />
    </Suspense>
  );
}
