import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { isLocale } from '@/i18n-config';
import { getDictionary } from '@/dictionaries';
import { ADDRESS, MAPS_EMBED, MAPS_LINK, SITE_URL, INSTAGRAM, WA_PHONE, EMAIL, POSTAL_CODE } from '@/lib/site';
import { Rich } from '@/components/Rich';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Testimonials from '@/components/Testimonials';
import QualForm from '@/components/QualForm';
import HeroBackdrop from '@/components/HeroBackdrop';
import ParallaxImage from '@/components/ParallaxImage';
import RoomCard from '@/components/RoomCard';
import RevealSection from '@/components/RevealSection';
import InteractiveBackdrop from '@/components/InteractiveBackdrop';

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <path strokeLinecap="round" strokeLinejoin="round" d="M5 13s2-2 7-2 7 2 7 2M2 9s4-3 10-3 10 3 10 3M8 17s1.5-1 4-1 4 1 4 1" />,
  ac: <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M5 12a7 7 0 0114 0M8 17a4 4 0 018 0" />,
  pool: <path strokeLinecap="round" strokeLinejoin="round" d="M3 16c2-2 4-2 6 0s4 2 6 0 4-2 4 0M3 11c2-2 4-2 6 0s4 2 6 0 4-2 4 0" />,
  pier: <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6l8-4z" />,
  reception: <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
  store: <path strokeLinecap="round" strokeLinejoin="round" d="M4 21V5a1 1 0 011-1h9l-1 4h6v9H5M9 4v5" />,
  garage: <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h13v8H3zM16 10h3l2 2v3h-5M6 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM18 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />,
  roomservice: <path strokeLinecap="round" strokeLinejoin="round" d="M3 18h18M12 9a6 6 0 016 6H6a6 6 0 016-6zM12 9V6.5M10.5 6.5h3" />,
};

