'use client';

import { useEffect, useRef, useState } from 'react';

export type Stat = { value: number; suffix?: string; label: string };

// Faixa de destaques com contagem animada (0 → valor) quando entra na viewport.
// Respeita prefers-reduced-motion (mostra o valor final, sem animar).
export default function StatsBand({ stats }: { stats: Stat[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState<number[]>(() => stats.map(() => 0));
  const ran = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || ran.current) return;
        ran.current = true;
        io.disconnect();
        const dur = reduce ? 0 : 1300; // reduced-motion: vai direto ao valor final
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = dur === 0 ? 1 : Math.min(1, (now - t0) / dur);
          const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
          setShown(stats.map((s) => Math.round(s.value * eased)));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [stats]);

  return (
    <div ref={ref} className="grid grid-cols-3 gap-4 sm:gap-8">
      {stats.map((s, i) => (
        <div key={s.label} className="text-center">
          <div className="font-display text-[clamp(2.2rem,6vw,3.4rem)] leading-none text-sea tracking-tightest tabular-nums">
            {shown[i]}
            {s.suffix}
          </div>
          <div className="mt-2.5 text-xs sm:text-sm text-ink/70 text-balance">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
