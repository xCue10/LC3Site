'use client';

import { useState, useEffect, useCallback } from 'react';

interface Stats {
  activeMembers: string;
  eventsHosted: string;
  projectsBuilt: string;
  yearsActive: string;
}

interface SocialLink {
  label: string;
  url: string;
}

interface SiteSettings {
  recruitingBanner: string;
  meetingDay: string;
  meetingTime: string;
  meetingLocation: string;
  lastUpdated?: string;
  socialLinks?: SocialLink[];
  socialLinksLive?: boolean;
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
  bio: string;
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

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  published: boolean;
  coverImage?: string;
}

interface Sponsor {
  id: string;
  name: string;
  logoUrl: string;
  website: string;
  tier: string;
}

interface SponsorsConfig {
  live: boolean;
  sectionTitle: string;
  sponsors: Sponsor[];
}

interface CaseStudy {
  id: string;
  client: string;
  title: string;
  description: string;
  outcome: string;
  tags: string[];
  link?: string;
}

interface CaseStudiesConfig {
  live: boolean;
  sectionTitle: string;
  caseStudies: CaseStudy[];
}

interface AboutValue {
  title: string;
  desc: string;
}

interface AboutActivity {
  title: string;
  desc: string;
}

interface AboutContent {
  heroTagline: string;
  heroDescription: string;
  mission: string;
  valuesTitle: string;
  valuesSubtitle: string;
  values: AboutValue[];
  techStackTitle: string;
  techStackSubtitle: string;
  techStack: string[];
  activitiesTitle: string;
  activitiesSubtitle: string;
  activities: AboutActivity[];
  ctaTitle: string;
  ctaDescription: string;
}

interface HomeMissionItem {
  title: string;
  desc: string;
}

interface HomeContent {
  primaryButtonLabel: string;
  secondaryButtonLabel: string;
  techStack: string[];
  companyCtaTitle: string;
  companyCtaDesc: string;
  missionItems: HomeMissionItem[];
  aboutEyebrow: string;
  aboutHeading: string;
  aboutBody1: string;
  aboutBody2: string;
  projectsEyebrow: string;
  projectsHeading: string;
  eventsEyebrow: string;
  eventsHeading: string;
  blogEyebrow: string;
  blogHeading: string;
  ctaHeading: string;
  ctaDescription: string;
  ctaButtonLabel: string;
}

interface PartnerInquiry {
  id: string;
  inquiryType: 'project' | 'internship' | 'speaker';
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
  topic?: string;
  availability?: string;
}

type ProjectStatus = 'in-progress' | 'completed' | 'open';

interface Project {
  id: string;
  name: string;
  description: string;
  tags: string[];
  gradient: string;
  github: string;
  contributors?: string[];
  status?: ProjectStatus;
}

const GRADIENTS = [
  { label: 'Blue → Cyan', value: 'from-blue-500 to-cyan-500' },
  { label: 'Violet → Purple', value: 'from-violet-500 to-purple-600' },
  { label: 'Pink → Rose', value: 'from-pink-500 to-rose-500' },
  { label: 'Green → Emerald', value: 'from-green-500 to-emerald-500' },
  { label: 'Orange → Amber', value: 'from-orange-500 to-amber-500' },
  { label: 'Sky → Indigo', value: 'from-sky-500 to-indigo-500' },
];

const emptyProject: Omit<Project, 'id'> = {
  name: '', description: '', tags: [], gradient: GRADIENTS[0].value, github: '', contributors: [], status: undefined,
};

const emptyMember: Omit<Member, 'id'> = {
  name: '', role: '', memberType: 'member', majors: [], focusArea: '', status: '', avatarUrl: '', bio: '', skills: [], projects: [], github: '', linkedin: '', twitter: '',
};

