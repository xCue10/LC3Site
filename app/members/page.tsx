import { readJSON, Member } from '@/lib/data';
import MembersClient from './MembersClient';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Members',
  description: 'Meet the officers, advisors, and members of LC3 - Lowcode Cloud Club.',
};

export default function MembersPage() {
  const members = readJSON<Member[]>('members.json');
  return <MembersClient members={members} />;
}
