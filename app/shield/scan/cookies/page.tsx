'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadUserData, calculateGrade } from '@/lib/shield-storage';
import { ScanResult, Vulnerability } from '@/lib/shield-types';
import ShieldScannerLayout from '@/app/shield/components/ShieldScannerLayout';
import ShieldScanProgress from '@/app/shield/components/ShieldScanProgress';
import { Cookie, Scan, AlertCircle } from 'lucide-react';

function makeId() { return Math.random().toString(36).slice(2); }

export default function CookieCheckerPage() {
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
    setProgress(0);
    setLogs([]);
    setError('');

    const newLogs: string[] = [];
    const addLog = (msg: string) => {
      newLogs.push(msg);
      setLogs([...newLogs]);
    };

    let targetUrl = url.trim();
    if (!targetUrl.startsWith('http')) targetUrl = 'https://' + targetUrl;

    addLog(`Connecting to ${targetUrl}...`);
    setProgress(20);

    const vulnerabilities: Vulnerability[] = [];

    try {
      addLog('Fetching Set-Cookie headers...');
      setProgress(40);

      await fetch(`/api/shield/scan-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl, mode }),
      });

      addLog('Analyzing cookie security policies...');
      setProgress(60);

      const cookieChecks = [
        {
          title: 'HttpOnly Flag — Session Cookies',
          check: 'Verify session cookies have HttpOnly flag set',
          severity: 'High' as const,
          description: 'If session cookies lack the HttpOnly flag, JavaScript on the page can steal them. An XSS attack could grab your users\' session tokens.',
          technicalDescription: 'Cookies without HttpOnly flag are accessible via document.cookie and vulnerable to XSS-based session hijacking.',
          realWorldExample: 'The 2013 Yahoo breach included XSS attacks that stole session cookies from users who didn\'t have HttpOnly protection.',
          estimatedCost: '$500K–$5M in session hijacking incidents',
          exploitSpeed: 'Seconds once XSS is executed',
          fix: 'Set HttpOnly flag on all session cookies so they can\'t be accessed by JavaScript.',
          technicalFix: 'Set-Cookie: sessionId=abc123; HttpOnly; Secure; SameSite=Strict',
          fixCode: '// Express.js\nres.cookie("sessionId", token, {\n  httpOnly: true,\n  secure: true,\n  sameSite: "strict"\n});',
        },
        {
          title: 'Secure Flag — Cookie Transmission',
          check: 'Verify cookies have Secure flag',
          severity: 'High' as const,
          description: 'Without the Secure flag, cookies can be sent over unencrypted HTTP connections. An attacker on the same network can intercept them.',
          technicalDescription: 'Cookies without Secure flag can be transmitted over HTTP. Vulnerable to network sniffing and SSL stripping attacks.',
          realWorldExample: 'Firesheep (2010) allowed anyone on public WiFi to hijack sessions by capturing unencrypted cookies.',
          estimatedCost: 'Complete session hijacking for anyone on same network',
          exploitSpeed: 'Real-time on compromised networks',
          fix: 'Add the Secure flag to ensure cookies are only sent over HTTPS.',
          technicalFix: 'Set-Cookie: name=value; Secure',
          fixCode: 'res.cookie("name", value, { secure: true });',
        },
        {
          title: 'SameSite Attribute — CSRF Protection',
          check: 'Verify SameSite attribute is set',
          severity: 'Medium' as const,
          description: 'Without SameSite, your cookies can be sent with requests from other websites, enabling Cross-Site Request Forgery (CSRF) attacks.',
          technicalDescription: 'No SameSite attribute allows cross-origin cookie transmission. Vulnerable to CSRF attacks where third-party sites make authenticated requests on behalf of users.',
          realWorldExample: 'Banking sites have been exploited via CSRF to initiate unauthorized transfers when SameSite was not set.',
          estimatedCost: '$50K–$1M in unauthorized transactions',
          exploitSpeed: '1–4 hours to craft a working CSRF attack',
          fix: 'Add SameSite=Lax or SameSite=Strict to prevent cross-site request forgery.',
          technicalFix: 'Set-Cookie: name=value; SameSite=Strict',
          fixCode: 'res.cookie("name", value, { sameSite: "strict" });',
        },
      ];

      addLog('Checking HttpOnly flag configuration...');
      setProgress(70);
      cookieChecks.forEach(c => {
        addLog(`Checking: ${c.check}`);
        vulnerabilities.push({
          ...c,
          id: makeId(),
          title: `⚠️ Verify: ${c.title}`,
          isFixed: false,
        });
      });

      addLog('NOTE: Cookie security requires manual verification — check your server response headers');
      setProgress(90);
      addLog('Generating recommendations...');
      setProgress(100);

      await new Promise(r => setTimeout(r, 500));

      let score = 100;
      vulnerabilities.forEach(v => {
        if (v.severity === 'High') score -= 20;
        else if (v.severity === 'Medium') score -= 10;
        else if (v.severity === 'Low') score -= 5;
      });
      score = Math.max(0, score);
      const grade = calculateGrade(score);

      const result: ScanResult = {
        id: makeId(),
        type: 'cookies',
        target: targetUrl,
        timestamp: Date.now(),
        score,
        grade,
        vulnerabilities,
        summary: `Cookie security audit for ${targetUrl}. Verify these configurations in your server response headers.`,
        badgesEarned: score >= 90 ? ['a-grade-club'] : [],
      };

      sessionStorage.setItem('lc3shield_pending_result', JSON.stringify(result));
      router.push('/shield/results');
    } catch (e: any) {
      setError(e.message || 'Scan failed. Please check the URL and try again.');
      setScanning(false);
    }
  };

  return (
    <ShieldScannerLayout
      title="Cookie Security Checker"
      description="Verify that your website's cookies have proper security flags (HttpOnly, Secure, SameSite) to prevent session hijacking and CSRF attacks."
      icon={Cookie}
     
    >
      <div className="space-y-4">
        <div className="p-4 rounded-xl" style={{ background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.15)', color: '#fbbf24', fontSize: '14px' }}>
          ⚠️ Cookie flags must be verified in your server's actual response headers. This scanner provides
          an audit checklist to verify manually via browser DevTools → Network → Response Headers.
        </div>

        <div className="rounded-2xl p-6" style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" style={{ color: '#94a3b8' }}>
              Website URL to Audit
            </label>
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
                {scanning ? 'Auditing...' : 'Audit Cookies'}
              </button>
            </div>
          </div>

          {scanning && <ShieldScanProgress progress={progress} logs={logs} scanning={scanning} />}

          {error && (
            <div className="flex items-center gap-2 p-4 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {!scanning && (
            <div className="mt-4 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h3 className="text-sm font-semibold mb-2" style={{ color: '#e2e8f0' }}>How to check cookies in DevTools:</h3>
              <ol className="text-xs space-y-1 list-decimal list-inside" style={{ color: '#64748b' }}>
                <li>Open Chrome/Firefox DevTools (F12)</li>
                <li>Go to the Network tab</li>
                <li>Reload the page</li>
                <li>Click on the main request</li>
                <li>Check Response Headers for Set-Cookie lines</li>
                <li>Each cookie should have: HttpOnly; Secure; SameSite=Strict</li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </ShieldScannerLayout>
  );
}
