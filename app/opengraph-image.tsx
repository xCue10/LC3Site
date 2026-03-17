import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'LC3 - Lowcode Cloud Club';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0a1020 0%, #0f1a35 50%, #1a0835 100%)',
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
        {/* Dot grid overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(99,102,241,0.25) 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Glow accents */}
        <div style={{ position: 'absolute', top: -100, left: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: -100, right: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)' }} />

        {/* Logo badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 80,
            height: 80,
            borderRadius: 20,
            background: 'linear-gradient(135deg, #3b82f6, #7c3aed)',
            color: 'white',
            fontSize: 26,
            fontWeight: 'bold',
            marginBottom: 32,
            boxShadow: '0 0 40px rgba(124,58,237,0.4)',
          }}
        >
          LC3
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 'bold',
            color: 'white',
            marginBottom: 16,
            textAlign: 'center',
            padding: '0 60px',
            lineHeight: 1.1,
          }}
        >
          Lowcode Cloud Club
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 26,
            color: '#94a3b8',
            textAlign: 'center',
            marginBottom: 40,
          }}
        >
          Building the future, one project at a time.
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', gap: 12 }}>
          {['Power Platform', 'Azure', 'React', 'Python'].map((tag) => (
            <div
              key={tag}
              style={{
                background: 'rgba(99,102,241,0.15)',
                border: '1px solid rgba(99,102,241,0.3)',
                color: '#a5b4fc',
                padding: '8px 18px',
                borderRadius: 999,
                fontSize: 16,
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