function Amenity({ k, label }: { k: string; label: string }) {
  return (
    <div className="flex flex-col gap-3">
      <svg aria-hidden="true" className="w-7 h-7 text-sun-light" fill="none" stroke="currentColor" strokeWidth={1.4} viewBox="0 0 24 24">
        {amenityIcons[k]}
      </svg>
      <span className="text-sand/85 text-sm">{label}</span>
    </div>
  );
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  const rooms = [
    { img: '/images/quarto-casal-mar.jpg', badge: dict['rooms.badge_sea'], badgeSea: true, title: dict['rooms.quad'] },
    { img: '/images/quarto-casal-avenida.jpg', badge: dict['rooms.badge_avenue'], badgeSea: false, title: dict['rooms.quad'] },
    { img: '/images/quarto-triplo-mar.jpg', badge: dict['rooms.badge_sea'], badgeSea: true, title: dict['rooms.triple'] },
    { img: '/images/quarto-triplo-avenida.jpg', badge: dict['rooms.badge_avenue'], badgeSea: false, title: dict['rooms.triple'] },
    { img: '/images/quarto-quadruplo-mar.jpg', badge: dict['rooms.badge_sea'], badgeSea: true, title: dict['rooms.quadruple'] },
    { img: '/images/quarto-quadruplo-avenida.jpg', badge: dict['rooms.badge_avenue'], badgeSea: false, title: dict['rooms.quadruple'] },
  ];

  const houseRules = [
    { ok: true, text: dict['info.parking'] },
    { ok: true, text: dict['info.pets'] },
    { ok: true, text: dict['info.children'] },
    { ok: false, text: dict['info.smoking'] },
    { ok: false, text: dict['info.parties'] },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: 'Vitória Marina Flats',
    description: dict['meta.description'],
    url: `${SITE_URL}/${lang}`,
    image: [
      `${SITE_URL}/images/vista-baia.jpg`,
      `${SITE_URL}/images/piscina-mar.jpg`,
      `${SITE_URL}/images/pier-restaurante.jpg`,
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Av. Sete de Setembro, 2068',
      addressLocality: 'Salvador',
      addressRegion: 'BA',
      postalCode: POSTAL_CODE,
      addressCountry: 'BR',
    },
    geo: { '@type': 'GeoCoordinates', latitude: -12.998, longitude: -38.524 },
    telephone: `+${WA_PHONE}`,
    email: EMAIL,
    sameAs: [INSTAGRAM],
    priceRange: '$$',
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <Header lang={lang} dict={dict} />

      {/* HERO — tela cheia exata */}
      <section id="topo" className="relative">
        <div className="relative h-[100svh] w-full overflow-hidden">
          <HeroBackdrop alt={dict['alt.hero']} />
          <div className="absolute inset-0 bg-gradient-to-b from-sea-deep/55 via-sea-deep/25 to-sea-deep/80" />
          <div className="relative h-full mx-auto max-w-7xl px-5 sm:px-8 flex flex-col justify-center">
            <p className="text-sand/90 tracking-[0.25em] text-xs sm:text-sm uppercase mb-4">{dict['hero.tag']}</p>
            <Rich as="h1" html={dict['hero.title']} className="font-display text-sand-soft leading-[0.98] tracking-tightest text-[clamp(2.6rem,7vw,5.5rem)] max-w-4xl text-balance" />
            <p className="mt-6 text-sand/85 text-lg sm:text-xl max-w-xl font-light text-balance">{dict['hero.subtitle']}</p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a href="#quartos" className="bg-sand-soft text-sea-deep font-semibold px-7 py-3.5 rounded-full hover:bg-white transition-colors">{dict['hero.cta1']}</a>
              <a href="#contato" className="inline-flex items-center gap-1.5 border border-sand-soft/50 text-sand-soft font-semibold px-6 py-3.5 rounded-full hover:bg-sand-soft/10 transition-colors">{dict['hero.cta2']}</a>
            </div>
          </div>
        </div>
      </section>

      {/* BOAS-VINDAS */}
      <section className="section-card no-seam-shadow relative isolate bg-sand-soft">
        <InteractiveBackdrop />
        <RevealSection className="mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-28">
          <div className="grid md:grid-cols-12 gap-10 items-start">
            <div className="md:col-span-7">
              <p className="text-sun-label font-medium tracking-widest text-xs uppercase mb-5">{dict['welcome.label']}</p>
              <h2 className="font-display text-[clamp(1.9rem,4vw,3rem)] leading-tight tracking-tightest text-sea max-w-2xl text-balance">{dict['welcome.title']}</h2>
            </div>
            <div className="md:col-span-5 md:pt-4">
              <Rich as="p" html={dict['welcome.body']} className="text-ink/75 text-lg leading-relaxed font-light" />
              <div className="mt-7 flex flex-wrap gap-x-8 gap-y-3 text-sm text-ink/70">
                {['welcome.chip1', 'welcome.chip2', 'welcome.chip3'].map((k) => (
                  <span key={k} className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-sun" /> <span>{dict[k]}</span></span>
                ))}
              </div>
            </div>
          </div>
        </RevealSection>
      </section>

      {/* LOCALIZAÇÃO */}
      <section id="localizacao" className="section-card relative isolate bg-sand">
        <InteractiveBackdrop />
        <RevealSection className="mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <p className="text-sun-label font-medium tracking-widest text-xs uppercase mb-5">{dict['loc.label']}</p>
              <h2 className="font-display text-[clamp(1.9rem,4vw,3rem)] leading-tight tracking-tightest text-sea text-balance">{dict['loc.title']}</h2>
              <p className="mt-6 text-ink/75 text-lg leading-relaxed font-light max-w-xl">{dict['loc.body']}</p>
              <ul className="mt-8 grid sm:grid-cols-2 gap-x-8 gap-y-4 text-ink/80">
                {[1, 2, 3, 4].map((n) => (
                  <li key={n} className="flex items-start gap-3">
                    <span className="mt-1 text-sun-deep" aria-hidden="true">⟡</span>
                    <span><strong className="font-medium">{dict[`loc.poi${n}t`]}</strong><br /><span className="text-sm text-ink/70">{dict[`loc.poi${n}s`]}</span></span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative">
                <ParallaxImage src="/images/piscina-mar.jpg" alt={dict['alt.loc']} sizes="(min-width:1024px) 50vw, 100vw" className="h-[420px] sm:h-[520px] rounded-[2rem]" />
                <div className="absolute -bottom-5 -left-3 sm:-left-6 bg-sea text-sand-soft px-6 py-4 rounded-2xl shadow-xl max-w-[240px]">
                  <p className="font-display italic text-lg leading-snug">{dict['loc.quote']}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-14 lg:mt-16">
            <div className="rounded-[2rem] overflow-hidden border border-ink/10 shadow-sm">
              <iframe title={dict['loc.map_title']} src={MAPS_EMBED} width="100%" height={380} style={{ border: 0 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
              <p className="text-ink/70">{ADDRESS}</p>
              <a href={MAPS_LINK} target="_blank" rel="noopener" className="text-sea font-semibold underline-grow">{dict['loc.maps']}</a>
            </div>
          </div>
        </RevealSection>
      </section>

      {/* PÍER & RESTAURANTE */}
      <section id="pier" className="section-card relative isolate bg-sand-soft">
        <RevealSection className="mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-28">
          <div className="grid lg:grid-cols-12 gap-6 items-stretch">
            <ParallaxImage
              src="/images/pier-panoramica.jpg"
              alt={dict['alt.pier']}
              sizes="(min-width:1024px) 58vw, 100vw"
              className="lg:col-span-7 rounded-[2rem] min-h-[360px]"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-sea-deep/80 via-sea-deep/15 to-transparent" />
              <div className="relative h-full flex flex-col justify-end p-8 sm:p-10">
                <p className="text-sand/90 tracking-[0.22em] text-xs uppercase mb-3">{dict['pier.label']}</p>
                <h2 className="font-display text-sand-soft text-[clamp(2rem,4.2vw,3.2rem)] leading-[1.02] tracking-tightest max-w-md text-balance">{dict['pier.title']}</h2>
                <p className="mt-4 text-sand/85 font-light max-w-md">{dict['pier.subtitle']}</p>
              </div>
            </ParallaxImage>
            <div className="lg:col-span-5 grid sm:grid-cols-2 lg:grid-cols-1 gap-6">
              <div className="relative overflow-hidden rounded-[2rem] min-h-[180px] group">
                <Image src="/images/bondinho.jpg" alt={dict['alt.bondinho']} fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-sea-deep/35" />
                <div className="relative p-6 flex items-end h-full">
                  <Rich as="p" html={dict['pier.bondinho']} className="text-sand-soft font-display text-xl leading-snug" />
                </div>
              </div>
              <div className="relative overflow-hidden rounded-[2rem] min-h-[180px] group">
                <Image src="/images/pier-restaurante.jpg" alt={dict['pier.restaurant']} fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-sea-deep/85 via-sea-deep/30 to-transparent" />
                <div className="relative p-6 flex items-end h-full">
                  <Rich as="p" html={dict['pier.restaurant']} className="text-sand-soft font-display text-xl leading-snug" />
                </div>
              </div>
            </div>
          </div>
          <Rich as="p" html={dict['pier.body']} className="mt-7 text-ink/70 text-lg font-light max-w-3xl" />
        </RevealSection>
      </section>

      {/* QUARTOS */}
      <section id="quartos" className="section-card relative isolate bg-sand">
        <InteractiveBackdrop />
        <RevealSection className="mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-28">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
            <div className="max-w-xl">
              <p className="text-sun-label font-medium tracking-widest text-xs uppercase mb-5">{dict['rooms.label']}</p>
              <h2 className="font-display text-[clamp(1.9rem,4vw,3rem)] leading-tight tracking-tightest text-sea text-balance">{dict['rooms.title']}</h2>
              <Rich as="p" html={dict['rooms.intro']} className="mt-4 text-ink/65 font-light" />
            </div>
            <Link href={`/${lang}/galeria`} className="text-sea font-semibold underline-grow">{dict['rooms.gallery_link']}</Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((r) => (
              <RoomCard
                key={r.img}
                img={r.img}
                alt={`${r.title} · ${r.badge}`}
                badge={r.badge}
                badgeSea={r.badgeSea}
                title={r.title}
                guests={dict['rooms.guests']}
                cta={dict['rooms.cta']}
              />
            ))}
          </div>
          <p className="mt-8 text-sm text-ink/70">{dict['rooms.note']}</p>
        </RevealSection>
      </section>

      {/* COMODIDADES */}
      <section id="comodidades" className="section-card no-seam-shadow relative isolate bg-sea text-sand-soft">
        <InteractiveBackdrop color="rgba(231, 184, 115, 0.16)" />
        <RevealSection className="mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-28">
          <div className="max-w-2xl">
            <p className="text-sun-light font-medium tracking-widest text-xs uppercase mb-5">{dict['amen.label']}</p>
            <h2 className="font-display text-[clamp(1.9rem,4vw,3rem)] leading-tight tracking-tightest text-balance">{dict['amen.title']}</h2>
          </div>
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-10">
            <Amenity k="wifi" label={dict['amen.wifi']} />
            <Amenity k="ac" label={dict['amen.ac']} />
            <Amenity k="pool" label={dict['amen.pool']} />
            <Amenity k="pier" label={dict['amen.pier']} />
            <Amenity k="reception" label={dict['amen.reception']} />
            <Amenity k="store" label={dict['amen.store']} />
            <Amenity k="garage" label={dict['amen.garage']} />
            <Amenity k="roomservice" label={dict['amen.roomservice']} />
          </div>
          <Rich as="p" html={dict['amen.note']} className="mt-10 text-sand/70 text-sm" />
        </RevealSection>
      </section>

      {/* BOM SABER */}
      <section id="info" className="section-card no-seam-shadow relative isolate bg-sand">
        <InteractiveBackdrop />
        <RevealSection className="mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-28">
          <div className="max-w-2xl">
            <p className="text-sun-label font-medium tracking-widest text-xs uppercase mb-5">{dict['info.label']}</p>
            <h2 className="font-display text-[clamp(1.9rem,4vw,3rem)] leading-tight tracking-tightest text-sea text-balance">{dict['info.title']}</h2>
          </div>
          <div className="mt-12 grid lg:grid-cols-3 gap-6 lg:gap-10">
            <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {[
                { label: dict['info.checkin'], time: dict['info.checkin_time'], note: dict['info.checkin_note'] },
                { label: dict['info.checkout'], time: dict['info.checkout_time'], note: '' },
              ].map((c) => (
                <div key={c.label} className="bg-sand-soft rounded-2xl p-5 border border-ink/5">
                  <svg aria-hidden="true" className="w-6 h-6 text-sun-deep" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="mt-3 text-sm text-ink/70">{c.label}</p>
                  <p className="font-display text-2xl text-sea tracking-tight">{c.time}</p>
                  {c.note ? <p className="text-xs text-ink/70 mt-1">{c.note}</p> : null}
                </div>
              ))}
            </div>
            <ul className="lg:col-span-2 grid sm:grid-cols-2 gap-x-8 gap-y-5 self-center">
              {houseRules.map((r) => (
                <li key={r.text} className="flex items-start gap-3">
                  <span className={`mt-0.5 shrink-0 ${r.ok ? 'text-sea' : 'text-ink/40'}`} aria-hidden="true">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24">
                      {r.ok ? (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
                      )}
                    </svg>
                  </span>
                  <span className="text-ink/80">{r.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </RevealSection>
      </section>

      {/* DEPOIMENTOS */}
      <section className="section-card relative isolate bg-sand-soft">
        <InteractiveBackdrop />
        <RevealSection className="mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-28">
          <div className="max-w-2xl mb-12">
            <p className="text-sun-label font-medium tracking-widest text-xs uppercase mb-5">{dict['testi.label']}</p>
            <h2 className="font-display text-[clamp(1.9rem,4vw,3rem)] leading-tight tracking-tightest text-sea text-balance">{dict['testi.title']}</h2>
            <p className="mt-4 text-ink/70 text-sm">{dict['testi.via']}</p>
          </div>
          <Testimonials dict={dict} />
        </RevealSection>
      </section>

      {/* CONTATO */}
      <section id="contato" className="section-card relative isolate bg-sand">
        <InteractiveBackdrop />
        <RevealSection className="mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-sun-label font-medium tracking-widest text-xs uppercase mb-5">{dict['contact.label']}</p>
              <h2 className="font-display text-[clamp(2rem,4.4vw,3.2rem)] leading-tight tracking-tightest text-sea text-balance">{dict['contact.title']}</h2>
              <p className="mt-6 text-ink/75 text-lg font-light max-w-md">{dict['contact.body']}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <span className="text-sm text-ink/70 flex items-center gap-2 bg-sand-soft px-4 py-2 rounded-full">{dict['contact.chip1']}</span>
                <span className="text-sm text-ink/70 flex items-center gap-2 bg-sand-soft px-4 py-2 rounded-full">{dict['contact.chip2']}</span>
              </div>
            </div>
            <QualForm lang={lang} dict={dict} />
          </div>
        </RevealSection>
      </section>

      <Footer lang={lang} dict={dict} />
    </>
  );
}
