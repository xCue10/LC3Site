'use client';

import { useState, useEffect } from 'react';
import { Member } from '@/lib/types';
import { User, Github, Linkedin, Twitter, Globe, Save, LogOut, Loader2 } from 'lucide-react';

export default function MemberPortalDashboard() {
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const key = localStorage.getItem('lc3-member-key');
    if (!key) {
      window.location.href = '/members/portal';
      return;
    }

    fetch(`/api/members/me?key=${key}`)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => { setMember(data); setLoading(false); })
      .catch(() => {
        localStorage.removeItem('lc3-member-key');
        window.location.href = '/members/portal';
      });
  }, []);

  const handleSave = async () => {
    if (!member) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/members/${member.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...member, key: localStorage.getItem('lc3-member-key') })
      });
      if (!res.ok) throw new Error('Failed to save');
      alert('Profile updated successfully!');
    } catch (err) {
      setError('Error saving changes.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-200 p-4 md:p-8 grainy-bg transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 rounded-[2rem]">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-violet-500/30">
              <img src={member?.avatarUrl || '/avatar-placeholder.svg'} alt={member?.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">{member?.name}</h1>
              <p className="text-sm font-mono-tech text-violet-600 dark:text-violet-400 uppercase tracking-widest">{member?.role}</p>
            </div>
          </div>
          <button 
            onClick={() => { localStorage.removeItem('lc3-member-key'); window.location.href = '/members/portal'; }}
            className="p-2 hover:bg-slate-200 dark:hover:bg-white/5 rounded-full text-slate-400 hover:text-rose-600 transition-colors"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Bio & Basic Info */}
          <div className="space-y-6 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-8 rounded-[2.5rem]">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-5 h-5 text-violet-500" /> Basic Profile
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono-tech text-slate-500 uppercase">Avatar URL</label>
                <input 
                  type="text" 
                  value={member?.avatarUrl || ''} 
                  onChange={e => setMember(m => m ? {...m, avatarUrl: e.target.value} : null)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm focus:border-violet-500 outline-none dark:text-white" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono-tech text-slate-500 uppercase">Bio</label>
                <textarea 
                  rows={4}
                  value={member?.bio || ''} 
                  onChange={e => setMember(m => m ? {...m, bio: e.target.value} : null)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm focus:border-violet-500 outline-none dark:text-white" 
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-6 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-8 rounded-[2.5rem]">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-500" /> Connectivity
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <Github className="w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="GitHub URL"
                  value={member?.github || ''} 
                  onChange={e => setMember(m => m ? {...m, github: e.target.value} : null)}
                  className="bg-transparent flex-1 text-sm outline-none dark:text-white" 
                />
              </div>
              <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <Linkedin className="w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="LinkedIn URL"
                  value={member?.linkedin || ''} 
                  onChange={e => setMember(m => m ? {...m, linkedin: e.target.value} : null)}
                  className="bg-transparent flex-1 text-sm outline-none dark:text-white" 
                />
              </div>
              <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <Twitter className="w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Twitter URL"
                  value={member?.twitter || ''} 
                  onChange={e => setMember(m => m ? {...m, twitter: e.target.value} : null)}
                  className="bg-transparent flex-1 text-sm outline-none dark:text-white" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-4 rounded-2xl sticky bottom-8">
          <p className="text-xs text-slate-500 font-mono-tech italic">Your changes will be live instantly on the member page.</p>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 bg-cyber-lime text-black font-black uppercase tracking-tight rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Profile
          </button>
        </div>

      </div>
    </div>
  );
}
