'use client';

import { LazyMotion, domAnimation } from 'motion/react';

// Carrega só o subconjunto "domAnimation" do Framer Motion (~30KB em vez de ~300KB),
// mantendo todas as animações usadas (style/motion values, gestos, exit/AnimatePresence).
// Os componentes usam `m.*` (não `motion.*`); `strict` garante que nada puxe o bundle cheio.
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
