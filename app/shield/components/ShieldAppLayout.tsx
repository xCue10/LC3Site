'use client';
import { ReactNode } from 'react';
import ShieldSidebar from '@/app/shield/components/ShieldSidebar';

interface Props {
  children: ReactNode;
}

export default function ShieldAppLayout({ children }: Props) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#0d1117',
        overflow: 'auto',
        display: 'flex',
      }}
    >
      <ShieldSidebar />
      <main className="flex-1 min-w-0 pt-14 md:pt-0">{children}</main>
    </div>
  );
}
