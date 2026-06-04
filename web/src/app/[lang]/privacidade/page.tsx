import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { isLocale, locales, htmlLang, defaultLocale } from '@/i18n-config';
import { getDictionary } from '@/dictionaries';
import { WA_LINK } from '@/lib/site';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InteractiveBackdrop from '@/components/InteractiveBackdrop';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = getDictionary(lang);
  const languages: Record<string, string> = Object.fromEntries(locales.map((l) => [htmlLang[l], `/${l}/privacidade`]));
  languages['x-default'] = `/${defaultLocale}/privacidade`;
  return {
    title: dict['priv.doc_title'],
    description: dict['priv.meta_description'],
    alternates: { canonical: `/${lang}/privacidade`, languages },
  };
}

export default async function Privacidade({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  const sections = [
    { t: dict['priv.s1_title'], b: dict['priv.s1_body'] },
    { t: dict['priv.s2_title'], b: dict['priv.s2_body'] },
    { t: dict['priv.s3_title'], b: dict['priv.s3_body'] },
    { t: dict['priv.s4_title'], b: dict['priv.s4_body'] },
    { t: dict['priv.s5_title'], b: dict['priv.s5_body'] },
  ];

  return (
    <>
      <Header lang={lang} dict={dict} />

      <main className="relative isolate mx-auto max-w-3xl px-5 sm:px-8 py-12 sm:py-16">
        <InteractiveBackdrop />

        <div className="max-w-2xl">
          <p className="text-sun-deep font-medium tracking-widest text-xs uppercase mb-4">{dict['priv.label']}</p>
          <h1 className="font-display text-[clamp(2rem,5vw,3.4rem)] leading-[1.02] tracking-tightest text-sea text-balance">{dict['priv.title']}</h1>
          <p className="mt-3 text-ink/45 text-sm">{dict['priv.updated']}</p>
          <p className="mt-6 text-ink/75 text-lg font-light">{dict['priv.intro']}</p>
        </div>

        <div className="mt-10 space-y-8">
          {sections.map((s) => (
            <section key={s.t}>
              <h2 className="font-display text-xl sm:text-2xl text-sea tracking-tightest">{s.t}</h2>
              <p className="mt-3 text-ink/75 font-light leading-relaxed">{s.b}</p>
            </section>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-4">
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 bg-sun text-sea-deep font-semibold px-6 py-3.5 rounded-full hover:bg-sun-light transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
              <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.477-.911z" />
            </svg>
            {dict['priv.contact_cta']}
          </a>
          <Link href={`/${lang}`} className="text-sea/80 hover:text-sea underline-grow">{dict['priv.back']}</Link>
        </div>
      </main>

      <Footer lang={lang} dict={dict} />
    </>
  );
}
