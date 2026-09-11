# Análise do site Limaq — estado atual

Data: 11/09/2026 · Branch: `arena/01a09167-site-liquid` · Commit analisado: `d12e420` ("Add files via upload", único commit)

---

## 1. Resumo executivo

O repositório contém o **site institucional + catálogo da Limaq** (assistência técnica e venda de
equipamentos profissionais para food service, Belém/PA, desde 1987), construído sobre o template
Manus `web-db-user` (React 19 + Vite 7 + Tailwind 4 + tRPC/Drizzle/MySQL).

- **Front-end autoral:** ~2.000 linhas de código específico do site (Home, ProductDetail,
  BrandResults, 4 componentes de seção, catálogo e 139 linhas de CSS de design system).
- **Qualidade visual/interação:** alta. Identidade coerente, responsivo tratado, interações
  scroll-driven bem implementadas.
- **Estado de execução:** ❌ **o projeto não instala, não builda e não roda.** O commit foi feito
  "achatado" (upload de arquivos sem a estrutura de pastas) e partes do template foram perdidas.
- **Conteúdo:** catálogo com apenas 6 produtos, números de categoria fictícios e alguns furos de
  conversão.

Total de imports quebrados detectados por varredura estática: **12**.

---

## 2. Inventário do que já existe

### Rotas (`src/App.tsx`)
| Rota | Página | Status |
|---|---|---|
| `/` | `Home.tsx` (136 linhas) | completa |
| `/produtos/:slug` | `ProductDetail.tsx` | completa |
| `/marcas/:slug` | `BrandResults.tsx` | completa |
| `/404` + fallback | `NotFound.tsx` | genérica do template, em inglês |

### Seções da Home (ordem de render)
1. Topbar: "Atendimento técnico em Belém e região metropolitana • Seg a sex, 8h às 18h"
2. Header sticky: logo, nav (Produtos, Categorias, Marcas, Assistência, Sobre), busca, WhatsApp, carrinho com badge
3. Drawer de menu mobile
4. **Hero** com parallax de mouse, tags técnicas (220V / INOX / ALTA PERFORMANCE), stats (35 marcas, 1987, 01 equipe técnica)
5. **ServiceCarousel** — 5 serviços (Equipamentos, Assistência técnica, Peças, Instalação, Manutenção), drag + snap + dots
6. **Categorias** — 4 cards (Cocção 42, Refrigeração 28, Panificação 19, Bancada 36)
7. **SolutionsStack** — 6 painéis sticky por segmento (Restaurantes, Pizzarias, Padarias, Supermercados, Cafeterias, Hotéis)
8. **Produtos em destaque** — rail horizontal com filtro por marca e por faixa de preço, botão add-to-cart
9. **Assistência (`#assistencia`)** — formulário que abre WhatsApp com mensagem pré-preenchida
10. **StickyAssistance** — 5 passos (Diagnóstico, Manutenção, Instalação, Peças, Suporte) controlados por scroll, 285vh
11. **BrandsExperience (`#marcas`)** — 35 marcas com logo, categoria e descrição; grid editorial 12 colunas, auto-rotate a cada 4,5s, filtros por categoria, link para `/marcas/:slug`
12. **História (`#historia`)** — fundação em 10/02/1987 por Antonio Augusto (engenheiro mecânico) e Laudicéia, 2ª geração, 20+ anos de Bosch
13. **Footer (`#contato`)** — contato, redes, horários, e-mails
14. Modais: busca full-screen, carrinho lateral, formulário de orçamento

### Conversão (tudo converge para WhatsApp `5591988799884`)
- Formulário de **ordem de serviço** (nome, telefone, marca, modelo, problema)
- Formulário de **orçamento** (nome, empresa, WhatsApp, cidade, equipamento)
- Botão de **orçamento por produto** (marca, nome, modelo, quantidade) na ProductDetail
- Links diretos `wa.me` no header, menu mobile, seções e rodapé

### Design system (`src/index.css`)
- Cores: navy `#142b3a`, âmbar `#f1a51b`, verde WhatsApp `#128c68`, fundo `#f6f7f8`, texto `#17212b`
- Tipografia: Manrope (texto/títulos) + DM Mono (eyebrows/números), via Google Fonts
- Classes autorais: `.container`, `.eyebrow`, `.section-title`, `.nav-link`, `.button-primary/-ghost`,
  `.link-arrow`, `.product-card`, `.category-card`, `.brand-tile`, `.solution-panel`, `.sticky-assistance`, `.hero-depth*`
- Breakpoints 768px e 640px + `prefers-reduced-motion` respeitado

### Dados (`src/lib/catalog.ts`)
6 produtos hard-coded: Prática Fit Express FEX-4, Skymsen PA-7L, Everest ECO 100, G.Paniz AM-15,
Hobart HS-9, Everest EGE-120 — todos com `priceLabel: "Consulte"`, specs e galeria.

