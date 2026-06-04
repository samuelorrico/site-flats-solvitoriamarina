import type { Metadata } from 'next';
import { Fraunces, Hanken_Grotesk } from 'next/font/google';
import { notFound } from 'next/navigation';
import '../globals.css';
import { locales, htmlLang, isLocale, defaultLocale, type Locale } from '@/i18n-config';
import { getDictionary } from '@/dictionaries';
import { SITE_URL } from '@/lib/site';

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
    alternates: { canonical: `/${lang}`, languages },
    openGraph: {
      type: 'website',
      siteName: 'Vitória Marina Flats',
      title: dict['doc.title'],
      description: dict['meta.description'],
      url: `/${lang}`,
      locale: OG_LOCALE[lang],
      images: [{ url: '/images/vista-baia.jpg', width: 1600, height: 1200, alt: dict['alt.hero'] }],
    },
    twitter: {
      card: 'summary_large_image',
      title: dict['doc.title'],
      description: dict['meta.description'],
      images: ['/images/vista-baia.jpg'],
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
