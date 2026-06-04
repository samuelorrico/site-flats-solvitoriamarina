'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from 'motion/react';

function Char({
  char, progress, start, end,
}: { char: string; progress: MotionValue<number>; start: number; end: number }) {
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const y = useTransform(progress, [start, end], ['0.7em', '0em']);
  return (
    <motion.span aria-hidden style={{ opacity, y, display: 'inline-block', willChange: 'transform' }}>
      {char}
    </motion.span>
  );
}

// Título cujas letras "flutuam" para cima em cascata, ligada à posição da rolagem.
export default function ScrollFloat({ children, className }: { children: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'start 0.35'] });

  if (reduce) {
    return <h2 className={className}>{children}</h2>;
  }

  const chars = Array.from(children);
  const total = chars.length;
  const win = 0.45; // largura do "passo" de cada letra dentro do progresso (0..1)

  return (
    <h2 ref={ref} className={className} aria-label={children}>
      {chars.map((c, i) => {
        // Espaço: renderiza inline normal para permitir quebra de linha entre palavras.
        if (c === ' ') return <span key={i} aria-hidden> </span>;
        const start = total > 1 ? (i / (total - 1)) * (1 - win) : 0;
        return <Char key={i} char={c} progress={scrollYProgress} start={start} end={Math.min(start + win, 1)} />;
      })}
    </h2>
  );
}
