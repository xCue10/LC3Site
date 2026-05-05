import { useState } from 'react';
import type { Event, RSVP } from '@/lib/types';
import { Plus, Edit2, Trash2, ChevronUp, ChevronDown, Download, Calendar } from 'lucide-react';

interface EventSectionProps {
  events: Event[];
  rsvps: RSVP[];
  onSave: (event: Event | null, data: any) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function EventSection({ events, rsvps, onSave, onDelete }: EventSectionProps) {
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [expandedRsvpEvent, setExpandedRsvpEvent] = useState<string | null>(null);

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditingEvent(null);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Events</h2>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Event
        </button>
      </div>

      <div className="space-y-4">
        {events.map((event) => {
          const eventRsvps = rsvps.filter((r) => r.eventId === event.id);
          return (
            <div key={event.id} className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
              <div className="p-4 flex items-center gap-4">
                <div className={`w-14 h-14 rounded-lg flex flex-col items-center justify-center ${event.type === 'upcoming' ? 'bg-violet-500/20 text-violet-400' : 'bg-slate-700/50 text-slate-500'}`}>
                  <span className="text-[10px] font-bold uppercase">{new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })}</span>
                  <span className="text-xl font-bold leading-none">{new Date(event.date + 'T00:00:00').getDate()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-100 truncate">{event.title}</h3>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${event.type === 'upcoming' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-700 text-slate-400'}`}>
                      {event.type}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 truncate">{event.location}</p>
                </div>
                <div className="flex items-center gap-2">
                  {eventRsvps.length > 0 && (
                    <button
                      onClick={() => setExpandedRsvpEvent(expandedRsvpEvent === event.id ? null : event.id)}
                      className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded text-xs transition-colors flex items-center gap-1.5"
                    >
                      {eventRsvps.length} RSVP{eventRsvps.length !== 1 ? 's' : ''}
                      {expandedRsvpEvent === event.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  )}
                  <button onClick={() => handleEdit(event)} className="p-2 hover:bg-slate-700 rounded text-blue-400 transition-colors"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => onDelete(event.id)} className="p-2 hover:bg-slate-700 rounded text-rose-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              
              {expandedRsvpEvent === event.id && (
                <div className="px-4 pb-4 border-t border-slate-700 bg-slate-900/50 pt-3">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Registrations</h4>
                    <button 
                      onClick={() => {
                        const csv = ['Name,Email,Date'].concat(eventRsvps.map(r => `${r.name},${r.email},${r.submittedAt}`)).join('\n');
                        const blob = new Blob([csv], { type: 'text/csv' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `rsvps-${event.title.toLowerCase().replace(/\s+/g, '-')}.csv`;
                        a.click();
                      }}
                      className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" /> Export CSV
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {eventRsvps.map((rsvp) => (
                      <div key={rsvp.id} className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-between">
                        <span className="text-sm text-slate-200 font-medium">{rsvp.name}</span>
                        <span className="text-xs text-slate-500">{rsvp.email}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showModal && (
        <EventModal
          event={editingEvent}
          onClose={() => setShowModal(false)}
          onSave={async (data) => {
            await onSave(editingEvent, data);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}

function EventModal({ event, onClose, onSave }: { event: Event | null, onClose: () => void, onSave: (data: any) => Promise<void> }) {
  const [data, setData] = useState(event || {
    title: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    location: '',
    type: 'upcoming' as const,
    rsvpUrl: ''
  });

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900">
          <h2 className="text-xl font-bold text-white">{event ? 'Edit Event' : 'New Event'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Event Title</label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Date</label>
              <input
                type="date"
                value={data.date}
                onChange={(e) => setData({ ...data, date: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Type</label>
              <select
                value={data.type}
                onChange={(e) => setData({ ...data, type: e.target.value as any })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Location</label>
            <input
              type="text"
              value={data.location}
              onChange={(e) => setData({ ...data, location: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Description</label>
            <textarea
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              rows={3}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">RSVP / Link URL (Optional)</label>
            <input
              type="text"
              value={data.rsvpUrl}
              onChange={(e) => setData({ ...data, rsvpUrl: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        </div>
        <div className="p-6 border-t border-slate-800 flex justify-end gap-3 bg-slate-900">
          <button onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white transition-colors">Cancel</button>
          <button onClick={() => onSave(data)} className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors">Save Event</button>
        </div>
      </div>
    </div>
  );
}
