'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

type Phase = 'idle' | 'boot' | 'flash';

export default function TimeMachine() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [overlayOpacity, setOverlayOpacity] = useState(1);

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const phaseRef = useRef<Phase>('idle');

  const schedule = (fn: () => void, ms: number) => {
    timersRef.current.push(setTimeout(fn, ms));
  };

  const clearAll = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  const setP = (p: Phase) => {
    setPhase(p);
    phaseRef.current = p;
  };

  // ── Audio — Windows 98 startup chime ────────────────────────────────
  const playBootAudio = () => {
    try {
      const audioCtx = new AudioContext();
      const t = audioCtx.currentTime;

      const tone = (freq: number, start: number, end: number, vol = 0.07) => {
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.type = 'sine';
        o.frequency.value = freq;
        o.connect(g); g.connect(audioCtx.destination);
        g.gain.setValueAtTime(0.001, start);
        g.gain.linearRampToValueAtTime(vol, start + 0.03);
        g.gain.exponentialRampToValueAtTime(0.001, end);
        o.start(start); o.stop(end + 0.05);
      };

      // Windows-style ascending startup chord
      [392.0, 523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const s = t + i * 0.09;
        tone(freq, s, s + 0.9, 0.07);
      });

      setTimeout(() => audioCtx.close(), 3000);
    } catch { /* AudioContext blocked */ }
  };

  const playDeactivateAudio = () => {
    try {
      const audioCtx = new AudioContext();
      const t = audioCtx.currentTime;
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(1400, t);
      o.frequency.exponentialRampToValueAtTime(80, t + 0.6);
      o.connect(g); g.connect(audioCtx.destination);
      g.gain.setValueAtTime(0.07, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
      o.start(t); o.stop(t + 0.65);
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
    setP('boot');
    playBootAudio();

    schedule(() => {
      document.documentElement.classList.add('retro');
      setP('flash');
    }, 2800);

    schedule(() => setOverlayOpacity(0), 3000);
    schedule(() => setP('idle'), 3800);
  }, []);

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

  useEffect(() => () => clearAll(), []);

  if (phase === 'idle') return null;

  return (
    <div
      className="tm-overlay"
      style={{ opacity: overlayOpacity, transition: 'opacity 0.7s ease' }}
    >
      {/* CRT scanlines */}
      <div className="tm-scanlines" />

      {/* Win98 boot screen */}
      {(phase === 'boot' || phase === 'flash') && (
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

      {/* VHS HUD corners */}
      <span className="tm-hud tm-hud-tl">●REC</span>
      <span className="tm-hud tm-hud-tr">WIN98●</span>
      <span className="tm-hud tm-hud-bl">00:00:00</span>
      <span className="tm-hud tm-hud-br">AOL●</span>
    </div>
  );
}
