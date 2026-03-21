'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadUserData } from '@/lib/shield-storage';
import ShieldScannerLayout from '@/app/shield/components/ShieldScannerLayout';
import ShieldScanProgress from '@/app/shield/components/ShieldScanProgress';
import { FileSearch, Scan, AlertCircle } from 'lucide-react';

export default function SensitiveFilesPage() {
  const router = useRouter();
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
  }, [router]);

  const startScan = async () => {
    if (!url.trim()) return;
    setScanning(true);
    setProgress(10);
    setLogs(['Starting sensitive file scan...']);
    setError('');

    const interval = setInterval(() => {
      setProgress(p => Math.min(p + 3, 90));
    }, 1000);

    try {
      const res = await fetch('/api/shield/check-sensitive-files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });

      clearInterval(interval);
      setProgress(100);

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Scan failed');
      }

      const data = await res.json();
      if (data.logs) setLogs(data.logs);

      await new Promise(r => setTimeout(r, 500));
      sessionStorage.setItem('lc3shield_pending_result', JSON.stringify(data.result));
      router.push('/shield/results');
    } catch (e: any) {
      clearInterval(interval);
      setError(e.message || 'Scan failed. Please check the URL.');
      setScanning(false);
    }
  };

  const sensitiveFiles = [
    '/.env', '/.env.local', '/.env.production',
    '/config.json', '/.git/config', '/.git/HEAD',
    '/admin', '/wp-admin/', '/phpinfo.php',
    '/backup.zip', '/backup.sql', '/database.sql',
    '/.htaccess', '/.DS_Store', '/server-status',
  ];

  return (
    <ShieldScannerLayout
      title="Sensitive File Checker"
      description="Check if critical files like .env, .git, and config files are accidentally exposed to the public internet."
      icon={FileSearch}
     
    >
      <div className="space-y-4">
        <div className="p-4 rounded-xl" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' }}>
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#f87171' }} />
            <div>
              <h3 className="text-sm font-semibold mb-1" style={{ color: '#f87171' }}>Critical Security Check</h3>
              <p className="text-xs" style={{ color: '#64748b' }}>
                Exposed files like{' '}
                <code style={{ color: '#fca5a5' }}>.env</code> or{' '}
                <code style={{ color: '#fca5a5' }}>.git</code> can give attackers
                your database passwords, API keys, and full source code.
                Automated scanners search for these 24/7.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl p-6" style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" style={{ color: '#94a3b8' }}>Website URL to Check</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !scanning && startScan()}
                placeholder="https://example.com"
                disabled={scanning}
                className="flex-1 rounded-xl px-4 py-3 outline-none transition-all"
                style={{
                  background: '#0d1117',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#e2e8f0',
                  fontSize: '14px',
                }}
                onFocus={(e) => { e.target.style.borderColor = 'rgba(239,68,68,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.08)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
              />
              <button
                onClick={startScan}
                disabled={scanning || !url.trim()}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #ef4444, #b91c1c)', boxShadow: '0 0 20px rgba(239,68,68,0.25)' }}
              >
                <Scan className="w-4 h-4" />
                {scanning ? 'Scanning...' : 'Scan Files'}
              </button>
            </div>
          </div>

          {!scanning && logs.length === 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-3" style={{ color: '#e2e8f0' }}>Files we check ({sensitiveFiles.length} paths):</h3>
              <div className="flex flex-wrap gap-2">
                {sensitiveFiles.map(f => (
                  <code
                    key={f}
                    className="text-xs px-2 py-1 rounded"
                    style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', color: '#fca5a5', fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {f}
                  </code>
                ))}
              </div>
            </div>
          )}

          {scanning && <ShieldScanProgress progress={progress} logs={logs} scanning={scanning} />}

          {error && (
            <div className="flex items-center gap-2 p-4 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}
        </div>

        <div className="p-4 rounded-xl text-sm" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', color: '#64748b' }}>
          <strong style={{ color: '#e2e8f0' }}>How to block these files:</strong>
          <pre
            className="mt-2 text-xs overflow-x-auto p-3 rounded-lg"
            style={{ background: 'rgba(0,0,0,0.4)', color: '#4ade80', fontFamily: "'JetBrains Mono', monospace" }}
          >
{`# nginx - Add to server block:
location ~ /\\.env { deny all; }
location ~ /\\.git { deny all; }
location ~ /backup { deny all; }

# Apache .htaccess:
<FilesMatch "^\\.(env|git|htaccess)">
  Order allow,deny
  Deny from all
</FilesMatch>`}
          </pre>
        </div>
      </div>
    </ShieldScannerLayout>
  );
}
