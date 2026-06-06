import type { NextConfig } from "next";

// CSP de defesa em profundidade. O site é estático, sem backend, sem login e sem
// input do usuário renderizado como HTML (form só monta um link wa.me), então a
// superfície de XSS é mínima. 'unsafe-inline' em script/style é necessário porque
// o Next 16 hidrata via scripts inline e não usamos nonce (exigiria middleware em
// toda rota, regredindo a perf). frame-src libera só o mapa do Google.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "frame-src 'self' https://*.google.com",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  images: {
    // AVIF primeiro (cai ~30-50% vs WebP) → reduz os bytes do LCP no mobile.
    // O Next negocia por Accept: navegador que suporta AVIF recebe AVIF; senão WebP.
    formats: ["image/avif", "image/webp"],
    // Qualidades permitidas no otimizador (Next 16 exige allowlist; fora dela = 400).
    // 55 = hero (atrás do gradiente, leve p/ o LCP); 75 = demais imagens (default).
    qualities: [55, 75],
    // Cache mais longo das imagens otimizadas no CDN (default é só 60s).
    minimumCacheTTL: 31536000,
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
