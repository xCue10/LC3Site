'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CareersNav from '../components/CareersNav';
import { LS_AUTH, LS_APPS } from '../types';
import type { Application, ApplicationStatus } from '../types';

const STATUSES: ApplicationStatus[] = ['Saved', 'Applied', 'Phone Screen', 'Interview Scheduled', 'Interview Done', 'Offer', 'Rejected'];

const statusColors: Record<ApplicationStatus, string> = {
  'Saved': '#6b7280',
  'Applied': '#3b82f6',
  'Phone Screen': '#8b5cf6',
  'Interview Scheduled': '#f59e0b',
  'Interview Done': '#f97316',
  'Offer': '#22c55e',
  'Rejected': '#ef4444',
};

function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span
      className="text-xs px-2 py-0.5 rounded-md font-medium"
      style={{
        color: statusColors[status],
        background: `${statusColors[status]}18`,
        border: `1px solid ${statusColors[status]}30`,
      }}
    >
      {status}
    </span>
  );
}

function DonutChart({ apps }: { apps: Application[] }) {
  const counts: Record<ApplicationStatus, number> = {} as Record<ApplicationStatus, number>;
  STATUSES.forEach((s) => { counts[s] = 0; });
  apps.forEach((a) => { counts[a.status] = (counts[a.status] ?? 0) + 1; });
  const total = apps.length || 1;

  let offset = 0;
  const radius = 40;
  const circ = 2 * Math.PI * radius;

  const arcs = STATUSES.filter((s) => counts[s] > 0).map((s) => {
    const pct = counts[s] / total;
    const dash = pct * circ;
    const arc = { status: s, dash, offset };
    offset += dash;
    return arc;
  });

  return (
    <div className="flex items-center gap-6">
      <svg width="100" height="100" viewBox="0 0 100 100">
        {arcs.map((arc) => (
          <circle
            key={arc.status}
            cx="50" cy="50" r={radius}
            fill="none"
            stroke={statusColors[arc.status]}
            strokeWidth="12"
            strokeDasharray={`${arc.dash} ${circ - arc.dash}`}
            strokeDashoffset={-arc.offset}
            transform="rotate(-90 50 50)"
          />
        ))}
        <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" className="text-sm font-bold" fill="white" fontSize="16">
          {apps.length}
        </text>
      </svg>
      <div className="space-y-1">
        {STATUSES.filter((s) => counts[s] > 0).map((s) => (
          <div key={s} className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: statusColors[s] }} />
            <span className="text-slate-400">{s}</span>
            <span className="text-slate-600 ml-auto">{counts[s]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ApplicationsPage() {
  const router = useRouter();
  const [apps, setApps] = useState<Application[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newApp, setNewApp] = useState<Partial<Application>>({ status: 'Applied', dateApplied: new Date().toISOString().split('T')[0] });

  useEffect(() => {
    if (localStorage.getItem(LS_AUTH) !== 'true') { router.replace('/careers'); return; }
    loadApps();
  }, [router]);

  const loadApps = () => {
    const raw = localStorage.getItem(LS_APPS) ?? '[]';
    try { setApps(JSON.parse(raw)); } catch { setApps([]); }
  };

  const saveApps = (updated: Application[]) => {
    localStorage.setItem(LS_APPS, JSON.stringify(updated));
    setApps(updated);
  };

  const updateStatus = (id: string, status: ApplicationStatus) => {
    saveApps(apps.map((a) => a.id === id ? { ...a, status } : a));
  };

  const updateNotes = (id: string, notes: string) => {
    saveApps(apps.map((a) => a.id === id ? { ...a, notes } : a));
  };

  const deleteApp = (id: string) => {
    saveApps(apps.filter((a) => a.id !== id));
    if (expanded === id) setExpanded(null);
  };

  const addApp = () => {
    if (!newApp.company || !newApp.jobTitle) return;
    const app: Application = {
      id: crypto.randomUUID(),
      company: newApp.company ?? '',
      jobTitle: newApp.jobTitle ?? '',
      dateApplied: newApp.dateApplied ?? new Date().toISOString().split('T')[0],
      status: newApp.status as ApplicationStatus ?? 'Applied',
      notes: newApp.notes,
      jobUrl: newApp.jobUrl,
    };
    // Achievement
    const rawProfile = localStorage.getItem('lc3careers-profile');
    if (rawProfile) {
      const p = JSON.parse(rawProfile);
      if (!p.achievements.includes('First Application')) {
        p.achievements.push('First Application');
        localStorage.setItem('lc3careers-profile', JSON.stringify(p));
      }
    }
    saveApps([...apps, app]);
    setNewApp({ status: 'Applied', dateApplied: new Date().toISOString().split('T')[0] });
    setShowAdd(false);
  };

  const exportCSV = () => {
    const header = 'Company,Job Title,Date Applied,Status,Notes,URL\n';
    const rows = apps.map((a) =>
      `"${a.company}","${a.jobTitle}","${a.dateApplied}","${a.status}","${a.notes ?? ''}","${a.jobUrl ?? ''}"`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'lc3-applications.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const totalApps = apps.length;
  const responses = apps.filter((a) => !['Saved', 'Applied'].includes(a.status)).length;
  const interviews = apps.filter((a) => ['Interview Scheduled', 'Interview Done', 'Offer'].includes(a.status)).length;
  const offers = apps.filter((a) => a.status === 'Offer').length;

  const inputStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' };
  const inputClass = 'w-full px-3 py-2 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none';

  return (
    <div style={{ background: '#0a0f1e', minHeight: '100vh' }}>
      <CareersNav />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-white">Application Tracker</h1>
            <p className="text-slate-400 text-sm">{totalApps} applications tracked</p>
          </div>
          <div className="flex gap-2">
            {apps.length > 0 && (
              <button
                onClick={exportCSV}
                className="px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                Export CSV
              </button>
            )}
            <button
              onClick={() => setShowAdd(!showAdd)}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
            >
              + Add Application
            </button>
          </div>
        </div>

        {/* Add form */}
        {showAdd && (
          <div className="rounded-2xl p-5 mb-6" style={{ background: '#111827', border: '1px solid rgba(59,130,246,0.2)' }}>
            <h2 className="text-sm font-semibold text-white mb-4">Add Application</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <input className={inputClass} style={inputStyle} placeholder="Company *" value={newApp.company ?? ''} onChange={(e) => setNewApp((n) => ({ ...n, company: e.target.value }))} />
              <input className={inputClass} style={inputStyle} placeholder="Job Title *" value={newApp.jobTitle ?? ''} onChange={(e) => setNewApp((n) => ({ ...n, jobTitle: e.target.value }))} />
              <input type="date" className={inputClass} style={inputStyle} value={newApp.dateApplied ?? ''} onChange={(e) => setNewApp((n) => ({ ...n, dateApplied: e.target.value }))} />
              <select className={inputClass} style={inputStyle} value={newApp.status ?? 'Applied'} onChange={(e) => setNewApp((n) => ({ ...n, status: e.target.value as ApplicationStatus }))}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <input className={inputClass + ' sm:col-span-2'} style={inputStyle} placeholder="Job URL (optional)" value={newApp.jobUrl ?? ''} onChange={(e) => setNewApp((n) => ({ ...n, jobUrl: e.target.value }))} />
              <textarea className={inputClass + ' sm:col-span-2 resize-none'} style={inputStyle} placeholder="Notes (optional)" rows={2} value={newApp.notes ?? ''} onChange={(e) => setNewApp((n) => ({ ...n, notes: e.target.value }))} />
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-xl text-sm text-slate-500">Cancel</button>
              <button onClick={addApp} className="px-5 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>Add</button>
            </div>
          </div>
        )}

        {/* Stats */}
        {apps.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total', value: totalApps, color: '#3b82f6' },
              { label: 'Responses', value: `${totalApps ? Math.round((responses / totalApps) * 100) : 0}%`, color: '#8b5cf6' },
              { label: 'Interviews', value: interviews, color: '#f59e0b' },
              { label: 'Offers', value: offers, color: '#22c55e' },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl p-4 text-center" style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Chart + table layout */}
        <div className="flex gap-6 flex-wrap">
          {apps.length > 0 && (
            <div className="rounded-2xl p-5" style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)', minWidth: '200px' }}>
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">By Status</h2>
              <DonutChart apps={apps} />
            </div>
          )}

          <div className="flex-1 min-w-0 space-y-2">
            {apps.length === 0 ? (
              <div className="text-center py-16 rounded-2xl" style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="text-3xl mb-3">📋</div>
                <p className="text-slate-400 font-medium">No applications yet</p>
                <p className="text-slate-600 text-sm mt-1">Add your first application above</p>
              </div>
            ) : (
              apps.map((app) => (
                <div
                  key={app.id}
                  className="rounded-2xl overflow-hidden"
                  style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div
                    className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-white/[0.02]"
                    onClick={() => setExpanded(expanded === app.id ? null : app.id)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">{app.jobTitle}</p>
                        <p className="text-xs text-slate-500">{app.company} · {app.dateApplied}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <StatusBadge status={app.status} />
                      <svg className={`w-4 h-4 text-slate-600 transition-transform ${expanded === app.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {expanded === app.id && (
                    <div className="px-4 pb-4 space-y-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <div className="pt-3">
                        <label className="text-xs text-slate-500 mb-1 block">Status</label>
                        <select
                          value={app.status}
                          onChange={(e) => updateStatus(app.id, e.target.value as ApplicationStatus)}
                          className="w-full px-3 py-2 rounded-xl text-sm text-white focus:outline-none"
                          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                        >
                          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-slate-500 mb-1 block">Notes</label>
                        <textarea
                          value={app.notes ?? ''}
                          onChange={(e) => updateNotes(app.id, e.target.value)}
                          rows={3}
                          placeholder="Add notes, interview feedback, contacts..."
                          className="w-full px-3 py-2 rounded-xl text-xs text-slate-300 placeholder-slate-600 focus:outline-none resize-none"
                          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                        />
                      </div>
                      {app.jobUrl && (
                        <a href={app.jobUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:text-blue-300">
                          View original posting ↗
                        </a>
                      )}
                      <div className="flex justify-end">
                        <button
                          onClick={() => deleteApp(app.id)}
                          className="text-xs text-red-500/60 hover:text-red-400 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
