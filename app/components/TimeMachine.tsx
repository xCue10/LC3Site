'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

type Phase = 'idle' | 'engage' | 'warp' | 'arrive' | 'flash';

const YEAR_SEQUENCE = [2025, 2022, 2018, 2015, 2012, 2008, 2005, 2003, 2001, 1998];

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
    const COLORS = ['#00cc44', '#00ccff', '#ffffff', '#0066cc', '#33aaff', '#ffffff'];

    const tick = () => {
      const p = phaseRef.current;
      if (p !== 'warp' && p !== 'arrive') return;

      const elapsed = (Date.now() - warpStartRef.current) / 1000;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      ctx.fillStyle = 'rgba(0,0,0,0.20)';
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

  // ── Audio — dial-up modem ────────────────────────────────────────────
  const playActivateAudio = () => {
    try {
      const audioCtx = new AudioContext();
      const t = audioCtx.currentTime;

      const tone = (freq: number, start: number, end: number, vol = 0.07, type: OscillatorType = 'sine') => {
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.type = type;
        o.frequency.value = freq;
        o.connect(g); g.connect(audioCtx.destination);
        g.gain.setValueAtTime(0.001, start);
        g.gain.linearRampToValueAtTime(vol, start + 0.02);
        g.gain.setValueAtTime(vol, Math.max(start + 0.02, end - 0.02));
        g.gain.linearRampToValueAtTime(0.001, end);
        o.start(start); o.stop(end + 0.05);
      };

      // 1. Dial tone (0.0 – 0.4s)
      tone(440, t, t + 0.35, 0.055);
      tone(350, t, t + 0.35, 0.055);

      // 2. DTMF dialing sequence (0.4 – 1.6s)
      const dtmf: [number, number][] = [
        [697, 1209], [770, 1477], [852, 1336],
        [941, 1209], [770, 1336], [697, 1477],
      ];
      dtmf.forEach(([f1, f2], i) => {
        const s = t + 0.4 + i * 0.2;
        tone(f1, s, s + 0.13, 0.055);
        tone(f2, s, s + 0.13, 0.055);
      });

      // 3. Carrier detect tone (1.7 – 2.4s)
      tone(2100, t + 1.7, t + 2.4, 0.075);

      // 4. Handshake warble (2.4 – 5.0s) — the iconic screech
      const hs = audioCtx.createOscillator();
      const hsg = audioCtx.createGain();
      const mod = audioCtx.createOscillator();
      const modg = audioCtx.createGain();
      mod.frequency.value = 30;
      modg.gain.value = 900;
      mod.connect(modg); modg.connect(hs.frequency);
      hs.type = 'sawtooth';
      hs.frequency.setValueAtTime(1800, t + 2.4);
      hs.frequency.linearRampToValueAtTime(2600, t + 3.5);
      hs.frequency.linearRampToValueAtTime(1400, t + 4.2);
      hs.frequency.linearRampToValueAtTime(2200, t + 5.0);
      hs.connect(hsg); hsg.connect(audioCtx.destination);
      hsg.gain.setValueAtTime(0.001, t + 2.4);
      hsg.gain.linearRampToValueAtTime(0.07, t + 2.6);
      hsg.gain.linearRampToValueAtTime(0.001, t + 5.0);
      mod.start(t + 2.4); mod.stop(t + 5.1);
      hs.start(t + 2.4); hs.stop(t + 5.1);

      // 5. Connection confirmation tones (5.0 – 5.8s)
      tone(3400, t + 5.0, t + 5.4, 0.065);
      tone(2100, t + 5.1, t + 5.8, 0.065);

      // 6. Arrival chime — Windows-style ascending chord (5.9s+)
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.type = 'sine';
        o.frequency.value = freq;
        o.connect(g); g.connect(audioCtx.destination);
        const s = t + 5.9 + i * 0.07;
        g.gain.setValueAtTime(0.001, s);
        g.gain.linearRampToValueAtTime(0.07, s + 0.04);
        g.gain.exponentialRampToValueAtTime(0.001, s + 0.8);
        o.start(s); o.stop(s + 0.9);
      });

      setTimeout(() => audioCtx.close(), 8000);
    } catch { /* AudioContext blocked */ }
  };

  const playDeactivateAudio = () => {
    try {
      const audioCtx = new AudioContext();
      const t = audioCtx.currentTime;
      // Brief modem disconnect static
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(1400, t);
      o.frequency.exponentialRampToValueAtTime(80, t + 0.6);
      o.connect(g); g.connect(audioCtx.destination);
      g.gain.setValueAtTime(0.07, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
      o.start(t); o.stop(t + 0.65);
      // Descending goodbye notes
      [659.25, 523.25, 392.0].forEach((freq, i) => {
        const o2 = audioCtx.createOscillator();
        const g2 = audioCtx.createGain();
        o2.type = 'sine';
        o2.frequency.value = freq;
        o2.connect(g2); g2.connect(audioCtx.destination);
        const s = t + 0.1 + i * 0.14;
        g2.gain.setValueAtTime(0.001, s);
        g2.gain.linearRampToValueAtTime(0.06, s + 0.03);
        g2.gain.exponentialRampToValueAtTime(0.001, s + 0.35);
        o2.start(s); o2.stop(s + 0.4);
      });
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

    // Warp starts after modem dialing begins
    schedule(() => { setP('warp'); startWarp(); }, 1400);

    // Year counter — 10 steps over ~3.8s
    YEAR_SEQUENCE.forEach((y, i) => {
      schedule(() => setYear(y), 1600 + i * 380);
    });

    // Arrive after modem handshake completes (~5.8s audio)
    schedule(() => setP('arrive'), 5400);

    schedule(() => {
      document.documentElement.classList.add('retro');
      setP('flash');
    }, 6400);

    schedule(() => setOverlayOpacity(0), 6600);
    schedule(() => setP('idle'), 7800);
  }, [startWarp]);

  const runDeactivate = useCallback(() => {
    clearAll();
    playDeactivateAudio();
    setOverlayOpacity(1);
    setP('flash');

    schedule(() => {
      document.documentElement.classList.remove('retro');
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
            <div className="tm-alert-tag">[ WINDOWS 98 SE — BUILD 1998 ]</div>
            <h1 className="tm-headline tm-glitch" data-text="LOADING WINDOWS 98">
              LOADING WINDOWS 98
            </h1>
            <p className="tm-subtext">INITIALIZING DIAL-UP MODEM...</p>
            <div className="tm-progress-bar">
              <div className="tm-progress-fill" />
            </div>
            <div className="tm-coord-row">
              <span>WIN 98 SE</span>
              <span className="tm-coord-sep">◆</span>
              <span>56K MODEM</span>
            </div>
            <p className="tm-footnote">AOL INSTANT MESSENGER — 1998</p>
          </div>
        )}

        {/* ── Phase: WARP ── */}
        {phase === 'warp' && (
          <div className="tm-warp-wrap">
            <p className="tm-warp-label">◄◄ DIALING VIA 56K MODEM ◄◄</p>
            <p className="tm-year-caption">CURRENT YEAR</p>
            <div className="tm-year-display" key={year}>{year}</div>
            <p className="tm-velocity">
              BAUD RATE&nbsp;
              <span className="tm-velocity-val">56,600 BPS</span>
            </p>
          </div>
        )}

        {/* ── Phase: ARRIVE — Win98 boot screen ── */}
        {phase === 'arrive' && (
          <div className="tm-win98-boot">
            <div className="tm-win98-logo">
              <div className="tm-win98-squares">
                <span style={{ background: '#ff3333' }} />
                <span style={{ background: '#33cc33' }} />
                <span style={{ background: '#3399ff' }} />
                <span style={{ background: '#ffcc00' }} />
              </div>
              <div className="tm-win98-wordmark">
                <span>Windows</span>
                <em>98</em>
              </div>
            </div>
            <p className="tm-win98-starting">Starting Windows 98...</p>
            <div className="tm-win98-progressrow">
              {[...Array(10)].map((_, i) => (
                <span key={i} className="tm-win98-block" />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* VHS HUD corners */}
      <span className="tm-hud tm-hud-tl">●REC</span>
      <span className="tm-hud tm-hud-tr">WIN98●</span>
      <span className="tm-hud tm-hud-bl">00:00:00</span>
      <span className="tm-hud tm-hud-br">AOL●</span>
    </div>
  );
}
