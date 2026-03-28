import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 — Page Not Found',
};

export default function NotFound() {
  return (
    <div className="relative overflow-hidden min-h-[70vh] flex items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50/60 via-blue-50/30 to-transparent dark:from-violet-950/20 dark:via-blue-950/10 dark:to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-400/5 dark:bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative text-center px-4 py-20">
        {/* Big 404 */}
        <div className="text-[120px] sm:text-[160px] font-bold leading-none bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 bg-clip-text text-transparent select-none mb-2">
          404
        </div>

        {/* LC3 badge */}
        <div className="inline-flex items-center gap-2 bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 text-violet-700 dark:text-violet-400 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
          LC3 — Lowcode Cloud Club
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
          Page not found
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-8 leading-relaxed">
          Looks like this page doesn&apos;t exist. Maybe it moved, or you followed a broken link.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-lg shadow-violet-500/20"
          >
            Back to Home
          </Link>
          <Link
            href="/contact"
            className="px-6 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-white/10 transition-all"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
