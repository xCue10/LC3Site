'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadUserData, syncFromServer, BADGES } from '@/lib/shield-storage';
import { UserData } from '@/lib/shield-types';
import ShieldAppLayout from '@/app/shield/components/ShieldAppLayout';
import { Trophy, Lock, Loader2 } from 'lucide-react';

export default function BadgesPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const data = loadUserData();
    if (!data) { router.push('/shield/login'); return; }
    setUserData(data);
    syncFromServer().then(fresh => { if (fresh) setUserData(fresh); });
  }, [router]);

  if (!userData) return (
    <ShieldAppLayout>
      <div className="flex items-center justify-center" style={{ height: '80vh' }}>
        <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
      </div>
    </ShieldAppLayout>
  );

  const earnedCount = userData.badges.length;
  const totalCount = BADGES.length;
  const pct = Math.round((earnedCount / totalCount) * 100);

  return (
    <ShieldAppLayout>
      <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1" style={{ letterSpacing: '-0.03em' }}>
            Badges
          </h1>
          <p className="text-slate-500 dark:text-slate-400" style={{ fontSize: '14px' }}>
            Earn badges by completing scans and fixing security issues.
          </p>
        </div>

        {/* Progress */}
        <div
          className="rounded-2xl p-5 mb-8 bg-white dark:bg-[#161b27] border border-slate-200/80 dark:border-white/[0.09]"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span className="font-semibold text-slate-900 dark:text-white">{earnedCount} / {totalCount} earned</span>
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#fbbf24' }}>{pct}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden bg-slate-200 dark:bg-white/[0.08]">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${pct}%`,
                background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
                boxShadow: '0 0 10px rgba(245,158,11,0.4)',
              }}
            />
          </div>
        </div>

        {/* Badge grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {BADGES.map((badge) => {
            const earned = userData.badges.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`rounded-xl p-4 transition-all ${earned ? 'bg-amber-50 dark:bg-amber-500/[0.07] border border-amber-200 dark:border-amber-500/25' : 'bg-white dark:bg-[#161b27] border border-slate-200/80 dark:border-white/[0.09]'}`}
                style={{ opacity: earned ? 1 : 0.6 }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                    style={{
                      background: earned ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.05)',
                      border: earned ? '1px solid rgba(245,158,11,0.3)' : '1px solid rgba(255,255,255,0.09)',
                      filter: earned ? 'none' : 'grayscale(100%) brightness(0.5)',
                    }}
                  >
                    {badge.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={earned ? '' : 'text-slate-600 dark:text-slate-400'} style={{ fontSize: '13px', fontWeight: 600, color: earned ? '#fbbf24' : undefined }}>
                        {badge.name}
                      </h3>
                      {earned ? (
                        <span style={{ fontSize: '9px', fontWeight: 700, color: '#fbbf24', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.25)', padding: '1px 6px', borderRadius: '999px' }}>
                          EARNED
                        </span>
                      ) : (
                        <Lock className="w-3 h-3 shrink-0" style={{ color: '#475569' }} />
                      )}
                    </div>
                    <p className={earned ? 'text-slate-500 dark:text-slate-400' : 'text-slate-500 dark:text-slate-500'} style={{ fontSize: '12px', lineHeight: 1.5 }}>
                      {badge.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {earnedCount === 0 && (
          <div
            className="mt-4 py-10 rounded-2xl text-center bg-white dark:bg-[#161b27] border border-slate-200/80 dark:border-white/[0.09]"
          >
            <Trophy className="w-10 h-10 mx-auto mb-3" style={{ color: '#334155' }} />
            <p className="text-slate-900 dark:text-white font-semibold mb-1">No badges yet</p>
            <p style={{ fontSize: '13px', color: '#64748b' }}>Start scanning to earn your first badge.</p>
          </div>
        )}
      </div>
    </ShieldAppLayout>
  );
}
