import { readJSON, Member } from '@/lib/data';
import MembersClient from './MembersClient';

export const dynamic = 'force-dynamic';

export default function MembersPage() {
  const members = readJSON<Member[]>('members.json');
  return <MembersClient members={members} />;
}
