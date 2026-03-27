'use client';
import { useState, useEffect } from 'react';

interface EventInfo { id: string; title: string; date: string }
interface TimeLeft { days: number; hours: number; minutes: number; seconds: number }

function getTimeLeft(dateStr: string): TimeLeft | null {
  const diff = new Date(dateStr + 'T00:00:00').getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/15 to-violet-500/15 rounded-xl blur-sm" />
        <div className="relative bg-white dark:bg-[#0a1628] border border-blue-200/70 dark:border-blue-500/25 rounded-xl px-3 py-2.5 sm:px-5 sm:py-3 min-w-[58px] sm:min-w-[80px] text-center shadow-sm">
          <span className="text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white tabular-nums leading-none">
            {String(value).padStart(2, '0')}
          </span>
        </div>
      </div>
      <span className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest font-semibold">{label}</span>
    </div>
  );
}

export default function EventCountdown({ events }: { events: EventInfo[] }) {
  const [loaded, setLoaded] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [target, setTarget] = useState<EventInfo | null>(null);

  useEffect(() => {
    const tick = () => {
      for (const ev of events) {
        const tl = getTimeLeft(ev.date);
        if (tl) { setTarget(ev); setTimeLeft(tl); setLoaded(true); return; }
      }
      setTarget(null); setTimeLeft(null); setLoaded(true);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [events]);

  if (!loaded) {
    /* skeleton to prevent layout shift */
    return (
      <div className="bg-white border border-blue-100 dark:border-blue-500/15 dark:bg-[#0d1424] rounded-2xl p-6 sm:p-8 mb-6 animate-pulse">
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-20 mx-auto mb-3" />
        <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-52 mx-auto mb-6" />
        <div className="flex justify-center gap-4 sm:gap-5">
          {[0,1,2,3].map(i => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 sm:w-20 sm:h-20 bg-slate-200 dark:bg-slate-700 rounded-xl" />
              <div className="w-10 h-2.5 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!target || !timeLeft) {
    return (
      <div className="bg-white border border-slate-200 dark:border-[#1e2d45] dark:bg-[#0d1424] rounded-2xl p-10 text-center mb-6">
        <div className="relative inline-flex items-center justify-center w-14 h-14 mb-5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400/20 animate-ping" />
          <span className="relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-xl">
            📅
          </span>
        </div>
        <p className="text-slate-900 dark:text-white font-bold text-lg mb-1.5">Stay tuned for upcoming events</p>
        <p className="text-slate-500 dark:text-slate-400 text-sm">We&apos;re planning something exciting — check back soon!</p>
      </div>
    );
  }

  return (
    <div className="relative bg-white border border-blue-100 dark:border-blue-500/15 dark:bg-[#0d1424] rounded-2xl p-6 sm:p-8 mb-6 text-center overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 to-violet-50/60 dark:from-blue-500/5 dark:to-violet-500/5 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-violet-400/30 to-transparent" />

      <div className="relative z-10">
        <p className="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">Next event</p>
        <h3 className="text-slate-900 dark:text-white font-bold text-lg sm:text-xl mb-6 truncate px-8">{target.title}</h3>

        <div className="flex items-start justify-center gap-2 sm:gap-4">
          <TimeUnit value={timeLeft.days} label="Days" />
          <span className="text-slate-300 dark:text-slate-700 text-3xl sm:text-5xl font-light mt-2.5 select-none">:</span>
          <TimeUnit value={timeLeft.hours} label="Hours" />
          <span className="text-slate-300 dark:text-slate-700 text-3xl sm:text-5xl font-light mt-2.5 select-none">:</span>
          <TimeUnit value={timeLeft.minutes} label="Mins" />
          <span className="text-slate-300 dark:text-slate-700 text-3xl sm:text-5xl font-light mt-2.5 select-none">:</span>
          <TimeUnit value={timeLeft.seconds} label="Secs" />
        </div>
      </div>
    </div>
  );
}
