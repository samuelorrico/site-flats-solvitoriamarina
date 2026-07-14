'use client';

import { ADS_ENABLED, resetConsent } from '@/lib/analytics';

// Revogação do consentimento (LGPD): retirar tem que ser tão fácil quanto dar.
// Só aparece quando há tag configurada — sem Google Ads, não há consentimento a revogar.
export default function CookieSettings({ label }: { label: string }) {
  if (!ADS_ENABLED) return null;
  return (
    <button type="button" onClick={resetConsent} className="hover:text-sand-soft hover:underline underline-offset-2">
      {label}
    </button>
  );
}
