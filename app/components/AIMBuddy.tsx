'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Member = { id: string; name: string; role?: string; };

function RunningMan({ size = 38 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 42" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <circle cx="22" cy="6" r="5" fill="#FFD700" />
      {/* Body */}
      <line x1="21" y1="11" x2="19" y2="24" stroke="#FFD700" strokeWidth="3" strokeLinecap="round"/>
      {/* Right arm (forward/up) */}
      <line x1="21" y1="15" x2="30" y2="11" stroke="#FFD700" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Left arm (back/down) */}
      <line x1="20" y1="16" x2="10" y2="21" stroke="#FFD700" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Right leg (forward) */}
      <line x1="19" y1="24" x2="28" y2="33" stroke="#FFD700" strokeWidth="3" strokeLinecap="round"/>
      {/* Left leg (back) */}
      <line x1="19" y1="24" x2="12" y2="36" stroke="#FFD700" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
}

function playDoorCreak() {
  try {
    const ctx = new AudioContext();
    const t = ctx.currentTime;
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    lfo.frequency.value = 7;
    lfoGain.gain.value = 35;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(190, t);
    osc.frequency.linearRampToValueAtTime(90, t + 0.6);
    osc.frequency.linearRampToValueAtTime(155, t + 1.0);
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.13, t + 0.06);
    gain.gain.setValueAtTime(0.11, t + 0.85);
    gain.gain.linearRampToValueAtTime(0.001, t + 1.1);
    osc.connect(gain); gain.connect(ctx.destination);
    lfo.start(t); osc.start(t);
    lfo.stop(t + 1.2); osc.stop(t + 1.2);
    setTimeout(() => ctx.close(), 1600);
  } catch {}
}

function playIMChime() {
  try {
    const ctx = new AudioContext();
    const t = ctx.currentTime;
    [[880, 0], [1100, 0.16]].forEach(([freq, delay]) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.001, t + delay);
      g.gain.linearRampToValueAtTime(0.10, t + delay + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.28);
      o.connect(g); g.connect(ctx.destination);
      o.start(t + delay); o.stop(t + delay + 0.32);
    });
    setTimeout(() => ctx.close(), 700);
  } catch {}
}

function speakYouveGotMail() {
  try {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance("You've got mail!");
    utt.rate = 0.88;
    utt.pitch = 1.1;
    utt.volume = 1.0;
    const setVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const pick = voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('female'))
        || voices.find(v => v.lang.startsWith('en-US'))
        || voices[0];
      if (pick) utt.voice = pick;
      window.speechSynthesis.speak(utt);
    };
    if (window.speechSynthesis.getVoices().length) setVoice();
    else window.speechSynthesis.addEventListener('voiceschanged', setVoice, { once: true });
  } catch {}
}

