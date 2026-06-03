import type { Locale } from './i18n-config';
import pt from './messages/pt';
import en from './messages/en';
import es from './messages/es';

export type Dict = Record<string, string>;

const dictionaries: Record<Locale, Dict> = { pt, en, es };

export function getDictionary(locale: Locale): Dict {
  return dictionaries[locale];
}
