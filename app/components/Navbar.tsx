'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

type Theme = 'light' | 'dark' | 'retro';

const primaryLinks = [
  { href: '/', label: 'Home' },
  { href: '/shield', label: 'Shield' },
  { href: '/careers', label: 'Careers' },
  { href: '/events', label: 'Events' },
  { href: '/members', label: 'Members' },
  { href: '/hire', label: 'Partner With Us' },
  { href: '/contact', label: 'Contact' },
];

const moreLinks = [
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/projects', label: 'Projects' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/resources', label: 'Resources' },
];

const allLinks = [...primaryLinks, ...moreLinks];

function SunIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  );
}

// Pixel mushroom icon for retro theme
function PixelIcon() {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 8 8"
      fill="currentColor"
      style={{ imageRendering: 'pixelated', shapeRendering: 'crispEdges' }}
    >
      {/* Mushroom cap */}
      <rect x="2" y="0" width="4" height="1" />
      <rect x="1" y="1" width="6" height="1" />
      <rect x="0" y="2" width="8" height="1" />
      {/* Spots (gaps in cap row) */}
      <rect x="0" y="3" width="1" height="1" />
      <rect x="3" y="3" width="2" height="1" />
      <rect x="7" y="3" width="1" height="1" />
      <rect x="0" y="4" width="8" height="1" />
      {/* Stem */}
      <rect x="2" y="5" width="4" height="1" />
      <rect x="2" y="6" width="4" height="1" />
      <rect x="1" y="7" width="6" height="1" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

// Returns the next theme in the cycle
const nextTheme: Record<Theme, Theme> = { light: 'dark', dark: 'retro', retro: 'light' };

// Icon shows the NEXT theme you'll switch to
function ThemeIcon({ current }: { current: Theme }) {
  if (current === 'light') return <MoonIcon />;
  if (current === 'dark') return <PixelIcon />;
  return <SunIcon />;
}

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cl = document.documentElement.classList;
    if (cl.contains('dark')) setTheme('dark');
    else if (cl.contains('retro')) setTheme('retro');
    else setTheme('light');
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const cycleTheme = () => {
    const t = nextTheme[theme];
    setTheme(t);
    document.documentElement.classList.remove('dark', 'retro');
    if (t === 'dark') document.documentElement.classList.add('dark');
    if (t === 'retro') document.documentElement.classList.add('retro');
    localStorage.setItem('lc3-theme', t);
  };

  const moreActive = moreLinks.some((l) => pathname === l.href);
  const isRetro = theme === 'retro';

  // ── Conditional class helpers ──────────────────────────────────────────────

  const headerClass = isRetro
    ? 'sticky top-0 z-50 border-b-4 border-[#05d9e8] bg-[#1a0533]'
    : 'sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl dark:border-[#1e2d45] dark:bg-[#080d18]/85';

  const linkCls = (active: boolean) =>
    isRetro
      ? active
        ? 'px-2 py-1 text-[7px] transition-colors border-2 border-[#ffd700] text-[#ffd700] bg-[#3d1a7a]'
        : 'px-2 py-1 text-[7px] transition-colors text-[#05d9e8] hover:text-[#ffd700] hover:bg-[#2a0f4d] border-2 border-transparent hover:border-[#ffd700]'
      : active
        ? 'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-violet-50 text-violet-700 border border-violet-200 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20'
        : 'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5';

  const moreButtonCls = (active: boolean) =>
    isRetro
      ? active
        ? 'flex items-center gap-1 px-2 py-1 text-[7px] transition-colors border-2 border-[#ffd700] text-[#ffd700] bg-[#3d1a7a]'
        : 'flex items-center gap-1 px-2 py-1 text-[7px] transition-colors text-[#05d9e8] hover:text-[#ffd700] hover:bg-[#2a0f4d] border-2 border-transparent hover:border-[#ffd700]'
      : active
        ? 'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-violet-50 text-violet-700 border border-violet-200 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20'
        : 'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5';

  const dropdownClass = isRetro
    ? 'absolute right-0 top-full mt-1.5 w-44 bg-[#1a0533] border-2 border-[#05d9e8] shadow-[4px_4px_0_#ff2a6d] overflow-hidden py-1 z-50'
    : 'absolute right-0 top-full mt-1.5 w-44 bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-[#1e2d45] rounded-xl shadow-lg shadow-slate-900/10 dark:shadow-black/30 overflow-hidden py-1 z-50';

  const dropLinkCls = (active: boolean) =>
    isRetro
      ? active
        ? 'block px-4 py-2 text-[7px] transition-colors text-[#ffd700] bg-[#3d1a7a]'
        : 'block px-4 py-2 text-[7px] transition-colors text-[#05d9e8] hover:text-[#ffd700] hover:bg-[#2a0f4d]'
      : active
        ? 'block px-4 py-2 text-sm transition-colors text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10'
        : 'block px-4 py-2 text-sm transition-colors text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5';

  const themeButtonCls = isRetro
    ? 'ml-1 p-1.5 transition-all text-[#05d9e8] hover:text-[#ffd700] hover:bg-[#2a0f4d] border-2 border-transparent hover:border-[#05d9e8]'
    : 'ml-1 p-2 rounded-lg transition-all text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5';

  const mobileThemeButtonCls = isRetro
    ? 'p-1.5 transition-all text-[#05d9e8] hover:text-[#ffd700] border-2 border-transparent hover:border-[#05d9e8]'
    : 'p-2 rounded-lg transition-all text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5';

  const hamLineCls = isRetro
    ? 'block h-0.5 w-5 bg-[#05d9e8] transition-all duration-200'
    : 'block h-0.5 w-5 bg-slate-500 dark:bg-slate-400 transition-all duration-200';

  const mobileMenuClass = isRetro
    ? 'sm:hidden border-t-2 border-[#05d9e8] bg-[#1a0533] px-4 py-3 flex flex-col gap-1'
    : 'sm:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md px-4 py-3 flex flex-col gap-1 dark:border-[#1e2d45] dark:bg-[#080d18]/95';

  const mobileLinkCls = (active: boolean) =>
    isRetro
      ? active
        ? 'px-4 py-2.5 text-[7px] transition-all border-2 border-[#ffd700] text-[#ffd700] bg-[#3d1a7a]'
        : 'px-4 py-2.5 text-[7px] transition-all text-[#05d9e8] hover:text-[#ffd700] hover:bg-[#2a0f4d] border-2 border-transparent'
      : active
        ? 'px-4 py-2.5 rounded-lg text-sm font-medium transition-all bg-violet-50 text-violet-700 border border-violet-200 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20'
        : 'px-4 py-2.5 rounded-lg text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5';

  return (
    <header className={headerClass}>
      {!isRetro && (
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-400/20 to-transparent dark:via-violet-500/30" />
      )}
      {isRetro && (
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ff2a6d]/60 to-transparent" />
      )}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group" onClick={() => setMenuOpen(false)}>
          {isRetro ? (
            <div className="w-8 h-8 flex items-center justify-center text-[#ffd700] font-bold text-xs border-2 border-[#ffd700] bg-[#3d1a7a] shadow-[2px_2px_0_#ff2a6d]">
              LC3
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-shadow">
              LC3
            </div>
          )}
          <div>
            {isRetro ? (
              <>
                <span className="font-bold text-xs leading-none block text-[#05d9e8]">LC3</span>
                <span className="text-[6px] leading-none text-[#ff2a6d]">LOWCODE CLOUD CLUB</span>
              </>
            ) : (
              <>
                <span className="font-semibold text-slate-900 text-sm leading-none block dark:text-white">LC3</span>
                <span className="text-slate-400 text-xs leading-none">Lowcode Cloud Club</span>
              </>
            )}
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-1">
          {primaryLinks.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link key={href} href={href} className={linkCls(isActive)}>
                {label}
              </Link>
            );
          })}

          {/* More dropdown */}
          <div className="relative" ref={moreRef}>
            <button
              onClick={() => setMoreOpen((o) => !o)}
              className={moreButtonCls(moreActive)}
            >
              More
              <ChevronIcon open={moreOpen} />
            </button>
            {moreOpen && (
              <div className={dropdownClass}>
                {moreLinks.map(({ href, label }) => {
                  const isActive = pathname === href;
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMoreOpen(false)}
                      className={dropLinkCls(isActive)}
                    >
                      {label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Theme cycle button */}
          <button
            onClick={cycleTheme}
            className={themeButtonCls}
            aria-label="Cycle theme"
            title={`Switch to ${nextTheme[theme]} mode`}
          >
            <ThemeIcon current={theme} />
          </button>
        </nav>

        {/* Mobile controls */}
        <div className="sm:hidden flex items-center gap-2">
          <button
            onClick={cycleTheme}
            className={mobileThemeButtonCls}
            aria-label="Cycle theme"
          >
            <ThemeIcon current={theme} />
          </button>
          <button
            className="flex flex-col justify-center items-center w-8 h-8 gap-1.5"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <span className={`${hamLineCls} ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`${hamLineCls} ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`${hamLineCls} ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className={mobileMenuClass}>
          {allLinks.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={mobileLinkCls(isActive)}
              >
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
