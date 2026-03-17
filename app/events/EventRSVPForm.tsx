'use client';

import { useState } from 'react';

export default function EventRSVPForm({ eventId, initialCount }: { eventId: string; initialCount: number }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'duplicate' | 'error'>('idle');
  const [count, setCount] = useState(initialCount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch(`/api/events/${eventId}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });
      if (res.status === 409) {
        setStatus('duplicate');
      } else if (res.ok) {
        setStatus('success');
        setCount((c) => c + 1);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        You&apos;re RSVPd! ({count} attending)
      </div>
    );
  }

  if (!open) {
    return (
      <div className="flex items-center gap-3">
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
        >
          RSVP Now
        </button>
        {count > 0 && (
          <span className="text-slate-400 text-sm">{count} attending</span>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 items-start sm:items-end">
      <input
        type="text"
        required
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
      />
      <input
        type="email"
        required
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {status === 'loading' ? 'Sending...' : 'Confirm'}
        </button>
        <button
          type="button"
          onClick={() => { setOpen(false); setStatus('idle'); }}
          className="px-4 py-2 border border-slate-200 dark:border-[#1e2d45] text-slate-500 dark:text-slate-400 text-sm rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
        >
          Cancel
        </button>
      </div>
      {status === 'duplicate' && (
        <p className="text-amber-500 text-xs mt-1 sm:mt-0 sm:self-center">Already RSVPd with that email.</p>
      )}
      {status === 'error' && (
        <p className="text-red-400 text-xs mt-1 sm:mt-0 sm:self-center">Something went wrong. Try again.</p>
      )}
    </form>
  );
}
