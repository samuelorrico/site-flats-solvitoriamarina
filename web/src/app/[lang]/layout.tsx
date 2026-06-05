import type { Metadata, Viewport } from 'next';
import { Fraunces, Hanken_Grotesk } from 'next/font/google';
import { notFound } from 'next/navigation';
import '../globals.css';
import { locales, htmlLang, isLocale, defaultLocale, type Locale } from '@/i18n-config';
import { getDictionary } from '@/dictionaries';
import { SITE_URL, INDEXABLE } from '@/lib/site';

const OG_LOCALE: Record<Locale, string> = { pt: 'pt_BR', en: 'en_US', es: 'es_ES' };

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  style: ['normal', 'italic'],
});

const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-hanken',
  display: 'swap',
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

// Cor da barra do navegador no mobile (casa com o header claro/sticky).
export const viewport: Viewport = { themeColor: '#faf6ee' };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = getDictionary(lang);
  const languages: Record<string, string> = Object.fromEntries(locales.map((l) => [htmlLang[l], `/${l}`]));
  languages['x-default'] = `/${defaultLocale}`;
  return {
    metadataBase: new URL(SITE_URL),
    title: dict['doc.title'],
    description: dict['meta.description'],
    // Enquanto o domínio final não está no ar, mantém o site provisório fora do índice
    // (conteúdo placeholder — B-001). Vira indexável sozinho ao definir NEXT_PUBLIC_SITE_URL.
    ...(INDEXABLE ? {} : { robots: { index: false, follow: false } }),
    alternates: { canonical: `/${lang}`, languages },
    // og:image / twitter:image vêm da convenção de arquivo (app/[lang]/opengraph-image.tsx
    // + twitter-image.tsx) — card 1200×630 gerado por next/og. Fonte única, sem duplicar.
    openGraph: {
      type: 'website',
      siteName: 'Vitória Marina Flats',
      title: dict['doc.title'],
      description: dict['meta.description'],
      url: `/${lang}`,
      locale: OG_LOCALE[lang],
    },
    twitter: {
      card: 'summary_large_image',
      title: dict['doc.title'],
      description: dict['meta.description'],
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <html lang={htmlLang[lang]} className={`${fraunces.variable} ${hanken.variable} h-full`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
