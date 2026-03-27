# PRD — Sprint sp-021: RecipeHub Landing Page Estática

**Sprint Code:** sp-021
**Fase:** Blueprint → Execução
**Última Atualização:** 2025-01
**Status:** Aprovado para Execução

---

## 1. Visão Geral & North Star

### Problema
O RecipeHub não possui presença pública na web. Não existe uma landing page que comunique o valor do produto, exiba receitas de forma atraente ou capture interesse de visitantes.

### Solução
Criar uma landing page estática de alta performance hospedada no Cloudflare Pages, construída com Astro + TailwindCSS. A página deve carregar com **zero JavaScript no cliente**, HTML/CSS puro gerado em build time, e apresentar as 3 seções core: Hero, Grid de Receitas e Newsletter visual.

### Critério de Conclusão (Definition of Done)
A Sprint está **concluída** quando:
1. `astro build` roda sem erros e gera output HTML/CSS puro
2. A URL pública no Cloudflare Pages carrega as 3 seções sem erros
3. DevTools confirma **zero JS** carregado no cliente (`<is:inline>` proibido, sem `<script>` tags)
4. As 3 seções estão visíveis e responsivas (mobile + desktop)
5. Meta tags de SEO estático estão presentes no `<head>` (title, description, OG image)

---

## 2. Esquema de Dados (SSoT — Fonte Única da Verdade)

### 2.1 Localização no Monorepo

Esta Sprint cria um novo workspace Astro no monorepo:

```
apps/
└── web/                        ← NOVO workspace desta sprint
    ├── src/
    │   ├── data/
    │   │   └── recipes.ts      ← Array tipado de receitas (SSoT dos cards)
    │   ├── components/
    │   │   ├── Hero.astro
    │   │   ├── RecipeCard.astro
    │   │   ├── RecipeGrid.astro
    │   │   └── NewsletterForm.astro
    │   ├── layouts/
    │   │   └── BaseLayout.astro ← <head> com meta tags SEO
    │   └── pages/
    │       └── index.astro      ← Entrypoint da landing page
    ├── public/
    │   └── og-image.jpg         ← OG image estática (1200x630px)
    ├── astro.config.mjs
    ├── tailwind.config.mjs
    ├── tsconfig.json
    └── package.json
```

> **Nota Monorepo:** `apps/web` é adicionado ao `pnpm-workspace.yaml` raiz. O `turbo.json` raiz deve incluir o pipeline de build para `web`.

### 2.2 Tipo TypeScript — Recipe

Arquivo: `apps/web/src/data/recipes.ts`

```typescript
export interface Recipe {
  id: number;
  title: string;
  prepTime: string;    // ex: "30 min"
  imageUrl: string;    // URL absoluta para placeholder
  category: string;    // ex: "Massas", "Saladas", "Sobremesas"
}

export const recipes: Recipe[] = [
  {
    id: 1,
    title: "Espaguete ao Pomodoro",
    prepTime: "25 min",
    imageUrl: "https://picsum.photos/seed/recipe1/600/400",
    category: "Massas",
  },
  {
    id: 2,
    title: "Risoto de Cogumelos",
    prepTime: "40 min",
    imageUrl: "https://picsum.photos/seed/recipe2/600/400",
    category: "Arroz",
  },
  {
    id: 3,
    title: "Salada Mediterrânea",
    prepTime: "15 min",
    imageUrl: "https://picsum.photos/seed/recipe3/600/400",
    category: "Saladas",
  },
  {
    id: 4,
    title: "Frango ao Limão",
    prepTime: "35 min",
    imageUrl: "https://picsum.photos/seed/recipe4/600/400",
    category: "Aves",
  },
  {
    id: 5,
    title: "Brownie de Chocolate",
    prepTime: "45 min",
    imageUrl: "https://picsum.photos/seed/recipe5/600/400",
    category: "Sobremesas",
  },
  {
    id: 6,
    title: "Sopa de Abóbora",
    prepTime: "30 min",
    imageUrl: "https://picsum.photos/seed/recipe6/600/400",
    category: "Sopas",
  },
];
```

### 2.3 Paleta de Cores (Tokens TailwindCSS)

Configurar em `tailwind.config.mjs` dentro de `apps/web`:

```javascript
// tailwind.config.mjs
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          orange: "#C2612A",   // Laranja queimado
          tomato: "#B83232",   // Vermelho tomate
          cream: "#F5EFE6",    // Creme / off-white
          dark: "#2C1A0E",     // Texto principal (marrom escuro)
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
};
```

