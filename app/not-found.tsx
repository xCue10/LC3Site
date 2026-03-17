import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="relative mb-8 inline-block">
          <div className="text-[120px] font-bold leading-none bg-gradient-to-r from-blue-400 to-violet-500 bg-clip-text text-transparent select-none">
            404
          </div>
          <div className="absolute inset-0 blur-3xl bg-violet-600/20 -z-10" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">Page not found</h1>
        <p className="text-slate-400 mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
          >
            Back to Home
          </Link>
          <Link
            href="/contact"
            className="px-6 py-3 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
