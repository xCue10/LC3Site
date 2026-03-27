'use client';

import { useState, useEffect, useRef } from 'react';

const F: Record<string, number> = {
  E4: 329.63, F4: 349.23, G4: 392.00, Ab4: 415.30, A4: 440.00,
  Bb4: 466.16, B4: 493.88,
  C5: 523.25, D5: 587.33, Eb5: 622.25, E5: 659.25,
  F5: 698.46, Gb5: 739.99, G5: 783.99, Ab5: 830.61, A5: 880.00,
  C6: 1046.50, R: 0,
};

// Duration constants (ms) at ~200 BPM
const T16 = 75;   // 16th note
const T8  = 150;  // 8th note
const T4  = 300;  // quarter note
const T4D = 450;  // dotted quarter
const T2  = 600;  // half note
const TRI = 100;  // 8th-note triplet (3 in space of 2)

// Super Mario Bros. Overworld Theme (Koji Kondo) — chiptune synthesis
// [note, duration_ms]
const SONG: [string, number][] = [
  // Intro
  ['E5',T8], ['R',T16], ['E5',T8], ['R',T4],
  ['E5',T8], ['R',T4], ['C5',T8], ['E5',T4],
  ['G5',T2], ['R',T2], ['G4',T2], ['R',T2],
  // A section
  ['C5',T4D], ['R',T8], ['G4',T4], ['R',T4],
  ['E4',T4D], ['R',T8],
  ['A4',T4], ['R',T8], ['B4',T4], ['R',T8],
  ['Bb4',T8], ['R',T8], ['A4',T4],
  ['G4',TRI], ['E5',TRI], ['G5',TRI],
  ['A5',T4D], ['R',T8], ['F5',T4], ['G5',T8],
  ['R',T8], ['E5',T4D], ['R',T8],
  ['C5',T8], ['D5',T8], ['B4',T4D], ['R',T4],
  // A repeat
  ['C5',T4D], ['R',T8], ['G4',T4], ['R',T4],
  ['E4',T4D], ['R',T8],
  ['A4',T4], ['R',T8], ['B4',T4], ['R',T8],
  ['Bb4',T8], ['R',T8], ['A4',T4],
  ['G4',TRI], ['E5',TRI], ['G5',TRI],
  ['A5',T4D], ['R',T8], ['F5',T4], ['G5',T8],
  ['R',T8], ['E5',T4D], ['R',T8],
  ['C5',T8], ['D5',T8], ['B4',T4D], ['R',T4],
  // Bridge B
  ['R',T4], ['G5',T4], ['R',T4], ['Gb5',T4],
  ['R',T4], ['F5',T4], ['R',T4],
  ['Eb5',T4], ['R',T8], ['E5',T4],
  ['R',T8], ['Ab4',T4], ['A4',T4], ['C5',T4],
  ['R',T8], ['A4',T4], ['C5',T4], ['D5',T4],
  ['R',T4], ['G5',T4], ['R',T4], ['Gb5',T4],
  ['R',T4], ['F5',T4], ['R',T4],
  ['Eb5',T4], ['R',T8], ['E5',T4],
  ['R',T8], ['C6',T4], ['R',T8], ['C6',T4], ['R',T8], ['C6',T2],
  // Bridge C
  ['R',T4], ['G5',T4], ['R',T4], ['Gb5',T4],
  ['R',T4], ['F5',T4], ['R',T4],
  ['Eb5',T4], ['R',T8], ['E5',T4],
  ['R',T8], ['Ab4',T4], ['A4',T4], ['C5',T4],
  ['R',T8], ['A4',T4], ['C5',T4], ['D5',T4],
  ['R',T4], ['Eb5',T4], ['R',T4], ['D5',T4],
  ['R',T4D], ['C5',T2+T4], ['R',T2],
];

export default function RetroMusic() {
  const [isRetro, setIsRetro] = useState(false);
  const [playing, setPlaying] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const playingRef = useRef(false);
  const idxRef = useRef(0);

  useEffect(() => {
    const check = () => setIsRetro(document.documentElement.classList.contains('retro'));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  const stopMusic = () => {
    playingRef.current = false;
    if (timerRef.current) clearTimeout(timerRef.current);
    ctxRef.current?.close();
    ctxRef.current = null;
    setPlaying(false);
  };

  const playNote = (freq: number, ms: number, ctx: AudioContext) => {
    if (!freq) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'square';
    osc.frequency.value = freq;
    // Short attack, exponential decay for that punchy chiptune feel
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + ms * 0.85 / 1000);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + ms * 0.9 / 1000);
  };

  const startMusic = () => {
    ctxRef.current?.close();
    const ctx = new AudioContext();
    ctxRef.current = ctx;
    playingRef.current = true;
    idxRef.current = 0;
    setPlaying(true);

    const scheduleNext = () => {
      if (!playingRef.current) return;
      const [note, ms] = SONG[idxRef.current];
      playNote(F[note] ?? 0, ms, ctx);
      idxRef.current = (idxRef.current + 1) % SONG.length;
      timerRef.current = setTimeout(scheduleNext, ms);
    };
    scheduleNext();
  };

  useEffect(() => { if (!isRetro) stopMusic(); }, [isRetro]);
  useEffect(() => () => stopMusic(), []);

  if (!isRetro) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9997] flex flex-col items-end gap-2 pointer-events-auto">
      <button
        onClick={() => playing ? stopMusic() : startMusic()}
        className="retro-music-btn"
        title={playing ? 'Stop 8-bit music' : 'Play Mario theme ♪'}
      >
        {playing ? '■ STOP' : '▶ MUSIC'}
      </button>
      {playing && (
        <div className="retro-music-label">♫ MARIO OVERWORLD ♫</div>
      )}
    </div>
  );
}