### 2.4 Meta Tags SEO (Estático)

Presentes no `<head>` do `BaseLayout.astro`:

```html
<title>RecipeHub — Receitas para Inspirar sua Cozinha</title>
<meta name="description" content="Descubra receitas deliciosas e fáceis de preparar. Do café da manhã ao jantar, o RecipeHub tem a inspiração que você precisa." />
<meta property="og:title" content="RecipeHub — Receitas para Inspirar sua Cozinha" />
<meta property="og:description" content="Descubra receitas deliciosas e fáceis de preparar." />
<meta property="og:image" content="/og-image.jpg" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
```

> `og-image.jpg` é um asset estático em `apps/web/public/og-image.jpg` (1200×630px, criado manualmente ou via placeholder).

---

## 3. Histórias de Usuário & Matriz do Avaliador

### US-001: Hero Section com Título e CTA

**Descrição:** Como visitante, eu quero ver uma seção de destaque com o nome "RecipeHub", um subtítulo inspirador e um botão de chamada para ação, para que eu entenda imediatamente o valor do produto.

**Requisito Pai:** REQ-001

**Matriz de Teste do Avaliador:**
- [ ] **Visual:** A seção ocupa pelo menos 80vh da viewport, exibe "RecipeHub" em destaque tipográfico (mínimo `text-4xl`), tem um subtítulo e um botão CTA visível
- [ ] **HTML Puro:** O `<button>` ou `<a>` de CTA é um elemento HTML nativo — sem event listeners JS, sem `onClick`
- [ ] **Responsivo:** Em mobile (320px) e desktop (1280px), o layout não quebra — texto centralizado em mobile, possível layout em 2 colunas em desktop
- [ ] **Zero JS:** DevTools → Network tab mostra zero arquivos `.js` carregados

---

### US-002: Grid de 6 Cards de Receitas

**Descrição:** Como visitante, eu quero ver um grid com 6 cards de receitas exibindo imagem, título, tempo de preparo e categoria, para que eu me sinta engajado com o conteúdo do RecipeHub.

**Requisito Pai:** REQ-002, REQ-003

**Matriz de Teste do Avaliador:**
- [ ] **Dados:** Exatamente 6 cards são renderizados, originados do array `recipes` em `src/data/recipes.ts`
- [ ] **Conteúdo do Card:** Cada card exibe: imagem (tag `<img>` com `alt` descritivo), `title`, `prepTime` formatado com ícone de relógio (SVG inline ou emoji), e badge de `category`
- [ ] **Layout Grid:** Em mobile: 1 coluna. Em tablet (768px): 2 colunas. Em desktop (1024px+): 3 colunas. Implementado com `grid` do TailwindCSS
- [ ] **Hover CSS:** Cards têm transição CSS de elevação/sombra no hover (`hover:shadow-lg transition-shadow duration-200`) — sem JS
- [ ] **Imagens:** `<img>` usa `loading="lazy"` e `width`/`height` explícitos para evitar layout shift (CLS = 0)

---

### US-003: Formulário Visual de Newsletter

**Descrição:** Como visitante, eu quero ver um formulário de newsletter visualmente atraente com campo de e-mail e botão "Inscrever-se", para que eu possa (futuramente) me cadastrar para receber conteúdo.

**Requisito Pai:** REQ-004

**Matriz de Teste do Avaliador:**
- [ ] **Visual:** Seção com fundo diferenciado (ex: `bg-brand-cream` ou `bg-brand-orange`), título, subtítulo, `<input type="email">` e `<button type="submit">` estilizados
- [ ] **Sem Action:** O `<form>` NÃO possui atributo `action` nem `method` — é puramente visual
- [ ] **Sem JS:** Zero event listeners, zero `onSubmit`, zero imports de bibliotecas de formulário
- [ ] **Acessibilidade Básica:** O `<input>` possui `<label>` associado via `for`/`id` ou `aria-label`
- [ ] **Responsivo:** Em mobile, o input e o botão empilham verticalmente (`flex-col`). Em desktop, ficam lado a lado (`flex-row`)

---

### US-004: SEO Básico Estático

**Descrição:** Como responsável de marketing, eu quero que a página tenha meta tags estáticas de SEO e Open Graph, para que o link do RecipeHub apareça corretamente ao ser compartilhado em redes sociais.

