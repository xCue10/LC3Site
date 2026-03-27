'use client';

import { useState, useEffect, useRef } from 'react';

const PLAYLIST = [
  {
    title: 'BAD HABIT (FEAT. ZAUG)',
    artist: 'ZAUG, JÉJA',
    src: `/audio/${encodeURIComponent('Zaug, Jéja - Bad Habit (feat. Zaug) [NCS Release].mp3')}`,
  },
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

  const audioRef       = useRef<HTMLAudioElement | null>(null);
  const elapsedIntRef  = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Watch retro class ──────────────────────────────────────────────
  useEffect(() => {
    const check = () => setIsRetro(document.documentElement.classList.contains('retro'));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  // ── Stop when retro mode exits ─────────────────────────────────────
  useEffect(() => { if (!isRetro) stopMusic(); }, [isRetro]);
  useEffect(() => () => stopMusic(), []);

  // ── Volume → audio element ─────────────────────────────────────────
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
  }, [volume]);

  // ── Helpers ────────────────────────────────────────────────────────
  const stopElapsedTimer = () => {
    if (elapsedIntRef.current) { clearInterval(elapsedIntRef.current); elapsedIntRef.current = null; }
  };

  const startElapsedTimer = () => {
    stopElapsedTimer();
    elapsedIntRef.current = setInterval(() => {
      setElapsed(Math.floor(audioRef.current?.currentTime ?? 0));
    }, 500);
  };

  const stopMusic = () => {
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.currentTime = 0;
    audioRef.current = null;
    stopElapsedTimer();
    setElapsed(0);
    setPlaying(false);
    setPaused(false);
  };

  const pauseMusic = () => {
    audioRef.current?.pause();
    stopElapsedTimer();
    setPaused(true);
  };

  const resumeMusic = () => {
    audioRef.current?.play();
    startElapsedTimer();
    setPaused(false);
  };

  const startMusic = () => {
    stopMusic();
    const audio = new Audio(PLAYLIST[trackIdx].src);
    audio.volume = volume / 100;
    audio.loop = true;
    audio.play().catch((err) => console.error('[LC3 Music] play failed:', err));
    audioRef.current = audio;
    setElapsed(0);
    setPlaying(true);
    setPaused(false);
    startElapsedTimer();
  };

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
        <span className="wp-title-text">♫ LC3 MUSIC</span>
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
                  : `— LC3 MUSIC —   SELECT A TRACK   — LC3 MUSIC —   SELECT A TRACK   `}
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
