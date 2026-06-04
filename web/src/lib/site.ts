// Dados fixos do site (trocar só aqui se mudar).
// URL base para canonical/OG/sitemap. No go-live (domínio .com.br) basta definir
// NEXT_PUBLIC_SITE_URL na Vercel — sem mexer no código.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://site-flats-solvitoriamarina.vercel.app').replace(/\/$/, '');
export const WA_PHONE = '5571991159858';
export const WA_LINK = `https://wa.me/${WA_PHONE}`;
export const INSTAGRAM = 'https://www.instagram.com/solvitoriamarinaflats';
export const ADDRESS = 'Av. Sete de Setembro, 2068 · Corredor da Vitória, Salvador-BA';
export const MAPS_EMBED =
  'https://www.google.com/maps?q=Sol%20Victoria%20Marina%2C%20Av.%20Sete%20de%20Setembro%202068%2C%20Salvador%20-%20BA&output=embed';
export const MAPS_LINK =
  'https://www.google.com/maps/search/?api=1&query=Sol%20Victoria%20Marina%2C%20Av.%20Sete%20de%20Setembro%202068%2C%20Salvador%20-%20BA';
