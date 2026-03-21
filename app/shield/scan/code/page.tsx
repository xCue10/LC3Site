'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadUserData, consumeScan } from '@/lib/shield-storage';
import ShieldScannerLayout from '@/app/shield/components/ShieldScannerLayout';
import { Code2, Scan, AlertCircle, Loader2 } from 'lucide-react';

const LANGUAGES = ['JavaScript', 'TypeScript', 'Python', 'PHP', 'Java', 'Go', 'Ruby', 'General'];

const EXAMPLE_CODE = `// Example: Paste your code here to scan for vulnerabilities
const express = require('express');
const app = express();
const db = require('./database');

// ⚠️ Vulnerable: SQL injection risk
app.get('/user', async (req, res) => {
  const userId = req.query.id;
  const user = await db.query('SELECT * FROM users WHERE id = ' + userId);
  res.json(user);
});

// ⚠️ Vulnerable: Hardcoded API key
const STRIPE_KEY = 'sk_live_abc123secretkey789';

// ⚠️ Vulnerable: Eval usage
app.post('/calc', (req, res) => {
  const result = eval(req.body.expression);
  res.json({ result });
});`;

export default function CodeScannerPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('JavaScript');
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'beginner' | 'advanced'>('beginner');

  useEffect(() => {
    const data = loadUserData();
    if (!data) { router.push('/shield/login'); return; }
    setMode(data.mode);
  }, [router]);

  const startScan = async () => {
    if (!code.trim()) return;
    if (!consumeScan()) {
      setError('Daily scan limit reached (10 scans/day). Come back tomorrow!');
      setScanning(false);
      return;
    }
    setScanning(true);
    setError('');

    try {
      const res = await fetch('/api/shield/scan-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim(), language, mode }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Scan failed');
      }

      const data = await res.json();
      sessionStorage.setItem('lc3shield_pending_result', JSON.stringify(data.result));
      router.push('/shield/results');
    } catch (e: any) {
      setError(e.message || 'Scan failed. Please try again.');
      setScanning(false);
    }
  };

  return (
    <ShieldScannerLayout
      title="Code Security Scanner"
      description="Paste any code and Claude AI will analyze it for security vulnerabilities, exposed secrets, and unsafe patterns."
      icon={Code2}
     
    >
      <div className="space-y-4">
        {/* Language selector */}
        <div className="flex items-center gap-3">
          <span className="text-sm" style={{ color: '#64748b' }}>Language:</span>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map(lang => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className="px-3 py-1 rounded-full text-xs font-medium transition-all"
                style={
                  language === lang
                    ? { background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: '#fff' }
                    : { background: 'rgba(255,255,255,0.04)', color: '#64748b', border: '1px solid rgba(255,255,255,0.08)' }
                }
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Code input */}
        <div className="rounded-xl overflow-hidden" style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
          >
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(239,68,68,0.5)' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(234,179,8,0.5)' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(34,197,94,0.5)' }} />
            </div>
            <span className="text-xs font-mono" style={{ color: '#94a3b8' }}>{language.toLowerCase()}</span>
            <button
              onClick={() => setCode(EXAMPLE_CODE)}
              className="text-xs transition-colors"
              style={{ color: '#60a5fa' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#93c5fd'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#60a5fa'; }}
            >
              Load example
            </button>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={`Paste your ${language} code here...\n\nThe AI will scan for:\n• Exposed API keys and secrets\n• SQL injection risks\n• Hardcoded passwords\n• Insecure functions (eval, exec)\n• Input validation issues\n• And much more...`}
            disabled={scanning}
            rows={20}
            className="w-full px-4 py-4 outline-none resize-none"
            style={{
              background: 'transparent',
              color: '#e2e8f0',
              fontSize: '13px',
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            }}
          />
        </div>

        {/* Scan button */}
        <div className="flex items-center gap-3">
          <button
            onClick={startScan}
            disabled={scanning || !code.trim()}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', boxShadow: '0 0 20px rgba(59,130,246,0.25)' }}
          >
            {scanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Scan className="w-4 h-4" />}
            {scanning ? 'Claude AI is analyzing...' : 'Scan Code'}
          </button>
          {scanning && (
            <span className="text-sm" style={{ color: '#94a3b8', animation: 'pulse 2s ease-in-out infinite' }}>
              This may take 15–30 seconds for Claude to analyze your code...
            </span>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 p-4 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* What we scan for */}
        <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h3 className="text-sm font-semibold mb-3" style={{ color: '#e2e8f0' }}>What Claude AI scans for:</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {[
              'Exposed API keys & secrets',
              'SQL injection vulnerabilities',
              'Hardcoded passwords',
              'Unsafe eval() usage',
              'Command injection risks',
              'Input validation issues',
              'Insecure randomness',
              'Prototype pollution',
              'XSS vulnerabilities',
              'Path traversal risks',
              'Insecure deserialization',
              'SSRF vulnerabilities',
            ].map(item => (
              <div key={item} className="flex items-center gap-2 text-xs" style={{ color: '#64748b' }}>
                <span style={{ color: '#3b82f6' }}>●</span> {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </ShieldScannerLayout>
  );
}
