'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Member } from '@/lib/data';

function GithubIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function SocialIcons({ member }: { member: Member }) {
  const hasSocials = member.github || member.linkedin || member.twitter;
  if (!hasSocials) return null;
  return (
    <div className="relative z-10 flex items-center gap-1">
      {member.github && (
        <a href={member.github} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center w-6 h-6 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-500 dark:hover:text-white dark:hover:bg-white/10 transition-all"
          aria-label="GitHub" onClick={(e) => e.stopPropagation()}>
          <GithubIcon />
        </a>
      )}
      {member.linkedin && (
        <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center w-6 h-6 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:text-slate-500 dark:hover:text-blue-400 dark:hover:bg-blue-500/10 transition-all"
          aria-label="LinkedIn" onClick={(e) => e.stopPropagation()}>
          <LinkedInIcon />
        </a>
      )}
      {member.twitter && (
        <a href={member.twitter} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center w-6 h-6 rounded-md text-slate-400 hover:text-sky-500 hover:bg-sky-50 dark:text-slate-500 dark:hover:text-sky-400 dark:hover:bg-sky-500/10 transition-all"
          aria-label="Twitter / X" onClick={(e) => e.stopPropagation()}>
          <TwitterIcon />
        </a>
      )}
    </div>
  );
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

function Avatar({ member, index, size = 'md' }: { member: Member; index: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = size === 'lg' ? 'w-14 h-14 text-lg' : size === 'sm' ? 'w-10 h-10 text-sm' : 'w-12 h-12 text-base';
  if (member.avatarUrl) {
    return (
      <Image
        src={member.avatarUrl}
        alt={member.name}
        width={56}
        height={56}
        className={`${sizeClass} rounded-xl object-cover flex-shrink-0 shadow-lg`}
      />
    );
  }
  return (
    <div className={`${sizeClass} rounded-xl bg-gradient-to-br ${avatarGradients[index % avatarGradients.length]} flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0`}>
      {getInitials(member.name)}
    </div>
  );
}

function MemberCard({ member, index }: { member: Member; index: number }) {
  return (
    <div className="group relative bg-white border border-slate-200 rounded-2xl p-5 hover:border-violet-200 hover:shadow-sm hover:-translate-y-0.5 transition-all flex flex-col gap-3 dark:bg-[#0d1424] dark:border-[#1e2d45] dark:hover:border-violet-500/40">

      <Link href={`/members/${member.id}`} className="absolute inset-0 rounded-2xl z-0" aria-label={`View ${member.name}'s profile`} />
      <div className="flex items-center gap-3">
        <Avatar member={member} index={index} />
        <div className="min-w-0">
          <h3 className="text-slate-900 dark:text-white font-semibold truncate group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors">{member.name}</h3>
          {(member.majors ?? []).length > 0 && (
            <div className="flex flex-wrap gap-1 mt-0.5">
              {member.majors.map((m) => (
                <span key={m} className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md dark:bg-slate-700/40 dark:text-slate-400">{m}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {member.focusArea && (
          <span className="inline-flex items-center gap-1 bg-blue-50 border border-blue-200 text-blue-600 text-xs px-2.5 py-0.5 rounded-full dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-400">
            <span className="w-1 h-1 bg-blue-500 rounded-full dark:bg-blue-400" />{member.focusArea}
          </span>
        )}
        {member.status && (
          <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs px-2.5 py-0.5 rounded-full dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400">
            <span className="w-1 h-1 bg-emerald-500 rounded-full dark:bg-emerald-400" />{member.status}
          </span>
        )}
      </div>

      <div className="mt-auto pt-3 border-t border-slate-100 dark:border-[#1e2d45] flex items-center justify-between">
        <SocialIcons member={member} />
        <span className="relative z-10 text-xs text-slate-400 group-hover:text-violet-600 dark:text-slate-600 dark:group-hover:text-violet-400 transition-colors ml-auto">View Profile →</span>
      </div>
    </div>
  );
}

function AdvisorCard({ member, index }: { member: Member; index: number }) {
  return (
    <div className="group relative bg-white border border-amber-200 rounded-2xl p-5 hover:border-amber-300 hover:shadow-sm hover:-translate-y-0.5 transition-all flex flex-col gap-3 dark:bg-[#0d1424] dark:border-amber-500/20 dark:hover:border-amber-500/40">
      <Link href={`/members/${member.id}`} className="absolute inset-0 rounded-2xl z-0" aria-label={`View ${member.name}'s profile`} />
      <div className="flex items-center gap-3">
        <Avatar member={member} index={index} size="lg" />
        <div className="min-w-0">
          <h3 className="text-slate-900 dark:text-white font-semibold text-lg truncate group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">{member.name}</h3>
          {member.role && (
            <div className="flex flex-wrap gap-1 mt-1">
              {member.role.split(/[,/]/).map((r) => r.trim()).filter(Boolean).map((r) => (
                <span key={r} className="inline-block text-xs font-medium bg-amber-50 border border-amber-200 text-amber-600 px-2.5 py-0.5 rounded-full dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400">
                  {r}
                </span>
              ))}
            </div>
          )}
          {(member.majors ?? []).length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {member.majors.map((m) => (
                <span key={m} className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md dark:bg-slate-700/40 dark:text-slate-400">{m}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {member.focusArea && (
          <span className="inline-flex items-center gap-1 bg-blue-50 border border-blue-200 text-blue-600 text-xs px-2.5 py-0.5 rounded-full dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-400">
            <span className="w-1 h-1 bg-blue-500 rounded-full dark:bg-blue-400" />{member.focusArea}
          </span>
        )}
        {member.status && (
          <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs px-2.5 py-0.5 rounded-full dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400">
            <span className="w-1 h-1 bg-emerald-500 rounded-full dark:bg-emerald-400" />{member.status}
          </span>
        )}
      </div>

      <div className="mt-auto pt-3 border-t border-amber-100 dark:border-[#1e2d45] flex items-center justify-between">
        <SocialIcons member={member} />
        <span className="relative z-10 text-xs text-slate-400 group-hover:text-amber-600 dark:text-slate-600 dark:group-hover:text-amber-400 transition-colors ml-auto">View Profile →</span>
      </div>
    </div>
  );
}

function OfficerCard({ member, index }: { member: Member; index: number }) {
  return (
    <div className="group relative bg-white border border-violet-200 rounded-2xl p-5 hover:border-violet-300 hover:shadow-sm hover:-translate-y-0.5 transition-all flex flex-col gap-3 dark:bg-[#0d1424] dark:border-violet-500/20 dark:hover:border-violet-500/40">

      <Link href={`/members/${member.id}`} className="absolute inset-0 rounded-2xl z-0" aria-label={`View ${member.name}'s profile`} />
      <div className="flex items-center gap-3">
        <Avatar member={member} index={index} />
        <div className="min-w-0">
          <h3 className="text-slate-900 dark:text-white font-semibold truncate group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors">{member.name}</h3>
          {member.role && (
            <div className="flex flex-wrap gap-1 mt-1">
              {member.role.split(/[,/]/).map((r) => r.trim()).filter(Boolean).map((r) => (
                <span key={r} className="inline-block text-xs font-medium bg-violet-50 border border-violet-200 text-violet-600 px-2.5 py-0.5 rounded-full dark:bg-violet-500/10 dark:border-violet-500/20 dark:text-violet-400">
                  {r}
                </span>
              ))}
            </div>
          )}
          {(member.majors ?? []).length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {member.majors.map((m) => (
                <span key={m} className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md dark:bg-slate-700/40 dark:text-slate-400">{m}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {member.focusArea && (
          <span className="inline-flex items-center gap-1 bg-blue-50 border border-blue-200 text-blue-600 text-xs px-2.5 py-0.5 rounded-full dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-400">
            <span className="w-1 h-1 bg-blue-500 rounded-full dark:bg-blue-400" />{member.focusArea}
          </span>
        )}
        {member.status && (
          <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs px-2.5 py-0.5 rounded-full dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400">
            <span className="w-1 h-1 bg-emerald-500 rounded-full dark:bg-emerald-400" />{member.status}
          </span>
        )}
      </div>

      <div className="mt-auto pt-3 border-t border-violet-100 dark:border-[#1e2d45] flex items-center justify-between">
        <SocialIcons member={member} />
        <span className="relative z-10 text-xs text-slate-400 group-hover:text-violet-600 dark:text-slate-600 dark:group-hover:text-violet-400 transition-colors ml-auto">View Profile →</span>
      </div>
    </div>
  );
}

function SectionDivider({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="h-px flex-1 bg-slate-200 dark:bg-[#1e2d45]" />
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${color}`} />
        <h2 className="text-slate-900 dark:text-white font-semibold text-lg">{label}</h2>
      </div>
      <div className="h-px flex-1 bg-slate-200 dark:bg-[#1e2d45]" />
    </div>
  );
}

export default function MembersClient({ members }: { members: Member[] }) {
  const [search, setSearch] = useState('');
  const [focusFilter, setFocusFilter] = useState('All');

  const focusAreas = useMemo(() => {
    const areas = members.map((m) => m.focusArea).filter(Boolean);
    return ['All', ...Array.from(new Set(areas))];
  }, [members]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return members.filter((m) => {
      const matchesFocus = focusFilter === 'All' || m.focusArea === focusFilter;
      if (!matchesFocus) return false;
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) ||
        (m.majors ?? []).join(' ').toLowerCase().includes(q) ||
        (m.skills ?? []).join(' ').toLowerCase().includes(q) ||
        (m.focusArea ?? '').toLowerCase().includes(q) ||
        (m.status ?? '').toLowerCase().includes(q)
      );
    });
  }, [members, search, focusFilter]);

  const advisors = filtered.filter((m) => m.memberType === 'advisor');
  const officers = filtered.filter((m) => m.memberType === 'officer');
  const regulars = filtered.filter((m) => m.memberType === 'member' || !m.memberType);

  const allAdvisors = members.filter((m) => m.memberType === 'advisor');
  const allOfficers = members.filter((m) => m.memberType === 'officer');
  const allRegulars = members.filter((m) => m.memberType === 'member' || !m.memberType);

  const isEmpty = members.length === 0;
  const noResults = !isEmpty && filtered.length === 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <svg width="72" height="72" viewBox="0 0 72 72" className="mx-auto mb-5 opacity-85 dark:opacity-75" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <style>{`
              @keyframes mem-pulse { 0%,100%{opacity:0.15} 50%{opacity:0.28} }
              @keyframes mem-dash { to { stroke-dashoffset: -14; } }
              @keyframes mem-dot { 0%,100%{opacity:0.3} 50%{opacity:0.9} }
              @keyframes mem-ring { 0%,100%{opacity:0.1} 50%{opacity:0.35} }
              @keyframes mem-corner { 0%,100%{opacity:0.4} 50%{opacity:0.9} }
            `}</style>
          </defs>
          <circle cx="36" cy="36" r="20" fill="#7c3aed" fillOpacity="0.12" style={{animation:'mem-pulse 3s ease-in-out infinite'}}/>
          {/* Connection lines */}
          <line x1="36" y1="36" x2="12" y2="18" stroke="#6366f1" strokeWidth="1" strokeOpacity="0.45" strokeDasharray="3 4" style={{animation:'mem-dash 1.6s linear infinite'}}/>
          <line x1="36" y1="36" x2="60" y2="18" stroke="#0891b2" strokeWidth="1" strokeOpacity="0.45" strokeDasharray="3 4" style={{animation:'mem-dash 2s linear infinite 0.4s'}}/>
          <line x1="36" y1="36" x2="8" y2="50" stroke="#818cf8" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="3 4" style={{animation:'mem-dash 1.8s linear infinite 0.8s'}}/>
          <line x1="36" y1="36" x2="64" y2="50" stroke="#0891b2" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="3 4" style={{animation:'mem-dash 2.2s linear infinite 1.2s'}}/>
          <line x1="36" y1="36" x2="36" y2="66" stroke="#6366f1" strokeWidth="1" strokeOpacity="0.35" strokeDasharray="3 4" style={{animation:'mem-dash 1.9s linear infinite 1.6s'}}/>
          {/* Outer person nodes */}
          <circle cx="12" cy="18" r="8" fill="#6366f1" fillOpacity="0.1" stroke="#6366f1" strokeWidth="1.5" strokeOpacity="0.55"/>
          <circle cx="12" cy="15.5" r="2.5" fill="#6366f1" fillOpacity="0.5"/>
          <path d="M7.5 21 Q12 18.5 16.5 21" fill="none" stroke="#6366f1" strokeWidth="1.2" strokeOpacity="0.5" strokeLinecap="round"/>
          <circle cx="60" cy="18" r="8" fill="#0891b2" fillOpacity="0.1" stroke="#0891b2" strokeWidth="1.5" strokeOpacity="0.55"/>
          <circle cx="60" cy="15.5" r="2.5" fill="#0891b2" fillOpacity="0.5"/>
          <path d="M55.5 21 Q60 18.5 64.5 21" fill="none" stroke="#0891b2" strokeWidth="1.2" strokeOpacity="0.5" strokeLinecap="round"/>
          <circle cx="8" cy="50" r="7" fill="#818cf8" fillOpacity="0.1" stroke="#818cf8" strokeWidth="1.5" strokeOpacity="0.5"/>
          <circle cx="8" cy="47.5" r="2.2" fill="#818cf8" fillOpacity="0.5"/>
          <path d="M4 52.5 Q8 50.5 12 52.5" fill="none" stroke="#818cf8" strokeWidth="1.2" strokeOpacity="0.5" strokeLinecap="round"/>
          <circle cx="64" cy="50" r="7" fill="#0891b2" fillOpacity="0.1" stroke="#0891b2" strokeWidth="1.5" strokeOpacity="0.5"/>
          <circle cx="64" cy="47.5" r="2.2" fill="#0891b2" fillOpacity="0.5"/>
          <path d="M60 52.5 Q64 50.5 68 52.5" fill="none" stroke="#0891b2" strokeWidth="1.2" strokeOpacity="0.5" strokeLinecap="round"/>
          <circle cx="36" cy="66" r="7" fill="#6366f1" fillOpacity="0.1" stroke="#6366f1" strokeWidth="1.5" strokeOpacity="0.45"/>
          <circle cx="36" cy="63.5" r="2.2" fill="#6366f1" fillOpacity="0.45"/>
          <path d="M32 69 Q36 67 40 69" fill="none" stroke="#6366f1" strokeWidth="1.2" strokeOpacity="0.45" strokeLinecap="round"/>
          {/* Center node */}
          <circle cx="36" cy="36" r="10" fill="#6366f1" fillOpacity="0.12" stroke="#6366f1" strokeWidth="1.8" strokeOpacity="0.6"/>
          <circle cx="36" cy="33" r="3.5" fill="#6366f1" fillOpacity="0.6"/>
          <path d="M29.5 40 Q36 37 42.5 40" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeOpacity="0.6" strokeLinecap="round"/>
          {/* Floating dots */}
          <circle cx="24" cy="28" r="1.5" fill="#6366f1" fillOpacity="0.5" style={{animation:'mem-dot 2.5s ease-in-out infinite'}}/>
          <circle cx="48" cy="26" r="1.5" fill="#0891b2" fillOpacity="0.5" style={{animation:'mem-dot 2.5s ease-in-out infinite 0.8s'}}/>
          <circle cx="22" cy="48" r="1.5" fill="#818cf8" fillOpacity="0.5" style={{animation:'mem-dot 2.5s ease-in-out infinite 1.6s'}}/>
          {/* Outer glow ring */}
          <circle cx="36" cy="36" r="35.5" fill="none" stroke="#6366f1" strokeWidth="1" strokeOpacity="1" style={{animation:'mem-ring 3s ease-in-out infinite'}}/>
          {/* Corner accents */}
          <path d="M12 2 L2 2 L2 12" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{animation:'mem-corner 3s ease-in-out infinite'}}/>
          <path d="M60 2 L70 2 L70 12" fill="none" stroke="#0891b2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{animation:'mem-corner 3s ease-in-out infinite 0.75s'}}/>
          <path d="M12 70 L2 70 L2 60" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{animation:'mem-corner 3s ease-in-out infinite 1.5s'}}/>
          <path d="M60 70 L70 70 L70 60" fill="none" stroke="#0891b2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{animation:'mem-corner 3s ease-in-out infinite 2.25s'}}/>
        </svg>
        <p className="text-violet-600 dark:text-violet-400 text-sm font-medium mb-2">The people behind the code</p>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">Meet Our Members</h1>
        <p className="text-slate-500 max-w-xl mx-auto mb-4">
          A diverse group of students and advisors united by a passion for technology and building things that matter.
        </p>
        {members.length > 0 && (
          <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 text-slate-500 text-sm px-4 py-1.5 rounded-full dark:bg-white/5 dark:border-white/10 dark:text-slate-400">
            <span className="w-1.5 h-1.5 bg-violet-500 rounded-full dark:bg-violet-400" />
            {members.length} member{members.length !== 1 ? 's' : ''} total
          </div>
        )}
      </div>

      {/* Search + filter */}
      {!isEmpty && (
        <div className="mb-10 space-y-3">
          <div className="relative max-w-md mx-auto">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, skill, major, or focus area..."
              className="w-full bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400/30 transition-all dark:bg-[#0f1a2e] dark:border-[#253650] dark:text-white dark:placeholder:text-slate-600 dark:focus:border-violet-500/50 dark:focus:ring-violet-500/30"
            />
          </div>

          {focusAreas.length > 2 && (
            <div className="flex flex-wrap justify-center gap-2">
              {focusAreas.map((area) => (
                <button
                  key={area}
                  onClick={() => setFocusFilter(area)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                    focusFilter === area
                      ? 'bg-violet-600 border-violet-500 text-white'
                      : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 dark:bg-white/5 dark:border-white/10 dark:text-slate-400 dark:hover:text-white dark:hover:border-white/20'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {isEmpty ? (
        <div className="text-center py-20 text-slate-400">No members yet. Check back soon!</div>
      ) : noResults ? (
        <div className="text-center py-20 text-slate-400">No members match your search.</div>
      ) : (
        <div className="space-y-16">
          {advisors.length > 0 && (
            <section>
              <SectionDivider color="bg-amber-500" label={`Club Advisors${advisors.length !== allAdvisors.length ? ` (${advisors.length}/${allAdvisors.length})` : ''}`} />
              <div className="grid sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
                {advisors.map((m) => <AdvisorCard key={m.id} member={m} index={members.indexOf(m)} />)}
              </div>
            </section>
          )}

          {officers.length > 0 && (
            <section>
              <SectionDivider color="bg-violet-500" label={`Club Officers${officers.length !== allOfficers.length ? ` (${officers.length}/${allOfficers.length})` : ''}`} />
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {officers.map((m) => <OfficerCard key={m.id} member={m} index={members.indexOf(m)} />)}
              </div>
            </section>
          )}

          {regulars.length > 0 && (
            <section>
              <SectionDivider color="bg-blue-500" label={`Members${regulars.length !== allRegulars.length ? ` (${regulars.length}/${allRegulars.length})` : ''}`} />
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {regulars.map((m) => <MemberCard key={m.id} member={m} index={members.indexOf(m)} />)}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
