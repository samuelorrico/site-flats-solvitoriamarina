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
  const dialogRef = useRef<HTMLDivElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
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

  // Teclado + trava de rolagem + foco preso no modal (a11y).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'Tab') {
        const f = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], [tabindex]:not([tabindex="-1"])',
        );
        if (!f || f.length === 0) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, close, prev, next]);

  // Move o foco para o modal ao abrir e devolve ao elemento anterior ao fechar.
  useEffect(() => {
    if (!open) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    return () => prevFocus?.focus?.();
  }, [open]);

  // Mantém a miniatura ativa visível na faixa.
  useEffect(() => {
    if (index === null) return;
    const el = thumbsRef.current?.children[index] as HTMLElement | undefined;
    el?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
  }, [index, reduce]);

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
            ref={dialogRef}
            tabIndex={-1}
            className="fixed inset-0 z-[100] flex flex-col bg-sea-deep/95 backdrop-blur-sm outline-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={current.alt}
          >
            {/* Barra superior: contador + fechar */}
            <div
              className="flex items-center justify-between px-4 sm:px-6 py-4 text-sand-soft/85"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-sm tabular-nums tracking-wide">
                {(index ?? 0) + 1} / {view.length}
              </span>
              <button
                type="button"
                onClick={close}
                aria-label={labels.close}
                className="text-3xl leading-none hover:text-sand-soft"
              >
                ×
              </button>
            </div>

            {/* Área da imagem com setas + swipe */}
            <div className="relative flex-1 flex items-center justify-center px-2 sm:px-14 min-h-0" onClick={close}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label={labels.prev}
                className="absolute left-1 sm:left-4 z-10 p-3 text-2xl text-sand-soft/70 hover:text-sand-soft"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label={labels.next}
                className="absolute right-1 sm:right-4 z-10 p-3 text-2xl text-sand-soft/70 hover:text-sand-soft"
              >
                ›
              </button>
              <m.div
                key={current.src}
                onClick={(e) => e.stopPropagation()}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.18}
                onDragEnd={(_e, info) => {
                  if (info.offset.x < -70 || info.velocity.x < -500) next();
                  else if (info.offset.x > 70 || info.velocity.x > 500) prev();
                }}
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="relative cursor-grab active:cursor-grabbing"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={current.src}
                  alt={current.alt}
                  draggable={false}
                  className="max-h-[72vh] max-w-[92vw] w-auto h-auto object-contain rounded-xl shadow-2xl select-none"
                />
              </m.div>
            </div>

            {/* Legenda + miniaturas */}
            <div className="px-4 pb-4 pt-2" onClick={(e) => e.stopPropagation()}>
              <p className="text-center text-sm text-sand/70 mb-3">{current.alt}</p>
              <div ref={thumbsRef} className="flex gap-2 overflow-x-auto pb-1 sm:justify-center">
                {view.map((p, i) => (
                  <button
                    key={p.src}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={p.alt}
                    aria-current={i === index ? 'true' : undefined}
                    className={`relative h-11 w-14 shrink-0 overflow-hidden rounded-md transition ${
                      i === index ? 'ring-2 ring-sand-soft' : 'opacity-50 hover:opacity-90'
                    }`}
                  >
                    <Image src={p.src} alt="" fill sizes="56px" className="object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
