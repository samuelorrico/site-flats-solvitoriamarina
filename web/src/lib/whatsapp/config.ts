// Configuração do bot de WhatsApp (server-only). Lê variáveis de ambiente.
// Segredos ficam na Vercel / .env.local (gitignored). Ver .env.example.
export const cfg = {
  // Aceita os nomes WHATSAPP_* e também os nomes "curtos" (compat. com o projeto Replit).
  verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || process.env.VERIFY_TOKEN || '',
  whatsappToken: process.env.WHATSAPP_TOKEN || '',
  phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || process.env.PHONE_NUMBER_ID || '',
  ownerNumber: process.env.WHATSAPP_OWNER_NUMBER || process.env.OWNER_NUMBER || '',
  // Segredo do app na Meta — valida a assinatura X-Hub-Signature-256 do webhook (T-03).
  appSecret: process.env.META_APP_SECRET || process.env.APP_SECRET || '',
  // 'claude' (recomendado) ou 'groq'. Default: claude se houver chave Anthropic, senão groq.
  aiProvider: (process.env.AI_PROVIDER ?? (process.env.ANTHROPIC_API_KEY ? 'claude' : 'groq')) as 'claude' | 'groq',
  anthropicKey: process.env.ANTHROPIC_API_KEY ?? '',
  groqKey: process.env.GROQ_API_KEY ?? '',
  upstashUrl: process.env.UPSTASH_REDIS_REST_URL ?? '',
  upstashToken: process.env.UPSTASH_REDIS_REST_TOKEN ?? '',
  graphVersion: 'v20.0',
};

export const GRAPH_BASE = 'https://graph.facebook.com';
