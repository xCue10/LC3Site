'use client';
import { gradeColor } from '@/lib/shield-storage';

interface Props {
  score: number;
  grade: string;
  showBar?: boolean;
}

const GRADE_GLOW: Record<string, string> = {
  A: 'rgba(16,185,129,0.4)',
  B: 'rgba(52,211,153,0.35)',
  C: 'rgba(245,158,11,0.35)',
  D: 'rgba(249,115,22,0.35)',
  F: 'rgba(239,68,68,0.4)',
};

const GRADE_COLOR: Record<string, string> = {
  A: '#10b981',
  B: '#34d399',
  C: '#f59e0b',
  D: '#f97316',
  F: '#ef4444',
};

const GRADE_BAR: Record<string, string> = {
  A: 'linear-gradient(90deg, #10b981, #34d399)',
  B: 'linear-gradient(90deg, #34d399, #6ee7b7)',
  C: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
  D: 'linear-gradient(90deg, #f97316, #fb923c)',
  F: 'linear-gradient(90deg, #ef4444, #f87171)',
};

export default function ShieldSecurityScore({ score, grade, showBar = true }: Props) {
  const gColor = gradeColor(grade);
  const glowColor = GRADE_GLOW[grade] || 'rgba(59,130,246,0.3)';
  const gradeHex = GRADE_COLOR[grade] || '#60a5fa';
  const barGradient = GRADE_BAR[grade] || GRADE_BAR['F'];

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Letter grade with glow */}
      <div className="relative flex items-center justify-center">
        <div
          className="absolute inset-0 rounded-full blur-2xl"
          style={{ background: glowColor, opacity: 0.6 }}
        />
        <span
          className={`relative text-8xl font-black tracking-tight ${gColor}`}
          style={{
            filter: `drop-shadow(0 0 24px ${glowColor})`,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {grade}
        </span>
      </div>

      {/* Score number */}
      <div className="text-center">
        <span className="text-3xl font-bold" style={{ color: gradeHex }}>{score}</span>
        <span className="text-[14px]" style={{ color: '#64748b' }}>/100</span>
        <div className="text-[12px] mt-0.5" style={{ color: '#94a3b8' }}>Security Score</div>
      </div>

      {/* Progress bar */}
      {showBar && (
        <div className="w-full max-w-xs space-y-1.5">
          <div
            className="h-1.5 rounded-full overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${score}%`, background: barGradient }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono" style={{ color: '#64748b' }}>
            <span>0</span>
            <span>25</span>
            <span>50</span>
            <span>75</span>
            <span>100</span>
          </div>
        </div>
      )}
    </div>
  );
}
