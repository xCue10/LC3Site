'use client';

import { useState, useEffect, useRef } from 'react';

interface Line {
  msg: string;
  yesLabel: string;
  noLabel: string;
  yesKey: string;
}

const LINES: Line[] = [
  {
    msg: "Hi! I'm BonziBuddy!\nWant me to optimize your\nPC for FREE?",
    yesLabel: "Sure!",
    noLabel: "No thanks",
    yesKey: "optimize",
  },
  {
    msg: "Your PC may be running\nSLOW. I can fix that\nin ONE click!",
    yesLabel: "Yes please!",
    noLabel: "Dismiss",
    yesKey: "speedup",
  },
  {
    msg: "Want me to read this\nwebpage to you?\nI have a GREAT voice!",
    yesLabel: "Read it!",
    noLabel: "No",
    yesKey: "read",
  },
  {
    msg: "FREE screensavers,\nringtones & wallpapers!\nWant some?",
    yesLabel: "FREE?! YES!",
    noLabel: "No",
    yesKey: "freestuff",
  },
  {
    msg: "BonziBuddy collects\nZERO personal data.\nTrust me! :)",
    yesLabel: "I trust you!",
    noLabel: "Sure...",
    yesKey: "trust",
  },
];

const YES_RESPONSES: Record<string, string> = {
  optimize: "Scanning... 4,712 errors found!\nInstalling BonziClean Pro...\nPC is now 0.3% faster! ✓",
  speedup: "Downloading SpeedMax99.exe...\nAlso installing: MyWebSearch,\nHotBar & iLivid Downloader.",
  freestuff: "Downloading 893 screensavers...\nNote: also installs AskBar,\nZango & WeatherBug. Enjoy!",
  trust: "Great! (Uploading browsing\nhistory to BonziServers...)\nHave a nice day! :)",
};

function BonziSVG() {
  return (
    <svg
      width="78"
      height="92"
      viewBox="0 0 78 92"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="bonzi-gorilla"
    >
      {/* Body */}
      <ellipse cx="39" cy="70" rx="24" ry="20" fill="#7920a0" />
      {/* Left arm */}
      <path d="M15,60 Q3,70 9,84" stroke="#7920a0" strokeWidth="12" strokeLinecap="round" fill="none" />
      {/* Right arm */}
      <path d="M63,60 Q75,70 69,84" stroke="#7920a0" strokeWidth="12" strokeLinecap="round" fill="none" />
      {/* Left hand */}
      <ellipse cx="9" cy="85" rx="7" ry="5" fill="#5a1080" />
      {/* Right hand */}
      <ellipse cx="69" cy="85" rx="7" ry="5" fill="#5a1080" />
      {/* Belly lighter patch */}
      <ellipse cx="39" cy="70" rx="15" ry="13" fill="#9e38c0" />
      {/* Left ear */}
      <ellipse cx="16" cy="36" rx="9" ry="10" fill="#8b28b8" />
      <ellipse cx="16" cy="36" rx="5.5" ry="6.5" fill="#6a1898" />
      {/* Right ear */}
      <ellipse cx="62" cy="36" rx="9" ry="10" fill="#8b28b8" />
      <ellipse cx="62" cy="36" rx="5.5" ry="6.5" fill="#6a1898" />
      {/* Head */}
      <ellipse cx="39" cy="34" rx="23" ry="22" fill="#8b28b8" />
      {/* Dark face / muzzle */}
      <ellipse cx="39" cy="40" rx="15" ry="14" fill="#1e0830" />
      {/* Eye whites */}
      <ellipse cx="32" cy="28" rx="5.5" ry="6" fill="white" />
      <ellipse cx="46" cy="28" rx="5.5" ry="6" fill="white" />
      {/* Pupils */}
      <circle cx="33" cy="29" r="3.2" fill="#111" />
      <circle cx="47" cy="29" r="3.2" fill="#111" />
      {/* Eye highlights */}
      <circle cx="34.5" cy="27.5" r="1.3" fill="white" />
      <circle cx="48.5" cy="27.5" r="1.3" fill="white" />
      {/* Eyebrows */}
      <path d="M28,22 Q32,19 36,22" stroke="#5a1080" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M42,22 Q46,19 50,22" stroke="#5a1080" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Nostrils */}
      <ellipse cx="36" cy="41" rx="2.8" ry="2" fill="#0d0010" />
      <ellipse cx="42" cy="41" rx="2.8" ry="2" fill="#0d0010" />
      {/* Smile */}
      <path d="M31,47 Q39,54 47,47" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Teeth */}
      <rect x="35" y="47" width="8" height="4" rx="1" fill="white" />
    </svg>
  );
}

