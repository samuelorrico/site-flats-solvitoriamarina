// Orquestra o atendimento: histórico → IA → resposta → memória → (escalonamento).
// Roda dentro de after() no route (pós-resposta 200 à Meta). Nunca lança (sempre try/catch).
import type { ChatMessage } from './types';
import { store } from './memory';
import { askAI } from './ai';
import { systemPrompt } from './knowledge';
import { parseLead, leadContext } from './lead';
import { sendText } from './meta';
import { shouldEscalate, notifyOwner } from './escalation';

// Instruções extras só da 1ª mensagem: apresentação + aviso LGPD (T-06), no idioma do hóspede.
const FIRST_TURN =
  'PRIMEIRA MENSAGEM DESTA CONVERSA: apresente-se em uma frase como assistente virtual do ' +
  'Vitória Marina Flats e inclua uma linha curta de privacidade (LGPD): os dados informados ' +
  'servem apenas para este atendimento e a reserva é finalizada com a proprietária. ' +
  'Escreva no idioma da mensagem do hóspede, de forma leve e natural.';

export async function processMessage(from: string, text: string, name?: string): Promise<void> {
  try {
    const history = await store.get(from);
    const messages: ChatMessage[] = [...history, { role: 'user', content: text }];

    // Na 1ª interação, reforça apresentação/LGPD (T-06) e, se veio do form do site,
    // injeta o resumo pré-preenchido como contexto (T-05) para não repetir perguntas.
    let system = systemPrompt();
    if (history.length === 0) {
      const lead = parseLead(text);
      system += `\n\n${FIRST_TURN}`;
      if (lead) system += `\n\n${leadContext(lead)}`;
    }

    let reply: string;
    try {
      reply = await askAI(system, messages);
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
