// Escalonamento para a proprietária. Decisão principal: a IA sinaliza com o marcador
// interno [[ESCALAR: motivo]] (T-04). A heurística de palavras-chave fica como REDE DE
// SEGURANÇA (caso o modelo esqueça o marcador).
import { cfg } from './config';
import { sendText } from './meta';

// Marcador que a IA acrescenta na última linha quando o caso precisa da proprietária.
// É interno: removido da resposta antes de enviar ao hóspede.
const MARKER = /\[\[\s*ESCALAR\s*:\s*([^\]]*?)\s*\]\]/i;

// Separa o marcador do texto visível. Retorna a resposta limpa e o motivo (ou null).
export function parseEscalation(reply: string): { clean: string; reason: string | null } {
  const m = reply.match(MARKER);
  if (!m) return { clean: reply, reason: null };
  const reason = (m[1] || '').trim() || 'motivo não especificado';
  const clean = reply.replace(MARKER, '').replace(/\n{3,}/g, '\n\n').trim();
  return { clean, reason };
}

// Rede de segurança: gatilhos conservadores de "lead quente / caso complexo".
const TRIGGERS = [/reserv/i, /fechar/i, /desconto/i, /reclama/i, /cancela/i];

export function shouldEscalate(text: string): boolean {
  return TRIGGERS.some((re) => re.test(text));
}

export async function notifyOwner(
  guestPhone: string,
  guestName: string | undefined,
  lastText: string,
  reason?: string,
): Promise<void> {
  if (!cfg.ownerNumber) {
    console.warn('[wa] WHATSAPP_OWNER_NUMBER ausente — não escalei');
    return;
  }
  const msg =
    `🔔 Atendimento precisa de você (Vitória Marina Flats)\n` +
    `• De: ${guestName ?? guestPhone} (${guestPhone})\n` +
    (reason ? `• Motivo: ${reason}\n` : '') +
    `• Última mensagem do hóspede: "${lastText}"\n\n` +
    `Responda direto: https://wa.me/${guestPhone}`;
  await sendText(cfg.ownerNumber, msg);
}
