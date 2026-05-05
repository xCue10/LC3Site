'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Key, ArrowRight, Loader2, Search, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Member } from '@/lib/types';

export default function MemberPortalLoginPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [search, setSearch] = useState('');
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetch('/api/members')
      .then(res => res.json())
      .then(data => { setMembers(data); setFetching(false); })
      .catch(() => setFetching(false));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim() || !selectedMember) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/members/me?key=${key}`);
      if (res.ok) {
        localStorage.setItem('lc3-member-key', key);
        localStorage.setItem('lc3-member-id', selectedMember.id);
        router.push('/members/portal/dashboard');
      } else {
        setError('Invalid club password. Please try again.');
      }
    } catch (err) {
      setError('Connection error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center transition-colors duration-300">
      <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
    </div>
  );

  const filtered = members.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center p-4 grainy-bg transition-colors duration-300">
      <div className="w-full max-w-md space-y-8">
        
        {!selectedMember ? (
          <>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-violet-500/10 border border-violet-500/20 mb-6 text-violet-500">
                <User className="w-8 h-8" />
              </div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Member Portal</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2">Search and select your profile to begin.</p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search your name..." 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl pl-11 pr-4 py-4 text-slate-900 dark:text-white outline-none focus:border-violet-500 transition-all"
                />
              </div>

              <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {filtered.map(m => (
                  <button 
                    key={m.id} 
                    onClick={() => setSelectedMember(m)}
                    className="w-full p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl hover:border-violet-500/50 transition-all text-left flex items-center gap-3 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-violet-500/10 overflow-hidden flex-shrink-0 flex items-center justify-center text-violet-500 font-bold">
                      {m.avatarUrl ? <img src={m.avatarUrl} alt="" className="w-full h-full object-cover" /> : m.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white group-hover:text-violet-500 transition-colors">{m.name}</p>
                      <p className="text-[10px] font-mono-tech text-slate-500 uppercase">{m.role}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <button 
              onClick={() => setSelectedMember(null)}
              className="flex items-center gap-2 text-slate-500 hover:text-violet-500 transition-colors text-xs font-bold uppercase tracking-widest"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Search
            </button>

            <div className="text-center">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-violet-500/30 mx-auto mb-4">
                <img src={selectedMember.avatarUrl || '/avatar-placeholder.svg'} alt="" className="w-full h-full object-cover" />
              </div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">{selectedMember.name}</h1>
              <p className="text-xs font-mono-tech text-violet-500 uppercase tracking-widest mt-1">Authenticating Profile</p>
            </div>

            <form onSubmit={handleLogin} className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-8 rounded-[2.5rem] space-y-6 shadow-2xl transition-all">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono-tech text-slate-500 uppercase tracking-widest ml-1">Club Password</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  autoFocus
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-slate-900 dark:text-white focus:border-violet-500 outline-none transition-all"
                  required
                />
              </div>

              {error && <p className="text-rose-400 text-xs text-center font-medium bg-rose-500/10 py-2 rounded-lg border border-rose-500/20">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 bg-cyber-lime text-black font-black uppercase tracking-tight rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-cyber-lime/10"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Unlock Profile <ArrowRight className="w-5 h-5" /></>}
              </button>
            </form>
          </>
        )}

        <div className="text-center space-y-4">
          <p className="text-sm text-slate-500 italic">Not in the club? Join LC3 to get your member key.</p>
          <Link href="/contact" className="inline-block text-xs font-bold text-violet-500 hover:underline underline-offset-4 tracking-widest uppercase">Apply to Join LC3</Link>
        </div>
      </div>
    </div>
  );
}
