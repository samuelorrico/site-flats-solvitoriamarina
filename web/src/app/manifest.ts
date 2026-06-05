import type { MetadataRoute } from 'next';

// Web App Manifest (PWA básico: "Adicionar à Tela de Início" com nome/ícone/cores).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Vitória Marina Flats',
    short_name: 'Vitória Marina',
    description: 'Flats de temporada com vista para a Baía de Todos os Santos — Corredor da Vitória, Salvador-BA.',
    start_url: '/',
    display: 'standalone',
    background_color: '#faf6ee',
    theme_color: '#0a2b33',
    icons: [
      { src: '/icon.svg', type: 'image/svg+xml', sizes: 'any' },
      { src: '/apple-icon', type: 'image/png', sizes: '180x180' },
    ],
  };
}
