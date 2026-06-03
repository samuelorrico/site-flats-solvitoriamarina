// Constantes de i18n — seguras para importar em qualquer ambiente (server, proxy, client).
export const locales = ['pt', 'en', 'es'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'pt';

// lang do <html> por locale (pt -> pt-BR)
export const htmlLang: Record<Locale, string> = { pt: 'pt-BR', en: 'en', es: 'es' };

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
