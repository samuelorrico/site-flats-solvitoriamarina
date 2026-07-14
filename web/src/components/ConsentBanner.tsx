'use client';

import { useEffect, useSyncExternalStore } from 'react';
import Link from 'next/link';
import type { Locale } from '@/i18n-config';
import {
  ADS_ENABLED,
  readConsent,
  loadGoogleTag,
  trackWhatsAppClick,
  subscribeConsent,
  consentSnapshot,
  consentServerSnapshot,
  setConsent,
} from '@/lib/analytics';

// Consentimento LGPD para os cookies de publicidade do Google Ads.
// Regra: NADA do Google carrega antes de um "Aceitar" explícito. Recusar bloqueia de vez.
// Sem NEXT_PUBLIC_GADS_ID (ADS_ENABLED=false) o banner nem existe e o site fica sem cookies,
// exatamente como antes. O store externo (lib/analytics) evita setState-em-effect e o
// mismatch de hidratação do localStorage.

export default function ConsentBanner({
  lang,
  labels,
}: {
  lang: Locale;
  labels: { text: string; accept: string; reject: string; privacy: string };
}) {
  const consent = useSyncExternalStore(subscribeConsent, consentSnapshot, consentServerSnapshot);

  // Visitante que já aceitou numa visita anterior: recarrega o tag.
  useEffect(() => {
    if (ADS_ENABLED && readConsent() === 'granted') loadGoogleTag();
  }, []);

  // Conversão: qualquer clique que leve ao WhatsApp (header, rodapé, menu, botão flutuante).
  // O QualForm chama trackWhatsAppClick() direto, porque usa window.open (não é <a>).
  useEffect(() => {
    if (!ADS_ENABLED) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('a[href*="wa.me/"]')) trackWhatsAppClick();
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  // Sem tag configurada, ou decisão já tomada → nada a mostrar.
  if (!ADS_ENABLED || consent !== null) return null;

  return (
    <div
      role="dialog"
      aria-label={labels.text}
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-sand/20 bg-sea-deep/95 px-5 py-4 text-sand-soft backdrop-blur-md sm:px-8"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-sand-soft/90">
          {labels.text}{' '}
          <Link href={`/${lang}/privacidade`} className="underline underline-offset-2 hover:text-sun-light">
            {labels.privacy}
          </Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => setConsent('denied')}
            className="rounded-full border border-sand-soft/40 px-5 py-2 text-sm font-medium text-sand-soft transition-colors hover:bg-sand-soft/10"
          >
            {labels.reject}
          </button>
          <button
            type="button"
            onClick={() => setConsent('granted')}
            className="rounded-full bg-sun px-5 py-2 text-sm font-semibold text-sea-deep transition-colors hover:bg-sun-light"
          >
            {labels.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
