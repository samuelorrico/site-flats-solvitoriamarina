// Escalonamento para a proprietária. BASE: heurística simples + notificação.
// Evoluir para tool use (a IA chama uma função `escalar`), conforme a skill ai-sdr.
import { cfg } from './config';
import { sendText } from './meta';

// Gatilhos conservadores de "lead quente / caso complexo".
const TRIGGERS = [/reserv/i, /fechar/i, /desconto/i, /reclama/i, /cancela/i];

export function shouldEscalate(text: string): boolean {
  return TRIGGERS.some((re) => re.test(text));
}

export async function notifyOwner(guestPhone: string, guestName: string | undefined, lastText: string): Promise<void> {
  if (!cfg.ownerNumber) {
    console.warn('[wa] WHATSAPP_OWNER_NUMBER ausente — não escalei');
    return;
  }
  const msg =
    `🔔 Lead quente no WhatsApp\n` +
    `• De: ${guestName ?? guestPhone} (${guestPhone})\n` +
    `• Última mensagem: "${lastText}"\n\n` +
    `Responda direto: https://wa.me/${guestPhone}`;
  await sendText(cfg.ownerNumber, msg);
}