**Requisito Pai:** REQ-005

**Matriz de Teste do Avaliador:**
- [ ] **`<title>`:** Tag `<title>` presente no `<head>` com texto "RecipeHub — Receitas para Inspirar sua Cozinha"
- [ ] **Meta Description:** `<meta name="description">` presente com texto entre 120-160 caracteres
- [ ] **OG Tags:** `og:title`, `og:description`, `og:image`, `og:type` presentes no `<head>`
- [ ] **Twitter Card:** `twitter:card` com valor `summary_large_image` presente
- [ ] **Asset OG:** O arquivo `/og-image.jpg` existe em `public/` e é acessível na URL pública

---

### US-005: Deploy no Cloudflare Pages

**Descrição:** Como desenvolvedor, eu quero que o projeto faça build e deploy automático no Cloudflare Pages, para que a landing page esteja acessível publicamente via URL.

**Requisito Pai:** REQ-006

**Matriz de Teste do Avaliador:**
- [ ] **Build:** `pnpm --filter web build` roda sem erros e gera output em `apps/web/dist/`
- [ ] **Output Estático:** O diretório `dist/` contém apenas `.html`, `.css` e assets estáticos — zero `.js` no bundle principal
- [ ] **Cloudflare Pages Config:** `astro.config.mjs` usa `output: 'static'` e adapter `@astrojs/cloudflare` (modo estático) OU sem adapter (Astro static default)
- [ ] **Deploy:** A URL pública (ex: `recipehub.pages.dev`) retorna HTTP 200 com a landing page
- [ ] **Turborepo Pipeline:** O script `build` de `apps/web` está incluído no pipeline do `turbo.json` raiz

---

## 4. Requisitos Funcionais

### REQ-001 — Hero Section (MUST)
O componente `Hero.astro` DEVE renderizar:
- O texto "RecipeHub" como `<h1>` com classe mínima `text-5xl font-bold text-brand-dark`
- Um subtítulo `<p>` com texto descritivo (ex: "Descubra receitas que transformam ingredientes simples em momentos memoráveis.")
- Um `<a>` estilizado como botão CTA com texto "Ver Receitas" apontando para `#receitas` (âncora na página) — NÃO usar `<button>` para navegação
- Fundo visual diferenciado (gradiente suave ou cor sólida `bg-brand-cream`)
- Altura mínima de `min-h-[80vh]` com conteúdo centralizado via Flexbox

