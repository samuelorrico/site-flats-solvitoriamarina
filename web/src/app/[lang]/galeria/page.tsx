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

// Categorias dos filtros da galeria (cada foto tem uma categoria primária).
type Cat = 'sea' | 'pier' | 'rooms' | 'common';

// Fotos da galeria: `altKey` resolve para o `alt` localizado (galt.*) em tempo de render.
const PHOTOS: { src: string; altKey: string; w: number; h: number; cat: Cat }[] = [
  { src: '/images/vista-baia.jpg', altKey: 'galt.baia', w: 1600, h: 1200, cat: 'sea' },
  { src: '/images/mar-vegetacao.jpg', altKey: 'galt.mar_veg', w: 1200, h: 1600, cat: 'sea' },
  { src: '/images/pier-panoramica.jpg', altKey: 'galt.pier_pano', w: 1600, h: 632, cat: 'pier' },
  { src: '/images/pier-restaurante.jpg', altKey: 'galt.pier_rest', w: 1024, h: 683, cat: 'pier' },
  { src: '/images/bondinho.jpg', altKey: 'galt.bondinho', w: 1024, h: 683, cat: 'pier' },
  { src: '/images/pier-por-do-sol.jpg', altKey: 'galt.pier_sunset', w: 1200, h: 1600, cat: 'pier' },
  { src: '/images/pier-tobogan.jpg', altKey: 'galt.tobogan', w: 1014, h: 1600, cat: 'pier' },
  { src: '/images/pier-predios.jpg', altKey: 'galt.pier_predios', w: 1199, h: 1600, cat: 'pier' },
  { src: '/images/mahi-mahi-letreiro.jpg', altKey: 'galt.letreiro', w: 1200, h: 1600, cat: 'pier' },
  { src: '/images/areas-comuns-aerea.jpg', altKey: 'galt.areas', w: 1120, h: 1600, cat: 'common' },
  { src: '/images/piscina-cobertura.jpg', altKey: 'galt.piscina_cob', w: 1600, h: 1574, cat: 'common' },
  { src: '/images/piscina-mar.jpg', altKey: 'galt.piscina_mar', w: 1200, h: 1600, cat: 'common' },
  { src: '/images/fachada.jpg', altKey: 'galt.fachada', w: 683, h: 1024, cat: 'common' },
  { src: '/images/predios-encosta.jpg', altKey: 'galt.encosta', w: 1600, h: 1200, cat: 'common' },
  { src: '/images/quarto-casal-mar.jpg', altKey: 'galt.casal_mar', w: 1600, h: 1200, cat: 'rooms' },
  { src: '/images/quarto-casal-avenida.jpg', altKey: 'galt.casal_av', w: 1200, h: 1600, cat: 'rooms' },
  { src: '/images/quarto-triplo-mar.jpg', altKey: 'galt.triplo_mar', w: 960, h: 1280, cat: 'rooms' },
  { src: '/images/quarto-triplo-avenida.jpg', altKey: 'galt.triplo_av', w: 1200, h: 1600, cat: 'rooms' },
  { src: '/images/quarto-mar-entardecer.jpg', altKey: 'galt.quarto_entardecer', w: 960, h: 1280, cat: 'rooms' },
  { src: '/images/quarto-avenida-cidade.jpg', altKey: 'galt.quarto_cidade', w: 1600, h: 1200, cat: 'rooms' },
  { src: '/images/banheiro-banheira.jpg', altKey: 'galt.banheira', w: 1200, h: 1600, cat: 'rooms' },
  { src: '/images/quarto-espelho.jpg', altKey: 'galt.q_espelho', w: 1125, h: 1600, cat: 'rooms' },
  { src: '/images/flat-studio.jpg', altKey: 'galt.flat_studio', w: 1600, h: 1200, cat: 'rooms' },
  { src: '/images/quarto-janela.jpg', altKey: 'galt.q_janela', w: 960, h: 1280, cat: 'rooms' },
  { src: '/images/quarto-tv.jpg', altKey: 'galt.q_tv', w: 960, h: 1280, cat: 'rooms' },
  { src: '/images/kitchenette-branca.jpg', altKey: 'galt.kit_branca', w: 960, h: 1280, cat: 'rooms' },
  { src: '/images/banheiro-cuba.jpg', altKey: 'galt.banho_cuba', w: 960, h: 1280, cat: 'rooms' },
  { src: '/images/sala-estar.jpg', altKey: 'galt.sala', w: 960, h: 1280, cat: 'rooms' },
  { src: '/images/kitchenette-pia.jpg', altKey: 'galt.kit_pia', w: 921, h: 1280, cat: 'rooms' },
  { src: '/images/kitchenette-verde.jpg', altKey: 'galt.kit_verde', w: 597, h: 1280, cat: 'rooms' },
  { src: '/images/vista-mar-janela.jpg', altKey: 'galt.vista_janela', w: 1280, h: 597, cat: 'sea' },
  { src: '/images/banheiro-redondo.jpg', altKey: 'galt.banho_redondo', w: 867, h: 1156, cat: 'rooms' },
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

  const photos: Photo[] = PHOTOS.map((p) => ({ src: p.src, alt: dict[p.altKey], w: p.w, h: p.h, cat: p.cat }));
  const filters = [
    { key: 'all', label: dict['g.f_all'] },
    { key: 'sea', label: dict['g.f_sea'] },
    { key: 'pier', label: dict['g.f_pier'] },
    { key: 'rooms', label: dict['g.f_rooms'] },
    { key: 'common', label: dict['g.f_common'] },
  ];

  return (
    <>
      <Header lang={lang} dict={dict} />

      <main className="relative isolate mx-auto max-w-7xl px-5 sm:px-8 py-12 sm:py-16">
        <InteractiveBackdrop />
        <div className="reveal max-w-2xl mb-10">
          <p className="text-sun-label font-medium tracking-widest text-xs uppercase mb-4">{dict['g.label']}</p>
          <h1 className="font-display text-[clamp(2rem,5vw,3.4rem)] leading-[1.02] tracking-tightest text-sea text-balance">{dict['g.title']}</h1>
          <p className="mt-4 text-ink/65 text-lg font-light">{dict['g.intro']}</p>
        </div>

        {/* Filtros + grid masonry + lightbox (estado do filtro vive no client) */}
        <GalleryGrid photos={photos} filters={filters} labels={{ close: dict['g.close'], prev: dict['g.prev'], next: dict['g.next'] }} />

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
