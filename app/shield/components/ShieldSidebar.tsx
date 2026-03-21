'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { loadUserData, clearUserData, saveUserData, pushToServer } from '@/lib/shield-storage';
import {
  Shield, LayoutDashboard, Globe, Code2, Github, Package,
  Key, Cookie, Globe2, Lock, FileSearch, ClipboardCheck,
  BookOpen, Award, History, LogOut, ChevronLeft, ChevronRight,
  Menu, X
} from 'lucide-react';

const NAV_MAIN = [
  { href: '/shield/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/shield/badges', icon: Award, label: 'Badges' },
  { href: '/shield/learning', icon: BookOpen, label: 'Learning' },
  { href: '/shield/history', icon: History, label: 'History' },
];

const NAV_SCANNERS = [
  { href: '/shield/scan/url', icon: Globe, label: 'URL Scanner' },
  { href: '/shield/scan/code', icon: Code2, label: 'Code Scanner' },
  { href: '/shield/scan/github', icon: Github, label: 'GitHub Repo' },
  { href: '/shield/scan/dependencies', icon: Package, label: 'Dependencies' },
  { href: '/shield/scan/jwt', icon: Key, label: 'JWT Analyzer' },
  { href: '/shield/scan/cookies', icon: Cookie, label: 'Cookies' },
  { href: '/shield/scan/dns', icon: Globe2, label: 'DNS Checker' },
  { href: '/shield/scan/ssl', icon: Lock, label: 'SSL/TLS' },
  { href: '/shield/scan/sensitive-files', icon: FileSearch, label: 'Sensitive Files' },
  { href: '/shield/scan/owasp', icon: ClipboardCheck, label: 'OWASP Top 10' },
];

