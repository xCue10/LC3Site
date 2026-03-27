'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

type Phase = 'idle' | 'engage' | 'warp' | 'arrive' | 'flash';

const YEAR_SEQUENCE = [2025, 2020, 2015, 2010, 2005, 2001, 1998, 1995, 1992, 1989];

export default function TimeMachine() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [year, setYear] = useState(2025);
  const [overlayOpacity, setOverlayOpacity] = useState(1);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const warpStartRef = useRef(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const phaseRef = useRef<Phase>('idle');

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

  // ── Warp tunnel canvas ──────────────────────────────────────────────
  const startWarp = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    warpStartRef.current = Date.now();
    const LINES = 180;
    const COLORS = ['#ff1e78', '#00dcff', '#ffffff', '#ffe100', '#cc00ff', '#ffffff'];

    const tick = () => {
      const p = phaseRef.current;
      if (p !== 'warp' && p !== 'arrive') return;

      const elapsed = (Date.now() - warpStartRef.current) / 1000;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      // Fading trail
      ctx.fillStyle = 'rgba(0,0,0,0.22)';
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < LINES; i++) {
        const angle = (i / LINES) * Math.PI * 2;
        const speed = 0.38 + (i % 7) * 0.1;
        const eased = Math.pow(Math.min(elapsed / 2.6, 1), 1.6);
        const baseDist = 8 + (i % 12) * 5;
        const len = (90 + (i % 55) * 13) * speed * eased;

        if (len < 4) continue;

        const x1 = cx + Math.cos(angle) * baseDist;
        const y1 = cy + Math.sin(angle) * baseDist;
        const x2 = cx + Math.cos(angle) * (baseDist + len);
        const y2 = cy + Math.sin(angle) * (baseDist + len);

        const col = COLORS[i % COLORS.length];
        const g = ctx.createLinearGradient(x1, y1, x2, y2);
        g.addColorStop(0, 'transparent');
        g.addColorStop(0.45, col + '66');
        g.addColorStop(1, col);

        ctx.beginPath();
        ctx.strokeStyle = g;
        ctx.lineWidth = 0.4 + (i % 5) * 0.38;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  // ── Audio ───────────────────────────────────────────────────────────
  const playActivateAudio = () => {
    try {
      const audioCtx = new AudioContext();

      // Rising sawtooth warp sweep
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(55, audioCtx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(2400, audioCtx.currentTime + 3.2);
      gain1.gain.setValueAtTime(0.001, audioCtx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.1, audioCtx.currentTime + 0.35);
      gain1.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 3.5);
      osc1.start(audioCtx.currentTime);
      osc1.stop(audioCtx.currentTime + 3.5);

      // Sub-bass rumble
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(45, audioCtx.currentTime);
      osc2.frequency.linearRampToValueAtTime(18, audioCtx.currentTime + 3.5);
      gain2.gain.setValueAtTime(0.001, audioCtx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.2, audioCtx.currentTime + 0.5);
      gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 3.5);
      osc2.start(audioCtx.currentTime);
      osc2.stop(audioCtx.currentTime + 3.5);

      // Arrival power chord (80s synth stab)
      [261.63, 329.63, 392.00, 523.25].forEach((freq, i) => {
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.connect(g);
        g.connect(audioCtx.destination);
        o.type = 'square';
        o.frequency.value = freq;
        g.gain.setValueAtTime(0.001, audioCtx.currentTime + 3.9 + i * 0.04);
        g.gain.exponentialRampToValueAtTime(0.055, audioCtx.currentTime + 4.0);
        g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 5.2);
        o.start(audioCtx.currentTime + 3.9 + i * 0.04);
        o.stop(audioCtx.currentTime + 5.5);
      });

      setTimeout(() => audioCtx.close(), 6000);
    } catch { /* AudioContext blocked */ }
  };

  const playDeactivateAudio = () => {
    try {
      const audioCtx = new AudioContext();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(900, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, audioCtx.currentTime + 0.7);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.7);
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.7);
      setTimeout(() => audioCtx.close(), 2000);
    } catch { /* AudioContext blocked */ }
  };

  // ── Sequences ───────────────────────────────────────────────────────
  const runActivate = useCallback(() => {
    clearAll();
    setOverlayOpacity(1);
    setYear(2025);
    setP('engage');
    playActivateAudio();

    schedule(() => { setP('warp'); startWarp(); }, 1400);

    YEAR_SEQUENCE.forEach((y, i) => {
      schedule(() => setYear(y), 1600 + i * 210);
    });

    schedule(() => setP('arrive'), 3900);

    schedule(() => {
      // Apply retro class right as the flash starts
      document.documentElement.classList.add('retro');
      setP('flash');
    }, 4700);

    schedule(() => setOverlayOpacity(0), 4900);
    schedule(() => setP('idle'), 5800);
  }, [startWarp]);

  const runDeactivate = useCallback(() => {
    clearAll();
    playDeactivateAudio();
    setOverlayOpacity(1);
    setP('flash');

    schedule(() => {
      document.documentElement.classList.remove('retro');
      // Restore dark mode if it was active before retro
      if (localStorage.getItem('lc3-dark') === 'true') {
        document.documentElement.classList.add('dark');
      }
      setOverlayOpacity(0);
    }, 600);

    schedule(() => setP('idle'), 1400);
  }, []);

  useEffect(() => {
    const onActivate = () => runActivate();
    const onDeactivate = () => runDeactivate();
    window.addEventListener('retro-activate', onActivate);
    window.addEventListener('retro-deactivate', onDeactivate);
    return () => {
      window.removeEventListener('retro-activate', onActivate);
      window.removeEventListener('retro-deactivate', onDeactivate);
    };
  }, [runActivate, runDeactivate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => () => clearAll(), []);

  if (phase === 'idle') return null;

  return (
    <div
      className="tm-overlay"
      style={{ opacity: overlayOpacity, transition: 'opacity 0.9s ease' }}
    >
      {/* Warp tunnel */}
      <canvas ref={canvasRef} className="tm-canvas" />

      {/* CRT scanlines */}
      <div className="tm-scanlines" />

      {/* VHS chromatic aberration border */}
      <div className="tm-vhs-border" />

      {/* Main content */}
      <div className="tm-content">

        {/* ── Phase: ENGAGE ── */}
        {phase === 'engage' && (
          <div className="tm-engage-wrap">
            <div className="tm-alert-tag">[ SYSTEM ALERT ]</div>
            <h1 className="tm-headline tm-glitch" data-text="TIME DRIVE ENGAGED">
              TIME DRIVE ENGAGED
            </h1>
            <p className="tm-subtext">LOADING TEMPORAL COORDINATES...</p>
            <div className="tm-progress-bar">
              <div className="tm-progress-fill" />
            </div>
            <div className="tm-coord-row">
              <span>25°46′N</span>
              <span className="tm-coord-sep">◆</span>
              <span>80°11′W</span>
            </div>
            <p className="tm-footnote">MIAMI — VICE CITY — 1989</p>
          </div>
        )}

        {/* ── Phase: WARP ── */}
        {phase === 'warp' && (
          <div className="tm-warp-wrap">
            <p className="tm-warp-label">◄◄ TRAVELING BACK IN TIME ◄◄</p>
            <p className="tm-year-caption">CURRENT YEAR</p>
            <div className="tm-year-display" key={year}>{year}</div>
            <p className="tm-velocity">
              TEMPORAL VELOCITY&nbsp;
              <span className="tm-velocity-val">88,000 TU/s</span>
            </p>
          </div>
        )}

        {/* ── Phase: ARRIVE ── */}
        {phase === 'arrive' && (
          <div className="tm-arrive-wrap">
            <p className="tm-arrive-label">✦ DESTINATION REACHED ✦</p>
            <div className="tm-arrived-year">1989</div>
            <p className="tm-welcome-text">WELCOME TO THE 80s</p>
          </div>
        )}

      </div>

      {/* VHS HUD corners */}
      <span className="tm-hud tm-hud-tl">●REC</span>
      <span className="tm-hud tm-hud-tr">VHS●</span>
      <span className="tm-hud tm-hud-bl">00:00:00</span>
      <span className="tm-hud tm-hud-br">HI-FI●</span>
    </div>
  );
}
