// Gerador do card de compartilhamento (Open Graph / Twitter) via next/og.
// Foto real da baía ao fundo + overlay + marca/tagline localizada. 1200×630.
// Usado por app/[lang]/opengraph-image.tsx e .../twitter-image.tsx.
import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getDictionary } from '@/dictionaries';
import type { Locale } from '@/i18n-config';

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = 'image/png';
export const ogAlt =
  'Vitória Marina Flats — vista da Baía de Todos os Santos, no Corredor da Vitória, Salvador';

// Tagline curta por idioma (espelha a mensagem do hero, encurtada p/ caber no card).
const TAGLINE: Record<Locale, string> = {
  pt: 'Flats de temporada com vista para a Baía de Todos os Santos',
  en: "Holiday flats overlooking All Saints' Bay",
  es: 'Flats de temporada con vista a la Bahía de Todos los Santos',
};

export async function renderOgImage(lang: Locale) {
  const dict = getDictionary(lang);
  // Bytes crus (ArrayBuffer) em vez de base64 p/ não inflar ~33% e ficar sob o limite de 500KB.
  const photo = Uint8Array.from(
    await readFile(join(process.cwd(), 'public/images/vista-baia.jpg')),
  ).buffer;
  const eyebrow = dict['hero.tag'].toUpperCase();

  return new ImageResponse(
    (
      <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex' }}>
        {/* next/og (Satori) exige <img>; next/image não se aplica aqui. */}
        {/* Satori aceita ArrayBuffer no src em runtime; o tipo segue o spec (string), daí o cast. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo as unknown as string}
          alt=""
          width={1200}
          height={630}
          style={{ position: 'absolute', top: 0, left: 0, width: 1200, height: 630, objectFit: 'cover' }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            display: 'flex',
            background:
              'linear-gradient(180deg, rgba(10,43,51,0.10) 0%, rgba(10,43,51,0.32) 42%, rgba(10,43,51,0.90) 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 72,
            bottom: 68,
            display: 'flex',
            flexDirection: 'column',
            maxWidth: 1020,
          }}
        >
          <div style={{ width: 64, height: 5, borderRadius: 3, background: '#d6973f', marginBottom: 26 }} />
          <div style={{ fontSize: 25, letterSpacing: 4, color: '#e7b873', fontWeight: 600 }}>{eyebrow}</div>
          <div style={{ fontSize: 82, lineHeight: 1.02, color: '#faf6ee', fontWeight: 600, marginTop: 14 }}>
            Vitória Marina Flats
          </div>
          <div style={{ fontSize: 31, lineHeight: 1.22, color: 'rgba(243,234,219,0.93)', marginTop: 18 }}>
            {TAGLINE[lang]}
          </div>
        </div>
      </div>
    ),
    { ...ogSize },
  );
}
