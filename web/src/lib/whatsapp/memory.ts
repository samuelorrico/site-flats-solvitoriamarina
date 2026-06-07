// Memória de conversa, abstraída. SQLite (do Replit) NÃO serve em serverless da Vercel.
// Default: in-memory (dev). Prod: Upstash Redis REST (se UPSTASH_* estiver setado).
import { cfg } from './config';
import type { ChatMessage } from './types';

const MAX = 12; // cap do histórico p/ não estourar tokens (lição do Replit)
const TTL = 60 * 60 * 48; // 48h

export interface ConversationStore {
  get(phone: string): Promise<ChatMessage[]>;
  save(phone: string, messages: ChatMessage[]): Promise<void>;
}

// --- in-memory: sobrevive enquanto a instância está quente; não persiste cold start (ok p/ dev) ---
const mem = new Map<string, ChatMessage[]>();
const inMemory: ConversationStore = {
  async get(phone) {
    return mem.get(phone) ?? [];
  },
  async save(phone, messages) {
    mem.set(phone, messages.slice(-MAX));
  },
};

// --- Upstash Redis via REST (forma de comando em array, suporta valores grandes) ---
function upstash(): ConversationStore {
  const key = (p: string) => `wa:${p}`;
  const cmd = async (args: (string | number)[]): Promise<{ result: unknown }> => {
    const res = await fetch(cfg.upstashUrl, {
      method: 'POST',
      headers: { Authorization: `Bearer ${cfg.upstashToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(args),
    });
    if (!res.ok) throw new Error(`Upstash ${res.status}`);
    return (await res.json()) as { result: unknown };
  };
  return {
    async get(phone) {
      const { result } = await cmd(['GET', key(phone)]);
      return typeof result === 'string' ? (JSON.parse(result) as ChatMessage[]) : [];
    },
    async save(phone, messages) {
      await cmd(['SET', key(phone), JSON.stringify(messages.slice(-MAX)), 'EX', TTL]);
    },
  };
}

export const store: ConversationStore = cfg.upstashUrl && cfg.upstashToken ? upstash() : inMemory;
