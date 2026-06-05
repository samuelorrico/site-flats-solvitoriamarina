import { ImageResponse } from 'next/og';

// Ícone para iOS ("Adicionar à Tela de Início"). PNG 180×180 gerado no build.
// iOS aplica a máscara arredondada própria, então o fundo preenche o quadrado todo.
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'><rect width='180' height='180' fill='#0a2b33'/><circle cx='90' cy='70' r='28' fill='#e7b873'/><path d='M26 115q16-17 32 0t32 0 32 0 32 0' fill='none' stroke='#f3eadb' stroke-width='9' stroke-linecap='round'/><path d='M26 138q16-17 32 0t32 0 32 0 32 0' fill='none' stroke='#d6973f' stroke-width='9' stroke-linecap='round'/></svg>`;

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img width={180} height={180} src={`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`} alt="" />
      </div>
    ),
    size,
  );
}
