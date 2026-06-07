// Adapter Groq + Llama 3.1 (OpenAI-compatible) — fetch puro.
// Alternativa de free tier; porta o que o dono já usava no Replit.
import { cfg } from '../config';
import type { ChatMessage } from '../types';

const MODEL = 'llama-3.1-8b-instant'; // o llama3-8b-8192 foi descontinuado (nota do Replit)

export async function askGroq(system: string, messages: ChatMessage[]): Promise<string> {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${cfg.groqKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 512,
      messages: [{ role: 'system', content: system }, ...messages.map((m) => ({ role: m.role, content: m.content }))],
    }),
  });
  if (!res.ok) throw new Error(`Groq ${res.status}: ${await res.text().catch(() => '')}`);
  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  return data.choices?.[0]?.message?.content?.trim() ?? '';
}