export default function ShieldSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const userData = typeof window !== 'undefined' ? loadUserData() : null;

  useEffect(() => { setMounted(true); }, []);

  if (!mounted || !userData) return null;

  const mode = userData.mode;

  const toggleMode = async () => {
    const data = loadUserData();
    if (!data) return;
    data.mode = data.mode === 'beginner' ? 'advanced' : 'beginner';
    saveUserData(data);
    await pushToServer(data);
    window.location.reload();
  };

  const logout = () => {
    clearUserData();
    router.push('/shield');
  };

  const isActive = (href: string) =>
    pathname === href || (href !== '/shield/dashboard' && pathname.startsWith(href));

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex flex-col h-full" style={{ height: mobile ? '100%' : '100vh' }}>

      {/* Logo */}
      <div
        className="flex items-center px-4 shrink-0"
        style={{
          height: '60px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          gap: collapsed && !mobile ? '0' : '10px',
          justifyContent: collapsed && !mobile ? 'center' : 'flex-start',
        }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #ef4444, #b91c1c)', boxShadow: '0 0 16px rgba(239,68,68,0.3)' }}
        >
          <Shield className="w-4 h-4 text-white" />
        </div>
        {(!collapsed || mobile) && (
          <span className="text-[15px] font-bold tracking-tight whitespace-nowrap">
            <span className="text-white">LC3</span>
            <span style={{ color: '#f87171' }}> Shield</span>
          </span>
        )}
      </div>

      {/* Mode toggle */}
      {(!collapsed || mobile) && (
        <div className="px-3 py-3 shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            onClick={toggleMode}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all"
            style={{
              background: mode === 'beginner' ? 'rgba(34,197,94,0.1)' : 'rgba(59,130,246,0.1)',
              border: `1px solid ${mode === 'beginner' ? 'rgba(34,197,94,0.25)' : 'rgba(59,130,246,0.25)'}`,
            }}
          >
            <span style={{ fontSize: '16px' }}>{mode === 'beginner' ? '🌱' : '⚡'}</span>
            <div className="min-w-0">
              <div style={{ fontSize: '12px', fontWeight: 600, color: mode === 'beginner' ? '#4ade80' : '#60a5fa' }}>
                {mode === 'beginner' ? 'Beginner Mode' : 'Advanced Mode'}
              </div>
              <div style={{ fontSize: '10px', color: '#64748b' }}>Click to switch</div>
            </div>
          </button>
        </div>
      )}

      {/* Nav links */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {/* Main section */}
        {(!collapsed || mobile) && (
          <div className="px-2 pb-1.5 pt-1">
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Main
            </span>
          </div>
        )}
        {NAV_MAIN.map(({ href, icon: Icon, label }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center rounded-lg transition-all"
              style={{
                gap: collapsed && !mobile ? '0' : '10px',
                padding: collapsed && !mobile ? '8px' : '8px 10px',
                justifyContent: collapsed && !mobile ? 'center' : 'flex-start',
                background: active ? 'rgba(59,130,246,0.15)' : 'transparent',
                color: active ? '#93c5fd' : '#94a3b8',
              }}
              title={collapsed && !mobile ? label : undefined}
              onMouseEnter={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.06)';
                  (e.currentTarget as HTMLAnchorElement).style.color = '#e2e8f0';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                  (e.currentTarget as HTMLAnchorElement).style.color = '#94a3b8';
                }
              }}
            >
              <Icon className="shrink-0" style={{ width: '16px', height: '16px', color: active ? '#93c5fd' : 'inherit' }} />
              {(!collapsed || mobile) && (
                <span style={{ fontSize: '13px', fontWeight: active ? 600 : 400 }}>{label}</span>
              )}
              {active && (!collapsed || mobile) && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#3b82f6' }} />
              )}
            </Link>
          );
        })}

        {/* Scanners section */}
        <div style={{ paddingTop: '12px' }}>
          {(!collapsed || mobile) && (
            <div className="px-2 pb-1.5">
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Scanners
              </span>
            </div>
          )}
          {NAV_SCANNERS.map(({ href, icon: Icon, label }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center rounded-lg transition-all"
                style={{
                  gap: collapsed && !mobile ? '0' : '10px',
                  padding: collapsed && !mobile ? '7px' : '7px 10px',
                  justifyContent: collapsed && !mobile ? 'center' : 'flex-start',
                  background: active ? 'rgba(59,130,246,0.12)' : 'transparent',
                  color: active ? '#93c5fd' : '#94a3b8',
                }}
                title={collapsed && !mobile ? label : undefined}
                onMouseEnter={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.06)';
                    (e.currentTarget as HTMLAnchorElement).style.color = '#e2e8f0';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                    (e.currentTarget as HTMLAnchorElement).style.color = '#94a3b8';
                  }
                }}
              >
                <Icon className="shrink-0" style={{ width: '15px', height: '15px', color: active ? '#93c5fd' : 'inherit' }} />
                {(!collapsed || mobile) && (
                  <span style={{ fontSize: '13px', fontWeight: active ? 500 : 400 }}>{label}</span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 px-2 py-3 space-y-1" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        {/* User info */}
        {(!collapsed || mobile) && (
          <div
            className="flex items-center gap-2.5 px-2 py-2 rounded-lg mb-1"
            style={{ background: 'rgba(255,255,255,0.04)' }}
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0"
              style={{ background: 'rgba(59,130,246,0.2)', color: '#93c5fd' }}
            >
              {userData.accessCode === 'LC3MEMBER' ? 'LC' : 'CS'}
            </div>
            <div className="min-w-0">
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#cbd5e1' }}>
                {userData.accessCode === 'LC3MEMBER' ? 'LC3 Club Member' : 'CSN Student'}
              </div>
              <div style={{ fontSize: '10px', color: '#64748b' }}>{userData.totalScans} scans</div>
            </div>
          </div>
        )}

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex w-full items-center rounded-lg transition-all"
          style={{
            gap: collapsed ? '0' : '10px',
            padding: collapsed ? '8px' : '8px 10px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            color: '#64748b',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = '#94a3b8';
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = '#64748b';
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
          }}
        >
          {collapsed
            ? <ChevronRight style={{ width: '15px', height: '15px' }} />
            : <ChevronLeft style={{ width: '15px', height: '15px' }} />
          }
          {!collapsed && <span style={{ fontSize: '12px' }}>Collapse sidebar</span>}
        </button>

        {/* Logout */}
        <button
          onClick={logout}
          className="flex w-full items-center rounded-lg transition-all"
          style={{
            gap: collapsed && !mobile ? '0' : '10px',
            padding: collapsed && !mobile ? '8px' : '8px 10px',
            justifyContent: collapsed && !mobile ? 'center' : 'flex-start',
            color: '#64748b',
          }}
          title={collapsed && !mobile ? 'Sign out' : undefined}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = '#fca5a5';
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.08)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = '#64748b';
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
          }}
        >
          <LogOut style={{ width: '15px', height: '15px', flexShrink: 0 }} />
          {(!collapsed || mobile) && <span style={{ fontSize: '13px' }}>Sign out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="fixed top-0 left-0 bottom-0 hidden md:flex flex-col z-40 transition-all duration-200"
        style={{
          width: collapsed ? '64px' : '240px',
          background: '#0d1117',
          borderRight: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile hamburger */}
      <button
        className="fixed top-4 left-4 z-[60] md:hidden flex items-center justify-center w-10 h-10 rounded-xl"
        style={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.12)' }}
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="w-5 h-5 text-slate-300" /> : <Menu className="w-5 h-5 text-slate-300" />}
      </button>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 md:hidden"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={() => setMobileOpen(false)}
          />
          <aside
            className="fixed top-0 left-0 bottom-0 z-50 md:hidden flex flex-col"
            style={{ width: '260px', background: '#0d1117', borderRight: '1px solid rgba(255,255,255,0.1)' }}
          >
            <SidebarContent mobile />
          </aside>
        </>
      )}

      {/* Spacer for layout */}
      <div
        className="hidden md:block shrink-0 transition-all duration-200"
        style={{ width: collapsed ? '64px' : '240px' }}
      />
    </>
  );
}
