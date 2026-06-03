import type { Metadata } from 'next';
import { Fraunces, Hanken_Grotesk } from 'next/font/google';
import { notFound } from 'next/navigation';
import '../globals.css';
import { locales, htmlLang, isLocale } from '@/i18n-config';
import { getDictionary } from '@/dictionaries';

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
  const languages = Object.fromEntries(locales.map((l) => [htmlLang[l], `/${l}`]));
  return {
    title: dict['doc.title'],
    description: dict['meta.description'],
    alternates: { canonical: `/${lang}`, languages },
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
