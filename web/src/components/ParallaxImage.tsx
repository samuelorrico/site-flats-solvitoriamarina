'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { m, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { blurProps } from '@/lib/blur-data';

// Imagem que desloca levemente conforme a rolagem (parallax sutil).
export default function ParallaxImage({
  src,
  alt,
  sizes,
  className = '',
  imgClassName = '',
  children,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  imgClassName?: string;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['-5%', '5%']);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <m.div style={reduce ? undefined : { y }} className="absolute inset-[-8%] will-change-transform">
        <Image src={src} alt={alt} fill {...blurProps(src)} sizes={sizes} className={`object-cover ${imgClassName}`} />
      </m.div>
      {children}
    </div>
  );
}
