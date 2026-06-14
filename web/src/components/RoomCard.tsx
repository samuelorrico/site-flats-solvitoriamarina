'use client';

import Image from 'next/image';
import { m, useMotionValue, useSpring, useTransform, useReducedMotion } from 'motion/react';
import { blurProps } from '@/lib/blur-data';

const guestsIcon = (
  <svg aria-hidden="true" className="w-4 h-4 text-sun-deep" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v11M3 13h18v5M21 18v-5a3 3 0 00-3-3H10v3M7 11.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
  </svg>
);

export default function RoomCard({
  img, alt, badge, badgeSea, title, guests, cta,
}: {
  img: string; alt: string; badge: string; badgeSea: boolean; title: string; guests: string; cta: string;
}) {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], ['6deg', '-6deg']), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], ['-6deg', '6deg']), { stiffness: 200, damping: 20 });

  function handleMove(e: React.MouseEvent<HTMLElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }
  function handleLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <m.article
      className="group relative"
      onMouseMove={reduce ? undefined : handleMove}
      onMouseLeave={reduce ? undefined : handleLeave}
      style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 900 }}
      whileHover={reduce ? undefined : { y: -6 }}
      transition={{ type: 'spring', stiffness: 250, damping: 22 }}
    >
      <div className="relative h-60 overflow-hidden rounded-3xl shadow-sm transition-shadow duration-300 group-hover:shadow-xl">
        <Image
          src={img}
          alt={alt}
          fill
          {...blurProps(img)}
          sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
        />
        <span className={`absolute top-3 left-3 z-10 text-xs font-semibold px-3 py-1.5 rounded-full ${badgeSea ? 'bg-sun text-sea-deep' : 'bg-sand-soft/95 text-sea'}`}>{badge}</span>
      </div>
      <h3 className="mt-4 font-display text-xl text-sea tracking-tight">{title}</h3>
      <p className="text-ink/70 text-sm mt-1.5 flex items-center gap-2">{guestsIcon} <span>{guests}</span></p>
      {/* CTA discreto: link de texto que torna o card inteiro clicável (stretched link) */}
      <a
        href="#contato"
        aria-label={`${cta}: ${title} · ${guests}`}
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-sea rounded-sm transition-colors group-hover:text-sea-deep after:absolute after:inset-0 after:rounded-3xl after:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea"
      >
        <span>{cta}</span>
        <svg aria-hidden="true" className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </a>
    </m.article>
  );
}
