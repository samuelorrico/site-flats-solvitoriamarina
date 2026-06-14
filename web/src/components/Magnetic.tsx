'use client';

import { m, useMotionValue, useSpring, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

// Wrapper "magnético": o conteúdo é atraído levemente em direção ao cursor.
// Só no desktop (depende de mousemove); respeita prefers-reduced-motion.
export default function Magnetic({
  children,
  className,
  strength = 0.3,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 14, mass: 0.2 });
  const sy = useSpring(y, { stiffness: 180, damping: 14, mass: 0.2 });

  if (reduce) return <span className={`inline-flex ${className ?? ''}`}>{children}</span>;

  function onMove(e: React.MouseEvent<HTMLSpanElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * strength);
    y.set((e.clientY - r.top - r.height / 2) * strength);
  }
  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <m.span
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`inline-flex ${className ?? ''}`}
    >
      {children}
    </m.span>
  );
}
