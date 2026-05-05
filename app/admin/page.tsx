'use client';

import { useState, useEffect, useCallback } from 'react';
import type {
  Stats,
  SiteSettings,
  FooterContent,
  Member,
  Event,
  Contact,
  Post,
  Project,
  PartnerInquiry,
  RSVP,
  AboutContent,
  HomeContent
} from '@/lib/types';

import MemberSection from './components/MemberSection';
import EventSection from './components/EventSection';
import ProjectSection from './components/ProjectSection';
import BlogSection from './components/BlogSection';
import GallerySection from './components/GallerySection';
import SubmissionSection from './components/SubmissionSection';
import SettingsSection from './components/SettingsSection';

type TabId = 'members' | 'events' | 'projects' | 'posts' | 'gallery' | 'submissions' | 'settings' | 'pages';

export default function AdminDashboard() {
  const [tab, setTab] = useState<TabId>('members');
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [members, setMembers] = useState<Member[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [partners, setPartners] = useState<PartnerInquiry[]>([]);
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [stats, setStats] = useState<Stats>({ activeMembers: '', eventsHosted: '', projectsBuilt: '', yearsActive: '' });
  const [settings, setSettings] = useState<SiteSettings>({ recruitingBanner: '', meetingDay: '', meetingTime: '', meetingLocation: '' });
  const [footer, setFooter] = useState<FooterContent>({ tagline: '', ctaHeading: '', ctaSubtitle: '', ctaButtonLabel: '' });

  const fetchData = useCallback(async () => {
    setLoading(true);
    const safeFetch = async (url: string, fallback: any) => {
      try {
        const res = await fetch(url);
        return res.ok ? await res.json() : fallback;
      } catch { return fallback; }
    };

    const [m, e, p, po, gl, c, pt, rv, st, sett, ft] = await Promise.all([
      safeFetch('/api/members', []),
      safeFetch('/api/events', []),
      safeFetch('/api/projects', []),
      safeFetch('/api/posts', []),
      safeFetch('/api/gallery', []),
      safeFetch('/api/contact', []),
      safeFetch('/api/hire', []),
      safeFetch('/api/rsvps', []),
      safeFetch('/api/stats', {}),
      safeFetch('/api/settings', {}),
      safeFetch('/api/footer', {}),
    ]);

    setMembers(m);
    setEvents(e);
    setProjects(p);
    setPosts(po);
    setGallery(gl);
    setContacts(c);
    setPartners(pt);
    setRsvps(rv);
    setStats(st);
    setSettings(sett);
    setFooter(ft);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Admin Dashboard</h1>
            <p className="text-slate-400 mt-1 text-sm">Manage LC3 club content, members, and site configuration.</p>
          </div>
          <button 
            onClick={async () => { await fetch('/api/auth', { method: 'DELETE' }); window.location.href = '/admin/login'; }}
            className="px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-lg text-sm transition-colors w-fit"
          >
            Sign Out
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Navigation Sidebar */}
          <nav className="w-full lg:w-64 space-y-1 bg-slate-900/50 p-2 rounded-2xl border border-slate-800 h-fit sticky top-8">
            {[
              { id: 'members', label: 'Members', icon: '👥' },
              { id: 'events', label: 'Events', icon: '📅' },
              { id: 'projects', label: 'Projects', icon: '🚀' },
              { id: 'posts', label: 'Blog Posts', icon: '📝' },
              { id: 'gallery', label: 'Gallery', icon: '🖼️' },
              { id: 'submissions', label: 'Submissions', icon: '📨' },
              { id: 'settings', label: 'Site Config', icon: '⚙️' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as TabId)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  tab === t.id ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <span>{t.icon}</span> {t.label}
              </button>
            ))}
          </nav>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            {tab === 'members' && (
              <MemberSection 
                members={members} 
                onSave={async (m) => {
                  const method = members.find(ex => ex.id === m.id) ? 'PUT' : 'POST';
                  await fetch(method === 'PUT' ? `/api/members/${m.id}` : '/api/members', { 
                    method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(m) 
                  });
                  fetchData();
                }}
                onDelete={async (id) => {
                  if (confirm('Delete member?')) {
                    await fetch(`/api/members/${id}`, { method: 'DELETE' });
                    fetchData();
                  }
                }}
                onReorder={async (id, dir) => {
                  const idx = members.findIndex(m => m.id === id);
                  if ((dir === 'up' && idx === 0) || (dir === 'down' && idx === members.length - 1)) return;
                  const next = [...members];
                  const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
                  [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
                  setMembers(next);
                  await fetch('/api/members/reorder', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids: next.map(x => x.id) }) });
                }}
              />
            )}

            {tab === 'events' && (
              <EventSection 
                events={events}
                rsvps={rsvps}
                onSave={async (event, data) => {
                  const method = event ? 'PUT' : 'POST';
                  await fetch(event ? `/api/events/${event.id}` : '/api/events', { 
                    method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) 
                  });
                  fetchData();
                }}
                onDelete={async (id) => {
                  if (confirm('Delete event?')) {
                    await fetch(`/api/events/${id}`, { method: 'DELETE' });
                    fetchData();
                  }
                }}
              />
            )}

            {tab === 'projects' && (
              <ProjectSection 
                projects={projects}
                onSave={async (project, data) => {
                  const method = project ? 'PUT' : 'POST';
                  await fetch(project ? `/api/projects/${project.id}` : '/api/projects', { 
                    method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) 
                  });
                  fetchData();
                }}
                onDelete={async (id) => {
                  if (confirm('Delete project?')) {
                    await fetch(`/api/projects/${id}`, { method: 'DELETE' });
                    fetchData();
                  }
                }}
              />
            )}

            {tab === 'posts' && (
              <BlogSection 
                posts={posts}
                onSave={async (post, data) => {
                  const method = post ? 'PUT' : 'POST';
                  await fetch(post ? `/api/posts/${post.id}` : '/api/posts', { 
                    method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) 
                  });
                  fetchData();
                }}
                onDelete={async (id) => {
                  if (confirm('Delete post?')) {
                    await fetch(`/api/posts/${id}`, { method: 'DELETE' });
                    fetchData();
                  }
                }}
                onTogglePublished={async (post) => {
                  await fetch(`/api/posts/${post.id}`, { 
                    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ published: !post.published }) 
                  });
                  fetchData();
                }}
              />
            )}

            {tab === 'gallery' && (
              <GallerySection 
                images={gallery}
                onUpload={async (file, event, caption) => {
                  const fd = new FormData();
                  fd.append('file', file);
                  fd.append('event', event);
                  fd.append('caption', caption);
                  await fetch('/api/gallery', { method: 'POST', body: fd });
                  fetchData();
                }}
                onDelete={async (id) => {
                  if (confirm('Delete photo?')) {
                    await fetch('/api/gallery', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ public_id: id }) });
                    fetchData();
                  }
                }}
                onUpdate={async (id, event, caption) => {
                  await fetch('/api/gallery', { 
                    method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ public_id: id, event, caption }) 
                  });
                  fetchData();
                }}
              />
            )}

            {tab === 'submissions' && (
              <SubmissionSection 
                contacts={contacts}
                partners={partners}
                rsvps={rsvps}
                onDeleteContact={async (id) => {
                  if (confirm('Delete contact submission?')) {
                    await fetch(`/api/contact/${id}`, { method: 'DELETE' });
                    fetchData();
                  }
                }}
                onDeletePartner={async (id) => {
                  if (confirm('Delete partner inquiry?')) {
                    await fetch(`/api/hire/${id}`, { method: 'DELETE' });
                    fetchData();
                  }
                }}
              />
            )}

            {tab === 'settings' && (
              <SettingsSection 
                stats={stats}
                settings={settings}
                footer={footer}
                onSaveStats={async (s) => {
                  await fetch('/api/stats', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(s) });
                  fetchData();
                }}
                onSaveSettings={async (s) => {
                  await fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(s) });
                  fetchData();
                }}
                onSaveFooter={async (f) => {
                  await fetch('/api/footer', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) });
                  fetchData();
                }}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
