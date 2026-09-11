# Limaq — site institucional e catálogo

Site da **Limaq** (Belém/PA): equipamentos profissionais para food service, assistência técnica,
instalação, manutenção e peças. Desde 1987.

SPA em **React 19 + Vite 7 + Tailwind CSS 4 + TypeScript**, sem backend: toda a conversão
(carrinho, orçamento, ordem de serviço) termina em uma mensagem de **WhatsApp** pré-preenchida.

## Como rodar

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # gera dist/
npm run preview    # serve o build de produção
npm run check      # type-check (tsc --noEmit)
```

## Estrutura

```
src/
  pages/            Home, ProductDetail, BrandResults, NotFound
  components/       seções autorais (ServiceCarousel, SolutionsStack, StickyAssistance,
                    BrandsExperience), CartDrawer, BrandLogo, ErrorBoundary
  components/ui/    kit shadcn/ui (disponível para uso futuro)
  lib/catalog.ts    catálogo: produtos, categorias e marcas  ← edite o conteúdo aqui
  lib/cart.ts       carrinho persistente + montagem da mensagem de WhatsApp
  hooks/useCart.ts  hook que liga os componentes ao carrinho
public/
  images/           fotos de equipamento (locales, sem CDN externo)
  sitemap.xml       42 URLs (home + produtos + marcas)
  robots.txt
```

## Onde editar cada coisa

| O quê | Onde |
|---|---|
| Produtos, categorias, specs | `src/lib/catalog.ts` |
| Marcas atendidas (nome, categoria, descrição) | `src/components/BrandsExperience.tsx` |
| Número de WhatsApp | `src/lib/cart.ts` (`WHATSAPP_NUMBER`) |
| Logo | solte o arquivo em `src/assets/logo.png` (ou `.svg`/`.webp`) — vira a logo principal automaticamente; sem arquivo, usa o CDN oficial e depois o wordmark SVG local |
| Logos das marcas | solte em `src/assets/logos/<slug>.png` (convenção em `src/assets/logos/README.md`) — entra no site sem alterar código |
| Textos institucionais (história, serviços, soluções) | `src/pages/Home.tsx`, `src/components/*` |
| Cores e componentes de estilo | `src/index.css` |

## Como funciona a conversão

1. O visitante adiciona equipamentos ao carrinho (home, busca ou página de produto).
2. O carrinho fica em `localStorage` (`limaq:cart:v1`) — sobrevive a reload e navegação.
3. Em "Solicitar orçamento", o site abre o WhatsApp com a **lista de itens + dados do cliente**
   já preenchidos na mensagem.
4. A ordem de serviço de assistência técnica segue o mesmo princípio, com campos próprios.

## Sistema de motion (progressive enhancement)

O conteúdo **nunca** depende de animação para existir. Todos os efeitos são camadas
opcionais sobre um site que funciona sem eles:

| Efeito | Onde | Status |
|---|---|---|
| Parallax do hero (variáveis CSS + rAF, sem re-render) | `Home.tsx` | ativo só em desktop/com motion |
| Pin da assistência (~285vh, 5 passos por scroll) | `StickyAssistance.tsx` | **experimental**: só desktop + motion ligado |
| Auto-rotate das marcas (4,5s, pausa fora da viewport) | `BrandsExperience.tsx` | ativo com motion |
| Transições/hover CSS | `index.css` | sempre (não escondem conteúdo) |

Desligar tudo: `VITE_MOTION_ENABLED=false` (dev ou build) — ou o usuário com
`prefers-reduced-motion: reduce`. Com a flag desligada: sem pin (assistência
empilhada), hero estático, sem auto-rotate, e todo o resto funcionando.

Mobile nunca usa o pin: a assistência é renderizada empilhada, com scroll nativo.

## Testes

```bash
npm test         # vitest + jsdom: renderização, filtros, carrinho→WhatsApp, PDP,
                 # persistência, trava de scroll dos overlays, mobile e motion-off
```

Os testes cobrem runtime (montagem, estado, localStorage, interações), não layout
visual — para o visual, conferir o preview em desktop e mobile.

## Deploy

É uma SPA: qualquer rota (`/produtos/:slug`, `/marcas/:slug`) precisa cair no `index.html`.

- **Netlify/Vercel:** já incluído `public/_redirects` (`/* /index.html 200`).
- **Nginx:** `try_files $uri /index.html;`
- **Servidor estático puro:** sirva `dist/` com o mesmo fallback.

## Histórico

O projeto nasceu do template Manus `web-db-user` (full-stack com tRPC/MySQL/OAuth). Como o site não
usa nenhuma função de backend, ele foi convertido em SPA estática: removidos `server/`, `shared/`,
`drizzle/`, OAuth e dependências de banco. A análise completa que motivou a migração está em
[`ANALISE.md`](./ANALISE.md).
