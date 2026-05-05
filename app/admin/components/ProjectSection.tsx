import { useState } from 'react';
import type { Project, ProjectStatus } from '@/lib/types';
import { Plus, Edit2, Trash2, Github, ExternalLink } from 'lucide-react';

interface ProjectSectionProps {
  projects: Project[];
  onSave: (project: Project | null, data: any) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function ProjectSection({ projects, onSave, onDelete }: ProjectSectionProps) {
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditingProject(null);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Projects</h2>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <div key={project.id} className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden group">
            <div className={`h-1.5 bg-gradient-to-r ${project.gradient}`} />
            <div className="p-5">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-100 truncate">{project.name}</h3>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      project.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      project.status === 'in-progress' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      {project.status || 'open'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 line-clamp-2">{project.description}</p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(project)} className="p-2 hover:bg-slate-700 rounded text-blue-400 transition-colors"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => onDelete(project.id)} className="p-2 hover:bg-slate-700 rounded text-rose-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {project.tags.map(tag => (
                  <span key={tag} className="text-[10px] bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded border border-slate-600/50">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <ProjectModal
          project={editingProject}
          onClose={() => setShowModal(false)}
          onSave={async (data) => {
            await onSave(editingProject, data);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}

function ProjectModal({ project, onClose, onSave }: { project: Project | null, onClose: () => void, onSave: (data: any) => Promise<void> }) {
  const [data, setData] = useState(project || {
    name: '',
    description: '',
    tags: [] as string[],
    gradient: 'from-blue-600 to-violet-600',
    github: '',
    status: 'in-progress' as ProjectStatus
  });

  const [tagInput, setTagInput] = useState('');

  const addTag = () => {
    if (tagInput.trim() && !data.tags.includes(tagInput.trim())) {
      setData({ ...data, tags: [...data.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900">
          <h2 className="text-xl font-bold text-white">{project ? 'Edit Project' : 'New Project'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Project Name</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Status</label>
              <select
                value={data.status}
                onChange={(e) => setData({ ...data, status: e.target.value as any })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="open">Open</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Gradient Class (Tailwind)</label>
              <input
                type="text"
                value={data.gradient}
                onChange={(e) => setData({ ...data, gradient: e.target.value })}
                placeholder="from-blue-600 to-violet-600"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
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
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">GitHub URL</label>
            <input
              type="text"
              value={data.github}
              onChange={(e) => setData({ ...data, github: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="Add a tag..."
              />
              <button onClick={addTag} className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.tags.map(tag => (
                <span key={tag} className="flex items-center gap-1.5 bg-violet-500/10 text-violet-400 px-2 py-1 rounded text-xs border border-violet-500/20">
                  {tag}
                  <button onClick={() => setData({ ...data, tags: data.tags.filter(t => t !== tag) })} className="hover:text-white">✕</button>
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-slate-800 flex justify-end gap-3 bg-slate-900">
          <button onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white transition-colors">Cancel</button>
          <button onClick={() => onSave(data)} className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors">Save Project</button>
        </div>
      </div>
    </div>
  );
}