export default function AIMBuddy() {
  const [isRetro, setIsRetro]     = useState(false);
  const [members, setMembers]     = useState<Member[]>([]);
  const [showIM, setShowIM]       = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [signed, setSigned]       = useState(false);
  const [signingOn, setSigningOn] = useState(false);
  const [inputName, setInputName] = useState('');
  const [email, setEmail]         = useState('');
  const [sent, setSent]           = useState(false);

  useEffect(() => {
    const check = () => setIsRetro(document.documentElement.classList.contains('retro'));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!isRetro || !signed) return;
    fetch('/api/members')
      .then(r => r.json())
      .then(data => setMembers(Array.isArray(data) ? data.slice(0, 14) : []))
      .catch(() => setMembers([]));
  }, [isRetro, signed]);

  if (!isRetro) return null;

  const openIM = () => { playIMChime(); setShowIM(true); };

  const handleSignOn = () => {
    playDoorCreak();
    setSigningOn(true);
    setTimeout(() => { setSigningOn(false); setSigned(true); }, 1400);
  };

  const handleSignOff = () => {
    setSigned(false);
    setShowIM(false);
    setMembers([]);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    speakYouveGotMail();
    setSent(true);
    setTimeout(() => {
      setShowIM(false);
      setSent(false);
      setInputName('');
      setEmail('');
    }, 2200);
  };

  const msgTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  /* ─── Sign On Window ──────────────────────────────── */
  if (!signed) {
    return (
      <div className="aim-signon-wrap">
        {/* Title bar */}
        <div className="aim-titlebar">
          <span className="aim-title-text" style={{ fontSize: 11 }}>Sign On</span>
          <div className="aim-winbtns">
            <button className="aim-wbtn aim-wbtn-min">_</button>
            <button className="aim-wbtn aim-wbtn-close">×</button>
          </div>
        </div>

        {/* AOL header */}
        <div className="aim-signon-header">
          <div className="aim-signon-man"><RunningMan size={46} /></div>
          <div className="aim-signon-branding">
            <div className="aim-signon-aol">AOL</div>
            <div className="aim-signon-product">Instant Messenger™</div>
          </div>
        </div>

        {/* Form body */}
        <div className="aim-signon-body">
          <div className="aim-signon-field">
            <label className="aim-field-label">Screen Name</label>
            <input className="aim-field-input" defaultValue="LC3Club" readOnly />
          </div>
          <div className="aim-signon-field">
            <label className="aim-field-label">Password</label>
            <input className="aim-field-input" type="password" />
          </div>

          <div className="aim-signon-links">
            <a className="aim-signon-link" href="#">Get a Screen Name</a>
            <a className="aim-signon-link" href="#">Forgot Password?</a>
          </div>

          <div className="aim-signon-checks">
            <label className="aim-check-label"><input type="checkbox" defaultChecked /> Save password</label>
            <label className="aim-check-label"><input type="checkbox" /> Auto-login</label>
          </div>

          <button
            className="aim-signon-btn"
            onClick={handleSignOn}
            disabled={signingOn}
          >
            {signingOn ? 'Signing On…' : 'Sign On'}
          </button>
        </div>

        <div className="aim-signon-version">Version: 5.9.3702</div>
      </div>
    );
  }

  /* ─── Signed-in View ──────────────────────────────── */
  return (
    <>
      {/* ── IM Chat Window ─────────────────────────────── */}
      {showIM && (
        <div className="aim-im-wrap">
          <div className="aim-titlebar">
            <span className="aim-title-icon">💬</span>
            <span className="aim-title-text">LC3Club — Instant Message</span>
            <div className="aim-winbtns">
              <button className="aim-wbtn aim-wbtn-close" onClick={() => { setShowIM(false); setSent(false); }}>×</button>
            </div>
          </div>

          {/* Font toolbar */}
          <div className="aim-im-toolbar">
            <button className="aim-tb-btn" title="Font"><span className="aim-tb-font-a">A</span></button>
            <button className="aim-tb-btn aim-tb-bold" title="Bold"><b>B</b></button>
            <button className="aim-tb-btn aim-tb-italic" title="Italic"><i>I</i></button>
            <button className="aim-tb-btn aim-tb-underline" title="Underline"><u>U</u></button>
            <span className="aim-tb-sep" />
            <button className="aim-tb-btn" title="Text color"><span style={{color:'#cc0000', fontWeight:'bold'}}>A</span></button>
            <button className="aim-tb-btn" title="Insert smiley">:-)</button>
            <button className="aim-tb-btn" title="Hyperlink" style={{fontSize:'10px'}}>URL</button>
          </div>

          {/* Chat log */}
          <div className="aim-im-chat">
            <div className="aim-im-bubble">
              <span className="aim-im-sender">LC3Bot</span>
              <span className="aim-im-time"> ({msgTime}): </span>
              <span className="aim-im-text">Hey! Interested in joining <b>LC3 &mdash; Lowcode Cloud Club</b>? Drop your info and we&apos;ll reach out, or visit our Contact page!</span>
            </div>
            {sent && (
              <div className="aim-im-bubble" style={{marginTop: 4}}>
                <span className="aim-im-sender aim-im-sender-you">You</span>
                <span className="aim-im-time"> ({msgTime}): </span>
                <span className="aim-im-text">Message sent! We&apos;ll be in touch soon :-)</span>
              </div>
            )}
          </div>

          {/* Input form */}
          {!sent ? (
            <form className="aim-im-form" onSubmit={handleSend}>
              <input
                className="aim-im-input"
                placeholder="Your name..."
                value={inputName}
                onChange={e => setInputName(e.target.value)}
                required
              />
              <input
                className="aim-im-input"
                placeholder="Your email..."
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <div className="aim-im-actions">
                <button type="button" className="aim-action-btn">Warn</button>
                <button type="button" className="aim-action-btn">Block</button>
                <Link href="/contact" className="aim-action-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                  Info ↗
                </Link>
                <button type="submit" className="aim-send-btn">Send</button>
              </div>
            </form>
          ) : (
            <div className="aim-sent-msg">Connecting you to LC3... 🔌</div>
          )}
        </div>
      )}

      {/* ── Buddy List Window ──────────────────────────── */}
      <div className="aim-wrap">
        {/* Title bar */}
        <div className="aim-titlebar">
          <span className="aim-title-text">Buddy List</span>
          <div className="aim-winbtns">
            <button className="aim-wbtn" onClick={() => setMinimized(m => !m)}>{minimized ? '▲' : '_'}</button>
            <button className="aim-wbtn aim-wbtn-close" onClick={handleSignOff}>×</button>
          </div>
        </div>

        {!minimized && (
          <>
            {/* Menu bar */}
            <div className="aim-menubar">
              <span className="aim-menu-item">My AIM</span>
              <span className="aim-menu-item">People</span>
              <span className="aim-menu-item">Help</span>
            </div>

            {/* AOL header with running man + tabs */}
            <div className="aim-bl-header">
              <div className="aim-bl-header-top">
                <div className="aim-bl-man"><RunningMan size={32} /></div>
                <div className="aim-bl-branding">
                  <div className="aim-bl-aol">AOL</div>
                  <div className="aim-bl-product">Instant Messenger</div>
                </div>
                <div className="aim-bl-screenname-badge">
                  <div className="aim-bl-sn">LC3Club</div>
                  <div className="aim-bl-status">● Online</div>
                </div>
              </div>
              <div className="aim-tabs">
                <div className="aim-tab aim-tab-active">Online</div>
                <div className="aim-tab">List Setup</div>
              </div>
            </div>

            {/* Buddy list */}
            <div className="aim-list">
              <div className="aim-category">
                <span className="aim-cat-arrow">▼</span> Buddies ({members.length}/{members.length + 58} online)
              </div>
              {members.length === 0 ? (
                <div className="aim-buddy aim-buddy-empty">Loading members...</div>
              ) : (
                members.map(m => (
                  <div key={m.id} className="aim-buddy" onClick={() => openIM()} title="Click to IM">
                    <span className="aim-buddy-icon">■</span>
                    <span className="aim-buddy-name">{m.name}</span>
                    {m.role && <span className="aim-buddy-role">{m.role}</span>}
                  </div>
                ))
              )}
              <div className="aim-category" style={{marginTop: 2}}>
                <span className="aim-cat-arrow">▼</span> Co-Workers (1/5)
              </div>
              <div className="aim-buddy" onClick={() => openIM()}>
                <span className="aim-buddy-icon">■</span>
                <span className="aim-buddy-name aim-buddy-online">LC3Admin</span>
              </div>
              <div className="aim-category" style={{marginTop: 2}}>
                <span className="aim-cat-arrow">▶</span> Offline (80/86)
              </div>
            </div>

            {/* Footer buttons */}
            <div className="aim-footer">
              <button className="aim-footer-btn" onClick={() => openIM()} title="Send Instant Message">IM</button>
              <button className="aim-footer-btn" title="Chat">Chat</button>
              <Link href="/contact" className="aim-footer-btn aim-footer-link" title="Get Info">Info</Link>
              <button className="aim-footer-btn" title="Set Away Message">Away</button>
            </div>

            {/* Sign Off */}
            <div className="aim-signoff-row">
              <button className="aim-signoff-btn" onClick={handleSignOff}>Sign Off</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
