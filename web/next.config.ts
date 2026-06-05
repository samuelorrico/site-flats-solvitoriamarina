import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF primeiro (cai ~30-50% vs WebP) → reduz os bytes do LCP no mobile.
    // O Next negocia por Accept: navegador que suporta AVIF recebe AVIF; senão WebP.
    formats: ["image/avif", "image/webp"],
    // Cache mais longo das imagens otimizadas no CDN (default é só 60s).
    minimumCacheTTL: 31536000,
  },
};

export default nextConfig;
