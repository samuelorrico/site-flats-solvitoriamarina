'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

export type Photo = { src: string; alt: string; w: number; h: number };

export default function GalleryGrid({ photos }: { photos: Photo[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const reduce = useReducedMotion();
  const open = index !== null;

  const close = useCallback(() => setIndex(null), []);
  const prev = useCallback(
    () => setIndex((i) => (i === null ? i : (i + photos.length - 1) % photos.length)),
    [photos.length],
  );
  const next = useCallback(
    () => setIndex((i) => (i === null ? i : (i + 1) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, close, prev, next]);

  const current = index !== null ? photos[index] : null;

  return (
    <>
      <div className="columns-2 md:columns-3 gap-4">
        {photos.map((p, i) => (
          <button
            key={p.src}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={p.alt}
            className="reveal mb-4 block w-full break-inside-avoid overflow-hidden rounded-2xl group cursor-zoom-in"
          >
            <Image
              src={p.src}
              alt={p.alt}
              width={p.w}
              height={p.h}
              sizes="(min-width:768px) 33vw, 50vw"
              className="w-full h-auto transition-transform duration-500 group-hover:scale-[1.05]"
            />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {open && current && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-sea-deep/92 backdrop-blur-sm p-4 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={current.alt}
          >
            <button type="button" onClick={close} aria-label="Fechar" className="absolute top-4 right-4 text-sand-soft/80 hover:text-sand-soft text-3xl leading-none">×</button>
            <button type="button" onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Anterior" className="absolute left-2 sm:left-6 text-sand-soft/70 hover:text-sand-soft p-3 text-2xl">‹</button>
            <button type="button" onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Próxima" className="absolute right-2 sm:right-6 text-sand-soft/70 hover:text-sand-soft p-3 text-2xl">›</button>
            <motion.div
              key={current.src}
              onClick={(e) => e.stopPropagation()}
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={current.src}
                alt={current.alt}
                className="max-h-[85vh] max-w-[92vw] w-auto h-auto object-contain rounded-xl shadow-2xl"
              />
              <p className="mt-3 text-center text-sm text-sand/70">{current.alt}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
