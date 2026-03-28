import { readJSON, Member } from '@/lib/data';
import MembersClient from './MembersClient';
import type { Metadata } from 'next';
import Link from 'next/link';

export const revalidate = 30;

export const metadata: Metadata = {
  title: 'Members',
  description: 'Meet the officers, advisors, and members of LC3 - Lowcode Cloud Club.',
};

export default function MembersPage() {
  const members = readJSON<Member[]>('members.json');
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200 dark:border-[#1e2d45]">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-blue-50/30 to-transparent dark:from-emerald-950/15 dark:via-blue-950/10 dark:to-transparent pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/35 to-transparent pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-300/6 dark:bg-emerald-500/8 rounded-full blur-3xl pointer-events-none" style={{animation:'hero-float-a 11s ease-in-out infinite'}} />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-18 text-center">
          <p className="text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-3">Our community</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Meet the{' '}
            <span className="bg-gradient-to-r from-emerald-500 via-blue-500 to-violet-600 bg-clip-text text-transparent">
              Team
            </span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
            Officers, advisors, and members building the future of tech at CSN.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium px-3.5 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {members.length} member{members.length !== 1 ? 's' : ''}
          </div>
        </div>
      </section>
      <MembersClient members={members} />
      <div className="text-center pb-8">
        <Link
          href="/members/portal"
          className="text-xs text-slate-400 dark:text-slate-400 hover:text-violet-500 dark:hover:text-violet-400 transition-colors"
        >
          Are you a member? Update your profile →
        </Link>
      </div>
    </>
  );
}
