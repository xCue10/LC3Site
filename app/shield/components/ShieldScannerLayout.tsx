'use client';
import { ReactNode } from 'react';
import Link from 'next/link';
import ShieldAppLayout from '@/app/shield/components/ShieldAppLayout';
import { LucideIcon, ChevronRight } from 'lucide-react';

interface Props {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor?: string;
  children: ReactNode;
}

export default function ShieldScannerLayout({ title, description, icon: Icon, iconColor = '#3b82f6', children }: Props) {
  const glowMap: Record<string, string> = {
    '#3b82f6': 'rgba(59,130,246,0.2)',
    '#8b5cf6': 'rgba(139,92,246,0.2)',
    '#22c55e': 'rgba(34,197,94,0.2)',
    '#ef4444': 'rgba(239,68,68,0.2)',
    '#f59e0b': 'rgba(245,158,11,0.2)',
    '#06b6d4': 'rgba(6,182,212,0.2)',
    '#ec4899': 'rgba(236,72,153,0.2)',
  };
  const glowColor = glowMap[iconColor] || 'rgba(59,130,246,0.2)';

  return (
    <ShieldAppLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 mb-6" style={{ fontSize: '12px', color: '#64748b' }}>
          <Link href="/shield/dashboard" className="transition-colors hover:text-slate-300">Dashboard</Link>
          <ChevronRight className="w-3 h-3" />
          <span style={{ color: '#94a3b8' }}>{title}</span>
        </div>

        {/* Header */}
        <div className="flex items-start gap-4 mb-8">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: `${iconColor}15`,
              border: `1px solid ${iconColor}30`,
              boxShadow: `0 0 20px ${glowColor}`,
            }}
          >
            <Icon style={{ width: '22px', height: '22px', color: iconColor }} />
          </div>
          <div className="pt-0.5">
            <h1 className="text-2xl font-bold text-white tracking-tight" style={{ letterSpacing: '-0.02em' }}>
              {title}
            </h1>
            <p style={{ fontSize: '14px', color: '#94a3b8', marginTop: '4px', lineHeight: '1.6' }}>
              {description}
            </p>
          </div>
        </div>

        {children}
      </div>
    </ShieldAppLayout>
  );
}
