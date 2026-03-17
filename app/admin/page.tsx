'use client';

import { useState, useEffect, useCallback } from 'react';

interface Member {
  id: string;
  name: string;
  major: string;
  focusArea: string;
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
}

interface Contact {
  id: string;
  name: string;
  email: string;
  major: string;
  reason: string;
  submittedAt: string;
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
  name: '', major: '', focusArea: '', projects: [], github: '', linkedin: '', twitter: '',
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
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Enter the admin password to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#0f0f1a] border border-[#1e1e2e] rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <input
              type="password"
              value={pw}
              onChange={(e) => { setPw(e.target.value); setError(false); }}
              placeholder="Enter password"
              autoFocus
              className="w-full bg-[#13131f] border border-[#1e1e2e] text-white placeholder:text-slate-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all"
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
  const [projectsStr, setProjectsStr] = useState((member?.projects ?? []).join(', '));
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave({ ...form, projects: projectsStr.split(',').map((s) => s.trim()).filter(Boolean) });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#0f0f1a] border border-[#1e1e2e] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-[#1e1e2e]">
          <h2 className="text-white font-semibold text-lg">{member ? 'Edit Member' : 'Add Member'}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {[
            { name: 'name', label: 'Full Name', placeholder: 'Alex Johnson' },
            { name: 'major', label: 'Major', placeholder: 'Computer Science' },
            { name: 'focusArea', label: 'Focus Area', placeholder: 'Web Development' },
          ].map(({ name, label, placeholder }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>
              <input
                name={name}
                type="text"
                required={name === 'name'}
                value={(form as Record<string, string | string[]>)[name] as string}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full bg-[#13131f] border border-[#1e1e2e] text-white placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Projects <span className="text-slate-500 font-normal">(comma-separated)</span></label>
            <input
              type="text"
              value={projectsStr}
              onChange={(e) => setProjectsStr(e.target.value)}
              placeholder="Project A, Project B"
              className="w-full bg-[#13131f] border border-[#1e1e2e] text-white placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
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
                  className="w-full bg-[#13131f] border border-[#1e1e2e] text-white placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
                />
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-[#1e1e2e] text-slate-400 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium">
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
  onSave,
  onClose,
}: {
  onSave: (data: Omit<Event, 'id'>) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Omit<Event, 'id'>>({ ...emptyEvent });
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
      <div className="bg-[#0f0f1a] border border-[#1e1e2e] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-[#1e1e2e]">
          <h2 className="text-white font-semibold text-lg">Add Event</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Event Title</label>
            <input name="title" type="text" required value={form.title} onChange={handleChange} placeholder="Spring Hackathon 2026" className="w-full bg-[#13131f] border border-[#1e1e2e] text-white placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Date</label>
            <input name="date" type="date" required value={form.date} onChange={handleChange} className="w-full bg-[#13131f] border border-[#1e1e2e] text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all [color-scheme:dark]" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Location</label>
            <input name="location" type="text" required value={form.location} onChange={handleChange} placeholder="Engineering Building, Room 101" className="w-full bg-[#13131f] border border-[#1e1e2e] text-white placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Type</label>
            <select name="type" value={form.type} onChange={handleChange} className="w-full bg-[#13131f] border border-[#1e1e2e] text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all">
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Description</label>
            <textarea name="description" required rows={4} value={form.description} onChange={handleChange} placeholder="Describe the event..." className="w-full bg-[#13131f] border border-[#1e1e2e] text-white placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all resize-none" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-[#1e1e2e] text-slate-400 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl hover:opacity-90 transition-opacity text-sm font-semibold disabled:opacity-50">
              {saving ? 'Saving...' : 'Add Event'}
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
      <div className="bg-[#0f0f1a] border border-[#1e1e2e] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-[#1e1e2e]">
          <h2 className="text-white font-semibold text-lg">{project ? 'Edit Project' : 'Add Project'}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Project Name</label>
            <input
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="My Awesome Project"
              className="w-full bg-[#13131f] border border-[#1e1e2e] text-white placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Description</label>
            <textarea
              name="description"
              required
              rows={3}
              value={form.description}
              onChange={handleChange}
              placeholder="What does this project do?"
              className="w-full bg-[#13131f] border border-[#1e1e2e] text-white placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Tags <span className="text-slate-500 font-normal">(comma-separated)</span></label>
            <input
              type="text"
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
              placeholder="Python, React, FastAPI"
              className="w-full bg-[#13131f] border border-[#1e1e2e] text-white placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Color</label>
            <select
              name="gradient"
              value={form.gradient}
              onChange={handleChange}
              className="w-full bg-[#13131f] border border-[#1e1e2e] text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
            >
              {GRADIENTS.map((g) => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </select>
            <div className={`mt-2 h-1.5 rounded-full bg-gradient-to-r ${form.gradient}`} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">GitHub URL <span className="text-slate-500 font-normal">(optional)</span></label>
            <input
              name="github"
              type="url"
              value={form.github}
              onChange={handleChange}
              placeholder="https://github.com/org/repo"
              className="w-full bg-[#13131f] border border-[#1e1e2e] text-white placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-[#1e1e2e] text-slate-400 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium">
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

// ─── Dashboard ───────────────────────────────────────────────────────────────
function Dashboard() {
  const [tab, setTab] = useState<'members' | 'events' | 'contacts' | 'projects'>('members');
  const [members, setMembers] = useState<Member[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const [memberModal, setMemberModal] = useState<{ open: boolean; member: Member | null }>({ open: false, member: null });
  const [eventModal, setEventModal] = useState(false);
  const [projectModal, setProjectModal] = useState<{ open: boolean; project: Project | null }>({ open: false, project: null });
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'member' | 'event' | 'project'; id: string } | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [m, e, c, p] = await Promise.all([
      fetch('/api/members').then((r) => r.json()),
      fetch('/api/events').then((r) => r.json()),
      fetch('/api/contact').then((r) => r.json()),
      fetch('/api/projects').then((r) => r.json()),
    ]);
    setMembers(m);
    setEvents(e);
    setContacts(c);
    setProjects(p);
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
    await fetch('/api/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    setEventModal(false);
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
    { id: 'members' as const, label: 'Members', count: members.length },
    { id: 'events' as const, label: 'Events', count: events.length },
    { id: 'projects' as const, label: 'Projects', count: projects.length },
    { id: 'contacts' as const, label: 'Contacts', count: contacts.length },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Manage members, events, and contact submissions</p>
        </div>
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 text-xs px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
          Authenticated
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {tabs.map(({ id, label, count }) => (
          <div key={id} className="bg-[#0f0f1a] border border-[#1e1e2e] rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">{count}</div>
            <div className="text-slate-500 text-sm">{label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#0f0f1a] border border-[#1e1e2e] rounded-xl p-1 mb-6 w-fit">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === id
                ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-500">Loading...</div>
      ) : (
        <>
          {/* Members Tab */}
          {tab === 'members' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">All Members</h2>
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

              {members.length === 0 ? (
                <div className="text-center py-16 text-slate-500 border border-[#1e1e2e] rounded-2xl">No members yet.</div>
              ) : (
                <div className="space-y-3">
                  {members.map((m) => (
                    <div key={m.id} className="bg-[#0f0f1a] border border-[#1e1e2e] rounded-xl p-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {m.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-medium">{m.name}</div>
                        <div className="text-slate-500 text-sm truncate">{m.major} · {m.focusArea}</div>
                      </div>
                      <div className="hidden md:flex flex-wrap gap-1.5 max-w-xs">
                        {m.projects.map((p) => (
                          <span key={p} className="text-xs bg-white/5 border border-white/10 text-slate-400 px-2 py-0.5 rounded">
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
                <h2 className="text-lg font-semibold text-white">All Events</h2>
                <button
                  onClick={() => setEventModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Event
                </button>
              </div>

              {events.length === 0 ? (
                <div className="text-center py-16 text-slate-500 border border-[#1e1e2e] rounded-2xl">No events yet.</div>
              ) : (
                <div className="space-y-3">
                  {events.map((ev) => (
                    <div key={ev.id} className="bg-[#0f0f1a] border border-[#1e1e2e] rounded-xl p-4 flex items-center gap-4">
                      <div className={`flex-shrink-0 px-3 py-2 rounded-lg text-center min-w-[52px] ${ev.type === 'upcoming' ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-slate-700/20 border border-slate-700/30'}`}>
                        <div className={`text-xs font-semibold ${ev.type === 'upcoming' ? 'text-blue-400' : 'text-slate-500'}`}>
                          {new Date(ev.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                        </div>
                        <div className={`text-xl font-bold ${ev.type === 'upcoming' ? 'text-white' : 'text-slate-400'}`}>
                          {new Date(ev.date + 'T00:00:00').getDate()}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium truncate">{ev.title}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${ev.type === 'upcoming' ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-700/30 text-slate-500'}`}>
                            {ev.type}
                          </span>
                        </div>
                        <div className="text-slate-500 text-sm truncate">{ev.location}</div>
                      </div>
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
                <h2 className="text-lg font-semibold text-white">Featured Projects</h2>
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
                <div className="text-center py-16 text-slate-500 border border-[#1e1e2e] rounded-2xl">No projects yet. Add one to feature it on the home page.</div>
              ) : (
                <div className="space-y-3">
                  {projects.map((proj) => (
                    <div key={proj.id} className="bg-[#0f0f1a] border border-[#1e1e2e] rounded-xl overflow-hidden">
                      <div className={`h-1 bg-gradient-to-r ${proj.gradient}`} />
                      <div className="p-4 flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-medium">{proj.name}</div>
                          <div className="text-slate-500 text-sm truncate mt-0.5">{proj.description}</div>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {proj.tags.map((t) => (
                              <span key={t} className="text-xs bg-white/5 border border-white/10 text-slate-400 px-2 py-0.5 rounded">
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

          {/* Contacts Tab */}
          {tab === 'contacts' && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">Contact Submissions</h2>
              {contacts.length === 0 ? (
                <div className="text-center py-16 text-slate-500 border border-[#1e1e2e] rounded-2xl">No submissions yet.</div>
              ) : (
                <div className="space-y-3">
                  {contacts.map((c) => (
                    <div key={c.id} className="bg-[#0f0f1a] border border-[#1e1e2e] rounded-xl p-5">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <div className="text-white font-medium">{c.name}</div>
                          <div className="text-slate-500 text-sm">{c.email} · {c.major}</div>
                        </div>
                        <div className="text-slate-600 text-xs flex-shrink-0">
                          {new Date(c.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed bg-[#13131f] rounded-lg p-3">{c.reason}</p>
                    </div>
                  ))}
                </div>
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
      {eventModal && (
        <EventModal onSave={saveEvent} onClose={() => setEventModal(false)} />
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
          <div className="bg-[#0f0f1a] border border-[#1e1e2e] rounded-2xl p-6 w-full max-w-sm text-center">
            <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">Confirm Delete</h3>
            <p className="text-slate-400 text-sm mb-6">
              Are you sure you want to delete this {deleteConfirm.type}? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 border border-[#1e1e2e] text-slate-400 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium"
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
