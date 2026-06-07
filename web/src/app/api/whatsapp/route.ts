// Webhook do WhatsApp (Meta Cloud API). Feature 05 / M3.
// GET  = verificação do webhook pela Meta.
// POST = recebe mensagens; responde 200 NA HORA e processa em after() (Meta não re-tenta).
import { after } from 'next/server';
import { cfg } from '@/lib/whatsapp/config';
import { parseIncoming } from '@/lib/whatsapp/meta';
import { processMessage } from '@/lib/whatsapp/conversation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30; // tempo p/ o processamento pós-resposta (IA + envio)

export async function GET(req: Request) {
  const url = new URL(req.url);
  const mode = url.searchParams.get('hub.mode');
  const token = url.searchParams.get('hub.verify_token');
  const challenge = url.searchParams.get('hub.challenge');
  if (mode === 'subscribe' && challenge && token && token === cfg.verifyToken) {
    return new Response(challenge, { status: 200 });
  }
  return new Response('Forbidden', { status: 403, headers: { 'x-wa-build': 'v2' } });
}

export async function POST(req: Request) {
  let body: unknown = null;
  try {
    body = await req.json();
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
