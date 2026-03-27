'use client';

import { useState, useEffect, useRef } from 'react';
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
  { label: 'LimeWire',    href: '#limewire',    color: '#22c55e', type: 'limewire'    },
  { label: 'readme.txt',  href: '#notepad',     color: '#000080', type: 'notepad'     },
  { label: 'Recycle Bin', href: '#recyclebin',  color: '#c0c0c0', type: 'recyclebin'  },
  { label: 'SparkNotes',  href: '#sparknotes',  color: '#f5c518', type: 'sparknotes'  },
];

function WinLogo() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      {/* XP waving flag — 4 quadrants with slight perspective skew */}
      <path d="M1,2 L7.5,1 L7.5,7.5 L1,8 Z"       fill="#e74c3c" />
      <path d="M8.5,0.8 L15,0 L15,7 L8.5,7.5 Z"   fill="#4caf50" />
      <path d="M1,8.5 L7.5,8.5 L7.5,15 L1,14 Z"   fill="#2196f3" />
      <path d="M8.5,8.5 L15,8.5 L15,16 L8.5,15.2 Z" fill="#ffc107" />
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
    case 'limewire':
      return (
        <svg {...s}>
          {/* Green background */}
          <rect x="1" y="1" width="30" height="30" rx="5" fill={color} />
          {/* Lightning bolt */}
          <polygon points="19,3 10,17 17,17 13,29 22,15 15,15" fill="#ffffff" />
          {/* Lime fruit hint — small circle */}
          <circle cx="24" cy="8" r="4" fill="#86efac" stroke="#fff" strokeWidth="1" />
          <circle cx="24" cy="8" r="2" fill="#16a34a" />
        </svg>
      );
    case 'notepad':
      return (
        <svg {...s}>
          {/* Notepad paper */}
          <rect x="5" y="2" width="19" height="25" rx="1" fill="#fffff0" stroke="#9ca3af" strokeWidth="1.5" />
          {/* Spiral binding top */}
          <rect x="4" y="2" width="24" height="3" rx="1" fill="#4a90d9" />
          <circle cx="10" cy="3.5" r="1.5" fill="#fff" stroke="#2a5bd4" strokeWidth="0.8" />
          <circle cx="16" cy="3.5" r="1.5" fill="#fff" stroke="#2a5bd4" strokeWidth="0.8" />
          <circle cx="22" cy="3.5" r="1.5" fill="#fff" stroke="#2a5bd4" strokeWidth="0.8" />
          {/* Text lines */}
          <rect x="8"  y="9"  width="16" height="1.5" rx="0.5" fill="#9ca3af" />
          <rect x="8"  y="13" width="13" height="1.5" rx="0.5" fill="#9ca3af" />
          <rect x="8"  y="17" width="15" height="1.5" rx="0.5" fill="#9ca3af" />
          <rect x="8"  y="21" width="10" height="1.5" rx="0.5" fill="#9ca3af" />
        </svg>
      );
    case 'sparknotes':
      return (
        <svg {...s}>
          {/* Book */}
          <rect x="5" y="4" width="18" height="24" rx="1" fill={color} stroke="#c8a000" strokeWidth="1.2" />
          <rect x="5" y="4" width="4"  height="24" rx="1" fill="#c8a000" />
          {/* Lightning bolt */}
          <polygon points="20,5 14,16 18,16 12,27 22,14 17,14" fill="#1a1a1a" />
        </svg>
      );
    case 'recyclebin':
      return (
        <svg {...s}>
          {/* Bin body */}
          <path d="M7,13 L9,31 L23,31 L25,13 Z" fill="#c8d0d8" stroke="#8090a0" strokeWidth="1.2" strokeLinejoin="round" />
          {/* Bin lid */}
          <rect x="5" y="10" width="22" height="4" rx="1" fill="#b0bcc8" stroke="#8090a0" strokeWidth="1.2" />
          {/* Handle on lid */}
          <rect x="13" y="7" width="6" height="4" rx="1" fill="#b0bcc8" stroke="#8090a0" strokeWidth="1.2" />
          {/* Recycling arrows on bin body */}
          <path d="M16,18 L13,22 L15,22 Q15,26 19,26 L19,24 Q17,24 17,22 L19,22 Z" fill="#5a8090" />
          <path d="M16,18 L19,22 L17,22 Q17,26 13,26 L13,24 Q15,24 15,22 L13,22 Z" fill="#5a8090" opacity="0.7" />
          {/* Vertical lines on bin */}
          <line x1="13" y1="14" x2="12" y2="30" stroke="#8090a0" strokeWidth="0.8" />
          <line x1="16" y1="14" x2="16" y2="30" stroke="#8090a0" strokeWidth="0.8" />
          <line x1="19" y1="14" x2="20" y2="30" stroke="#8090a0" strokeWidth="0.8" />
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

const ADS = [
  {
    id: 0,
    title: 'Macromedia Flash Player Required',
    body: '🎉 You are visitor #1,000,000!\nClick to claim your FREE prize!',
    pos: { top: '15%', left: '22%' },
  },
  {
    id: 1,
    title: 'Security Alert',
    body: '⚠️ WARNING: 47 viruses detected!\nClick HERE to remove them NOW for FREE!',
    pos: { top: '42%', left: '6%' },
  },
  {
    id: 2,
    title: 'FREE AOL Offer — Limited Time!',
    body: '📀 Get 1000 FREE hours with AOL\nInstant Messenger! Don\'t miss out!',
    pos: { top: '62%', left: '30%' },
  },
];

export default function RetroDesktop() {
  const [isRetro, setIsRetro] = useState(false);
  const [time, setTime] = useState('');
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [visibleAds, setVisibleAds] = useState<number[]>([]);
  const [showRightClickDialog, setShowRightClickDialog] = useState(false);
  const [showLimeWire, setShowLimeWire] = useState(false);
  const [lwStage, setLwStage] = useState<'idle' | 'downloading' | 'done'>('idle');
  const [lwProgress, setLwProgress] = useState(0);
  const [showNotepad, setShowNotepad] = useState(false);
  const [showHijack, setShowHijack] = useState(false);
  const [showRecycleBin, setShowRecycleBin] = useState(false);
  const [showSparkNotes, setShowSparkNotes] = useState(false);
  const [sparkTab, setSparkTab] = useState<'summary'|'characters'|'themes'|'quotes'|'quiz'>('summary');
  const [quizAnswers, setQuizAnswers] = useState<Record<number,string>>({});
  const [showBsod, setShowBsod] = useState(false);
  const [bsodRecovered, setBsodRecovered] = useState(false);
  const [showClockDialog, setShowClockDialog] = useState(false);
  const [clockTime, setClockTime] = useState('');
  const konamiRef = useRef<string[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    const check = () => setIsRetro(document.documentElement.classList.contains('retro'));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!isRetro) {
      setVisibleAds([]);
      setShowStartMenu(false);
      setShowRightClickDialog(false);
      return;
    }
    const onContextMenu = (e: MouseEvent) => { e.preventDefault(); setShowRightClickDialog(true); };
    document.addEventListener('contextmenu', onContextMenu);
    return () => document.removeEventListener('contextmenu', onContextMenu);
  }, [isRetro]);

  useEffect(() => {
    if (!isRetro) { setVisibleAds([]); setShowStartMenu(false); return; }
    const t1 = setTimeout(() => setVisibleAds(v => [...v, 0]), 3000);
    const t2 = setTimeout(() => setVisibleAds(v => [...v, 1]), 7000);
    const t3 = setTimeout(() => setVisibleAds(v => [...v, 2]), 12000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [isRetro]);

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

  // ── Konami code → BSOD ──────────────────────────────────────────────
  useEffect(() => {
    if (!isRetro) return;
    const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    const onKey = (e: KeyboardEvent) => {
      const seq = konamiRef.current;
      seq.push(e.key);
      if (seq.length > KONAMI.length) seq.shift();
      if (seq.join(',') === KONAMI.join(',')) {
        konamiRef.current = [];
        setShowBsod(true);
        setBsodRecovered(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isRetro]);

  useEffect(() => {
    if (!showBsod) return;
    const onAnyKey = () => {
      setShowBsod(false);
      setBsodRecovered(true);
      setTimeout(() => setBsodRecovered(false), 4000);
    };
    window.addEventListener('keydown', onAnyKey, { once: true });
    // Auto-dismiss after 10s
    const t = setTimeout(onAnyKey, 10000);
    return () => { window.removeEventListener('keydown', onAnyKey); clearTimeout(t); };
  }, [showBsod]);

  // ── Clock dialog live time ───────────────────────────────────────────
  useEffect(() => {
    if (!showClockDialog) return;
    const tick = () => {
      const now = new Date();
      const h = now.getHours().toString().padStart(2, '0');
      const m = now.getMinutes().toString().padStart(2, '0');
      const s = now.getSeconds().toString().padStart(2, '0');
      setClockTime(`${h}:${m}:${s}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [showClockDialog]);


  const startLwDownload = () => {
    setLwStage('downloading');
    setLwProgress(0);
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 8 + 3;
      if (p >= 100) {
        p = 100;
        clearInterval(iv);
        setLwProgress(100);
        setLwStage('done');
        setTimeout(() => infectAndHijack(), 1200);
      } else {
        setLwProgress(Math.floor(p));
      }
    }, 120);
  };

  const closeLimeWire = () => {
    setShowLimeWire(false);
    setLwStage('idle');
    setLwProgress(0);
  };

  const infectAndHijack = () => {
    setShowLimeWire(false);
    setLwStage('idle');
    setLwProgress(0);
    setShowHijack(true);
  };

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
        {ICONS.map(({ label, href, color, type }) => {
          if (type === 'limewire') {
            return (
              <div key={href} className="rd-icon" onClick={() => { setShowLimeWire(true); setLwStage('idle'); setLwProgress(0); }} style={{ cursor: 'pointer' }}>
                <PageIcon type={type} color={color} />
                <span className="rd-icon-label">{label}</span>
              </div>
            );
          }
          if (type === 'notepad') {
            return (
              <div key={href} className="rd-icon" onClick={() => setShowNotepad(true)} style={{ cursor: 'pointer' }}>
                <PageIcon type={type} color={color} />
                <span className="rd-icon-label">{label}</span>
              </div>
            );
          }
          if (type === 'recyclebin') {
            return (
              <div key={href} className="rd-icon" onClick={() => setShowRecycleBin(true)} style={{ cursor: 'pointer' }}>
                <PageIcon type={type} color={color} />
                <span className="rd-icon-label">{label}</span>
              </div>
            );
          }
          if (type === 'sparknotes') {
            return (
              <div key={href} className="rd-icon" onClick={() => { setShowSparkNotes(true); setSparkTab('summary'); setQuizAnswers({}); }} style={{ cursor: 'pointer' }}>
                <PageIcon type={type} color={color} />
                <span className="rd-icon-label">{label}</span>
              </div>
            );
          }
          return (
            <Link key={href} href={href} className="rd-icon">
              <PageIcon type={type} color={color} />
              <span className="rd-icon-label">{label}</span>
            </Link>
          );
        })}
      </div>

      {/* Popup ads */}
      {visibleAds.map(id => {
        const ad = ADS[id];
        return (
          <div key={ad.id} className="rd-popup-ad" style={ad.pos}>
            <div className="rd-popup-ad-titlebar">
              <span className="rd-popup-ad-title">{ad.title}</span>
              <button
                className="aim-wbtn aim-wbtn-close"
                onClick={() => setVisibleAds(v => v.filter(i => i !== id))}
              >×</button>
            </div>
            <div className="rd-popup-ad-body">
              <p>{ad.body}</p>
              <button className="rd-popup-ad-btn rd-popup-ad-btn-blink">CLICK HERE!</button>
            </div>
          </div>
        );
      })}

      {/* LimeWire easter egg window */}
      {showLimeWire && (
        <div className="lw-wrap">
          <div className="lw-titlebar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span className="lw-logo-dot" />
              <span className="lw-title-text">LimeWire 4.18.8</span>
            </div>
            <div className="aim-winbtns">
              <button className="aim-wbtn aim-wbtn-min">_</button>
              <button className="aim-wbtn aim-wbtn-close" onClick={closeLimeWire}>×</button>
            </div>
          </div>

          {/* Search bar */}
          <div className="lw-searchbar">
            <input className="lw-search-input" defaultValue="Eminem Lose Yourself" readOnly />
            <button className="lw-search-btn">Search</button>
          </div>

          {/* Results */}
          <div className="lw-results-header">
            <span>Filename</span><span>Size</span><span>Sources</span>
          </div>
          <div className="lw-results">
            <div className="lw-result lw-result-selected">
              <span>🎵 Eminem - Lose Youself (REAL NOT FAKE).mp3</span>
              <span>4.3 MB</span>
              <span className="lw-sources">47</span>
            </div>
            <div className="lw-result">
              <span>🎵 Eminem_Lose_Yourself_FULL_VERSION.mp3<span className="lw-exe-ext">.exe</span></span>
              <span>6.7 MB</span>
              <span className="lw-sources">31</span>
            </div>
            <div className="lw-result">
              <span>🎵 eminem lose yourself (CLEAN RADIO NO VIRUS).mp3</span>
              <span>47.2 MB</span>
              <span className="lw-sources">8</span>
            </div>
            <div className="lw-result">
              <span>🎵 EMINEM LOSE YOURSELF FREE FULL ALBUM.mp3</span>
              <span>0.0 KB</span>
              <span className="lw-sources">2</span>
            </div>
            <div className="lw-result">
              <span>🎵 Eminem - Lose Yourself [HQ 128kbps].exe</span>
              <span>2.1 MB</span>
              <span className="lw-sources">19</span>
            </div>
          </div>

          {/* Progress / status */}
          <div className="lw-status-row">
            {lwStage === 'idle' && (
              <button className="lw-dl-btn" onClick={startLwDownload}>▼ Download</button>
            )}
            {lwStage === 'downloading' && (
              <div className="lw-progress-wrap">
                <span className="lw-progress-label">Downloading... {lwProgress}%</span>
                <div className="lw-progress-track">
                  <div className="lw-progress-fill" style={{ width: `${lwProgress}%` }} />
                </div>
              </div>
            )}
            {lwStage === 'done' && (
              <span className="lw-done-text">✓ Download complete!</span>
            )}
          </div>

        </div>
      )}

      {/* Browser hijack popup */}
      {showHijack && (
        <div className="hijack-wrap">
          <div className="rd-alert-titlebar hijack-titlebar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span className="rd-alert-ie-logo">e</span>
              <span className="rd-alert-title">CoolWebSearch - Microsoft Internet Explorer</span>
            </div>
            <div className="aim-winbtns">
              <button className="aim-wbtn aim-wbtn-min">_</button>
              <button className="aim-wbtn">□</button>
              <button className="aim-wbtn aim-wbtn-close" onClick={() => setShowHijack(false)}>×</button>
            </div>
          </div>
          <div className="rd-br-menubar">
            {['File','Edit','View','Favorites','Tools','Help'].map(item => (
              <span key={item} className="rd-br-menu-item">{item}</span>
            ))}
          </div>
          <div className="rd-br-toolbar" style={{ gap: 3 }}>
            <button className="rd-br-tbtn">◄ Back</button>
            <button className="rd-br-tbtn">Forward ►</button>
            <button className="rd-br-tbtn">↻</button>
            <div className="rd-br-sep" />
            <span className="rd-br-addr-label">Address</span>
            <div className="rd-br-addr-bar hijack-addr">http://www.coolwebsearch.com</div>
            <button className="rd-br-go">Go</button>
          </div>
          <div className="hijack-body">
            <div className="hijack-banner">🔍 CoolWebSearch™ — The Web&apos;s #1 Search Portal!</div>
            <div className="hijack-search-row">
              <input className="hijack-search-input" defaultValue="" placeholder="Search the Web..." readOnly />
              <button className="hijack-search-btn">SEARCH!</button>
            </div>
            <div className="hijack-links">
              <span>Free Ringtones!</span>
              <span>Win an iPod!</span>
              <span>Hot Singles Near You!</span>
              <span>Download Smileys FREE!</span>
              <span>Cheap Mortgages!</span>
            </div>
            <div className="hijack-ads">
              <div className="hijack-ad">💊 LOSE WEIGHT FAST<br/><small>Doctors HATE this trick</small></div>
              <div className="hijack-ad">🏆 YOU ARE TODAY&apos;S<br/>WINNER — CLAIM NOW</div>
              <div className="hijack-ad">💻 YOUR PC IS SLOW<br/><small>Click to fix FREE</small></div>
            </div>
            <p className="hijack-footer">
              CoolWebSearch is now your homepage. To change this, go to Tools &gt; Internet Options.<br/>
              <small style={{ color: '#aaa' }}>CoolWebSearch 2003. All rights reserved. By using this site you agree to install 47 additional toolbars.</small>
            </p>
          </div>
        </div>
      )}

      {/* Right-click protection dialog */}
      {showRightClickDialog && (
        <div className="rd-alert-overlay" onClick={() => setShowRightClickDialog(false)}>
          <div className="rd-alert-dialog" onClick={e => e.stopPropagation()}>
            <div className="rd-alert-titlebar">
              <span className="rd-alert-ie-logo">e</span>
              <span className="rd-alert-title">Internet Explorer</span>
              <button className="aim-wbtn aim-wbtn-close" onClick={() => setShowRightClickDialog(false)}>×</button>
            </div>
            <div className="rd-alert-body">
              <span className="rd-alert-icon">⚠️</span>
              <p>© 2001 LC3 Club. All rights reserved.</p>
              <p>Right-clicking has been disabled on this page.</p>
              <button className="rd-alert-ok" onClick={() => setShowRightClickDialog(false)}>OK</button>
            </div>
          </div>
        </div>
      )}

      {/* Notepad easter egg */}
      {showNotepad && (
        <div className="np-wrap">
          <div className="rd-alert-titlebar np-titlebar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <svg width="14" height="14" viewBox="0 0 32 32" aria-hidden="true">
                <rect x="4" y="1" width="21" height="28" rx="1" fill="#fffff0" stroke="#999" strokeWidth="2"/>
                <rect x="4" y="1" width="21" height="4" fill="#4a90d9"/>
                <rect x="7" y="9"  width="14" height="2" rx="0.5" fill="#aaa"/>
                <rect x="7" y="14" width="11" height="2" rx="0.5" fill="#aaa"/>
                <rect x="7" y="19" width="13" height="2" rx="0.5" fill="#aaa"/>
              </svg>
              <span className="rd-alert-title">readme.txt - Notepad</span>
            </div>
            <div className="aim-winbtns">
              <button className="aim-wbtn aim-wbtn-min">_</button>
              <button className="aim-wbtn">□</button>
              <button className="aim-wbtn aim-wbtn-close" onClick={() => setShowNotepad(false)}>×</button>
            </div>
          </div>
          <div className="np-menubar">
            {['File','Edit','Format','View','Help'].map(m => (
              <span key={m} className="rd-br-menu-item">{m}</span>
            ))}
          </div>
          <pre className="np-body">{`LC3 CLUB - Lowcode & Cloud Computing Club
College of Southern Nevada
==========================================
README.TXT  |  Rev 1.0  |  April 2001
==========================================

WELCOME TO LC3 CLUB!

We are a student technology organization
dedicated to learning Microsoft platforms
and making the Internet a better place.

WHAT WE TEACH:
  - Microsoft FrontPage 2000
  - Visual Basic 6.0
  - Microsoft Access 2000
  - Windows XP (Brand NEW this year!!)
  - HTML & DHTML for the Web

UPCOMING MEETINGS:
  * Tue Apr 10  |  LAN Party (Room B-101)
                   Bring your own CAT5 cable!!
  * Tue Apr 17  |  PowerPoint Tournament
                   1st place wins a CD-R spindle
  * Tue Apr 24  |  Windows XP Install Workshop

HOW TO JOIN:
  1. Show up to Room B-101 on Tuesday @ 6pm
  2. Sign the sign-in sheet
  3. Congrats, you are a member!
  (No dues. Free pizza sometimes.)

CONTACT US:
  AIM  :  LC3ClubCSN
  ICQ  :  #31337420
  Email:  lc3club@hotmail.com
  Web  :  http://www.lc3club.cjb.net

SYSTEM REQUIREMENTS:
  OS  : Windows 98/ME/XP
  RAM : 64MB (128MB recommended)
  Net : 56k modem or broadband
  IE  : Internet Explorer 6.0 or later

NOTE: This site is best viewed at
800x600 in Internet Explorer 6.
Netscape users may see some issues.
We are sorry for the inconvenience.

------------------------------------------
(c) 2001 LC3 Club. All Rights Reserved.
Built with Microsoft FrontPage 2000.
------------------------------------------`}</pre>
        </div>
      )}

      {/* Recycle Bin window */}
      {showRecycleBin && (
        <div className="rb-wrap">
          <div className="rd-alert-titlebar rb-titlebar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <svg width="14" height="14" viewBox="0 0 32 32" aria-hidden="true">
                <path d="M7,13 L9,31 L23,31 L25,13 Z" fill="#c8d0d8" stroke="#8090a0" strokeWidth="1.5" />
                <rect x="5" y="10" width="22" height="4" rx="1" fill="#b0bcc8" stroke="#8090a0" strokeWidth="1.5" />
                <rect x="13" y="7" width="6" height="4" rx="1" fill="#b0bcc8" stroke="#8090a0" strokeWidth="1.5" />
              </svg>
              <span className="rd-alert-title">Recycle Bin</span>
            </div>
            <div className="aim-winbtns">
              <button className="aim-wbtn aim-wbtn-min">_</button>
              <button className="aim-wbtn">□</button>
              <button className="aim-wbtn aim-wbtn-close" onClick={() => setShowRecycleBin(false)}>×</button>
            </div>
          </div>
          <div className="np-menubar">
            {['File','Edit','View','Favorites','Tools','Help'].map(m => (
              <span key={m} className="rd-br-menu-item">{m}</span>
            ))}
          </div>
          <div className="rb-toolbar">
            <button className="rd-br-tbtn rb-empty-btn" onClick={() => setShowRecycleBin(false)}>
              🗑 Empty Recycle Bin
            </button>
            <div className="rd-br-sep" />
            <div className="rb-addr-row">
              <span className="rd-br-addr-label">Address</span>
              <div className="rd-br-addr-bar">Recycle Bin</div>
            </div>
          </div>
          <div className="rb-col-header">
            <span className="rb-col rb-col-name">Name</span>
            <span className="rb-col rb-col-loc">Original Location</span>
            <span className="rb-col rb-col-date">Date Deleted</span>
            <span className="rb-col rb-col-size">Size</span>
            <span className="rb-col rb-col-type">Type</span>
          </div>
          <div className="rb-files">
            {[
              { name: 'bonzibuddy_setup.exe',                loc: 'C:\\Program Files\\',    date: '3/14/2003',  size: '2.3 MB',  type: 'Application'    },
              { name: 'my_diary_PRIVATE.doc',                loc: 'C:\\My Documents\\',     date: '11/22/2002', size: '47 KB',   type: 'Word Document'  },
              { name: 'coolwebsearch_toolbar_v2.exe',        loc: 'C:\\Downloads\\',        date: '5/18/2003',  size: '1.1 MB',  type: 'Application'    },
              { name: 'definitely_not_a_virus.mp3.exe',      loc: 'C:\\Shared\\Music\\',    date: '9/2/2002',   size: '512 KB',  type: 'Application'    },
              { name: 'homework_final_FINAL_v2_REAL.doc',    loc: 'C:\\My Documents\\',     date: '1/30/2003',  size: '23 KB',   type: 'Word Document'  },
              { name: 'geocities_backup_lc3fan.html',        loc: 'C:\\Desktop\\',          date: '6/11/2002',  size: '8 KB',    type: 'HTML File'      },
              { name: 'README_IMPORTANT_READ_THIS.txt',      loc: 'C:\\Desktop\\',          date: '4/1/2003',   size: '1 KB',    type: 'Text Document'  },
            ].map((f, i) => (
              <div key={i} className={`rb-file${i % 2 === 0 ? '' : ' rb-file-alt'}`}>
                <span className="rb-col rb-col-name">📄 {f.name}</span>
                <span className="rb-col rb-col-loc">{f.loc}</span>
                <span className="rb-col rb-col-date">{f.date}</span>
                <span className="rb-col rb-col-size">{f.size}</span>
                <span className="rb-col rb-col-type">{f.type}</span>
              </div>
            ))}
          </div>
          <div className="rb-statusbar">
            7 object(s) &nbsp;|&nbsp; Total size: 4.1 MB
          </div>
        </div>
      )}

      {/* SparkNotes window */}
      {showSparkNotes && (() => {
        const TABS = ['summary','characters','themes','quotes','quiz'] as const;
        const QUIZ = [
          { q: 'How long do Romeo & Juliet know each other before marrying?', opts: ['One year','Three months','About 24 hours','Two weeks'], correct: 'About 24 hours' },
          { q: '"Wherefore art thou Romeo" — what does "wherefore" mean?', opts: ['Where','Who','How','Why'], correct: 'Why' },
          { q: 'Whose idea was the fake-death potion plan?', opts: ['Romeo','Juliet','The Nurse','Friar Lawrence'], correct: 'Friar Lawrence' },
          { q: 'Who kills Mercutio?', opts: ['Romeo','Paris','Capulet','Tybalt'], correct: 'Tybalt' },
          { q: 'When is your essay due?', opts: ['Next week','I already did it','What essay','Tomorrow'], correct: 'Tomorrow' },
        ];
        return (
          <div className="sn-wrap">
            {/* Title bar */}
            <div className="rd-alert-titlebar sn-titlebar">
              <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                <span className="sn-logo-bolt">⚡</span>
                <span className="rd-alert-title" style={{ color:'#fff' }}>SparkNotes — Romeo and Juliet</span>
              </div>
              <div className="aim-winbtns">
                <button className="aim-wbtn aim-wbtn-min">_</button>
                <button className="aim-wbtn">□</button>
                <button className="aim-wbtn aim-wbtn-close" onClick={() => setShowSparkNotes(false)}>×</button>
              </div>
            </div>

            {/* Site header */}
            <div className="sn-header">
              <div className="sn-brand">⚡ <strong>SparkNotes</strong> <span className="sn-tagline">Today&apos;s Most Popular Study Guides</span></div>
              <div className="sn-book-title">Romeo and Juliet — by William Shakespeare</div>
            </div>

            {/* Tab bar */}
            <div className="sn-tabs">
              {TABS.map(t => (
                <button key={t} className={`sn-tab${sparkTab === t ? ' sn-tab-active' : ''}`} onClick={() => setSparkTab(t)}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="sn-body">

              {sparkTab === 'summary' && (
                <div className="sn-content">
                  <p className="sn-section-title">Plot Overview</p>
                  <p>Romeo and Juliet is a play about two teenagers who meet at a party, fall in love, get secretly married, and are both dead within <strong>five days</strong>. Shakespeare called it a tragedy. Students call it a Thursday.</p>
                  <p className="sn-act"><strong>Act 1:</strong> Romeo is extremely sad about a girl named Rosaline. His friends drag him to a Capulet party he wasn&apos;t invited to. He sees Juliet, immediately forgets Rosaline, and they kiss within 5 minutes. Juliet is 13. Romeo is 16. Nobody thinks this is a problem.</p>
                  <p className="sn-act"><strong>Act 2:</strong> The balcony scene. Romeo hides in Juliet&apos;s garden like a normal person. They declare eternal love. They arrange a secret marriage for the <em>very next morning</em>. Friar Lawrence agrees to perform the ceremony because he thinks it will end the family feud. It does not end the family feud.</p>
                  <p className="sn-act"><strong>Act 3:</strong> Romeo&apos;s best friend Mercutio is stabbed by Juliet&apos;s cousin Tybalt. Romeo kills Tybalt. Romeo is banished. Juliet is told to marry someone named Paris. Rough week.</p>
                  <p className="sn-act"><strong>Act 4:</strong> Juliet refuses to marry Paris. Friar Lawrence hands her a potion that simulates death. The plan: fake death, Romeo comes, they escape together. He sends a letter explaining everything. The letter does not arrive.</p>
                  <p className="sn-act"><strong>Act 5:</strong> Romeo hears Juliet is dead. Does not wait for more information. Buys poison, goes to the tomb, drinks it. Juliet wakes up. Sees Romeo dead. Stabs herself. The two families finally agree to stop fighting. Six people are dead. Great lesson everyone.</p>
                </div>
              )}

              {sparkTab === 'characters' && (
                <div className="sn-content">
                  <p className="sn-section-title">Character List</p>
                  <div className="sn-char"><strong>Romeo Montague</strong> — 16 years old. In love with Rosaline on Monday. Married to Juliet by Wednesday. Dead by Friday. Makes every major life decision within 30 seconds of having a new feeling.</div>
                  <div className="sn-char"><strong>Juliet Capulet</strong> — 13 years old. Considerably smarter than Romeo. Goes along with it anyway. Invents the phrase "what&apos;s in a name." Does not survive the play.</div>
                  <div className="sn-char"><strong>Friar Lawrence</strong> — A monk. Secretly marries teenagers. Distributes unregulated potions. His plans have a 0% success rate. Means well.</div>
                  <div className="sn-char"><strong>Mercutio</strong> — Romeo&apos;s best friend. Funny, loud, not a Montague or Capulet. Dies in Act 3. The best character in the play. Gone too soon.</div>
                  <div className="sn-char"><strong>Tybalt</strong> — Juliet&apos;s cousin. Angry at all times. Responsible for approximately 60% of the plot. Hates Romeo for reasons he cannot explain.</div>
                  <div className="sn-char"><strong>The Nurse</strong> — Juliet&apos;s caretaker. Knows everything. Tells Juliet to just marry Paris. Not helpful.</div>
                  <div className="sn-char"><strong>Count Paris</strong> — Rich, handsome, wants to marry Juliet. Has done nothing wrong. Dies anyway.</div>
                </div>
              )}

              {sparkTab === 'themes' && (
                <div className="sn-content">
                  <p className="sn-section-title">Major Themes</p>
                  <div className="sn-theme"><strong>Love at First Sight</strong><br/>Shakespeare argues it is real and powerful. Historians argue it is a 5-day relationship that results in 6 deaths and could have been avoided with a cell phone.</div>
                  <div className="sn-theme"><strong>Fate vs. Free Will</strong><br/>The prologue calls them &quot;star-crossed lovers,&quot; suggesting fate. However, most of the tragedy happens because a letter got delayed, Romeo didn&apos;t wait 10 minutes, and nobody communicated clearly. Arguably a free will problem.</div>
                  <div className="sn-theme"><strong>Family Conflict</strong><br/>The Montague-Capulet feud drives the entire play. The reason for the feud is never stated. It is very old. It is very dumb. Six people die before the families agree it was a bad idea.</div>
                  <div className="sn-theme"><strong>Youth and Impulsiveness</strong><br/>Every major decision in this play is made in under five minutes by someone under 20. Shakespeare may be trying to tell you something.</div>
                </div>
              )}

              {sparkTab === 'quotes' && (
                <div className="sn-content">
                  <p className="sn-section-title">Key Quotes — What They Really Mean</p>
                  <div className="sn-quote">
                    <p className="sn-quote-text">&ldquo;O Romeo, Romeo, wherefore art thou Romeo?&rdquo;</p>
                    <p className="sn-quote-note">⚠️ <strong>This is on every test:</strong> &quot;Wherefore&quot; means <em>why</em>, not <em>where</em>. Juliet is not asking where Romeo is. She is asking why he has to be a Montague. He is standing right below her.</p>
                  </div>
                  <div className="sn-quote">
                    <p className="sn-quote-text">&ldquo;A plague on both your houses!&rdquo;</p>
                    <p className="sn-quote-note">Mercutio, dying, cursing both the Montagues and Capulets. A fair and proportionate response.</p>
                  </div>
                  <div className="sn-quote">
                    <p className="sn-quote-text">&ldquo;What&apos;s in a name? That which we call a rose / By any other name would smell as sweet.&rdquo;</p>
                    <p className="sn-quote-note">Juliet argues that Romeo&apos;s last name (Montague) shouldn&apos;t matter. He keeps his last name. This does not help.</p>
                  </div>
                  <div className="sn-quote">
                    <p className="sn-quote-text">&ldquo;For never was a story of more woe / Than this of Juliet and her Romeo.&rdquo;</p>
                    <p className="sn-quote-note">The Prince, wrapping things up at the end. Shakespeare writing his own five-star review.</p>
                  </div>
                </div>
              )}

              {sparkTab === 'quiz' && (
                <div className="sn-content">
                  <p className="sn-section-title">Quick Quiz — Test Your Knowledge</p>
                  {QUIZ.map((q, qi) => (
                    <div key={qi} className="sn-quiz-q">
                      <p className="sn-quiz-qtext"><strong>{qi + 1}.</strong> {q.q}</p>
                      <div className="sn-quiz-opts">
                        {q.opts.map(opt => {
                          const picked = quizAnswers[qi] === opt;
                          const isCorrect = opt === q.correct;
                          const answered = quizAnswers[qi] != null;
                          let cls = 'sn-quiz-opt';
                          if (answered && isCorrect) cls += ' sn-quiz-correct';
                          else if (picked && !isCorrect) cls += ' sn-quiz-wrong';
                          return (
                            <button key={opt} className={cls} onClick={() => !answered && setQuizAnswers(a => ({ ...a, [qi]: opt }))}>
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                      {quizAnswers[qi] != null && (
                        <p className={`sn-quiz-feedback ${quizAnswers[qi] === q.correct ? 'sn-fb-correct' : 'sn-fb-wrong'}`}>
                          {quizAnswers[qi] === q.correct ? '✓ Correct! Good luck on that essay.' : `✗ Incorrect. The answer is "${q.correct}." Maybe re-read the SparkNotes.`}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

            </div>

            <div className="sn-footer">
              © 2003 SparkNotes LLC. All Rights Reserved. &nbsp;|&nbsp; <span className="sn-footer-link">Order the book on Amazon.com</span> &nbsp;|&nbsp; <span className="sn-footer-link">Get the No Fear Shakespeare edition</span>
            </div>
          </div>
        );
      })()}

      {/* Start menu */}
      {showStartMenu && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 9997 }}
            onClick={() => setShowStartMenu(false)}
          />
          <div className="rd-start-menu">
            <div className="rd-sm-header">
              <div className="rd-sm-avatar">
                <svg viewBox="0 0 32 32" width="38" height="38" aria-hidden="true">
                  <circle cx="16" cy="16" r="16" fill="#2a5bd4" />
                  <circle cx="16" cy="12" r="6" fill="#c8d8f8" />
                  <path d="M4 30 Q4 22 16 22 Q28 22 28 30" fill="#c8d8f8" />
                </svg>
              </div>
              <span className="rd-sm-username">LC3Club</span>
            </div>
            <div className="rd-sm-items">
              {ICONS.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="rd-sm-item"
                  onClick={() => setShowStartMenu(false)}
                >
                  {label}
                </Link>
              ))}
              <div className="rd-sm-divider" />
              <button
                className="rd-sm-item rd-sm-shutdown"
                onClick={() => {
                  setShowStartMenu(false);
                  window.dispatchEvent(new Event('retro-deactivate'));
                }}
              >
                🔌 Shut Down...
              </button>
            </div>
          </div>
        </>
      )}

      {/* Win98 Taskbar */}
      <div className="rd-taskbar" role="toolbar" aria-label="Taskbar">
        <button
          className="rd-start-btn"
          type="button"
          onClick={() => setShowStartMenu(m => !m)}
          style={showStartMenu ? { boxShadow: 'inset -1px -1px 0 #fff, inset 1px 1px 0 #555' } : undefined}
        >
          <WinLogo />
          <span className="rd-start-label">Start</span>
        </button>
        <div className="rd-taskbar-sep" aria-hidden="true" />
        <div className="rd-taskbar-window">
          <WinLogo />
          <span>LC3 &ndash; Lowcode Cloud Club</span>
        </div>
        <div className="rd-taskbar-tray">
          <button className="rd-clock rd-clock-btn" aria-live="polite" onClick={() => setShowClockDialog(c => !c)} title="Click to open Date/Time Properties">{time}</button>
        </div>
      </div>

      {/* Clock / Date-Time dialog */}
      {showClockDialog && (
        <div className="rd-alert-overlay" onClick={() => setShowClockDialog(false)}>
          <div className="rd-clock-dialog" onClick={e => e.stopPropagation()}>
            <div className="rd-alert-titlebar">
              <span className="rd-alert-title">Date/Time Properties</span>
              <button className="aim-wbtn aim-wbtn-close" onClick={() => setShowClockDialog(false)}>×</button>
            </div>
            <div className="rd-clock-tabs">
              <div className="rd-clock-tab rd-clock-tab-active">Date &amp; Time</div>
              <div className="rd-clock-tab">Time Zone</div>
              <div className="rd-clock-tab">Internet Time</div>
            </div>
            <div className="rd-clock-body">
              <div className="rd-clock-section">
                <p className="rd-clock-label">Date</p>
                <div className="rd-clock-date-row">
                  <select className="rd-clock-select" defaultValue="March">
                    {['January','February','March','April','May','June','July','August','September','October','November','December'].map(m => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                  <input className="rd-clock-year-input" defaultValue="1998" readOnly />
                </div>
              </div>
              <div className="rd-clock-section">
                <p className="rd-clock-label">Time</p>
                <div className="rd-clock-time-display">{clockTime}</div>
                <p className="rd-clock-note">* Year locked to 1998 for Y2K compliance</p>
              </div>
            </div>
            <div className="rd-clock-footer">
              <button className="rd-alert-ok" onClick={() => setShowClockDialog(false)}>OK</button>
              <button className="rd-alert-ok" onClick={() => setShowClockDialog(false)}>Cancel</button>
              <button className="rd-alert-ok">Apply</button>
            </div>
          </div>
        </div>
      )}

      {/* BSOD */}
      {showBsod && (
        <div className="rd-bsod">
          <div className="rd-bsod-inner">
            <p className="rd-bsod-header">Windows</p>
            <br />
            <p>A fatal exception 0E has occurred at 0028:C0011E36 in VXD VMM(01) +</p>
            <p>00010E36. The current application will be terminated.</p>
            <br />
            <p>&nbsp;&nbsp;* Press any key to terminate the current application.</p>
            <p>&nbsp;&nbsp;* Press CTRL+ALT+DEL again to restart your computer. You will</p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;lose any unsaved information in all applications.</p>
            <br />
            <p className="rd-bsod-prompt">Press any key to continue <span className="rd-bsod-cursor">_</span></p>
          </div>
        </div>
      )}

      {/* BSOD recovery dialog */}
      {bsodRecovered && (
        <div className="rd-alert-overlay">
          <div className="rd-alert-dialog">
            <div className="rd-alert-titlebar">
              <span className="rd-alert-title">System Recovery</span>
              <button className="aim-wbtn aim-wbtn-close" onClick={() => setBsodRecovered(false)}>×</button>
            </div>
            <div className="rd-alert-body">
              <span className="rd-alert-icon">🛡️</span>
              <p style={{ fontWeight: 'bold' }}>Windows has recovered from a serious error.</p>
              <p>A log of this error has been created.</p>
              <p style={{ fontSize: '10px', color: '#666' }}>Error ID: 0x0000000E — VMM.VXD</p>
              <button className="rd-alert-ok" onClick={() => setBsodRecovered(false)}>OK</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
