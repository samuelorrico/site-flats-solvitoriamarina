import type { MetadataRoute } from 'next';
import { SITE_URL, INDEXABLE } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  const rules = { userAgent: '*', allow: '/' };
  // Só anuncia o sitemap quando o site está indexável (domínio final). Enquanto provisório,
  // fica crawlável (p/ o Google ler o meta `noindex` das páginas), mas sem sitemap.
  return INDEXABLE ? { rules, sitemap: `${SITE_URL}/sitemap.xml` } : { rules };
}
