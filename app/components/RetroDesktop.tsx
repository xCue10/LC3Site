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
  { label: 'LimeWire',  href: '#limewire',  color: '#22c55e', type: 'limewire'  },
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
  const [lwStage, setLwStage] = useState<'idle' | 'downloading' | 'done' | 'infected'>('idle');
  const [lwProgress, setLwProgress] = useState(0);
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
        setTimeout(() => setLwStage('infected'), 1200);
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
              <span>🎵 Eminem - Lose Yourself.mp3</span>
              <span>4.3 MB</span>
              <span className="lw-sources">47</span>
            </div>
            <div className="lw-result">
              <span>🎵 Eminem - Lose Yourself.mp3</span>
              <span>6.7 MB</span>
              <span className="lw-sources">12</span>
            </div>
            <div className="lw-result">
              <span>🎵 Eminem - Lose_Yourself_FULL.mp3</span>
              <span>1.1 MB</span>
              <span className="lw-sources">3</span>
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

          {/* Infected alert */}
          {lwStage === 'infected' && (
            <div className="lw-infected-overlay">
              <div className="rd-alert-dialog" style={{ width: 300 }}>
                <div className="rd-alert-titlebar">
                  <span className="rd-alert-title">Setup Wizard</span>
                  <button className="aim-wbtn aim-wbtn-close" onClick={closeLimeWire}>×</button>
                </div>
                <div className="rd-alert-body" style={{ gap: 4 }}>
                  <span style={{ fontSize: 26 }}>🎉</span>
                  <p style={{ fontWeight: 'bold' }}>Installation complete!</p>
                  <p style={{ textAlign: 'left', lineHeight: 1.6 }}>
                    The following programs were installed:<br />
                    • MyWebSearch Toolbar v3.2<br />
                    • CoolWebSearch™ Homepage Hijacker<br />
                    • BonziBuddy FREE Edition<br />
                    • AskJeeves Toolbar (1 of 47)
                  </p>
                  <p style={{ color: '#666', fontSize: '10px !important' }}>Your homepage has been set to http://www.coolwebsearch.com</p>
                  <button className="rd-alert-ok" onClick={closeLimeWire}>OK</button>
                </div>
              </div>
            </div>
          )}
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
