'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

export interface GalleryImage {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  created_at: string;
  context?: {
    custom?: {
      event?: string;
      caption?: string;
    };
  };
}

function thumbUrl(url: string) {
  return url.replace('/upload/', '/upload/w_800,h_600,c_fill,q_auto,f_auto/');
}

function lightboxUrl(url: string) {
  return url.replace('/upload/', '/upload/w_1600,q_auto,f_auto/');
}

function getEvent(img: GalleryImage) {
  return img.context?.custom?.event?.trim() || '';
}

function getCaption(img: GalleryImage) {
  return img.context?.custom?.caption?.trim() || '';
}

export default function GalleryClient({ images }: { images: GalleryImage[] }) {
  const [selected, setSelected] = useState<number | null>(null);

  // Group images by event, preserving insertion order; ungrouped go last
  const { groups, flatOrder } = useMemo(() => {
    const map = new Map<string, GalleryImage[]>();
    for (const img of images) {
      const key = getEvent(img) || '__ungrouped__';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(img);
    }
    // Build flat array in same order for lightbox indexing
    const flat: GalleryImage[] = [];
    // Named events first, ungrouped last
    const named = [...map.entries()].filter(([k]) => k !== '__ungrouped__');
    const ungrouped = map.get('__ungrouped__') ?? [];
    const ordered = [...named, ...( ungrouped.length ? [['__ungrouped__', ungrouped] as [string, GalleryImage[]]] : [])];
    const finalMap = new Map<string, GalleryImage[]>(ordered);
    for (const imgs of finalMap.values()) flat.push(...imgs);
    return { groups: finalMap, flatOrder: flat };
  }, [images]);

  // Map public_id → flat index for onClick
  const idxMap = useMemo(() => {
    const m = new Map<string, number>();
    flatOrder.forEach((img, i) => m.set(img.public_id, i));
    return m;
  }, [flatOrder]);

  const close = useCallback(() => setSelected(null), []);
  const prev = useCallback(
    () => setSelected((i) => (i !== null ? (i - 1 + flatOrder.length) % flatOrder.length : null)),
    [flatOrder.length]
  );
  const next = useCallback(
    () => setSelected((i) => (i !== null ? (i + 1) % flatOrder.length : null)),
    [flatOrder.length]
  );

  useEffect(() => {
    if (selected === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selected, close, prev, next]);

  useEffect(() => {
    document.body.style.overflow = selected !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selected]);

  const activeImg = selected !== null ? flatOrder[selected] : null;
  const activeEvent = activeImg ? getEvent(activeImg) : '';
  const activeCaption = activeImg ? getCaption(activeImg) : '';

  return (
    <>
      {/* ── Event-grouped grid ── */}
      <div className="space-y-14">
        {[...groups.entries()].map(([eventKey, imgs]) => (
          <section key={eventKey}>
            {/* Section header */}
            {eventKey !== '__ungrouped__' ? (
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-1">
                  <span className="w-1 h-5 rounded-full bg-gradient-to-b from-blue-500 to-violet-600" />
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{eventKey}</h2>
                  <span className="text-sm text-slate-400 tabular-nums">{imgs.length} photo{imgs.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="ml-4 h-px bg-gradient-to-r from-violet-400/30 via-blue-400/20 to-transparent" />
              </div>
            ) : (
              groups.size > 1 && (
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="w-1 h-5 rounded-full bg-slate-400" />
                    <h2 className="text-lg font-semibold text-slate-600 dark:text-slate-400">Other</h2>
                    <span className="text-sm text-slate-400 tabular-nums">{imgs.length} photo{imgs.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="ml-4 h-px bg-gradient-to-r from-slate-300/50 to-transparent dark:from-slate-600/40" />
                </div>
              )
            )}

            {/* Photo grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {imgs.map((img) => {
                const caption = getCaption(img);
                const globalIdx = idxMap.get(img.public_id) ?? 0;
                return (
                  <button
                    key={img.public_id}
                    onClick={() => setSelected(globalIdx)}
                    className="group relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#111a2e] border border-slate-200 dark:border-[#1e2d45] shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                  >
                    {/* Image */}
                    <div className="aspect-[4/3] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={thumbUrl(img.secure_url)}
                        alt={getEvent(img) || 'Gallery photo'}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {/* Hover overlay — expand hint */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-end justify-between p-3">
                      {caption ? (
                        <p className="text-white/90 text-xs leading-snug line-clamp-2 pr-2">{caption}</p>
                      ) : <span />}
                      <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* ── Lightbox ── */}
      {selected !== null && activeImg && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
          onClick={close}
        >
          {/* Close */}
          <button
            onClick={close}
            className="absolute top-5 right-5 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Counter */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/40 text-xs tabular-nums">
            {selected + 1} / {flatOrder.length}
          </div>

          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 sm:left-8 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Previous"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 sm:right-8 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Next"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Content */}
          <div
            className="flex flex-col items-center gap-5 px-20 sm:px-28 max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightboxUrl(activeImg.secure_url)}
              alt={activeEvent || 'Gallery photo'}
              className="max-w-full max-h-[75vh] object-contain rounded-xl"
            />

            {(activeEvent || activeCaption) && (
              <div className="w-full max-w-2xl border-t border-white/10 pt-4 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                {activeEvent && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-violet-400 whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                    {activeEvent}
                  </span>
                )}
                {activeCaption && (
                  <p className="text-white/65 text-sm leading-relaxed">{activeCaption}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
