# PRD — Sprint sp-015: RecipeHub Landing Page

> **Sprint Code:** sp-015
> **Criado em:** 2025
> **Status:** ✅ Aprovado para Execução
> **Arquivo de Referência:** `architecture/plans/prd-sprint-sp-015.md`

---

## 1. Visão Geral & North Star

### Problema
O RecipeHub não possui presença na web. Não existe nenhuma URL pública que comunique o produto, capture leads ou apresente o valor da plataforma para visitantes orgânicos.

### Solução desta Sprint
Criar uma landing page estática e de alta performance usando **Astro** com **TailwindCSS puro**, deployada no **Cloudflare Pages**. A página é completamente hardcoded, sem JavaScript no bundle do cliente, com carregamento instantâneo e SEO-friendly por padrão.

### Definition of Done (North Star)
A sprint está 100% concluída quando:
- A URL pública do Cloudflare Pages retorna `HTTP 200` com a landing page renderizada
- A página exibe: Hero section com título e CTA, grid com exatamente 6 cards de receitas e formulário visual de newsletter
- O bundle de saída do `astro build` contém **zero kilobytes de JavaScript no cliente** (verificável via `dist/` ou Lighthouse)
- Responsividade funciona em mobile (≥ 375px) e desktop (≥ 1280px)

---

## 2. Esquema de Dados (SSoT — Fonte Única da Verdade)

### 2.1 Persistência

> **Nenhuma.** Esta sprint não utiliza D1, R2, KV ou Queues. Toda a informação é estática e hardcoded no código-fonte.

### 2.2 Estrutura de Diretórios do Projeto

Projeto **Astro standalone** (sem Turborepo nesta sprint). Estrutura esperada após `pnpm create astro`:

```
recipehub-web/          ← root do projeto standalone
├── public/
│   └── images/
│       └── placeholder-card.jpg   ← imagem única reutilizada nos 6 cards
├── src/
│   ├── components/
│   │   ├── Hero.astro
│   │   ├── RecipeCard.astro
│   │   ├── RecipeGrid.astro
│   │   └── NewsletterForm.astro
│   ├── data/
│   │   └── recipes.ts             ← array hardcoded com as 6 receitas
│   ├── layouts/
│   │   └── BaseLayout.astro       ← HTML shell com <head>, meta tags e TailwindCSS
│   └── pages/
│       └── index.astro            ← única rota da sprint (/)
├── astro.config.mjs
├── package.json
├── tailwind.config.mjs
├── tsconfig.json
└── wrangler.toml                  ← configuração para Cloudflare Pages
```

### 2.3 Data Shape — Array de Receitas (hardcoded)

Arquivo: `src/data/recipes.ts`

```typescript
export interface Recipe {
  id: string;           // ex: \"001\"
  title: string;        // ex: \"Risoto de Cogumelos\"
  prepTime: number;     // em minutos, ex: 30
  prepTimeLabel: string; // ex: \"30 min\"
  category: string;     // ex: \"Prato Principal\"
  imageSrc: string;     // ex: \"/images/placeholder-card.jpg\"
  imageAlt: string;     // ex: \"Imagem de Risoto de Cogumelos\"
}

export const recipes: Recipe[] = [
  {
    id: \"001\",
    title: \"Risoto de Cogumelos\",
    prepTime: 40,
    prepTimeLabel: \"40 min\",
    category: \"Prato Principal\",
    imageSrc: \"/images/placeholder-card.jpg\",
    imageAlt: \"Risoto de Cogumelos cremoso\",
  },
  {
    id: \"002\",
    title: \"Bolo de Cenoura\",
    prepTime: 50,
    prepTimeLabel: \"50 min\",
    category: \"Sobremesa\",
    imageSrc: \"/images/placeholder-card.jpg\",
    imageAlt: \"Bolo de Cenoura com cobertura de chocolate\",
  },
  {
    id: \"003\",
    title: \"Salada Caesar\",
    prepTime: 15,
    prepTimeLabel: \"15 min\",
    category: \"Entrada\",
    imageSrc: \"/images/placeholder-card.jpg\",
    imageAlt: \"Salada Caesar com croutons\",
  },
  {
    id: \"004\",
    title: \"Frango Grelhado\",
    prepTime: 25,
    prepTimeLabel: \"25 min\",
    category: \"Prato Principal\",
    imageSrc: \"/images/placeholder-card.jpg\",
    imageAlt: \"Frango Grelhado com ervas\",
  },
  {
    id: \"005\",
    title: \"Sopa de Abóbora\",
    prepTime: 35,
    prepTimeLabel: \"35 min\",
    category: \"Entrada\",
    imageSrc: \"/images/placeholder-card.jpg\",
    imageAlt: \"Sopa de Abóbora cremosa\",
  },
  {
    id: \"006\",
    title: \"Brownie de Chocolate\",
    prepTime: 45,
    prepTimeLabel: \"45 min\",
    category: \"Sobremesa\",
    imageSrc: \"/images/placeholder-card.jpg\",
    imageAlt: \"Brownie de Chocolate fudgy\",
  },
];
```

