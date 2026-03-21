'use client';

import { useState, useMemo, useEffect } from 'react';
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

const variantStyles = {
  member:  { border: 'border-slate-200 dark:border-[#1e2d45]',  roleTag: 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-400',  divider: 'border-slate-100 dark:border-[#1e2d45]' },
  officer: { border: 'border-violet-200/60 dark:border-violet-500/20', roleTag: 'bg-violet-50 border-violet-200 text-violet-600 dark:bg-violet-500/10 dark:border-violet-500/20 dark:text-violet-400', divider: 'border-violet-100 dark:border-[#1e2d45]' },
  advisor: { border: 'border-amber-200/60 dark:border-amber-500/20',   roleTag: 'bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400',   divider: 'border-amber-100 dark:border-[#1e2d45]' },
} as const;

function FlipCard({ member, index, variant = 'member' }: { member: Member; index: number; variant?: keyof typeof variantStyles }) {
  const [flipped, setFlipped] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const vs = variantStyles[variant];

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  return (
    <div
      className="relative h-56 rounded-2xl transition-[box-shadow] duration-300"
      style={{
        perspective: isTouch ? undefined : '1000px',
        boxShadow: flipped ? '0 0 32px rgba(139,92,246,0.32)' : '0 0 0 rgba(139,92,246,0)',
      }}
      onMouseEnter={!isTouch ? () => setFlipped(true) : undefined}
      onMouseLeave={!isTouch ? () => setFlipped(false) : undefined}
      onClick={() => { if (isTouch) setFlipped(f => !f); }}
    >
      {/* Flip inner */}
      <div
        className="w-full h-full"
        style={isTouch ? {} : {
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.6s cubic-bezier(0.4,0.2,0.2,1)',
        }}
      >

        {/* ── FRONT FACE ── */}
        <div
          className={`absolute inset-0 bg-white dark:bg-[#0d1424] border ${vs.border} rounded-2xl p-5 flex flex-col gap-3 overflow-hidden`}
          style={isTouch ? {
            opacity: flipped ? 0 : 1,
            pointerEvents: flipped ? 'none' : 'auto',
            transition: 'opacity 0.3s ease',
          } : {
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >

          {/* Avatar + name */}
          <div className="flex items-center gap-3 relative z-10">
            <Avatar member={member} index={index} />
            <div className="min-w-0">
              <h3 className="text-slate-900 dark:text-white font-semibold truncate">{member.name}</h3>
              {member.role ? (
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {member.role.split(/[,/]/).map((r) => r.trim()).filter(Boolean).slice(0, 2).map((r) => (
                    <span key={r} className={`inline-block text-xs font-medium border px-2 py-0.5 rounded-full ${vs.roleTag}`}>{r}</span>
                  ))}
                </div>
              ) : (member.majors ?? []).length > 0 && (
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {member.majors.slice(0, 1).map((m) => (
                    <span key={m} className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md dark:bg-slate-700/40 dark:text-slate-400">{m}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-1.5 relative z-10">
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

          {/* Footer */}
          <div className={`mt-auto pt-3 border-t ${vs.divider} flex items-center justify-between relative z-10`}>
            <SocialIcons member={member} />
            <Link
              href={`/members/${member.id}`}
              className="text-xs text-slate-400 dark:text-slate-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors ml-auto"
              onClick={e => e.stopPropagation()}
            >
              View Profile →
            </Link>
          </div>
        </div>

        {/* ── BACK FACE ── */}
        <div
          className="absolute inset-0 rounded-2xl p-5 flex flex-col gap-2.5 overflow-hidden"
          style={isTouch ? {
            opacity: flipped ? 1 : 0,
            pointerEvents: flipped ? 'auto' : 'none',
            transition: 'opacity 0.3s ease',
            background: 'linear-gradient(135deg, #0f2040 0%, #1a0d3b 60%, #0a1628 100%)',
          } : {
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'linear-gradient(135deg, #0f2040 0%, #1a0d3b 60%, #0a1628 100%)',
          }}
        >
          {/* Glow blobs */}
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-violet-600/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />

          {/* Name row */}
          <div className="flex items-center gap-2 relative z-10">
            <Avatar member={member} index={index} size="sm" />
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm leading-tight truncate">{member.name}</p>
              {member.role && (
                <p className="text-blue-300 text-xs leading-tight truncate">{member.role.split(/[,/]/)[0].trim()}</p>
              )}
            </div>
          </div>

          {/* Majors */}
          {(member.majors ?? []).length > 0 && (
            <div className="flex flex-wrap gap-1 relative z-10">
              {member.majors.slice(0, 2).map((m) => (
                <span key={m} className="text-xs bg-white/10 border border-white/10 text-blue-100 px-2 py-0.5 rounded-md">{m}</span>
              ))}
            </div>
          )}

          {/* Focus area */}
          {member.focusArea && (
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1 bg-violet-500/20 border border-violet-400/30 text-violet-200 text-xs px-2.5 py-0.5 rounded-full">
                <span className="w-1 h-1 bg-violet-400 rounded-full" />{member.focusArea}
              </span>
            </div>
          )}

          {/* Skills */}
          {(member.skills ?? []).length > 0 && (
            <div className="flex flex-wrap gap-1 relative z-10">
              {member.skills.slice(0, 4).map((s) => (
                <span key={s} className="text-xs bg-blue-500/20 border border-blue-400/20 text-blue-100 px-2 py-0.5 rounded-md">{s}</span>
              ))}
              {member.skills.length > 4 && (
                <span className="text-xs text-blue-300/60 self-center">+{member.skills.length - 4}</span>
              )}
            </div>
          )}

          {/* Footer: socials + view profile */}
          <div className="mt-auto pt-2 border-t border-white/10 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-1">
              {member.github && (
                <a href={member.github} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all"
                  onClick={(e) => e.stopPropagation()}><GithubIcon /></a>
              )}
              {member.linkedin && (
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/10 text-white/70 hover:bg-blue-400/30 hover:text-blue-300 transition-all"
                  onClick={(e) => e.stopPropagation()}><LinkedInIcon /></a>
              )}
              {member.twitter && (
                <a href={member.twitter} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/10 text-white/70 hover:bg-sky-400/20 hover:text-sky-300 transition-all"
                  onClick={(e) => e.stopPropagation()}><TwitterIcon /></a>
              )}
            </div>
            <Link
              href={`/members/${member.id}`}
              className="text-xs font-medium text-white/60 hover:text-white transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              View Profile →
            </Link>
          </div>
        </div>

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
        <svg width="320" height="140" viewBox="0 0 320 140" fill="none" className="mx-auto mb-6 opacity-90 dark:opacity-80" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <style>{`
              @keyframes mem2-dash { to { stroke-dashoffset: -14; } }
              @keyframes mem2-spark { 0%,100%{opacity:0.3;transform:scale(0.9)} 50%{opacity:0.85;transform:scale(1.1)} }
              @keyframes mem2-corner { 0%,100%{opacity:0.35} 50%{opacity:0.8} }
              @keyframes mem2-hub { 0%,100%{opacity:0.18} 50%{opacity:0.35} }
              @keyframes mem2-node { 0%,100%{opacity:0.55} 50%{opacity:1} }
              @keyframes mem2-pulse { 0%,100%{opacity:0.5} 50%{opacity:0} }
            `}</style>
          </defs>

          {/* Corner brackets */}
          <path d="M8 8 L8 22 M8 8 L22 8" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5" strokeLinecap="round" style={{animation:'mem2-corner 3s ease-in-out infinite'}}/>
          <path d="M312 8 L312 22 M312 8 L298 8" stroke="rgba(8,145,178,0.4)" strokeWidth="1.5" strokeLinecap="round" style={{animation:'mem2-corner 3s ease-in-out infinite 0.75s'}}/>
          <path d="M8 132 L8 118 M8 132 L22 132" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5" strokeLinecap="round" style={{animation:'mem2-corner 3s ease-in-out infinite 1.5s'}}/>
          <path d="M312 132 L312 118 M312 132 L298 132" stroke="rgba(8,145,178,0.4)" strokeWidth="1.5" strokeLinecap="round" style={{animation:'mem2-corner 3s ease-in-out infinite 2.25s'}}/>

          {/* Outer orbit ring */}
          <circle cx="160" cy="70" r="58" fill="none" stroke="rgba(139,92,246,0.08)" strokeWidth="1"/>
          <circle cx="160" cy="70" r="58" fill="none" stroke="rgba(139,92,246,0.22)" strokeWidth="1" strokeDasharray="5 9">
            <animateTransform attributeName="transform" type="rotate" from="360 160 70" to="0 160 70" dur="22s" repeatCount="indefinite"/>
          </circle>

          {/* Inner orbit ring */}
          <circle cx="160" cy="70" r="38" fill="none" stroke="rgba(99,102,241,0.1)" strokeWidth="1"/>
          <circle cx="160" cy="70" r="38" fill="none" stroke="rgba(99,102,241,0.28)" strokeWidth="1" strokeDasharray="4 7">
            <animateTransform attributeName="transform" type="rotate" from="0 160 70" to="360 160 70" dur="15s" repeatCount="indefinite"/>
          </circle>

          {/* Hub glow */}
          <circle cx="160" cy="70" r="22" fill="rgba(99,102,241,0.12)" style={{animation:'mem2-hub 3s ease-in-out infinite'}}/>

          {/* Hub pulse ring */}
          <circle cx="160" cy="70" r="22" fill="none" stroke="rgba(99,102,241,0.3)" strokeWidth="1">
            <animate attributeName="r" values="22;32;22" dur="3s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.5;0;0.5" dur="3s" repeatCount="indefinite"/>
          </circle>

          {/* Central hub */}
          <circle cx="160" cy="70" r="18" fill="rgba(99,102,241,0.1)" stroke="rgba(99,102,241,0.55)" strokeWidth="1.8"/>
          <text x="160" y="74" textAnchor="middle" fill="rgba(99,102,241,0.9)" fontSize="10" fontFamily="monospace" fontWeight="700">LC3</text>

          {/* Connection lines to outer nodes */}
          <line x1="160" y1="70" x2="218" y2="12" stroke="rgba(59,130,246,0.22)" strokeWidth="1" strokeDasharray="3 4" style={{animation:'mem2-dash 1.4s linear infinite'}}/>
          <line x1="160" y1="70" x2="264" y2="70" stroke="rgba(6,182,212,0.22)" strokeWidth="1" strokeDasharray="3 4" style={{animation:'mem2-dash 1.7s linear infinite 0.3s'}}/>
          <line x1="160" y1="70" x2="218" y2="128" stroke="rgba(139,92,246,0.22)" strokeWidth="1" strokeDasharray="3 4" style={{animation:'mem2-dash 1.5s linear infinite 0.6s'}}/>
          <line x1="160" y1="70" x2="102" y2="128" stroke="rgba(245,158,11,0.22)" strokeWidth="1" strokeDasharray="3 4" style={{animation:'mem2-dash 1.9s linear infinite 0.9s'}}/>
          <line x1="160" y1="70" x2="56" y2="70" stroke="rgba(34,197,94,0.22)" strokeWidth="1" strokeDasharray="3 4" style={{animation:'mem2-dash 1.6s linear infinite 1.2s'}}/>
          <line x1="160" y1="70" x2="102" y2="12" stroke="rgba(236,72,153,0.2)" strokeWidth="1" strokeDasharray="3 4" style={{animation:'mem2-dash 1.8s linear infinite 1.5s'}}/>

          {/* Outer person nodes */}
          {/* Top-right: blue */}
          <circle cx="218" cy="12" r="12" fill="rgba(59,130,246,0.1)" stroke="rgba(59,130,246,0.45)" strokeWidth="1.4" style={{animation:'mem2-node 3s ease-in-out infinite'}}/>
          <circle cx="218" cy="9" r="3" fill="rgba(59,130,246,0.55)"/>
          <path d="M212 16 Q218 13 224 16" fill="none" stroke="rgba(59,130,246,0.5)" strokeWidth="1.1" strokeLinecap="round"/>

          {/* Right: cyan */}
          <circle cx="264" cy="70" r="12" fill="rgba(6,182,212,0.1)" stroke="rgba(6,182,212,0.45)" strokeWidth="1.4" style={{animation:'mem2-node 3.2s ease-in-out infinite 0.5s'}}/>
          <circle cx="264" cy="67" r="3" fill="rgba(6,182,212,0.55)"/>
          <path d="M258 74 Q264 71 270 74" fill="none" stroke="rgba(6,182,212,0.5)" strokeWidth="1.1" strokeLinecap="round"/>

          {/* Bottom-right: violet */}
          <circle cx="218" cy="128" r="12" fill="rgba(139,92,246,0.1)" stroke="rgba(139,92,246,0.45)" strokeWidth="1.4" style={{animation:'mem2-node 2.8s ease-in-out infinite 1s'}}/>
          <circle cx="218" cy="125" r="3" fill="rgba(139,92,246,0.55)"/>
          <path d="M212 132 Q218 129 224 132" fill="none" stroke="rgba(139,92,246,0.5)" strokeWidth="1.1" strokeLinecap="round"/>

          {/* Bottom-left: amber */}
          <circle cx="102" cy="128" r="12" fill="rgba(245,158,11,0.1)" stroke="rgba(245,158,11,0.42)" strokeWidth="1.4" style={{animation:'mem2-node 3.4s ease-in-out infinite 1.5s'}}/>
          <circle cx="102" cy="125" r="3" fill="rgba(245,158,11,0.52)"/>
          <path d="M96 132 Q102 129 108 132" fill="none" stroke="rgba(245,158,11,0.48)" strokeWidth="1.1" strokeLinecap="round"/>

          {/* Left: green */}
          <circle cx="56" cy="70" r="12" fill="rgba(34,197,94,0.1)" stroke="rgba(34,197,94,0.42)" strokeWidth="1.4" style={{animation:'mem2-node 3.1s ease-in-out infinite 2s'}}/>
          <circle cx="56" cy="67" r="3" fill="rgba(34,197,94,0.52)"/>
          <path d="M50 74 Q56 71 62 74" fill="none" stroke="rgba(34,197,94,0.48)" strokeWidth="1.1" strokeLinecap="round"/>

          {/* Top-left: pink */}
          <circle cx="102" cy="12" r="12" fill="rgba(236,72,153,0.08)" stroke="rgba(236,72,153,0.38)" strokeWidth="1.4" style={{animation:'mem2-node 2.9s ease-in-out infinite 2.5s'}}/>
          <circle cx="102" cy="9" r="3" fill="rgba(236,72,153,0.48)"/>
          <path d="M96 16 Q102 13 108 16" fill="none" stroke="rgba(236,72,153,0.44)" strokeWidth="1.1" strokeLinecap="round"/>

          {/* Orbiting dot on inner ring */}
          <circle cx="198" cy="70" r="3.5" fill="#6366f1" opacity="0.7">
            <animateTransform attributeName="transform" type="rotate" from="0 160 70" to="360 160 70" dur="15s" repeatCount="indefinite"/>
          </circle>

          {/* Sparkle dots */}
          <circle cx="26" cy="26" r="2.5" fill="#6366f1" opacity="0.65" style={{animation:'mem2-spark 2.3s ease-in-out infinite'}}/>
          <circle cx="294" cy="24" r="2" fill="#0891b2" opacity="0.6" style={{animation:'mem2-spark 2.3s ease-in-out infinite 0.7s'}}/>
          <circle cx="26" cy="114" r="2" fill="#818cf8" opacity="0.6" style={{animation:'mem2-spark 2.3s ease-in-out infinite 1.4s'}}/>
          <circle cx="294" cy="114" r="2.5" fill="#0891b2" opacity="0.65" style={{animation:'mem2-spark 2.3s ease-in-out infinite 2.1s'}}/>
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
                {advisors.map((m) => <FlipCard key={m.id} member={m} index={members.indexOf(m)} variant="advisor" />)}
              </div>
            </section>
          )}

          {officers.length > 0 && (
            <section>
              <SectionDivider color="bg-violet-500" label={`Club Officers${officers.length !== allOfficers.length ? ` (${officers.length}/${allOfficers.length})` : ''}`} />
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {officers.map((m) => <FlipCard key={m.id} member={m} index={members.indexOf(m)} variant="officer" />)}
              </div>
            </section>
          )}

          {regulars.length > 0 && (
            <section>
              <SectionDivider color="bg-blue-500" label={`Members${regulars.length !== allRegulars.length ? ` (${regulars.length}/${allRegulars.length})` : ''}`} />
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {regulars.map((m) => <FlipCard key={m.id} member={m} index={members.indexOf(m)} variant="member" />)}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
