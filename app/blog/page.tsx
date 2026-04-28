import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { readJSON, Post } from '@/lib/data';
import { BlogGraphic } from '../components/Illustrations';

export const revalidate = 30;

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
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200 dark:border-[#1e2d45]">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50/60 via-purple-50/30 to-transparent dark:from-violet-950/20 dark:via-purple-950/10 dark:to-transparent pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center text-center md:text-left">
            <div>
              <p className="text-violet-600 dark:text-violet-400 text-sm font-bold uppercase tracking-widest mb-3">What&apos;s new</p>
              <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">Blog</h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-md">
                Stay updated with announcements, event recaps, and insights from the LC3 community.
              </p>
              {posts.length > 0 && (
                <div className="mt-8 inline-flex items-center gap-2 bg-violet-600 text-white text-xs font-black px-4 py-2 rounded-full shadow-lg shadow-violet-500/20 uppercase tracking-tighter">
                  {posts.length} Published Updates
                </div>
              )}
            </div>
            <div className="flex justify-center md:justify-end">
              <BlogGraphic />
            </div>
          </div>
        </div>
      </section>

      {/* Posts */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
        {posts.length === 0 ? (
          <div className="text-center py-24 bg-slate-50 dark:bg-white/5 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-white/10">
            <p className="text-slate-400 font-medium">No updates posted yet. Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group relative flex flex-col md:flex-row items-center gap-8 bg-white border border-slate-200 rounded-[2.5rem] p-6 hover:border-violet-400/50 hover:shadow-2xl transition-all duration-300 dark:bg-white/5 dark:border-white/10"
              >
                {/* Thumbnail */}
                <div className="w-full md:w-48 h-48 md:h-32 rounded-3xl flex-shrink-0 relative overflow-hidden bg-slate-100 dark:bg-white/5">
                  {post.coverImage ? (
                    <Image src={post.coverImage} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-violet-500/10 to-blue-500/10 flex items-center justify-center">
                      <svg className="w-10 h-10 text-violet-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 text-center md:text-left">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{formatDate(post.publishedAt)}</span>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-2 mb-3 group-hover:text-violet-600 transition-colors line-clamp-1">
                    {post.title}
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">{post.excerpt}</p>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex w-12 h-12 rounded-full border border-slate-100 dark:border-white/5 items-center justify-center group-hover:bg-violet-600 group-hover:border-violet-600 transition-all">
                  <svg className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
