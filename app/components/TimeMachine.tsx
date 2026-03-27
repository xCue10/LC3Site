'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

type Phase = 'idle' | 'boot' | 'flash' | 'depart';

const DEPART_YEARS = [2001, 2004, 2007, 2012, 2016, 2020, 2026];
const WARP_COLORS  = ['#ffcc00', '#ff9900', '#ffffff', '#ffaa33', '#ffe066', '#ffffff'];

export default function TimeMachine() {
  const [phase, setPhase]               = useState<Phase>('idle');
  const [overlayOpacity, setOverlayOpacity] = useState(1);
  const [year, setYear]                 = useState(1998);

  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const rafRef        = useRef<number>(0);
  const warpStartRef  = useRef(0);
  const timersRef     = useRef<ReturnType<typeof setTimeout>[]>([]);
  const phaseRef      = useRef<Phase>('idle');

  const schedule = (fn: () => void, ms: number) => {
    timersRef.current.push(setTimeout(fn, ms));
  };

  const clearAll = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    cancelAnimationFrame(rafRef.current);
  };

  const setP = (p: Phase) => {
    setPhase(p);
    phaseRef.current = p;
  };

  // ── Warp tunnel canvas (used on exit) ────────────────────────────────
  const startWarp = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    warpStartRef.current = Date.now();
    const LINES = 180;

    const tick = () => {
      if (phaseRef.current !== 'depart') return;

      const elapsed = (Date.now() - warpStartRef.current) / 1000;
      const w = canvas.width, h = canvas.height;
      const cx = w / 2, cy = h / 2;

      ctx.fillStyle = 'rgba(0,0,0,0.18)';
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < LINES; i++) {
        const angle  = (i / LINES) * Math.PI * 2;
        const speed  = 0.38 + (i % 7) * 0.1;
        const eased  = Math.pow(Math.min(elapsed / 2.2, 1), 1.6);
        const base   = 8 + (i % 12) * 5;
        const len    = (90 + (i % 55) * 13) * speed * eased;

        if (len < 4) continue;

        const x1 = cx + Math.cos(angle) * base;
        const y1 = cy + Math.sin(angle) * base;
        const x2 = cx + Math.cos(angle) * (base + len);
        const y2 = cy + Math.sin(angle) * (base + len);

        const col = WARP_COLORS[i % WARP_COLORS.length];
        const g   = ctx.createLinearGradient(x1, y1, x2, y2);
        g.addColorStop(0,    'transparent');
        g.addColorStop(0.45, col + '66');
        g.addColorStop(1,    col);

        ctx.beginPath();
        ctx.strokeStyle = g;
        ctx.lineWidth   = 0.4 + (i % 5) * 0.38;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  // ── Audio ────────────────────────────────────────────────────────────
  const playBootAudio = () => {
    try {
      const audioCtx = new AudioContext();
      const t = audioCtx.currentTime;
      const tone = (freq: number, start: number, end: number, vol = 0.07) => {
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.type = 'sine'; o.frequency.value = freq;
        o.connect(g); g.connect(audioCtx.destination);
        g.gain.setValueAtTime(0.001, start);
        g.gain.linearRampToValueAtTime(vol, start + 0.03);
        g.gain.exponentialRampToValueAtTime(0.001, end);
        o.start(start); o.stop(end + 0.05);
      };
      [392.0, 523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const s = t + i * 0.09;
        tone(freq, s, s + 0.9, 0.07);
      });
      setTimeout(() => audioCtx.close(), 3000);
    } catch { /* blocked */ }
  };

  const playDepartAudio = () => {
    try {
      const audioCtx = new AudioContext();
      const t = audioCtx.currentTime;
      // Modem disconnect static
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(1400, t);
      o.frequency.exponentialRampToValueAtTime(80, t + 0.5);
      o.connect(g); g.connect(audioCtx.destination);
      g.gain.setValueAtTime(0.07, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
      o.start(t); o.stop(t + 0.55);
      // Ascending notes — returning to the future
      [392.0, 523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const o2 = audioCtx.createOscillator();
        const g2 = audioCtx.createGain();
        o2.type = 'sine'; o2.frequency.value = freq;
        o2.connect(g2); g2.connect(audioCtx.destination);
        const s = t + 0.7 + i * 0.1;
        g2.gain.setValueAtTime(0.001, s);
        g2.gain.linearRampToValueAtTime(0.065, s + 0.03);
        g2.gain.exponentialRampToValueAtTime(0.001, s + 0.7);
        o2.start(s); o2.stop(s + 0.75);
      });
      setTimeout(() => audioCtx.close(), 4000);
    } catch { /* blocked */ }
  };

  // ── Sequences ────────────────────────────────────────────────────────
  const runActivate = useCallback(() => {
    clearAll();
    setOverlayOpacity(1);
    setP('boot');
    playBootAudio();

    schedule(() => { document.documentElement.classList.add('retro'); setP('flash'); }, 2800);
    schedule(() => setOverlayOpacity(0), 3000);
    schedule(() => setP('idle'), 3800);
  }, []);

  const runDeactivate = useCallback(() => {
    clearAll();
    setOverlayOpacity(1);
    setYear(2001);
    setP('depart');
    playDepartAudio();
    startWarp();

    // Year counter ticks forward
    DEPART_YEARS.forEach((y, i) => {
      schedule(() => setYear(y), 400 + i * 340);
    });

    // Remove retro class after warp
    schedule(() => {
      document.documentElement.classList.remove('retro');
      if (localStorage.getItem('lc3-dark') === 'true') {
        document.documentElement.classList.add('dark');
      }
      setP('flash');
    }, 3200);

    schedule(() => setOverlayOpacity(0), 3400);
    schedule(() => setP('idle'), 4200);
  }, [startWarp]);

  useEffect(() => {
    const onActivate   = () => runActivate();
    const onDeactivate = () => runDeactivate();
    window.addEventListener('retro-activate',   onActivate);
    window.addEventListener('retro-deactivate', onDeactivate);
    return () => {
      window.removeEventListener('retro-activate',   onActivate);
      window.removeEventListener('retro-deactivate', onDeactivate);
    };
  }, [runActivate, runDeactivate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => () => clearAll(), []);

  if (phase === 'idle') return null;

  return (
    <div className="tm-overlay" style={{ opacity: overlayOpacity, transition: 'opacity 0.7s ease' }}>

      {/* Warp canvas — visible during depart */}
      <canvas ref={canvasRef} className="tm-canvas" />

      {/* CRT scanlines */}
      <div className="tm-scanlines" />

      {/* XP boot screen — activate */}
      {phase === 'boot' && (
        <div className="tm-xp-boot">
          <div className="tm-xp-logo-row">
            <div className="tm-xp-flag">
              <span style={{ background: '#e74c3c' }} />
              <span style={{ background: '#4caf50' }} />
              <span style={{ background: '#2196f3' }} />
              <span style={{ background: '#ffc107' }} />
            </div>
            <div className="tm-xp-wordmark">
              <span>
                <span className="tm-xp-windows">Windows</span>
                <em className="tm-xp-xp"> XP</em>
              </span>
            </div>
          </div>
          <p className="tm-xp-edition">Professional</p>
          <div className="tm-xp-loadbar-track">
            <div className="tm-xp-loadbar-fill" />
          </div>
        </div>
      )}

      {/* Depart warp — exit */}
      {phase === 'depart' && (
        <div className="tm-warp-wrap">
          <p className="tm-warp-label" style={{ color: '#ffcc00' }}>►► RETURNING TO 2026 ►►</p>
          <p className="tm-year-caption">CURRENT YEAR</p>
          <div className="tm-year-display" key={year} style={{ color: '#ffcc00', textShadow: '0 0 24px #ff9900, 0 0 8px #ffcc00' }}>{year}</div>
          <p className="tm-velocity">
            FAST FORWARD&nbsp;
            <span className="tm-velocity-val" style={{ color: '#ffcc00' }}>►► 2026</span>
          </p>
        </div>
      )}

      {/* VHS HUD corners */}
      <span className="tm-hud tm-hud-tl">●REC</span>
      <span className="tm-hud tm-hud-tr">WIN XP●</span>
      <span className="tm-hud tm-hud-bl">00:00:00</span>
      <span className="tm-hud tm-hud-br">XP●</span>
    </div>
  );
}
