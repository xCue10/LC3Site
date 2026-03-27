'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Member = { id: string; name: string; role?: string; };

export default function AIMBuddy() {
  const [isRetro, setIsRetro]       = useState(false);
  const [members, setMembers]       = useState<Member[]>([]);
  const [showIM, setShowIM]         = useState(false);
  const [minimized, setMinimized]   = useState(false);
  const [name, setName]             = useState('');
  const [email, setEmail]           = useState('');
  const [sent, setSent]             = useState(false);

  useEffect(() => {
    const check = () => setIsRetro(document.documentElement.classList.contains('retro'));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!isRetro) return;
    fetch('/api/members')
      .then(r => r.json())
      .then(data => setMembers(Array.isArray(data) ? data.slice(0, 14) : []))
      .catch(() => setMembers([]));
  }, [isRetro]);

  if (!isRetro) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setShowIM(false);
      setSent(false);
      setName('');
      setEmail('');
    }, 2200);
  };

  return (
    <>
      {/* ── IM Chat Window ─────────────────────────────── */}
      {showIM && (
        <div className="aim-im-wrap">
          <div className="aim-titlebar">
            <span className="aim-title-icon">💬</span>
            <span className="aim-title-text">LC3 Club — Instant Message</span>
            <div className="aim-winbtns">
              <button className="aim-wbtn aim-wbtn-close" onClick={() => { setShowIM(false); setSent(false); }}>×</button>
            </div>
          </div>

          {/* Chat log */}
          <div className="aim-im-chat">
            <div className="aim-im-bubble">
              <span className="aim-im-sender">LC3Bot</span>
              <span className="aim-im-time"> [{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}]:</span>
              <p>Hey! 👋 Interested in joining <strong>LC3 — Lowcode Cloud Club</strong>? Drop your info below and we&apos;ll reach out. You can also check us out at the Join page!</p>
            </div>
            {sent && (
              <div className="aim-im-bubble aim-im-reply">
                <span className="aim-im-sender">You</span>
                <p>Message sent! ✅ We&apos;ll be in touch soon.</p>
              </div>
            )}
          </div>

          {/* Input form */}
          {!sent ? (
            <form className="aim-im-form" onSubmit={handleSend}>
              <input
                className="aim-im-input"
                placeholder="Your name..."
                value={name}
                onChange={e => setName(e.target.value)}
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
                <Link href="/join" className="aim-footer-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                  Full Form ↗
                </Link>
                <button type="submit" className="aim-send-btn">Send IM</button>
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
          <span className="aim-title-icon">🟡</span>
          <span className="aim-title-text">Buddy List</span>
          <div className="aim-winbtns">
            <button className="aim-wbtn" onClick={() => setMinimized(m => !m)} title={minimized ? 'Restore' : 'Minimize'}>
              {minimized ? '▲' : '_'}
            </button>
            <button className="aim-wbtn aim-wbtn-close" onClick={() => setShowIM(false)} title="Close IM">×</button>
          </div>
        </div>

        {!minimized && (
          <>
            {/* Screen name header */}
            <div className="aim-header">
              <div className="aim-screenname-row">
                <span className="aim-running-man">🏃</span>
                <div>
                  <div className="aim-screenname">LC3 Club</div>
                  <div className="aim-status-text">🟢 Available</div>
                </div>
              </div>
            </div>

            {/* Buddy list */}
            <div className="aim-list">
              <div className="aim-category">
                Buddies ({members.length} online)
              </div>
              {members.length === 0 ? (
                <div className="aim-buddy aim-buddy-empty">Loading members...</div>
              ) : (
                members.map(m => (
                  <div
                    key={m.id}
                    className="aim-buddy"
                    onClick={() => setShowIM(true)}
                    title="Double-click to IM"
                  >
                    <span className="aim-buddy-dot">●</span>
                    <span className="aim-buddy-name">{m.name}</span>
                    {m.role && <span className="aim-buddy-role">{m.role}</span>}
                  </div>
                ))
              )}
            </div>

            {/* Footer buttons */}
            <div className="aim-footer">
              <button className="aim-footer-btn" onClick={() => setShowIM(true)} title="Send Instant Message">IM</button>
              <button className="aim-footer-btn" title="Chat">Chat</button>
              <Link href="/join" className="aim-footer-btn aim-footer-link" title="Get Info">Info</Link>
              <button className="aim-footer-btn" title="Away Message">Away</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
