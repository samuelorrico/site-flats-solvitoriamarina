'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';

// Imagem do hero com leve "ken burns" no scroll (parallax de profundidade, sutil).
export default function HeroBackdrop({ alt }: { alt: string }) {
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
        <Image src="/images/vista-baia.jpg" alt={alt} fill priority sizes="100vw" className="hero-img object-cover" />
      </motion.div>
    </div>
  );
}
