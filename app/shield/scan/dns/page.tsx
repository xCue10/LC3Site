'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadUserData, consumeScan } from '@/lib/shield-storage';
import ShieldScannerLayout from '@/app/shield/components/ShieldScannerLayout';
import ShieldScanProgress from '@/app/shield/components/ShieldScanProgress';
import { Globe, Scan, AlertCircle } from 'lucide-react';

const SCAN_STEPS = [
  'Resolving domain DNS records...',
  'Checking SPF (Sender Policy Framework)...',
  'Validating SPF policy strictness...',
  'Checking DMARC record at _dmarc subdomain...',
  'Analyzing DMARC policy enforcement...',
  'Checking DKIM with common selectors...',
  'Testing DNSSEC delegation...',
  'Generating recommendations...',
];

const DNS_RECORDS = [
  { name: 'SPF', desc: 'Prevents anyone from sending email pretending to be from your domain', color: '#60a5fa', bg: 'rgba(59,130,246,0.05)', border: 'rgba(59,130,246,0.15)' },
  { name: 'DMARC', desc: 'Tells mail servers what to do with fake emails from your domain', color: '#a78bfa', bg: 'rgba(139,92,246,0.05)', border: 'rgba(139,92,246,0.15)' },
  { name: 'DKIM', desc: 'Adds a digital signature to prove your emails are legitimate', color: '#4ade80', bg: 'rgba(34,197,94,0.05)', border: 'rgba(34,197,94,0.15)' },
  { name: 'DNSSEC', desc: 'Prevents attackers from redirecting your domain traffic', color: '#fb923c', bg: 'rgba(249,115,22,0.05)', border: 'rgba(249,115,22,0.15)' },
];

export default function DnsScannerPage() {
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
        setProgress(Math.round(((stepIndex + 1) / SCAN_STEPS.length) * 75));
        stepIndex++;
      }
    }, 800);

    try {
      const res = await fetch('/api/shield/check-dns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: domain.trim(), mode }),
      });

      clearInterval(interval);
      setProgress(100);

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'DNS check failed');
      }

      const data = await res.json();
      if (data.logs) setLogs(data.logs);

      await new Promise(r => setTimeout(r, 500));
      sessionStorage.setItem('lc3shield_pending_result', JSON.stringify(data.result));
      router.push('/shield/results');
    } catch (e: any) {
      clearInterval(interval);
      setError(e.message || 'DNS check failed. Please verify the domain name.');
      setScanning(false);
    }
  };

  return (
    <ShieldScannerLayout
      title="DNS Security Checker"
      description="Check SPF, DMARC, DKIM, and DNSSEC records to prevent email spoofing and domain hijacking."
      icon={Globe}
     
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
                {scanning ? 'Checking...' : 'Check DNS'}
              </button>
            </div>
          </div>

          {!scanning && logs.length === 0 && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {DNS_RECORDS.map(({ name, desc, color, bg, border }) => (
                  <div key={name} className="p-3 rounded-lg" style={{ background: bg, border: `1px solid ${border}` }}>
                    <div className="font-bold text-sm mb-1" style={{ color }}>{name}</div>
                    <div className="text-xs" style={{ color: '#64748b' }}>{desc}</div>
                  </div>
                ))}
              </div>
              <div className="p-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' }}>
                <p className="text-xs" style={{ color: '#f87171' }}>
                  🚨 Without proper email authentication, anyone can send emails pretending to be from your domain.
                  This enables phishing attacks that trick your customers and damage your brand.
                </p>
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
      </div>
    </ShieldScannerLayout>
  );
}
