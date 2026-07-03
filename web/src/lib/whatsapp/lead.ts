// Continuidade do lead do site (T-05). O form da Home (QualForm.tsx) abre o WhatsApp
// com uma mensagem pré-preenchida no formato:
//   <intro>
//   • <Tipo/Type/Tipo>: <valor>
//   • <Check-in/Entrada>: <valor>
//   • <Check-out/Salida>: <valor>
//   • <Hóspedes/Guests/Huéspedes>: <valor>
//   • <Nome/Name/Nombre>: <valor>
// Aqui a gente reconhece esse resumo (em PT/EN/ES) e o transforma em contexto estruturado,
// pra a IA cumprimentar pelo nome e NÃO repetir o que o hóspede já informou.

export interface LeadInfo {
  type?: string;
  checkin?: string;
  checkout?: string;
  guests?: string;
  name?: string;
}

// Rótulos possíveis por campo (minúsculos), cobrindo os 3 idiomas do site.
const LABELS: Record<keyof LeadInfo, string[]> = {
  type: ['tipo', 'type'],
  checkin: ['check-in', 'entrada'],
  checkout: ['check-out', 'salida'],
  guests: ['hóspedes', 'hospedes', 'huéspedes', 'huespedes', 'guests'],
  name: ['nome', 'name', 'nombre'],
};

// Valores "a confirmar" gerados pelo form (wa.tbd) — tratados como vazio.
const TBD = ['a confirmar', 'to be confirmed'];

function fieldFor(label: string): keyof LeadInfo | null {
  const l = label.trim().toLowerCase();
  for (const key of Object.keys(LABELS) as (keyof LeadInfo)[]) {
    if (LABELS[key].includes(l)) return key;
  }
  return null;
}

// Retorna os dados do lead se a mensagem parecer o resumo do site; senão, null.
export function parseLead(text: string): LeadInfo | null {
  const lead: LeadInfo = {};
  let matched = 0;

  for (const rawLine of text.split('\n')) {
    // tira o bullet "• " (ou "-") do início e separa "rótulo: valor"
    const line = rawLine.replace(/^\s*[•\-*]\s*/, '');
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const field = fieldFor(line.slice(0, idx));
    if (!field) continue;
    const value = line.slice(idx + 1).trim();
    matched++;
    if (value && !TBD.includes(value.toLowerCase())) lead[field] = value;
  }

  // Precisa bater pelo menos 2 campos conhecidos p/ evitar falso positivo.
  return matched >= 2 ? lead : null;
}

// Monta uma linha de contexto p/ anexar ao system prompt na 1ª mensagem.
export function leadContext(lead: LeadInfo): string {
  const parts: string[] = [];
  if (lead.name) parts.push(`nome: ${lead.name}`);
  if (lead.type) parts.push(`tipo de quarto: ${lead.type}`);
  if (lead.checkin) parts.push(`check-in: ${lead.checkin}`);
  if (lead.checkout) parts.push(`check-out: ${lead.checkout}`);
  if (lead.guests) parts.push(`hóspedes: ${lead.guests}`);
  const dados = parts.length ? parts.join('; ') : 'sem detalhes preenchidos';
  return (
    `CONTEXTO DO SITE: o hóspede chegou pelo formulário do site já informando — ${dados}. ` +
    `Cumprimente pelo nome (se houver), confirme brevemente esses dados e NÃO pergunte de novo o que já foi informado. ` +
    `Peça apenas o que faltar (ex.: datas ou número de hóspedes).`
  );
}
