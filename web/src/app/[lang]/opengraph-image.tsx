import { defaultLocale, isLocale, locales } from '@/i18n-config';
import { renderOgImage, ogSize, ogContentType, ogAlt } from '@/lib/og';

export const size = ogSize;
export const contentType = ogContentType;
export const alt = ogAlt;

// Prerenderiza um card por idioma no build (SSG), em vez de gerar sob demanda.
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return renderOgImage(isLocale(lang) ? lang : defaultLocale);
}
