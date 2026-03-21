'use client';
import { useState, useMemo } from 'react';
import { Member } from '@/lib/data';

type EditFields = { bio: string; github: string; linkedin: string; twitter: string; avatarUrl: string; skills: string };

export default function MemberPortalClient({ members }: { members: Member[] }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Member | null>(null);
  const [code, setCode] = useState('');
  const [verified, setVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState('');
  const [fields, setFields] = useState<EditFields>({ bio: '', github: '', linkedin: '', twitter: '', avatarUrl: '', skills: '' });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return members.filter(m => m.name.toLowerCase().includes(q));
  }, [query, members]);

  const handleSelect = (m: Member) => {
    setSelected(m);
    setFields({
      bio: m.bio || '',
      github: m.github || '',
      linkedin: m.linkedin || '',
      twitter: m.twitter || '',
      avatarUrl: m.avatarUrl || '',
      skills: (m.skills || []).join(', '),
    });
    setVerified(false);
    setCode('');
    setVerifyError('');
    setQuery('');
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);
    setVerifyError('');
    try {
      const res = await fetch('/api/shield/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: 'LC3MEMBER', password: code }),
      });
      if (res.ok) {
        setVerified(true);
      } else {
        setVerifyError('Incorrect code. Ask your club admin for the LC3 member password.');
      }
    } catch {
      setVerifyError('Something went wrong. Try again.');
    }
    setVerifying(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setSaving(true);
    setSaveMsg('');
    try {
      const res = await fetch(`/api/members/${selected.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          bio: fields.bio,
          github: fields.github,
          linkedin: fields.linkedin,
          twitter: fields.twitter,
          avatarUrl: fields.avatarUrl,
          skills: fields.skills.split(',').map(s => s.trim()).filter(Boolean),
        }),
      });
      if (res.ok) {
        setSaveMsg('Saved! Your profile has been updated.');
      } else {
        setSaveMsg('Failed to save. Try again.');
      }
    } catch {
      setSaveMsg('Something went wrong.');
    }
    setSaving(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Member Portal</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Find your member card and update your profile.
        </p>
      </div>

      {/* Step 1: Search */}
      {!selected && (
        <div className="bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-[#1e2d45] rounded-2xl p-6">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Find Your Profile</h2>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type your name…"
            autoFocus
            className="w-full bg-slate-50 dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 dark:text-white placeholder:text-slate-400 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
          />

          {results.length > 0 && (
            <div className="mt-3 space-y-2">
              {results.map(m => (
                <button
                  key={m.id}
                  onClick={() => handleSelect(m)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-[#1e2d45] hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-all text-left"
                >
                  {m.avatarUrl && (
                    <img src={m.avatarUrl} alt={m.name} className="w-9 h-9 rounded-full object-cover shrink-0" />
                  )}
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white text-sm">{m.name}</div>
                    <div className="text-xs text-slate-400">{m.role} · {m.memberType}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
          {query.trim() && results.length === 0 && (
            <p className="mt-3 text-sm text-slate-400 text-center">No members found matching &ldquo;{query}&rdquo;</p>
          )}
        </div>
      )}

      {/* Step 2: Verify + Edit */}
      {selected && (
        <div>
          <button
            onClick={() => setSelected(null)}
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 mb-4 transition-colors"
          >
            ← Back to search
          </button>

          <div className="bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-[#1e2d45] rounded-2xl p-5 mb-4 flex items-center gap-3">
            {selected.avatarUrl && <img src={selected.avatarUrl} alt={selected.name} className="w-10 h-10 rounded-full object-cover shrink-0" />}
            <div>
              <div className="font-bold text-slate-900 dark:text-white">{selected.name}</div>
              <div className="text-xs text-slate-400">{selected.role}</div>
            </div>
          </div>

          {!verified ? (
            <div className="bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-[#1e2d45] rounded-2xl p-6">
              <h2 className="font-semibold text-slate-900 dark:text-white mb-1">Verify Your Identity</h2>
              <p className="text-sm text-slate-400 mb-4">Enter the LC3 member password to edit this profile.</p>
              <form onSubmit={handleVerify} className="space-y-3">
                <input
                  type="password"
                  value={code}
                  onChange={e => { setCode(e.target.value); setVerifyError(''); }}
                  placeholder="LC3 member password"
                  autoFocus
                  className="w-full bg-slate-50 dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 dark:text-white placeholder:text-slate-400 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
                />
                {verifyError && <p className="text-red-400 text-xs">{verifyError}</p>}
                <button
                  type="submit"
                  disabled={verifying}
                  className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
                >
                  {verifying ? 'Verifying…' : 'Verify'}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-[#1e2d45] rounded-2xl p-6">
              <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Edit Your Profile</h2>
              <form onSubmit={handleSave} className="space-y-4">
                {([
                  { label: 'Bio', key: 'bio', placeholder: 'Tell us about yourself…', multiline: true },
                  { label: 'GitHub URL', key: 'github', placeholder: 'https://github.com/yourname' },
                  { label: 'LinkedIn URL', key: 'linkedin', placeholder: 'https://linkedin.com/in/yourname' },
                  { label: 'Twitter/X URL', key: 'twitter', placeholder: 'https://x.com/yourhandle' },
                  { label: 'Avatar URL', key: 'avatarUrl', placeholder: 'https://…/your-photo.jpg' },
                  { label: 'Skills (comma-separated)', key: 'skills', placeholder: 'React, Python, Azure…' },
                ] as const).map(({ label, key, placeholder, multiline = false }) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">{label}</label>
                    {multiline ? (
                      <textarea
                        value={fields[key]}
                        onChange={e => setFields(f => ({ ...f, [key]: e.target.value }))}
                        placeholder={placeholder}
                        rows={3}
                        className="w-full bg-slate-50 dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 dark:text-white placeholder:text-slate-400 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all resize-none"
                      />
                    ) : (
                      <input
                        type="text"
                        value={fields[key]}
                        onChange={e => setFields(f => ({ ...f, [key]: e.target.value }))}
                        placeholder={placeholder}
                        className="w-full bg-slate-50 dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 dark:text-white placeholder:text-slate-400 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
                      />
                    )}
                  </div>
                ))}
                {saveMsg && (
                  <p className={`text-sm ${saveMsg.startsWith('Saved') ? 'text-green-500' : 'text-red-400'}`}>{saveMsg}</p>
                )}
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
