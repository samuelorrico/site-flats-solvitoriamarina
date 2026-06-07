// IA abstraída: seleciona o provedor por env (AI_PROVIDER). Ver config.ts.
import { cfg } from '../config';
import type { ChatMessage } from '../types';
import { askClaude } from './claude';
import { askGroq } from './groq';

export async function askAI(system: string, messages: ChatMessage[]): Promise<string> {
  if (cfg.aiProvider === 'claude') return askClaude(system, messages);
  return askGroq(system, messages);
}
