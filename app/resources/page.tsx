import { readJSON, Resource } from '@/lib/data';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Resources',
  description: 'Curated learning resources, tools, and references shared by the LC3 community.',
};

function ExternalLinkIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}

export default function ResourcesPage() {
  const resources = readJSON<Resource[]>('resources.json');

  // Group by category — preferred order, then any extras alphabetically
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      {/* Header */}
      <div className="text-center mb-14">
        <svg width="72" height="72" viewBox="0 0 72 72" className="mx-auto mb-5 opacity-85 dark:opacity-75" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <style>{`
              @keyframes res-spark { 0%,100%{opacity:0.3;transform:scale(0.85)} 50%{opacity:0.9;transform:scale(1.15)} }
              @keyframes res-glow { 0%,100%{opacity:0.06} 50%{opacity:0.16} }
            `}</style>
          </defs>
          <circle cx="36" cy="36" r="33" fill="#7c3aed" fillOpacity="0.07" stroke="#7c3aed" strokeWidth="1" strokeOpacity="0.3"/>
          <circle cx="36" cy="36" r="22" fill="#6366f1" fillOpacity="0.07" style={{animation:'res-glow 3s ease-in-out infinite'}}/>
          {/* Book 1 — back */}
          <rect x="18" y="25" width="20" height="26" rx="3" fill="#0891b2" fillOpacity="0.08" stroke="#0891b2" strokeWidth="1.5" strokeOpacity="0.45"/>
          <rect x="18" y="25" width="4" height="26" rx="1.5" fill="#0891b2" fillOpacity="0.3"/>
          {/* Book 2 — middle */}
          <rect x="24" y="21" width="20" height="30" rx="3" fill="#818cf8" fillOpacity="0.08" stroke="#818cf8" strokeWidth="1.5" strokeOpacity="0.5"/>
          <rect x="24" y="21" width="4" height="30" rx="1.5" fill="#818cf8" fillOpacity="0.28"/>
          {/* Book 3 — front */}
          <rect x="32" y="17" width="22" height="33" rx="3" fill="#6366f1" fillOpacity="0.08" stroke="#6366f1" strokeWidth="1.5" strokeOpacity="0.65"/>
          <rect x="32" y="17" width="4" height="33" rx="1.5" fill="#6366f1" fillOpacity="0.32"/>
          {/* Lines on front book */}
          <rect x="39" y="26" width="10" height="1.5" rx="0.75" fill="#6366f1" fillOpacity="0.4"/>
          <rect x="39" y="30" width="8" height="1.5" rx="0.75" fill="#6366f1" fillOpacity="0.35"/>
          <rect x="39" y="34" width="9" height="1.5" rx="0.75" fill="#6366f1" fillOpacity="0.3"/>
          {/* Bookmark */}
          <path d="M48 17 L48 24 L45 22 L42 24 L42 17 Z" fill="#6366f1" fillOpacity="0.5"/>
          {/* Sparkle dots */}
          <circle cx="8" cy="14" r="2.5" fill="#6366f1" fillOpacity="0.7" style={{animation:'res-spark 2.2s ease-in-out infinite'}}/>
          <circle cx="62" cy="12" r="2" fill="#0891b2" fillOpacity="0.65" style={{animation:'res-spark 2.2s ease-in-out infinite 0.55s'}}/>
          <circle cx="10" cy="58" r="2" fill="#818cf8" fillOpacity="0.65" style={{animation:'res-spark 2.2s ease-in-out infinite 1.1s'}}/>
          <circle cx="62" cy="58" r="2.5" fill="#0891b2" fillOpacity="0.7" style={{animation:'res-spark 2.2s ease-in-out infinite 1.65s'}}/>
        </svg>
        <p className="text-violet-600 dark:text-violet-400 text-sm font-medium mb-2">Curated by the community</p>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">Resources</h1>
        <p className="text-slate-500 max-w-xl mx-auto">
          Tools, tutorials, and references to help you learn and build.
        </p>
      </div>

      {resources.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-14 text-center text-slate-400 dark:bg-[#0d1424] dark:border-[#1e2d45] dark:text-slate-500">
          No resources yet. Check back soon!
        </div>
      ) : (
        <div className="space-y-12">
          {categories.map((category) => (
            <section key={category}>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-gradient-to-b from-blue-500 to-violet-600 rounded-full" />
                {category}
              </h2>
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
                          <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">{resource.description}</p>
                        )}
                      </div>
                      <span className="flex-shrink-0 text-slate-400 group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors mt-0.5">
                        <ExternalLinkIcon />
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
