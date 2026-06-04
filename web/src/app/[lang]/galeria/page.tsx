import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { isLocale, locales, htmlLang, defaultLocale } from '@/i18n-config';
import { getDictionary } from '@/dictionaries';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RevealInit from '@/components/RevealInit';
import GalleryGrid, { type Photo } from '@/components/GalleryGrid';
import InteractiveBackdrop from '@/components/InteractiveBackdrop';

const PHOTOS: Photo[] = [
  { src: '/images/vista-baia.jpg', alt: 'Vista aérea da Baía de Todos os Santos', w: 1600, h: 1200 },
  { src: '/images/mar-vegetacao.jpg', alt: 'O mar visto por entre a vegetação', w: 1200, h: 1600 },
  { src: '/images/pier-panoramica.jpg', alt: 'Vista panorâmica do píer Mahi Mahi', w: 1600, h: 632 },
  { src: '/images/pier-restaurante.jpg', alt: 'Mahi Mahi Bar e Restaurante no píer, com mesas e vista para o mar', w: 1024, h: 683 },
  { src: '/images/bondinho.jpg', alt: 'Bondinho descendo até o píer', w: 1024, h: 683 },
  { src: '/images/pier-por-do-sol.jpg', alt: 'Píer ao pôr do sol com tobogã', w: 1200, h: 1600 },
  { src: '/images/pier-tobogan.jpg', alt: 'Tobogã do píer sobre o mar', w: 1014, h: 1600 },
  { src: '/images/pier-predios.jpg', alt: 'O píer e os prédios do Corredor da Vitória vistos da baía', w: 1199, h: 1600 },
  { src: '/images/mahi-mahi-letreiro.jpg', alt: 'Letreiro do Mahi Mahi no píer', w: 1200, h: 1600 },
  { src: '/images/areas-comuns-aerea.jpg', alt: 'Áreas comuns: quadra e piscinas vistas de cima', w: 1120, h: 1600 },
  { src: '/images/piscina-cobertura.jpg', alt: 'Piscina na cobertura com vista para o mar', w: 1600, h: 1574 },
  { src: '/images/piscina-mar.jpg', alt: 'Piscina com os píeres e o mar ao fundo', w: 1200, h: 1600 },
  { src: '/images/fachada.jpg', alt: 'Fachada do edifício Sol Vitória Marina', w: 683, h: 1024 },
  { src: '/images/predios-encosta.jpg', alt: 'Os prédios do Corredor da Vitória na encosta', w: 1600, h: 1200 },
  { src: '/images/quarto-quadruplo-mar.jpg', alt: 'Quarto de casal com vista para o mar', w: 1600, h: 1200 },
  { src: '/images/quarto-quadruplo-avenida.jpg', alt: 'Quarto de casal com vista para a avenida', w: 1200, h: 1600 },
  { src: '/images/quarto-triplo-mar.jpg', alt: 'Quarto triplo com vista para o mar', w: 960, h: 1280 },
  { src: '/images/quarto-triplo-avenida.jpg', alt: 'Quarto triplo com vista para a avenida', w: 1200, h: 1600 },
  { src: '/images/quarto-mar-entardecer.jpg', alt: 'Quarto com vista para o mar ao entardecer', w: 960, h: 1280 },
  { src: '/images/quarto-avenida-cidade.jpg', alt: 'Quarto com vista para a avenida e a cidade', w: 1600, h: 1200 },
  { src: '/images/banheiro-banheira.jpg', alt: 'Banheiro com banheira de hidromassagem', w: 1200, h: 1600 },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = getDictionary(lang);
  const languages: Record<string, string> = Object.fromEntries(locales.map((l) => [htmlLang[l], `/${l}/galeria`]));
  languages['x-default'] = `/${defaultLocale}/galeria`;
  const img = '/images/pier-restaurante.jpg';
  return {
    title: dict['g.doc_title'],
    description: dict['g.meta_description'],
    alternates: { canonical: `/${lang}/galeria`, languages },
    openGraph: {
      type: 'website',
      siteName: 'Vitória Marina Flats',
      title: dict['g.doc_title'],
      description: dict['g.meta_description'],
      url: `/${lang}/galeria`,
      images: [{ url: img, width: 1024, height: 683 }],
    },
    twitter: { card: 'summary_large_image', title: dict['g.doc_title'], description: dict['g.meta_description'], images: [img] },
  };
}

export default async function Galeria({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  const filters = ['g.f_all', 'g.f_sea', 'g.f_pier', 'g.f_rooms', 'g.f_common'];

  return (
    <>
      <Header lang={lang} dict={dict} />

      <main className="relative isolate mx-auto max-w-7xl px-5 sm:px-8 py-12 sm:py-16">
        <InteractiveBackdrop />
        <div className="reveal max-w-2xl mb-10">
          <p className="text-sun-deep font-medium tracking-widest text-xs uppercase mb-4">{dict['g.label']}</p>
          <h1 className="font-display text-[clamp(2rem,5vw,3.4rem)] leading-[1.02] tracking-tightest text-sea text-balance">{dict['g.title']}</h1>
          <p className="mt-4 text-ink/65 text-lg font-light">{dict['g.intro']}</p>
        </div>

        {/* Filtros (visuais por enquanto) */}
        <div className="reveal flex flex-wrap gap-2.5 mb-10">
          {filters.map((f, i) => (
            <button
              key={f}
              type="button"
              className={
                i === 0
                  ? 'px-4 py-2 rounded-full text-sm bg-sea text-sand-soft'
                  : 'px-4 py-2 rounded-full text-sm border border-ink/15 hover:border-sea text-ink/70'
              }
            >
              {dict[f]}
            </button>
          ))}
        </div>

        {/* Grid masonry + lightbox */}
        <GalleryGrid photos={PHOTOS} />

        <div className="reveal mt-14 text-center">
          <p className="font-display text-2xl text-sea mb-5">{dict['g.cta_title']}</p>
          <Link href={`/${lang}#contato`} className="inline-flex items-center gap-2 bg-sun text-sea-deep font-semibold px-6 py-3.5 rounded-full hover:bg-sun-light transition-colors">
            {dict['g.cta']}
          </Link>
        </div>
      </main>

      <Footer lang={lang} dict={dict} />
      <RevealInit />
    </>
  );
}
