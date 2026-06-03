import { createElement, type ElementType } from 'react';

// Renderiza uma string do dicionário que pode conter HTML (ex.: <strong>, <span>).
// Conteúdo é próprio/confiável (copy do site), por isso o uso de dangerouslySetInnerHTML.
export function Rich({
  html,
  as = 'span',
  className,
}: {
  html: string;
  as?: ElementType;
  className?: string;
}) {
  return createElement(as, { className, dangerouslySetInnerHTML: { __html: html } });
}
