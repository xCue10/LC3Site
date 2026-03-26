'use client';
import { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2, MessageSquare, Shield } from 'lucide-react';
import { ChatMessage } from '@/lib/shield-types';
import { loadUserData } from '@/lib/shield-storage';

interface Props {
  context?: string;
}

const SUGGESTED_QUESTIONS = [
  'Explain this in simpler terms',
  'How do I fix the most critical issue?',
  'What should I learn next?',
  'Show me a real-world example',
];

export default function ShieldSecurityChat({ context }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hi! I'm your AI Security Mentor. I can explain scan results, suggest fixes, or answer any security questions. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const userData = typeof window !== 'undefined' ? loadUserData() : null;
  const mode = userData?.mode || 'beginner';

  useEffect(() => {
    if (open) {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    }
  }, [messages, open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg: ChatMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/shield/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, context, mode }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || 'Sorry, I had trouble responding.' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggest = (q: string) => {
    setInput(q);
    inputRef.current?.focus();
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center transition-all hover:scale-105"
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
          boxShadow: '0 0 0 1px rgba(59,130,246,0.3), 0 8px 32px rgba(59,130,246,0.3)',
        }}
        aria-label="Open AI Security Mentor"
      >
        <MessageSquare className="w-5 h-5 text-white" />
        <span
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
          style={{ background: '#ef4444', border: '2px solid #0a0a0f' }}
        >
          AI
        </span>
      </button>

      {/* Chat panel */}
      {open && (
        <div
          className="fixed z-50 flex flex-col overflow-hidden bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-white/[0.08]"
          style={{
            bottom: '80px',
            right: '16px',
            left: '16px',
            maxWidth: '380px',
            marginLeft: 'auto',
            height: '520px',
            maxHeight: 'calc(100vh - 100px)',
            borderRadius: '16px',
            boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3.5 shrink-0"
            style={{
              background: 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(59,130,246,0.04) 100%)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}
              >
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-[13px] font-semibold text-white">AI Security Mentor</div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
                  Online · Powered by Claude
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-slate-500 hover:text-slate-300 transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className="max-w-[85%] text-[13px] leading-relaxed px-3.5 py-2.5 rounded-2xl"
                  style={
                    msg.role === 'user'
                      ? {
                          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                          color: '#fff',
                          borderBottomRightRadius: '4px',
                        }
                      : {
                          background: 'rgba(255,255,255,0.05)',
                          color: '#c4cfe8',
                          border: '1px solid rgba(255,255,255,0.07)',
                          borderBottomLeftRadius: '4px',
                        }
                  }
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div
                  className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderBottomLeftRadius: '4px',
                  }}
                >
                  <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                  <span className="text-[12px] text-slate-500">Thinking...</span>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Suggested pills — shown on first message only */}
          {messages.length === 1 && (
            <div className="px-4 pb-3 flex flex-wrap gap-1.5">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSuggest(q)}
                  className="text-[11px] px-2.5 py-1 rounded-full transition-all"
                  style={{
                    background: 'rgba(59,130,246,0.08)',
                    color: '#60a5fa',
                    border: '1px solid rgba(59,130,246,0.15)',
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'rgba(59,130,246,0.15)')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'rgba(59,130,246,0.08)')}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div
            className="px-3 py-3 shrink-0"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div
              className="flex items-center gap-2 rounded-xl px-3 py-2 transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask about security..."
                className="flex-1 bg-transparent text-[13px] text-white placeholder-slate-600 outline-none"
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="flex items-center justify-center w-7 h-7 rounded-lg transition-all disabled:opacity-30"
                style={{ background: input.trim() ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'rgba(255,255,255,0.05)' }}
              >
                <Send className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