### 2.4 Paleta de Cores (TailwindCSS)

| Token | Valor | Uso |
|---|---|---|
| Fundo principal | `white` / `gray-50` | Background da página |
| Texto primário | `gray-900` | Títulos |
| Texto secundário | `gray-500` | Metadados (tempo, categoria) |
| Accent / CTA | `green-500` → `#22c55e` | Botões, bordas de destaque |
| Hover CTA | `green-600` | Estado hover dos botões |
| Borda de card | `gray-200` | Cards de receita |
| Sombra de card | `shadow-sm` | Cards de receita |

> **Nota:** `green-500` no Tailwind CSS padrão equivale a `#22c55e`. Nenhuma customização do `tailwind.config.mjs` é necessária.

---

## 3. Histórias de Usuário & Matriz do Avaliador

### US-001: Hero Section

**Descrição:** Como visitante da landing page, eu quero ver uma seção hero impactante com o título do produto, subtítulo e CTA bem visível, para que eu entenda o valor do RecipeHub em menos de 3 segundos.

**Matriz de Teste do Avaliador:**

- [ ] **Visual:** A seção hero ocupa pelo menos 60vh no desktop e exibe: título principal (h1), subtítulo descritivo e botão CTA verde (`bg-green-500`)
- [ ] **Markup:** O título é um `<h1>` único na página (SEO)
- [ ] **Zero JS:** O bundle `dist/` não contém arquivos `.js` referenciados no `<head>` ou `<body>` da rota `/`
- [ ] **Responsividade:** Em viewport 375px, o hero empilha verticalmente sem overflow horizontal
- [ ] **Acessibilidade:** O botão CTA possui texto descritivo (não apenas \"Clique aqui\")

---

### US-002: Grid de 6 Cards de Receitas

**Descrição:** Como visitante, eu quero ver uma grade de 6 receitas com imagem, título e tempo de preparo, para que eu tenha uma prévia do tipo de conteúdo disponível no RecipeHub.

**Matriz de Teste do Avaliador:**

- [ ] **Contagem:** Exatamente 6 cards são renderizados no DOM (verificável via DevTools → `document.querySelectorAll('[data-recipe-card]').length === 6`)
- [ ] **Conteúdo:** Cada card exibe: imagem placeholder (`<img>` com `alt` preenchido), título da receita e badge de tempo de preparo (ex: \"30 min\")
- [ ] **Layout Desktop:** Grid de 3 colunas em viewport ≥ 1280px (`grid-cols-3`)
- [ ] **Layout Tablet:** Grid de 2 colunas em viewport ≥ 768px (`grid-cols-2`)
- [ ] **Layout Mobile:** Grid de 1 coluna em viewport ≥ 375px (`grid-cols-1`)
- [ ] **Imagem:** Todas as imagens possuem `loading=\"lazy\"` e dimensões explícitas (`width` e `height`) para evitar layout shift (CLS = 0)
- [ ] **Zero JS:** Os cards são renderizados estaticamente — nenhum fetch ou hydration ocorre no cliente

---

### US-003: Formulário Visual de Newsletter

**Descrição:** Como visitante, eu quero ver um formulário de newsletter com campo de e-mail e botão de inscrição, para que eu sinta que posso me conectar ao RecipeHub (mesmo que o envio não seja funcional nesta sprint).

**Matriz de Teste do Avaliador:**

- [ ] **Markup:** O formulário contém `<input type=\"email\">` com `placeholder` e `<button type=\"submit\">`
- [ ] **Visual:** Seção com fundo distinto (ex: `bg-gray-50`) que a diferencia visualmente do grid de cards
- [ ] **Sem action real:** O atributo `action` do `<form>` está ausente ou aponta para `#` — nenhum dado é enviado
- [ ] **Sem JS:** Nenhum event listener ou script de validação existe no bundle do cliente
- [ ] **Acessibilidade:** O `<input>` possui `<label>` associada ou `aria-label` descritivo
- [ ] **Responsividade:** Em mobile, o campo e o botão empilham verticalmente (flex-col) sem overflow

---

### US-004: Deploy no Cloudflare Pages

**Descrição:** Como engenheiro responsável, eu quero que a landing page esteja acessível via URL pública do Cloudflare Pages, para que o Definition of Done da sprint seja atingido.

**Matriz de Teste do Avaliador:**

- [ ] **Build:** `pnpm run build` executa sem erros e gera a pasta `dist/`
- [ ] **Configuração:** `wrangler.toml` (ou `pages.json`) aponta `pages_build_output_dir = \"dist\"` e o adapter do Astro é `@astrojs/cloudflare` configurado com `output: 'static'`
- [ ] **Deploy:** URL pública do Cloudflare Pages retorna `HTTP 200`
- [ ] **Zero JS verificado:** Lighthouse ou inspeção manual do `dist/index.html` confirma ausência de `<script>` tags com JavaScript de aplicação
- [ ] **Assets:** Imagem placeholder é servida corretamente via URL pública (`/images/placeholder-card.jpg`)

---

## 4. Requisitos Funcionais (FR)

### MUST HAVE (Obrigatório para DoD)

**REQ-001** `[MUST]` O projeto deve ser inicializado como um app **Astro standalone** (sem Turborepo) usando `pnpm create astro`, com a integração `@astrojs/tailwind` e adapter `@astrojs/cloudflare` instalados.

**REQ-002** `[MUST]` O arquivo `astro.config.mjs` deve configurar `output: 'static'` para garantir geração de HTML estático puro, sem SSR.

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'static',
  adapter: cloudflare(),
  integrations: [tailwind()],
});
```

**REQ-003** `[MUST]` A única rota da sprint é `src/pages/index.astro`. Nenhuma outra rota deve ser criada.

**REQ-004** `[MUST]` O bundle de saída (`dist/`) deve conter **zero JavaScript de aplicação** no cliente. Verificar ausência de tags `<script>` com código de aplicação no HTML gerado. Scripts de terceiros injetados pelo Cloudflare (ex: analytics) estão fora do controle desta sprint.

**REQ-005** `[MUST]` O componente `Hero.astro` deve renderizar:
- Um `<h1>` com o nome/tagline do RecipeHub
- Um parágrafo `<p>` com subtítulo descritivo
- Um `<a>` (link âncora para `#receitas`) estilizado como botão com `bg-green-500 hover:bg-green-600 text-white`