### Herança do template **não utilizada** pelo site
`AIChatBox`, `DashboardLayout(+Skeleton)`, `ManusDialog`, `Map`, `ComponentShowcase` (fora do roteador),
`useAuth`, `ThemeContext` (fixo em light), 50+ componentes `shadcn/ui`, cliente tRPC, OAuth Manus,
Drizzle/MySQL, S3 (`storage.ts`), `relations.ts` vazio, `0000_clean_malcolm_colcord.sql`,
`vite.config.ts.bak`, `template.json`.

---

## 3. Bloqueadores críticos (por que nada roda hoje)

| # | Problema | Evidência | Impacto |
|---|---|---|---|
| 1 | **Estrutura de pastas achatada** | `vite.config.ts` define `root: client/`, `publicDir: client/public`, alias `@ → client/src`; `tsconfig.json` inclui `client/src/**`, `shared/**`, `server/**`; `vitest.config.ts` inclui `server/**/*.test.ts`. Na prática tudo está na raiz (`src/`, `db.ts`, `schema.ts`…) | `pnpm dev`, `build`, `check` e `test` falham imediatamente |
| 2 | **`shared/const.ts` ausente** | importado por `src/main.tsx` (`COOKIE_NAME`, `UNAUTHED_ERR_MSG`) e `src/const.ts` (`OAUTH_STATE_COOKIE`, `encodeOAuthState`) | o app não faz boot nem como SPA |
| 3 | **`server/_core/*` ausente** | `routers.ts` → `./_core/{cookies,systemRouter,trpc}`; `db.ts` e `storage.ts` → `./_core/env`; `auth.logout.test.ts` → `./_core/context`; script `dev` aponta `server/_core/index.ts` | backend inexistente; build esbuild falha |
| 4 | **Patch do wouter fora do lugar** | `package.json` → `"wouter@3.7.1": "patches/wouter@3.7.1.patch"`, mas o arquivo está em `./wouter@3.7.1.patch` | `pnpm install` aborta antes de qualquer coisa |
| 5 | **Imagens de produto inexistentes** | 7 assets `/manus-storage/*` referenciados (combi-oven, commercial-refrigeration, dough-mixer, food-processor, fryer, ice-maker, meat-slicer); `public/` só tem `__manus__/` | hero, categorias, rail, carousel e assistência sem imagem |

Observação adicional: `src/lib/trpc.ts` importa `../../../server/routers` — com a estrutura achatada
isso resolve para **fora do repositório** (`/home/user/server/routers`).

---

## 4. Problemas de conteúdo e consistência

1. **Contagens fictícias:** os cards de categoria anunciam 42 + 28 + 19 + 36 = **125 produtos**, mas o
   catálogo tem **6**. Ou vira decoração enganosa, ou o catálogo precisa crescer.
2. **Categorias órfãs:** os produtos "Açougue" (Hobart HS-9) e "Máquinas de gelo" (Everest EGE-120) não
   existem em `categories` nem em `categoryIcons` → ficam fora da navegação por aplicação.
3. **Filtro de marca sem empty state:** o dropdown da Home lista 8 marcas, mas só 5 têm produto.
   Escolher RATIONAL, VENÂNCIO ou GASTROMAQ deixa o rail **em branco, sem mensagem**.
4. **Filtros de marca quebrados na seção Marcas:** os chips incluem "Açougue" e "Gelo", categorias que
   **nenhuma marca usa** → grid vazio, contador mostra `00 / 00` e o destaque lateral cai em
   "Bras Sulamericana" (que não pertence ao filtro).
5. **Filtro de preço invisível:** filtra "Até R$ 10 mil / Acima de R$ 10 mil", mas nenhum preço é
   exibido (`priceLabel: "Consulte"`).
6. **Galeria duplicada:** `gallery()` repete a mesma imagem 3× (os sufixos `&sat=-20` / `&con=10` só
   fariam sentido num serviço externo de imagem) → thumbs idênticos na ProductDetail.
7. **E-mail suspeito:** `assistecnica@limaq.net` no rodapé — provável typo de `assistencia@`.
8. **404 fora do padrão:** em inglês, com Card/Button azuis do template. Quebra idioma e identidade.
9. **SEO incompleto:** title/OG/description fixos no `index.html`; nada específico por rota de produto
   ou marca; sem `sitemap.xml`, `robots.txt`, canonical ou JSON-LD (`LocalBusiness` / `Product`).
   Os placeholders `%VITE_ANALYTICS_ENDPOINT%` só são substituídos pelo runtime Manus — em deploy
   próprio viram URL inválida no `<script>` do Umami.
