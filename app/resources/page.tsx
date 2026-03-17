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

  // Group by category
  const categories = Array.from(new Set(resources.map((r) => r.category))).sort();
  const grouped = categories.reduce<Record<string, Resource[]>>((acc, cat) => {
    acc[cat] = resources.filter((r) => r.category === cat);
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      {/* Header */}
      <div className="text-center mb-14">
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
