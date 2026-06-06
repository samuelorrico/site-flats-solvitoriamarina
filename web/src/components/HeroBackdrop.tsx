import { preload } from 'react-dom';

const AVIF_SRCSET = '/images/hero/baia-1024.avif 1024w, /images/hero/baia-1600.avif 1600w';

// Server component (sem JS no cliente): o hero é o elemento de LCP, então evitamos
// qualquer hidratação aqui. A imagem é estática (AVIF + fallback JPG), pré-carregada
// em alta prioridade, e o "ken burns" é animação CSS (sem Framer Motion).
export default function HeroBackdrop({ alt }: { alt: string }) {
  preload('/images/hero/baia-1600.avif', {
    as: 'image',
    fetchPriority: 'high',
    imageSrcSet: AVIF_SRCSET,
    imageSizes: '100vw',
    type: 'image/avif',
  });

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="hero-kenburns absolute inset-0">
        <picture>
          <source type="image/avif" srcSet={AVIF_SRCSET} sizes="100vw" />
          <img
            src="/images/hero/baia-1280.jpg"
            alt={alt}
            fetchPriority="high"
            decoding="async"
            className="hero-img absolute inset-0 h-full w-full object-cover"
          />
        </picture>
      </div>
    </div>
  );
}
