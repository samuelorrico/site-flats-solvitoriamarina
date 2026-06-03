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
  // Pula _next, api e qualquer arquivo com extensão (imagens, favicon, etc.)
  matcher: ['/((?!_next|api|.*\\..*).*)'],
};
