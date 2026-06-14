'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { blurProps } from '@/lib/blur-data';

export type PierStep = { t: string; b: string; img: string; alt: string };

// "Momento do Píer" (scrollytelling): a imagem fica fixa (sticky) e faz cross-fade
// conforme cada passo cruza o centro da tela — tanto no desktop (imagem à esquerda,
// texto à direita) quanto no mobile (imagem ao fundo, legenda flutuando por cima).
// Baseado em scroll (IntersectionObserver) — não precisa de motion.
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
    <div className="relative lg:grid lg:grid-cols-2 lg:gap-16">
      {/* Imagem fixa (sticky) com cross-fade: ao fundo no mobile, coluna esquerda no desktop */}
      <div className="sticky top-16 z-0 -mb-[78svh] h-[78svh] overflow-hidden rounded-[1.5rem] shadow-sm lg:top-24 lg:mb-0 lg:h-[72vh] lg:rounded-[2rem]">
        {steps.map((s, i) => (
          <Image
            key={s.img}
            src={s.img}
            alt={s.alt}
            fill
            priority={i === 0}
            {...blurProps(s.img)}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className={`object-cover transition-opacity duration-700 ${i === active ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}
        {/* Escurece a base no mobile p/ legibilidade da legenda; leve no desktop */}
        <div className="absolute inset-0 bg-gradient-to-t from-sea-deep/75 via-sea-deep/15 to-transparent lg:from-sea-deep/30 lg:via-transparent" />
        <div className="absolute left-4 top-4 flex gap-1.5 lg:left-5 lg:top-auto lg:bottom-5">
          {steps.map((s, i) => (
            <span
              key={s.img}
              className={`h-1.5 rounded-full transition-all duration-500 ${i === active ? 'w-7 bg-sand-soft' : 'w-1.5 bg-sand-soft/50'}`}
            />
          ))}
        </div>
      </div>

      {/* Passos: legenda flutua sobre a imagem no mobile; coluna direita no desktop */}
      <div className="relative z-10">
        {steps.map((s, i) => (
          <div
            key={s.img}
            data-idx={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className="flex min-h-[78svh] flex-col justify-end pb-[11vh] lg:min-h-[80vh] lg:justify-center lg:pb-0"
          >
            <div className="rounded-2xl bg-sea-deep/45 p-5 backdrop-blur-md lg:rounded-none lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
              <p className="font-display text-5xl leading-none text-sun-light lg:text-sun-deep/80">{String(i + 1).padStart(2, '0')}</p>
              <h3 className="mt-3 font-display text-[clamp(1.6rem,3.5vw,2.4rem)] tracking-tightest text-balance text-sand-soft lg:mt-4 lg:text-sea">{s.t}</h3>
              <p className="mt-2 max-w-md text-lg font-light leading-relaxed text-sand-soft/85 lg:mt-3 lg:text-ink/75">{s.b}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
