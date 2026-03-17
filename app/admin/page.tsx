'use client';

import { useState, useEffect, useCallback } from 'react';

interface Stats {
  activeMembers: string;
  eventsHosted: string;
  projectsBuilt: string;
  yearsActive: string;
}

interface SiteSettings {
  recruitingBanner: string;
  meetingDay: string;
  meetingTime: string;
  meetingLocation: string;
  lastUpdated?: string;
}

interface Member {
  id: string;
  name: string;
  role: string;
  memberType: 'advisor' | 'officer' | 'member';
  majors: string[];
  focusArea: string;
  status: string;
  avatarUrl: string;
  skills: string[];
  projects: string[];
  github: string;
  linkedin: string;
  twitter: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  location: string;
  type: 'upcoming' | 'past';
  rsvpUrl?: string;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  major: string;
  reason: string;
  submittedAt: string;
}

interface PartnerInquiry {
  id: string;
  inquiryType: 'project' | 'internship';
  companyName: string;
  contactName: string;
  email: string;
  description: string;
  submittedAt: string;
  projectType?: string;
  timeline?: string;
  positionTitle?: string;
  duration?: string;
  compensation?: string;
  requiredSkills?: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  tags: string[];
  gradient: string;
  github: string;
}

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? '';

const GRADIENTS = [
  { label: 'Blue → Cyan', value: 'from-blue-500 to-cyan-500' },
  { label: 'Violet → Purple', value: 'from-violet-500 to-purple-600' },
  { label: 'Pink → Rose', value: 'from-pink-500 to-rose-500' },
  { label: 'Green → Emerald', value: 'from-green-500 to-emerald-500' },
  { label: 'Orange → Amber', value: 'from-orange-500 to-amber-500' },
  { label: 'Sky → Indigo', value: 'from-sky-500 to-indigo-500' },
];

const emptyProject: Omit<Project, 'id'> = {
  name: '', description: '', tags: [], gradient: GRADIENTS[0].value, github: '',
};

const emptyMember: Omit<Member, 'id'> = {
  name: '', role: '', memberType: 'member', majors: [], focusArea: '', status: '', avatarUrl: '', skills: [], projects: [], github: '', linkedin: '', twitter: '',
};

const emptyEvent: Omit<Event, 'id'> = {
  title: '', date: '', description: '', location: '', type: 'upcoming',
};