**REQ-006** `[MUST]` O componente `RecipeCard.astro` deve aceitar uma `Recipe` como prop e renderizar: `<img>` com `loading=\"lazy\"`, título em `<h3>` e badge de tempo de preparo. Cada card deve ter o atributo `data-recipe-card` para facilitar testes.

**REQ-007** `[MUST]` O componente `RecipeGrid.astro` deve importar o array `recipes` de `src/data/recipes.ts` e iterar sobre ele com `Astro.props` ou diretamente no template, renderizando exatamente 6 `<RecipeCard>` components. A grid deve usar classes Tailwind: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`.

**REQ-008** `[MUST]` O componente `NewsletterForm.astro` deve renderizar um `<form>` com `<label>`, `<input type=\"email\">` e `<button type=\"submit\">`. O form NÃO deve ter atributo `action` apontando para um endpoint real. Nenhum `<script>` deve ser adicionado neste componente.

**REQ-009** `[MUST]` O arquivo `BaseLayout.astro` deve incluir as meta tags essenciais de SEO no `<head>`: `<title>`, `<meta name=\"description\">`, `<meta charset>`, `<meta name=\"viewport\">`.

**REQ-010** `[MUST]` Uma imagem placeholder deve existir em `public/images/placeholder-card.jpg` (pode ser qualquer imagem genérica de comida, dimensões recomendadas: 600×400px). Todos os 6 cards reutilizam esta mesma imagem.

