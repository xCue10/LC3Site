import { useState } from 'react';
import { Plus, Trash2, Edit2, ExternalLink, Image as ImageIcon, X, Upload } from 'lucide-react';

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

interface GallerySectionProps {
  images: GalleryImage[];
  onUpload: (file: File, event: string, caption: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, event: string, caption: string) => Promise<void>;
}

export default function GallerySection({ images, onUpload, onDelete, onUpdate }: GallerySectionProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [uploading, setUploading] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Gallery</h2>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Photo
        </button>
      </div>

      {images.length === 0 ? (
        <div className="text-center py-20 bg-slate-800/30 border-2 border-dashed border-slate-700 rounded-2xl">
          <ImageIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No photos in the gallery yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {images.map((img) => (
            <div key={img.public_id} className="group relative aspect-square bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
              <img
                src={img.secure_url.replace('/upload/', '/upload/w_400,h_400,c_fill,q_auto,f_auto/')}
                alt={img.context?.custom?.caption || ''}
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                <p className="text-xs font-bold text-white truncate">{img.context?.custom?.event || 'Untagged Event'}</p>
                <p className="text-[10px] text-slate-300 truncate">{img.context?.custom?.caption || 'No caption'}</p>
                <div className="flex gap-1 mt-2">
                  <button onClick={() => setEditingImage(img)} className="p-1.5 bg-slate-900/80 hover:bg-violet-600 rounded text-white transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => onDelete(img.public_id)} className="p-1.5 bg-slate-900/80 hover:bg-rose-600 rounded text-white transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  <a href={img.secure_url} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-slate-900/80 hover:bg-blue-600 rounded text-white transition-colors"><ExternalLink className="w-3.5 h-3.5" /></a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <UploadModal
          onClose={() => setShowAdd(false)}
          onUpload={async (f, e, c) => {
            setUploading(true);
            await onUpload(f, e, c);
            setUploading(false);
            setShowAdd(false);
          }}
          loading={uploading}
        />
      )}

      {editingImage && (
        <EditModal
          image={editingImage}
          onClose={() => setEditingImage(null)}
          onSave={async (e, c) => {
            await onUpdate(editingImage.public_id, e, c);
            setEditingImage(null);
          }}
        />
      )}
    </div>
  );
}

function UploadModal({ onClose, onUpload, loading }: { onClose: () => void, onUpload: (f: File, e: string, c: string) => Promise<void>, loading: boolean }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [event, setEvent] = useState('');
  const [caption, setCaption] = useState('');

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Upload Photo</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Photo</label>
            {preview ? (
              <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-800 border border-slate-700">
                <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                <button onClick={() => { setFile(null); setPreview(''); }} className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/80 rounded-full text-white"><X className="w-4 h-4" /></button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center aspect-video rounded-xl border-2 border-dashed border-slate-700 hover:border-violet-500/50 cursor-pointer transition-colors">
                <Upload className="w-8 h-8 text-slate-500 mb-2" />
                <span className="text-sm text-slate-400">Click to select photo</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) { setFile(f); setPreview(URL.createObjectURL(f)); }
                }} />
              </label>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Event Name</label>
            <input type="text" value={event} onChange={(e) => setEvent(e.target.value)} placeholder="Spring Hackathon 2026" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Caption</label>
            <textarea value={caption} onChange={(e) => setCaption(e.target.value)} rows={2} placeholder="Brief description..." className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
        </div>
        <div className="p-6 border-t border-slate-800 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white transition-colors">Cancel</button>
          <button
            disabled={!file || loading}
            onClick={() => file && onUpload(file, event, caption)}
            className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
}

function EditModal({ image, onClose, onSave }: { image: GalleryImage, onClose: () => void, onSave: (e: string, c: string) => Promise<void> }) {
  const [event, setEvent] = useState(image.context?.custom?.event || '');
  const [caption, setCaption] = useState(image.context?.custom?.caption || '');

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Edit Photo Info</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Event Name</label>
            <input type="text" value={event} onChange={(e) => setEvent(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Caption</label>
            <textarea value={caption} onChange={(e) => setCaption(e.target.value)} rows={3} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
        </div>
        <div className="p-6 border-t border-slate-800 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white transition-colors">Cancel</button>
          <button onClick={() => onSave(event, caption)} className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors">Save Changes</button>
        </div>
      </div>
    </div>
  );
}