// ─── Auth Gate ──────────────────────────────────────────────────────────────
function AuthGate({ onAuth }: { onAuth: () => void }) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      onAuth();
    } else {
      setError(true);
      setPw('');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-500/30">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Enter the admin password to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-[#1e2d45] rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Password</label>
            <input
              type="password"
              value={pw}
              onChange={(e) => { setPw(e.target.value); setError(false); }}
              placeholder="Enter password"
              autoFocus
              className="w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all"
            />
            {error && (
              <p className="text-red-400 text-xs mt-2">Incorrect password. Try again.</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Member Form Modal ───────────────────────────────────────────────────────
function MemberModal({
  member,
  onSave,
  onClose,
}: {
  member: Member | null;
  onSave: (data: Omit<Member, 'id'>) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Omit<Member, 'id'>>(
    member ? { ...member } : { ...emptyMember }
  );
  const [majorsStr, setMajorsStr] = useState((member?.majors ?? []).join(', '));
  const [skillsStr, setSkillsStr] = useState((member?.skills ?? []).join(', '));
  const [projectsStr, setProjectsStr] = useState((member?.projects ?? []).join(', '));
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave({
      ...form,
      majors: majorsStr.split(',').map((s) => s.trim()).filter(Boolean),
      skills: skillsStr.split(',').map((s) => s.trim()).filter(Boolean),
      projects: projectsStr.split(',').map((s) => s.trim()).filter(Boolean),
    });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-[#1e2d45] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-[#1e2d45]">
          <h2 className="text-slate-900 dark:text-white font-semibold text-lg">{member ? 'Edit Member' : 'Add Member'}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Member Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Member Type</label>
            <select
              name="memberType"
              value={form.memberType}
              onChange={handleChange}
              className="w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
            >
              <option value="member">Member</option>
              <option value="officer">Club Officer</option>
              <option value="advisor">Club Advisor</option>
            </select>
          </div>

          {/* Role (shown for officers and advisors) */}
          {(form.memberType === 'officer' || form.memberType === 'advisor') && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Role <span className="text-slate-500 font-normal">(e.g. President, Faculty Advisor)</span>
              </label>
              <input
                name="role"
                type="text"
                value={form.role}
                onChange={handleChange}
                placeholder={form.memberType === 'advisor' ? 'Faculty Advisor' : 'President'}
                className="w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
              />
            </div>
          )}

          {[
            { name: 'name', label: 'Full Name', placeholder: 'Alex Johnson' },
            { name: 'focusArea', label: 'Focus Area', placeholder: 'Web Development' },
            { name: 'status', label: 'Status', placeholder: 'Open to Opportunities · Interning at Microsoft · Graduating May 2026' },
            { name: 'avatarUrl', label: 'Photo URL', placeholder: 'https://example.com/photo.jpg (optional)' },
          ].map(({ name, label, placeholder }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{label}</label>
              <input
                name={name}
                type="text"
                required={name === 'name'}
                value={(form as Record<string, string | string[]>)[name] as string}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Majors <span className="text-slate-500 font-normal">(comma-separated)</span>
            </label>
            <input
              type="text"
              value={majorsStr}
              onChange={(e) => setMajorsStr(e.target.value)}
              placeholder="Cybersecurity Digital Forensics, Criminology"
              className="w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Skills <span className="text-slate-500 font-normal">(comma-separated)</span>
            </label>
            <input
              type="text"
              value={skillsStr}
              onChange={(e) => setSkillsStr(e.target.value)}
              placeholder="Canvas Apps, Power Automate, React, Python"
              className="w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Projects <span className="text-slate-500 font-normal">(comma-separated)</span></label>
            <input
              type="text"
              value={projectsStr}
              onChange={(e) => setProjectsStr(e.target.value)}
              placeholder="Project A, Project B"
              className="w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 pt-1">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Social Links (optional)</p>
            {[
              { name: 'github', label: 'GitHub URL', placeholder: 'https://github.com/username' },
              { name: 'linkedin', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/in/username' },
              { name: 'twitter', label: 'Twitter / X URL', placeholder: 'https://twitter.com/username' },
            ].map(({ name, label, placeholder }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">{label}</label>
                <input
                  name={name}
                  type="url"
                  value={(form as Record<string, string | string[]>)[name] as string}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
                />
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-slate-200 dark:border-[#1e2d45] text-slate-500 dark:text-slate-400 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-sm font-medium">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl hover:opacity-90 transition-opacity text-sm font-semibold disabled:opacity-50">
              {saving ? 'Saving...' : member ? 'Save Changes' : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Event Form Modal ────────────────────────────────────────────────────────
function EventModal({
  event,
  onSave,
  onClose,
}: {
  event: Event | null;
  onSave: (data: Omit<Event, 'id'>) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Omit<Event, 'id'>>(
    event ? { ...event } : { ...emptyEvent }
  );
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-[#1e2d45] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-[#1e2d45]">
          <h2 className="text-slate-900 dark:text-white font-semibold text-lg">{event ? 'Edit Event' : 'Add Event'}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Event Title</label>
            <input name="title" type="text" required value={form.title} onChange={handleChange} placeholder="Spring Hackathon 2026" className="w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Date</label>
            <input name="date" type="date" required value={form.date} onChange={handleChange} className="w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all [color-scheme:dark]" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Location</label>
            <input name="location" type="text" required value={form.location} onChange={handleChange} placeholder="Engineering Building, Room 101" className="w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Type</label>
            <select name="type" value={form.type} onChange={handleChange} className="w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all">
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
            <textarea name="description" required rows={4} value={form.description} onChange={handleChange} placeholder="Describe the event..." className="w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all resize-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              RSVP Link <span className="text-slate-500 font-normal">(optional — Google Form, etc.)</span>
            </label>
            <input name="rsvpUrl" type="url" value={form.rsvpUrl ?? ''} onChange={handleChange} placeholder="https://forms.google.com/..." className="w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-slate-200 dark:border-[#1e2d45] text-slate-500 dark:text-slate-400 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-sm font-medium">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl hover:opacity-90 transition-opacity text-sm font-semibold disabled:opacity-50">
              {saving ? 'Saving...' : event ? 'Save Changes' : 'Add Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Project Form Modal ──────────────────────────────────────────────────────
function ProjectModal({
  project,
  onSave,
  onClose,
}: {
  project: Project | null;
  onSave: (data: Omit<Project, 'id'>) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Omit<Project, 'id'>>(
    project ? { ...project } : { ...emptyProject }
  );
  const [tagsStr, setTagsStr] = useState((project?.tags ?? []).join(', '));
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave({ ...form, tags: tagsStr.split(',').map((t) => t.trim()).filter(Boolean) });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-[#1e2d45] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-[#1e2d45]">
          <h2 className="text-slate-900 dark:text-white font-semibold text-lg">{project ? 'Edit Project' : 'Add Project'}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Project Name</label>
            <input
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="My Awesome Project"
              className="w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
            <textarea
              name="description"
              required
              rows={3}
              value={form.description}
              onChange={handleChange}
              placeholder="What does this project do?"
              className="w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Tags <span className="text-slate-500 font-normal">(comma-separated)</span></label>
            <input
              type="text"
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
              placeholder="Python, React, FastAPI"
              className="w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Color</label>
            <select
              name="gradient"
              value={form.gradient}
              onChange={handleChange}
              className="w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
            >
              {GRADIENTS.map((g) => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </select>
            <div className={`mt-2 h-1.5 rounded-full bg-gradient-to-r ${form.gradient}`} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">GitHub URL <span className="text-slate-500 font-normal">(optional)</span></label>
            <input
              name="github"
              type="url"
              value={form.github}
              onChange={handleChange}
              placeholder="https://github.com/org/repo"
              className="w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-slate-200 dark:border-[#1e2d45] text-slate-500 dark:text-slate-400 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-sm font-medium">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl hover:opacity-90 transition-opacity text-sm font-semibold disabled:opacity-50">
              {saving ? 'Saving...' : project ? 'Save Changes' : 'Add Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

type TabId = 'members' | 'events' | 'contacts' | 'partners' | 'projects' | 'stats' | 'settings';

// ─── Dashboard ───────────────────────────────────────────────────────────────
function Dashboard() {
  const [tab, setTabRaw] = useState<TabId>('members');
  const [members, setMembers] = useState<Member[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [partners, setPartners] = useState<PartnerInquiry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<Stats>({ activeMembers: '', eventsHosted: '', projectsBuilt: '', yearsActive: '' });
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({ recruitingBanner: '', meetingDay: '', meetingTime: '', meetingLocation: '' });
  const [loading, setLoading] = useState(true);

  // Search & sort
  const [membersSearch, setMembersSearch] = useState('');
  const [contactsSort, setContactsSort] = useState<'newest' | 'oldest'>('newest');
  const [partnersSort, setPartnersSort] = useState<'newest' | 'oldest'>('newest');

  // Bulk select
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [selectedPartners, setSelectedPartners] = useState<string[]>([]);

  // Unread tracking
  const [lastSeenContacts, setLastSeenContacts] = useState<number>(0);
  const [lastSeenPartners, setLastSeenPartners] = useState<number>(0);

  useEffect(() => {
    setLastSeenContacts(Number(localStorage.getItem('lastSeen_contacts') ?? 0));
    setLastSeenPartners(Number(localStorage.getItem('lastSeen_partners') ?? 0));
  }, []);

  const setTab = (id: TabId) => {
    setTabRaw(id);
    if (id === 'contacts') {
      const now = Date.now();
      localStorage.setItem('lastSeen_contacts', String(now));
      setLastSeenContacts(now);
    }
    if (id === 'partners') {
      const now = Date.now();
      localStorage.setItem('lastSeen_partners', String(now));
      setLastSeenPartners(now);
    }
  };

  const unreadContacts = contacts.filter((c) => new Date(c.submittedAt).getTime() > lastSeenContacts).length;
  const unreadPartners = partners.filter((p) => new Date(p.submittedAt).getTime() > lastSeenPartners).length;

  const [memberModal, setMemberModal] = useState<{ open: boolean; member: Member | null }>({ open: false, member: null });
  const [eventModal, setEventModal] = useState<{ open: boolean; event: Event | null }>({ open: false, event: null });
  const [projectModal, setProjectModal] = useState<{ open: boolean; project: Project | null }>({ open: false, project: null });
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'member' | 'event' | 'project'; id: string } | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [m, e, c, pt, p, s, st] = await Promise.all([
      fetch('/api/members').then((r) => r.json()),
      fetch('/api/events').then((r) => r.json()),
      fetch('/api/contact').then((r) => r.json()),
      fetch('/api/hire').then((r) => r.json()),
      fetch('/api/projects').then((r) => r.json()),
      fetch('/api/stats').then((r) => r.json()),
      fetch('/api/settings').then((r) => r.json()),
    ]);
    setMembers(m);
    setEvents(e);
    setContacts(c);
    setPartners(pt);
    setProjects(p);
    setStats(s);
    setSiteSettings(st);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Member CRUD
  const saveMember = async (data: Omit<Member, 'id'>) => {
    if (memberModal.member) {
      await fetch(`/api/members/${memberModal.member.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    } else {
      await fetch('/api/members', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    }
    setMemberModal({ open: false, member: null });
    fetchData();
  };

  const deleteMember = async (id: string) => {
    await fetch(`/api/members/${id}`, { method: 'DELETE' });
    setDeleteConfirm(null);
    fetchData();
  };

  // Event CRUD
  const saveEvent = async (data: Omit<Event, 'id'>) => {
    if (eventModal.event) {
      await fetch(`/api/events/${eventModal.event.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    } else {
      await fetch('/api/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    }
    setEventModal({ open: false, event: null });
    fetchData();
  };

  const deleteEvent = async (id: string) => {
    await fetch(`/api/events/${id}`, { method: 'DELETE' });
    setDeleteConfirm(null);
    fetchData();
  };

  // Project CRUD
  const saveProject = async (data: Omit<Project, 'id'>) => {
    if (projectModal.project) {
      await fetch(`/api/projects/${projectModal.project.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    } else {
      await fetch('/api/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    }
    setProjectModal({ open: false, project: null });
    fetchData();
  };

  const deleteProject = async (id: string) => {
    await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    setDeleteConfirm(null);
    fetchData();
  };

  const tabs = [
    { id: 'members' as const, label: 'Members', count: members.length, unread: 0 },
    { id: 'events' as const, label: 'Events', count: events.length, unread: 0 },
    { id: 'projects' as const, label: 'Projects', count: projects.length, unread: 0 },
    { id: 'contacts' as const, label: 'Contacts', count: contacts.length, unread: unreadContacts },
    { id: 'partners' as const, label: 'Partners', count: partners.length, unread: unreadPartners },
    { id: 'stats' as const, label: 'Stats', count: null, unread: 0 },
    { id: 'settings' as const, label: 'Settings', count: null, unread: 0 },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Manage members, events, and contact submissions</p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-600 dark:bg-green-500/10 dark:border-green-500/20 dark:text-green-400 text-xs px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
          Authenticated
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {tabs.filter((t) => t.count !== null).map(({ id, label, count, unread }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`relative bg-white dark:bg-[#0d1424] border rounded-xl p-4 text-center transition-all hover:-translate-y-0.5 hover:border-violet-500/40 ${
              tab === id ? 'border-violet-500/50 shadow-lg shadow-violet-500/10' : 'border-slate-200 dark:border-[#1e2d45]'
            }`}
          >
            {unread > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-violet-500 rounded-full animate-pulse dark:bg-violet-400" />
            )}
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{count}</div>
            <div className="text-slate-500 text-sm">{label}</div>
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="overflow-x-auto mb-6 pb-1">
        <div className="flex gap-1 bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-[#1e2d45] rounded-xl p-1 w-fit min-w-full sm:min-w-0">
          {tabs.map(({ id, label, unread }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                tab === id
                  ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {label}
              {unread > 0 && (
                <span className={`flex items-center justify-center w-4 h-4 rounded-full text-xs font-bold ${
                  tab === id ? 'bg-white/20 text-white' : 'bg-violet-500/20 text-violet-300'
                }`}>
                  {unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-500">Loading...</div>
      ) : (
        <>
          {/* Members Tab */}
          {tab === 'members' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">All Members</h2>
                  {members.length > 0 && (
                    <p className="text-slate-500 text-xs mt-0.5">
                      {members.filter(m => m.memberType === 'advisor').length} Advisor{members.filter(m => m.memberType === 'advisor').length !== 1 ? 's' : ''} · {members.filter(m => m.memberType === 'officer').length} Officer{members.filter(m => m.memberType === 'officer').length !== 1 ? 's' : ''} · {members.filter(m => m.memberType === 'member' || !m.memberType).length} Member{members.filter(m => m.memberType === 'member' || !m.memberType).length !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      value={membersSearch}
                      onChange={(e) => setMembersSearch(e.target.value)}
                      placeholder="Search members..."
                      className="bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-violet-500/50 transition-all w-48"
                    />
                  </div>
                  <button
                  onClick={() => setMemberModal({ open: true, member: null })}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Member
                </button>
                </div>
              </div>

              {members.length === 0 ? (
                <div className="text-center py-16 text-slate-500 border border-slate-200 dark:border-[#1e2d45] rounded-2xl">No members yet.</div>
              ) : (
                <div className="space-y-3">
                  {members.filter((m) => {
                    if (!membersSearch.trim()) return true;
                    const q = membersSearch.toLowerCase();
                    return m.name.toLowerCase().includes(q) || (m.majors ?? []).join(' ').toLowerCase().includes(q) || m.role.toLowerCase().includes(q) || m.focusArea.toLowerCase().includes(q);
                  }).map((m) => (
                    <div key={m.id} className="bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-[#1e2d45] rounded-xl p-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {m.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-900 dark:text-white font-medium">{m.name}</span>
                          {m.memberType === 'advisor' && (
                            <span className="text-xs bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full flex-shrink-0">Advisor</span>
                          )}
                          {m.memberType === 'officer' && (
                            <span className="text-xs bg-violet-500/10 border border-violet-500/20 text-violet-400 px-2 py-0.5 rounded-full flex-shrink-0">{m.role || 'Officer'}</span>
                          )}
                        </div>
                        <div className="text-slate-500 text-sm truncate">{(m.majors ?? []).join(', ')}{m.focusArea ? ` · ${m.focusArea}` : ''}</div>
                      </div>
                      <div className="hidden md:flex flex-wrap gap-1.5 max-w-xs">
                        {m.projects.map((p) => (
                          <span key={p} className="text-xs bg-slate-100 dark:bg-white/5 border border-white/10 text-slate-400 px-2 py-0.5 rounded">
                            {p}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => setMemberModal({ open: true, member: m })}
                          className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ type: 'member', id: m.id })}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Events Tab */}
          {tab === 'events' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">All Events</h2>
                <button
                  onClick={() => setEventModal({ open: true, event: null })}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Event
                </button>
              </div>

              {events.length === 0 ? (
                <div className="text-center py-16 text-slate-500 border border-slate-200 dark:border-[#1e2d45] rounded-2xl">No events yet.</div>
              ) : (
                <div className="space-y-3">
                  {events.map((ev) => (
                    <div key={ev.id} className="bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-[#1e2d45] rounded-xl p-4 flex items-center gap-4">
                      <div className={`flex-shrink-0 px-3 py-2 rounded-lg text-center min-w-[52px] ${ev.type === 'upcoming' ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-slate-700/20 border border-slate-700/30'}`}>
                        <div className={`text-xs font-semibold ${ev.type === 'upcoming' ? 'text-blue-400' : 'text-slate-500'}`}>
                          {new Date(ev.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                        </div>
                        <div className={`text-xl font-bold ${ev.type === 'upcoming' ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                          {new Date(ev.date + 'T00:00:00').getDate()}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-900 dark:text-white font-medium truncate">{ev.title}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${ev.type === 'upcoming' ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-700/30 text-slate-500'}`}>
                            {ev.type}
                          </span>
                        </div>
                        <div className="text-slate-500 text-sm truncate">{ev.location}</div>
                      </div>
                      <button
                        onClick={() => setEventModal({ open: true, event: ev })}
                        className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all flex-shrink-0"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({ type: 'event', id: ev.id })}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all flex-shrink-0"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Projects Tab */}
          {tab === 'projects' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Featured Projects</h2>
                <button
                  onClick={() => setProjectModal({ open: true, project: null })}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Project
                </button>
              </div>

              {projects.length === 0 ? (
                <div className="text-center py-16 text-slate-500 border border-slate-200 dark:border-[#1e2d45] rounded-2xl">No projects yet. Add one to feature it on the home page.</div>
              ) : (
                <div className="space-y-3">
                  {projects.map((proj) => (
                    <div key={proj.id} className="bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-[#1e2d45] rounded-xl overflow-hidden">
                      <div className={`h-1 bg-gradient-to-r ${proj.gradient}`} />
                      <div className="p-4 flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="text-slate-900 dark:text-white font-medium">{proj.name}</div>
                          <div className="text-slate-500 text-sm truncate mt-0.5">{proj.description}</div>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {proj.tags.map((t) => (
                              <span key={t} className="text-xs bg-slate-100 dark:bg-white/5 border border-white/10 text-slate-400 px-2 py-0.5 rounded">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => setProjectModal({ open: true, project: proj })}
                            className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ type: 'project', id: proj.id })}
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Stats Tab */}
          {tab === 'stats' && (
            <div>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Homepage Stats</h2>
                <p className="text-slate-500 text-sm mt-1">These values appear in the stats bar on the home page.</p>
              </div>
              <div className="bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-[#1e2d45] rounded-2xl p-6">
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  {[
                    { key: 'activeMembers' as const, label: 'Active Members', placeholder: '25+' },
                    { key: 'eventsHosted' as const, label: 'Events Hosted', placeholder: '10+' },
                    { key: 'projectsBuilt' as const, label: 'Projects Built', placeholder: '15+' },
                    { key: 'yearsActive' as const, label: 'Years Active', placeholder: '3+' },
                  ].map(({ key, label, placeholder }) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{label}</label>
                      <input
                        type="text"
                        value={stats[key]}
                        onChange={(e) => setStats((s) => ({ ...s, [key]: e.target.value }))}
                        placeholder={placeholder}
                        className="w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
                      />
                    </div>
                  ))}
                </div>
                <button
                  onClick={async () => {
                    await fetch('/api/stats', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(stats) });
                    fetchData();
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
                >
                  Save Stats
                </button>
              </div>
            </div>
          )}

          {/* Partners Tab */}
          {tab === 'partners' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Partner Inquiries</h2>
                  <div className="flex rounded-lg border border-slate-200 dark:border-[#1e2d45] overflow-hidden text-xs">
                    {(['newest', 'oldest'] as const).map((s) => (
                      <button key={s} onClick={() => setPartnersSort(s)}
                        className={`px-3 py-1.5 font-medium transition-colors capitalize ${partnersSort === s ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                  {selectedPartners.length > 0 && (
                    <button
                      onClick={async () => {
                        if (!confirm(`Delete ${selectedPartners.length} selected inquiry${selectedPartners.length !== 1 ? 'ies' : ''}?`)) return;
                        await Promise.all(selectedPartners.map((id) => fetch(`/api/hire/${id}`, { method: 'DELETE' })));
                        setSelectedPartners([]);
                        fetchData();
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium rounded-lg hover:bg-red-500/20 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete {selectedPartners.length}
                    </button>
                  )}
                </div>
                {partners.length > 0 && (
                  <button
                    onClick={() => {
                      const headers = ['Company', 'Contact', 'Email', 'Project Type', 'Timeline', 'Description', 'Submitted'];
                      const rows = partners.map((p) => [
                        p.companyName,
                        p.contactName,
                        p.email,
                        p.projectType,
                        p.timeline,
                        `"${p.description.replace(/"/g, '""')}"`,
                        new Date(p.submittedAt).toLocaleString(),
                      ]);
                      const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
                      const blob = new Blob([csv], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `lc3-partners-${new Date().toISOString().slice(0, 10)}.csv`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-[#1e2d45] text-slate-300 text-sm font-medium rounded-xl hover:border-violet-500/40 hover:text-slate-900 dark:hover:text-white transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Export CSV
                  </button>
                )}
              </div>
              {partners.length === 0 ? (
                <div className="text-center py-16 text-slate-500 border border-slate-200 dark:border-[#1e2d45] rounded-2xl">No inquiries yet.</div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      id="selectAllPartners"
                      checked={selectedPartners.length === partners.length}
                      onChange={(e) => setSelectedPartners(e.target.checked ? partners.map((p) => p.id) : [])}
                      className="w-4 h-4 accent-violet-500 cursor-pointer"
                    />
                    <label htmlFor="selectAllPartners" className="text-slate-500 text-xs cursor-pointer select-none">
                      Select all
                    </label>
                  </div>
                  <div className="space-y-3">
                  {[...partners].sort((a, b) => {
                    const diff = new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
                    return partnersSort === 'newest' ? diff : -diff;
                  }).map((p) => (
                    <div key={p.id} className={`bg-white dark:bg-[#0d1424] border rounded-xl p-5 transition-colors ${selectedPartners.includes(p.id) ? 'border-violet-500/40' : 'border-slate-200 dark:border-[#1e2d45]'}`}>
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={selectedPartners.includes(p.id)}
                            onChange={(e) => setSelectedPartners(e.target.checked ? [...selectedPartners, p.id] : selectedPartners.filter((id) => id !== p.id))}
                            className="w-4 h-4 accent-violet-500 cursor-pointer mt-0.5"
                          />
                          <div>
                            <div className="text-slate-900 dark:text-white font-medium">{p.companyName}</div>
                            <div className="text-slate-500 text-sm">{p.contactName} · {p.email}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-slate-600 text-xs">
                            {new Date(p.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                          <button
                            onClick={async () => {
                              if (!confirm(`Delete inquiry from ${p.companyName}?`)) return;
                              await fetch(`/api/hire/${p.id}`, { method: 'DELETE' });
                              setSelectedPartners((s) => s.filter((id) => id !== p.id));
                              fetchData();
                            }}
                            className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {p.inquiryType === 'internship' ? (
                          <>
                            <span className="text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full">🎓 Internship</span>
                            {p.positionTitle && <span className="text-xs bg-slate-100 dark:bg-white/5 border border-white/10 text-slate-300 px-2.5 py-1 rounded-full">{p.positionTitle}</span>}
                            {p.duration && <span className="text-xs bg-slate-100 dark:bg-white/5 border border-white/10 text-slate-400 px-2.5 py-1 rounded-full">{p.duration}</span>}
                            {p.compensation && <span className="text-xs bg-slate-100 dark:bg-white/5 border border-white/10 text-slate-400 px-2.5 py-1 rounded-full">{p.compensation}</span>}
                          </>
                        ) : (
                          <>
                            <span className="text-xs bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2.5 py-1 rounded-full">🤝 Project</span>
                            {p.projectType && <span className="text-xs bg-slate-100 dark:bg-white/5 border border-white/10 text-slate-400 px-2.5 py-1 rounded-full">{p.projectType}</span>}
                            {p.timeline && <span className="text-xs bg-slate-100 dark:bg-white/5 border border-white/10 text-slate-400 px-2.5 py-1 rounded-full">{p.timeline}</span>}
                          </>
                        )}
                      </div>
                      {p.inquiryType === 'internship' && p.requiredSkills && (
                        <p className="text-slate-500 text-xs mb-2">Skills: {p.requiredSkills}</p>
                      )}
                      <p className="text-slate-400 text-sm leading-relaxed bg-white dark:bg-[#111a2e] rounded-lg p-3">{p.description}</p>
                    </div>
                  ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {tab === 'settings' && (
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Site Settings</h2>
                  <p className="text-slate-500 text-sm mt-1">Control site-wide content like the recruiting banner and meeting details.</p>
                </div>
                {siteSettings.lastUpdated && (
                  <div className="text-xs text-slate-600 text-right flex-shrink-0">
                    <span className="block">Last saved</span>
                    <span className="text-slate-500">
                      {new Date(siteSettings.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      {' · '}
                      {new Date(siteSettings.lastUpdated).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </span>
                  </div>
                )}
              </div>
              <div className="bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-[#1e2d45] rounded-2xl p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Recruiting Banner <span className="text-slate-500 font-normal">(leave blank to hide)</span>
                  </label>
                  <input
                    type="text"
                    value={siteSettings.recruitingBanner}
                    onChange={(e) => setSiteSettings((s) => ({ ...s, recruitingBanner: e.target.value }))}
                    placeholder="Now recruiting for Spring 2026"
                    className="w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
                  />
                </div>

                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-3">Weekly Meeting Info</p>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {[
                      { key: 'meetingDay' as const, label: 'Day', placeholder: 'Thursday' },
                      { key: 'meetingTime' as const, label: 'Time', placeholder: '6:00 PM' },
                      { key: 'meetingLocation' as const, label: 'Location', placeholder: 'Engineering Building, Room 101' },
                    ].map(({ key, label, placeholder }) => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-slate-400 mb-1.5">{label}</label>
                        <input
                          type="text"
                          value={siteSettings[key]}
                          onChange={(e) => setSiteSettings((s) => ({ ...s, [key]: e.target.value }))}
                          placeholder={placeholder}
                          className="w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={async () => {
                    await fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(siteSettings) });
                    fetchData();
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
                >
                  Save Settings
                </button>
              </div>
            </div>
          )}

          {/* Contacts Tab */}
          {tab === 'contacts' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Contact Submissions</h2>
                  <div className="flex rounded-lg border border-slate-200 dark:border-[#1e2d45] overflow-hidden text-xs">
                    {(['newest', 'oldest'] as const).map((s) => (
                      <button key={s} onClick={() => setContactsSort(s)}
                        className={`px-3 py-1.5 font-medium transition-colors capitalize ${contactsSort === s ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                  {selectedContacts.length > 0 && (
                    <button
                      onClick={async () => {
                        if (!confirm(`Delete ${selectedContacts.length} selected submission${selectedContacts.length !== 1 ? 's' : ''}?`)) return;
                        await Promise.all(selectedContacts.map((id) => fetch(`/api/contact/${id}`, { method: 'DELETE' })));
                        setSelectedContacts([]);
                        fetchData();
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium rounded-lg hover:bg-red-500/20 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete {selectedContacts.length}
                    </button>
                  )}
                </div>
                {contacts.length > 0 && (
                  <button
                    onClick={() => {
                      const headers = ['Name', 'Email', 'Major', 'Message', 'Submitted'];
                      const rows = contacts.map((c) => [
                        c.name,
                        c.email,
                        c.major,
                        `"${c.reason.replace(/"/g, '""')}"`,
                        new Date(c.submittedAt).toLocaleString(),
                      ]);
                      const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
                      const blob = new Blob([csv], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `lc3-contacts-${new Date().toISOString().slice(0, 10)}.csv`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-[#1e2d45] text-slate-300 text-sm font-medium rounded-xl hover:border-violet-500/40 hover:text-slate-900 dark:hover:text-white transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Export CSV
                  </button>
                )}
              </div>
              {contacts.length === 0 ? (
                <div className="text-center py-16 text-slate-500 border border-slate-200 dark:border-[#1e2d45] rounded-2xl">No submissions yet.</div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      id="selectAllContacts"
                      checked={selectedContacts.length === contacts.length}
                      onChange={(e) => setSelectedContacts(e.target.checked ? contacts.map((c) => c.id) : [])}
                      className="w-4 h-4 accent-violet-500 cursor-pointer"
                    />
                    <label htmlFor="selectAllContacts" className="text-slate-500 text-xs cursor-pointer select-none">
                      Select all
                    </label>
                  </div>
                  <div className="space-y-3">
                    {[...contacts].sort((a, b) => {
                      const diff = new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
                      return contactsSort === 'newest' ? diff : -diff;
                    }).map((c) => (
                      <div key={c.id} className={`bg-white dark:bg-[#0d1424] border rounded-xl p-5 transition-colors ${selectedContacts.includes(c.id) ? 'border-violet-500/40' : 'border-slate-200 dark:border-[#1e2d45]'}`}>
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={selectedContacts.includes(c.id)}
                              onChange={(e) => setSelectedContacts(e.target.checked ? [...selectedContacts, c.id] : selectedContacts.filter((id) => id !== c.id))}
                              className="w-4 h-4 accent-violet-500 cursor-pointer mt-0.5"
                            />
                            <div>
                              <div className="text-slate-900 dark:text-white font-medium">{c.name}</div>
                              <div className="text-slate-500 text-sm">{c.email} · {c.major}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-slate-600 text-xs">
                              {new Date(c.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                            <button
                              onClick={async () => {
                                if (!confirm(`Delete submission from ${c.name}?`)) return;
                                await fetch(`/api/contact/${c.id}`, { method: 'DELETE' });
                                setSelectedContacts((s) => s.filter((id) => id !== c.id));
                                fetchData();
                              }}
                              className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                              title="Delete"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed bg-white dark:bg-[#111a2e] rounded-lg p-3">{c.reason}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}

      {/* Member Modal */}
      {memberModal.open && (
        <MemberModal
          member={memberModal.member}
          onSave={saveMember}
          onClose={() => setMemberModal({ open: false, member: null })}
        />
      )}

      {/* Event Modal */}
      {eventModal.open && (
        <EventModal event={eventModal.event} onSave={saveEvent} onClose={() => setEventModal({ open: false, event: null })} />
      )}

      {/* Project Modal */}
      {projectModal.open && (
        <ProjectModal
          project={projectModal.project}
          onSave={saveProject}
          onClose={() => setProjectModal({ open: false, project: null })}
        />
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-[#1e2d45] rounded-2xl p-6 w-full max-w-sm text-center">
            <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-slate-900 dark:text-white font-semibold mb-2">Confirm Delete</h3>
            <p className="text-slate-400 text-sm mb-6">
              Are you sure you want to delete this {deleteConfirm.type}? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 border border-slate-200 dark:border-[#1e2d45] text-slate-500 dark:text-slate-400 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deleteConfirm.type === 'member') deleteMember(deleteConfirm.id);
                  else if (deleteConfirm.type === 'event') deleteEvent(deleteConfirm.id);
                  else deleteProject(deleteConfirm.id);
                }}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-sm font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  return authed ? <Dashboard /> : <AuthGate onAuth={() => setAuthed(true)} />;
}
