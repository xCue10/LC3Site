'use client';
import { useState, useEffect } from 'react';

const BANNER_KEY = 'lc3-banner-v1';
const MESSAGE = '🚀 LC3 meets every Tuesday at 12:30 PM at CSN West Charleston Campus — Come join us!';

export default function AnnouncementBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(BANNER_KEY)) setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes banner-appear { from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes banner-gradient { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
      `}</style>
      <div
        className="relative z-50 text-white text-sm"
        style={{
          background: 'linear-gradient(90deg, #1d4ed8, #7c3aed, #2563eb, #7c3aed, #1d4ed8)',
          backgroundSize: '300% 100%',
          animation: 'banner-appear 0.45s ease-out, banner-gradient 6s ease-in-out infinite',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-center gap-2 min-h-[40px]">
          <p className="font-medium text-center leading-snug pr-6 sm:pr-0">{MESSAGE}</p>
          <button
            onClick={() => { setVisible(false); localStorage.setItem(BANNER_KEY, '1'); }}
            className="absolute right-3 sm:right-6 flex items-center justify-center w-7 h-7 rounded-lg bg-white/10 hover:bg-white/25 transition-colors flex-shrink-0"
            aria-label="Dismiss announcement"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
