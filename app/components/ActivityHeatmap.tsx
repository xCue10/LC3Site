'use client';

import { Activity } from '@/lib/types';
import { useMemo } from 'react';

interface ActivityHeatmapProps {
  activities: Activity[];
}

export default function ActivityHeatmap({ activities }: ActivityHeatmapProps) {
  const days = 140; // Approx 20 weeks
  
  const heatmapData = useMemo(() => {
    const data: Record<string, number> = {};
    activities.forEach((a) => {
      const date = new Date(a.timestamp).toISOString().split('T')[0];
      data[date] = (data[date] || 0) + 1;
    });
    return data;
  }, [activities]);

  const grid = useMemo(() => {
    const cells = [];
    const today = new Date();
    for (let i = days; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = heatmapData[dateStr] || 0;
      cells.push({ date: dateStr, count });
    }
    return cells;
  }, [heatmapData, days]);

  const getColor = (count: number) => {
    if (count === 0) return 'bg-slate-200 dark:bg-white/[0.05]';
    if (count === 1) return 'bg-cyber-lime/30';
    if (count === 2) return 'bg-cyber-lime/60';
    return 'bg-cyber-lime';
  };

  return (
    <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            Club Activity
            <span className="w-1.5 h-1.5 bg-cyber-lime rounded-full animate-pulse" />
          </h3>
          <p className="text-xs font-mono-tech text-slate-500 mt-1 uppercase tracking-widest">Real-time contribution graph</p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono-tech text-slate-400 uppercase">
          <span>Less</span>
          <div className="w-2.5 h-2.5 rounded-sm bg-slate-200 dark:bg-white/[0.05]" />
          <div className="w-2.5 h-2.5 rounded-sm bg-cyber-lime/30" />
          <div className="w-2.5 h-2.5 rounded-sm bg-cyber-lime/60" />
          <div className="w-2.5 h-2.5 rounded-sm bg-cyber-lime" />
          <span>More</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 justify-center">
        {grid.map((cell, i) => (
          <div
            key={i}
            title={`${cell.count} activities on ${cell.date}`}
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-[3px] transition-all hover:scale-125 hover:shadow-[0_0_10px_#bef26480] cursor-help ${getColor(cell.count)}`}
          />
        ))}
      </div>
      
      <div className="mt-8 flex items-center justify-center gap-8 border-t border-slate-100 dark:border-white/5 pt-6">
        <div className="text-center">
          <p className="text-lg font-black text-slate-900 dark:text-white leading-none">{activities.length}</p>
          <p className="text-[10px] font-mono-tech text-slate-500 mt-1 uppercase">Total Commits</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-black text-slate-900 dark:text-white leading-none">
            {Object.keys(heatmapData).length}
          </p>
          <p className="text-[10px] font-mono-tech text-slate-500 mt-1 uppercase">Days Active</p>
        </div>
      </div>
    </div>
  );
}
