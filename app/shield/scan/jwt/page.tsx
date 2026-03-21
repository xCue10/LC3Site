'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadUserData } from '@/lib/shield-storage';
import ShieldScannerLayout from '@/app/shield/components/ShieldScannerLayout';
import { Key, Scan, AlertCircle, Loader2, Eye } from 'lucide-react';

const EXAMPLE_JWT = 'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJ1c2VySWQiOiIxMjMiLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJwYXNzd29yZCI6InN1cGVyc2VjcmV0MTIzIiwicm9sZSI6InVzZXIifQ.';

export default function JwtAnalyzerPage() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'beginner' | 'advanced'>('beginner');

  useEffect(() => {
    const data = loadUserData();
    if (!data) { router.push('/shield/login'); return; }
    setMode(data.mode);
  }, [router]);

  const startScan = async () => {
    if (!token.trim()) return;
    setScanning(true);
    setError('');

    try {
      const res = await fetch('/api/shield/analyze-jwt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token.trim(), mode }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Analysis failed');
      }

      const data = await res.json();
      sessionStorage.setItem('lc3shield_pending_result', JSON.stringify(data.result));
      router.push('/shield/results');
    } catch (e: any) {
      setError(e.message || 'Analysis failed. Make sure you pasted a valid JWT token.');
      setScanning(false);
    }
  };

  return (
    <ShieldScannerLayout
      title="JWT Token Analyzer"
      description="Decode and analyze JWT tokens for security vulnerabilities like weak algorithms, missing expiry, and sensitive data exposure."
      icon={Key}
     
    >
      <div className="space-y-4">
        {/* Explainer */}
        <div className="p-4 rounded-xl" style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 className="text-sm font-semibold mb-2" style={{ color: '#e2e8f0' }}>What is a JWT?</h3>
          <p className="text-xs" style={{ color: '#64748b' }}>
            {mode === 'beginner'
              ? "A JWT (JSON Web Token) is like a digital ID card your app gives to logged-in users. It contains information about who they are and what they're allowed to do. But if it's not set up correctly, attackers can forge fake ones!"
              : "JWT (JSON Web Token) is an RFC 7519 standard for securely transmitting claims as a JSON object. The token is base64url-encoded and optionally signed/encrypted. Security depends on algorithm strength, key security, and claim validation."}
          </p>
        </div>

        {/* JWT format guide */}
        <div className="flex items-center gap-1 text-xs font-mono overflow-x-auto">
          <span className="px-2 py-1 rounded" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>HEADER</span>
          <span style={{ color: '#64748b' }}>.</span>
          <span className="px-2 py-1 rounded" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', color: '#60a5fa' }}>PAYLOAD</span>
          <span style={{ color: '#64748b' }}>.</span>
          <span className="px-2 py-1 rounded" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', color: '#4ade80' }}>SIGNATURE</span>
        </div>

        {/* Token input */}
        <div className="rounded-xl overflow-hidden" style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
          >
            <span className="text-xs font-mono" style={{ color: '#94a3b8' }}>JWT Token</span>
            <button
              onClick={() => setToken(EXAMPLE_JWT)}
              className="text-xs transition-colors"
              style={{ color: '#60a5fa' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#93c5fd'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#60a5fa'; }}
            >
              Load vulnerable example
            </button>
          </div>
          <textarea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder={"Paste your JWT token here...\n\nExample format:\neyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMifQ.abc123..."}
            disabled={scanning}
            rows={6}
            className="w-full px-4 py-4 outline-none resize-none break-all"
            style={{
              background: 'transparent',
              color: '#e2e8f0',
              fontSize: '13px',
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            }}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={startScan}
            disabled={scanning || !token.trim()}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', boxShadow: '0 0 20px rgba(59,130,246,0.25)' }}
          >
            {scanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Scan className="w-4 h-4" />}
            {scanning ? 'Analyzing...' : 'Analyze JWT'}
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-4 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* What we check */}
        <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h3 className="text-sm font-semibold mb-3" style={{ color: '#e2e8f0' }}>What we analyze:</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              'Algorithm (alg:none attack)',
              'Missing expiration (exp)',
              'Token age and validity',
              'Missing issuer/audience',
              'Sensitive data in payload',
              'Signature algorithm strength',
            ].map(item => (
              <div key={item} className="flex items-center gap-2 text-xs" style={{ color: '#64748b' }}>
                <Eye className="w-3 h-3 shrink-0" style={{ color: '#3b82f6' }} /> {item}
              </div>
            ))}
          </div>
          <p className="text-xs mt-3" style={{ color: '#64748b' }}>
            ⚠️ Note: JWTs are base64-encoded, NOT encrypted. Anyone with the token can read the payload.
            Never store passwords or sensitive data in JWT payloads!
          </p>
        </div>
      </div>
    </ShieldScannerLayout>
  );
}
