'use client';
import { useState, useEffect, useRef } from 'react';

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export default function AnimatedStat({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  const num = parseInt(value, 10);
  const isNum = !isNaN(num) && value !== '';

  useEffect(() => {
    if (!isNum) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStarted(true); obs.disconnect(); } },
      { threshold: 0.5 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [isNum]);

  useEffect(() => {
    if (!started || !isNum) return;
    const duration = 1400;
    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      setCount(Math.round(easeOutCubic(progress) * num));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [started, num, isNum]);

  return (
    <div ref={ref}>
      <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-violet-400">
        {isNum ? count : value || '—'}
      </div>
      <div className="text-slate-500 text-sm mt-1">{label}</div>
    </div>
  );
}