10. **Dependência de CDN de terceiros:** logo, foto do fundador e os **35 logos de marca** são
    hotlinked do `images.squarespace-cdn.com`. Se aquele Squarespace sair do ar ou bloquear hotlink, o
    site perde a identidade. As imagens não têm `width`/`height` → risco de CLS.
    *(No sandbox o domínio nem responde — SSL handshake falhou.)*

---

## 5. UX, performance e código

1. **Carrinho perde os itens no orçamento** *(maior furo de conversão)*: o botão "Solicitar orçamento"
   fecha o carrinho e abre o modal, mas o texto enviado ao WhatsApp **não inclui os produtos
   selecionados** — só nome, empresa, telefone, cidade e equipamento.
2. **Carrinho volátil:** estado só em memória; recarregar ou ir para `/produtos/:slug` zera a seleção.
   (E o botão "Carrinho" da ProductDetail apenas navega para `/`.)
3. **Parallax caro:** `onMouseMove` do hero chama `setState` → re-render da Home inteira (rail de
   produtos + grid de 35 marcas) a cada movimento de mouse.
4. **Auto-rotate permanente:** `setInterval` de 4,5s em `BrandsExperience` re-renderiza os 35 tiles
   continuamente, mesmo com a seção fora da viewport e sem checar `prefers-reduced-motion`.
5. **Bloco de rolagem longo:** `StickyAssistance` ocupa 285vh (330vh no mobile) entre o formulário de
   assistência e a seção de marcas — no celular são ~5 telas obrigatórias.
6. **Estilo morto:** a imagem do `.product-card` no rail tem `group-hover:scale-105`, mas o `<article>`
   não tem a classe `group` → o efeito nunca dispara.
7. **Navegação só por âncoras:** o header da Home usa `<a href="#...">` em vez de `Link`; ProductDetail
   e BrandResults reimplementam um header próprio, sem busca nem carrinho funcionais.
8. **Imports não usados** em `Home.tsx`: `ChevronDown`, `Filter`, `Minus`, `Package`, `Sparkles`,
   `Star`, `UserRound`.
9. **Arquivos mortos do template** na raiz: `relations.ts`, `template.json`, `vite.config.ts.bak`,
   `0000_clean_malcolm_colcord.sql`, `drizzle.config.ts`, `db.ts`, `storage.ts`, `routers.ts`,
   `auth.logout.test.ts`, `src/pages/ComponentShowcase.tsx`.
10. **Metadados do projeto:** `README.md` tem uma linha (`# site-liquid`) e o package chama `limaq-2`.

---

## 6. O que está bom e deve ser preservado

- Identidade visual e tom de voz consistentes ("a operação não pode parar"), navy + âmbar + verde.
- Estratégia de conversão 100% WhatsApp com mensagem contextual pré-preenchida — adequada ao negócio e
  sem necessidade de backend.
- Componentes autorais bem resolvidos: stack sticky, carousel com drag/snap, grid editorial de marcas
  com hover coletivo (`:has()`), hero com profundidade e clip-path.
- Conteúdo institucional real (história, fundadores, 35 marcas com logo/categoria/descrição).
- Responsivo com media queries específicas e `prefers-reduced-motion`.
- Tipografia e microtipografia (eyebrows monoespaçadas, números tabulares) bem aplicadas.

---

## 7. Plano sugerido, por prioridade

**Fase 0 — Fazer rodar.** Duas rotas possíveis:
- **(A) SPA estático** *(recomendado)*: mover `src/` e `public/` para a raiz esperada pelo Vite,
  remover tRPC/OAuth/DB do boot (`main.tsx`, `const.ts`, `lib/trpc.ts`), simplificar `vite.config.ts`
  e `package.json`. O site não usa nenhuma função de backend hoje.
- **(B) Restaurar o template full-stack**: recriar `client/`, `server/_core/*`, `shared/const.ts`,
  `drizzle/schema.ts`, mover o patch para `patches/`. Só vale se houver plano real de login/DB/pedidos.

**Fase 1 — Assets.** Localizar as 7 imagens de produto e os 35 logos em `public/`, com `width`/`height`,
lazy loading e fallback; baixar logo e foto do fundador do Squarespace.

**Fase 2 — Conversão.** Carrinho persistido (localStorage) + itens na mensagem do WhatsApp; empty states
nos filtros; alinhar contagens de categoria ao catálogo real (ou remover os números).

**Fase 3 — SEO e acabamento.** Título/descrição por rota, `sitemap.xml`, `robots.txt`, JSON-LD
`LocalBusiness`, 404 em PT-BR com a identidade, corrigir `assistecnica@`, remover código morto,
renomear o pacote e escrever o README.

**Fase 4 — Performance.** Parallax via `requestAnimationFrame`/CSS sem setState global; pausar o
auto-rotate com `IntersectionObserver`; considerar reduzir a altura do StickyAssistance no mobile.
