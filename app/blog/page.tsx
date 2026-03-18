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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-12">
        <svg width="72" height="72" viewBox="0 0 72 72" className="mx-auto mb-5 opacity-85 dark:opacity-75" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <style>{`
              @keyframes blog-wave { 0%,100%{opacity:0.15;transform:scale(0.95)} 50%{opacity:0.55;transform:scale(1.05)} }
              @keyframes blog-spark { 0%,100%{opacity:0.3} 50%{opacity:0.9} }
            `}</style>
          </defs>
          <circle cx="36" cy="36" r="33" fill="#7c3aed" fillOpacity="0.07" stroke="#7c3aed" strokeWidth="1" strokeOpacity="0.3"/>
          {/* Signal waves */}
          <circle cx="36" cy="36" r="28" fill="none" stroke="#6366f1" strokeWidth="0.8" strokeOpacity="0.2" style={{animation:'blog-wave 2.8s ease-in-out infinite'}}/>
          <circle cx="36" cy="36" r="20" fill="none" stroke="#6366f1" strokeWidth="1" strokeOpacity="0.25" style={{animation:'blog-wave 2.8s ease-in-out infinite 0.7s'}}/>
          {/* Document */}
          <rect x="22" y="18" width="28" height="36" rx="4" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeOpacity="0.7"/>
          <rect x="22" y="18" width="28" height="10" rx="4" fill="#6366f1" fillOpacity="0.15"/>
          <rect x="22" y="23" width="28" height="5" fill="#6366f1" fillOpacity="0.12"/>
          {/* Text lines */}
          <rect x="27" y="35" width="18" height="2" rx="1" fill="#6366f1" fillOpacity="0.5"/>
          <rect x="27" y="40" width="14" height="2" rx="1" fill="#818cf8" fillOpacity="0.4"/>
          <rect x="27" y="45" width="10" height="2" rx="1" fill="#0891b2" fillOpacity="0.4"/>
          {/* Pen nib */}
          <circle cx="54" cy="20" r="6" fill="#818cf8" fillOpacity="0.1" stroke="#818cf8" strokeWidth="1.2" strokeOpacity="0.5"/>
          <path d="M51 23 L54 17 L57 23 L54 22 Z" fill="none" stroke="#818cf8" strokeWidth="1.2" strokeOpacity="0.6" strokeLinejoin="round"/>
          {/* Sparkle dots */}
          <circle cx="8" cy="12" r="2.5" fill="#6366f1" fillOpacity="0.7" style={{animation:'blog-spark 2s ease-in-out infinite'}}/>
          <circle cx="62" cy="14" r="2" fill="#818cf8" fillOpacity="0.65" style={{animation:'blog-spark 2s ease-in-out infinite 0.6s'}}/>
          <circle cx="10" cy="58" r="2" fill="#0891b2" fillOpacity="0.65" style={{animation:'blog-spark 2s ease-in-out infinite 1.2s'}}/>
          <circle cx="60" cy="60" r="2.5" fill="#6366f1" fillOpacity="0.7" style={{animation:'blog-spark 2s ease-in-out infinite 1.8s'}}/>
        </svg>
        <p className="text-violet-600 dark:text-violet-400 text-sm font-medium mb-2">What&apos;s new</p>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">Club Updates</h1>
        <p className="text-slate-500 leading-relaxed">Announcements, recaps, and news from the LC3 community.</p>
      </div>

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
              className="flex items-center gap-4 bg-white border border-slate-200 rounded-2xl p-4 hover:border-violet-200 hover:shadow-sm transition-all group dark:bg-[#0d1424] dark:border-[#1e2d45] dark:hover:border-violet-500/30"
            >
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
  );
}
