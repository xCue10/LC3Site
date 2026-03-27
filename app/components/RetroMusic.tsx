'use client';

import { useState, useEffect, useRef } from 'react';

// ── Note frequencies (Hz) ────────────────────────────────────────────
const F: Record<string, number> = {
  A2: 110.00, C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61,
  G3: 196.00, A3: 220.00, Bb3: 233.08, B3: 246.94,
  C4: 261.63, D4: 293.66, Eb4: 311.13, E4: 329.63, F4: 349.23,
  G4: 392.00, Ab4: 415.30, A4: 440.00, Bb4: 466.16, B4: 493.88,
  C5: 523.25, D5: 587.33, Eb5: 622.25, E5: 659.25, F5: 698.46,
  G5: 783.99, A5: 880.00,
  R: 0,
};

const B = 0.79;
const q  = B;
const h  = B * 2;
const dh = B * 3;
const w  = B * 4;

const MELODY: [string, number][] = [
  ['R', h], ['R', h], ['R', h], ['R', h],
  ['A4', h], ['G4', q], ['F4', q],
  ['E4', dh], ['D4', q],
  ['C4', q], ['D4', q], ['E4', q], ['F4', q],
  ['E4', h], ['D4', h],
  ['A3', w],
  ['A4', h], ['Bb4', q], ['A4', q],
  ['G4', dh], ['F4', q],
  ['E4', q], ['F4', q], ['G4', q], ['A4', q],
  ['G4', h], ['F4', h],
  ['E4', w],
  ['C5', h], ['D5', q], ['C5', q],
  ['B4', dh], ['A4', q],
  ['G4', q], ['A4', q], ['B4', q], ['C5', q],
  ['B4', h], ['A4', h],
  ['A4', w],
  ['E5', h], ['D5', q], ['C5', q],
  ['B4', h], ['A4', h],
  ['G4', q], ['A4', q], ['B4', q], ['A4', q],
  ['G4', h], ['F4', h],
  ['E4', w],
  ['A4', h], ['G4', q], ['F4', q],
  ['E4', dh], ['D4', q],
  ['C4', q], ['D4', q], ['E4', q], ['F4', q],
  ['E4', h], ['D4', h],
  ['A3', w],
  ['C4', h], ['D4', h],
  ['E4', h], ['F4', h],
  ['E4', dh], ['D4', q],
  ['A3', w],
  ['R', w],
];

const PLAYLIST = [
  { title: 'AQUATIC AMBIENCE', artist: 'DAVID WISE' },
];

const EQ_ANIMS = ['wp-eq-a', 'wp-eq-b', 'wp-eq-c', 'wp-eq-d', 'wp-eq-e'];

