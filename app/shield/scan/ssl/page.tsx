'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadUserData } from '@/lib/shield-storage';
import ShieldScannerLayout from '@/app/shield/components/ShieldScannerLayout';
import ShieldScanProgress from '@/app/shield/components/ShieldScanProgress';
import { Lock, Scan, AlertCircle } from 'lucide-react';

const SCAN_STEPS = [
  'Connecting to server on port 443...',
  'Initiating TLS handshake...',
  'Reading certificate details...',
  'Checking certificate trust chain...',
  'Verifying expiration date...',
  'Identifying TLS protocol version...',
  'Checking cipher suite strength...',
  'Fetching HTTP response headers...',
  'Checking HSTS configuration...',
  'Generating security report...',
];

const SSL_CHECKS = [
  { icon: '🔒', title: 'Certificate Valid', desc: 'Trusted CA signature' },
  { icon: '📅', title: 'Expiry Date', desc: 'Days until expiration' },
  { icon: '🔐', title: 'TLS Version', desc: 'Flags 1.0 and 1.1' },
  { icon: '🔑', title: 'Cipher Suites', desc: 'Weak cipher detection' },
  { icon: '🛡️', title: 'HSTS Header', desc: 'SSL stripping protection' },
  { icon: '🏛️', title: 'Trust Chain', desc: 'Certificate authority chain' },
];

export default function SslScannerPage() {
  const router = useRouter();
  const [domain, setDomain] = useState('');
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
    if (!domain.trim()) return;
    setScanning(true);
    setProgress(0);
    setLogs([]);
    setError('');

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < SCAN_STEPS.length) {
        setLogs(prev => [...prev, SCAN_STEPS[stepIndex]]);
        setProgress(Math.round(((stepIndex + 1) / SCAN_STEPS.length) * 80));
        stepIndex++;
      }
    }, 700);

    try {
      const res = await fetch('/api/shield/check-ssl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: domain.trim() }),
      });

      clearInterval(interval);
      setProgress(100);

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'SSL check failed');
      }

      const data = await res.json();
      if (data.logs) setLogs(data.logs);

      await new Promise(r => setTimeout(r, 500));
      sessionStorage.setItem('lc3shield_pending_result', JSON.stringify(data.result));
      router.push('/shield/results');
    } catch (e: any) {
      clearInterval(interval);
      setError(e.message || 'SSL check failed. Please verify the domain.');
      setScanning(false);
    }
  };

  return (
    <ShieldScannerLayout
      title="SSL/TLS Certificate Checker"
      description="Verify your SSL certificate validity, TLS version, cipher strength, and HSTS configuration."
      icon={Lock}
     
    >
      <div className="space-y-4">
        <div className="rounded-2xl p-6" style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" style={{ color: '#94a3b8' }}>
              Domain Name
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !scanning && startScan()}
                placeholder="example.com (without https://)"
                disabled={scanning}
                className="flex-1 rounded-xl px-4 py-3 outline-none transition-all"
                style={{
                  background: '#0d1117',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#e2e8f0',
                  fontSize: '14px',
                }}
                onFocus={(e) => { e.target.style.borderColor = 'rgba(59,130,246,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.08)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
              />
              <button
                onClick={startScan}
                disabled={scanning || !domain.trim()}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', boxShadow: '0 0 20px rgba(59,130,246,0.25)' }}
              >
                <Scan className="w-4 h-4" />
                {scanning ? 'Checking...' : 'Check SSL'}
              </button>
            </div>
          </div>

          {!scanning && logs.length === 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {SSL_CHECKS.map(({ icon, title, desc }) => (
                <div
                  key={title}
                  className="p-3 rounded-lg text-center"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <div className="text-2xl mb-1">{icon}</div>
                  <div className="text-xs font-medium" style={{ color: '#94a3b8' }}>{title}</div>
                  <div className="text-xs" style={{ color: '#64748b' }}>{desc}</div>
                </div>
              ))}
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

        {!scanning && (
          <div className="p-4 rounded-xl text-sm" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', color: '#64748b' }}>
            <strong style={{ color: '#e2e8f0' }}>Pro tip:</strong> Set up certificate auto-renewal with Let's Encrypt to avoid expired certificates.
            Use <code style={{ color: '#60a5fa', background: 'rgba(255,255,255,0.06)', padding: '0 4px', borderRadius: '4px' }}>certbot renew --force-renewal</code> or
            add a cron job to automatically renew before expiry.
          </div>
        )}
      </div>
    </ShieldScannerLayout>
  );
}
