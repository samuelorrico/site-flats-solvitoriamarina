// Cliente da WhatsApp Cloud API (Meta) — fetch puro, sem SDK.
import { cfg, GRAPH_BASE } from './config';
import type { IncomingMessage } from './types';

// Subset tipado do payload do webhook da Meta (só o que usamos).
interface MetaText { body?: string }
interface MetaMessage { from?: string; id?: string; type?: string; text?: MetaText }
interface MetaContact { profile?: { name?: string } }
interface MetaValue { messages?: MetaMessage[]; contacts?: MetaContact[] }
interface MetaChange { value?: MetaValue }
interface MetaEntry { changes?: MetaChange[] }
interface MetaWebhookBody { entry?: MetaEntry[] }

// Extrai a 1ª mensagem de TEXTO. Retorna null se for status de entrega, reaction, etc.
// (lição do projeto Replit: a Meta manda muitos eventos que não são mensagem).
export function parseIncoming(body: unknown): IncomingMessage | null {
  const value = (body as MetaWebhookBody)?.entry?.[0]?.changes?.[0]?.value;
  const msg = value?.messages?.[0];
  if (!msg || msg.type !== 'text' || !msg.from || !msg.text?.body) return null;
  return {
    from: msg.from,
    text: msg.text.body,
    name: value?.contacts?.[0]?.profile?.name,
    id: msg.id ?? '',
  };
}

// Envia texto via Cloud API. `to` = o wa_id exato recebido (número dinâmico — lição do Replit).
export async function sendText(to: string, body: string): Promise<void> {
  if (!cfg.whatsappToken || !cfg.phoneNumberId) {
    console.warn('[wa] WHATSAPP_TOKEN/PHONE_NUMBER_ID ausentes — pulei o envio');
    return;
  }
  const res = await fetch(`${GRAPH_BASE}/${cfg.graphVersion}/${cfg.phoneNumberId}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${cfg.whatsappToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ messaging_product: 'whatsapp', to, type: 'text', text: { body } }),
  });
  if (!res.ok) console.error('[wa] envio falhou', res.status, await res.text().catch(() => ''));
}
