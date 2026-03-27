'use client';

import { useState, useEffect, useRef } from 'react';

const TIPS = [
  "It looks like you're visiting\na website. Would you like help?",
  "Did you know? LC3 hosts events\nfor cloud computing enthusiasts!",
  "It looks like you might want\nto join a club. I can help!",
  "Tip: The Shield tool can scan\nyour site for vulnerabilities!",
  "Have you checked out our\nCareers board? Hot cloud jobs await!",
  "It looks like you're interested\nin technology. Join LC3 today!",
  "Did you know? You can reach\nLC3 from the Contact page!",
];

function ClippySVG() {
  return (
    <svg width="52" height="68" viewBox="0 0 52 68" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Paperclip wire */}
      <path
        d="M14,62 Q9,62 9,54 L9,16 Q9,4 22,4 Q35,4 35,16 L35,54 Q35,66 22,66 Q11,66 11,56 L11,18 Q11,11 22,11 Q31,11 31,18 L31,52"
        stroke="#b8860b" strokeWidth="5" strokeLinecap="round"
      />
      {/* Eye whites */}
      <ellipse cx="18" cy="36" rx="4.5" ry="5.5" fill="white" stroke="#aaa" strokeWidth="0.8" />
      <ellipse cx="29" cy="36" rx="4.5" ry="5.5" fill="white" stroke="#aaa" strokeWidth="0.8" />
      {/* Pupils */}
      <circle cx="19" cy="37" r="2.2" fill="#1a1a1a" />
      <circle cx="30" cy="37" r="2.2" fill="#1a1a1a" />
      {/* Highlights */}
      <circle cx="20" cy="36" r="0.8" fill="white" />
      <circle cx="31" cy="36" r="0.8" fill="white" />
      {/* Eyebrows */}
      <path d="M15,30 Q18,28 21,30" stroke="#777" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M26,30 Q29,28 32,30" stroke="#777" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function Clippy() {
  const [isRetro, setIsRetro] = useState(false);
  const [visible, setVisible] = useState(false);
  const [bubbleOpen, setBubbleOpen] = useState(true);
  const [tipIndex, setTipIndex] = useState(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const tipTimer = useRef<ReturnType<typeof setInterval>>(undefined);

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
      clearTimeout(hideTimer.current);
      clearInterval(tipTimer.current);
      return;
    }
    hideTimer.current = setTimeout(() => {
      setVisible(true);
      setBubbleOpen(true);
      setTipIndex(0);
    }, 5000);
    return () => {
      clearTimeout(hideTimer.current);
      clearInterval(tipTimer.current);
    };
  }, [isRetro]);

  useEffect(() => {
    if (!visible) return;
    tipTimer.current = setInterval(() => {
      setTipIndex(i => (i + 1) % TIPS.length);
      setBubbleOpen(true);
    }, 9000);
    return () => clearInterval(tipTimer.current);
  }, [visible]);

  const handleDismiss = () => {
    setVisible(false);
    hideTimer.current = setTimeout(() => {
      setVisible(true);
      setBubbleOpen(true);
    }, 30000);
  };

  if (!isRetro || !visible) return null;

  const tipLines = TIPS[tipIndex].split('\n');

  return (
    <div className="clippy-wrap">
      {bubbleOpen && (
        <div className="clippy-bubble">
          <button className="clippy-bubble-close" onClick={() => setBubbleOpen(false)}>×</button>
          {tipLines.map((line, i) => <p key={i}>{line}</p>)}
          <div className="clippy-bubble-btns">
            <button className="clippy-btn" onClick={() => setBubbleOpen(false)}>OK</button>
            <button className="clippy-btn" onClick={() => { setTipIndex(i => (i + 1) % TIPS.length); }}>Cancel</button>
          </div>
        </div>
      )}
      <div className="clippy-body" onClick={() => setBubbleOpen(b => !b)} title="Clippy — Click for help">
        <ClippySVG />
        <button
          className="clippy-dismiss"
          onClick={e => { e.stopPropagation(); handleDismiss(); }}
          title="Dismiss"
        >×</button>
      </div>
    </div>
  );
}
