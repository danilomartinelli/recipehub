# Code Map

_Última atualização: Sprint sp-001_

## Visão Geral do Monorepo

```
recipehub/
├── apps/
│   └── (vazio — nenhum app criado ainda)
├── packages/
│   └── (vazio — nenhum pacote criado ainda)
├── tooling/
│   └── (vazio — nenhuma config compartilhada ainda)
├── package.json          # root workspace
├── pnpm-workspace.yaml   # define workspaces
└── turbo.json            # pipeline Turborepo
```

## Componentes Registrados

_Nenhum componente registrado ainda._

## Serviços e Workers

_Nenhum serviço registrado ainda._

## Pacotes Compartilhados

_Nenhum pacote compartilhado registrado ainda._

## Utilitários

_Nenhum utilitário registrado ainda._
Monorepo limpo — nenhum app existe ainda. Posso gerar o PRD sem risco de duplicação.

```

### 2.2 Dados Hardcoded — `apps/web/src/data/recipes.ts`

```typescript
import type { Recipe } from \"./types\";

export const FEATURED_RECIPES: Recipe[] = [
  {
    id: \"recipe-001\",
    title: \"Risoto de Cogumelos\",
    prepTime: 35,
    difficulty: \"Médio\",
    category: \"Massas\",
    description: \"Cremoso e aromático, perfeito para jantares especiais.\",
  },
  {
    id: \"recipe-002\",
    title: \"Sopa de Tomate Assado\",
    prepTime: 50,
    difficulty: \"Fácil\",
    category: \"Sopas\",
    description: \"Tomates assados com azeite e manjericão fresco.\",
  },
  {
    id: \"recipe-003\",
    title: \"Bowl de Quinoa e Legumes\",
    prepTime: 20,
    difficulty: \"Fácil\",
    category: \"Saudável\",
    description: \"Nutritivo e colorido, pronto em menos de 30 minutos.\",
  },
  {
    id: \"recipe-004\",
    title: \"Frango ao Limão Siciliano\",
    prepTime: 45,
    difficulty: \"Médio\",
    category: \"Carnes\",
    description: \"Frango suculento com molho cítrico e ervas frescas.\",
  },
  {
    id: \"recipe-005\",
    title: \"Brownie de Chocolate Amargo\",
    prepTime: 40,
    difficulty: \"Fácil\",
    category: \"Sobremesas\",
    description: \"Textura densa e intensa, derrete na boca.\",
  },
  {
    id: \"recipe-006\",
    title: \"Pad Thai Vegetariano\",
    prepTime: 25,
    difficulty: \"Médio\",
    category: \"Asiática\",
    description: \"Macarrão de arroz com tofu, amendoim e molho tamarindo.\",
  },
];
```

### 2.3 Estrutura de Pastas do Workspace

```
apps/web/
├── src/
│   ├── data/
│   │   ├── types.ts          # interfaces TypeScript
│   │   └── recipes.ts        # array FEATURED_RECIPES hardcoded
│   ├── components/
│   │   ├── Hero.astro
│   │   ├── RecipeCard.astro
│   │   ├── RecipeGrid.astro
│   │   └── NewsletterForm.astro
│   ├── layouts/
│   │   └── BaseLayout.astro
│   └── pages/
│       └── index.astro
├── public/
│   └── favicon.svg
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
```

> **Nenhum payload JSON de API existe nesta sprint.** Não há endpoints, rotas ou comunicação de rede.

---

## 3. Histórias de Usuário & Matriz do Avaliador

### US-001: Workspace Astro Configurado no Monorepo

**Descrição:** Como desenvolvedor, eu quero que `apps/web` seja um workspace Astro funcional integrado ao Turborepo para que os comandos `build` e `dev` funcionem a partir da raiz do monorepo.

**Matriz de Teste do Avaliador:**

- [ ] **Build:** `pnpm --filter web build` executa sem erros e gera `apps/web/dist/`.
- [ ] **Dev:** `pnpm --filter web dev` inicia o servidor de desenvolvimento Astro.
- [ ] **Turbo:** `turbo build` na raiz do monorepo inclui o workspace `web` no pipeline.
- [ ] **TypeScript:** `tsc --noEmit` dentro de `apps/web` retorna zero erros.

---

### US-002: Seção Hero com Título e CTA

**Descrição:** Como visitante do site, eu quero ver uma seção hero impactante com título, subtítulo e botão de call-to-action para que eu entenda imediatamente o propósito do RecipeHub.

**Matriz de Teste do Avaliador:**

- [ ] **Build:** O componente `Hero.astro` renderiza sem erros no build estático.
- [ ] **HTML:** O output em `dist/index.html` contém a tag `<h1>` com o título principal.
- [ ] **E2E/UI:** O botão CTA é visível, tem contraste adequado e renderiza sem JavaScript no cliente.
- [ ] **Semântica:** A seção usa a tag HTML `<section>` ou `<header>` com landmark ARIA adequado.

---

### US-003: Grid de 6 Cards de Receitas

**Descrição:** Como visitante do site, eu quero ver um grid com 6 cards de receitas contendo imagem placeholder, título, categoria, dificuldade e tempo de preparo para que eu visualize o tipo de conteúdo disponível na plataforma.

**Matriz de Teste do Avaliador:**

- [ ] **Build:** O componente `RecipeGrid.astro` itera sobre `FEATURED_RECIPES` e renderiza exatamente 6 cards.
- [ ] **HTML:** O output `dist/index.html` contém 6 elementos com a classe de card e o atributo de tempo de preparo visível.
- [ ] **Placeholder:** Cada card exibe um bloco `bg-gray-200` como imagem placeholder — nenhuma requisição de rede para imagem externa.
- [ ] **Tipagem:** O prop `recipe` do componente `RecipeCard.astro` usa a interface `Recipe` importada de `src/data/types.ts`.
- [ ] **Zero JS:** O HTML final não contém nenhuma tag `<script>` gerada pelos componentes de receita.

---

### US-004: Formulário Visual de Newsletter

**Descrição:** Como visitante do site, eu quero ver um formulário de inscrição de newsletter com campo de e-mail e botão de envio para que eu possa (futuramente) me inscrever para receber conteúdo do RecipeHub.

**Matriz de Teste do Avaliador:**

- [ ] **Build:** O componente `NewsletterForm.astro` renderiza sem erros no build estático.
- [ ] **HTML:** O output contém um `<form>` com `<input type=\"email\">` e `<button type=\"submit\">`.
- [ ] **Sem Action:** O elemento `<form>` NÃO possui atributo `action` — é puramente visual, sem submissão funcional.
- [ ] **Zero JS:** Nenhum event listener ou `<script>` é injetado pelo componente de newsletter.
- [ ] **Acessibilidade:** O campo de e-mail possui `<label>` associado via `for` e `id` correspondente.

