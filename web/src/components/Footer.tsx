import Link from 'next/link';
import type { Locale } from '@/i18n-config';
import type { Dict } from '@/dictionaries';
import { WA_LINK, INSTAGRAM, EMAIL, EMAIL_LINK } from '@/lib/site';

export default function Footer({ lang, dict }: { lang: Locale; dict: Dict }) {
  const base = `/${lang}`;
  return (
    <footer className="bg-sea-deep text-sand/70">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-2">
          <p className="font-display text-2xl text-sand-soft">
            Vitória Marina <span className="italic text-sun-light">Flats</span>
          </p>
          <p className="mt-4 max-w-sm text-sand/60 font-light">{dict['footer.tagline']}</p>
        </div>
        <div>
          <p className="text-sand-soft font-medium mb-4 text-sm tracking-wide uppercase">{dict['footer.nav']}</p>
          <ul className="space-y-2.5 text-sm">
            <li><Link href={`${base}#quartos`} className="hover:text-sand-soft">{dict['nav.rooms']}</Link></li>
            <li><Link href={`${base}/galeria`} className="hover:text-sand-soft">{dict['nav.gallery']}</Link></li>
            <li><Link href={`${base}#pier`} className="hover:text-sand-soft">{dict['nav.pier']}</Link></li>
            <li><Link href={`${base}#localizacao`} className="hover:text-sand-soft">{dict['nav.location']}</Link></li>
            <li><Link href={`${base}#contato`} className="hover:text-sand-soft">{dict['nav.contact']}</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sand-soft font-medium mb-4 text-sm tracking-wide uppercase">{dict['footer.contact_col']}</p>
          <ul className="space-y-2.5 text-sm">
            <li><a href={WA_LINK} target="_blank" rel="noopener" className="hover:text-sand-soft">WhatsApp</a></li>
            <li><a href={INSTAGRAM} target="_blank" rel="noopener" className="hover:text-sand-soft">Instagram</a></li>
            <li><a href={EMAIL_LINK} className="hover:text-sand-soft break-all">{EMAIL}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-sand/10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-sand/70">
          <p>© 2026 Vitória Marina Flats</p>
          <div className="flex items-center gap-4">
            <Link href={`${base}/privacidade`} className="hover:text-sand-soft">{dict['footer.privacy']}</Link>
            <span>Corredor da Vitória · Salvador-BA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
