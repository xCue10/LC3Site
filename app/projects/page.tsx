import { readJSON, Project, ProjectStatus } from '@/lib/data';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

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
    <div id={project.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-violet-200 hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col dark:bg-[#0d1424] dark:border-[#1e2d45] dark:hover:border-violet-500/30 dark:hover:shadow-none">
      <div className={`relative h-24 bg-gradient-to-r ${project.gradient} overflow-hidden`}>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 96" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <circle cx="0" cy="0" r="70" fill="white" fillOpacity="0.07"/>
          <circle cx="320" cy="96" r="80" fill="white" fillOpacity="0.07"/>
          <circle cx="160" cy="48" r="40" fill="white" fillOpacity="0.04"/>
          <text x="18" y="64" fontSize="32" fill="white" fillOpacity="0.13" fontFamily="monospace" fontWeight="bold">{'{ }'}</text>
          <text x="218" y="44" fontSize="22" fill="white" fillOpacity="0.10" fontFamily="monospace">{'</>'}</text>
          <circle cx="82" cy="14" r="2" fill="white" fillOpacity="0.4"/>
          <circle cx="258" cy="18" r="2.5" fill="white" fillOpacity="0.35"/>
          <circle cx="292" cy="76" r="2" fill="white" fillOpacity="0.35"/>
          <circle cx="132" cy="82" r="1.5" fill="white" fillOpacity="0.3"/>
        </svg>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-slate-900 dark:text-white font-semibold text-lg">{project.name}</h3>
          {project.status && <StatusBadge status={project.status} />}
        </div>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4 flex-1">{project.description}</p>
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tags.map((tag) => (
              <span key={tag} className="text-xs bg-slate-100 border border-slate-200 text-slate-600 px-2.5 py-1 rounded-md dark:bg-white/5 dark:border-white/10 dark:text-slate-400">
                {tag}
              </span>
            ))}
          </div>
        )}
        {project.contributors && project.contributors.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {project.contributors.map((c) => (
              <span key={c} className="text-xs bg-violet-50 border border-violet-200 text-violet-600 px-2 py-0.5 rounded-full dark:bg-violet-500/10 dark:border-violet-500/20 dark:text-violet-400">
                {c}
              </span>
            ))}
          </div>
        )}
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors mt-auto pt-4 border-t border-slate-200 dark:border-[#1e2d45]"
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
      <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
        {/* Left: text */}
        <div>
          <p className="text-violet-600 dark:text-violet-400 text-sm font-medium mb-2">Built by our members</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">Projects</h1>
          <p className="text-slate-500">
            Real-world projects built by LC3 members — from automation tools to full-stack apps.
          </p>
        </div>
        {/* Right: SVG */}
        <div className="flex justify-center md:justify-end overflow-hidden">
        <svg width="320" height="140" viewBox="0 0 320 140" fill="none" className="opacity-90 dark:opacity-80" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <style>{`
              @keyframes proj2-dash { to { stroke-dashoffset: -18; } }
              @keyframes proj2-blink { 0%,49%{opacity:1} 50%,100%{opacity:0} }
              @keyframes proj2-spark { 0%,100%{opacity:0.3;transform:scale(0.9)} 50%{opacity:0.9;transform:scale(1.1)} }
              @keyframes proj2-corner { 0%,100%{opacity:0.35} 50%{opacity:0.8} }
              @keyframes proj2-rocket { 0%,100%{transform:translate(0px,0px)} 50%{transform:translate(2px,-3px)} }
              @keyframes proj2-staging { 0%,100%{opacity:0.7} 50%{opacity:1} }
              @keyframes proj2-deploy { 0%,100%{opacity:0.5} 50%{opacity:1} }
            `}</style>
          </defs>

          {/* Corner brackets */}
          <path d="M8 8 L8 22 M8 8 L22 8" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5" strokeLinecap="round" style={{animation:'proj2-corner 3s ease-in-out infinite'}}/>
          <path d="M312 8 L312 22 M312 8 L298 8" stroke="rgba(8,145,178,0.4)" strokeWidth="1.5" strokeLinecap="round" style={{animation:'proj2-corner 3s ease-in-out infinite 0.75s'}}/>
          <path d="M8 132 L8 118 M8 132 L22 132" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5" strokeLinecap="round" style={{animation:'proj2-corner 3s ease-in-out infinite 1.5s'}}/>
          <path d="M312 132 L312 118 M312 132 L298 132" stroke="rgba(8,145,178,0.4)" strokeWidth="1.5" strokeLinecap="round" style={{animation:'proj2-corner 3s ease-in-out infinite 2.25s'}}/>

          {/* Terminal box */}
          <rect x="14" y="50" width="56" height="40" rx="5" fill="rgba(99,102,241,0.07)" stroke="rgba(99,102,241,0.35)" strokeWidth="1.2"/>
          <rect x="14" y="50" width="56" height="12" rx="5" fill="rgba(99,102,241,0.12)"/>
          <rect x="14" y="56" width="56" height="6" fill="rgba(99,102,241,0.1)"/>
          <circle cx="21" cy="56" r="2.2" fill="#6366f1" opacity="0.6"/>
          <circle cx="28" cy="56" r="2.2" fill="#818cf8" opacity="0.55"/>
          <circle cx="35" cy="56" r="2.2" fill="#0891b2" opacity="0.55"/>
          <rect x="19" y="68" width="20" height="2.5" rx="1" fill="#6366f1" opacity="0.5"/>
          <rect x="19" y="74" width="28" height="2.5" rx="1" fill="#818cf8" opacity="0.45"/>
          <rect x="19" y="80" width="14" height="2.5" rx="1" fill="#0891b2" opacity="0.5"/>
          <rect x="34" y="80" width="7" height="2.5" rx="1" fill="#6366f1" opacity="0.7" style={{animation:'proj2-blink 1s step-end infinite'}}/>

          {/* Main branch */}
          <line x1="70" y1="82" x2="250" y2="82" stroke="rgba(99,102,241,0.15)" strokeWidth="2"/>
          <line x1="70" y1="82" x2="250" y2="82" stroke="rgba(99,102,241,0.45)" strokeWidth="1.5" strokeDasharray="5 5" style={{animation:'proj2-dash 0.9s linear infinite'}}/>

          {/* Feature branch curve up and back down */}
          <path d="M112 82 Q112 48 140 48 L182 48 Q210 48 210 82" stroke="rgba(139,92,246,0.18)" strokeWidth="1.5" fill="none"/>
          <path d="M112 82 Q112 48 140 48 L182 48 Q210 48 210 82" stroke="rgba(139,92,246,0.5)" strokeWidth="1" strokeDasharray="4 5" fill="none" style={{animation:'proj2-dash 1.1s linear infinite 0.3s'}}/>

          {/* Main branch commit dots */}
          <circle cx="112" cy="82" r="8" fill="rgba(34,197,94,0.12)" stroke="rgba(34,197,94,0.5)" strokeWidth="1.5"/>
          <circle cx="112" cy="82" r="3.5" fill="#22c55e" opacity="0.85"/>
          <text x="112" y="100" textAnchor="middle" fill="rgba(34,197,94,0.6)" fontSize="6.5" fontFamily="monospace">main</text>

          <circle cx="155" cy="82" r="7.5" fill="rgba(99,102,241,0.1)" stroke="rgba(99,102,241,0.45)" strokeWidth="1.5"/>
          <circle cx="155" cy="82" r="3" fill="#6366f1" opacity="0.8"/>

          <circle cx="210" cy="82" r="9" fill="rgba(245,158,11,0.13)" stroke="rgba(245,158,11,0.52)" strokeWidth="1.5" style={{animation:'proj2-staging 2s ease-in-out infinite'}}>
            <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite"/>
          </circle>
          <circle cx="210" cy="82" r="3.5" fill="#f59e0b" opacity="0.9"/>
          <text x="210" y="100" textAnchor="middle" fill="rgba(245,158,11,0.62)" fontSize="6.5" fontFamily="monospace">staging</text>

          {/* Feature branch commit dots */}
          <circle cx="148" cy="48" r="7" fill="rgba(139,92,246,0.1)" stroke="rgba(139,92,246,0.42)" strokeWidth="1.2"/>
          <circle cx="148" cy="48" r="2.8" fill="#8b5cf6" opacity="0.8"/>
          <circle cx="175" cy="48" r="7" fill="rgba(139,92,246,0.1)" stroke="rgba(139,92,246,0.42)" strokeWidth="1.2"/>
          <circle cx="175" cy="48" r="2.8" fill="#8b5cf6" opacity="0.8"/>
          <text x="161" y="30" textAnchor="middle" fill="rgba(139,92,246,0.6)" fontSize="6.5" fontFamily="monospace">feature</text>

          {/* Deploy arrow */}
          <line x1="222" y1="82" x2="248" y2="82" stroke="rgba(34,197,94,0.5)" strokeWidth="1.5" strokeDasharray="3 3" style={{animation:'proj2-dash 0.75s linear infinite'}}/>

          {/* Rocket */}
          <g style={{animation:'proj2-rocket 2.2s ease-in-out infinite', transformOrigin:'270px 68px'}}>
            <path d="M268 100 L260 110" stroke="rgba(34,197,94,0.35)" strokeWidth="1" strokeLinecap="round"/>
            <path d="M272 100 L264 110" stroke="rgba(34,197,94,0.25)" strokeWidth="0.8" strokeLinecap="round"/>
            <path d="M270 42 C272 38 278 36 280 36 C280 36 282 44 280 56 L276 70 L264 70 L260 56 C258 44 260 36 260 36 C262 36 268 38 270 42Z" fill="rgba(34,197,94,0.13)" stroke="rgba(34,197,94,0.6)" strokeWidth="1.3"/>
            <circle cx="270" cy="56" r="3" fill="rgba(34,197,94,0.5)"/>
            <path d="M260 64 L255 72 L260 70Z" fill="rgba(34,197,94,0.28)"/>
            <path d="M280 64 L285 72 L280 70Z" fill="rgba(34,197,94,0.28)"/>
            <circle cx="270" cy="44" r="2" fill="rgba(34,197,94,0.3)" style={{animation:'proj2-deploy 1.5s ease-in-out infinite'}}/>
          </g>
          <text x="270" y="120" textAnchor="middle" fill="rgba(34,197,94,0.55)" fontSize="6.5" fontFamily="monospace">deploy</text>

          {/* Sparkle dots */}
          <circle cx="26" cy="26" r="2.5" fill="#6366f1" opacity="0.65" style={{animation:'proj2-spark 2.2s ease-in-out infinite'}}/>
          <circle cx="294" cy="24" r="2" fill="#0891b2" opacity="0.6" style={{animation:'proj2-spark 2.2s ease-in-out infinite 0.7s'}}/>
          <circle cx="26" cy="114" r="2" fill="#818cf8" opacity="0.6" style={{animation:'proj2-spark 2.2s ease-in-out infinite 1.4s'}}/>
          <circle cx="294" cy="114" r="2.5" fill="#0891b2" opacity="0.65" style={{animation:'proj2-spark 2.2s ease-in-out infinite 2.1s'}}/>
        </svg>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4 dark:bg-[#0d1424] dark:border-[#1e2d45]">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <p className="text-slate-400">No projects yet. Check back soon!</p>
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
