import { readJSON, Post } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = readJSON<Post[]>('posts.json').find((p) => p.slug === slug && p.published);
  if (!post) return {};
  return { title: post.title, description: post.excerpt || undefined };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = readJSON<Post[]>('posts.json').find((p) => p.slug === slug && p.published);
  if (!post) notFound();

  const paragraphs = post.content.split(/\n\n+/).filter(Boolean);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white text-sm mb-10 transition-colors group"
      >
        <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        All Posts
      </Link>

      <article>
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs text-slate-400">{formatDate(post.publishedAt)}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-lg text-slate-500 leading-relaxed border-l-2 border-violet-400 pl-4">
              {post.excerpt}
            </p>
          )}
        </div>

        <div className="border-t border-slate-200 dark:border-[#1e2d45] pt-8 space-y-4">
          {paragraphs.map((para, i) => (
            <p key={i} className="text-slate-600 dark:text-slate-400 leading-relaxed text-[15px]">
              {para.replace(/\n/g, ' ')}
            </p>
          ))}
        </div>
      </article>

      <div className="mt-12 pt-8 border-t border-slate-200 dark:border-[#1e2d45]">
        <Link
          href="/blog"
          className="text-sm text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium transition-colors"
        >
          ← Back to all posts
        </Link>
      </div>
    </div>
  );
}
