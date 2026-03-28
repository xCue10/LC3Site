import type { Metadata } from 'next';
import Link from 'next/link';
import { readJSON, Post } from '@/lib/data';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Announcements, updates, and news from LC3 - Lowcode Cloud Club.',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function BlogPage() {
  const posts = readJSON<Post[]>('posts.json').filter((p) => p.published);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200 dark:border-[#1e2d45]">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50/60 via-purple-50/30 to-transparent dark:from-violet-950/20 dark:via-purple-950/10 dark:to-transparent pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-400/40 to-transparent pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-violet-300/8 dark:bg-violet-500/8 rounded-full blur-3xl pointer-events-none" style={{animation:'hero-float-a 10s ease-in-out infinite'}} />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-18">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Left: text */}
            <div>
              <p className="text-violet-600 dark:text-violet-400 text-sm font-medium mb-2">What&apos;s new</p>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">Club Updates</h1>
              <p className="text-slate-500 leading-relaxed">Announcements, recaps, and news from the LC3 community.</p>
              {posts.length > 0 && (
                <span className="inline-flex mt-4 bg-violet-50 border border-violet-200 text-violet-600 text-xs font-medium px-2.5 py-1 rounded-full dark:bg-violet-500/10 dark:border-violet-500/20 dark:text-violet-400">
                  {posts.length} post{posts.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            {/* Right: SVG */}
            <div className="flex justify-center md:justify-end overflow-hidden">
          <svg width="320" height="140" viewBox="0 0 320 140" fill="none" className="opacity-90 dark:opacity-80" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <style>{`
                @keyframes blog-dash { to { stroke-dashoffset: -22; } }
                @keyframes blog-spark { 0%,100%{opacity:0.3;transform:scale(0.9)} 50%{opacity:0.85;transform:scale(1.1)} }
                @keyframes blog-corner { 0%,100%{opacity:0.35} 50%{opacity:0.8} }
                @keyframes blog-wave { 0%,100%{opacity:0.15;transform:scale(0.95)} 50%{opacity:0.55;transform:scale(1.05)} }
                @keyframes blog-ring { 0%,100%{opacity:0.1} 50%{opacity:0.35} }
                @keyframes blog-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
                @keyframes blog-blink { 0%,100%{opacity:0.7} 50%{opacity:1} }
              `}</style>
              <radialGradient id="blog-g1" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.35"/>
                <stop offset="100%" stopColor="#7c3aed" stopOpacity="0"/>
              </radialGradient>
              <radialGradient id="blog-g2" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.28"/>
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0"/>
              </radialGradient>
              <radialGradient id="blog-g3" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#0891b2" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="#0891b2" stopOpacity="0"/>
              </radialGradient>
            </defs>

            {/* Corner brackets */}
            <path d="M8 8 L8 22 M8 8 L22 8" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5" strokeLinecap="round" style={{animation:'blog-corner 3s ease-in-out infinite'}}/>
            <path d="M312 8 L312 22 M312 8 L298 8" stroke="rgba(8,145,178,0.4)" strokeWidth="1.5" strokeLinecap="round" style={{animation:'blog-corner 3s ease-in-out infinite 0.75s'}}/>
            <path d="M8 132 L8 118 M8 132 L22 132" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5" strokeLinecap="round" style={{animation:'blog-corner 3s ease-in-out infinite 1.5s'}}/>
            <path d="M312 132 L312 118 M312 132 L298 132" stroke="rgba(8,145,178,0.4)" strokeWidth="1.5" strokeLinecap="round" style={{animation:'blog-corner 3s ease-in-out infinite 2.25s'}}/>

            {/* Animated dashed baseline */}
            <line x1="48" y1="70" x2="272" y2="70" stroke="rgba(99,102,241,0.1)" strokeWidth="2"/>
            <line x1="48" y1="70" x2="272" y2="70" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5" strokeDasharray="6 6" style={{animation:'blog-dash 1s linear infinite'}}/>

            {/* Main document */}
            <circle cx="120" cy="70" r="38" fill="url(#blog-g1)"/>
            <rect x="88" y="36" width="64" height="80" rx="6" fill="rgba(124,58,237,0.07)" stroke="rgba(99,102,241,0.55)" strokeWidth="1.5" style={{animation:'blog-float 3s ease-in-out infinite', transformOrigin:'120px 76px'}}/>
            <rect x="88" y="36" width="64" height="16" rx="6" fill="rgba(99,102,241,0.12)"/>
            <rect x="88" y="44" width="64" height="8" fill="rgba(99,102,241,0.08)"/>
            {/* Text lines on document */}
            <rect x="97" y="62" width="46" height="2.5" rx="1.2" fill="rgba(99,102,241,0.5)"/>
            <rect x="97" y="69" width="36" height="2.5" rx="1.2" fill="rgba(129,140,248,0.4)"/>
            <rect x="97" y="76" width="42" height="2.5" rx="1.2" fill="rgba(99,102,241,0.35)"/>
            <rect x="97" y="83" width="28" height="2.5" rx="1.2" fill="rgba(8,145,178,0.4)"/>
            <rect x="97" y="90" width="38" height="2.5" rx="1.2" fill="rgba(99,102,241,0.3)"/>
            <rect x="97" y="97" width="20" height="2.5" rx="1.2" fill="rgba(129,140,248,0.3)"/>

            {/* Pen / nib element floating upper right */}
            <circle cx="200" cy="50" r="22" fill="url(#blog-g2)"/>
            <circle cx="200" cy="50" r="14" fill="rgba(99,102,241,0.1)" stroke="rgba(99,102,241,0.5)" strokeWidth="1.5" style={{animation:'blog-wave 2.8s ease-in-out infinite'}}/>
            <path d="M194 57 L200 43 L206 57 L200 55.5 Z" fill="none" stroke="rgba(129,140,248,0.8)" strokeWidth="1.5" strokeLinejoin="round" style={{animation:'blog-float 2.5s ease-in-out infinite', transformOrigin:'200px 50px'}}/>
            <circle cx="200" cy="50" r="3" fill="#818cf8" opacity="0.7"/>

            {/* Sparkle / publish badge */}
            <circle cx="245" cy="88" r="20" fill="url(#blog-g3)"/>
            <circle cx="245" cy="88" r="13" fill="rgba(8,145,178,0.1)" stroke="rgba(8,145,178,0.45)" strokeWidth="1.5"/>
            <rect x="232" y="82" width="26" height="12" rx="4" fill="rgba(8,145,178,0.75)" style={{animation:'blog-blink 2s ease-in-out infinite', transformOrigin:'245px 88px'}}/>
            <text x="245" y="90.5" textAnchor="middle" fill="white" fontSize="6.5" fontFamily="monospace" fontWeight="700">PUBLISH</text>

            {/* Floating dots */}
            <circle cx="155" cy="38" r="3.5" fill="#6366f1" opacity="0.5" style={{animation:'blog-float 2.2s ease-in-out infinite'}}/>
            <circle cx="265" cy="55" r="2.5" fill="#0891b2" opacity="0.55" style={{animation:'blog-float 3.1s ease-in-out infinite 0.5s'}}/>

            {/* Sparkle dots */}
            <circle cx="26" cy="26" r="2.5" fill="#6366f1" opacity="0.65" style={{animation:'blog-spark 2.3s ease-in-out infinite'}}/>
            <circle cx="293" cy="24" r="2" fill="#0891b2" opacity="0.6" style={{animation:'blog-spark 2.3s ease-in-out infinite 0.7s'}}/>
            <circle cx="26" cy="114" r="2" fill="#818cf8" opacity="0.6" style={{animation:'blog-spark 2.3s ease-in-out infinite 1.4s'}}/>
            <circle cx="293" cy="114" r="2.5" fill="#0891b2" opacity="0.65" style={{animation:'blog-spark 2.3s ease-in-out infinite 2.1s'}}/>
          </svg>
            </div>
          </div>
        </div>
      </section>
      {/* Posts */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      {posts.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <svg className="w-10 h-10 mx-auto mb-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          No posts yet — check back soon!
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="relative flex items-center gap-4 bg-white border border-slate-200 rounded-2xl p-4 hover:border-violet-200 hover:shadow-sm transition-all group dark:bg-[#0d1424] dark:border-[#1e2d45] dark:hover:border-violet-500/30 overflow-hidden"
            >
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.03] dark:opacity-[0.045]" viewBox="0 0 400 88" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                {([14, 34, 54, 74] as number[]).flatMap((y) =>
                  ([16, 52, 88, 124, 160, 196, 232, 268, 304, 340, 376] as number[]).map((x) => (
                    <circle key={`${x}-${y}`} cx={x} cy={y} r="1.5" fill="#6366f1"/>
                  ))
                )}
              </svg>
              {/* Thumbnail */}
              {post.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.coverImage} alt={post.title} className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover flex-shrink-0 bg-slate-100 dark:bg-[#111a2e]" />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl flex-shrink-0 bg-gradient-to-br from-violet-100 to-blue-100 dark:from-violet-500/10 dark:to-blue-500/10 flex items-center justify-center">
                  <svg className="w-7 h-7 text-violet-400 dark:text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <span className="text-xs text-slate-400">{formatDate(post.publishedAt)}</span>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white mt-0.5 mb-1 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors line-clamp-1">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
                )}
              </div>

              {/* Arrow */}
              <svg className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
