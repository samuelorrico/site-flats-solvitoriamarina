export type Role = 'user' | 'assistant';

export interface ChatMessage {
  role: Role;
  content: string;
}

// Mensagem de texto recebida, já normalizada do payload da Meta.
export interface IncomingMessage {
  from: string; // wa_id do hóspede (usado como destino da resposta)
  text: string;
  name?: string;
  id: string;
}
