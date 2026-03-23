import { readJSON, Member, Project, CustomField } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const members = readJSON<Member[]>('members.json');
  const member = members.find((m) => m.id === id);
  if (!member) return {};
  return {
    title: `${member.name} — LC3`,
    description: member.bio || `${member.name} is a ${member.role || 'member'} of LC3 - Lowcode Cloud Club.`,
  };
}

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
  const projects = readJSON<Project[]>('projects.json');
  const member = members.find((m) => m.id === id);
  if (!member) notFound();

  const index = members.findIndex((m) => m.id === id);

  // Build a name→project map for fast lookup
  const projectByName = new Map(projects.map((p) => [p.name.toLowerCase(), p]));

  // Other members who share at least one skill with this member
  const memberSkills = new Set((member.skills ?? []).map((s) => s.toLowerCase()));
  const relatedMembers = members
    .filter((m) => m.id !== member.id)
    .map((m) => ({
      member: m,
      shared: (m.skills ?? []).filter((s) => memberSkills.has(s.toLowerCase())).length,
    }))
    .filter(({ shared }) => shared > 0)
    .sort((a, b) => b.shared - a.shared)
    .slice(0, 3)
    .map(({ member: m }) => m);
  const gradient = avatarGradients[index % avatarGradients.length];
  const prevMember = index > 0 ? members[index - 1] : null;
  const nextMember = index < members.length - 1 ? members[index + 1] : null;

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
              <Image
                src={member.avatarUrl}
                alt={member.name}
                width={80}
                height={80}
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
                {member.role
                  ? member.role.split(/[,/]/).map((r) => r.trim()).filter(Boolean).map((r) => (
                      <span key={r} className={`text-xs font-medium px-2.5 py-1 rounded-full ${memberTypeBadgeClass[member.memberType] ?? memberTypeBadgeClass.member}`}>
                        {r}
                      </span>
                    ))
                  : (
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${memberTypeBadgeClass[member.memberType] ?? memberTypeBadgeClass.member}`}>
                        {memberTypeLabel[member.memberType] || 'Member'}
                      </span>
                    )
                }
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

          {/* Bio */}
          {member.bio && (
            <div className="mb-6">
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">About</p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">{member.bio}</p>
            </div>
          )}

          {/* Majors + Graduation Year */}
          {((member.majors ?? []).length > 0 || member.graduationYear) && (
            <div className="mb-6">
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">
                {(member.majors ?? []).length === 1 ? 'Major' : 'Majors'}
              </p>
              <div className="flex flex-wrap gap-2 items-center">
                {(member.majors ?? []).map((m) => (
                  <span key={m} className="text-sm bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg dark:bg-slate-700/40 dark:text-slate-300">
                    {m}
                  </span>
                ))}
                {member.graduationYear && (
                  <span className="text-sm bg-slate-100 text-slate-500 px-3 py-1.5 rounded-lg dark:bg-slate-700/40 dark:text-slate-400">
                    Class of {member.graduationYear}
                  </span>
                )}
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
                {member.projects.map((project) => {
                  const matched = projectByName.get(project.toLowerCase());
                  return matched ? (
                    <Link
                      key={project}
                      href={`/projects#${matched.id}`}
                      className="inline-flex items-center gap-1.5 text-sm bg-violet-50 border border-violet-200 text-violet-600 px-3 py-1.5 rounded-lg hover:bg-violet-100 hover:border-violet-300 transition-colors dark:bg-violet-500/10 dark:border-violet-500/20 dark:text-violet-400 dark:hover:bg-violet-500/20"
                    >
                      {project}
                      <svg className="w-3 h-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </Link>
                  ) : (
                    <span key={project} className="text-sm bg-slate-100 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg dark:bg-white/5 dark:border-white/10 dark:text-slate-300">
                      {project}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Custom fields */}
          {(member.customFields ?? []).length > 0 && (
            <div className="mb-6">
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-3">More</p>
              <div className="space-y-2">
                {(member.customFields as CustomField[]).map((cf, i) => (
                  <div key={i} className="flex gap-3 text-sm">
                    <span className="text-slate-400 dark:text-slate-500 shrink-0 min-w-[120px]">{cf.label}</span>
                    <span className="text-slate-700 dark:text-slate-300">{cf.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Social Links */}
          {(member.github || member.linkedin || member.twitter || member.website) && (
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
                {member.website && (
                  <a
                    href={member.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-all text-sm dark:bg-white/5 dark:border-white/10 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/10"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                    </svg>
                    Website
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related members */}
      {relatedMembers.length > 0 && (
        <div className="mt-6">
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-3">Members with shared skills</p>
          <div className="flex flex-wrap gap-3">
            {relatedMembers.map((m) => {
              const relIndex = members.findIndex((x) => x.id === m.id);
              const relGradient = avatarGradients[relIndex % avatarGradients.length];
              return (
                <Link
                  key={m.id}
                  href={`/members/${m.id}`}
                  className="flex items-center gap-3 px-4 py-2.5 bg-white border border-slate-200 rounded-xl hover:border-violet-300 dark:hover:border-violet-500/40 hover:shadow-sm transition-all dark:bg-[#0d1424] dark:border-[#1e2d45]"
                >
                  {m.avatarUrl ? (
                    <Image src={m.avatarUrl} alt={m.name} width={32} height={32} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                  ) : (
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${relGradient} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                      {getInitials(m.name)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{m.name}</p>
                    {m.role && <p className="text-xs text-slate-400 truncate">{m.role.split(/[,/]/)[0].trim()}</p>}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Prev / Next navigation */}
      {(prevMember || nextMember) && (
        <div className="flex items-center justify-between mt-6 gap-4">
          {prevMember ? (
            <Link
              href={`/members/${prevMember.id}`}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 dark:border-[#1e2d45] bg-white dark:bg-[#0d1424] hover:border-violet-300 dark:hover:border-violet-500/40 transition-all group min-w-0 flex-1"
            >
              <svg className="w-4 h-4 text-slate-400 group-hover:-translate-x-0.5 transition-transform shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <div className="min-w-0">
                <div className="text-xs text-slate-400 mb-0.5">Previous</div>
                <div className="text-sm font-medium text-slate-900 dark:text-white truncate">{prevMember.name}</div>
              </div>
            </Link>
          ) : <div className="flex-1" />}

          {nextMember ? (
            <Link
              href={`/members/${nextMember.id}`}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 dark:border-[#1e2d45] bg-white dark:bg-[#0d1424] hover:border-violet-300 dark:hover:border-violet-500/40 transition-all group min-w-0 flex-1 justify-end text-right"
            >
              <div className="min-w-0">
                <div className="text-xs text-slate-400 mb-0.5">Next</div>
                <div className="text-sm font-medium text-slate-900 dark:text-white truncate">{nextMember.name}</div>
              </div>
              <svg className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : <div className="flex-1" />}
        </div>
      )}
    </div>
  );
}
