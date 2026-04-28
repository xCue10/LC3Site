import { useState } from 'react';
import type { Post } from '@/lib/types';
import { Plus, Edit2, Trash2, Globe, FileText, Calendar } from 'lucide-react';

interface BlogSectionProps {
  posts: Post[];
  onSave: (post: Post | null, data: any) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onTogglePublished: (post: Post) => Promise<void>;
}

export default function BlogSection({ posts, onSave, onDelete, onTogglePublished }: BlogSectionProps) {
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditingPost(null);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Blog Posts</h2>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" /> New Post
        </button>
      </div>

      <div className="space-y-3">
        {posts.map((post) => (
          <div key={post.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-center gap-4 group">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${post.published ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-700/50 text-slate-500'}`}>
              {post.published ? <Globe className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-semibold text-slate-100 truncate">{post.title}</h3>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${post.published ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-700 text-slate-400'}`}>
                  {post.published ? 'Live' : 'Draft'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(post.publishedAt).toLocaleDateString()}</span>
                <span className="truncate">/{post.slug}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => onTogglePublished(post)} 
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${post.published ? 'text-amber-400 hover:bg-amber-400/10' : 'text-emerald-400 hover:bg-emerald-400/10'}`}
              >
                {post.published ? 'Unpublish' : 'Publish'}
              </button>
              <button onClick={() => handleEdit(post)} className="p-2 hover:bg-slate-700 rounded text-blue-400 transition-colors"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => onDelete(post.id)} className="p-2 hover:bg-slate-700 rounded text-rose-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <BlogModal
          post={editingPost}
          onClose={() => setShowModal(false)}
          onSave={async (data) => {
            await onSave(editingPost, data);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}

function BlogModal({ post, onClose, onSave }: { post: Post | null, onClose: () => void, onSave: (data: any) => Promise<void> }) {
  const [data, setData] = useState(post || {
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    published: false,
    publishedAt: new Date().toISOString()
  });

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900">
          <h2 className="text-xl font-bold text-white">{post ? 'Edit Post' : 'New Post'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Title</label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setData({ ...data, title, slug: post ? data.slug : generateSlug(title) });
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">URL Slug</label>
              <input
                type="text"
                value={data.slug}
                onChange={(e) => setData({ ...data, slug: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Excerpt / Summary</label>
            <textarea
              value={data.excerpt}
              onChange={(e) => setData({ ...data, excerpt: e.target.value })}
              rows={2}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Content (Markdown)</label>
              <span className="text-[10px] text-slate-500 italic">Supports standard markdown formatting</span>
            </div>
            <textarea
              value={data.content}
              onChange={(e) => setData({ ...data, content: e.target.value })}
              rows={12}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        </div>
        <div className="p-6 border-t border-slate-800 flex justify-between items-center bg-slate-900">
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="isPublished"
              checked={data.published}
              onChange={(e) => setData({ ...data, published: e.target.checked })}
              className="w-4 h-4 accent-violet-500"
            />
            <label htmlFor="isPublished" className="text-sm text-slate-300 cursor-pointer">Published / Visible</label>
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white transition-colors">Cancel</button>
            <button onClick={() => onSave(data)} className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors">Save Post</button>
          </div>
        </div>
      </div>
    </div>
  );
}