**REQ-011** `[MUST]` O arquivo `wrangler.toml` deve estar configurado para Cloudflare Pages com `pages_build_output_dir = \"dist\"`.

### SHOULD HAVE (Fortemente Recomendado)

**REQ-012** `[SHOULD]` O `tsconfig.json` deve usar `\"strict\": true` para garantir tipagem segura no array de receitas e props dos componentes.

**REQ-013** `[SHOULD]` O `<img>` de cada card deve ter atributos `width` e `height` explícitos (ex: `width=\"600\" height=\"400\"`) para evitar Cumulative Layout Shift (CLS).

**REQ-014** `[SHOULD]` A seção de newsletter deve ter um `id` ou fundo visualmente distinto (`bg-gray-50` ou similar) para separação visual clara das seções.

**REQ-015** `[SHOULD]` O `package.json` deve incluir os scripts: `\"dev\": \"astro dev\"`, `\"build\": \"astro build\"`, `\"preview\": \"astro preview\"`.

### COULD HAVE (Opcional, se sobrar tempo)

**REQ-016** `[COULD]` Adicionar um `<footer>` simples com copyright (ex: `© 2025 RecipeHub`) na `BaseLayout.astro`.

**REQ-017** `[COULD]` Adicionar uma `<nav>` mínima no topo com o logo/nome do RecipeHub, sem links externos.

---

## 5. Fora do Escopo (Non-Goals)

Os itens abaixo são **EXPLICITAMENTE PROIBIDOS** nesta sprint. Qualquer implementação destes itens representa scope creep e deve ser rejeitada na revisão de código:

| Item | Justificativa |
|---|---|
| Autenticação / Login / Área logada | Sprint dedicada futura |
| Páginas internas de receitas (`/receitas/[slug]`) | Fora do escopo desta sprint |
| Integração real do formulário de newsletter (Resend, Mailchimp, etc.) | Sprint de integrações futura |
| CMS (Contentful, Sanity, Notion API, etc.) | Conteúdo é hardcoded nesta sprint |
| Busca ou filtros de receitas | Funcionalidade de produto futura |
| Animações (Framer Motion, CSS transitions complexas) | Não solicitado |
| Dark mode | Não solicitado |
| Internacionalização (i18n) | Não solicitado |
| React, TanStack Query ou qualquer framework de UI reativo | Zero JS no cliente — sem hydration |
| D1, R2, KV, Queues (qualquer binding Cloudflare) | Nenhuma persistência nesta sprint |
| Testes automatizados (Vitest, Playwright) | Fora do escopo desta sprint |
| Turborepo / pnpm workspaces / monorepo | App standalone nesta sprint |
| Múltiplas imagens de cards (imagens reais de receitas) | Placeholder único para todos os 6 cards |

---

## 6. Cloudflare Bindings & Integrações

### Bindings Cloudflare

> **Nenhum.** Esta sprint não utiliza D1, R2, KV, Queues ou qualquer outro binding Cloudflare. A página é 100% estática.

