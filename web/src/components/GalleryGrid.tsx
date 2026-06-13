'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { m, AnimatePresence, useReducedMotion } from 'motion/react';
import { blurProps } from '@/lib/blur-data';

export type Photo = { src: string; alt: string; w: number; h: number; cat: string };
type Labels = { close: string; prev: string; next: string };
type Filter = { key: string; label: string };

export default function GalleryGrid({
  photos,
  filters,
  labels,
}: {
  photos: Photo[];
  filters: Filter[];
  labels: Labels;
}) {
  const [active, setActive] = useState('all');
  const [index, setIndex] = useState<number | null>(null);
  const reduce = useReducedMotion();
  const open = index !== null;

  // Fotos visíveis no filtro atual. O lightbox navega DENTRO deste subconjunto.
  const view = active === 'all' ? photos : photos.filter((p) => p.cat === active);

  const gridRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);
  // O RevealInit global só observa os `.reveal` uma vez (no load). Ao trocar de filtro,
  // novos cards entram sem observador e ficariam invisíveis — então os revelamos aqui.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return; // no load inicial, deixa o RevealInit fazer o stagger
    }
    gridRef.current?.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
  }, [active]);

  function selectFilter(key: string) {
    setIndex(null); // fecha o lightbox p/ não ficar com índice de outro subconjunto
    setActive(key);
  }

  const close = useCallback(() => setIndex(null), []);
  const prev = useCallback(
    () => setIndex((i) => (i === null ? i : (i + view.length - 1) % view.length)),
    [view.length],
  );
  const next = useCallback(
    () => setIndex((i) => (i === null ? i : (i + 1) % view.length)),
    [view.length],
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

  const current = index !== null ? view[index] : null;

  return (
    <>
      {/* Filtros */}
      <div className="reveal flex flex-wrap gap-2.5 mb-10">
        {filters.map((f) => {
          const isActive = active === f.key;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => selectFilter(f.key)}
              aria-pressed={isActive}
              className={
                isActive
                  ? 'px-4 py-2 rounded-full text-sm bg-sea text-sand-soft transition-colors'
                  : 'px-4 py-2 rounded-full text-sm border border-ink/15 hover:border-sea text-ink/70 transition-colors'
              }
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div ref={gridRef} className="columns-2 md:columns-3 gap-4">
        {view.map((p, i) => (
          <button
            key={p.src}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={p.alt}
            className="reveal mb-4 block w-full break-inside-avoid overflow-hidden rounded-2xl group cursor-zoom-in transition-shadow duration-300 hover:shadow-xl"
          >
            <Image
              src={p.src}
              alt={p.alt}
              width={p.w}
              height={p.h}
              {...blurProps(p.src)}
              sizes="(min-width:768px) 33vw, 50vw"
              className="w-full h-auto transition-transform duration-500 ease-out group-hover:scale-[1.09]"
            />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {open && current && (
          <m.div
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
            <button type="button" onClick={close} aria-label={labels.close} className="absolute top-4 right-4 text-sand-soft/80 hover:text-sand-soft text-3xl leading-none">×</button>
            <button type="button" onClick={(e) => { e.stopPropagation(); prev(); }} aria-label={labels.prev} className="absolute left-2 sm:left-6 text-sand-soft/70 hover:text-sand-soft p-3 text-2xl">‹</button>
            <button type="button" onClick={(e) => { e.stopPropagation(); next(); }} aria-label={labels.next} className="absolute right-2 sm:right-6 text-sand-soft/70 hover:text-sand-soft p-3 text-2xl">›</button>
            <m.div
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
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
