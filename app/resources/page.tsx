import { readJSON, Resource } from '@/lib/data';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Resources',
  description: 'Curated learning resources, tools, and references shared by the LC3 community.',
};

function ExternalLinkIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}

const CATEGORY_COLORS: Record<string, { badge: string; bar: string }> = {
  Microsoft: { badge: 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-400', bar: 'from-blue-500 to-blue-600' },
  Cloud:      { badge: 'bg-cyan-50 border-cyan-200 text-cyan-700 dark:bg-cyan-500/10 dark:border-cyan-500/20 dark:text-cyan-400', bar: 'from-cyan-500 to-blue-500' },
  Development:{ badge: 'bg-violet-50 border-violet-200 text-violet-700 dark:bg-violet-500/10 dark:border-violet-500/20 dark:text-violet-400', bar: 'from-violet-500 to-purple-600' },
  'AI Tools': { badge: 'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-500/10 dark:border-purple-500/20 dark:text-purple-400', bar: 'from-purple-500 to-violet-600' },
  Tools:      { badge: 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400', bar: 'from-emerald-500 to-teal-500' },
  General:    { badge: 'bg-slate-100 border-slate-200 text-slate-700 dark:bg-white/5 dark:border-white/10 dark:text-slate-400', bar: 'from-slate-400 to-slate-500' },
};

function getCategoryStyle(category: string) {
  return CATEGORY_COLORS[category] ?? {
    badge: 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400',
    bar: 'from-amber-500 to-orange-500',
  };
}

export default function ResourcesPage() {
  const resources = readJSON<Resource[]>('resources.json');

  const categoryOrder = ['Microsoft', 'Cloud', 'Development', 'AI Tools', 'Tools', 'General'];
  const allCategories = Array.from(new Set(resources.map((r) => r.category)));
  const categories = [
    ...categoryOrder.filter((c) => allCategories.includes(c)),
    ...allCategories.filter((c) => !categoryOrder.includes(c)).sort(),
  ];
  const grouped = categories.reduce<Record<string, Resource[]>>((acc, cat) => {
    acc[cat] = resources.filter((r) => r.category === cat);
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">

      {/* Header */}
      <div className="grid md:grid-cols-2 gap-10 items-center mb-14">
        {/* Left: text */}
        <div>
          <p className="text-violet-600 dark:text-violet-400 text-sm font-medium mb-2">Curated by the community</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">Resources</h1>
          <p className="text-slate-500 mb-6">
            Tools, tutorials, and references to help you learn and build — organized by topic.
          </p>
          {resources.length > 0 && (
            <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 text-slate-500 text-sm px-4 py-1.5 rounded-full dark:bg-white/5 dark:border-white/10 dark:text-slate-400">
              <span className="w-1.5 h-1.5 bg-violet-500 rounded-full dark:bg-violet-400" />
              {resources.length} resource{resources.length !== 1 ? 's' : ''} across {categories.length} categories
            </div>
          )}
        </div>

        {/* Right: SVG */}
        <div className="flex justify-center md:justify-end">
          <svg width="320" height="140" viewBox="0 0 320 140" fill="none" className="opacity-90 dark:opacity-80" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <style>{`
                @keyframes res2-dash { to { stroke-dashoffset: -18; } }
                @keyframes res2-spark { 0%,100%{opacity:0.3;transform:scale(0.9)} 50%{opacity:0.9;transform:scale(1.1)} }
                @keyframes res2-corner { 0%,100%{opacity:0.35} 50%{opacity:0.8} }
                @keyframes res2-glow { 0%,100%{opacity:0.08} 50%{opacity:0.2} }
                @keyframes res2-float { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-4px)} }
                @keyframes res2-blink { 0%,49%{opacity:1} 50%,100%{opacity:0} }
                @keyframes res2-badge { 0%,100%{opacity:0.8} 50%{opacity:1} }
              `}</style>
              <radialGradient id="res2-g1" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0"/>
              </radialGradient>
            </defs>

            {/* Corner brackets */}
            <path d="M8 8 L8 22 M8 8 L22 8" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5" strokeLinecap="round" style={{animation:'res2-corner 3s ease-in-out infinite'}}/>
            <path d="M312 8 L312 22 M312 8 L298 8" stroke="rgba(8,145,178,0.4)" strokeWidth="1.5" strokeLinecap="round" style={{animation:'res2-corner 3s ease-in-out infinite 0.75s'}}/>
            <path d="M8 132 L8 118 M8 132 L22 132" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5" strokeLinecap="round" style={{animation:'res2-corner 3s ease-in-out infinite 1.5s'}}/>
            <path d="M312 132 L312 118 M312 132 L298 132" stroke="rgba(8,145,178,0.4)" strokeWidth="1.5" strokeLinecap="round" style={{animation:'res2-corner 3s ease-in-out infinite 2.25s'}}/>

            {/* Center ambient glow */}
            <circle cx="160" cy="70" r="52" fill="url(#res2-g1)" style={{animation:'res2-glow 3s ease-in-out infinite'}}/>

            {/* Book stack — back book (cyan) */}
            <g style={{animation:'res2-float 3.5s ease-in-out infinite 0.8s'}}>
              <rect x="100" y="44" width="36" height="52" rx="4" fill="rgba(6,182,212,0.09)" stroke="rgba(6,182,212,0.45)" strokeWidth="1.5"/>
              <rect x="100" y="44" width="7" height="52" rx="3" fill="rgba(6,182,212,0.28)"/>
              <rect x="112" y="56" width="16" height="2" rx="1" fill="rgba(6,182,212,0.35)"/>
              <rect x="112" y="61" width="12" height="2" rx="1" fill="rgba(6,182,212,0.28)"/>
              <rect x="112" y="66" width="14" height="2" rx="1" fill="rgba(6,182,212,0.28)"/>
            </g>

            {/* Book stack — middle book (violet) */}
            <g style={{animation:'res2-float 3s ease-in-out infinite 0.4s'}}>
              <rect x="128" y="34" width="38" height="56" rx="4" fill="rgba(139,92,246,0.09)" stroke="rgba(139,92,246,0.48)" strokeWidth="1.5"/>
              <rect x="128" y="34" width="7" height="56" rx="3" fill="rgba(139,92,246,0.28)"/>
              <rect x="140" y="47" width="18" height="2" rx="1" fill="rgba(139,92,246,0.38)"/>
              <rect x="140" y="52" width="14" height="2" rx="1" fill="rgba(139,92,246,0.3)"/>
              <rect x="140" y="57" width="16" height="2" rx="1" fill="rgba(139,92,246,0.3)"/>
              <rect x="140" y="62" width="10" height="2" rx="1" fill="rgba(139,92,246,0.25)"/>
            </g>

            {/* Book stack — front book (indigo, main) */}
            <g style={{animation:'res2-float 2.8s ease-in-out infinite'}}>
              <rect x="158" y="26" width="42" height="62" rx="4" fill="rgba(99,102,241,0.09)" stroke="rgba(99,102,241,0.6)" strokeWidth="1.8"/>
              <rect x="158" y="26" width="8" height="62" rx="3" fill="rgba(99,102,241,0.32)"/>
              {/* Bookmark */}
              <path d="M184 26 L184 36 L180 33 L176 36 L176 26 Z" fill="#6366f1" opacity="0.55"/>
              <rect x="170" y="40" width="20" height="2" rx="1" fill="rgba(99,102,241,0.45)"/>
              <rect x="170" y="45" width="16" height="2" rx="1" fill="rgba(99,102,241,0.35)"/>
              <rect x="170" y="50" width="18" height="2" rx="1" fill="rgba(99,102,241,0.35)"/>
              <rect x="170" y="55" width="12" height="2" rx="1" fill="rgba(99,102,241,0.3)"/>
              <rect x="170" y="60" width="14" height="2" rx="1" fill="rgba(99,102,241,0.3)"/>
              {/* Cursor blink on last line */}
              <rect x="184" y="60" width="4" height="2" rx="1" fill="#6366f1" opacity="0.7" style={{animation:'res2-blink 1.1s step-end infinite'}}/>
            </g>

            {/* Category badge pills floating around */}
            <g style={{animation:'res2-float 4s ease-in-out infinite 0.2s'}}>
              <rect x="30" y="28" width="46" height="16" rx="8" fill="rgba(59,130,246,0.1)" stroke="rgba(59,130,246,0.35)" strokeWidth="1" style={{animation:'res2-badge 2.5s ease-in-out infinite'}}/>
              <text x="53" y="40" textAnchor="middle" fill="rgba(59,130,246,0.75)" fontSize="7" fontFamily="monospace" fontWeight="600">CLOUD</text>
            </g>
            <g style={{animation:'res2-float 3.6s ease-in-out infinite 1s'}}>
              <rect x="34" y="88" width="48" height="16" rx="8" fill="rgba(34,197,94,0.1)" stroke="rgba(34,197,94,0.32)" strokeWidth="1" style={{animation:'res2-badge 2.8s ease-in-out infinite 0.5s'}}/>
              <text x="58" y="100" textAnchor="middle" fill="rgba(34,197,94,0.72)" fontSize="7" fontFamily="monospace" fontWeight="600">TOOLS</text>
            </g>
            <g style={{animation:'res2-float 3.2s ease-in-out infinite 1.5s'}}>
              <rect x="220" y="22" width="62" height="16" rx="8" fill="rgba(139,92,246,0.1)" stroke="rgba(139,92,246,0.32)" strokeWidth="1" style={{animation:'res2-badge 3s ease-in-out infinite 0.8s'}}/>
              <text x="251" y="34" textAnchor="middle" fill="rgba(139,92,246,0.72)" fontSize="7" fontFamily="monospace" fontWeight="600">AI TOOLS</text>
            </g>
            <g style={{animation:'res2-float 3.8s ease-in-out infinite 0.6s'}}>
              <rect x="216" y="96" width="72" height="16" rx="8" fill="rgba(245,158,11,0.1)" stroke="rgba(245,158,11,0.3)" strokeWidth="1" style={{animation:'res2-badge 2.6s ease-in-out infinite 1.2s'}}/>
              <text x="252" y="108" textAnchor="middle" fill="rgba(245,158,11,0.7)" fontSize="7" fontFamily="monospace" fontWeight="600">MICROSOFT</text>
            </g>

            {/* Connecting dashes from books to badges */}
            <line x1="100" y1="60" x2="78" y2="36" stroke="rgba(59,130,246,0.2)" strokeWidth="1" strokeDasharray="3 4" style={{animation:'res2-dash 1.4s linear infinite'}}/>
            <line x1="100" y1="80" x2="82" y2="96" stroke="rgba(34,197,94,0.2)" strokeWidth="1" strokeDasharray="3 4" style={{animation:'res2-dash 1.6s linear infinite 0.4s'}}/>
            <line x1="200" y1="50" x2="220" y2="30" stroke="rgba(139,92,246,0.2)" strokeWidth="1" strokeDasharray="3 4" style={{animation:'res2-dash 1.5s linear infinite 0.8s'}}/>
            <line x1="200" y1="80" x2="216" y2="104" stroke="rgba(245,158,11,0.2)" strokeWidth="1" strokeDasharray="3 4" style={{animation:'res2-dash 1.7s linear infinite 1.2s'}}/>

            {/* Sparkle dots */}
            <circle cx="26" cy="26" r="2.5" fill="#6366f1" opacity="0.65" style={{animation:'res2-spark 2.3s ease-in-out infinite'}}/>
            <circle cx="294" cy="24" r="2" fill="#0891b2" opacity="0.6" style={{animation:'res2-spark 2.3s ease-in-out infinite 0.7s'}}/>
            <circle cx="26" cy="114" r="2" fill="#818cf8" opacity="0.6" style={{animation:'res2-spark 2.3s ease-in-out infinite 1.4s'}}/>
            <circle cx="294" cy="114" r="2.5" fill="#0891b2" opacity="0.65" style={{animation:'res2-spark 2.3s ease-in-out infinite 2.1s'}}/>
          </svg>
        </div>
      </div>

      {/* Category pills nav */}
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => {
            const style = getCategoryStyle(cat);
            return (
              <a
                key={cat}
                href={`#${cat.toLowerCase().replace(/\s+/g, '-')}`}
                className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all hover:scale-[1.03] ${style.badge}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${style.bar}`} />
                {cat}
                <span className="opacity-60">({grouped[cat].length})</span>
              </a>
            );
          })}
        </div>
      )}

      {resources.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-14 text-center text-slate-400 dark:bg-[#0d1424] dark:border-[#1e2d45] dark:text-slate-500">
          No resources yet. Check back soon!
        </div>
      ) : (
        <div className="space-y-12">
          {categories.map((category) => {
            const style = getCategoryStyle(category);
            return (
              <section key={category} id={category.toLowerCase().replace(/\s+/g, '-')}>
                <div className="flex items-center gap-3 mb-5">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${style.badge}`}>
                    {category}
                  </span>
                  <span className="text-slate-400 dark:text-slate-600 text-xs">{grouped[category].length} resource{grouped[category].length !== 1 ? 's' : ''}</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {grouped[category].map((resource) => (
                    <a
                      key={resource.id}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group bg-white border border-slate-200 rounded-2xl p-5 hover:border-violet-300 hover:shadow-sm transition-all dark:bg-[#0d1424] dark:border-[#1e2d45] dark:hover:border-violet-500/30"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-slate-900 dark:text-white font-semibold text-sm mb-1 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                            {resource.title}
                          </h3>
                          {resource.description && (
                            <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{resource.description}</p>
                          )}
                        </div>
                        <span className="flex-shrink-0 text-slate-300 group-hover:text-violet-500 dark:text-slate-600 dark:group-hover:text-violet-400 transition-colors mt-0.5">
                          <ExternalLinkIcon />
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
