'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Key, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function MemberPortalLoginPage() {
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/members/me?key=${key}`);
      if (res.ok) {
        localStorage.setItem('lc3-member-key', key);
        router.push('/members/portal/dashboard');
      } else {
        setError('Invalid member key. Please check your email or contact an officer.');
      }
    } catch (err) {
      setError('Connection error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center p-4 grainy-bg transition-colors duration-300">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-violet-500/10 border border-violet-500/20 mb-6 text-violet-500">
            <Key className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Member Portal</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Enter your unique member key to manage your profile.</p>
        </div>

        <form onSubmit={handleLogin} className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-8 rounded-[2.5rem] space-y-6 shadow-2xl">
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono-tech text-slate-500 uppercase tracking-widest ml-1">Your Access Key</label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-slate-900 dark:text-white focus:border-violet-500 outline-none transition-all"
              required
            />
          </div>

          {error && <p className="text-rose-400 text-xs text-center font-medium bg-rose-500/10 py-2 rounded-lg border border-rose-500/20">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 bg-cyber-lime text-black font-black uppercase tracking-tight rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Enter Portal <ArrowRight className="w-5 h-5" /></>}
          </button>
        </form>

        <div className="text-center space-y-4">
          <p className="text-sm text-slate-500 italic">Don&apos;t have a key? Keys are issued automatically once your membership is approved.</p>
          <Link href="/contact" className="inline-block text-xs font-bold text-violet-500 hover:underline underline-offset-4 tracking-widest uppercase">Apply to Join LC3</Link>
        </div>
      </div>
    </div>
  );
}
