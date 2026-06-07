// Orquestra o atendimento: histórico → IA → resposta → memória → (escalonamento).
// Roda dentro de after() no route (pós-resposta 200 à Meta). Nunca lança (sempre try/catch).
import type { ChatMessage } from './types';
import { store } from './memory';
import { askAI } from './ai';
import { systemPrompt } from './knowledge';
import { sendText } from './meta';
import { shouldEscalate, notifyOwner } from './escalation';

export async function processMessage(from: string, text: string, name?: string): Promise<void> {
  try {
    const history = await store.get(from);
    const messages: ChatMessage[] = [...history, { role: 'user', content: text }];

    let reply: string;
    try {
      reply = await askAI(systemPrompt(), messages);
    } catch (e) {
      console.error('[wa] IA falhou:', e);
      reply = 'Oi! Recebi sua mensagem 😊 Já te respondo.'; // fallback gracioso
    }

    if (reply) {
      await sendText(from, reply);
      await store.save(from, [...messages, { role: 'assistant', content: reply }]);
    }

    if (shouldEscalate(text)) {
      await notifyOwner(from, name, text).catch((e) => console.error('[wa] escalonamento falhou:', e));
    }
  } catch (e) {
    console.error('[wa] processMessage erro:', e);
  }
}
