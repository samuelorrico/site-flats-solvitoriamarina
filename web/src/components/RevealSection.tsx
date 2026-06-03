'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';

// Revela a seção inteira (fade + slide-up) quando entra na viewport, uma vez.
export default function RevealSection({
  children,
  className,
  y = 40,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