### APIs Externas

> **Nenhuma.** Nenhuma chave de API, token de autenticação ou variável de ambiente é necessária para esta sprint.

### Plataforma de Deploy

| Serviço | Uso | Configuração |
|---|---|---|
| **Cloudflare Pages** | Hosting da landing page estática | `wrangler.toml` com `pages_build_output_dir = \"dist\"` |

### Variáveis de Ambiente

> **Nenhuma variável de ambiente é necessária** para build ou runtime desta sprint.

---

## 7. Restrições & Casos Limite

### Restrições Técnicas

**RT-1: Zero JavaScript no Cliente (Hard Constraint)**
- Nenhum componente Astro deve usar a diretiva `client:*` (ex: `client:load`, `client:idle`, `client:visible`)
- Nenhum `<script>` inline deve ser adicionado em nenhum componente
- O uso de React, Vue, Svelte ou qualquer framework de UI é PROIBIDO nesta sprint
- Verificação: `grep -r \"client:\" src/` deve retornar vazio; `grep -r \"<script\" src/` deve retornar vazio

**RT-2: Astro Static Output**
- `output: 'static'` em `astro.config.mjs` é obrigatório — não use `'server'` ou `'hybrid'`
- O adapter `@astrojs/cloudflare` deve ser configurado para output estático

**RT-3: Compatibilidade de Imagem**
- Não use `<Image />` do pacote `astro:assets` com transformações dinâmicas — use `<img>` HTML nativo para máxima compatibilidade com deploy estático
- A imagem placeholder deve ser commitada em `public/images/` (não em `src/assets/`)

**RT-4: Responsividade**
- Breakpoints obrigatórios: mobile ≥ 375px, tablet ≥ 768px, desktop ≥ 1280px
- Usar exclusivamente breakpoints nativos do Tailwind (`sm:`, `md:`, `lg:`)
- Nenhuma media query manual em `<style>` tags

### Casos Limite

**CL-1:** Se o `astro build` emitir warnings sobre JS sendo incluído no bundle, investigar qual componente está causando hydration e remover a diretiva `client:*`.

**CL-2:** Se o Cloudflare Pages rejeitar o deploy por incompatibilidade do adapter, verificar a versão do `@astrojs/cloudflare` — usar a versão compatível com `output: 'static'` (consultar documentação oficial em `https://docs.astro.build/en/guides/deploy/cloudflare/`).

**CL-3:** O formulário de newsletter não deve exibir mensagens de erro ou sucesso ao ser \"submetido\" — como não há `action` real, o comportamento padrão do browser (reload ou noop) é aceitável nesta sprint.

**CL-4:** Se a imagem placeholder não estiver disponível no servidor de staging, o layout não deve quebrar — garantir que `public/images/placeholder-card.jpg` esteja commitado no repositório.

---

## 8. Checklist de Execução (Para o Agente Executor)

Este checklist deve ser seguido na ordem apresentada:

