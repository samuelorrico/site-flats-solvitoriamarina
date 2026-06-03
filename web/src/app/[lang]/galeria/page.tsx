/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { isLocale } from '@/i18n-config';
import { getDictionary } from '@/dictionaries';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PHOTOS: { src: string; alt: string }[] = [
  { src: '/images/vista-baia.jpg', alt: 'Vista aérea da Baía de Todos os Santos' },
  { src: '/images/mar-vegetacao.jpg', alt: 'O mar visto por entre a vegetação' },
  { src: '/images/pier-panoramica.jpg', alt: 'Vista panorâmica do píer Mahi Mahi' },
  { src: '/images/pier-restaurante.jpg', alt: 'Mahi Mahi Bar e Restaurante no píer, com mesas e vista para o mar' },
  { src: '/images/bondinho.jpg', alt: 'Bondinho descendo até o píer' },
  { src: '/images/pier-por-do-sol.jpg', alt: 'Píer ao pôr do sol com tobogã' },
  { src: '/images/pier-tobogan.jpg', alt: 'Tobogã do píer sobre o mar' },
  { src: '/images/pier-predios.jpg', alt: 'O píer e os prédios do Corredor da Vitória vistos da baía' },
  { src: '/images/mahi-mahi-letreiro.jpg', alt: 'Letreiro do Mahi Mahi no píer' },
  { src: '/images/areas-comuns-aerea.jpg', alt: 'Áreas comuns: quadra e piscinas vistas de cima' },
  { src: '/images/piscina-cobertura.jpg', alt: 'Piscina na cobertura com vista para o mar' },
  { src: '/images/piscina-mar.jpg', alt: 'Piscina com os píeres e o mar ao fundo' },
  { src: '/images/fachada.jpg', alt: 'Fachada do edifício Sol Vitória Marina' },
  { src: '/images/predios-encosta.jpg', alt: 'Os prédios do Corredor da Vitória na encosta' },
  { src: '/images/quarto-quadruplo-mar.jpg', alt: 'Quarto de casal com vista para o mar' },
  { src: '/images/quarto-quadruplo-avenida.jpg', alt: 'Quarto de casal com vista para a avenida' },
  { src: '/images/quarto-triplo-mar.jpg', alt: 'Quarto triplo com vista para o mar' },
  { src: '/images/quarto-triplo-avenida.jpg', alt: 'Quarto triplo com vista para a avenida' },
  { src: '/images/quarto-mar-entardecer.jpg', alt: 'Quarto com vista para o mar ao entardecer' },
  { src: '/images/quarto-avenida-cidade.jpg', alt: 'Quarto com vista para a avenida e a cidade' },
  { src: '/images/banheiro-banheira.jpg', alt: 'Banheiro com banheira de hidromassagem' },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = getDictionary(lang);
  return { title: dict['g.doc_title'], description: dict['g.meta_description'] };
}

export default async function Galeria({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  const filters = ['g.f_all', 'g.f_sea', 'g.f_pier', 'g.f_rooms', 'g.f_common'];

  return (
    <>
      <Header lang={lang} dict={dict} />

      <main className="mx-auto max-w-7xl px-5 sm:px-8 py-12 sm:py-16">
        <div className="max-w-2xl mb-10">
          <p className="text-sun-deep font-medium tracking-widest text-xs uppercase mb-4">{dict['g.label']}</p>
          <h1 className="font-display text-[clamp(2rem,5vw,3.4rem)] leading-[1.02] tracking-tightest text-sea">{dict['g.title']}</h1>
          <p className="mt-4 text-ink/65 text-lg font-light">{dict['g.intro']}</p>
        </div>

        {/* Filtros (visuais por enquanto) */}
        <div className="flex flex-wrap gap-2.5 mb-10">
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

        {/* Grid masonry */}
        <div className="columns-2 md:columns-3 gap-4 [&>*]:mb-4 [&>*]:break-inside-avoid">
          {PHOTOS.map((p) => (
            <img key={p.src} src={p.src} alt={p.alt} className="w-full rounded-2xl" loading="lazy" />
          ))}
        </div>

        <div className="mt-14 text-center">
          <p className="font-display text-2xl text-sea mb-5">{dict['g.cta_title']}</p>
          <Link href={`/${lang}#contato`} className="inline-flex items-center gap-2 bg-sun text-sea-deep font-semibold px-6 py-3.5 rounded-full hover:bg-sun-light transition-colors">
            {dict['g.cta']}
          </Link>
        </div>
      </main>

      <Footer lang={lang} dict={dict} />
    </>
  );
}
