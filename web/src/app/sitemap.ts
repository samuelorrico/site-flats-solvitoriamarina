import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { locales, htmlLang } from '@/i18n-config';

const paths = ['', '/galeria', '/privacidade'];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const path of paths) {
    const languages = Object.fromEntries(
      locales.map((l) => [htmlLang[l], `${SITE_URL}/${l}${path}`]),
    );
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified,
        changeFrequency: 'monthly',
        priority: path === '' ? 1 : path === '/privacidade' ? 0.3 : 0.8,
        alternates: { languages },
      });
    }
  }

  return entries;
}
