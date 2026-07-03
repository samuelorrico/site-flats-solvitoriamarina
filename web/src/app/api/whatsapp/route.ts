// Webhook do WhatsApp (Meta Cloud API). Feature 05 / M3.
// GET  = verificação do webhook pela Meta.
// POST = recebe mensagens; responde 200 NA HORA e processa em after() (Meta não re-tenta).
import { after } from 'next/server';
import crypto from 'node:crypto';
import { cfg } from '@/lib/whatsapp/config';
import { parseIncoming } from '@/lib/whatsapp/meta';
import { processMessage } from '@/lib/whatsapp/conversation';

// Valida a assinatura HMAC-SHA256 da Meta (X-Hub-Signature-256 = 'sha256=' + hmac(appSecret, corpo)).
// Se META_APP_SECRET não estiver setado, não bloqueia (mantém a base inerte até configurar).
function validSignature(raw: string, header: string | null): boolean {
  if (!cfg.appSecret) return true;
  if (!header) return false;
  const expected = 'sha256=' + crypto.createHmac('sha256', cfg.appSecret).update(raw).digest('hex');
  const a = Buffer.from(header);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30; // tempo p/ o processamento pós-resposta (IA + envio)

export async function GET(req: Request) {
  const url = new URL(req.url);

  // Diagnóstico TEMPORÁRIO: diz quais env o servidor enxerga (só true/false, sem valores).
  // Remover depois que a config estiver OK (T-setup).
  if (url.searchParams.get('selfcheck') === '1') {
    return Response.json({
      verifyToken: !!cfg.verifyToken,
      whatsappToken: !!cfg.whatsappToken,
      phoneNumberId: !!cfg.phoneNumberId,
      ownerNumber: !!cfg.ownerNumber,
      aiProvider: cfg.aiProvider,
      groqKey: !!cfg.groqKey,
      anthropicKey: !!cfg.anthropicKey,
      upstash: !!(cfg.upstashUrl && cfg.upstashToken),
      appSecret: !!cfg.appSecret,
      build: 'v5',
    });
  }

  const mode = url.searchParams.get('hub.mode');
  const token = url.searchParams.get('hub.verify_token');
  const challenge = url.searchParams.get('hub.challenge');
  if (mode === 'subscribe' && challenge && token && token === cfg.verifyToken) {
    return new Response(challenge, { status: 200 });
  }
  return new Response('Forbidden', { status: 403, headers: { 'x-wa-build': 'v2' } });
}

export async function POST(req: Request) {
  const raw = await req.text().catch(() => '');

  // T-03: rejeita corpos não assinados pela Meta (forjados). Requisição legítima nunca cai aqui.
  if (!validSignature(raw, req.headers.get('x-hub-signature-256'))) {
    return new Response('Invalid signature', { status: 401 });
  }

  let body: unknown = null;
  try {
    body = JSON.parse(raw);
  } catch {
    // corpo inválido — ignora, mas ainda responde 200
  }
  try {
    const msg = parseIncoming(body);
    if (msg) after(() => processMessage(msg.from, msg.text, msg.name));
  } catch (e) {
    console.error('[wa] webhook erro:', e);
  }
  // Sempre 200 para a Meta não re-enviar (evita loop) — lição do Replit.
  return new Response('OK', { status: 200 });
}