const emptyEvent: Omit<Event, 'id'> = {
  title: '', date: '', description: '', location: '', type: 'upcoming',
};

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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-[#1e2d45] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
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
              Bio <span className="text-slate-500 font-normal">(optional)</span>
            </label>
            <textarea
              name="bio"
              rows={3}
              value={form.bio}
              onChange={handleChange}
              placeholder="A short bio about this member..."
              className="w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all resize-none"
            />
          </div>

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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-[#1e2d45] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
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
  const [contributorsStr, setContributorsStr] = useState((project?.contributors ?? []).join(', '));
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave({
      ...form,
      tags: tagsStr.split(',').map((t) => t.trim()).filter(Boolean),
      contributors: contributorsStr.split(',').map((c) => c.trim()).filter(Boolean),
    });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-[#1e2d45] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
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

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Contributors <span className="text-slate-500 font-normal">(comma-separated names, optional)</span></label>
            <input
              type="text"
              value={contributorsStr}
              onChange={(e) => setContributorsStr(e.target.value)}
              placeholder="Alice Johnson, Bob Smith"
              className="w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Status <span className="text-slate-500 font-normal">(optional)</span></label>
            <select
              name="status"
              value={form.status ?? ''}
              onChange={(e) => setForm((p) => ({ ...p, status: (e.target.value as ProjectStatus) || undefined }))}
              className="w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
            >
              <option value="">— No status —</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="open">Open to Contributors</option>
            </select>
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

// ─── Post Modal ──────────────────────────────────────────────────────────────
interface PostForm { title: string; excerpt: string; content: string; published: boolean; coverImage: string; }
function PostModal({ post, onSave, onClose }: { post: Post | null; onSave: (d: PostForm) => Promise<void>; onClose: () => void }) {
  const [form, setForm] = useState<PostForm>(post ? { title: post.title, excerpt: post.excerpt, content: post.content, published: post.published, coverImage: post.coverImage || '' } : { title: '', excerpt: '', content: '', published: false, coverImage: '' });
  const [saving, setSaving] = useState(false);
  const inputCls = 'w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all';
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-[#1e2d45] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-[#1e2d45]">
          <h2 className="text-slate-900 dark:text-white font-semibold text-lg">{post ? 'Edit Post' : 'New Post'}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form onSubmit={async (e) => { e.preventDefault(); setSaving(true); await onSave(form); setSaving(false); }} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Title</label>
            <input type="text" required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="My Announcement" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Excerpt <span className="text-slate-400 font-normal">(short summary shown in list)</span></label>
            <textarea rows={2} value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} placeholder="A brief description..." className={`${inputCls} resize-none`} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Cover Image URL <span className="text-slate-400 font-normal">(optional — paste a Discord image link)</span></label>
            <input type="url" value={form.coverImage} onChange={(e) => setForm((f) => ({ ...f, coverImage: e.target.value }))} placeholder="https://cdn.discordapp.com/attachments/..." className={inputCls} />
            {form.coverImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.coverImage} alt="Cover preview" className="mt-2 w-full h-36 object-cover rounded-xl border border-slate-200 dark:border-[#1e2d45]" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Content <span className="text-slate-400 font-normal">(markdown supported — use ![alt](url) for inline images)</span></label>
            <textarea rows={10} required value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} placeholder="Write your post content here..." className={`${inputCls} resize-y`} />
          </div>
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div className="relative">
              <input type="checkbox" className="sr-only" checked={form.published} onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))} />
              <div className={`w-10 h-6 rounded-full transition-colors ${form.published ? 'bg-violet-600' : 'bg-slate-200 dark:bg-slate-700'}`} />
              <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.published ? 'translate-x-4' : ''}`} />
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{form.published ? 'Published — visible to everyone' : 'Draft — not publicly visible'}</span>
          </label>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-slate-200 dark:border-[#1e2d45] text-slate-500 dark:text-slate-400 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-sm font-medium">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl hover:opacity-90 transition-opacity text-sm font-semibold disabled:opacity-50">{saving ? 'Saving...' : post ? 'Save Changes' : 'Create Post'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Case Study Modal ─────────────────────────────────────────────────────────
function CaseStudyModal({ caseStudy, onSave, onClose }: { caseStudy: CaseStudy | null; onSave: (d: Omit<CaseStudy, 'id'>) => void; onClose: () => void }) {
  const [form, setForm] = useState({ client: caseStudy?.client ?? '', title: caseStudy?.title ?? '', description: caseStudy?.description ?? '', outcome: caseStudy?.outcome ?? '', tagsStr: (caseStudy?.tags ?? []).join(', '), link: caseStudy?.link ?? '' });
  const inputCls = 'w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all';
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-[#1e2d45] rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-[#1e2d45]">
          <h2 className="text-slate-900 dark:text-white font-semibold text-lg">{caseStudy ? 'Edit Case Study' : 'Add Case Study'}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave({ client: form.client, title: form.title, description: form.description, outcome: form.outcome, tags: form.tagsStr.split(',').map((t) => t.trim()).filter(Boolean), link: form.link || undefined }); }} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Client / Company</label>
            <input type="text" required value={form.client} onChange={(e) => setForm((f) => ({ ...f, client: e.target.value }))} placeholder="Acme Corp" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Project Title</label>
            <input type="text" required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Built a Power Apps inventory system" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
            <textarea rows={3} required value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="What was built and what problem it solved..." className={`${inputCls} resize-none`} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Outcome <span className="text-slate-400 font-normal">(result or impact)</span></label>
            <input type="text" value={form.outcome} onChange={(e) => setForm((f) => ({ ...f, outcome: e.target.value }))} placeholder="Reduced manual data entry by 80%" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Tags <span className="text-slate-400 font-normal">(comma-separated)</span></label>
            <input type="text" value={form.tagsStr} onChange={(e) => setForm((f) => ({ ...f, tagsStr: e.target.value }))} placeholder="Power Apps, Azure, React" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Link <span className="text-slate-400 font-normal">(optional)</span></label>
            <input type="url" value={form.link} onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))} placeholder="https://github.com/..." className={inputCls} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-slate-200 dark:border-[#1e2d45] text-slate-500 dark:text-slate-400 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-sm font-medium">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl hover:opacity-90 transition-opacity text-sm font-semibold">{caseStudy ? 'Save Changes' : 'Add Case Study'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Sponsor Modal ────────────────────────────────────────────────────────────
interface SponsorForm { name: string; logoUrl: string; website: string; tier: string; }
function SponsorModal({ sponsor, onSave, onClose }: { sponsor: Sponsor | null; onSave: (d: SponsorForm) => void; onClose: () => void }) {
  const [form, setForm] = useState<SponsorForm>(sponsor ? { name: sponsor.name, logoUrl: sponsor.logoUrl, website: sponsor.website, tier: sponsor.tier } : { name: '', logoUrl: '', website: '', tier: '' });
  const inputCls = 'w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all';
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-[#1e2d45] rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-[#1e2d45]">
          <h2 className="text-slate-900 dark:text-white font-semibold text-lg">{sponsor ? 'Edit Sponsor' : 'Add Sponsor'}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Company Name</label>
            <input type="text" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Acme Corp" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Logo URL <span className="text-slate-400 font-normal">(optional — shows name badge if empty)</span></label>
            <input type="url" value={form.logoUrl} onChange={(e) => setForm((f) => ({ ...f, logoUrl: e.target.value }))} placeholder="https://example.com/logo.png" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Website URL <span className="text-slate-400 font-normal">(optional)</span></label>
            <input type="url" value={form.website} onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))} placeholder="https://example.com" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Tier <span className="text-slate-400 font-normal">(optional)</span></label>
            <input type="text" value={form.tier} onChange={(e) => setForm((f) => ({ ...f, tier: e.target.value }))} placeholder="Gold / Silver / Community Partner" className={inputCls} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-slate-200 dark:border-[#1e2d45] text-slate-500 dark:text-slate-400 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-sm font-medium">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl hover:opacity-90 transition-opacity text-sm font-semibold">{sponsor ? 'Save Changes' : 'Add Sponsor'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Resource Form Modal ─────────────────────────────────────────────────────
function ResourceModal({
  resource,
  onSave,
  onClose,
}: {
  resource: { id: string; title: string; description: string; url: string; category: string } | null;
  onSave: (data: { title: string; description: string; url: string; category: string }) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState({ title: resource?.title ?? '', description: resource?.description ?? '', url: resource?.url ?? '', category: resource?.category ?? '' });
  const [saving, setSaving] = useState(false);
  const inputCls = 'w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-[#1e2d45] rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-[#1e2d45]">
          <h2 className="text-slate-900 dark:text-white font-semibold text-lg">{resource ? 'Edit Resource' : 'Add Resource'}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Title</label>
            <input type="text" required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="React Documentation" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">URL</label>
            <input type="url" required value={form.url} onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))} placeholder="https://react.dev" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Category</label>
            <input type="text" required value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} placeholder="Frontend / Backend / Tools / General" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Description <span className="text-slate-400 font-normal">(optional)</span></label>
            <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Short description of this resource" rows={2} className={inputCls} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-slate-200 dark:border-[#1e2d45] text-slate-500 dark:text-slate-400 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-sm font-medium">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl hover:opacity-90 transition-opacity text-sm font-semibold disabled:opacity-60">
              {saving ? 'Saving…' : resource ? 'Save Changes' : 'Add Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface GalleryImage {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  created_at: string;
  bytes: number;
  context?: {
    custom?: {
      event?: string;
      caption?: string;
    };
  };
}

type TabId = 'members' | 'events' | 'contacts' | 'partners' | 'projects' | 'stats' | 'settings' | 'about' | 'home' | 'posts' | 'sponsors' | 'resources' | 'past-work' | 'rsvps' | 'gallery';

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
  const [posts, setPosts] = useState<Post[]>([]);
  const [sponsorsConfig, setSponsorsConfig] = useState<SponsorsConfig>({ live: false, sectionTitle: 'Supported By', sponsors: [] });
  const [resources, setResources] = useState<Array<{ id: string; title: string; description: string; url: string; category: string }>>([]);
  const [resourceModal, setResourceModal] = useState<{ open: boolean; resource: { id: string; title: string; description: string; url: string; category: string } | null }>({ open: false, resource: null });
  const [rsvps, setRsvps] = useState<Array<{ id: string; eventId: string; name: string; email: string; submittedAt: string }>>([]);
  const [expandedRsvpEvent, setExpandedRsvpEvent] = useState<string | null>(null);
  const [postModal, setPostModal] = useState<{ open: boolean; post: Post | null }>({ open: false, post: null });
  const [sponsorModal, setSponsorModal] = useState<{ open: boolean; sponsor: Sponsor | null }>({ open: false, sponsor: null });
  const [caseStudiesConfig, setCaseStudiesConfig] = useState<CaseStudiesConfig>({ live: false, sectionTitle: 'Past Work', caseStudies: [] });
  const [homeTechRaw, setHomeTechRaw] = useState('');
  const [aboutTechRaw, setAboutTechRaw] = useState('');
  const [caseStudyModal, setCaseStudyModal] = useState<{ open: boolean; caseStudy: CaseStudy | null }>({ open: false, caseStudy: null });
  const [aboutContent, setAboutContent] = useState<AboutContent>({
    heroTagline: '', heroDescription: '', mission: '',
    valuesTitle: '', valuesSubtitle: '', values: [],
    techStackTitle: '', techStackSubtitle: '', techStack: [],
    activitiesTitle: '', activitiesSubtitle: '', activities: [],
    ctaTitle: '', ctaDescription: '',
  });
  const [homeContent, setHomeContent] = useState<HomeContent>({
    primaryButtonLabel: 'Join the Club',
    secondaryButtonLabel: 'Meet the Team',
    techStack: [],
    companyCtaTitle: 'Are you a company?',
    companyCtaDesc: 'Partner with us for projects or offer internships to our members.',
    missionItems: [],
    aboutEyebrow: 'Who we are',
    aboutHeading: 'About LC3',
    aboutBody1: '',
    aboutBody2: '',
    projectsEyebrow: "What we're building",
    projectsHeading: 'Featured Projects',
    eventsEyebrow: 'Mark your calendar',
    eventsHeading: 'Upcoming Events',
    blogEyebrow: "What's new",
    blogHeading: 'Latest Updates',
    ctaHeading: 'Ready to join?',
    ctaDescription: '',
    ctaButtonLabel: 'Apply to Join LC3',
  });
  const [loading, setLoading] = useState(true);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [galleryUploadError, setGalleryUploadError] = useState('');
  const [galleryDeleteId, setGalleryDeleteId] = useState<string | null>(null);
  const [galleryEditTarget, setGalleryEditTarget] = useState<GalleryImage | null>(null);
  const [galleryEditForm, setGalleryEditForm] = useState({ event: '', caption: '' });
  const [galleryEditSaving, setGalleryEditSaving] = useState(false);
  const [galleryAddOpen, setGalleryAddOpen] = useState(false);
  const [galleryAddForm, setGalleryAddForm] = useState({ event: '', caption: '' });
  const [galleryAddFile, setGalleryAddFile] = useState<File | null>(null);
  const [galleryAddPreview, setGalleryAddPreview] = useState('');

  // Search & sort
  const [membersSearch, setMembersSearch] = useState('');
  const [contactsSearch, setContactsSearch] = useState('');
  const [partnersSearch, setPartnersSearch] = useState('');
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
    const safe = <T,>(url: string, fallback: T) =>
      fetch(url).then((r) => r.ok ? r.json() as Promise<T> : fallback).catch(() => fallback);

    const [m, e, c, pt, p, s, st, ab, po, sp, rv, rs, cs, hm, gl] = await Promise.all([
      safe('/api/members', []),
      safe('/api/events', []),
      safe('/api/contact', []),
      safe('/api/hire', []),
      safe('/api/projects', []),
      safe('/api/stats', { activeMembers: '', eventsHosted: '', projectsBuilt: '', yearsActive: '' }),
      safe('/api/settings', { recruitingBanner: '', meetingDay: '', meetingTime: '', meetingLocation: '' }),
      safe('/api/about', {}),
      safe('/api/posts', []),
      safe('/api/sponsors', { live: false, sectionTitle: 'Supported By', sponsors: [] }),
      safe('/api/rsvps', []),
      safe('/api/resources', []),
      safe('/api/case-studies', { live: false, sectionTitle: 'Past Work', caseStudies: [] }),
      safe('/api/home', {}),
      safe('/api/gallery', []),
    ]);
    setMembers(m as Member[]);
    setEvents(e as Event[]);
    setContacts(c as Contact[]);
    setPartners(pt as PartnerInquiry[]);
    setProjects(p as Project[]);
    setStats(s as Stats);
    setSiteSettings(st as SiteSettings);
    setAboutContent(ab as AboutContent);
    setPosts(Array.isArray(po) ? po as Post[] : []);
    setSponsorsConfig(sp as SponsorsConfig);
    setRsvps(Array.isArray(rv) ? rv as Array<{ id: string; eventId: string; name: string; email: string; submittedAt: string }> : []);
    setResources(Array.isArray(rs) ? rs as Array<{ id: string; title: string; description: string; url: string; category: string }> : []);
    setCaseStudiesConfig(cs as CaseStudiesConfig);
    setHomeContent(hm as HomeContent);
    setHomeTechRaw(((hm as HomeContent).techStack ?? []).join(', '));
    setAboutTechRaw(((ab as AboutContent).techStack ?? []).join(', '));
    setGalleryImages(Array.isArray(gl) ? gl as GalleryImage[] : []);
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

  // Post CRUD
  const savePost = async (data: { title: string; excerpt: string; content: string; published: boolean }) => {
    if (postModal.post) {
      await fetch(`/api/posts/${postModal.post.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    } else {
      await fetch('/api/posts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    }
    setPostModal({ open: false, post: null });
    fetchData();
  };

  const deletePost = async (id: string) => {
    if (!confirm('Delete this post? This cannot be undone.')) return;
    await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const togglePostPublished = async (post: Post) => {
    await fetch(`/api/posts/${post.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ published: !post.published }) });
    fetchData();
  };

  // Sponsor helpers
  const persistSponsors = async (config: SponsorsConfig) => {
    await fetch('/api/sponsors', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(config) });
  };

  const saveSponsor = async (data: { name: string; logoUrl: string; website: string; tier: string }) => {
    let updated: Sponsor[];
    if (sponsorModal.sponsor) {
      updated = sponsorsConfig.sponsors.map((s) => s.id === sponsorModal.sponsor!.id ? { ...s, ...data } : s);
    } else {
      updated = [...sponsorsConfig.sponsors, { id: Date.now().toString(), ...data }];
    }
    const next = { ...sponsorsConfig, sponsors: updated };
    setSponsorsConfig(next);
    setSponsorModal({ open: false, sponsor: null });
    await persistSponsors(next);
  };

  const deleteSponsor = async (id: string) => {
    const next = { ...sponsorsConfig, sponsors: sponsorsConfig.sponsors.filter((s) => s.id !== id) };
    setSponsorsConfig(next);
    await persistSponsors(next);
  };

  const toggleSponsorsLive = async () => {
    const next = { ...sponsorsConfig, live: !sponsorsConfig.live };
    setSponsorsConfig(next);
    await persistSponsors(next);
  };

  // Resource CRUD
  const saveResource = async (data: { title: string; description: string; url: string; category: string }) => {
    if (resourceModal.resource) {
      await fetch(`/api/resources/${resourceModal.resource.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    } else {
      await fetch('/api/resources', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    }
    setResourceModal({ open: false, resource: null });
    fetchData();
  };

  const deleteResource = async (id: string) => {
    if (!confirm('Delete this resource?')) return;
    await fetch(`/api/resources/${id}`, { method: 'DELETE' });
    fetchData();
  };

  // Case Studies helpers
  const persistCaseStudies = async (config: CaseStudiesConfig) => {
    await fetch('/api/case-studies', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(config) });
  };

  const persistSettings = async (settings: SiteSettings) => {
    await fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) });
  };

  const saveCaseStudy = async (data: Omit<CaseStudy, 'id'>) => {
    let updated: CaseStudy[];
    if (caseStudyModal.caseStudy) {
      updated = caseStudiesConfig.caseStudies.map((cs) => cs.id === caseStudyModal.caseStudy!.id ? { ...cs, ...data } : cs);
    } else {
      updated = [...caseStudiesConfig.caseStudies, { id: Date.now().toString(), ...data }];
    }
    const next = { ...caseStudiesConfig, caseStudies: updated };
    setCaseStudiesConfig(next);
    setCaseStudyModal({ open: false, caseStudy: null });
    await persistCaseStudies(next);
  };

  const deleteCaseStudy = async (id: string) => {
    const next = { ...caseStudiesConfig, caseStudies: caseStudiesConfig.caseStudies.filter((cs) => cs.id !== id) };
    setCaseStudiesConfig(next);
    await persistCaseStudies(next);
  };

  const toggleCaseStudiesLive = async () => {
    const next = { ...caseStudiesConfig, live: !caseStudiesConfig.live };
    setCaseStudiesConfig(next);
    await persistCaseStudies(next);
  };

  const navGroups = [
    {
      label: 'Content',
      items: [
        { id: 'members' as TabId, label: 'Members', count: members.length, unread: 0 },
        { id: 'events' as TabId, label: 'Events', count: events.length, unread: 0 },
        { id: 'projects' as TabId, label: 'Projects', count: projects.length, unread: 0 },
        { id: 'posts' as TabId, label: 'Blog', count: posts.length, unread: 0 },
        { id: 'gallery' as TabId, label: 'Gallery', count: galleryImages.length, unread: 0 },
      ],
    },
    {
      label: 'Submissions',
      items: [
        { id: 'contacts' as TabId, label: 'Contacts', count: contacts.length, unread: unreadContacts },
        { id: 'partners' as TabId, label: 'Partners', count: partners.length, unread: unreadPartners },
        { id: 'rsvps' as TabId, label: 'RSVPs', count: rsvps.length, unread: 0 },
      ],
    },
    {
      label: 'Site',
      items: [
        { id: 'sponsors' as TabId, label: 'Sponsors', count: sponsorsConfig.sponsors.length, unread: 0 },
        { id: 'resources' as TabId, label: 'Resources', count: resources.length, unread: 0 },
        { id: 'past-work' as TabId, label: 'Past Work', count: caseStudiesConfig.caseStudies.length, unread: 0 },
      ],
    },
    {
      label: 'Settings',
      items: [
        { id: 'stats' as TabId, label: 'Stats', count: null, unread: 0 },
        { id: 'home' as TabId, label: 'Home Page', count: null, unread: 0 },
        { id: 'about' as TabId, label: 'About Page', count: null, unread: 0 },
        { id: 'settings' as TabId, label: 'Settings', count: null, unread: 0 },
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Manage members, events, and contact submissions</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-600 dark:bg-green-500/10 dark:border-green-500/20 dark:text-green-400 text-xs px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
            Authenticated
          </div>
          <button
            onClick={async () => {
              await fetch('/api/auth', { method: 'DELETE' });
              window.location.href = '/admin/login';
            }}
            className="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors px-3 py-1.5 border border-slate-200 dark:border-[#1e2d45] rounded-full hover:border-slate-300 dark:hover:border-slate-500/50"
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="flex gap-6 items-start">
        {/* Sidebar */}
        <nav className="w-52 flex-shrink-0 bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-[#1e2d45] rounded-2xl p-3 sticky top-6">
          {navGroups.map((group) => (
            <div key={group.label} className="mb-4 last:mb-0">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 px-2 mb-1">{group.label}</p>
              {group.items.map(({ id, label, count, unread }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`relative w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-sm transition-all ${
                    tab === id
                      ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white font-medium'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>{label}</span>
                  <span className={`flex items-center gap-1 ${tab === id ? 'text-white/70' : 'text-slate-400'}`}>
                    {unread > 0 && (
                      <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse" />
                    )}
                    {count !== null && (
                      <span className="text-xs">{count}</span>
                    )}
                  </span>
                </button>
              ))}
            </div>
          ))}

        </nav>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
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
                    return m.name.toLowerCase().includes(q) || (m.majors ?? []).join(' ').toLowerCase().includes(q) || (m.role ?? '').toLowerCase().includes(q) || (m.focusArea ?? '').toLowerCase().includes(q);
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
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {!membersSearch.trim() && (
                          <>
                            <button
                              onClick={async () => {
                                const idx = members.indexOf(m);
                                if (idx === 0) return;
                                const next = [...members];
                                [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
                                setMembers(next);
                                await fetch('/api/members/reorder', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids: next.map((x) => x.id) }) });
                              }}
                              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-all"
                              title="Move up"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                            </button>
                            <button
                              onClick={async () => {
                                const idx = members.indexOf(m);
                                if (idx === members.length - 1) return;
                                const next = [...members];
                                [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
                                setMembers(next);
                                await fetch('/api/members/reorder', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids: next.map((x) => x.id) }) });
                              }}
                              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-all"
                              title="Move down"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </button>
                          </>
                        )}
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
                  {events.map((ev) => {
                    const evRsvps = rsvps.filter((r) => r.eventId === ev.id).sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime());
                    return (
                      <div key={ev.id} className="bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-[#1e2d45] rounded-xl overflow-hidden">
                        <div className="p-4 flex items-center gap-4">
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
                              {evRsvps.length > 0 && (
                                <button
                                  onClick={() => setExpandedRsvpEvent(expandedRsvpEvent === ev.id ? null : ev.id)}
                                  className="text-xs px-2 py-0.5 rounded-full flex-shrink-0 bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors"
                                >
                                  {evRsvps.length} RSVP{evRsvps.length !== 1 ? 's' : ''} {expandedRsvpEvent === ev.id ? '▲' : '▼'}
                                </button>
                              )}
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
                        {expandedRsvpEvent === ev.id && (
                          <div className="px-4 pb-4 border-t border-slate-100 dark:border-[#1e2d45] pt-3">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{evRsvps.length} attending</p>
                              <button
                                onClick={() => {
                                  const csv = ['Name,Email,Submitted', ...evRsvps.map((r) => `${r.name},${r.email},${new Date(r.submittedAt).toLocaleString()}`)].join('\n');
                                  const a = document.createElement('a');
                                  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
                                  a.download = `rsvps-${ev.title.replace(/\s+/g, '-').toLowerCase()}.csv`;
                                  a.click();
                                }}
                                className="text-xs text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                Export CSV
                              </button>
                            </div>
                            <div className="space-y-1.5">
                              {evRsvps.map((r) => (
                                <div key={r.id} className="flex items-center justify-between text-sm px-3 py-2 bg-slate-50 dark:bg-white/5 rounded-lg">
                                  <span className="text-slate-900 dark:text-white font-medium">{r.name}</span>
                                  <span className="text-slate-500 text-xs">{r.email}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
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
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className="text-slate-900 dark:text-white font-medium">{proj.name}</div>
                            {proj.status === 'in-progress' && <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400">In Progress</span>}
                            {proj.status === 'completed' && <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">Completed</span>}
                            {proj.status === 'open' && <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400">Open</span>}
                          </div>
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Partner Inquiries</h2>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      value={partnersSearch}
                      onChange={(e) => setPartnersSearch(e.target.value)}
                      placeholder="Search..."
                      className="bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-lg pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-violet-500/50 transition-all w-36"
                    />
                  </div>
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
                  {[...partners].filter((p) => {
                    if (!partnersSearch.trim()) return true;
                    const q = partnersSearch.toLowerCase();
                    return p.companyName.toLowerCase().includes(q) || p.contactName.toLowerCase().includes(q) || p.email.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
                  }).sort((a, b) => {
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
                        ) : p.inquiryType === 'speaker' ? (
                          <>
                            <span className="text-xs bg-violet-500/10 border border-violet-500/20 text-violet-400 px-2.5 py-1 rounded-full">🎤 Guest Speaker</span>
                            {p.topic && <span className="text-xs bg-slate-100 dark:bg-white/5 border border-white/10 text-slate-300 px-2.5 py-1 rounded-full">{p.topic}</span>}
                            {p.availability && <span className="text-xs bg-slate-100 dark:bg-white/5 border border-white/10 text-slate-400 px-2.5 py-1 rounded-full">{p.availability}</span>}
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

          {/* Blog / Posts Tab */}
          {tab === 'posts' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Blog Posts</h2>
                  <p className="text-slate-500 text-xs mt-0.5">{posts.filter((p) => p.published).length} published · {posts.filter((p) => !p.published).length} draft</p>
                </div>
                <button
                  onClick={() => setPostModal({ open: true, post: null })}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  New Post
                </button>
              </div>

              {posts.length === 0 ? (
                <div className="text-center py-16 text-slate-400">No posts yet. Create your first announcement!</div>
              ) : (
                <div className="space-y-3">
                  {posts.map((post) => (
                    <div key={post.id} className="bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-[#1e2d45] rounded-xl p-4 flex items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${post.published ? 'bg-green-50 border border-green-200 text-green-600 dark:bg-green-500/10 dark:border-green-500/20 dark:text-green-400' : 'bg-slate-100 border border-slate-200 text-slate-500 dark:bg-white/5 dark:border-white/10 dark:text-slate-400'}`}>
                            {post.published ? 'Published' : 'Draft'}
                          </span>
                          <span className="text-xs text-slate-400">
                            {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        <h3 className="text-slate-900 dark:text-white font-medium truncate">{post.title}</h3>
                        {post.excerpt && <p className="text-slate-500 text-sm mt-0.5 line-clamp-1">{post.excerpt}</p>}
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => togglePostPublished(post)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${post.published ? 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5' : 'text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-500/10'}`}
                          title={post.published ? 'Unpublish' : 'Publish'}
                        >
                          {post.published ? 'Unpublish' : 'Publish'}
                        </button>
                        <button onClick={() => setPostModal({ open: true, post })}
                          className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-all">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button onClick={() => deletePost(post.id)}
                          className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                        {post.published && (
                          <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer"
                            className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Sponsors Tab */}
          {tab === 'sponsors' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Sponsors</h2>
                  <p className="text-slate-500 text-sm mt-1">Manage sponsor logos shown on the homepage.</p>
                </div>
              </div>

              {/* Live Toggle — prominent */}
              <div className={`rounded-2xl border-2 p-6 flex items-center justify-between gap-6 transition-all ${sponsorsConfig.live ? 'border-green-400/50 bg-green-50 dark:bg-green-500/5' : 'border-slate-200 dark:border-[#1e2d45] bg-white dark:bg-[#0d1424]'}`}>
                <div>
                  <p className={`font-semibold text-lg ${sponsorsConfig.live ? 'text-green-700 dark:text-green-400' : 'text-slate-900 dark:text-white'}`}>
                    Sponsors section is {sponsorsConfig.live ? 'LIVE' : 'hidden'}
                  </p>
                  <p className="text-slate-500 text-sm mt-0.5">
                    {sponsorsConfig.live ? 'The sponsors strip is visible on the public homepage.' : 'Toggle on to show the sponsors section publicly.'}
                  </p>
                </div>
                <button
                  onClick={toggleSponsorsLive}
                  className={`relative flex-shrink-0 w-14 h-8 rounded-full transition-colors focus:outline-none ${sponsorsConfig.live ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                >
                  <div className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform ${sponsorsConfig.live ? 'translate-x-6' : ''}`} />
                </button>
              </div>

              {/* Section title + sponsor list */}
              <div className="bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-[#1e2d45] rounded-2xl p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Section Label <span className="text-slate-400 font-normal">(shown above logos)</span></label>
                  <input
                    type="text"
                    value={sponsorsConfig.sectionTitle}
                    onChange={(e) => setSponsorsConfig((c) => ({ ...c, sectionTitle: e.target.value }))}
                    placeholder="Supported By"
                    className="w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Sponsors ({sponsorsConfig.sponsors.length})</p>
                    <button
                      onClick={() => setSponsorModal({ open: true, sponsor: null })}
                      className="flex items-center gap-1 text-xs text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                      Add Sponsor
                    </button>
                  </div>

                  {sponsorsConfig.sponsors.length === 0 ? (
                    <p className="text-center py-8 text-slate-400 text-sm">No sponsors yet. Add one above.</p>
                  ) : (
                    <div className="space-y-2">
                      {sponsorsConfig.sponsors.map((s) => (
                        <div key={s.id} className="flex items-center gap-4 bg-slate-50 dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] rounded-xl px-4 py-3">
                          {s.logoUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={s.logoUrl} alt={s.name} className="h-8 object-contain flex-shrink-0" />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-bold text-violet-600 dark:text-violet-400">{s.name[0]}</span>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-slate-900 dark:text-white font-medium text-sm truncate">{s.name}</p>
                            {s.tier && <p className="text-slate-400 text-xs">{s.tier}</p>}
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button onClick={() => setSponsorModal({ open: true, sponsor: s })}
                              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-all">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            </button>
                            <button onClick={() => deleteSponsor(s.id)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* Past Work Tab */}
          {tab === 'past-work' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Past Work</h2>
                  <p className="text-slate-500 text-sm mt-1">Showcase completed client or partner projects on the homepage.</p>
                </div>
              </div>

              {/* Live Toggle */}
              <div className={`rounded-2xl border-2 p-6 flex items-center justify-between gap-6 transition-all ${caseStudiesConfig.live ? 'border-green-400/50 bg-green-50 dark:bg-green-500/5' : 'border-slate-200 dark:border-[#1e2d45] bg-white dark:bg-[#0d1424]'}`}>
                <div>
                  <p className={`font-semibold text-lg ${caseStudiesConfig.live ? 'text-green-700 dark:text-green-400' : 'text-slate-900 dark:text-white'}`}>
                    Past Work section is {caseStudiesConfig.live ? 'LIVE' : 'hidden'}
                  </p>
                  <p className="text-slate-500 text-sm mt-0.5">
                    {caseStudiesConfig.live ? 'The past work section is visible on the public homepage.' : 'Toggle on to show past work publicly.'}
                  </p>
                </div>
                <button
                  onClick={toggleCaseStudiesLive}
                  className={`relative flex-shrink-0 w-14 h-8 rounded-full transition-colors focus:outline-none ${caseStudiesConfig.live ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                >
                  <div className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform ${caseStudiesConfig.live ? 'translate-x-6' : ''}`} />
                </button>
              </div>

              {/* Section title + case study list */}
              <div className="bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-[#1e2d45] rounded-2xl p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Section Title <span className="text-slate-400 font-normal">(shown on homepage)</span></label>
                  <input
                    type="text"
                    value={caseStudiesConfig.sectionTitle}
                    onChange={(e) => setCaseStudiesConfig((c) => ({ ...c, sectionTitle: e.target.value }))}
                    onBlur={() => persistCaseStudies(caseStudiesConfig)}
                    placeholder="Past Work"
                    className="w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Case Studies ({caseStudiesConfig.caseStudies.length})</p>
                    <button
                      onClick={() => setCaseStudyModal({ open: true, caseStudy: null })}
                      className="flex items-center gap-1 text-xs text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                      Add Case Study
                    </button>
                  </div>

                  {caseStudiesConfig.caseStudies.length === 0 ? (
                    <p className="text-center py-8 text-slate-400 text-sm">No case studies yet. Add one above.</p>
                  ) : (
                    <div className="space-y-2">
                      {caseStudiesConfig.caseStudies.map((cs) => (
                        <div key={cs.id} className="flex items-center gap-4 bg-slate-50 dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] rounded-xl px-4 py-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{cs.client[0]}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-slate-900 dark:text-white font-medium text-sm truncate">{cs.title}</p>
                            <p className="text-slate-400 text-xs truncate">{cs.client}</p>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button onClick={() => setCaseStudyModal({ open: true, caseStudy: cs })}
                              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-all">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            </button>
                            <button onClick={() => deleteCaseStudy(cs.id)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* About Page Tab */}
          {/* Home Page Tab */}
          {tab === 'home' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Home Page</h2>
                <p className="text-slate-500 text-sm mt-1">Edit all content that appears on the public home page.</p>
              </div>

              {/* Hero Buttons */}
              <div className="bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-[#1e2d45] rounded-2xl p-6 space-y-4">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Hero Buttons</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Primary Button</label>
                    <input type="text" value={homeContent.primaryButtonLabel}
                      onChange={(e) => setHomeContent((h) => ({ ...h, primaryButtonLabel: e.target.value }))}
                      placeholder="Join the Club"
                      className="w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Secondary Button</label>
                    <input type="text" value={homeContent.secondaryButtonLabel}
                      onChange={(e) => setHomeContent((h) => ({ ...h, secondaryButtonLabel: e.target.value }))}
                      placeholder="Meet the Team"
                      className="w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Tech Stack */}
              <div className="bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-[#1e2d45] rounded-2xl p-6 space-y-3">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Tech Stack Badges</p>
                <input type="text"
                  value={homeTechRaw}
                  onChange={(e) => {
                    setHomeTechRaw(e.target.value);
                    setHomeContent((h) => ({ ...h, techStack: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) }));
                  }}
                  placeholder="Power Apps, Azure, React, Python..."
                  className="w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
                />
                {homeContent.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {homeContent.techStack.map((t, i) => (
                      <span key={i} className="text-xs bg-slate-100 border border-slate-200 text-slate-600 dark:bg-white/5 dark:border-white/10 dark:text-slate-400 px-2.5 py-1 rounded-full">{t}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Company CTA */}
              <div className="bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-[#1e2d45] rounded-2xl p-6 space-y-4">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Company CTA Card</p>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Title</label>
                  <input type="text" value={homeContent.companyCtaTitle}
                    onChange={(e) => setHomeContent((h) => ({ ...h, companyCtaTitle: e.target.value }))}
                    placeholder="Are you a company?"
                    className="w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
                  <input type="text" value={homeContent.companyCtaDesc}
                    onChange={(e) => setHomeContent((h) => ({ ...h, companyCtaDesc: e.target.value }))}
                    placeholder="Partner with us for projects or offer internships..."
                    className="w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
                  />
                </div>
              </div>

              {/* Mission Items */}
              <div className="bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-[#1e2d45] rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Mission Items</p>
                  <button
                    onClick={() => setHomeContent((h) => ({ ...h, missionItems: [...h.missionItems, { title: '', desc: '' }] }))}
                    className="flex items-center gap-1 text-xs text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Add Item
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {homeContent.missionItems.map((item, i) => (
                    <div key={i} className="bg-slate-50 dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <input type="text" value={item.title}
                          onChange={(e) => setHomeContent((h) => { const items = [...h.missionItems]; items[i] = { ...items[i], title: e.target.value }; return { ...h, missionItems: items }; })}
                          placeholder="Item title"
                          className="flex-1 bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-[#253650] text-slate-900 dark:text-white placeholder:text-slate-400 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all font-medium"
                        />
                        <button onClick={() => setHomeContent((h) => ({ ...h, missionItems: h.missionItems.filter((_, j) => j !== i) }))}
                          className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-md text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                      <input type="text" value={item.desc}
                        onChange={(e) => setHomeContent((h) => { const items = [...h.missionItems]; items[i] = { ...items[i], desc: e.target.value }; return { ...h, missionItems: items }; })}
                        placeholder="Short description..."
                        className="w-full bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-[#253650] text-slate-900 dark:text-white placeholder:text-slate-400 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* About Section */}
              <div className="bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-[#1e2d45] rounded-2xl p-6 space-y-4">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">About Section</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1.5">Eyebrow</label>
                    <input type="text" value={homeContent.aboutEyebrow}
                      onChange={(e) => setHomeContent((h) => ({ ...h, aboutEyebrow: e.target.value }))}
                      placeholder="Who we are"
                      className="w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1.5">Heading</label>
                    <input type="text" value={homeContent.aboutHeading}
                      onChange={(e) => setHomeContent((h) => ({ ...h, aboutHeading: e.target.value }))}
                      placeholder="About LC3"
                      className="w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Paragraph 1</label>
                  <textarea rows={3} value={homeContent.aboutBody1}
                    onChange={(e) => setHomeContent((h) => ({ ...h, aboutBody1: e.target.value }))}
                    className="w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Paragraph 2</label>
                  <textarea rows={2} value={homeContent.aboutBody2}
                    onChange={(e) => setHomeContent((h) => ({ ...h, aboutBody2: e.target.value }))}
                    className="w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all resize-none"
                  />
                </div>
              </div>

              {/* Section Headings */}
              <div className="bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-[#1e2d45] rounded-2xl p-6 space-y-4">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Section Headings</p>
                {([
                  { eyebrowKey: 'projectsEyebrow', headingKey: 'projectsHeading', label: 'Featured Projects' },
                  { eyebrowKey: 'eventsEyebrow', headingKey: 'eventsHeading', label: 'Upcoming Events' },
                  { eyebrowKey: 'blogEyebrow', headingKey: 'blogHeading', label: 'Blog / Latest Updates' },
                ] as { eyebrowKey: keyof HomeContent; headingKey: keyof HomeContent; label: string }[]).map(({ eyebrowKey, headingKey, label }) => (
                  <div key={label}>
                    <p className="text-xs text-slate-400 mb-2">{label}</p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <input type="text" value={homeContent[eyebrowKey] as string}
                        onChange={(e) => setHomeContent((h) => ({ ...h, [eyebrowKey]: e.target.value }))}
                        placeholder="Eyebrow text"
                        className="w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
                      />
                      <input type="text" value={homeContent[headingKey] as string}
                        onChange={(e) => setHomeContent((h) => ({ ...h, [headingKey]: e.target.value }))}
                        placeholder="Heading"
                        className="w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Section */}
              <div className="bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-[#1e2d45] rounded-2xl p-6 space-y-4">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">CTA Section</p>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Heading</label>
                  <input type="text" value={homeContent.ctaHeading}
                    onChange={(e) => setHomeContent((h) => ({ ...h, ctaHeading: e.target.value }))}
                    placeholder="Ready to join?"
                    className="w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
                  <textarea rows={2} value={homeContent.ctaDescription}
                    onChange={(e) => setHomeContent((h) => ({ ...h, ctaDescription: e.target.value }))}
                    placeholder="Fill out our quick interest form..."
                    className="w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Button Label</label>
                  <input type="text" value={homeContent.ctaButtonLabel}
                    onChange={(e) => setHomeContent((h) => ({ ...h, ctaButtonLabel: e.target.value }))}
                    placeholder="Apply to Join LC3"
                    className="w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <a href="/" target="_blank" rel="noopener noreferrer"
                  className="text-sm text-slate-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  Preview Home page
                </a>
                <button
                  onClick={async () => {
                    await fetch('/api/home', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(homeContent) });
                    fetchData();
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
                >
                  Save Home Page
                </button>
              </div>
            </div>
          )}

          {tab === 'about' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">About Page</h2>
                <p className="text-slate-500 text-sm mt-1">Edit all content that appears on the public /about page.</p>
              </div>

              {/* Hero Section */}
              <div className="bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-[#1e2d45] rounded-2xl p-6 space-y-4">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Hero Section</p>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Tagline <span className="text-slate-400 font-normal">(small text above title)</span></label>
                  <input type="text" value={aboutContent.heroTagline}
                    onChange={(e) => setAboutContent((a) => ({ ...a, heroTagline: e.target.value }))}
                    placeholder="Who we are"
                    className="w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Hero Description</label>
                  <textarea rows={3} value={aboutContent.heroDescription}
                    onChange={(e) => setAboutContent((a) => ({ ...a, heroDescription: e.target.value }))}
                    placeholder="LC3 — the Lowcode Cloud Club — is a university student organization..."
                    className="w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all resize-none"
                  />
                </div>
              </div>

              {/* Mission */}
              <div className="bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-[#1e2d45] rounded-2xl p-6">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-4">Mission Statement</p>
                <textarea rows={3} value={aboutContent.mission}
                  onChange={(e) => setAboutContent((a) => ({ ...a, mission: e.target.value }))}
                  placeholder="To empower students to build real-world software..."
                  className="w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all resize-none"
                />
              </div>

              {/* Values */}
              <div className="bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-[#1e2d45] rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">What We Stand For</p>
                  <button
                    onClick={() => setAboutContent((a) => ({ ...a, values: [...a.values, { title: '', desc: '' }] }))}
                    className="flex items-center gap-1 text-xs text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Add Value
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {aboutContent.values.map((v, i) => (
                    <div key={i} className="bg-slate-50 dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <input type="text" value={v.title}
                          onChange={(e) => setAboutContent((a) => { const vals = [...a.values]; vals[i] = { ...vals[i], title: e.target.value }; return { ...a, values: vals }; })}
                          placeholder="Value title"
                          className="flex-1 bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-[#253650] text-slate-900 dark:text-white placeholder:text-slate-400 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all font-medium"
                        />
                        <button onClick={() => setAboutContent((a) => ({ ...a, values: a.values.filter((_, j) => j !== i) }))}
                          className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-md text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                      <textarea rows={2} value={v.desc}
                        onChange={(e) => setAboutContent((a) => { const vals = [...a.values]; vals[i] = { ...vals[i], desc: e.target.value }; return { ...a, values: vals }; })}
                        placeholder="Description..."
                        className="w-full bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-[#253650] text-slate-900 dark:text-white placeholder:text-slate-400 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all resize-none"
                      />
                    </div>
                  ))}
                </div>
                <div className="grid sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1.5">Section Title</label>
                    <input type="text" value={aboutContent.valuesTitle}
                      onChange={(e) => setAboutContent((a) => ({ ...a, valuesTitle: e.target.value }))}
                      placeholder="What we stand for"
                      className="w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1.5">Subtitle</label>
                    <input type="text" value={aboutContent.valuesSubtitle}
                      onChange={(e) => setAboutContent((a) => ({ ...a, valuesSubtitle: e.target.value }))}
                      placeholder="The principles that guide everything we do."
                      className="w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Tech Stack */}
              <div className="bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-[#1e2d45] rounded-2xl p-6 space-y-4">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Tech Stack</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1.5">Section Title</label>
                    <input type="text" value={aboutContent.techStackTitle}
                      onChange={(e) => setAboutContent((a) => ({ ...a, techStackTitle: e.target.value }))}
                      placeholder="What we work with"
                      className="w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1.5">Subtitle</label>
                    <input type="text" value={aboutContent.techStackSubtitle}
                      onChange={(e) => setAboutContent((a) => ({ ...a, techStackSubtitle: e.target.value }))}
                      placeholder="Our toolkit spans..."
                      className="w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Technologies <span className="text-slate-400 font-normal">(comma-separated)</span></label>
                  <input type="text"
                    value={aboutTechRaw}
                    onChange={(e) => {
                      setAboutTechRaw(e.target.value);
                      setAboutContent((a) => ({ ...a, techStack: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) }));
                    }}
                    placeholder="Power Apps, Power Automate, Azure, React, Python"
                    className="w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
                  />
                  {aboutContent.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {aboutContent.techStack.map((t, i) => (
                        <span key={i} className="text-xs bg-violet-50 border border-violet-200 text-violet-600 dark:bg-violet-500/10 dark:border-violet-500/20 dark:text-violet-400 px-2.5 py-1 rounded-full">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Activities */}
              <div className="bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-[#1e2d45] rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">What We Do</p>
                  <button
                    onClick={() => setAboutContent((a) => ({ ...a, activities: [...a.activities, { title: '', desc: '' }] }))}
                    className="flex items-center gap-1 text-xs text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Add Activity
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {aboutContent.activities.map((act, i) => (
                    <div key={i} className="bg-slate-50 dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <input type="text" value={act.title}
                          onChange={(e) => setAboutContent((a) => { const acts = [...a.activities]; acts[i] = { ...acts[i], title: e.target.value }; return { ...a, activities: acts }; })}
                          placeholder="Activity title"
                          className="flex-1 bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-[#253650] text-slate-900 dark:text-white placeholder:text-slate-400 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all font-medium"
                        />
                        <button onClick={() => setAboutContent((a) => ({ ...a, activities: a.activities.filter((_, j) => j !== i) }))}
                          className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-md text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                      <textarea rows={2} value={act.desc}
                        onChange={(e) => setAboutContent((a) => { const acts = [...a.activities]; acts[i] = { ...acts[i], desc: e.target.value }; return { ...a, activities: acts }; })}
                        placeholder="Description..."
                        className="w-full bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-[#253650] text-slate-900 dark:text-white placeholder:text-slate-400 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all resize-none"
                      />
                    </div>
                  ))}
                </div>
                <div className="grid sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1.5">Section Title</label>
                    <input type="text" value={aboutContent.activitiesTitle}
                      onChange={(e) => setAboutContent((a) => ({ ...a, activitiesTitle: e.target.value }))}
                      placeholder="What we do"
                      className="w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1.5">Subtitle</label>
                    <input type="text" value={aboutContent.activitiesSubtitle}
                      onChange={(e) => setAboutContent((a) => ({ ...a, activitiesSubtitle: e.target.value }))}
                      placeholder="A look at the activities and programs..."
                      className="w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-[#1e2d45] rounded-2xl p-6 space-y-4">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Call to Action Banner</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1.5">Title</label>
                    <input type="text" value={aboutContent.ctaTitle}
                      onChange={(e) => setAboutContent((a) => ({ ...a, ctaTitle: e.target.value }))}
                      placeholder="Ready to join?"
                      className="w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1.5">Description</label>
                    <input type="text" value={aboutContent.ctaDescription}
                      onChange={(e) => setAboutContent((a) => ({ ...a, ctaDescription: e.target.value }))}
                      placeholder="Whether you want to build, learn, or lead..."
                      className="w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <a href="/about" target="_blank" rel="noopener noreferrer"
                  className="text-sm text-slate-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  Preview About page
                </a>
                <button
                  onClick={async () => {
                    await fetch('/api/about', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(aboutContent) });
                    fetchData();
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
                >
                  Save About Page
                </button>
              </div>
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

                <div className="space-y-3">
                  <div className={`rounded-2xl border-2 p-5 flex items-center justify-between gap-6 transition-all ${siteSettings.socialLinksLive ? 'border-green-400/50 bg-green-50 dark:bg-green-500/5' : 'border-slate-200 dark:border-[#1e2d45] bg-white dark:bg-[#0d1424]'}`}>
                    <div>
                      <p className={`font-semibold ${siteSettings.socialLinksLive ? 'text-green-700 dark:text-green-400' : 'text-slate-900 dark:text-white'}`}>
                        Club Social Links are {siteSettings.socialLinksLive ? 'LIVE' : 'hidden'}
                      </p>
                      <p className="text-slate-500 text-sm mt-0.5">
                        {siteSettings.socialLinksLive ? 'Social links are visible on the Contact page.' : 'Toggle on to show social links on the Contact page.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const next = { ...siteSettings, socialLinksLive: !siteSettings.socialLinksLive };
                        setSiteSettings(next);
                        persistSettings(next);
                      }}
                      className={`relative flex-shrink-0 w-14 h-8 rounded-full transition-colors focus:outline-none ${siteSettings.socialLinksLive ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                    >
                      <div className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform ${siteSettings.socialLinksLive ? 'translate-x-6' : ''}`} />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {(siteSettings.socialLinks ?? []).map((link, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={link.label}
                          onChange={(e) => setSiteSettings((s) => {
                            const links = [...(s.socialLinks ?? [])];
                            links[i] = { ...links[i], label: e.target.value };
                            return { ...s, socialLinks: links };
                          })}
                          placeholder="Label (e.g. Discord)"
                          className="w-32 flex-shrink-0 bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
                        />
                        <input
                          type="url"
                          value={link.url}
                          onChange={(e) => setSiteSettings((s) => {
                            const links = [...(s.socialLinks ?? [])];
                            links[i] = { ...links[i], url: e.target.value };
                            return { ...s, socialLinks: links };
                          })}
                          placeholder="https://..."
                          className="flex-1 bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setSiteSettings((s) => ({ ...s, socialLinks: (s.socialLinks ?? []).filter((_, j) => j !== i) }))}
                          className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setSiteSettings((s) => ({ ...s, socialLinks: [...(s.socialLinks ?? []), { label: '', url: '' }] }))}
                      className="flex items-center gap-1.5 text-xs text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium transition-colors pt-1"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                      Add Social Link
                    </button>
                  </div>
                </div>

                <button
                  onClick={async () => { await persistSettings(siteSettings); fetchData(); }}
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Contact Submissions</h2>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      value={contactsSearch}
                      onChange={(e) => setContactsSearch(e.target.value)}
                      placeholder="Search..."
                      className="bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-lg pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-violet-500/50 transition-all w-36"
                    />
                  </div>
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
                    {[...contacts].filter((c) => {
                      if (!contactsSearch.trim()) return true;
                      const q = contactsSearch.toLowerCase();
                      return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.major.toLowerCase().includes(q) || c.reason.toLowerCase().includes(q);
                    }).sort((a, b) => {
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

          {/* Resources Tab */}
          {tab === 'resources' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Resources</h2>
                <button
                  onClick={() => setResourceModal({ open: true, resource: null })}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Resource
                </button>
              </div>
              {resources.length === 0 ? (
                <div className="text-center py-16 text-slate-500 border border-slate-200 dark:border-[#1e2d45] rounded-2xl">No resources yet.</div>
              ) : (
                <div className="space-y-2">
                  {resources.map((r) => (
                    <div key={r.id} className="bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-[#1e2d45] rounded-xl p-4 flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-slate-900 dark:text-white font-medium text-sm">{r.title}</span>
                          <span className="text-xs bg-violet-500/10 text-violet-400 border border-violet-500/20 px-2 py-0.5 rounded-full">{r.category}</span>
                        </div>
                        {r.description && <p className="text-slate-500 text-sm truncate">{r.description}</p>}
                        <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-xs hover:underline truncate block">{r.url}</a>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => setResourceModal({ open: true, resource: r })}
                          className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-violet-400 hover:bg-violet-500/10 transition-all"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteResource(r.id)}
                          className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
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
          {/* RSVPs Tab */}
          {tab === 'rsvps' && (() => {
            const rsvpsByEvent = events.reduce<Record<string, typeof rsvps>>((acc, ev) => {
              acc[ev.id] = rsvps.filter((r) => r.eventId === ev.id);
              return acc;
            }, {});
            const eventsWithRsvps = events.filter((ev) => (rsvpsByEvent[ev.id]?.length ?? 0) > 0);
            return (
              <div>
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">RSVPs</h2>
                  <p className="text-slate-500 text-xs mt-0.5">{rsvps.length} total RSVP{rsvps.length !== 1 ? 's' : ''} across {eventsWithRsvps.length} event{eventsWithRsvps.length !== 1 ? 's' : ''}</p>
                </div>
                {rsvps.length === 0 ? (
                  <div className="text-center py-16 text-slate-500 border border-slate-200 dark:border-[#1e2d45] rounded-2xl">No RSVPs yet.</div>
                ) : (
                  <div className="space-y-3">
                    {eventsWithRsvps.map((ev) => {
                      const eventRsvps = rsvpsByEvent[ev.id] ?? [];
                      const isOpen = expandedRsvpEvent === ev.id;
                      return (
                        <div key={ev.id} className="bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-[#1e2d45] rounded-xl overflow-hidden">
                          <button
                            onClick={() => setExpandedRsvpEvent(isOpen ? null : ev.id)}
                            className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-slate-900 dark:text-white font-medium text-sm">{ev.title}</span>
                              <span className="text-xs bg-violet-500/10 text-violet-500 dark:text-violet-400 border border-violet-500/20 px-2 py-0.5 rounded-full">{eventRsvps.length} RSVP{eventRsvps.length !== 1 ? 's' : ''}</span>
                            </div>
                            <svg className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          {isOpen && (
                            <div className="border-t border-slate-200 dark:border-[#1e2d45]">
                              {eventRsvps.map((r, i) => (
                                <div key={r.id} className={`flex items-center gap-3 px-4 py-2.5 text-sm ${i > 0 ? 'border-t border-slate-100 dark:border-[#1e2d45]' : ''}`}>
                                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                    {r.name.trim()[0]?.toUpperCase() ?? '?'}
                                  </div>
                                  <span className="text-slate-900 dark:text-white font-medium flex-1">{r.name}</span>
                                  <span className="text-slate-500">{r.email}</span>
                                  <span className="text-slate-400 text-xs">{new Date(r.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Gallery Tab */}
          {tab === 'gallery' && (
            <div>
              {/* Header */}
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Gallery</h2>
                  <p className="text-slate-500 text-xs mt-0.5">
                    {galleryImages.length} photo{galleryImages.length !== 1 ? 's' : ''} live on the site
                  </p>
                </div>
                <button
                  onClick={() => { setGalleryAddOpen(true); setGalleryAddForm({ event: '', caption: '' }); setGalleryAddFile(null); setGalleryAddPreview(''); }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Photo
                </button>
              </div>

              {/* Photo grid */}
              {galleryImages.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-slate-300 dark:border-[#1e2d45] rounded-2xl">
                  <div className="w-14 h-14 bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-[#1e2d45] rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <svg className="w-7 h-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <p className="text-slate-500 font-medium text-sm mb-1">No photos yet</p>
                  <p className="text-slate-400 text-xs">Click &ldquo;Add Photo&rdquo; to upload your first image.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {galleryImages.map((img) => (
                    <div
                      key={img.public_id}
                      className="group relative rounded-xl overflow-hidden border border-slate-200 dark:border-[#1e2d45] bg-slate-100 dark:bg-[#111a2e]"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.secure_url.replace('/upload/', '/upload/w_300,h_200,c_fill,q_auto,f_auto/')}
                        alt=""
                        loading="lazy"
                        className="w-full aspect-[3/2] object-cover"
                      />
                      {/* Metadata strip — always visible */}
                      <div className="px-2.5 py-2 bg-white dark:bg-[#0d1424] border-t border-slate-100 dark:border-[#1e2d45]">
                        <p className="text-slate-800 dark:text-white text-xs font-medium truncate">
                          {img.context?.custom?.event || <span className="text-slate-400 italic">No event</span>}
                        </p>
                        {img.context?.custom?.caption && (
                          <p className="text-slate-500 text-xs truncate mt-0.5">{img.context.custom.caption}</p>
                        )}
                      </div>
                      {/* Hover actions */}
                      <div className="absolute top-0 left-0 right-0 flex justify-end gap-1.5 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <a
                          href={img.secure_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-7 h-7 bg-black/50 hover:bg-black/70 rounded-lg flex items-center justify-center text-white"
                          title="View full size"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                        <button
                          onClick={() => { setGalleryEditTarget(img); setGalleryEditForm({ event: img.context?.custom?.event ?? '', caption: img.context?.custom?.caption ?? '' }); }}
                          className="w-7 h-7 bg-violet-500/80 hover:bg-violet-500 rounded-lg flex items-center justify-center text-white"
                          title="Edit info"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setGalleryDeleteId(img.public_id)}
                          className="w-7 h-7 bg-red-500/80 hover:bg-red-500 rounded-lg flex items-center justify-center text-white"
                          title="Delete"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── Add Photo modal ── */}
              {galleryAddOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-[#1e2d45] rounded-2xl w-full max-w-lg overflow-hidden">
                    <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-[#1e2d45]">
                      <h3 className="text-slate-900 dark:text-white font-semibold">Add Photo</h3>
                      <button onClick={() => setGalleryAddOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="p-5 space-y-4">
                      {/* Event */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                          Event <span className="text-slate-400 font-normal">(e.g. Spring Hackathon 2025)</span>
                        </label>
                        <input
                          type="text"
                          value={galleryAddForm.event}
                          onChange={(e) => setGalleryAddForm((f) => ({ ...f, event: e.target.value }))}
                          placeholder="What event is this from?"
                          className="w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
                        />
                      </div>
                      {/* Caption */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                          Caption <span className="text-slate-400 font-normal">(optional)</span>
                        </label>
                        <textarea
                          rows={2}
                          value={galleryAddForm.caption}
                          onChange={(e) => setGalleryAddForm((f) => ({ ...f, caption: e.target.value }))}
                          placeholder="What's happening in this photo?"
                          className="w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all resize-none"
                        />
                      </div>
                      {/* File picker */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Photo</label>
                        {galleryAddPreview ? (
                          <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-[#1e2d45]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={galleryAddPreview} alt="" className="w-full max-h-48 object-cover" />
                            <button
                              onClick={() => { setGalleryAddFile(null); setGalleryAddPreview(''); }}
                              className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-black/80 rounded-lg flex items-center justify-center text-white"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center gap-2 w-full h-32 border-2 border-dashed border-slate-300 dark:border-[#1e2d45] rounded-xl cursor-pointer hover:border-violet-400 dark:hover:border-violet-500/50 transition-colors">
                            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                            </svg>
                            <span className="text-slate-500 text-sm">Click to choose a photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (!f) return;
                                setGalleryAddFile(f);
                                setGalleryAddPreview(URL.createObjectURL(f));
                              }}
                            />
                          </label>
                        )}
                      </div>
                      {galleryUploadError && (
                        <p className="text-red-500 text-sm">{galleryUploadError}</p>
                      )}
                      {/* Actions */}
                      <div className="flex gap-3 pt-1">
                        <button
                          onClick={() => setGalleryAddOpen(false)}
                          className="flex-1 py-2.5 border border-slate-200 dark:border-[#1e2d45] text-slate-500 dark:text-slate-400 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-sm font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          disabled={!galleryAddFile || galleryUploading}
                          onClick={async () => {
                            if (!galleryAddFile) return;
                            setGalleryUploading(true);
                            setGalleryUploadError('');
                            try {
                              const fd = new FormData();
                              fd.append('file', galleryAddFile);
                              fd.append('event', galleryAddForm.event);
                              fd.append('caption', galleryAddForm.caption);
                              const res = await fetch('/api/gallery', { method: 'POST', body: fd });
                              if (!res.ok) {
                                const d = await res.json();
                                setGalleryUploadError(d.error ?? 'Upload failed');
                                setGalleryUploading(false);
                                return;
                              }
                            } catch {
                              setGalleryUploadError('Upload failed');
                              setGalleryUploading(false);
                              return;
                            }
                            setGalleryUploading(false);
                            setGalleryAddOpen(false);
                            setGalleryAddPreview('');
                            const gl = await fetch('/api/gallery').then((r) => r.ok ? r.json() : []).catch(() => []);
                            setGalleryImages(Array.isArray(gl) ? gl as GalleryImage[] : []);
                          }}
                          className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl hover:opacity-90 transition-opacity text-sm font-semibold disabled:opacity-40"
                        >
                          {galleryUploading ? 'Uploading…' : 'Upload & Publish'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Edit info modal ── */}
              {galleryEditTarget && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-[#1e2d45] rounded-2xl w-full max-w-md overflow-hidden">
                    <div className="flex items-center gap-3 p-5 border-b border-slate-200 dark:border-[#1e2d45]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={galleryEditTarget.secure_url.replace('/upload/', '/upload/w_80,h_80,c_fill,q_auto,f_auto/')} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                      <div>
                        <h3 className="text-slate-900 dark:text-white font-semibold">Edit Photo Info</h3>
                        <p className="text-slate-500 text-xs mt-0.5">Updates the public gallery immediately</p>
                      </div>
                    </div>
                    <div className="p-5 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Event</label>
                        <input type="text" value={galleryEditForm.event} onChange={(e) => setGalleryEditForm((f) => ({ ...f, event: e.target.value }))} placeholder="Event name" className="w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Caption <span className="text-slate-400 font-normal">(optional)</span></label>
                        <textarea rows={3} value={galleryEditForm.caption} onChange={(e) => setGalleryEditForm((f) => ({ ...f, caption: e.target.value }))} placeholder="What's happening in this photo?" className="w-full bg-white dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500/50 transition-all resize-none" />
                      </div>
                      <div className="flex gap-3 pt-1">
                        <button onClick={() => setGalleryEditTarget(null)} className="flex-1 py-2.5 border border-slate-200 dark:border-[#1e2d45] text-slate-500 dark:text-slate-400 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-sm font-medium">Cancel</button>
                        <button
                          disabled={galleryEditSaving}
                          onClick={async () => {
                            setGalleryEditSaving(true);
                            const res = await fetch('/api/gallery', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ public_id: galleryEditTarget.public_id, event: galleryEditForm.event, caption: galleryEditForm.caption }) });
                            setGalleryEditSaving(false);
                            if (res.ok) {
                              setGalleryImages((imgs) => imgs.map((img) =>
                                img.public_id === galleryEditTarget.public_id
                                  ? { ...img, context: { custom: { event: galleryEditForm.event, caption: galleryEditForm.caption } } }
                                  : img
                              ));
                            }
                            setGalleryEditTarget(null);
                          }}
                          className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl hover:opacity-90 transition-opacity text-sm font-semibold disabled:opacity-50"
                        >
                          {galleryEditSaving ? 'Saving…' : 'Save Changes'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Delete confirm ── */}
              {galleryDeleteId && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-[#1e2d45] rounded-2xl p-6 max-w-sm w-full">
                    <h3 className="text-slate-900 dark:text-white font-semibold mb-2">Delete Photo?</h3>
                    <p className="text-slate-500 text-sm mb-5">This permanently removes it from Cloudinary and the gallery.</p>
                    <div className="flex gap-3">
                      <button onClick={() => setGalleryDeleteId(null)} className="flex-1 py-2.5 border border-slate-200 dark:border-[#1e2d45] text-slate-500 dark:text-slate-400 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-sm font-medium">Cancel</button>
                      <button
                        onClick={async () => {
                          const id = galleryDeleteId;
                          setGalleryDeleteId(null);
                          await fetch('/api/gallery', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ public_id: id }) });
                          const gl = await fetch('/api/gallery').then((r) => r.ok ? r.json() : []).catch(() => []);
                          setGalleryImages(Array.isArray(gl) ? gl as GalleryImage[] : []);
                        }}
                        className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors text-sm font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
        </div>{/* end main content */}
      </div>{/* end sidebar wrapper */}

      {/* Resource Modal */}
      {resourceModal.open && (
        <ResourceModal
          resource={resourceModal.resource}
          onSave={saveResource}
          onClose={() => setResourceModal({ open: false, resource: null })}
        />
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

      {/* Post Modal */}
      {postModal.open && (
        <PostModal post={postModal.post} onSave={savePost} onClose={() => setPostModal({ open: false, post: null })} />
      )}

      {/* Sponsor Modal */}
      {sponsorModal.open && (
        <SponsorModal sponsor={sponsorModal.sponsor} onSave={saveSponsor} onClose={() => setSponsorModal({ open: false, sponsor: null })} />
      )}

      {caseStudyModal.open && <CaseStudyModal caseStudy={caseStudyModal.caseStudy} onSave={saveCaseStudy} onClose={() => setCaseStudyModal({ open: false, caseStudy: null })} />}

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
  return <Dashboard />;
}
