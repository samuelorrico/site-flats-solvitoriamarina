'use client';

import { useRef } from 'react';
import { preload } from 'react-dom';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';

const AVIF_SRCSET = '/images/hero/baia-1024.avif 1024w, /images/hero/baia-1600.avif 1600w';

// Hero com leve "ken burns" no scroll. A imagem é servida como arquivo ESTÁTICO
// (AVIF + fallback JPG), sem passar pelo /_next/image — evita o cold-start de
// otimização sob demanda da Vercel, que inflava o LCP no mobile (1ª visita por região).
export default function HeroBackdrop({ alt }: { alt: string }) {
  // Preload de alta prioridade do hero (elemento de LCP).
  preload('/images/hero/baia-1600.avif', {
    as: 'image',
    fetchPriority: 'high',
    imageSrcSet: AVIF_SRCSET,
    imageSizes: '100vw',
    type: 'image/avif',
  });

  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '6%']);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <motion.div style={reduce ? undefined : { scale, y }} className="absolute inset-0 will-change-transform">
        <picture>
          <source type="image/avif" srcSet={AVIF_SRCSET} sizes="100vw" />
          {/* Estático (sem next/image) p/ LCP sem cold-start. */}
          <img
            src="/images/hero/baia-1280.jpg"
            alt={alt}
            fetchPriority="high"
            decoding="async"
            className="hero-img absolute inset-0 h-full w-full object-cover"
          />
        </picture>
      </motion.div>
    </div>
  );
}