- [ ] **[Ref: REQ-001]** Scaffoldar projeto com `pnpm create astro` e instalar `@astrojs/tailwind` e `@astrojs/cloudflare`
- [ ] **[Ref: REQ-002]** Configurar `astro.config.mjs` com `output: 'static'`, adapter Cloudflare e integração Tailwind
- [ ] **[Ref: REQ-012]** Configurar `tsconfig.json` com `\"strict\": true`
- [ ] **[Ref: REQ-015]** Verificar scripts `dev`, `build` e `preview` no `package.json`
- [ ] **[Ref: REQ-010]** Adicionar imagem placeholder em `public/images/placeholder-card.jpg`
- [ ] **[Ref: REQ-003]** Criar `src/data/recipes.ts` com o array hardcoded de 6 receitas (usar o shape definido na Seção 2.3)
- [ ] **[Ref: REQ-009]** Criar `src/layouts/BaseLayout.astro` com `<head>` completo (charset, viewport, title, description)
- [ ] **[Ref: REQ-005]** Criar `src/components/Hero.astro` com h1, subtítulo e botão CTA verde (`bg-green-500`)
- [ ] **[Ref: REQ-006]** Criar `src/components/RecipeCard.astro` com prop `recipe: Recipe`, img lazy, h3 e badge de tempo
- [ ] **[Ref: REQ-007]** Criar `src/components/RecipeGrid.astro` importando `recipes` e iterando com `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- [ ] **[Ref: REQ-008]** Criar `src/components/NewsletterForm.astro` com label, input[type=email] e button[type=submit] — sem action real, sem script
- [ ] **[Ref: REQ-003]** Criar `src/pages/index.astro` compondo Hero + RecipeGrid + NewsletterForm dentro do BaseLayout
- [ ] **[Ref: REQ-011]** Configurar `wrangler.toml` com `pages_build_output_dir = \"dist\"`
- [ ] **[Ref: REQ-004]** Executar `pnpm run build` e verificar `dist/index.html` — confirmar ausência de `<script>` de aplicação
- [ ] **[US-004]** Deploy via `wrangler pages deploy dist/` ou pipeline CI do Cloudflare Pages
- [ ] **[DoD]** Verificar URL pública retornando `HTTP 200` com todos os elementos visíveis

---

## Apêndice: Estrutura de Componentes (Referência Visual)

```
index.astro
└── BaseLayout.astro
    ├── <head> (meta tags SEO)
    ├── Hero.astro
    │   ├── <h1> Título do RecipeHub
    │   ├── <p> Subtítulo
    │   └── <a href=\"#receitas\"> Botão CTA verde
    ├── RecipeGrid.astro (id=\"receitas\")
    │   └── RecipeCard.astro × 6
    │       ├── <img loading=\"lazy\" width=\"600\" height=\"400\">
    │       ├── <h3> Título da Receita
    │       └── <span> Badge tempo de preparo
    └── NewsletterForm.astro
        ├── <h2> Título da seção
        ├── <label> + <input type=\"email\">
        └── <button type=\"submit\"> Botão verde
```
"}}
</tool_call>
<tool_response>
{"success":true,"path":"architecture/plans/prd-sprint-sp-015.md","bytes":12891}
</tool_response>

<tool_call>
{"name": "complete_phase", "parameters": {"summary": "PRD sp-015 gerado: landing page Astro standalone, zero JS no cliente, 4 User Stories (Hero, RecipeGrid 6 cards, NewsletterForm visual, deploy Cloudflare Pages), 17 requisitos priorizados (MUST/SHOULD/COULD), sem bindings, sem variáveis de ambiente, Non-Goals explícitos (auth, CMS, integrações, Turborepo)."}}
</tool_call>
<tool_response>
{"success":true}
</tool_response>

## Resumo Executivo — Sprint sp-015

**Escopo:** Landing page Astro standalone (`/` apenas) com Hero section, grid de 6 cards hardcoded e formulário de newsletter visual. App isolado, sem Turborepo.

**Data Model:** Nenhum. Tudo hardcoded em `src/data/recipes.ts` com o tipo `Recipe` (id, title, prepTime, category, imageSrc, imageAlt). Zero D1, R2, KV ou Queues.

**Integrações:** Nenhuma API externa, nenhuma variável de ambiente. Único serviço: Cloudflare Pages para deploy estático.

**Constraint crítico:** `output: 'static'` obrigatório no `astro.config.mjs` — zero diretivas `client:*`, zero `<script>` no bundle. Verificável via `grep -r "client:" src/`.

**Non-Goals explícitos:** Auth, páginas de receita individuais, integração real do newsletter, CMS, busca/filtros, animações, dark mode, Turborepo, React/TanStack Query.

---

O PRD foi salvo em `architecture/plans/prd-sprint-sp-015.md` (12.8 KB) com 4 User Stories, 17 requisitos com IDs únicos (REQ-001 a REQ-017) e checklist de execução ordenado para o agente executor.