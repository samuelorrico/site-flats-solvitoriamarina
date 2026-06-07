# Vitória Marina Flats

Site vitrine trilíngue **+ atendimento por IA no WhatsApp** para os flats de temporada do **Vitória Marina Flats**, no **Corredor da Vitória, Salvador-BA**, com vista para a **Baía de Todos os Santos** e acesso ao exclusivo **Píer Mahi Mahi**.

🔗 **No ar:** <https://vitoriamarinaflats.com.br>

## O que é

Uma hospedeira independente precisava de um canal próprio: a divulgação ficava espalhada (Booking, Airbnb, Instagram) e o atendimento consumia o dia respondendo as mesmas perguntas.

Este projeto resolve os dois lados, como **um produto integrado**:

1. **Site** rápido e bonito (PT/EN/ES) que apresenta as unidades, **qualifica o interesse** (tipo de quarto, datas, hóspedes) e leva o visitante ao **WhatsApp já com tudo preenchido**. Canal **direto** — Instagram/TikTok → site → WhatsApp.
2. **IA no WhatsApp** que recebe esse lead, responde as dúvidas comuns e **só chama a anfitriã quando o contato está quente** — reduzindo o tempo dela.

## Funcionalidades

**Site (no ar):**

- Trilíngue **PT/EN/ES** (i18n nativo do Next 16, `hreflang`/`canonical`)
- Tipos de quarto (**Casal, Triplo, Quádruplo** — vista mar/avenida) + **galeria** com lightbox
- Seção **"Bom saber"** (check-in/out, regras), Píer Mahi Mahi, localização com mapa
- **Qualificação → WhatsApp** pré-preenchido (datas validadas, no idioma corrente)
- **SEO** completo (Open Graph dinâmico via `next/og`, `sitemap`, JSON-LD `LodgingBusiness`), **PWA**, **acessibilidade WCAG AA**
- **Segurança** (CSP + headers) e performance otimizada (hero estático, AVIF)

**Atendimento por IA no WhatsApp (integrado — em testes):**

- Webhook da **WhatsApp Cloud API (Meta)** como rota do próprio app: `/api/whatsapp`
- Recebe o lead do site e dá continuidade; responde **FAQ** (preços, comodidades, check-in, regras) em PT/EN/ES
- **Escala** leads quentes/complexos para a anfitriã
- IA **trocável por configuração**: **Claude Haiku** (produção) / **Groq Llama** (testes); memória de conversa; *system prompt* com as regras reais do imóvel

## Stack

**Next.js 16** (App Router) · **React 19** · **TypeScript** · **Tailwind CSS v4** · **Vercel**.
IA: WhatsApp Cloud API (Meta) + **Claude/Groq** (via `fetch`, sem SDKs) · memória em **Upstash Redis** (com fallback in-memory).

## Estrutura

```text
web/                      ← app Next.js (site + bot), servido na Vercel
  src/app/[lang]/         ← páginas trilíngues (home, galeria, privacidade)
  src/app/api/whatsapp/   ← webhook do atendimento por IA
  src/lib/whatsapp/       ← IA (Claude/Groq), memória, system prompt, Cloud API
  src/messages/           ← textos PT/EN/ES
design-prototype/         ← protótipo visual original (referência da fase de design)
```

## Status

- ✅ **Site no ar** — trilíngue, seguro e otimizado.
- 🟡 **IA no WhatsApp** — base no ar (`/api/whatsapp`), em configuração/testes (Meta Cloud API + Groq nos testes → Claude Haiku na produção).

## Desenvolvimento

```bash
cd web
npm install
npm run dev      # http://localhost:3000
npm run build    # build de produção
```

Variáveis de ambiente (site + bot): ver [`web/.env.example`](web/.env.example). Segredos ficam na Vercel / `.env.local` (fora do versionamento).

---

*Site de uma hospedeira independente no edifício Sol Victoria Marina — não é a operação hoteleira oficial.*
