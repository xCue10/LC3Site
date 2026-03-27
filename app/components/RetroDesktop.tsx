'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const ICONS = [
  { label: 'About',    href: '/about',    bg: '#7c3aed' },
  { label: 'Events',   href: '/events',   bg: '#0891b2' },
  { label: 'Projects', href: '/projects', bg: '#16a34a' },
  { label: 'Members',  href: '/members',  bg: '#2563eb' },
  { label: 'Join LC3', href: '/join',     bg: '#ea580c' },
  { label: 'Careers',  href: '/careers',  bg: '#d97706' },
];

function WinLogo() {
  return (
    <svg viewBox="0 0 14 14" width="14" height="14" aria-hidden="true">
      <rect x="0" y="0" width="6" height="6" fill="#ff6b6b" />
      <rect x="8" y="0" width="6" height="6" fill="#69db7c" />
      <rect x="0" y="8" width="6" height="6" fill="#74c0fc" />
      <rect x="8" y="8" width="6" height="6" fill="#ffd43b" />
    </svg>
  );
}

function DocIcon({ bg }: { bg: string }) {
  return (
    <svg viewBox="0 0 32 32" width="52" height="52" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="4" y="2" width="22" height="28" rx="2" fill="#ffffff" stroke="#d1d5db" strokeWidth="1.5" />
      <rect x="4" y="2" width="15" height="7" rx="2" fill={bg} />
      <path d="M19 2 L26 9 L19 9 Z" fill="#e5e7eb" />
      <line x1="19" y1="2" x2="19" y2="9" stroke="#d1d5db" strokeWidth="1.5" />
      <line x1="19" y1="9" x2="26" y2="9" stroke="#d1d5db" strokeWidth="1.5" />
      <rect x="7" y="14" width="12" height="2" rx="1" fill="#d1d5db" />
      <rect x="7" y="18" width="9"  height="2" rx="1" fill="#d1d5db" />
      <rect x="7" y="22" width="11" height="2" rx="1" fill="#d1d5db" />
    </svg>
  );
}

export default function RetroDesktop() {
  const [isRetro, setIsRetro] = useState(false);
  const [time, setTime] = useState('');

  useEffect(() => {
    const check = () => setIsRetro(document.documentElement.classList.contains('retro'));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!isRetro) return;
    const tick = () => {
      const now = new Date();
      const h = now.getHours() % 12 || 12;
      const m = now.getMinutes().toString().padStart(2, '0');
      const ap = now.getHours() >= 12 ? 'PM' : 'AM';
      setTime(`${h}:${m} ${ap}`);
    };
    tick();
    const id = setInterval(tick, 5000);
    return () => clearInterval(id);
  }, [isRetro]);

  if (!isRetro) return null;

  return (
    <>
      {/* Desktop icons — left side */}
      <div className="rd-icons-panel">
        {ICONS.map(({ label, href, bg }) => (
          <Link key={href} href={href} className="rd-icon">
            <DocIcon bg={bg} />
            <span className="rd-icon-label">{label}</span>
          </Link>
        ))}
      </div>

      {/* Monitor stand */}
      <div className="rd-stand" aria-hidden="true" />
      {/* Monitor base */}
      <div className="rd-base" aria-hidden="true" />

      {/* Win98 Taskbar */}
      <div className="rd-taskbar" role="toolbar" aria-label="Taskbar">
        <button className="rd-start-btn" type="button">
          <WinLogo />
          <span className="rd-start-label">Start</span>
        </button>
        <div className="rd-taskbar-sep" aria-hidden="true" />
        <div className="rd-taskbar-window">
          <WinLogo />
          <span>LC3 &ndash; Lowcode Cloud Club</span>
        </div>
        <div className="rd-taskbar-tray">
          <span className="rd-clock" aria-live="polite">{time}</span>
        </div>
      </div>
    </>
  );
}