### REQ-002 — Grid de Receitas (MUST)
O componente `RecipeGrid.astro` DEVE:
- Importar o array `recipes` de `../../data/recipes.ts`
- Iterar com `recipes.map()` e renderizar um `RecipeCard.astro` por item
- Usar `id="receitas"` para funcionar como âncora do CTA do Hero
- Layout: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`

### REQ-003 — Recipe Card (MUST)
O componente `RecipeCard.astro` DEVE aceitar props tipadas:

```typescript
interface Props {
  title: string;
  prepTime: string;
  imageUrl: string;
  category: string;
}
```

E renderizar:
- `<img src={imageUrl} alt={title} width="600" height="400" loading="lazy" class="w-full h-48 object-cover rounded-t-lg" />`
- Badge de categoria: `<span class="...">` com `category`
- Título: `<h3>` com `title`
- Tempo de preparo: ícone SVG de relógio (inline) + `<span>{prepTime}</span>`
- Hover state: `hover:shadow-xl hover:-translate-y-1 transition-all duration-200` na card wrapper `<article>`

### REQ-004 — Formulário de Newsletter Visual (MUST)
O componente `NewsletterForm.astro` DEVE:
- Renderizar um `<form>` SEM atributos `action`, `method` ou qualquer handler JS
- Conter: `<label>`, `<input type="email" placeholder="seu@email.com" aria-label="Endereço de e-mail">`, `<button type="submit">Inscrever-se</button>`
- Em mobile: input e botão em `flex flex-col gap-3`
- Em desktop: input e botão em `sm:flex-row`
- Seção com fundo `bg-brand-orange text-white` ou similar para destaque visual

### REQ-005 — SEO Estático (MUST)
O layout `BaseLayout.astro` DEVE incluir no `<head>`:
- `<meta charset="UTF-8" />`
- `<meta name="viewport" content="width=device-width, initial-scale=1.0" />`
- `<title>RecipeHub — Receitas para Inspirar sua Cozinha</title>`
- `<meta name="description" content="..." />` (120-160 chars)
- Tags Open Graph: `og:title`, `og:description`, `og:image`, `og:type`
- `<meta name="twitter:card" content="summary_large_image" />`
- `<link rel="canonical" href="https://recipehub.pages.dev/" />`

### REQ-006 — Configuração Astro para Deploy Estático (MUST)
O arquivo `astro.config.mjs` DEVE conter:

```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'static',
  integrations: [tailwind()],
  site: 'https://recipehub.pages.dev',
});
```

> **Sem `@astrojs/cloudflare` adapter:** Para sites 100% estáticos sem SSR, o Astro não precisa do adapter Cloudflare — o output é HTML puro que o Cloudflare Pages serve diretamente.

### REQ-007 — Animações CSS Puras via TailwindCSS (SHOULD)
Todos os efeitos visuais DEVEM ser implementados exclusivamente via classes TailwindCSS:
- Cards: `hover:shadow-xl hover:-translate-y-1 transition-all duration-200`
- Botão CTA: `hover:bg-brand-tomato transition-colors duration-150`
- Links de navegação (se houver): `hover:text-brand-orange transition-colors duration-150`
- PROIBIDO: `<script>`, `addEventListener`, imports de bibliotecas de animação JS

### REQ-008 — Integração Turborepo (MUST)
O `turbo.json` raiz DEVE incluir o workspace `apps/web` no pipeline de `build`. O `package.json` de `apps/web` DEVE ter:

```json
{
  "name": "@recipehub/web",
  "scripts": {
    "build": "astro build",
    "dev": "astro dev",
    "check": "astro check"
  }
}
```

### REQ-009 — Zero JavaScript no Cliente (MUST)
- PROIBIDO usar `client:load`, `client:idle`, `client:visible` ou qualquer diretiva de hidratação Astro
- PROIBIDO adicionar `<script>` tags no HTML output
- PROIBIDO usar componentes React/Vue/Svelte com hidratação
- Verificação: `astro build` seguido de `grep -r "<script" dist/` deve retornar vazio (exceto scripts injetados por ferramentas externas fora do controle do dev)

---

## 5. Fora do Escopo (Non-Goals)

Os itens abaixo estão **EXPLICITAMENTE PROIBIDOS** nesta Sprint para evitar scope creep:

| Item | Motivo |
|---|---|
| Página de detalhe de receita (`/recipes/[slug]`) | Requer roteamento dinâmico — sprint futura |
| Sistema de busca ou filtro por categoria | Requer JS no cliente ou backend — sprint futura |
| Autenticação de usuários (login/cadastro) | Requer D1, KV, sessões — sprint futura |
| Integração real de newsletter (Mailchimp, ConvertKit, Resend) | Requer backend ou JS externo — sprint futura |
| Dark mode | Requer lógica CSS/JS de preferência de tema — sprint futura |
| JavaScript no cliente (qualquer finalidade) | Fora do escopo por definição desta sprint |
| Internacionalização (i18n) | Adiciona complexidade desnecessária agora |
| Sitemap dinâmico (`sitemap.xml` gerado automaticamente) | Será adicionado quando houver mais páginas |
| Banco de dados (D1, KV, R2) | Página 100% estática, sem persistência |
| Página de erro 404 customizada | Nice-to-have — sprint futura |
| Testes automatizados (Playwright, Vitest) | Fora do escopo desta sprint de bootstrap |

---

## 6. Cloudflare Bindings & Integrações

### Bindings Cloudflare
**Nenhum binding necessário nesta Sprint.** A landing page é 100% estática — sem Workers, sem D1, sem KV, sem R2, sem Queues.

### Serviço de Deploy
- **Cloudflare Pages** — serve o output estático de `apps/web/dist/`
- Configuração no dashboard do Cloudflare Pages:
  - **Build command:** `pnpm --filter @recipehub/web build`
  - **Build output directory:** `apps/web/dist`
  - **Root directory:** `/` (raiz do monorepo)
  - **Node.js version:** 20.x

### APIs Externas
- **picsum.photos** — imagens placeholder para os cards de receita (nenhuma chave de API necessária, serviço público gratuito)

### Variáveis de Ambiente
**Nenhuma variável de ambiente necessária nesta Sprint.**

---

## 7. Restrições & Casos Limite

### Restrição 1 — Astro Output Mode
O `output` DEVE ser `'static'` (não `'server'` nem `'hybrid'`). Qualquer uso acidental de APIs Astro que impliquem SSR (ex: `Astro.request`, `Astro.locals`, `getStaticPaths` com fetch externo) viola esta restrição.

### Restrição 2 — TailwindCSS no Monorepo
O TailwindCSS DEVE ser configurado localmente em `apps/web/tailwind.config.mjs` — NÃO herdar de `tooling/` para esta sprint inicial. Isso evita conflitos com configurações de outros workspaces.

### Restrição 3 — Imagens Externas (picsum.photos)
As imagens de placeholder vêm de `https://picsum.photos`. Caso o serviço esteja fora do ar durante o build, as imagens simplesmente não carregam — o layout não deve quebrar. As tags `<img>` devem ter `width` e `height` explícitos para reservar espaço mesmo sem imagem (`aspect-ratio` via CSS).