export default function BonziBuddy() {
  const [isRetro, setIsRetro] = useState(false);
  const [visible, setVisible] = useState(false);
  const [lineIdx, setLineIdx] = useState(0);
  const [bubbleOpen, setBubbleOpen] = useState(true);
  const [response, setResponse] = useState<string | null>(null);
  const showTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const cycleTimer = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    const check = () => setIsRetro(document.documentElement.classList.contains('retro'));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!isRetro) {
      setVisible(false);
      clearTimeout(showTimer.current);
      clearInterval(cycleTimer.current);
      return;
    }
    showTimer.current = setTimeout(() => {
      setVisible(true);
      setBubbleOpen(true);
      setLineIdx(0);
      setResponse(null);
    }, 15000);
    return () => {
      clearTimeout(showTimer.current);
      clearInterval(cycleTimer.current);
    };
  }, [isRetro]);

  useEffect(() => {
    if (!visible) return;
    cycleTimer.current = setInterval(() => {
      setLineIdx(i => (i + 1) % LINES.length);
      setBubbleOpen(true);
      setResponse(null);
    }, 12000);
    return () => clearInterval(cycleTimer.current);
  }, [visible]);

  const handleDismiss = () => {
    setVisible(false);
    clearInterval(cycleTimer.current);
    showTimer.current = setTimeout(() => {
      setVisible(true);
      setBubbleOpen(true);
      setLineIdx(i => (i + 1) % LINES.length);
      setResponse(null);
    }, 45000);
  };

  const handleYes = (key: string) => {
    if (key === 'read') {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(
          'Hello! I am Bonzi Buddy! Welcome to the L C 3 club website! ' +
          'This website is best viewed in Internet Explorer 6 at 800 by 600 resolution. ' +
          'Please disable your pop-up blocker for the best experience. ' +
          'Did you know LC3 hosts events for cloud computing enthusiasts? ' +
          'Have you tried downloading our free screensavers? ' +
          'Thank you for using BonziBuddy!'
        );
        utter.pitch = 0.55;
        utter.rate = 0.82;
        window.speechSynthesis.speak(utter);
        setResponse("Reading page aloud...\n(Make sure your speakers\nare turned up!)");
      } else {
        setResponse("Speech not supported.\nPlease try Internet\nExplorer 6!");
      }
      return;
    }
    setResponse(YES_RESPONSES[key] ?? 'Processing...');
  };

  if (!isRetro || !visible) return null;

  const line = LINES[lineIdx];
  const msgLines = (response ?? line.msg).split('\n');

  return (
    <div className="bonzi-wrap">
      {bubbleOpen && (
        <div className="bonzi-bubble">
          <button className="bonzi-bubble-close" onClick={() => setBubbleOpen(false)}>×</button>
          {msgLines.map((l, i) => <p key={i}>{l}</p>)}
          {!response ? (
            <div className="bonzi-bubble-btns">
              <button className="bonzi-btn bonzi-btn-yes" onClick={() => handleYes(line.yesKey)}>
                {line.yesLabel}
              </button>
              <button className="bonzi-btn" onClick={() => setBubbleOpen(false)}>
                {line.noLabel}
              </button>
            </div>
          ) : (
            <div className="bonzi-bubble-btns">
              <button className="bonzi-btn" onClick={() => { setResponse(null); setBubbleOpen(false); }}>
                OK
              </button>
            </div>
          )}
        </div>
      )}
      <div
        className="bonzi-body"
        onClick={() => { setBubbleOpen(b => !b); setResponse(null); }}
        title="BonziBuddy — Click for help"
      >
        <BonziSVG />
        <button
          className="bonzi-dismiss"
          onClick={e => { e.stopPropagation(); handleDismiss(); }}
          title="Dismiss"
        >×</button>
      </div>
    </div>
  );
}
