import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'LC3 Shield — Security Scanner';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function ShieldOGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #080d18 0%, #0d1020 50%, #080d18 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(239,68,68,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.04) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 32,
            fontSize: 40,
          }}
        >
          🛡️
        </div>
        <div style={{ fontSize: 62, fontWeight: 900, color: 'white', marginBottom: 16, letterSpacing: '-2px' }}>
          LC3 Shield
        </div>
        <div style={{ fontSize: 24, color: '#94a3b8', maxWidth: 650, textAlign: 'center', lineHeight: 1.5 }}>
          AI-powered cybersecurity scanner for LC3 Club members. Powered by Claude.
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 40 }}>
          {['URL Scanner', 'Code Analysis', 'GitHub Audit', 'OWASP Top 10'].map((tag) => (
            <div
              key={tag}
              style={{
                background: 'rgba(239,68,68,0.12)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 8,
                padding: '6px 16px',
                fontSize: 18,
                color: '#fca5a5',
              }}
            >
              {tag}
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', bottom: 32, fontSize: 16, color: '#475569' }}>
          LC3 - Lowcode Cloud Club · College of Southern Nevada
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
