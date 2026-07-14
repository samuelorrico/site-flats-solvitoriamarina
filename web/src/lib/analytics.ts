// Google Ads — conversão do clique no WhatsApp.
//
// PRINCÍPIO: nada é carregado sem (1) o ID configurado E (2) consentimento explícito.
// Sem NEXT_PUBLIC_GADS_ID o site se comporta exatamente como antes: nenhum script do
// Google, nenhum cookie de publicidade, nenhum banner. Ligar = setar as env na Vercel.
export const GADS_ID = process.env.NEXT_PUBLIC_GADS_ID ?? '';
export const GADS_CONVERSION_LABEL = process.env.NEXT_PUBLIC_GADS_CONVERSION_LABEL ?? '';

// Só há o que consentir se houver tag para carregar.
export const ADS_ENABLED = !!GADS_ID;

// 'granted' | 'denied' — guardado no localStorage (o visitante pode limpar/rever).
export const CONSENT_KEY = 'vmf-consent';
export type Consent = 'granted' | 'denied';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function readConsent(): Consent | null {
  if (typeof window === 'undefined') return null;
  try {
    const v = window.localStorage.getItem(CONSENT_KEY);
    return v === 'granted' || v === 'denied' ? v : null;
  } catch {
    return null; // localStorage bloqueado (modo restrito) — trata como "sem decisão"
  }
}

export function writeConsent(v: Consent): void {
  try {
    window.localStorage.setItem(CONSENT_KEY, v);
  } catch {
    // sem persistência: o banner reaparece na próxima visita, o que é aceitável
  }
}

// Injeta o gtag.js. Só deve ser chamado APÓS o consentimento.
export function loadGoogleTag(): void {
  if (!ADS_ENABLED || typeof document === 'undefined') return;
  if (document.getElementById('gtag-js')) return; // já carregado

  const src = document.createElement('script');
  src.id = 'gtag-js';
  src.async = true;
  src.src = `https://www.googletagmanager.com/gtag/js?id=${GADS_ID}`;
  document.head.appendChild(src);

  // Snippet canônico do gtag (empurra o objeto `arguments`, contrato do gtag.js).
  // Inline é permitido pelo CSP ('unsafe-inline' já é necessário p/ a hidratação do Next).
  const init = document.createElement('script');
  init.id = 'gtag-init';
  init.textContent =
    `window.dataLayer=window.dataLayer||[];` +
    `function gtag(){dataLayer.push(arguments);}` +
    `gtag('js',new Date());` +
    `gtag('config','${GADS_ID}');`;
  document.head.appendChild(init);
}

// --- Store do consentimento (compartilhado pelo banner e pelo link do rodapé) ---
let listeners: (() => void)[] = [];
export const subscribeConsent = (cb: () => void) => {
  listeners.push(cb);
  return () => {
    listeners = listeners.filter((l) => l !== cb);
  };
};
const emit = () => listeners.forEach((l) => l());
export const consentSnapshot = (): Consent | null => readConsent();
export const consentServerSnapshot = (): Consent | null => null; // no SSR não há decisão

export function setConsent(v: Consent): void {
  writeConsent(v);
  if (v === 'granted') loadGoogleTag();
  emit();
}

// Revogação. A LGPD exige que retirar o consentimento seja tão fácil quanto dá-lo.
// Limpa a escolha e recarrega: a página volta SEM o tag (não há como "descarregar"
// o gtag já em memória) e o banner reaparece para o visitante decidir de novo.
export function resetConsent(): void {
  try {
    window.localStorage.removeItem(CONSENT_KEY);
  } catch {
    // sem localStorage não há o que revogar
  }
  window.location.reload();
}

// Conversão do lead: clique que leva o visitante ao WhatsApp.
// No-op se o tag não carregou (sem ID ou sem consentimento) — nunca quebra o fluxo.
export function trackWhatsAppClick(): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  const sendTo = GADS_CONVERSION_LABEL ? `${GADS_ID}/${GADS_CONVERSION_LABEL}` : GADS_ID;
  window.gtag('event', 'conversion', { send_to: sendTo });
}
