import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-[#1e1e2e] bg-[#0f0f1a] mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-xs">
                LC3
              </div>
              <span className="font-semibold text-white">LC3 — Lowcode Cloud Club</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Building with low-code tools and cloud tech — one project at a time.
            </p>
          </div>

          <div>
            <h3 className="text-white font-medium mb-3 text-sm">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'Home' },
                { href: '/members', label: 'Members' },
                { href: '/events', label: 'Events' },
                { href: '/contact', label: 'Join Us' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-slate-400 hover:text-violet-400 text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-medium mb-3 text-sm">Get Involved</h3>
            <p className="text-slate-400 text-sm mb-3">
              Interested in joining? Fill out our interest form and we&apos;ll reach out!
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              Apply to Join
            </Link>
          </div>
        </div>

        <div className="border-t border-[#1e1e2e] mt-8 pt-6 text-center text-slate-500 text-sm">
          © {new Date().getFullYear()} LC3 — Lowcode Cloud Club. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
