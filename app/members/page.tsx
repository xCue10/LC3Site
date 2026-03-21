import { readJSON, Member } from '@/lib/data';
import MembersClient from './MembersClient';
import type { Metadata } from 'next';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Members',
  description: 'Meet the officers, advisors, and members of LC3 - Lowcode Cloud Club.',
};

export default function MembersPage() {
  const members = readJSON<Member[]>('members.json');
  return (
    <>
      <MembersClient members={members} />
      <div className="text-center pb-8">
        <Link
          href="/members/portal"
          className="text-xs text-slate-400 dark:text-slate-600 hover:text-violet-500 dark:hover:text-violet-400 transition-colors"
        >
          Are you a member? Update your profile →
        </Link>
      </div>
    </>
  );
}
