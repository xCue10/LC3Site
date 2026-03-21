'use client';
import { useState } from 'react';
import { Shield, ScanLine, Trophy, MessageSquare, X, ChevronRight } from 'lucide-react';

const STEPS = [
  {
    icon: Shield,
    color: '#ef4444',
    title: 'Welcome to LC3 Shield',
    body: 'LC3 Shield is your personal AI-powered cybersecurity toolkit. Scan websites, analyze code, audit GitHub repos, and more — all powered by Claude AI.',
  },
  {
    icon: ScanLine,
    color: '#3b82f6',
    title: '10 Security Scanners',
    body: 'From URL security headers to dependency CVEs to JWT analysis — each scanner targets a specific attack surface. Start with the URL Scanner on any website you\'re working on.',
  },
  {
    icon: Trophy,
    color: '#f59e0b',
    title: 'Earn Badges',
    body: 'Complete scans and fix issues to earn badges. Track your security streak, achieve an A grade, and show off your progress. Badges reset when you log out.',
  },
  {
    icon: MessageSquare,
    color: '#8b5cf6',
    title: 'AI Security Chat',
    body: 'Not sure what a vulnerability means? Open the Security Chat from the sidebar and ask Claude AI anything — from explaining attack vectors to suggesting fixes for your specific codebase.',
  },
];

export default function ShieldOnboarding({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const Icon = current.icon;
  const isLast = step === STEPS.length - 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{ background: '#161b27', border: '1px solid rgba(255,255,255,0.12)' }}
      >
        {/* Progress bar */}
        <div className="h-1" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${((step + 1) / STEPS.length) * 100}%`,
              background: `linear-gradient(90deg, ${current.color}, ${current.color}aa)`,
            }}
          />
        </div>

        <div className="p-7">
          {/* Close */}
          <div className="flex justify-between items-center mb-6">
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {step + 1} of {STEPS.length}
            </span>
            <button onClick={onClose} style={{ color: '#64748b' }} className="hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Icon */}
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
            style={{ background: `${current.color}18`, border: `1px solid ${current.color}30` }}
          >
            <Icon style={{ width: '26px', height: '26px', color: current.color }} />
          </div>

          {/* Content */}
          <h2 className="text-white font-bold mb-3" style={{ fontSize: '20px', letterSpacing: '-0.02em' }}>
            {current.title}
          </h2>
          <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.7' }}>
            {current.body}
          </p>

          {/* Actions */}
          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <button
                onClick={() => setStep(s => s - 1)}
                className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{ background: 'rgba(255,255,255,0.06)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#e2e8f0')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
              >
                Back
              </button>
            )}
            <button
              onClick={isLast ? onClose : () => setStep(s => s + 1)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
              style={{ background: `linear-gradient(135deg, ${current.color}, ${current.color}bb)` }}
            >
              {isLast ? 'Get Started' : 'Next'}
              {!isLast && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>

          {/* Skip */}
          {!isLast && (
            <button
              onClick={onClose}
              className="w-full mt-3 text-center transition-colors"
              style={{ fontSize: '12px', color: '#475569' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#64748b')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
            >
              Skip tour
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
