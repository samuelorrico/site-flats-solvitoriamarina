'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { locales, type Locale } from '@/i18n-config';

export default function LangSwitcher({ current }: { current: Locale }) {
  const pathname = usePathname() || `/${current}`;

  function pathFor(locale: Locale) {
    const parts = pathname.split('/');
    if (parts.length > 1 && (locales as readonly string[]).includes(parts[1])) {
      parts[1] = locale;
      return parts.join('/') || `/${locale}`;
    }
    return `/${locale}`;
  }

  return (
    <div className="flex items-center text-[13px] text-ink/70 border border-ink/15 rounded-full overflow-hidden">
      {locales.map((locale) => (
        <Link
          key={locale}
          href={pathFor(locale)}
          aria-current={locale === current ? 'true' : undefined}
          className={`px-2.5 py-1 uppercase transition-colors ${
            locale === current ? 'bg-sea text-sand-soft' : 'hover:bg-ink/5'
          }`}
        >
          {locale}
        </Link>
      ))}
    </div>
  );
}
