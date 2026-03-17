import { ImageResponse } from 'next/og';
import { readJSON, Post } from '@/lib/data';

export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = readJSON<Post[]>('posts.json').find((p) => p.slug === slug && p.published);

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0d1424 0%, #111a2e 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #7c3aed)',
              borderRadius: '12px',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '14px',
            }}
          >
            LC3
          </div>
          <span style={{ color: '#94a3b8', fontSize: '18px' }}>LC3 Blog</span>
        </div>

        {/* Post title */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ color: '#6366f1', fontSize: '18px', marginBottom: '16px', fontWeight: '600' }}>
            Blog Post
          </div>
          <div
            style={{
              color: 'white',
              fontSize: post && post.title.length > 60 ? '44px' : '56px',
              fontWeight: 'bold',
              lineHeight: 1.2,
              marginBottom: '24px',
            }}
          >
            {post?.title ?? 'LC3 Blog'}
          </div>
          {post?.excerpt && (
            <div style={{ color: '#94a3b8', fontSize: '22px', lineHeight: 1.5 }}>
              {post.excerpt.length > 120 ? post.excerpt.slice(0, 120) + '…' : post.excerpt}
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '48px' }}>
          <span style={{ color: '#475569', fontSize: '16px' }}>
            {post?.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
              : ''}
          </span>
          <span style={{ color: '#475569', fontSize: '16px' }}>lc3.club</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
