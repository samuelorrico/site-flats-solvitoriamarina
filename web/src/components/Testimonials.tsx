'use client';

import { useState } from 'react';
import type { Dict } from '@/dictionaries';

type Review = { quote: string; author: string; score: string };

// Avaliações reais do Booking (mantidas no idioma original).
const VISIBLE: Review[] = [
  { quote: '"Super recomendado, fiquei num quarto com vista para o mar, uma vista linda da Baía de Todos os Santos. E a anfitriã super educada me tratou super bem, voltarei outras vezes."', author: 'Marcos · Brasil', score: '10' },
  { quote: '"Excelente, repetiría. La ubicación y las vistas, inmejorables."', author: 'Elviajero022 · Uruguai', score: '9,0' },
  { quote: '"Localização, conforto, suporte dos funcionários e da anfitriã. Tudo maravilhoso, inclusive a vista da Baía de Todos os Santos, simplesmente sensacional!"', author: 'Wuhberti · Brasil', score: '10' },
];

const EXTRA: Review[] = [
  { quote: '"Apartamento com uma vista incrível, excelente custo-benefício. E a anfitriã foi super atenciosa. Super recomendo."', author: 'Marcelo · Brasil', score: '10' },
  { quote: '"Localização, conforto e limpeza."', author: 'Engenharia · Brasil', score: '10' },
  { quote: '"Limpeza excelente, lugar aconchegante. Localização e conforto perfeitos."', author: 'Carlos · Brasil', score: '10' },
  { quote: '"Tudo perfeito."', author: 'Souza · Brasil', score: '10' },
];

function Card({ review, offset }: { review: Review; offset?: boolean }) {
  return (
    <figure className={`bg-sand rounded-3xl p-7 ${offset ? 'md:translate-y-5' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="text-sun text-lg" aria-hidden="true">★★★★★</div>
        <span className="text-xs font-medium text-sea bg-white/70 px-2.5 py-1 rounded-full">Booking · {review.score}</span>
      </div>
      <blockquote className="mt-4 font-display text-xl text-sea leading-snug">{review.quote}</blockquote>
      <figcaption className="mt-5 text-sm text-ink/70">{review.author}</figcaption>
    </figure>
  );
}

export default function Testimonials({ dict }: { dict: Dict }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="grid md:grid-cols-3 gap-6">
        {VISIBLE.map((r, i) => (
          <Card key={r.author} review={r} offset={i === 1} />
        ))}
        {open &&
          EXTRA.map((r, i) => <Card key={r.author} review={r} offset={i === 1} />)}
      </div>

      <div className="mt-10 flex justify-center">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="inline-flex items-center gap-2 rounded-full border border-sea/25 bg-white/70 px-6 py-3 text-sm font-medium text-sea transition hover:bg-sea hover:text-sand hover:border-sea"
        >
          <span>{open ? dict['testi.less'] : dict['testi.more']}</span>
          <svg
            className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </>
  );
}
