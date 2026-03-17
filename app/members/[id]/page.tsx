import { readJSON, Member } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const avatarGradients = [
  'from-blue-500 to-cyan-500',
  'from-violet-500 to-purple-600',
  'from-pink-500 to-rose-500',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-500',
  'from-blue-600 to-violet-600',
];

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

function GithubIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const memberTypeLabel: Record<string, string> = {
  advisor: 'Club Advisor',
  officer: 'Club Officer',
  member: 'Member',
};

const memberTypeBadgeClass: Record<string, string> = {
  advisor: 'bg-amber-50 border border-amber-200 text-amber-600 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400',
  officer: 'bg-violet-50 border border-violet-200 text-violet-600 dark:bg-violet-500/10 dark:border-violet-500/20 dark:text-violet-400',
  member: 'bg-blue-50 border border-blue-200 text-blue-600 dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-400',
};

export default async function MemberProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const members = readJSON<Member[]>('members.json');
  const member = members.find((m) => m.id === id);
  if (!member) notFound();

  const index = members.findIndex((m) => m.id === id);
  const gradient = avatarGradients[index % avatarGradients.length];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      {/* Back */}
      <Link
        href="/members"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white text-sm mb-8 transition-colors group"
      >
        <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Members
      </Link>

      {/* Profile card */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm dark:bg-[#0d1424] dark:border-[#1e2d45] dark:shadow-none">
        {/* Top accent bar */}
        <div className={`h-1.5 bg-gradient-to-r ${gradient}`} />

        <div className="p-8">
          {/* Header */}
          <div className="flex items-start gap-6 mb-8">
            {member.avatarUrl ? (
              <img
                src={member.avatarUrl}
                alt={member.name}
                className="w-20 h-20 rounded-2xl object-cover shadow-lg flex-shrink-0"
              />
            ) : (
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-2xl shadow-lg flex-shrink-0`}>
                {getInitials(member.name)}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{member.name}</h1>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${memberTypeBadgeClass[member.memberType] ?? memberTypeBadgeClass.member}`}>
                  {member.role || memberTypeLabel[member.memberType] || 'Member'}
                </span>
                {member.focusArea && (
                  <span className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-600 text-xs px-3 py-1 rounded-full dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-400">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full dark:bg-blue-400" />
                    {member.focusArea}
                  </span>
                )}
                {member.status && (
                  <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs px-3 py-1 rounded-full dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full dark:bg-emerald-400" />
                    {member.status}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Majors */}
          {(member.majors ?? []).length > 0 && (
            <div className="mb-6">
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">
                {member.majors.length === 1 ? 'Major' : 'Majors'}
              </p>
              <div className="flex flex-wrap gap-2">
                {member.majors.map((m) => (
                  <span key={m} className="text-sm bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg dark:bg-slate-700/40 dark:text-slate-300">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {(member.skills ?? []).length > 0 && (
            <div className="mb-6">
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">Skills</p>
              <div className="flex flex-wrap gap-2">
                {member.skills.map((skill) => (
                  <span key={skill} className="text-sm bg-violet-50 border border-violet-200 text-violet-600 px-3 py-1.5 rounded-lg dark:bg-violet-500/10 dark:border-violet-500/20 dark:text-violet-300">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {(member.projects ?? []).length > 0 && (
            <div className="mb-6">
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">Projects</p>
              <div className="flex flex-wrap gap-2">
                {member.projects.map((project) => (
                  <span key={project} className="text-sm bg-slate-100 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg dark:bg-white/5 dark:border-white/10 dark:text-slate-300">
                    {project}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Social Links */}
          {(member.github || member.linkedin || member.twitter) && (
            <div className="pt-6 border-t border-slate-200 dark:border-[#1e2d45]">
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-3">Connect</p>
              <div className="flex flex-wrap gap-3">
                {member.github && (
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-all text-sm dark:bg-white/5 dark:border-white/10 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/10"
                  >
                    <GithubIcon />
                    GitHub
                  </a>
                )}
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 border border-blue-200 text-blue-600 hover:bg-blue-100 rounded-xl transition-all text-sm dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-500/20"
                  >
                    <LinkedInIcon />
                    LinkedIn
                  </a>
                )}
                {member.twitter && (
                  <a
                    href={member.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 bg-sky-50 border border-sky-200 text-sky-600 hover:bg-sky-100 rounded-xl transition-all text-sm dark:bg-sky-500/10 dark:border-sky-500/20 dark:text-sky-400 dark:hover:text-sky-300 dark:hover:bg-sky-500/20"
                  >
                    <TwitterIcon />
                    Twitter / X
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
