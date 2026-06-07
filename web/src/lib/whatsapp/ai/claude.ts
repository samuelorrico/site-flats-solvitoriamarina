// Adapter Claude (Anthropic Messages API) — fetch puro. Recomendado (skill claude-api).
import { cfg } from '../config';
import type { ChatMessage } from '../types';

const MODEL = 'claude-haiku-4-5-20251001'; // Haiku 4.5: rápido e barato

export async function askClaude(system: string, messages: ChatMessage[]): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': cfg.anthropicKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 512,
      // Prompt caching: o system prompt (grande e estável) é cacheado entre chamadas → barato.
      system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  });
  if (!res.ok) throw new Error(`Claude ${res.status}: ${await res.text().catch(() => '')}`);
  const data = (await res.json()) as { content?: { type: string; text?: string }[] };
  return (data.content ?? [])
    .filter((c) => c.type === 'text')
    .map((c) => c.text ?? '')
    .join('')
    .trim();
}
