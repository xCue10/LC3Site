'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CareersNav from '../components/CareersNav';
import { isCareerAuthed, memberLS, PRESET_SKILLS, JOB_TYPES, INDUSTRIES, CSN_MAJORS } from '../types';
import type { CareerProfile, CareerSkill, Application, SavedJob } from '../types';

const achievements = [
  { id: 'Profile Complete', emoji: '🎯', title: 'Profile Complete', desc: 'Finished onboarding setup' },
  { id: 'First Save', emoji: '★', title: 'First Save', desc: 'Bookmarked your first job' },
  { id: 'First Application', emoji: '📬', title: 'First Application', desc: 'Tracked your first application' },
  { id: 'Cover Letter Pro', emoji: '✉️', title: 'Cover Letter Pro', desc: 'Generated a cover letter' },
  { id: 'Resume Pro', emoji: '📄', title: 'Resume Pro', desc: 'Uploaded and analyzed your resume' },
  { id: 'Skill Builder', emoji: '🔧', title: 'Skill Builder', desc: 'Added 10+ skills to your profile' },
  { id: 'Perfect Match', emoji: '💯', title: 'Perfect Match', desc: 'Found a 95%+ match job' },
];

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<CareerProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<CareerProfile | null>(null);
  const [stats, setStats] = useState({ saved: 0, applied: 0, skills: 0 });
  const [skillSearch, setSkillSearch] = useState('');

  useEffect(() => {
    if (!isCareerAuthed()) { router.replace('/careers'); return; }
    const keys = memberLS();
    const raw = localStorage.getItem(keys.profile);
    if (raw) { try { setProfile(JSON.parse(raw)); } catch {} }

    const savedRaw = localStorage.getItem(keys.saved) ?? '[]';
    const appsRaw = localStorage.getItem(keys.apps) ?? '[]';
    try {
      const saved: SavedJob[] = JSON.parse(savedRaw);
      const apps: Application[] = JSON.parse(appsRaw);
      const rawProfile = raw ? JSON.parse(raw) as CareerProfile : null;
      setStats({ saved: saved.length, applied: apps.length, skills: rawProfile?.skills.length ?? 0 });
    } catch {}
  }, [router]);

  const startEdit = () => {
    setDraft(profile ? { ...profile } : null);
    setEditing(true);
  };

  const save = () => {
    if (!draft) return;
    localStorage.setItem(memberLS().profile, JSON.stringify(draft));
    setProfile(draft);
    setEditing(false);
  };

  const toggleSkill = (name: string) => {
    if (!draft) return;
    const has = draft.skills.find((s) => s.name === name);
    setDraft((d) => d ? {
      ...d,
      skills: has ? d.skills.filter((s) => s.name !== name) : [...d.skills, { name, level: 'Beginner' }]
    } : d);
  };

  const updateSkillLevel = (name: string, level: CareerSkill['level']) => {
    setDraft((d) => d ? { ...d, skills: d.skills.map((s) => s.name === name ? { ...s, level } : s) } : d);
  };

  const toggleJobType = (type: string) => {
    if (!draft) return;
    setDraft((d) => d ? {
      ...d,
      jobTypes: d.jobTypes.includes(type) ? d.jobTypes.filter((t) => t !== type) : [...d.jobTypes, type]
    } : d);
  };

  const toggleIndustry = (ind: string) => {
    if (!draft) return;
    setDraft((d) => d ? {
      ...d,
      industries: d.industries.includes(ind) ? d.industries.filter((i) => i !== ind) : [...d.industries, ind]
    } : d);
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1e]">
        <CareersNav />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  const inputClass = 'w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none';
  const inputStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' };
  const selectStyle = { background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', colorScheme: 'dark' as const };
  const p = editing && draft ? draft : profile;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1e]">
      <CareersNav />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Profile</h1>
            <p className="text-slate-400 text-sm">{profile.major} at CSN</p>
          </div>
          {!editing ? (
            <button
              onClick={startEdit}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => setEditing(false)} className="px-4 py-2 rounded-xl text-sm text-slate-500">Cancel</button>
              <button onClick={save} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>Save Changes</button>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Skills', value: stats.skills },
            { label: 'Saved Jobs', value: stats.saved },
            { label: 'Applications', value: stats.applied },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl p-4 text-center bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-white/[0.06]">
              <div className="text-2xl font-black text-slate-900 dark:text-white">{s.value}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="space-y-5">
          {/* Basic Info */}
          <div className="rounded-2xl p-5 bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-white/[0.06]">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Basic Information</h2>
            {editing ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Full Name</label>
                    <input className={inputClass} style={inputStyle} value={draft?.fullName ?? ''} onChange={(e) => setDraft((d) => d ? { ...d, fullName: e.target.value } : d)} />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Major</label>
                    <select className={inputClass} style={selectStyle} value={draft?.major ?? ''} onChange={(e) => setDraft((d) => d ? { ...d, major: e.target.value } : d)}>
                      {CSN_MAJORS.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Year</label>
                    <select className={inputClass} style={selectStyle} value={draft?.year ?? ''} onChange={(e) => setDraft((d) => d ? { ...d, year: e.target.value as CareerProfile['year'] } : d)}>
                      {['Freshman', 'Sophomore', 'Transfer'].map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Graduation Date</label>
                    <input type="month" className={inputClass} style={inputStyle} value={draft?.graduationDate ?? ''} onChange={(e) => setDraft((d) => d ? { ...d, graduationDate: e.target.value } : d)} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Dream Job</label>
                  <textarea
                    value={draft?.dreamJob ?? ''}
                    onChange={(e) => setDraft((d) => d ? { ...d, dreamJob: e.target.value } : d)}
                    rows={3}
                    className={inputClass + ' resize-none'}
                    style={inputStyle}
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-slate-500 text-xs">Name</span><p className="text-slate-900 dark:text-white mt-0.5">{p.fullName || '—'}</p></div>
                <div><span className="text-slate-500 text-xs">Major</span><p className="text-slate-900 dark:text-white mt-0.5">{p.major || '—'}</p></div>
                <div><span className="text-slate-500 text-xs">Year</span><p className="text-slate-900 dark:text-white mt-0.5">{p.year}</p></div>
                <div><span className="text-slate-500 text-xs">Graduation</span><p className="text-slate-900 dark:text-white mt-0.5">{p.graduationDate || '—'}</p></div>
                {p.dreamJob && (
                  <div className="col-span-2"><span className="text-slate-500 text-xs">Dream Job</span><p className="text-slate-900 dark:text-white mt-0.5 text-xs leading-relaxed">{p.dreamJob}</p></div>
                )}
              </div>
            )}
          </div>

          {/* Skills */}
          <div className="rounded-2xl p-5 bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-white/[0.06]">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Skills ({p.skills.length})</h2>
            {editing ? (
              <div className="space-y-3">
                <input
                  className={inputClass}
                  style={inputStyle}
                  placeholder="Search skills..."
                  value={skillSearch}
                  onChange={(e) => setSkillSearch(e.target.value)}
                />
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                  {PRESET_SKILLS.filter((s) => !skillSearch || s.toLowerCase().includes(skillSearch.toLowerCase())).map((skill) => {
                    const sel = draft?.skills.find((s) => s.name === skill);
                    return (
                      <button key={skill} onClick={() => toggleSkill(skill)}
                        className="px-3 py-1 rounded-lg text-xs font-medium transition-all"
                        style={{
                          background: sel ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.05)',
                          color: sel ? '#60a5fa' : '#6b7280',
                          border: sel ? '1px solid rgba(59,130,246,0.3)' : '1px solid rgba(255,255,255,0.06)',
                        }}
                      >
                        {sel ? '✓ ' : ''}{skill}
                      </button>
                    );
                  })}
                </div>
                {draft && draft.skills.length > 0 && (
                  <div className="space-y-2 mt-3">
                    {draft.skills.map((skill) => (
                      <div key={skill.name} className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl" style={{ background: 'rgba(59,130,246,0.08)' }}>
                        <span className="text-xs text-blue-300">{skill.name}</span>
                        <div className="flex gap-1">
                          {(['Beginner', 'Intermediate', 'Advanced'] as const).map((l) => (
                            <button key={l} onClick={() => updateSkillLevel(skill.name, l)}
                              className="px-1.5 py-0.5 rounded text-[10px] transition-all"
                              style={{ background: skill.level === l ? 'rgba(59,130,246,0.4)' : 'rgba(255,255,255,0.05)', color: skill.level === l ? '#fff' : '#6b7280' }}
                            >
                              {l === 'Intermediate' ? 'Mid' : l}
                            </button>
                          ))}
                          <button onClick={() => toggleSkill(skill.name)} className="text-red-500/60 hover:text-red-400 text-xs ml-1">✕</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {p.skills.length === 0 ? <p className="text-slate-500 text-sm">No skills added</p> : p.skills.map((s) => (
                  <span key={s.name}
                    className="px-3 py-1 rounded-lg text-xs font-medium"
                    style={{
                      background: s.level === 'Advanced' ? 'rgba(34,197,94,0.15)' : s.level === 'Intermediate' ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.06)',
                      color: s.level === 'Advanced' ? '#4ade80' : s.level === 'Intermediate' ? '#60a5fa' : '#94a3b8',
                    }}
                  >
                    {s.name} · {s.level === 'Intermediate' ? 'Mid' : s.level}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Preferences (edit mode) */}
          {editing && (
            <div className="rounded-2xl p-5 space-y-4 bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-white/[0.06]">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Job Preferences</h2>
              <div>
                <label className="text-xs text-slate-500 mb-2 block">Job Types</label>
                <div className="flex flex-wrap gap-2">
                  {JOB_TYPES.map((t) => {
                    const sel = draft?.jobTypes.includes(t);
                    return (
                      <button key={t} onClick={() => toggleJobType(t)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                        style={{ background: sel ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'rgba(255,255,255,0.05)', color: sel ? '#fff' : '#6b7280', border: '1px solid rgba(255,255,255,0.08)' }}
                      >{t}</button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-2 block">Industries</label>
                <div className="flex flex-wrap gap-2">
                  {INDUSTRIES.map((ind) => {
                    const sel = draft?.industries.includes(ind);
                    return (
                      <button key={ind} onClick={() => toggleIndustry(ind)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                        style={{ background: sel ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.05)', color: sel ? '#c4b5fd' : '#6b7280', border: sel ? '1px solid rgba(139,92,246,0.3)' : '1px solid rgba(255,255,255,0.08)' }}
                      >{ind}</button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1.5 block">Preferred Location</label>
                <input className={inputClass} style={inputStyle} value={draft?.preferredLocation ?? ''} onChange={(e) => setDraft((d) => d ? { ...d, preferredLocation: e.target.value } : d)} />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">
                  Salary Range: ${(draft?.salaryMin ?? 0).toLocaleString()} – ${(draft?.salaryMax ?? 0).toLocaleString()}
                </label>
                <div className="space-y-2">
                  <input type="range" min="20000" max="150000" step="5000" value={draft?.salaryMin ?? 40000} onChange={(e) => setDraft((d) => d ? { ...d, salaryMin: Number(e.target.value) } : d)} className="w-full accent-blue-500" />
                  <input type="range" min="20000" max="200000" step="5000" value={draft?.salaryMax ?? 80000} onChange={(e) => setDraft((d) => d ? { ...d, salaryMax: Number(e.target.value) } : d)} className="w-full accent-violet-500" />
                </div>
              </div>
            </div>
          )}

          {/* Achievements */}
          <div className="rounded-2xl p-5 bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-white/[0.06]">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Achievements</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {achievements.map((ach) => {
                const earned = p.achievements.includes(ach.id);
                return (
                  <div
                    key={ach.id}
                    className="rounded-xl p-3 text-center transition-all"
                    style={{
                      background: earned ? 'rgba(59,130,246,0.08)' : 'rgba(255,255,255,0.02)',
                      border: earned ? '1px solid rgba(59,130,246,0.2)' : '1px solid rgba(255,255,255,0.04)',
                      opacity: earned ? 1 : 0.4,
                    }}
                  >
                    <div className="text-2xl mb-1">{ach.emoji}</div>
                    <p className="text-xs font-semibold text-white">{ach.title}</p>
                    <p className="text-[10px] text-slate-600 mt-0.5">{ach.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
