'use client';

import { useState, useEffect } from 'react';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll to top"
      className="fixed bottom-6 right-6 z-40 w-10 h-10 rounded-full bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-[#1e2d45] shadow-lg shadow-slate-900/10 dark:shadow-black/30 flex items-center justify-center text-slate-500 hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-400 hover:border-violet-300 dark:hover:border-violet-500/40 hover:-translate-y-0.5 transition-all"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
}
