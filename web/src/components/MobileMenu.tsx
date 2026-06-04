'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import type { Locale } from '@/i18n-config';
import type { Dict } from '@/dictionaries';
import { WA_LINK } from '@/lib/site';

// Menu mobile (drawer). Só aparece abaixo de `md`, onde a nav do Header fica oculta.
export default function MobileMenu({ lang, dict }: { lang: Locale; dict: Dict }) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const base = `/${lang}`;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const links = [
    { href: `${base}#quartos`, label: dict['nav.rooms'] },
    { href: `${base}/galeria`, label: dict['nav.gallery'] },
    { href: `${base}#pier`, label: dict['nav.pier'] },
    { href: `${base}#localizacao`, label: dict['nav.location'] },
    { href: `${base}#contato`, label: dict['nav.contact'] },
  ];

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={dict['nav.open']}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="inline-flex items-center justify-center w-10 h-10 -mr-2 text-sea"
      >
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute inset-0 bg-sea-deep/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <motion.nav
              id="mobile-menu"
              aria-label={dict['nav.menu']}
              initial={reduce ? { opacity: 0 } : { x: '100%' }}
              animate={reduce ? { opacity: 1 } : { x: 0 }}
              exit={reduce ? { opacity: 0 } : { x: '100%' }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-0 h-full w-[80%] max-w-xs bg-sand-soft shadow-2xl flex flex-col p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="font-display text-xl tracking-tightest text-sea">
                  Vitória Marina <span className="text-sun-deep italic">Flats</span>
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={dict['nav.close']}
                  className="w-10 h-10 -mr-2 inline-flex items-center justify-center text-ink/60 hover:text-sea text-3xl leading-none"
                >
                  ×
                </button>
              </div>

              <div className="flex flex-col">
                {links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="py-3.5 text-lg text-ink/85 border-b border-ink/5 hover:text-sea transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>

              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener"
                onClick={() => setOpen(false)}
                className="mt-auto inline-flex items-center justify-center gap-2 bg-sun text-sea-deep font-semibold px-5 py-3.5 rounded-full hover:bg-sun-light transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
                  <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.477-.911z" />
                </svg>
                WhatsApp
              </a>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
