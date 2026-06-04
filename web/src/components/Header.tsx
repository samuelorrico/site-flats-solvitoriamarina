import Link from 'next/link';
import type { Locale } from '@/i18n-config';
import type { Dict } from '@/dictionaries';
import { WA_LINK } from '@/lib/site';
import LangSwitcher from './LangSwitcher';
import MobileMenu from './MobileMenu';

export default function Header({ lang, dict }: { lang: Locale; dict: Dict }) {
  const base = `/${lang}`;
  return (
    <header className="sticky top-0 z-50 bg-sand-soft/85 backdrop-blur-md border-b border-ink/5">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 h-16 flex items-center justify-between gap-3">
        <Link href={base} className="flex items-baseline gap-2 group shrink-0">
          <span className="font-display text-xl sm:text-2xl tracking-tightest text-sea">
            Vitória Marina <span className="text-sun-deep italic">Flats</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-[15px] text-ink/80">
          <Link href={`${base}#quartos`} className="underline-grow">{dict['nav.rooms']}</Link>
          <Link href={`${base}/galeria`} className="underline-grow">{dict['nav.gallery']}</Link>
          <Link href={`${base}#pier`} className="underline-grow">{dict['nav.pier']}</Link>
          <Link href={`${base}#localizacao`} className="underline-grow">{dict['nav.location']}</Link>
          <Link href={`${base}#contato`} className="underline-grow">{dict['nav.contact']}</Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <LangSwitcher current={lang} />
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener"
            className="hidden sm:inline-flex items-center gap-2 bg-sun text-sea-deep font-semibold text-sm px-4 py-2 rounded-full hover:bg-sun-light transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
              <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.477-.911z" />
            </svg>
            WhatsApp
          </a>
          <MobileMenu lang={lang} dict={dict} />
        </div>
      </div>
    </header>
  );
}
