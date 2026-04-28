import { readJSON, Project, ProjectStatus } from '@/lib/data';
import type { Metadata } from 'next';
import { ProjectFlow } from '../components/Illustrations';

export const revalidate = 30;

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Explore real-world software projects built by LC3 student teams — from Power Platform apps to cloud-native solutions.',
};

function GithubIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function StatusBadge({ status }: { status: ProjectStatus }) {
  if (status === 'in-progress') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
        In Progress
      </span>
    );
  }
  if (status === 'completed') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        Completed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-violet-50 border border-violet-200 text-violet-700 dark:bg-violet-500/10 dark:border-violet-500/20 dark:text-violet-400">
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
      Open to Contributors
    </span>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <div id={project.id} className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden hover:border-violet-400/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col dark:bg-white/5 dark:border-white/10">
      <div className={`h-3 bg-gradient-to-r ${project.gradient}`} />
      <div className="p-8 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-4">
          <h3 className="text-slate-900 dark:text-white font-bold text-xl">{project.name}</h3>
          {project.status && <StatusBadge status={project.status} />}
        </div>
        <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-6 flex-1">{project.description}</p>
        
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {project.tags.map((tag) => (
              <span key={tag} className="text-[10px] font-bold uppercase tracking-widest bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 px-3 py-1 rounded-lg">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-white/5">
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener" className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              <GithubIcon /> GitHub
            </a>
          )}
          <span className="text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.2em]">LC3 PROJECT</span>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const projects = readJSON<Project[]>('projects.json');

  return (
    <div className="overflow-x-hidden">
      <section className="relative overflow-hidden border-b border-slate-200 dark:border-[#1e2d45]">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50/60 via-indigo-50/30 to-transparent dark:from-violet-950/20 dark:via-indigo-950/10 dark:to-transparent pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center text-center md:text-left">
            <div>
              <p className="text-violet-600 dark:text-violet-400 text-sm font-bold uppercase tracking-widest mb-3">Built by our members</p>
              <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">Projects</h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-md">
                Real-world solutions built by LC3 student teams — from automation tools to full-stack applications.
              </p>
            </div>
            <div className="flex justify-center md:justify-end">
              <ProjectFlow />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        {projects.length === 0 ? (
          <div className="text-center py-24 bg-slate-50 dark:bg-white/5 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-white/10">
            <p className="text-slate-400 font-medium">No projects showcase yet. Start building!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
