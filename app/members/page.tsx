import { readJSON, Member } from '@/lib/data';

export const dynamic = 'force-dynamic';

function GithubIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

const avatarGradients = [
  'from-blue-500 to-cyan-500',
  'from-violet-500 to-purple-600',
  'from-pink-500 to-rose-500',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-500',
  'from-blue-600 to-violet-600',
];

function SocialLinks({ member }: { member: Member }) {
  const hasSocials = member.github || member.linkedin || member.twitter;
  return (
    <div className="flex items-center gap-2 pt-4 border-t border-[#1e1e2e]">
      {member.github && (
        <a href={member.github} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all" aria-label="GitHub">
          <GithubIcon />
        </a>
      )}
      {member.linkedin && (
        <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all" aria-label="LinkedIn">
          <LinkedInIcon />
        </a>
      )}
      {member.twitter && (
        <a href={member.twitter} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 text-slate-400 hover:text-sky-400 hover:bg-sky-500/10 transition-all" aria-label="Twitter / X">
          <TwitterIcon />
        </a>
      )}
      {!hasSocials && <span className="text-slate-600 text-xs">No socials listed</span>}
    </div>
  );
}

function MemberCard({ member, index }: { member: Member; index: number }) {
  return (
    <div className="bg-[#0f0f1a] border border-[#1e1e2e] rounded-2xl p-6 hover:border-violet-500/30 transition-all hover:-translate-y-0.5 flex flex-col">
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${avatarGradients[index % avatarGradients.length]} flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0`}>
          {getInitials(member.name)}
        </div>
        <div className="min-w-0">
          <h3 className="text-white font-semibold truncate">{member.name}</h3>
          <p className="text-slate-500 text-sm truncate">{member.major}</p>
        </div>
      </div>

      {member.focusArea && (
        <div className="mb-4">
          <span className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
            {member.focusArea}
          </span>
        </div>
      )}

      {member.projects.length > 0 && (
        <div className="mb-5 flex-1">
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-2">Projects</p>
          <div className="flex flex-wrap gap-1.5">
            {member.projects.map((project) => (
              <span key={project} className="text-xs bg-white/5 border border-white/8 text-slate-400 px-2.5 py-1 rounded-md">
                {project}
              </span>
            ))}
          </div>
        </div>
      )}

      <SocialLinks member={member} />
    </div>
  );
}

function AdvisorCard({ member, index }: { member: Member; index: number }) {
  return (
    <div className="bg-[#0f0f1a] border border-amber-500/20 rounded-2xl p-6 hover:border-amber-500/40 transition-all flex flex-col">
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${avatarGradients[index % avatarGradients.length]} flex items-center justify-center text-white font-bold text-xl shadow-lg flex-shrink-0`}>
          {getInitials(member.name)}
        </div>
        <div className="min-w-0">
          <h3 className="text-white font-semibold text-lg truncate">{member.name}</h3>
          {member.role && (
            <span className="inline-block mt-1 text-xs font-medium bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2.5 py-0.5 rounded-full">
              {member.role}
            </span>
          )}
          {member.major && <p className="text-slate-500 text-sm mt-1 truncate">{member.major}</p>}
        </div>
      </div>

      {member.focusArea && (
        <div className="mb-4">
          <span className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
            {member.focusArea}
          </span>
        </div>
      )}

      <SocialLinks member={member} />
    </div>
  );
}

function OfficerCard({ member, index }: { member: Member; index: number }) {
  return (
    <div className="bg-[#0f0f1a] border border-violet-500/20 rounded-2xl p-6 hover:border-violet-500/40 transition-all flex flex-col">
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${avatarGradients[index % avatarGradients.length]} flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0`}>
          {getInitials(member.name)}
        </div>
        <div className="min-w-0">
          <h3 className="text-white font-semibold truncate">{member.name}</h3>
          {member.role && (
            <span className="inline-block mt-1 text-xs font-medium bg-violet-500/10 border border-violet-500/20 text-violet-400 px-2.5 py-0.5 rounded-full">
              {member.role}
            </span>
          )}
          {member.major && <p className="text-slate-500 text-sm mt-1 truncate">{member.major}</p>}
        </div>
      </div>

      {member.focusArea && (
        <div className="mb-4">
          <span className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
            {member.focusArea}
          </span>
        </div>
      )}

      {member.projects.length > 0 && (
        <div className="mb-5 flex-1">
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-2">Projects</p>
          <div className="flex flex-wrap gap-1.5">
            {member.projects.map((project) => (
              <span key={project} className="text-xs bg-white/5 border border-white/8 text-slate-400 px-2.5 py-1 rounded-md">
                {project}
              </span>
            ))}
          </div>
        </div>
      )}

      <SocialLinks member={member} />
    </div>
  );
}

export default function MembersPage() {
  const members = readJSON<Member[]>('members.json');

  const advisors = members.filter((m) => m.memberType === 'advisor');
  const officers = members.filter((m) => m.memberType === 'officer');
  const regulars = members.filter((m) => m.memberType === 'member' || !m.memberType);

  const isEmpty = members.length === 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <p className="text-violet-400 text-sm font-medium mb-2">The people behind the code</p>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Meet Our Members</h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          A diverse group of students and advisors united by a passion for technology and building things that matter.
        </p>
      </div>

      {isEmpty ? (
        <div className="text-center py-20 text-slate-500">No members yet. Check back soon!</div>
      ) : (
        <div className="space-y-16">

          {/* Advisors */}
          {advisors.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-[#1e1e2e]" />
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <h2 className="text-white font-semibold text-lg">Club Advisors</h2>
                </div>
                <div className="h-px flex-1 bg-[#1e1e2e]" />
              </div>
              <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
                {advisors.map((m, i) => <AdvisorCard key={m.id} member={m} index={i} />)}
              </div>
            </section>
          )}

          {/* Officers */}
          {officers.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-[#1e1e2e]" />
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-violet-400" />
                  <h2 className="text-white font-semibold text-lg">Club Officers</h2>
                </div>
                <div className="h-px flex-1 bg-[#1e1e2e]" />
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {officers.map((m, i) => <OfficerCard key={m.id} member={m} index={i} />)}
              </div>
            </section>
          )}

          {/* Regular Members */}
          {regulars.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-[#1e1e2e]" />
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  <h2 className="text-white font-semibold text-lg">Members</h2>
                </div>
                <div className="h-px flex-1 bg-[#1e1e2e]" />
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {regulars.map((m, i) => <MemberCard key={m.id} member={m} index={i} />)}
              </div>
            </section>
          )}

        </div>
      )}
    </div>
  );
}
