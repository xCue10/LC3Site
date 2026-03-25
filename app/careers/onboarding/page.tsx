'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isCareerAuthed,
  LS_PROFILE, PRESET_SKILLS, JOB_TYPES, INDUSTRIES, CSN_MAJORS,
  defaultProfile,
} from '../types';
import type { CareerProfile, CareerSkill } from '../types';

const STEPS = ['Basic Info', 'Skills', 'Preferences', 'Dream Job', 'Resume'];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<CareerProfile>(defaultProfile);
  const [skillSearch, setSkillSearch] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [extracting, setExtracting] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isCareerAuthed()) {
      router.replace('/careers');
      return;
    }
    const raw = localStorage.getItem(LS_PROFILE);
    if (raw) {
      try { setProfile(JSON.parse(raw)); } catch {}
    }
  }, [router]);

  const save = (updates: Partial<CareerProfile>) => {
    setProfile((p) => {
      const next = { ...p, ...updates };
      localStorage.setItem(LS_PROFILE, JSON.stringify(next));
      return next;
    });
  };

  const toggleSkill = (name: string) => {
    const existing = profile.skills.find((s) => s.name === name);
    if (existing) {
      save({ skills: profile.skills.filter((s) => s.name !== name) });
    } else {
      save({ skills: [...profile.skills, { name, level: 'Beginner' }] });
    }
  };

  const updateSkillLevel = (name: string, level: CareerSkill['level']) => {
    save({ skills: profile.skills.map((s) => s.name === name ? { ...s, level } : s) });
  };

  const addCustomSkill = () => {
    const trimmed = skillSearch.trim();
    if (!trimmed || profile.skills.find((s) => s.name === trimmed)) return;
    save({ skills: [...profile.skills, { name: trimmed, level: 'Beginner' }] });
    setSkillSearch('');
  };

  const toggleJobType = (type: string) => {
    const has = profile.jobTypes.includes(type);
    save({ jobTypes: has ? profile.jobTypes.filter((t) => t !== type) : [...profile.jobTypes, type] });
  };

  const toggleIndustry = (ind: string) => {
    const has = profile.industries.includes(ind);
    save({ industries: has ? profile.industries.filter((i) => i !== ind) : [...profile.industries, ind] });
  };

  const extractSkillsFromResume = async () => {
    if (!resumeText.trim()) return;
    setExtracting(true);
    try {
      const res = await fetch('/api/careers/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText }),
      });
      if (res.ok) {
        const data = await res.json() as { extractedSkills: string[] };
        const newSkills = (data.extractedSkills ?? []).filter(
          (s: string) => !profile.skills.find((ps) => ps.name.toLowerCase() === s.toLowerCase())
        ).map((s: string) => ({ name: s, level: 'Beginner' as const }));
        save({ skills: [...profile.skills, ...newSkills], resumeText });
      }
    } catch {}
    setExtracting(false);
  };

  const finish = async () => {
    setSaving(true);
    const completed = { ...profile, onboardingComplete: true };
    if (!completed.achievements.includes('Profile Complete')) {
      completed.achievements = [...completed.achievements, 'Profile Complete'];
    }
    localStorage.setItem(LS_PROFILE, JSON.stringify(completed));
    setProfile(completed);
    router.push('/careers/jobs');
  };

  const filteredSkills = PRESET_SKILLS.filter(
    (s) => s.toLowerCase().includes(skillSearch.toLowerCase()) && !profile.skills.find((ps) => ps.name === s)
  );

  const inputClass = 'w-full px-4 py-3 rounded-xl text-white placeholder-slate-600 focus:outline-none transition-all text-sm';
  const inputStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' };

  return (
    <div style={{ background: '#0a0f1e', minHeight: '100vh' }}>
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-white mb-2">Set up your profile</h1>
          <p className="text-slate-400 text-sm">Help us find the best jobs for you</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className="flex flex-col items-center gap-1 shrink-0">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                  style={{
                    background: i < step ? '#22c55e' : i === step ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'rgba(255,255,255,0.05)',
                    color: i <= step ? '#fff' : '#4b5563',
                    border: i > step ? '1px solid rgba(255,255,255,0.1)' : 'none',
                  }}
                >
                  {i < step ? '✓' : i + 1}
                </div>
                <span className="text-[10px] text-slate-500 hidden sm:block">{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="h-px flex-1 transition-all" style={{ background: i < step ? '#22c55e' : 'rgba(255,255,255,0.1)' }} />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="rounded-2xl p-6 sm:p-8" style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)' }}>

          {/* Step 1: Basic Info */}
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-white">Basic Information</h2>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Full Name</label>
                <input className={inputClass} style={inputStyle} placeholder="Jane Doe" value={profile.fullName} onChange={(e) => save({ fullName: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Major at CSN</label>
                <select className={inputClass} style={inputStyle} value={profile.major} onChange={(e) => save({ major: e.target.value })}>
                  <option value="">Select your major</option>
                  {CSN_MAJORS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Year</label>
                <div className="flex gap-3">
                  {(['Freshman', 'Sophomore', 'Transfer'] as const).map((y) => (
                    <button
                      key={y}
                      onClick={() => save({ year: y })}
                      className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
                      style={{
                        background: profile.year === y ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'rgba(255,255,255,0.05)',
                        color: profile.year === y ? '#fff' : '#6b7280',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Expected Graduation Date</label>
                <input type="month" className={inputClass} style={inputStyle} value={profile.graduationDate} onChange={(e) => save({ graduationDate: e.target.value })} />
              </div>
            </div>
          )}

          {/* Step 2: Skills */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-white">Your Skills</h2>
              <div className="flex gap-2">
                <input
                  className={inputClass + ' flex-1'}
                  style={inputStyle}
                  placeholder="Search or add skill..."
                  value={skillSearch}
                  onChange={(e) => setSkillSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addCustomSkill()}
                />
                {skillSearch && !PRESET_SKILLS.includes(skillSearch) && (
                  <button
                    onClick={addCustomSkill}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-white transition-all"
                    style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
                  >
                    Add
                  </button>
                )}
              </div>

              {/* Filtered presets */}
              {filteredSkills.length > 0 && skillSearch && (
                <div className="flex flex-wrap gap-2">
                  {filteredSkills.slice(0, 10).map((skill) => (
                    <button
                      key={skill}
                      onClick={() => { toggleSkill(skill); setSkillSearch(''); }}
                      className="px-3 py-1 rounded-lg text-xs text-slate-400 hover:text-white transition-all"
                      style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}
                    >
                      + {skill}
                    </button>
                  ))}
                </div>
              )}

              {/* All presets */}
              {!skillSearch && (
                <div className="flex flex-wrap gap-2">
                  {PRESET_SKILLS.map((skill) => {
                    const selected = profile.skills.find((s) => s.name === skill);
                    return (
                      <button
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className="px-3 py-1 rounded-lg text-xs font-medium transition-all"
                        style={{
                          background: selected ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.05)',
                          border: selected ? '1px solid rgba(59,130,246,0.4)' : '1px solid rgba(255,255,255,0.08)',
                          color: selected ? '#60a5fa' : '#6b7280',
                        }}
                      >
                        {selected && '✓ '}{skill}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Selected skills with level */}
              {profile.skills.length > 0 && (
                <div className="space-y-2 mt-4">
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Selected skills &amp; levels</p>
                  {profile.skills.map((skill) => (
                    <div key={skill.name} className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)' }}>
                      <span className="text-sm text-blue-300 font-medium">{skill.name}</span>
                      <div className="flex gap-1">
                        {(['Beginner', 'Intermediate', 'Advanced'] as const).map((level) => (
                          <button
                            key={level}
                            onClick={() => updateSkillLevel(skill.name, level)}
                            className="px-2 py-0.5 rounded-md text-xs transition-all"
                            style={{
                              background: skill.level === level ? 'rgba(59,130,246,0.4)' : 'rgba(255,255,255,0.05)',
                              color: skill.level === level ? '#fff' : '#6b7280',
                            }}
                          >
                            {level === 'Intermediate' ? 'Mid' : level}
                          </button>
                        ))}
                        <button onClick={() => toggleSkill(skill.name)} className="ml-1 text-red-500/60 hover:text-red-400 text-xs">✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Job Preferences */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-white">Job Preferences</h2>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Job Types <span className="text-slate-600">(select all that apply)</span></label>
                <div className="flex flex-wrap gap-2">
                  {JOB_TYPES.map((type) => {
                    const sel = profile.jobTypes.includes(type);
                    return (
                      <button key={type} onClick={() => toggleJobType(type)}
                        className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
                        style={{
                          background: sel ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'rgba(255,255,255,0.05)',
                          color: sel ? '#fff' : '#6b7280',
                          border: '1px solid rgba(255,255,255,0.08)',
                        }}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Preferred Location</label>
                <input className={inputClass} style={inputStyle} placeholder="Las Vegas, NV or Remote" value={profile.preferredLocation} onChange={(e) => save({ preferredLocation: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Salary Range: <span className="text-white">${profile.salaryMin.toLocaleString()} – ${profile.salaryMax.toLocaleString()}</span></label>
                <div className="space-y-2">
                  <input type="range" min="20000" max="150000" step="5000" value={profile.salaryMin}
                    onChange={(e) => save({ salaryMin: Number(e.target.value) })}
                    className="w-full accent-blue-500" />
                  <input type="range" min="20000" max="200000" step="5000" value={profile.salaryMax}
                    onChange={(e) => save({ salaryMax: Number(e.target.value) })}
                    className="w-full accent-violet-500" />
                </div>
                <div className="flex justify-between text-xs text-slate-600 mt-1">
                  <span>$20k</span><span>Min ↑ Max ↑</span><span>$200k</span>
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Industries of Interest</label>
                <div className="flex flex-wrap gap-2">
                  {INDUSTRIES.map((ind) => {
                    const sel = profile.industries.includes(ind);
                    return (
                      <button key={ind} onClick={() => toggleIndustry(ind)}
                        className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
                        style={{
                          background: sel ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.05)',
                          color: sel ? '#c4b5fd' : '#6b7280',
                          border: sel ? '1px solid rgba(139,92,246,0.4)' : '1px solid rgba(255,255,255,0.08)',
                        }}
                      >
                        {ind}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Dream Job */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-white mb-1">Your Dream Job</h2>
                <p className="text-sm text-slate-400">Claude AI uses this to personalize your job matching. Be specific!</p>
              </div>
              <textarea
                className={inputClass + ' resize-none'}
                style={{ ...inputStyle, minHeight: '180px' }}
                placeholder="I want to work as a cybersecurity analyst at a federal agency, analyzing threats and protecting government systems. I'm passionate about digital forensics and would love to work on incident response teams..."
                value={profile.dreamJob}
                onChange={(e) => save({ dreamJob: e.target.value })}
              />
              <div className="rounded-xl p-4" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
                <p className="text-xs text-blue-300">
                  <span className="font-semibold">Tip:</span> Mention specific roles, company types, technologies, and what excites you. The more detail, the better your AI match scores will be.
                </p>
              </div>
            </div>
          )}

          {/* Step 5: Resume */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-white mb-1">Upload Resume <span className="text-slate-500 font-normal text-sm">(optional)</span></h2>
                <p className="text-sm text-slate-400">Paste your resume text and Claude will extract your skills automatically</p>
              </div>
              <textarea
                className={inputClass + ' resize-none font-mono text-xs'}
                style={{ ...inputStyle, minHeight: '220px' }}
                placeholder="Paste your resume text here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
              {resumeText.trim() && (
                <button
                  onClick={extractSkillsFromResume}
                  disabled={extracting}
                  className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
                >
                  {extracting ? 'Extracting skills...' : 'Extract Skills from Resume'}
                </button>
              )}
              {profile.skills.length > 0 && (
                <div className="rounded-xl p-4" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
                  <p className="text-xs text-green-400 font-semibold mb-2">Skills in your profile ({profile.skills.length})</p>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.skills.map((s) => (
                      <span key={s.name} className="px-2 py-0.5 rounded text-xs text-green-300" style={{ background: 'rgba(34,197,94,0.1)' }}>{s.name}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {step > 0 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                ← Back
              </button>
            ) : <div />}
            {step < STEPS.length - 1 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
              >
                Continue →
              </button>
            ) : (
              <button
                onClick={finish}
                disabled={saving}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}
              >
                {saving ? 'Saving...' : 'Find My Jobs 🚀'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
