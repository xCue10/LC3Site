import { readJSON, Project } from '@/lib/data';

export const dynamic = 'force-dynamic';

function GithubIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="bg-[#0d1424] border border-[#1e2d45] rounded-2xl overflow-hidden hover:border-violet-500/30 hover:-translate-y-0.5 transition-all flex flex-col">
      <div className={`h-1.5 bg-gradient-to-r ${project.gradient}`} />
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-white font-semibold text-lg mb-2">{project.name}</h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-1">{project.description}</p>
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tags.map((tag) => (
              <span key={tag} className="text-xs bg-white/5 border border-white/10 text-slate-400 px-2.5 py-1 rounded-md">
                {tag}
              </span>
            ))}
          </div>
        )}
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mt-auto pt-4 border-t border-[#1e2d45]"
          >
            <GithubIcon />
            View on GitHub
            <svg className="w-3 h-3 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const projects = readJSON<Project[]>('projects.json');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <p className="text-violet-400 text-sm font-medium mb-2">Built by our members</p>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Projects</h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          Real-world projects built by LC3 members — from automation tools to full-stack apps.
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-[#0d1424] border border-[#1e2d45] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <p className="text-slate-500">No projects yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
