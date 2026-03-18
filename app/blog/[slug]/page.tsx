import { readJSON, Post } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
        {post.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.coverImage} alt={post.title} className="w-full object-contain rounded-2xl mb-8 bg-slate-100 dark:bg-[#111a2e]" />
        )}
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

        <div className="border-t border-slate-200 dark:border-[#1e2d45] pt-8">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4 first:mt-0">{children}</h1>,
              h2: ({ children }) => <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-7 mb-3">{children}</h2>,
              h3: ({ children }) => <h3 className="text-lg font-semibold text-slate-900 dark:text-white mt-6 mb-2">{children}</h3>,
              p: ({ children }) => <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[15px] mb-4">{children}</p>,
              a: ({ href, children }) => <a href={href} className="text-violet-600 dark:text-violet-400 hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>,
              ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-4 text-slate-600 dark:text-slate-400 text-[15px]">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-4 text-slate-600 dark:text-slate-400 text-[15px]">{children}</ol>,
              li: ({ children }) => <li className="leading-relaxed">{children}</li>,
              blockquote: ({ children }) => <blockquote className="border-l-2 border-violet-400 pl-4 italic text-slate-500 dark:text-slate-400 mb-4">{children}</blockquote>,
              code: ({ children, className }) => className
                ? <code className="block bg-slate-100 dark:bg-white/5 rounded-xl p-4 text-sm font-mono text-slate-700 dark:text-slate-300 mb-4 overflow-x-auto whitespace-pre">{children}</code>
                : <code className="bg-slate-100 dark:bg-white/5 rounded px-1.5 py-0.5 text-sm font-mono text-slate-700 dark:text-slate-300">{children}</code>,
              strong: ({ children }) => <strong className="font-semibold text-slate-900 dark:text-white">{children}</strong>,
              hr: () => <hr className="border-slate-200 dark:border-[#1e2d45] my-8" />,
              // eslint-disable-next-line @next/next/no-img-element
              img: ({ src, alt }) => <img src={src} alt={alt || ''} className="w-full rounded-2xl my-6 object-cover" />,
            }}
          >
            {post.content}
          </ReactMarkdown>
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
