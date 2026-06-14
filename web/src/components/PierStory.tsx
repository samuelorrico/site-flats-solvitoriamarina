'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { blurProps } from '@/lib/blur-data';

export type PierStep = { t: string; b: string; img: string; alt: string };

// "Momento do Píer" (scrollytelling): no desktop, a imagem fica fixa e faz cross-fade
// conforme cada passo cruza o centro da tela. No mobile, vira uma sequência simples
// (cada passo com sua imagem). Baseado em scroll — não precisa de motion.
export default function PierStory({ steps }: { steps: PierStep[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.idx));
        }
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
      {/* Imagem fixa (desktop) com cross-fade */}
      <div className="hidden lg:block">
        <div className="sticky top-24 h-[72vh] overflow-hidden rounded-[2rem] shadow-sm">
          {steps.map((s, i) => (
            <Image
              key={s.img}
              src={s.img}
              alt={s.alt}
              fill
              {...blurProps(s.img)}
              sizes="50vw"
              className={`object-cover transition-opacity duration-700 ${i === active ? 'opacity-100' : 'opacity-0'}`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-sea-deep/30 to-transparent" />
          <div className="absolute bottom-5 left-5 flex gap-1.5">
            {steps.map((s, i) => (
              <span
                key={s.img}
                className={`h-1.5 rounded-full transition-all duration-500 ${i === active ? 'w-7 bg-sand-soft' : 'w-1.5 bg-sand-soft/50'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Passos */}
      <div>
        {steps.map((s, i) => (
          <div
            key={s.img}
            data-idx={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className="flex flex-col justify-center py-8 lg:min-h-[80vh] lg:py-0"
          >
            <div className="relative mb-5 aspect-[4/3] overflow-hidden rounded-[1.5rem] lg:hidden">
              <Image src={s.img} alt={s.alt} fill {...blurProps(s.img)} sizes="100vw" className="object-cover" />
            </div>
            <p className="font-display text-5xl leading-none text-sun-deep/80">{String(i + 1).padStart(2, '0')}</p>
            <h3 className="mt-4 font-display text-[clamp(1.6rem,3.5vw,2.4rem)] tracking-tightest text-sea text-balance">{s.t}</h3>
            <p className="mt-3 max-w-md text-lg font-light leading-relaxed text-ink/75">{s.b}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
