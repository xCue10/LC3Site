import { useState, useCallback } from 'react';
import type { Member, CustomField } from '@/lib/types';
import { Search, Plus, User, Trash2, Edit2, Github, Linkedin, Twitter, ExternalLink, MoveUp, MoveDown } from 'lucide-react';

interface MemberSectionProps {
  members: Member[];
  onSave: (member: Member) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onReorder: (id: string, direction: 'up' | 'down') => Promise<void>;
}

export default function MemberSection({ members, onSave, onDelete, onReorder }: MemberSectionProps) {
  const [search, setSearch] = useState('');
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const filteredMembers = members
    .filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.role.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  const handleEdit = (member: Member) => {
    setEditingMember({ ...member });
  };

  const handleCreate = () => {
    setEditingMember({
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      role: '',
      memberType: 'member',
      majors: [],
      focusArea: '',
      status: 'Active',
      avatarUrl: '',
      bio: '',
      skills: [],
      projects: [],
      github: '',
      linkedin: '',
      twitter: '',
      displayOrder: members.length
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
          />
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" /> Add Member
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredMembers.map((member) => (
          <div key={member.id} className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-violet-500/30 transition-all group">
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-lg bg-slate-700 overflow-hidden flex-shrink-0">
                {member.avatarUrl ? (
                  <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-8 h-8 text-slate-500" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100 truncate">{member.name}</h3>
                    <p className="text-slate-400 text-sm truncate">{member.role} • {member.memberType}</p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onReorder(member.id, 'up')} className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white"><MoveUp className="w-3.5 h-3.5" /></button>
                    <button onClick={() => onReorder(member.id, 'down')} className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white"><MoveDown className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleEdit(member)} className="p-1.5 hover:bg-slate-700 rounded text-blue-400 hover:text-blue-300"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => onDelete(member.id)} className="p-1.5 hover:bg-slate-700 rounded text-rose-400 hover:text-rose-300"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {member.github && <Github className="w-4 h-4 text-slate-500" />}
                  {member.linkedin && <Linkedin className="w-4 h-4 text-slate-500" />}
                  {member.twitter && <Twitter className="w-4 h-4 text-slate-500" />}
                  {member.website && <ExternalLink className="w-4 h-4 text-slate-500" />}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingMember && (
        <MemberModal
          member={editingMember}
          onClose={() => setEditingMember(null)}
          onSave={async (m) => {
            await onSave(m);
            setEditingMember(null);
          }}
        />
      )}
    </div>
  );
}

function MemberModal({ member, onClose, onSave }: { member: Member, onClose: () => void, onSave: (m: Member) => Promise<void> }) {
  const [data, setData] = useState<Member>(member);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center sticky top-0 bg-slate-900 z-10">
          <h2 className="text-xl font-bold text-white">{member.name ? 'Edit Member' : 'New Member'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Role / Title</label>
              <input
                type="text"
                value={data.role}
                onChange={(e) => setData({ ...data, role: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Member Type</label>
              <select
                value={data.memberType}
                onChange={(e) => setData({ ...data, memberType: e.target.value as any })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="member">Member</option>
                <option value="officer">Officer</option>
                <option value="advisor">Advisor</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Status</label>
              <input
                type="text"
                value={data.status}
                onChange={(e) => setData({ ...data, status: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Avatar URL</label>
            <input
              type="text"
              value={data.avatarUrl}
              onChange={(e) => setData({ ...data, avatarUrl: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Bio</label>
            <textarea
              value={data.bio}
              onChange={(e) => setData({ ...data, bio: e.target.value })}
              rows={3}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">GitHub URL</label>
              <input
                type="text"
                value={data.github}
                onChange={(e) => setData({ ...data, github: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">LinkedIn URL</label>
              <input
                type="text"
                value={data.linkedin}
                onChange={(e) => setData({ ...data, linkedin: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-slate-800 flex justify-end gap-3 sticky bottom-0 bg-slate-900 z-10">
          <button onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white transition-colors">Cancel</button>
          <button onClick={() => onSave(data)} className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors">Save Changes</button>
        </div>
      </div>
    </div>
  );
}
