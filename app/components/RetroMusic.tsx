'use client';

import { useState, useEffect, useRef } from 'react';

// Note frequencies (Hz)
const F: Record<string, number> = {
  A2: 110.00, C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61,
  G3: 196.00, A3: 220.00, Bb3: 233.08, B3: 246.94,
  C4: 261.63, D4: 293.66, Eb4: 311.13, E4: 329.63, F4: 349.23,
  G4: 392.00, Ab4: 415.30, A4: 440.00, Bb4: 466.16, B4: 493.88,
  C5: 523.25, D5: 587.33, Eb5: 622.25, E5: 659.25, F5: 698.46,
  G5: 783.99, A5: 880.00,
  R: 0,
};

// ~76 BPM — beat duration in seconds
const B = 0.79;
const q  = B;        // quarter note
const h  = B * 2;    // half note
const dh = B * 3;    // dotted half
const w  = B * 4;    // whole note
const e  = B / 2;    // eighth note

// Aquatic Ambience (David Wise / DKC) — melody approximation
// [note, duration_seconds]
const MELODY: [string, number][] = [
  // Intro — sparse, let reverb breathe
  ['R', h], ['R', h],
  ['R', h], ['R', h],

  // Phrase A
  ['A4', h],  ['G4', q],  ['F4', q],
  ['E4', dh], ['D4', q],
  ['C4', q],  ['D4', q],  ['E4', q], ['F4', q],
  ['E4', h],  ['D4', h],
  ['A3', w],

  // Phrase A'
  ['A4', h],  ['Bb4', q], ['A4', q],
  ['G4', dh], ['F4', q],
  ['E4', q],  ['F4', q],  ['G4', q], ['A4', q],
  ['G4', h],  ['F4', h],
  ['E4', w],

  // Phrase B — rises
  ['C5', h],  ['D5', q],  ['C5', q],
  ['B4', dh], ['A4', q],
  ['G4', q],  ['A4', q],  ['B4', q], ['C5', q],
  ['B4', h],  ['A4', h],
  ['A4', w],

  // Phrase C — high floats
  ['E5', h],  ['D5', q],  ['C5', q],
  ['B4', h],  ['A4', h],
  ['G4', q],  ['A4', q],  ['B4', q], ['A4', q],
  ['G4', h],  ['F4', h],
  ['E4', w],

  // Return A
  ['A4', h],  ['G4', q],  ['F4', q],
  ['E4', dh], ['D4', q],
  ['C4', q],  ['D4', q],  ['E4', q], ['F4', q],
  ['E4', h],  ['D4', h],
  ['A3', w],

  // Fade phrase
  ['C4', h],  ['D4', h],
  ['E4', h],  ['F4', h],
  ['E4', dh], ['D4', q],
  ['A3', w],
  ['R', w],
];

export default function RetroMusic() {
  const [isRetro, setIsRetro] = useState(false);
  const [playing, setPlaying] = useState(false);

  const ctxRef       = useRef<AudioContext | null>(null);
  const timerRef     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const playingRef   = useRef(false);
  const idxRef       = useRef(0);
  const schedTimeRef = useRef(0); // AudioContext time of next note start

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

  const playNoteAt = (
    freq: number,
    startTime: number,
    duration: number,
    ctx: AudioContext,
    reverbInput: AudioNode,
  ) => {
    if (!freq) return;

    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    const dry  = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = freq;
    osc.connect(gain);
    gain.connect(dry);
    gain.connect(reverbInput); // wet signal into reverb
    dry.connect(ctx.destination);

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
    ctxRef.current = ctx;
    playingRef.current = true;
    idxRef.current = 0;
    setPlaying(true);

    // Simple reverb via feedback delay
    const delay    = ctx.createDelay(2.0);
    const feedback = ctx.createGain();
    const wetGain  = ctx.createGain();
    delay.delayTime.value = 0.32;
    feedback.gain.value   = 0.38;
    wetGain.gain.value    = 0.42;
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(wetGain);
    wetGain.connect(ctx.destination);

    schedTimeRef.current = ctx.currentTime + 0.05;

    const scheduleNext = () => {
      if (!playingRef.current) return;

      const [note, dur] = MELODY[idxRef.current];
      playNoteAt(F[note] ?? 0, schedTimeRef.current, dur, ctx, delay);
      schedTimeRef.current += dur;
      idxRef.current = (idxRef.current + 1) % MELODY.length;

      // Fire callback ~100ms before the next note is due
      const msUntilNext = (schedTimeRef.current - ctx.currentTime - 0.1) * 1000;
      timerRef.current = setTimeout(scheduleNext, Math.max(0, msUntilNext));
    };

    scheduleNext();
  };

  useEffect(() => { if (!isRetro) stopMusic(); }, [isRetro]);
  useEffect(() => () => stopMusic(), []);

  if (!isRetro) return null;

  return (
    <div className="retro-player-wrap fixed bottom-4 right-4 z-[9997] flex flex-col items-end gap-2 pointer-events-auto">
      <button
        onClick={() => playing ? stopMusic() : startMusic()}
        className="retro-music-btn"
        title={playing ? 'Stop music' : 'Play Aquatic Ambience ♪'}
      >
        {playing ? '■ STOP' : '▶ MUSIC'}
      </button>
      {playing && (
        <div className="retro-music-label">♫ AQUATIC AMBIENCE ♫</div>
      )}
    </div>
  );
}
