import type { Metadata } from 'next';
import GalleryClient, { type GalleryImage } from './GalleryClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Photos and memories from LC3 events, hackathons, and club activities.',
};

async function fetchGalleryImages(): Promise<GalleryImage[]> {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  const key = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;

  if (!cloud || !key || !secret) return [];

  try {
    const auth = Buffer.from(`${key}:${secret}`).toString('base64');
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloud}/resources/image?prefix=lc3-gallery&type=upload&max_results=500&context=true`,
      { headers: { Authorization: `Basic ${auth}` }, cache: 'no-store' }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.resources ?? []) as GalleryImage[];
  } catch {
    return [];
  }
}

export default async function GalleryPage() {
  const images = await fetchGalleryImages();
  const missing = !process.env.CLOUDINARY_CLOUD_NAME;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <svg width="72" height="72" viewBox="0 0 72 72" className="mx-auto mb-5 opacity-85 dark:opacity-75" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <style>{`
              @keyframes gal-spark { 0%,100%{opacity:0.3} 50%{opacity:0.9} }
              @keyframes gal-ring  { 0%,100%{opacity:0.1} 50%{opacity:0.35} }
              @keyframes gal-corner{ 0%,100%{opacity:0.4} 50%{opacity:0.9} }
              @keyframes gal-lens  { 0%,100%{opacity:0.6} 50%{opacity:1} }
            `}</style>
          </defs>
          <circle cx="36" cy="36" r="33" fill="#7c3aed" fillOpacity="0.07" stroke="#7c3aed" strokeWidth="1" strokeOpacity="0.3"/>
          {/* Camera body */}
          <rect x="12" y="22" width="48" height="32" rx="6" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeOpacity="0.7"/>
          <rect x="12" y="22" width="48" height="10" rx="6" fill="#6366f1" fillOpacity="0.12"/>
          <rect x="12" y="27" width="48" height="5" fill="#6366f1" fillOpacity="0.1"/>
          {/* Viewfinder bump */}
          <rect x="26" y="16" width="14" height="8" rx="3" fill="none" stroke="#818cf8" strokeWidth="1.5" strokeOpacity="0.6"/>
          {/* Lens outer */}
          <circle cx="36" cy="38" r="11" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeOpacity="0.65" style={{animation:'gal-lens 2.5s ease-in-out infinite'}}/>
          {/* Lens inner */}
          <circle cx="36" cy="38" r="7" fill="#6366f1" fillOpacity="0.12" stroke="#818cf8" strokeWidth="1" strokeOpacity="0.5"/>
          <circle cx="36" cy="38" r="3.5" fill="#6366f1" fillOpacity="0.25"/>
          {/* Shutter button */}
          <circle cx="54" cy="25" r="2.5" fill="#0891b2" fillOpacity="0.55"/>
          {/* Flash */}
          <rect x="18" y="26" width="5" height="3" rx="1.5" fill="#818cf8" fillOpacity="0.5"/>
          {/* Sparkle dots */}
          <circle cx="8" cy="12" r="2.5" fill="#6366f1" fillOpacity="0.7" style={{animation:'gal-spark 2s ease-in-out infinite'}}/>
          <circle cx="63" cy="10" r="2" fill="#818cf8" fillOpacity="0.65" style={{animation:'gal-spark 2s ease-in-out infinite 0.5s'}}/>
          <circle cx="10" cy="60" r="2" fill="#0891b2" fillOpacity="0.65" style={{animation:'gal-spark 2s ease-in-out infinite 1s'}}/>
          <circle cx="62" cy="60" r="2.5" fill="#6366f1" fillOpacity="0.7" style={{animation:'gal-spark 2s ease-in-out infinite 1.5s'}}/>
          {/* Outer glow ring */}
          <circle cx="36" cy="36" r="35.5" fill="none" stroke="#6366f1" strokeWidth="1" strokeOpacity="1" style={{animation:'gal-ring 3s ease-in-out infinite'}}/>
          {/* Corner accents */}
          <path d="M12 2 L2 2 L2 12" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{animation:'gal-corner 3s ease-in-out infinite'}}/>
          <path d="M60 2 L70 2 L70 12" fill="none" stroke="#0891b2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{animation:'gal-corner 3s ease-in-out infinite 0.75s'}}/>
          <path d="M12 70 L2 70 L2 60" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{animation:'gal-corner 3s ease-in-out infinite 1.5s'}}/>
          <path d="M60 70 L70 70 L70 60" fill="none" stroke="#0891b2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{animation:'gal-corner 3s ease-in-out infinite 2.25s'}}/>
        </svg>
        <p className="text-violet-600 dark:text-violet-400 text-sm font-medium mb-2">Moments &amp; memories</p>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">Gallery</h1>
        <p className="text-slate-500 max-w-xl mx-auto">
          Photos from LC3 events, workshops, hackathons, and everything in between.
        </p>
      </div>

      {missing ? (
        <div className="text-center py-20 border border-dashed border-slate-300 dark:border-[#1e2d45] rounded-2xl">
          <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4 dark:bg-[#0d1424] dark:border-[#1e2d45]">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="text-slate-500 font-medium mb-1">Gallery not configured</p>
          <p className="text-slate-400 text-sm max-w-sm mx-auto">
            Set <code className="text-violet-500 bg-violet-50 dark:bg-violet-500/10 px-1.5 py-0.5 rounded text-xs">CLOUDINARY_CLOUD_NAME</code>,{' '}
            <code className="text-violet-500 bg-violet-50 dark:bg-violet-500/10 px-1.5 py-0.5 rounded text-xs">CLOUDINARY_API_KEY</code>, and{' '}
            <code className="text-violet-500 bg-violet-50 dark:bg-violet-500/10 px-1.5 py-0.5 rounded text-xs">CLOUDINARY_API_SECRET</code>{' '}
            environment variables to enable the gallery.
          </p>
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4 dark:bg-[#0d1424] dark:border-[#1e2d45]">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="text-slate-400">No photos yet. Check back soon!</p>
        </div>
      ) : (
        <GalleryClient images={images} />
      )}
    </div>
  );
}
