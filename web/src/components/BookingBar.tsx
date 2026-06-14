'use client';

import { useEffect, useState } from 'react';

// Barra de reserva fixa (desktop): aparece depois do hero e some quando a seção
// de contato está visível (p/ não duplicar o formulário). Mobile já tem o FAB.
export default function BookingBar({ cta, note }: { cta: string; note: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let pastHero = false;
    let nearContact = false;
    const update = () => setShow(pastHero && !nearContact);

    const onScroll = () => {
      pastHero = window.scrollY > window.innerHeight * 0.9;
      update();
    };

    const contato = document.getElementById('contato');
    const io = contato
      ? new IntersectionObserver(
          (entries) => {
            nearContact = entries[0].isIntersecting;
            update();
          },
          { rootMargin: '0px 0px -25% 0px' },
        )
      : undefined;
    io?.observe(contato!);

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      io?.disconnect();
    };
  }, []);

  return (
    <div className="hidden md:flex fixed inset-x-0 bottom-5 z-40 justify-center px-4 pointer-events-none">
      <div
        data-show={show}
        className="booking-bar pointer-events-auto flex items-center gap-5 rounded-full bg-sea-deep/95 backdrop-blur-md text-sand-soft pl-6 pr-2 py-2 shadow-2xl ring-1 ring-white/10"
      >
        <div className="leading-tight">
          <p className="font-display text-sm">
            Vitória Marina <span className="italic text-sun-light">Flats</span>
          </p>
          <p className="text-[11px] text-sand/70">{note}</p>
        </div>
        <a
          href="#contato"
          className="btn-shine inline-flex items-center gap-1.5 bg-sun text-sea-deep font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-sun-light transition-colors"
        >
          {cta}
        </a>
      </div>
    </div>
  );
}
