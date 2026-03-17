import { readJSON, Member } from '@/lib/data';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

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

function MemberCard({ member, index }: { member: Member; index: number }) {
  return (
    <Link
      href={`/members/${member.id}`}
      className="group bg-[#0d1424] border border-[#1e2d45] rounded-2xl p-5 hover:border-violet-500/40 hover:-translate-y-0.5 transition-all flex flex-col gap-3"
    >
      {/* Avatar + name */}
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${avatarGradients[index % avatarGradients.length]} flex items-center justify-center text-white font-bold text-base shadow-lg flex-shrink-0`}>
          {getInitials(member.name)}
        </div>
        <div className="min-w-0">
          <h3 className="text-white font-semibold truncate group-hover:text-violet-300 transition-colors">{member.name}</h3>
          {(member.majors ?? []).length > 0 && (
            <div className="flex flex-wrap gap-1 mt-0.5">
              {member.majors.map((m) => (
                <span key={m} className="text-xs bg-slate-700/40 text-slate-400 px-2 py-0.5 rounded-md">{m}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5">
        {member.focusArea && (
          <span className="inline-flex items-center gap-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs px-2.5 py-0.5 rounded-full">
            <span className="w-1 h-1 bg-blue-400 rounded-full" />{member.focusArea}
          </span>
        )}
        {member.status && (
          <span className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-2.5 py-0.5 rounded-full">
            <span className="w-1 h-1 bg-emerald-400 rounded-full" />{member.status}
          </span>
        )}
      </div>

      {/* Footer hint */}
      <div className="mt-auto pt-3 border-t border-[#1e2d45] flex items-center justify-between">
        <div className="flex gap-3 text-xs text-slate-600">
          {(member.skills ?? []).length > 0 && <span>{member.skills.length} skill{member.skills.length !== 1 ? 's' : ''}</span>}
          {(member.projects ?? []).length > 0 && <span>{member.projects.length} project{member.projects.length !== 1 ? 's' : ''}</span>}
        </div>
        <span className="text-xs text-slate-600 group-hover:text-violet-400 transition-colors">View Profile →</span>
      </div>
    </Link>
  );
}

function AdvisorCard({ member, index }: { member: Member; index: number }) {
  return (
    <Link
      href={`/members/${member.id}`}
      className="group bg-[#0d1424] border border-amber-500/20 rounded-2xl p-5 hover:border-amber-500/40 hover:-translate-y-0.5 transition-all flex flex-col gap-3"
    >
      <div className="flex items-center gap-3">
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${avatarGradients[index % avatarGradients.length]} flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0`}>
          {getInitials(member.name)}
        </div>
        <div className="min-w-0">
          <h3 className="text-white font-semibold text-lg truncate group-hover:text-amber-300 transition-colors">{member.name}</h3>
          {member.role && (
            <span className="inline-block mt-1 text-xs font-medium bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2.5 py-0.5 rounded-full">
              {member.role}
            </span>
          )}
          {(member.majors ?? []).length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {member.majors.map((m) => (
                <span key={m} className="text-xs bg-slate-700/40 text-slate-400 px-2 py-0.5 rounded-md">{m}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {member.focusArea && (
          <span className="inline-flex items-center gap-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs px-2.5 py-0.5 rounded-full">
            <span className="w-1 h-1 bg-blue-400 rounded-full" />{member.focusArea}
          </span>
        )}
        {member.status && (
          <span className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-2.5 py-0.5 rounded-full">
            <span className="w-1 h-1 bg-emerald-400 rounded-full" />{member.status}
          </span>
        )}
      </div>

      <div className="mt-auto pt-3 border-t border-[#1e2d45] flex justify-end">
        <span className="text-xs text-slate-600 group-hover:text-amber-400 transition-colors">View Profile →</span>
      </div>
    </Link>
  );
}

function OfficerCard({ member, index }: { member: Member; index: number }) {
  return (
    <Link
      href={`/members/${member.id}`}
      className="group bg-[#0d1424] border border-violet-500/20 rounded-2xl p-5 hover:border-violet-500/40 hover:-translate-y-0.5 transition-all flex flex-col gap-3"
    >
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${avatarGradients[index % avatarGradients.length]} flex items-center justify-center text-white font-bold text-base shadow-lg flex-shrink-0`}>
          {getInitials(member.name)}
        </div>
        <div className="min-w-0">
          <h3 className="text-white font-semibold truncate group-hover:text-violet-300 transition-colors">{member.name}</h3>
          {member.role && (
            <span className="inline-block mt-1 text-xs font-medium bg-violet-500/10 border border-violet-500/20 text-violet-400 px-2.5 py-0.5 rounded-full">
              {member.role}
            </span>
          )}
          {(member.majors ?? []).length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {member.majors.map((m) => (
                <span key={m} className="text-xs bg-slate-700/40 text-slate-400 px-2 py-0.5 rounded-md">{m}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {member.focusArea && (
          <span className="inline-flex items-center gap-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs px-2.5 py-0.5 rounded-full">
            <span className="w-1 h-1 bg-blue-400 rounded-full" />{member.focusArea}
          </span>
        )}
        {member.status && (
          <span className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-2.5 py-0.5 rounded-full">
            <span className="w-1 h-1 bg-emerald-400 rounded-full" />{member.status}
          </span>
        )}
      </div>

      <div className="mt-auto pt-3 border-t border-[#1e2d45] flex items-center justify-between">
        <div className="flex gap-3 text-xs text-slate-600">
          {(member.skills ?? []).length > 0 && <span>{member.skills.length} skill{member.skills.length !== 1 ? 's' : ''}</span>}
          {(member.projects ?? []).length > 0 && <span>{member.projects.length} project{member.projects.length !== 1 ? 's' : ''}</span>}
        </div>
        <span className="text-xs text-slate-600 group-hover:text-violet-400 transition-colors">View Profile →</span>
      </div>
    </Link>
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
        <p className="text-slate-400 max-w-xl mx-auto mb-4">
          A diverse group of students and advisors united by a passion for technology and building things that matter.
        </p>
        {members.length > 0 && (
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-slate-400 text-sm px-4 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 bg-violet-400 rounded-full" />
            {members.length} member{members.length !== 1 ? 's' : ''} total
          </div>
        )}
      </div>

      {isEmpty ? (
        <div className="text-center py-20 text-slate-500">No members yet. Check back soon!</div>
      ) : (
        <div className="space-y-16">

          {/* Advisors */}
          {advisors.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-[#1e2d45]" />
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <h2 className="text-white font-semibold text-lg">Club Advisors</h2>
                </div>
                <div className="h-px flex-1 bg-[#1e2d45]" />
              </div>
              <div className="grid sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
                {advisors.map((m, i) => <AdvisorCard key={m.id} member={m} index={i} />)}
              </div>
            </section>
          )}

          {/* Officers */}
          {officers.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-[#1e2d45]" />
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-violet-400" />
                  <h2 className="text-white font-semibold text-lg">Club Officers</h2>
                </div>
                <div className="h-px flex-1 bg-[#1e2d45]" />
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {officers.map((m, i) => <OfficerCard key={m.id} member={m} index={i} />)}
              </div>
            </section>
          )}

          {/* Regular Members */}
          {regulars.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-[#1e2d45]" />
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  <h2 className="text-white font-semibold text-lg">Members</h2>
                </div>
                <div className="h-px flex-1 bg-[#1e2d45]" />
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {regulars.map((m, i) => <MemberCard key={m.id} member={m} index={i} />)}
              </div>
            </section>
          )}

        </div>
      )}
    </div>
  );
}
