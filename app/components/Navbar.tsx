'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

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

// Vice City star — filled when retro is active
function StarIcon({ active }: { active: boolean }) {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
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

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isRetro, setIsRetro] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cl = document.documentElement.classList;
    // Migrate old lc3-theme key
    const legacy = localStorage.getItem('lc3-theme');
    if (legacy === 'dark' && !localStorage.getItem('lc3-dark')) {
      localStorage.setItem('lc3-dark', 'true');
    }
    const dark = localStorage.getItem('lc3-dark') === 'true';
    const retro = localStorage.getItem('lc3-retro') === 'true';
    setIsDark(dark);
    setIsRetro(retro || cl.contains('retro'));
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

  const toggleDark = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    // Dark/light toggle only affects the non-retro class
    if (!isRetro) {
      document.documentElement.classList.toggle('dark', newDark);
    }
    localStorage.setItem('lc3-dark', String(newDark));
  };

  const toggleRetro = () => {
    const newRetro = !isRetro;
    setIsRetro(newRetro);
    if (newRetro) {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('retro');
    } else {
      document.documentElement.classList.remove('retro');
      // Restore dark if it was set
      document.documentElement.classList.toggle('dark', isDark);
    }
    localStorage.setItem('lc3-retro', String(newRetro));
  };

  const moreActive = moreLinks.some((l) => pathname === l.href);

  // ── Conditional class helpers ──────────────────────────────────────────────

  const headerClass = isRetro
    ? 'sticky top-0 z-50 border-b-2 border-[#ff1e78] bg-[#0b0b1e]/96 shadow-[0_2px_24px_rgba(255,30,120,0.35)]'
    : 'sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl dark:border-[#1e2d45] dark:bg-[#080d18]/85';

  const linkCls = (active: boolean) =>
    isRetro
      ? active
        ? 'px-3 py-2 text-sm font-medium transition-all border border-[#ff1e78] text-[#ff1e78] bg-[#ff1e78]/10 shadow-[0_0_10px_rgba(255,30,120,0.3)]'
        : 'px-3 py-2 text-sm font-medium transition-all text-[#c8b8e8] hover:text-[#ff1e78] hover:bg-[#ff1e78]/5 hover:shadow-[0_0_8px_rgba(255,30,120,0.2)]'
      : active
        ? 'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-violet-50 text-violet-700 border border-violet-200 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20'
        : 'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5';

  const moreButtonCls = (active: boolean) =>
    isRetro
      ? active
        ? 'flex items-center gap-1 px-3 py-2 text-sm font-medium transition-all border border-[#ff1e78] text-[#ff1e78] bg-[#ff1e78]/10'
        : 'flex items-center gap-1 px-3 py-2 text-sm font-medium transition-all text-[#c8b8e8] hover:text-[#ff1e78] hover:bg-[#ff1e78]/5'
      : active
        ? 'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-violet-50 text-violet-700 border border-violet-200 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20'
        : 'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5';

  const dropdownClass = isRetro
    ? 'absolute right-0 top-full mt-1.5 w-44 bg-[#0f0f28] border border-[#ff1e78]/50 shadow-[0_4px_20px_rgba(255,30,120,0.25)] overflow-hidden py-1 z-50'
    : 'absolute right-0 top-full mt-1.5 w-44 bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-[#1e2d45] rounded-xl shadow-lg shadow-slate-900/10 dark:shadow-black/30 overflow-hidden py-1 z-50';

  const dropLinkCls = (active: boolean) =>
    isRetro
      ? active
        ? 'block px-4 py-2 text-sm transition-all text-[#ff1e78] bg-[#ff1e78]/10'
        : 'block px-4 py-2 text-sm transition-all text-[#c8b8e8] hover:text-[#ff1e78] hover:bg-[#ff1e78]/5'
      : active
        ? 'block px-4 py-2 text-sm transition-colors text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10'
        : 'block px-4 py-2 text-sm transition-colors text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5';

  const darkBtnCls = isRetro
    ? 'p-2 transition-all text-[#c8b8e8]/50 cursor-not-allowed opacity-40'
    : 'p-2 rounded-lg transition-all text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5';

  const retroBtnCls = isRetro
    ? 'ml-1 p-2 transition-all text-[#ff1e78] drop-shadow-[0_0_6px_rgba(255,30,120,0.8)]'
    : 'ml-1 p-2 rounded-lg transition-all text-slate-400 hover:text-[#ff1e78] hover:bg-slate-100 dark:hover:bg-white/5';

  const hamLineCls = isRetro
    ? 'block h-0.5 w-5 bg-[#ff1e78] transition-all duration-200'
    : 'block h-0.5 w-5 bg-slate-500 dark:bg-slate-400 transition-all duration-200';

  const mobileMenuClass = isRetro
    ? 'sm:hidden border-t-2 border-[#ff1e78]/50 bg-[#0b0b1e]/98 px-4 py-3 flex flex-col gap-1 shadow-[0_4px_20px_rgba(255,30,120,0.2)]'
    : 'sm:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md px-4 py-3 flex flex-col gap-1 dark:border-[#1e2d45] dark:bg-[#080d18]/95';

  const mobileLinkCls = (active: boolean) =>
    isRetro
      ? active
        ? 'px-4 py-2.5 text-sm font-medium transition-all border border-[#ff1e78] text-[#ff1e78] bg-[#ff1e78]/10'
        : 'px-4 py-2.5 text-sm font-medium transition-all text-[#c8b8e8] hover:text-[#ff1e78] hover:bg-[#ff1e78]/5'
      : active
        ? 'px-4 py-2.5 rounded-lg text-sm font-medium transition-all bg-violet-50 text-violet-700 border border-violet-200 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20'
        : 'px-4 py-2.5 rounded-lg text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5';

  return (
    <header className={headerClass}>
      {!isRetro && (
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-400/20 to-transparent dark:via-violet-500/30" />
      )}
      {isRetro && (
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ff1e78]/70 to-transparent" />
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group" onClick={() => setMenuOpen(false)}>
          {isRetro ? (
            <div className="w-8 h-8 flex items-center justify-center text-[#ff1e78] font-bold text-xs border border-[#ff1e78] bg-[#ff1e78]/10 shadow-[0_0_10px_rgba(255,30,120,0.4)] group-hover:shadow-[0_0_16px_rgba(255,30,120,0.7)] transition-shadow">
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
                <span
                  className="font-bold text-sm leading-none block text-[#ff1e78]"
                  style={{ fontFamily: 'var(--font-vice), Impact, sans-serif', fontStyle: 'italic', textTransform: 'uppercase', letterSpacing: '0.06em', textShadow: '1px 1px 0 #00dcff' }}
                >
                  LC3
                </span>
                <span className="text-[10px] leading-none text-[#00dcff]/70 tracking-wider">LOWCODE CLOUD CLUB</span>
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
            <button onClick={() => setMoreOpen((o) => !o)} className={moreButtonCls(moreActive)}>
              More
              <ChevronIcon open={moreOpen} />
            </button>
            {moreOpen && (
              <div className={dropdownClass}>
                {moreLinks.map(({ href, label }) => {
                  const isActive = pathname === href;
                  return (
                    <Link key={href} href={href} onClick={() => setMoreOpen(false)} className={dropLinkCls(isActive)}>
                      {label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Light/Dark toggle — disabled visually when retro is active */}
          <button
            onClick={isRetro ? undefined : toggleDark}
            className={darkBtnCls}
            aria-label="Toggle light/dark mode"
            title={isRetro ? 'Exit retro mode to use light/dark toggle' : isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>

          {/* Retro toggle — separate button with Vice City star */}
          <button
            onClick={toggleRetro}
            className={retroBtnCls}
            aria-label={isRetro ? 'Exit Vice City mode' : 'Enter Vice City mode'}
            title={isRetro ? 'Exit Vice City mode' : 'Enter Vice City mode'}
          >
            <StarIcon active={isRetro} />
          </button>
        </nav>

        {/* Mobile controls */}
        <div className="sm:hidden flex items-center gap-1">
          <button
            onClick={isRetro ? undefined : toggleDark}
            className={`p-2 transition-all ${isRetro ? 'text-[#c8b8e8]/30 opacity-30' : 'rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5'}`}
            aria-label="Toggle light/dark mode"
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>
          <button
            onClick={toggleRetro}
            className={`p-2 transition-all ${isRetro ? 'text-[#ff1e78] drop-shadow-[0_0_6px_rgba(255,30,120,0.8)]' : 'rounded-lg text-slate-400 hover:text-[#ff1e78] hover:bg-slate-100 dark:hover:bg-white/5'}`}
            aria-label="Toggle Vice City mode"
          >
            <StarIcon active={isRetro} />
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
              <Link key={href} href={href} onClick={() => setMenuOpen(false)} className={mobileLinkCls(isActive)}>
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