---

## 4. Requisitos Funcionais (FR)

### Configuração & Infraestrutura

**REQ-001** *(must)* — Criar o workspace `apps/web` com `package.json` configurado com `name: \"web\"` e os scripts `dev`, `build` e `preview` mapeados para os comandos Astro equivalentes.

**REQ-002** *(must)* — Registrar `apps/web` no `pnpm-workspace.yaml` da raiz e garantir que `turbo.json` inclua o pipeline `build` para este workspace.

**REQ-003** *(must)* — Instalar as dependências `astro`, `@astrojs/tailwind` e `tailwindcss` exclusivamente no workspace `apps/web` (não no root do monorepo).

**REQ-004** *(must)* — Criar `astro.config.mjs` com a integração `@astrojs/tailwind` habilitada e `output: 'static'` (modo estático explícito).

**REQ-005** *(must)* — Criar `tailwind.config.mjs` com `content` apontando para `./src/**/*.{astro,html,js,ts}`.

**REQ-006** *(must)* — Criar `tsconfig.json` no workspace estendendo a config base do Astro (`astro/tsconfigs/strict`) e com `baseUrl: \".\"` configurado.

---

### Dados

**REQ-007** *(must)* — Criar `src/data/types.ts` com a interface `Recipe` exatamente conforme definida na Seção 2.1 deste PRD. Nenhum campo adicional deve ser adicionado nesta sprint.

