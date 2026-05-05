import { useState } from 'react';

interface LimeWireProps {
  onClose: () => void;
}

export default function LimeWire({ onClose }: LimeWireProps) {
  const [stage, setStage] = useState<'idle' | 'downloading' | 'done'>('idle');
  const [progress, setProgress] = useState(0);

  const startDownload = () => {
    setStage('downloading');
    let p = 0;
    const interval = setInterval(() => {
      p += Math.floor(Math.random() * 5) + 2;
      if (p >= 100) {
        setProgress(100);
        setStage('done');
        clearInterval(interval);
      } else {
        setProgress(p);
      }
    }, 400);
  };

  return (
    <div className="lw-wrap">
      <div className="lw-titlebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span className="lw-logo-dot" />
          <span className="lw-title-text">LimeWire 4.18.8</span>
        </div>
        <div className="aim-winbtns">
          <button className="aim-wbtn aim-wbtn-min">_</button>
          <button className="aim-wbtn aim-wbtn-close" onClick={onClose}>×</button>
        </div>
      </div>

      <div className="lw-searchbar">
        <input className="lw-search-input" defaultValue="Eminem Lose Yourself" readOnly />
        <button className="lw-search-btn">Search</button>
      </div>

      <div className="lw-results-header">
        <span>Filename</span><span>Size</span><span>Sources</span>
      </div>
      <div className="lw-results">
        <div className="lw-result lw-result-selected">
          <span>🎵 Eminem - Lose Youself (REAL NOT FAKE).mp3</span>
          <span>4.3 MB</span>
          <span className="lw-sources">47</span>
        </div>
        <div className="lw-result">
          <span>🎵 Eminem_Lose_Yourself_FULL_VERSION.mp3<span className="lw-exe-ext">.exe</span></span>
          <span>6.7 MB</span>
          <span className="lw-sources">31</span>
        </div>
        <div className="lw-result">
          <span>🎵 eminem lose yourself (CLEAN RADIO NO VIRUS).mp3</span>
          <span>47.2 MB</span>
          <span className="lw-sources">8</span>
        </div>
        <div className="lw-result">
          <span>🎵 Eminem - Lose Yourself [HQ 128kbps].exe</span>
          <span>2.1 MB</span>
          <span className="lw-sources">19</span>
        </div>
      </div>

      <div className="lw-status-row">
        {stage === 'idle' && (
          <button className="lw-dl-btn" onClick={startDownload}>▼ Download</button>
        )}
        {stage === 'downloading' && (
          <div className="lw-progress-wrap">
            <span className="lw-progress-label">Downloading... {progress}%</span>
            <div className="lw-progress-track">
              <div className="lw-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
        {stage === 'done' && (
          <span className="lw-done-text">✓ Download complete!</span>
        )}
      </div>
    </div>
  );
}
