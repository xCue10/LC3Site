'use client';
import { useEffect, useRef } from 'react';

interface Props {
  progress: number;
  logs: string[];
  scanning: boolean;
}

function getLogColor(log: string): string {
  if (log.includes('⚠️') || log.includes('WARNING') || log.includes('WARN')) return '#fbbf24';
  if (log.includes('ERROR') || log.includes('ACCESSIBLE') || log.includes('FAIL') || log.includes('✗')) return '#f87171';
  if (log.includes('complete') || log.includes('good') || log.includes('OK') || log.includes('✓') || log.includes('PASS')) return '#34d399';
  if (log.includes('INFO') || log.includes('Checking') || log.includes('Scanning') || log.includes('→')) return '#60a5fa';
  return '#8b9abf';
}

function getTimestamp(): string {
  return new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function ShieldScanProgress({ progress, logs, scanning }: Props) {
  const logsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logsRef.current) {
      logsRef.current.scrollTop = logsRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="space-y-3">
      {/* Progress bar — thin, gradient */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono" style={{ color: '#64748b' }}>{Math.round(progress)}% complete</span>
          {scanning && (
            <span className="flex items-center gap-1.5 text-[11px] text-blue-400">
              <span
                className="w-1.5 h-1.5 rounded-full bg-blue-400"
                style={{ animation: 'pulse 1s ease-in-out infinite' }}
              />
              Scanning
            </span>
          )}
        </div>
        <div
          className="h-1 rounded-full overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-500 relative overflow-hidden"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
            }}
          >
            {scanning && (
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite',
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Terminal log */}
      <div
        ref={logsRef}
        className="rounded-xl overflow-y-auto"
        style={{
          background: 'rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.06)',
          height: '200px',
          padding: '14px 16px',
        }}
      >
        {logs.length === 0 ? (
          <div className="flex items-center gap-2 text-[12px]" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace", color: '#64748b' }}>
            <span style={{ color: '#64748b' }}>$</span>
            <span>Waiting to start scan</span>
            <span style={{ animation: 'pulse 1s ease-in-out infinite' }}>_</span>
          </div>
        ) : (
          <div className="space-y-1">
            {logs.map((log, i) => {
              const isLast = i === logs.length - 1;
              const color = getLogColor(log);
              return (
                <div
                  key={i}
                  className="flex gap-3 text-[12px] leading-relaxed"
                  style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
                >
                  <span className="shrink-0 select-none" style={{ color: '#475569', minWidth: '70px' }}>
                    {getTimestamp()}
                  </span>
                  <span style={{ color: isLast && scanning ? '#60a5fa' : color }}>
                    {log}
                    {isLast && scanning && (
                      <span
                        className="inline-block w-[7px] h-[13px] ml-0.5 align-text-bottom"
                        style={{
                          background: '#60a5fa',
                          animation: 'pulse 1s ease-in-out infinite',
                        }}
                      />
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
