import { NextResponse, type NextRequest } from 'next/server';
import { locales, defaultLocale } from './i18n-config';

function getLocale(request: NextRequest): string {
  const header = request.headers.get('accept-language') ?? '';
  const preferred = header
    .split(',')
    .map((part) => part.split(';')[0].trim().slice(0, 2).toLowerCase());
  for (const code of preferred) {
    if ((locales as readonly string[]).includes(code)) return code;
  }
  return defaultLocale;
}

// Next 16: o antigo middleware agora se chama "proxy".
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return;

  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Pula _next, api, rotas de metadata SEM extensão (apple-icon, opengraph-image,
  // twitter-image) e qualquer arquivo com extensão (icon.svg, manifest.webmanifest,
  // robots.txt, sitemap.xml, imagens, etc.). Sem isso, o redirect de locale quebraria
  // /apple-icon (vira /pt/apple-icon → 404).
  matcher: ['/((?!_next|api|apple-icon|opengraph-image|twitter-image|.*\\..*).*)'],
};
