'use client';

import { useRef, type ReactNode } from 'react';
import { m, useScroll, useTransform, useReducedMotion } from 'motion/react';

// Reveal ligado ao scroll (contínuo): opacidade + deslocamento acompanham a
// posição da rolagem conforme a seção entra na viewport.
// Mede o scroll no wrapper externo (sem transform) e anima um filho interno
// para evitar feedback loop (transformar o próprio elemento medido causa tremor).
export default function RevealSection({
  children,
  className,
  y = 56,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.95', 'start 0.5'],
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const translateY = useTransform(scrollYProgress, [0, 1], [y, 0]);

  return (
    <div ref={ref} className={className}>
      <m.div style={reduce ? undefined : { opacity, y: translateY }}>
        {children}
      </m.div>
    </div>
  );
}
