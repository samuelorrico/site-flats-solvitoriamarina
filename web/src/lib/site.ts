// Dados fixos do site (trocar só aqui se mudar).
// URL base para canonical/OG/sitemap. No go-live (domínio .com.br) basta definir
// NEXT_PUBLIC_SITE_URL na Vercel — sem mexer no código.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://site-flats-solvitoriamarina.vercel.app').replace(/\/$/, '');

// Indexável só quando o domínio final estiver configurado (NEXT_PUBLIC_SITE_URL apontando
// para um domínio próprio, não a URL provisória .vercel.app). Até o go-live o site fica
// `noindex` para o Google não indexar o conteúdo placeholder (B-001). É o MESMO interruptor
// do go-live: ao definir NEXT_PUBLIC_SITE_URL=https://...com.br, o site passa a ser indexável.
export const INDEXABLE = !!process.env.NEXT_PUBLIC_SITE_URL && !SITE_URL.includes('vercel.app');
export const WA_PHONE = '5571991159858';
export const WA_LINK = `https://wa.me/${WA_PHONE}`;
export const INSTAGRAM = 'https://www.instagram.com/vitoriamarinaflats';
export const EMAIL = 'vitoriamarinaflats@gmail.com';
export const EMAIL_LINK = `mailto:${EMAIL}`;
export const ADDRESS = 'Av. Sete de Setembro, 2068 · Corredor da Vitória, Salvador-BA · CEP 40080-004';
export const POSTAL_CODE = '40080-004';
export const MAPS_EMBED =
  'https://www.google.com/maps?q=Sol%20Victoria%20Marina%2C%20Av.%20Sete%20de%20Setembro%202068%2C%20Salvador%20-%20BA&output=embed';
export const MAPS_LINK =
  'https://www.google.com/maps/search/?api=1&query=Sol%20Victoria%20Marina%2C%20Av.%20Sete%20de%20Setembro%202068%2C%20Salvador%20-%20BA';
