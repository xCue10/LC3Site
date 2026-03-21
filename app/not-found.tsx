'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield } from 'lucide-react';

export default function NotFound() {
  const pathname = usePathname();
  const fullUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${pathname}`
    : pathname;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-xl mx-auto mb-6 shadow-lg shadow-violet-500/20">
          LC3
        </div>
        <h1 className="text-7xl font-bold text-slate-900 dark:text-white mb-2">404</h1>
        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-3">Page not found</h2>
        <p className="text-slate-500 leading-relaxed mb-8">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
          >
            Go Home
          </Link>
          <Link
            href="/events"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 border border-slate-200 dark:border-[#1e2d45] text-slate-600 dark:text-slate-400 text-sm font-medium rounded-xl hover:border-violet-300 hover:text-slate-900 dark:hover:text-white dark:hover:border-violet-500/40 transition-all"
          >
            View Events
          </Link>
        </div>

        {/* Shield easter egg */}
        <div className="border-t border-slate-100 dark:border-[#1e2d45] pt-8">
          <p className="text-xs text-slate-400 mb-3">Curious if this broken URL is a security risk?</p>
          <Link
            href={`/shield/scan/url?url=${encodeURIComponent(fullUrl)}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
              color: '#f87171',
            }}
          >
            <Shield className="w-3.5 h-3.5" />
            Scan with LC3 Shield
          </Link>
        </div>
      </div>
    </div>
  );
}
