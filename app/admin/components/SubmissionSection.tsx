import { useState } from 'react';
import type { Contact, PartnerInquiry, RSVP } from '@/lib/types';
import { Mail, User, Building, Clock, ChevronDown, ChevronUp, Trash2, CheckCircle, Download } from 'lucide-react';

interface SubmissionSectionProps {
  contacts: Contact[];
  partners: PartnerInquiry[];
  rsvps: RSVP[];
  onDeleteContact: (id: string) => Promise<void>;
  onDeletePartner: (id: string) => Promise<void>;
}

export default function SubmissionSection({ contacts, partners, rsvps, onDeleteContact, onDeletePartner }: SubmissionSectionProps) {
  const [subTab, setSubTab] = useState<'contacts' | 'partners' | 'rsvps'>('contacts');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex gap-2 p-1 bg-slate-800/50 rounded-xl w-fit">
        {[
          { id: 'contacts', label: 'Contact Us', count: contacts.length },
          { id: 'partners', label: 'Partners', count: partners.length },
          { id: 'rsvps', label: 'RSVPs', count: rsvps.length },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              subTab === t.id ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.label} <span className="ml-1 opacity-60 text-xs">({t.count})</span>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {subTab === 'contacts' && contacts.map((c) => (
          <div key={c.id} className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
            <div className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100">{c.name}</h3>
                  <p className="text-xs text-slate-400">{c.email} • {c.major}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500">{new Date(c.submittedAt).toLocaleDateString()}</span>
                <button onClick={() => setExpandedId(expandedId === c.id ? null : c.id)} className="p-1.5 hover:bg-slate-700 rounded text-slate-400">
                  {expandedId === c.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                <button onClick={() => onDeleteContact(c.id)} className="p-1.5 hover:bg-slate-700 rounded text-rose-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            {expandedId === c.id && (
              <div className="px-4 pb-4 pt-2 border-t border-slate-700 bg-slate-900/50">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Message / Reason</p>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{c.reason}</p>
              </div>
            )}
          </div>
        ))}

        {subTab === 'partners' && partners.map((p) => (
          <div key={p.id} className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
            <div className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100">{p.companyName}</h3>
                  <p className="text-xs text-slate-400">{p.contactName} • {p.inquiryType}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500">{new Date(p.submittedAt).toLocaleDateString()}</span>
                <button onClick={() => setExpandedId(expandedId === p.id ? null : p.id)} className="p-1.5 hover:bg-slate-700 rounded text-slate-400">
                  {expandedId === p.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                <button onClick={() => onDeletePartner(p.id)} className="p-1.5 hover:bg-slate-700 rounded text-rose-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            {expandedId === p.id && (
              <div className="px-4 pb-4 pt-2 border-t border-slate-700 bg-slate-900/50 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Email</p>
                    <p className="text-sm text-slate-300">{p.email}</p>
                  </div>
                  {p.projectType && (
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Project Type</p>
                      <p className="text-sm text-slate-300">{p.projectType}</p>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Description</p>
                  <p className="text-sm text-slate-300 leading-relaxed">{p.description}</p>
                </div>
              </div>
            )}
          </div>
        ))}

        {subTab === 'rsvps' && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center py-10">
            <CheckCircle className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-400">RSVPs are now managed directly within the <span className="text-white font-medium">Events</span> tab.</p>
          </div>
        )}
      </div>
    </div>
  );
}