### Restrição 4 — Formulário Sem Submissão
O `<form>` da newsletter NÃO possui `action`. Comportamento esperado: o formulário não faz nada ao ser "submetido". O botão pode ter `type="button"` para evitar reload da página em navegadores que tentam submeter formulários sem action. **Alternativa preferida:** manter `type="submit"` (semântica correta) e aceitar o comportamento padrão do navegador (reload para `GET /`), que é inofensivo.

### Restrição 5 — Compatibilidade de Fontes
A fonte "Inter" deve ser carregada via `<link>` do Google Fonts no `<head>` do `BaseLayout.astro` — NÃO via `@font-face` com arquivos locais (adiciona complexidade de assets sem ganho real nesta sprint):

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

### Restrição 6 — pnpm Workspace
O `pnpm-workspace.yaml` na raiz do monorepo DEVE incluir `apps/web`. Se o arquivo não existir ou não incluir `apps/*`, o workspace não será reconhecido pelo Turborepo.

---

## 8. Checklist de Implementação (Para o Agente Executor)

Use esta checklist em ordem estrita para implementar a sprint:

### Fase A — Setup do Workspace
- [ ] **[Ref: REQ-008]** Verificar se `apps/web` já existe via `list_directory apps/`
- [ ] **[Ref: REQ-008]** Criar `apps/web/package.json` com nome `@recipehub/web` e scripts `build`, `dev`, `check`
- [ ] **[Ref: REQ-006]** Criar `apps/web/astro.config.mjs` com `output: 'static'` e integração TailwindCSS
- [ ] **[Ref: REQ-007]** Criar `apps/web/tailwind.config.mjs` com paleta `brand` e fontFamily `Inter`
- [ ] **[Ref: REQ-008]** Adicionar `apps/web` ao `turbo.json` raiz no pipeline de `build`
- [ ] **[Ref: REQ-008]** Verificar `pnpm-workspace.yaml` — garantir que `apps/*` está incluso

### Fase B — Dados
- [ ] **[Ref: REQ-002, REQ-003]** Criar `apps/web/src/data/recipes.ts` com interface `Recipe` e array `recipes` com 6 itens

### Fase C — Layouts e Componentes
- [ ] **[Ref: REQ-005]** Criar `apps/web/src/layouts/BaseLayout.astro` com `<head>` completo (meta tags SEO, OG, Twitter, fontes Google)
- [ ] **[Ref: REQ-001]** Criar `apps/web/src/components/Hero.astro`
- [ ] **[Ref: REQ-003]** Criar `apps/web/src/components/RecipeCard.astro` com props tipadas
- [ ] **[Ref: REQ-002]** Criar `apps/web/src/components/RecipeGrid.astro`
- [ ] **[Ref: REQ-004]** Criar `apps/web/src/components/NewsletterForm.astro`

### Fase D — Página e Assets
- [ ] **[Ref: REQ-001, REQ-002, REQ-004]** Criar `apps/web/src/pages/index.astro` montando Hero + RecipeGrid + NewsletterForm dentro do BaseLayout
- [ ] **[Ref: REQ-005]** Adicionar `apps/web/public/og-image.jpg` (placeholder 1200×630px)

### Fase E — Validação
- [ ] **[Ref: REQ-006]** Executar `pnpm --filter @recipehub/web build` — deve completar sem erros
- [ ] **[Ref: REQ-009]** Executar `grep -r "<script" apps/web/dist/` — deve retornar vazio
- [ ] **[Ref: REQ-007]** Verificar classes de hover/transition nos componentes gerados
```