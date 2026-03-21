import { readJSON, Member } from '@/lib/data';
import MemberPortalClient from './MemberPortalClient';

export const dynamic = 'force-dynamic';

export default function MemberPortalPage() {
  const members = readJSON<Member[]>('members.json');
  return <MemberPortalClient members={members} />;
}
