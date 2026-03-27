'use client';

import { useState, useEffect, useRef } from 'react';

const PLAYLIST = [
  {
    title: 'BAD HABIT (FEAT. ZAUG)',
    artist: 'ZAUG, JÉJA',
    src: `/audio/${encodeURIComponent('Zaug, Jéja - Bad Habit (feat. Zaug) [NCS Release].mp3')}`,
  },
];

const EQ_ANIMS = ['wmp-eq-a', 'wmp-eq-b', 'wmp-eq-c', 'wmp-eq-d', 'wmp-eq-e'];

function WmpOrb() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <defs>
        <radialGradient id="wmp-orb" cx="38%" cy="32%" r="65%">
          <stop offset="0%"   stopColor="#6ec8f0" />
          <stop offset="55%"  stopColor="#1a72d4" />
          <stop offset="100%" stopColor="#082888" />
        </radialGradient>
      </defs>
      <circle cx="8" cy="8" r="7.2" fill="url(#wmp-orb)" stroke="#0a2060" strokeWidth="0.6" />
      <polygon points="6.2,4.8 12,8 6.2,11.2" fill="white" opacity="0.92" />
    </svg>
  );
}

export default function RetroMusic() {
  const [isRetro, setIsRetro]     = useState(false);
  const [playing, setPlaying]     = useState(false);
  const [paused, setPaused]       = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [elapsed, setElapsed]     = useState(0);
  const [volume, setVolume]       = useState(75);
  const [trackIdx]                = useState(0);

  const audioRef      = useRef<HTMLAudioElement | null>(null);
  const elapsedIntRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const check = () => setIsRetro(document.documentElement.classList.contains('retro'));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => { if (!isRetro) stopMusic(); }, [isRetro]);
  useEffect(() => () => stopMusic(), []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
  }, [volume]);

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
    <div className="wmp-wrap">

      {/* ── Title bar ─────────────────────────────── */}
      <div className="wmp-titlebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <WmpOrb />
          <span className="wmp-title-text">Windows Media Player</span>
        </div>
        <div className="aim-winbtns">
          <button className="aim-wbtn" onClick={() => setMinimized(m => !m)} title={minimized ? 'Restore' : 'Minimize'}>_</button>
          <button className="aim-wbtn">□</button>
          <button className="aim-wbtn aim-wbtn-close" onClick={stopMusic} title="Close">×</button>
        </div>
      </div>

      {!minimized && (
        <>
          {/* ── Menu bar ──────────────────────────── */}
          <div className="wmp-menubar">
            {['File','View','Play','Tools','Help'].map(m => (
              <span key={m} className="rd-br-menu-item">{m}</span>
            ))}
          </div>

          {/* ── Visualization area ────────────────── */}
          <div className="wmp-viz">
            <div className="wmp-eq-wrap">
              {Array.from({ length: 18 }).map((_, i) => (
                <div
                  key={i}
                  className={`wmp-bar${playing && !paused ? ' wmp-bar-play' : ''}`}
                  style={{
                    animationName: playing && !paused ? EQ_ANIMS[i % 5] : 'none',
                    animationDelay: `${i * 0.09}s`,
                  }}
                />
              ))}
            </div>
            <div className="wmp-viz-info">
              {playing
                ? <><span className="wmp-viz-title">{track.title}</span><span className="wmp-viz-artist">{track.artist}</span></>
                : <span className="wmp-viz-title wmp-viz-idle">No media playing</span>
              }
            </div>
          </div>

          {/* ── Seek bar ──────────────────────────── */}
          <div className="wmp-seek-row">
            <span className="wmp-time">{formatTime(elapsed)}</span>
            <div className="wmp-seekbar">
              <div className="wmp-seekbar-fill" style={{ width: playing ? '40%' : '0%' }} />
              {playing && <div className="wmp-seekbar-thumb" style={{ left: '40%' }} />}
            </div>
            <span className="wmp-time">3:28</span>
          </div>

          {/* ── Transport + volume ────────────────── */}
          <div className="wmp-controls">
            <div className="wmp-transport">
              <button className="wmp-btn" disabled title="Previous">⏮</button>
              <button className="wmp-btn" disabled title="Rewind">⏪</button>
              {playing && !paused ? (
                <button className="wmp-btn wmp-btn-play" onClick={pauseMusic} title="Pause">⏸</button>
              ) : paused ? (
                <button className="wmp-btn wmp-btn-play" onClick={resumeMusic} title="Resume">▶</button>
              ) : (
                <button className="wmp-btn wmp-btn-play" onClick={startMusic} title="Play">▶</button>
              )}
              <button className="wmp-btn" onClick={stopMusic} disabled={!playing} title="Stop">⏹</button>
              <button className="wmp-btn" disabled title="Fast Forward">⏩</button>
              <button className="wmp-btn" disabled title="Next">⏭</button>
            </div>
            <div className="wmp-vol-row">
              <span className="wmp-vol-icon">🔊</span>
              <input
                type="range" min={0} max={100} value={volume}
                onChange={e => setVolume(Number(e.target.value))}
                className="wmp-vol-slider"
              />
            </div>
          </div>

          {/* ── Status bar ────────────────────────── */}
          <div className="wmp-status">
            <span>128 kbps · 44100 Hz · Stereo</span>
            <span className="wmp-status-state">
              {playing && !paused ? '▶ Playing' : paused ? '⏸ Paused' : '⏹ Stopped'}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