**REQ-008** *(must)* — Criar `src/data/recipes.ts` exportando o array `FEATURED_RECIPES` com exatamente 6 objetos do tipo `Recipe`, conforme o exemplo da Seção 2.2. Os dados são hardcoded — nenhum fetch, import dinâmico ou CMS.

---

### Layout & Componentes

**REQ-009** *(must)* — Criar `src/layouts/BaseLayout.astro` com estrutura HTML5 completa: `<!DOCTYPE html>`, `<html lang=\"pt-BR\">`, `<head>` com `<meta charset>`, `<meta name=\"viewport\">`, `<title>RecipeHub</title>`, e `<slot />` no `<body>` para injeção de conteúdo.

**REQ-010** *(must)* — Criar `src/components/Hero.astro` com:
  - Uma tag `<section>` ou `<header>` semântica como elemento raiz.
  - Um `<h1>` contendo o título principal do RecipeHub.
  - Um parágrafo `<p>` de subtítulo descritivo.
  - Um `<a>` ou `<button>` estilizado como CTA primário com TailwindCSS.
  - Zero JavaScript no cliente — componente puramente declarativo Astro.

**REQ-011** *(must)* — Criar `src/components/RecipeCard.astro` que aceita um prop tipado `recipe: Recipe` (importado de `../data/types`) e renderiza:
  - Um bloco `<div>` com classe `bg-gray-200` representando a imagem placeholder (dimensão fixa via Tailwind, ex: `h-48`).
  - O título da receita em `<h3>` ou `<h2>`.
  - O tempo de preparo formatado (ex: \"35 min\").
  - A dificuldade e categoria como badges ou texto secundário.
  - A descrição como `<p>` com text truncation opcional.

**REQ-012** *(must)* — Criar `src/components/RecipeGrid.astro` que:
  - Importa `FEATURED_RECIPES` de `../data/recipes`.
  - Importa `RecipeCard` de `./RecipeCard.astro`.
  - Renderiza um `<section>` com grid CSS via Tailwind (ex: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`).
  - Itera sobre o array com `{FEATURED_RECIPES.map(recipe => <RecipeCard recipe={recipe} />)}`.
  - Zero lógica de filtragem, paginação ou ordenação nesta sprint.

**REQ-013** *(must)* — Criar `src/components/NewsletterForm.astro` com:
  - Um `<form>` SEM atributo `action` (formulário puramente visual).
  - Um `<label for=\"email\">` associado a um `<input type=\"email\" id=\"email\" name=\"email\">`.
  - Um `<button type=\"submit\">` com texto e estilo TailwindCSS.
  - Zero JavaScript no cliente — nenhum event listener, nenhum `fetch()`, nenhum `<script>`.

**REQ-014** *(must)* — Criar `src/pages/index.astro` que:
  - Usa `BaseLayout` como wrapper.
  - Compõe as seções na ordem: `<Hero />`, `<RecipeGrid />`, `<NewsletterForm />`.
  - Não possui nenhum bloco `<script client:*>` (diretivas de hidratação Astro).

---

### Build & Qualidade

**REQ-015** *(must)* — O comando `pnpm --filter web build` deve completar sem erros de TypeScript, lint ou build Astro, gerando o diretório `apps/web/dist/` com os assets estáticos.

**REQ-016** *(must)* — Nenhum arquivo `.js` ou `<script>` deve ser emitido nos assets finais de `dist/` originado dos componentes desta landing page. O Astro deve rodar em modo estático puro (zero hydration).

**REQ-017** *(should)* — Configurar ESLint no workspace `apps/web` com suporte a TypeScript e Astro, de forma que `eslint .` retorne zero warnings ou erros nos arquivos de componentes.

**REQ-018** *(could)* — Adicionar `<meta name=\"description\">` na `BaseLayout.astro` para SEO básico, aceitando o valor via prop com fallback para uma descrição padrão do RecipeHub.

---

## 5. Fora do Escopo (Non-Goals)

Os itens abaixo estão **explicitamente proibidos** nesta sprint. Qualquer implementação parcial destes itens é considerada scope creep e deve ser bloqueada na revisão de código.

| # | Item Proibido | Justificativa |
|---|--------------|---------------|
| NG-01 | Formulário de newsletter funcional (submissão de dados) | Requer API route, D1 ou integração Resend — fora do escopo desta sprint estática |
| NG-02 | Integração com qualquer serviço Cloudflare (D1, KV, R2, Queues) | Zero persistência nesta sprint |
| NG-03 | Deploy no Cloudflare Pages | DoD é apenas o build local limpo |
| NG-04 | Pacotes compartilhados em `packages/ui` ou `packages/shared` | Nenhum componente deve sair de `apps/web` nesta sprint |
| NG-05 | Sistema de design ou Storybook | Overhead desnecessário para landing estática |
| NG-06 | Páginas adicionais (ex: `/recipes`, `/sobre`, `/blog`) | Apenas `index.astro` nesta sprint |
| NG-07 | JavaScript no cliente (React islands, Vue, Svelte, `client:*`) | A página deve ser 100% HTML/CSS estático |
| NG-08 | Imagens reais de receitas ou CDN externo | Placeholders via `bg-gray-200` do TailwindCSS |
| NG-09 | Google Fonts ou qualquer fonte externa via rede | Zero requisições externas |
| NG-10 | Autenticação, sessão ou área logada | Fora do escopo desta landing estática |
| NG-11 | Testes automatizados (Vitest, Playwright) | Não há lógica de negócio a testar nesta sprint |
| NG-12 | Analytics ou scripts de terceiros (GA, Hotjar) | Zero scripts de terceiros |

---

## 6. Cloudflare Bindings & Integrações

**Bindings Cloudflare:** Nenhum. Esta sprint não utiliza Workers, D1, R2, KV ou Queues.

**APIs Externas:** Nenhuma. Zero chaves de API, tokens ou variáveis de ambiente necessárias.

**Variáveis de Ambiente:** Nenhuma. Não existe arquivo `.env` ou `.dev.vars` nesta sprint.

> Esta é a sprint de menor acoplamento de infraestrutura possível — apenas Node.js local para executar o build Astro via pnpm.

---

## 7. Restrições Técnicas & Casos Limite

### RT-01: Modo Estático Astro Obrigatório
O arquivo `astro.config.mjs` DEVE declarar `output: 'static'` explicitamente. A ausência desta configuração pode resultar em comportamento SSR indesejado em futuras integrações.

```javascript
// apps/web/astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'static',
  integrations: [tailwind()],
});
```

### RT-02: Zero Diretivas de Hidratação Astro
Nenhum componente pode usar as diretivas `client:load`, `client:idle`, `client:visible`, `client:media` ou `client:only`. Qualquer uso é uma violação do requisito REQ-016.

### RT-03: Isolamento de Dependências
As dependências `astro`, `@astrojs/tailwind` e `tailwindcss` devem ser instaladas SOMENTE no `apps/web/package.json`. Não devem ser elevadas ao `package.json` da raiz do monorepo.

### RT-04: TailwindCSS como Única Fonte de Estilos
Nenhum arquivo `.css` customizado deve ser criado além do que a integração `@astrojs/tailwind` gera automaticamente. Nenhum `<style>` inline em componentes Astro, a menos que seja estritamente necessário para um efeito que o Tailwind não cobre com classes utilitárias.

### RT-05: Compatibilidade de Versão Astro
Usar a versão estável mais recente do Astro (v4.x ou superior) disponível no momento da execução. Não usar versões beta ou release candidate.

### RT-06: Fallback para Grid em Mobile
O `RecipeGrid` DEVE ser responsivo. Em telas mobile (`< md`), o grid deve colapsar para 1 coluna. Em tablets (`md`), 2 colunas. Em desktop (`lg+`), 3 colunas. Usar exclusivamente classes Tailwind responsivas.

### RT-07: Sem Erros de TypeScript em Strict Mode
O `tsconfig.json` deve estender `astro/tsconfigs/strict`, ativando `strict: true`. O tipo `Recipe` deve ser usado explicitamente nos props dos componentes — nenhum uso de `any`.

---

## 8. Referências de Implementação

### Estrutura de Props no Componente RecipeCard

```astro
---
// apps/web/src/components/RecipeCard.astro
import type { Recipe } from '../data/types';

interface Props {
  recipe: Recipe;
}

const { recipe } = Astro.props;
---

<article class=\"rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow\">
  <!-- Imagem placeholder via CSS puro -->
  <div class=\"bg-gray-200 h-48 w-full\"></div>
  
  <div class=\"p-4\">
    <div class=\"flex items-center justify-between mb-2\">
      <span class=\"text-xs font-medium text-gray-500 uppercase tracking-wide\">
        {recipe.category}
      </span>
      <span class=\"text-xs text-gray-400\">{recipe.prepTime} min</span>
    </div>
    
    <h3 class=\"text-lg font-semibold text-gray-900 mb-1\">{recipe.title}</h3>
    <p class=\"text-sm text-gray-600 line-clamp-2\">{recipe.description}</p>
    
    <span class=\"inline-block mt-3 text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-700\">
      {recipe.difficulty}
    </span>
  </div>
</article>
```

### Estrutura do package.json do Workspace

```json
{
  \"name\": \"web\",
  \"version\": \"0.0.1\",
  \"private\": true,
  \"scripts\": {
    \"dev\": \"astro dev\",
    \"build\": \"astro build\",
    \"preview\": \"astro preview\",
    \"check\": \"astro check\"
  },
  \"dependencies\": {
    \"astro\": \"^4.0.0\",
    \"@astrojs/tailwind\": \"^5.0.0\",
    \"tailwindcss\": \"^3.4.0\"
  },
  \"devDependencies\": {
    \"typescript\": \"^5.0.0\"
  }
}
```

### Pipeline Turbo esperado no `turbo.json` da raiz

```json
{
  \"$schema\": \"https://turbo.build/schema.json\",
  \"tasks\": {
    \"build\": {
      \"outputs\": [\"dist/**\"]
    },
    \"dev\": {
      \"cache\": false,
      \"persistent\": true
    }
  }
}
```

---

## 9. Checklist de Aceite Final (DoD)

A sprint sp-019 é considerada **CONCLUÍDA** quando TODOS os itens abaixo estão marcados:

- [ ] `apps/web` existe como workspace registrado no monorepo (`pnpm-workspace.yaml`).
- [ ] `pnpm --filter web build` retorna exit code `0` sem nenhum erro ou warning.
- [ ] O diretório `apps/web/dist/` é gerado e contém pelo menos `index.html`.
- [ ] O arquivo `dist/index.html` contém exatamente 6 elementos de card de receita renderizados.
- [ ] O arquivo `dist/index.html` contém um `<form>` de newsletter SEM atributo `action`.
- [ ] Nenhum arquivo `.js` de hidratação de componente está presente em `dist/`.
- [ ] `tsc --noEmit` retorna zero erros dentro do workspace `apps/web`.
- [ ] Nenhuma requisição de rede para imagem ou fonte externa é necessária para renderizar a página.
"}}
File written successfully.
**Resumo Executivo — Sprint sp-019**

- **Escopo:** Criação do workspace `apps/web` no monorepo Turborepo com uma landing page Astro estática de página única (`index.astro`), composta por Hero, grid de 6 receitas e formulário de newsletter visual.
- **Data Model:** Zero persistência. Dados hardcoded em `apps/web/src/data/recipes.ts` com tipagem via interface `Recipe` em `types.ts`. Sem D1, R2, KV ou qualquer binding Cloudflare.
- **Integrações:** Nenhuma. Stack mínima: `astro` + `@astrojs/tailwind` + `tailwindcss`, instalados exclusivamente no workspace `apps/web`.
- **Non-Goals explícitos:** Zero JavaScript no cliente, zero deploy, zero páginas adicionais, zero pacotes compartilhados (`packages/`), formulário de newsletter sem `action`, imagens via `bg-gray-200` puro.
- **DoD:** `pnpm --filter web build` retorna exit `0` e gera `apps/web/dist/index.html` com os 6 cards renderizados e zero scripts de hidratação.

{"name": "complete_phase", "parameters": {"summary": "Blueprint sp-019 concluído: PRD da landing page estática RecipeHub (Astro + TailwindCSS) salvo em architecture/plans/prd-sprint-sp-019.md, cobrindo 18 requisitos funcionais, 4 histórias de usuário com critérios de aceite, 12 non-goals explícitos e zero dependências de infraestrutura."}}
Phase marked as complete.