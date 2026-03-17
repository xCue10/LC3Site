import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* 404 number */}
        <div className="relative mb-6 inline-block">
          <div className="text-[120px] font-bold leading-none bg-gradient-to-r from-blue-400 via-violet-400 to-violet-500 bg-clip-text text-transparent select-none">
            404
          </div>
          <div className="absolute inset-0 blur-3xl bg-violet-600/20 -z-10 rounded-full" />
        </div>

        {/* Icon */}
        <div className="w-14 h-14 bg-[#0f1a2e] border border-[#253650] rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-7 h-7 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-white mb-3">Page not found</h1>
        <p className="text-slate-400 mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/20"
          >
            Back to Home
          </Link>
          <Link
            href="/members"
            className="px-6 py-3 bg-[#0f1a2e] border border-[#253650] text-white font-semibold rounded-xl hover:border-violet-500/40 hover:bg-white/5 transition-all"
          >
            Meet the Team
          </Link>
        </div>
      </div>
    </div>
  );
}
