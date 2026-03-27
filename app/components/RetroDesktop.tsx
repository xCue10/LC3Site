'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const ICONS = [
  { label: 'Home',      href: '/',          color: '#c0c0c0', type: 'home'      },
  { label: 'About',     href: '/about',     color: '#7c3aed', type: 'about'     },
  { label: 'Events',    href: '/events',    color: '#0891b2', type: 'events'    },
  { label: 'Projects',  href: '/projects',  color: '#16a34a', type: 'projects'  },
  { label: 'Members',   href: '/members',   color: '#2563eb', type: 'members'   },
  { label: 'Blog',      href: '/blog',      color: '#db2777', type: 'blog'      },
  { label: 'Gallery',   href: '/gallery',   color: '#9333ea', type: 'gallery'   },
  { label: 'Resources', href: '/resources', color: '#ca8a04', type: 'resources' },
  { label: 'Careers',   href: '/careers',   color: '#d97706', type: 'careers'   },
  { label: 'Shield',    href: '/shield',    color: '#dc2626', type: 'shield'    },
  { label: 'Contact',   href: '/contact',   color: '#0d9488', type: 'contact'   },
  { label: 'Partner',   href: '/hire',      color: '#ea580c', type: 'hire'      },
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

function PageIcon({ type, color }: { type: string; color: string }) {
  const s = { viewBox: '0 0 32 32', width: 40, height: 40, xmlns: 'http://www.w3.org/2000/svg', 'aria-hidden': true as true };
  switch (type) {
    case 'home':
      return (
        <svg {...s}>
          <polygon points="16,3 3,14 6,14 6,29 13,29 13,20 19,20 19,29 26,29 26,14 29,14" fill={color} stroke="#9ca3af" strokeWidth="1.5" strokeLinejoin="round" />
          <rect x="13" y="20" width="6" height="9" fill="#bfdbfe" />
        </svg>
      );
    case 'about':
      return (
        <svg {...s}>
          <circle cx="16" cy="16" r="13" fill={color} stroke="#9ca3af" strokeWidth="1.5" />
          <rect x="14" y="14" width="4" height="9" rx="1" fill="#fff" />
          <circle cx="16" cy="10" r="2.5" fill="#fff" />
        </svg>
      );
    case 'events':
      return (
        <svg {...s}>
          <rect x="3" y="6" width="26" height="23" rx="2" fill="#fff" stroke="#9ca3af" strokeWidth="1.5" />
          <rect x="3" y="6" width="26" height="7" rx="2" fill={color} />
          <rect x="10" y="3" width="3" height="6" rx="1" fill={color} />
          <rect x="19" y="3" width="3" height="6" rx="1" fill={color} />
          <rect x="7"  y="17" width="4" height="3" rx="0.5" fill={color} />
          <rect x="14" y="17" width="4" height="3" rx="0.5" fill={color} />
          <rect x="21" y="17" width="4" height="3" rx="0.5" fill={color} />
          <rect x="7"  y="23" width="4" height="3" rx="0.5" fill={color} />
          <rect x="14" y="23" width="4" height="3" rx="0.5" fill={color} />
        </svg>
      );
    case 'projects':
      return (
        <svg {...s}>
          <path d="M3 10 Q3 7 6 7 L13 7 L15 10 L29 10 Q29 10 29 12 L29 27 Q29 29 27 29 L5 29 Q3 29 3 27 Z" fill={color} stroke="#9ca3af" strokeWidth="1.5" />
          <rect x="8"  y="17" width="16" height="2" rx="1" fill="#fff" opacity="0.8" />
          <rect x="8"  y="22" width="11" height="2" rx="1" fill="#fff" opacity="0.8" />
        </svg>
      );
    case 'members':
      return (
        <svg {...s}>
          <circle cx="11" cy="11" r="5" fill={color} stroke="#9ca3af" strokeWidth="1.5" />
          <circle cx="21" cy="11" r="5" fill={color} stroke="#9ca3af" strokeWidth="1.5" />
          <path d="M2 28 Q2 20 11 20 Q16 20 16 20 Q16 20 21 20 Q30 20 30 28" fill={color} stroke="#9ca3af" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      );
    case 'blog':
      return (
        <svg {...s}>
          <rect x="4" y="2" width="24" height="28" rx="2" fill="#fff" stroke="#9ca3af" strokeWidth="1.5" />
          <rect x="4" y="2" width="24" height="7" rx="2" fill={color} />
          <rect x="7" y="13" width="18" height="2" rx="1" fill="#d1d5db" />
          <rect x="7" y="18" width="14" height="2" rx="1" fill="#d1d5db" />
          <rect x="7" y="23" width="16" height="2" rx="1" fill="#d1d5db" />
        </svg>
      );
    case 'gallery':
      return (
        <svg {...s}>
          <rect x="3" y="5" width="26" height="22" rx="2" fill="#fff" stroke="#9ca3af" strokeWidth="1.5" />
          <rect x="3" y="5" width="26" height="5" rx="2" fill={color} />
          <polygon points="3,27 10,17 16,23 20,18 29,27" fill={color} opacity="0.7" />
          <circle cx="22" cy="14" r="3" fill="#fde68a" stroke="#fbbf24" strokeWidth="1" />
        </svg>
      );
    case 'resources':
      return (
        <svg {...s}>
          <rect x="4" y="22" width="24" height="6" rx="1" fill={color} stroke="#9ca3af" strokeWidth="1.5" />
          <rect x="4" y="14" width="24" height="6" rx="1" fill={color} stroke="#9ca3af" strokeWidth="1.5" opacity="0.85" />
          <rect x="4" y="6"  width="24" height="6" rx="1" fill={color} stroke="#9ca3af" strokeWidth="1.5" opacity="0.7" />
          <rect x="6" y="7"  width="3"  height="4" rx="0.5" fill="#fff" opacity="0.5" />
          <rect x="6" y="15" width="3"  height="4" rx="0.5" fill="#fff" opacity="0.5" />
          <rect x="6" y="23" width="3"  height="4" rx="0.5" fill="#fff" opacity="0.5" />
        </svg>
      );
    case 'careers':
      return (
        <svg {...s}>
          <rect x="4" y="13" width="24" height="16" rx="2" fill={color} stroke="#9ca3af" strokeWidth="1.5" />
          <path d="M11 13 L11 9 Q11 6 16 6 Q21 6 21 9 L21 13" fill="none" stroke="#9ca3af" strokeWidth="1.5" />
          <rect x="13" y="9" width="6" height="4" rx="1" fill="#fff" opacity="0.6" />
          <rect x="8"  y="19" width="16" height="2" rx="1" fill="#fff" opacity="0.7" />
        </svg>
      );
    case 'shield':
      return (
        <svg {...s}>
          <path d="M16 3 L29 8 L29 17 Q29 26 16 30 Q3 26 3 17 L3 8 Z" fill={color} stroke="#9ca3af" strokeWidth="1.5" strokeLinejoin="round" />
          <polyline points="10,16 14,21 22,12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'contact':
      return (
        <svg {...s}>
          <rect x="3" y="7" width="26" height="18" rx="2" fill="#fff" stroke="#9ca3af" strokeWidth="1.5" />
          <rect x="3" y="7" width="26" height="18" rx="2" fill={color} opacity="0.15" />
          <polyline points="3,7 16,18 29,7" fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
          <line x1="3"  y1="25" x2="11" y2="17" stroke={color} strokeWidth="1.5" />
          <line x1="29" y1="25" x2="21" y2="17" stroke={color} strokeWidth="1.5" />
        </svg>
      );
    case 'hire':
      return (
        <svg {...s}>
          <rect x="4" y="10" width="24" height="19" rx="1" fill={color} stroke="#9ca3af" strokeWidth="1.5" />
          <rect x="4" y="10" width="24" height="5" fill={color} opacity="0.6" />
          <rect x="9"  y="3" width="6"  height="7" rx="1" fill={color} stroke="#9ca3af" strokeWidth="1.5" />
          <rect x="17" y="3" width="6"  height="7" rx="1" fill={color} stroke="#9ca3af" strokeWidth="1.5" />
          <rect x="7"  y="19" width="5" height="5" rx="0.5" fill="#fff" opacity="0.6" />
          <rect x="14" y="19" width="5" height="5" rx="0.5" fill="#fff" opacity="0.6" />
          <rect x="21" y="19" width="4" height="5" rx="0.5" fill="#fff" opacity="0.6" />
        </svg>
      );
    default:
      return (
        <svg {...s}>
          <rect x="4" y="2" width="22" height="28" rx="2" fill="#fff" stroke="#9ca3af" strokeWidth="1.5" />
          <rect x="4" y="2" width="15" height="7" rx="2" fill={color} />
        </svg>
      );
  }
}

export default function RetroDesktop() {
  const [isRetro, setIsRetro] = useState(false);
  const [time, setTime] = useState('');
  const pathname = usePathname();

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

  const displayUrl = `http://www.lc3club.com${pathname === '/' ? '' : pathname}`;

  return (
    <>
      {/* ── IE6 Browser Chrome ─────────────────────── */}
      <div className="rd-browser">
        {/* Title bar */}
        <div className="rd-br-titlebar">
          <div className="rd-br-title-left">
            <span className="rd-br-ie-logo">e</span>
            <span className="rd-br-title-text">LC3 — Lowcode Cloud Club — Microsoft Internet Explorer</span>
          </div>
          <div className="rd-br-winbtns">
            <span className="rd-br-wbtn">_</span>
            <span className="rd-br-wbtn">□</span>
            <span className="rd-br-wbtn rd-br-wbtn-close">×</span>
          </div>
        </div>

        {/* Menu bar */}
        <div className="rd-br-menubar">
          {['File','Edit','View','Favorites','Tools','Help'].map(item => (
            <span key={item} className="rd-br-menu-item">{item}</span>
          ))}
        </div>

        {/* Toolbar */}
        <div className="rd-br-toolbar">
          <button className="rd-br-tbtn" title="Back">◄ Back</button>
          <button className="rd-br-tbtn" title="Forward">Forward ►</button>
          <button className="rd-br-tbtn" title="Stop">✕</button>
          <button className="rd-br-tbtn" title="Refresh">↻</button>
          <button className="rd-br-tbtn" title="Home">⌂</button>
          <div className="rd-br-sep" />
          <span className="rd-br-addr-label">Address</span>
          <div className="rd-br-addr-bar">{displayUrl}</div>
          <button className="rd-br-go">Go</button>
        </div>
      </div>

      {/* Status bar (bottom of browser) */}
      <div className="rd-br-statusbar">
        <span className="rd-br-status-text">✔ Done</span>
        <div className="rd-br-zone">
          <span>🌐</span>
          <span>Internet</span>
        </div>
      </div>

      {/* Desktop icons — left side, 2-column grid */}
      <div className="rd-icons-panel">
        {ICONS.map(({ label, href, color, type }) => (
          <Link key={href} href={href} className="rd-icon">
            <PageIcon type={type} color={color} />
            <span className="rd-icon-label">{label}</span>
          </Link>
        ))}
      </div>

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