export default function RetroMusic() {
  const [isRetro, setIsRetro]     = useState(false);
  const [playing, setPlaying]     = useState(false);
  const [paused, setPaused]       = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [elapsed, setElapsed]     = useState(0);
  const [volume, setVolume]       = useState(75);
  const [trackIdx]                = useState(0);

  const ctxRef         = useRef<AudioContext | null>(null);
  const timerRef       = useRef<ReturnType<typeof setTimeout> | null>(null);
  const playingRef     = useRef(false);
  const idxRef         = useRef(0);
  const schedTimeRef   = useRef(0);
  const masterGainRef  = useRef<GainNode | null>(null);
  const elapsedIntRef  = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Watch retro class ──────────────────────────────────────────────
  useEffect(() => {
    const check = () => setIsRetro(document.documentElement.classList.contains('retro'));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  // ── Volume → master gain ───────────────────────────────────────────
  useEffect(() => {
    if (masterGainRef.current) {
      masterGainRef.current.gain.linearRampToValueAtTime(
        volume / 100,
        (ctxRef.current?.currentTime ?? 0) + 0.05,
      );
    }
  }, [volume]);

  // ── Helpers ────────────────────────────────────────────────────────
  const stopElapsedTimer = () => {
    if (elapsedIntRef.current) { clearInterval(elapsedIntRef.current); elapsedIntRef.current = null; }
  };

  const startElapsedTimer = () => {
    stopElapsedTimer();
    elapsedIntRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
  };

  const stopMusic = () => {
    playingRef.current = false;
    if (timerRef.current) clearTimeout(timerRef.current);
    ctxRef.current?.close();
    ctxRef.current = null;
    masterGainRef.current = null;
    stopElapsedTimer();
    setElapsed(0);
    setPlaying(false);
    setPaused(false);
  };

  const pauseMusic = () => {
    ctxRef.current?.suspend();
    stopElapsedTimer();
    setPaused(true);
  };

  const resumeMusic = () => {
    ctxRef.current?.resume();
    startElapsedTimer();
    setPaused(false);
  };

  const playNoteAt = (
    freq: number, startTime: number, duration: number,
    ctx: AudioContext, reverbInput: AudioNode, master: GainNode,
  ) => {
    if (!freq) return;
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    const dry  = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    osc.connect(gain);
    gain.connect(dry);
    gain.connect(reverbInput);
    dry.connect(master);
    dry.gain.value = 0.55;
    const attack  = 0.08;
    const release = Math.min(0.45, duration * 0.35);
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.13, startTime + attack);
    gain.gain.setValueAtTime(0.13, Math.max(startTime + attack, startTime + duration - release));
    gain.gain.linearRampToValueAtTime(0, startTime + duration);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.1);
  };

  const startMusic = () => {
    ctxRef.current?.close();
    const ctx = new AudioContext();
    const master = ctx.createGain();
    master.gain.value = volume / 100;
    master.connect(ctx.destination);
    masterGainRef.current = master;
    ctxRef.current = ctx;
    playingRef.current = true;
    idxRef.current = 0;
    setElapsed(0);
    setPlaying(true);
    setPaused(false);
    startElapsedTimer();

    const delay    = ctx.createDelay(2.0);
    const feedback = ctx.createGain();
    const wetGain  = ctx.createGain();
    delay.delayTime.value = 0.32;
    feedback.gain.value   = 0.38;
    wetGain.gain.value    = 0.42;
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(wetGain);
    wetGain.connect(master);

    schedTimeRef.current = ctx.currentTime + 0.05;

    const scheduleNext = () => {
      if (!playingRef.current) return;
      const [note, dur] = MELODY[idxRef.current];
      playNoteAt(F[note] ?? 0, schedTimeRef.current, dur, ctx, delay, master);
      schedTimeRef.current += dur;
      idxRef.current = (idxRef.current + 1) % MELODY.length;
      const msUntilNext = (schedTimeRef.current - ctx.currentTime - 0.1) * 1000;
      timerRef.current = setTimeout(scheduleNext, Math.max(0, msUntilNext));
    };

    scheduleNext();
  };

  useEffect(() => { if (!isRetro) stopMusic(); }, [isRetro]);
  useEffect(() => () => { stopMusic(); }, []);

  const formatTime = (s: number) => {
    const m   = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const track = PLAYLIST[trackIdx];

  if (!isRetro) return null;

  return (
    <div className="wp-wrap">

      {/* ── Title bar ─────────────────────────────────── */}
      <div className="wp-titlebar">
        <span className="wp-title-text">≋ WINAMP</span>
        <div className="wp-winbtns">
          <button className="wp-wbtn" onClick={() => setMinimized(m => !m)} title={minimized ? 'Restore' : 'Minimize'}>
            {minimized ? '▲' : '_'}
          </button>
          <button className="wp-wbtn wp-wbtn-close" onClick={stopMusic} title="Stop">×</button>
        </div>
      </div>

      {!minimized && (
        <>
          {/* ── LED display ───────────────────────────── */}
          <div className="wp-display">
            <div className="wp-marquee-wrap">
              <span className={`wp-marquee${playing && !paused ? ' wp-marquee-anim' : ''}`}>
                {playing
                  ? `♫  ${track.title} — ${track.artist}  ♫  ${track.title} — ${track.artist}  `
                  : `— WINAMP 2.9 —   LC3 RETRO RADIO   — WINAMP 2.9 —   LC3 RETRO RADIO   `}
              </span>
            </div>
            <div className="wp-info-row">
              <span className="wp-elapsed">{formatTime(elapsed)}</span>
              <span className="wp-status-dot">
                {playing && !paused ? '▶ PLAYING' : paused ? '❚❚ PAUSED' : '■ STOPPED'}
              </span>
              <span className="wp-kbps">128 kbps</span>
            </div>
          </div>

          {/* ── EQ visualizer bars ────────────────────── */}
          <div className="wp-eq-wrap">
            {Array.from({ length: 14 }).map((_, i) => (
              <div
                key={i}
                className={`wp-bar${playing && !paused ? ' wp-bar-play' : ''}`}
                style={{
                  animationName: playing && !paused ? EQ_ANIMS[i % 5] : 'none',
                  animationDelay: `${i * 0.11}s`,
                }}
              />
            ))}
          </div>

          {/* ── Volume row ────────────────────────────── */}
          <div className="wp-vol-row">
            <span className="wp-vol-label">VOL</span>
            <input
              type="range" min={0} max={100} value={volume}
              onChange={e => setVolume(Number(e.target.value))}
              className="wp-slider"
            />
            <span className="wp-vol-val">{volume}%</span>
          </div>

          {/* ── Transport buttons ─────────────────────── */}
          <div className="wp-transport">
            <button className="wp-btn" title="Previous" disabled>⏮</button>
            {playing && !paused ? (
              <button className="wp-btn wp-btn-active" onClick={pauseMusic} title="Pause">❚❚</button>
            ) : paused ? (
              <button className="wp-btn wp-btn-active" onClick={resumeMusic} title="Resume">▶</button>
            ) : (
              <button className="wp-btn" onClick={startMusic} title="Play">▶</button>
            )}
            <button className="wp-btn" onClick={stopMusic} title="Stop" disabled={!playing}>⏹</button>
            <button className="wp-btn" title="Next" disabled>⏭</button>
          </div>

          {/* ── Playlist strip ────────────────────────── */}
          <div className="wp-playlist">
            {PLAYLIST.map((t, i) => (
              <div key={i} className={`wp-pl-item${i === trackIdx ? ' wp-pl-active' : ''}`}>
                <span className="wp-pl-num">{i + 1}.</span>
                <span className="wp-pl-title">{t.title} — {t.artist}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
