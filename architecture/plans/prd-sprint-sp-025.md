# 2.3 Infraestrutura de Persistência

| Recurso | Status |
|---|---|
| Banco D1 | ❌ Não utilizado nesta sprint |
| R2 Storage | ❌ Não utilizado nesta sprint |
| KV Cache | ❌ Não utilizado nesta sprint |
| Cloudflare Queues | ❌ Não utilizado nesta sprint |

Todos os dados são **hardcoded em TypeScript**. Zero dependências de rede em runtime.

---

## 3. Histórias de Usuário & Matriz do Avaliador

### US-001: Hero Section

**Descrição:** Como visitante, eu quero ver um cabeçalho impactante com título, subtítulo e botão de CTA para entender imediatamente o propósito do RecipeHub e tomar uma ação.

**Matriz de Teste do Avaliador (Critérios de Aceite):**

- [ ] **Build:** `astro build` conclui sem erros e o arquivo `dist/index.html` é gerado
- [ ] **Zero JS:** O arquivo `dist/index.html` não contém tags `<script>` com código de comportamento; DevTools → Network mostra 0 arquivos `.js` carregados
- [ ] **Visual:** O título principal usa fonte serifa (ex: `font-serif`), o subtítulo usa sans-serif; a paleta de cores usa tokens amber/terracota/stone/creme do Tailwind
- [ ] **CTA:** O botão \"Ver Receitas\" existe no HTML e tem `href=\"#recipes\"` apontando para a seção do grid

---

### US-002: Grid de Receitas (6 Cards)

**Descrição:** Como visitante, eu quero ver um grid com 6 cards de receitas com placeholder visual, título e tempo de preparo para descobrir o conteúdo do site antes de me cadastrar.

**Matriz de Teste do Avaliador (Critérios de Aceite):**

- [ ] **Dados:** Exatamente 6 cards são renderizados, cada um originado do array `recipes` de `src/data/recipes.ts`
- [ ] **Placeholder:** Cada card exibe um `div` com gradiente CSS (classes `gradientFrom`/`gradientTo` do objeto Recipe), sem `<img>` com `src` externo; o emoji do campo `recipe.emoji` é exibido centralizado sobre o gradiente
- [ ] **Conteúdo:** Cada card exibe `recipe.title` e `recipe.prepTimeLabel` (ex: \"35 min\")
- [ ] **Layout:** Em mobile (< 640px) o grid é de 1 coluna; em tablet (≥ 640px) 2 colunas; em desktop (≥ 1024px) 3 colunas — via classes Tailwind responsivas (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`)
- [ ] **Ancoragem:** A seção tem `id=\"recipes\"` para o link CTA do Hero funcionar

---

### US-003: Formulário Visual de Newsletter

**Descrição:** Como visitante, eu quero ver um formulário de inscrição na newsletter para manifestar interesse em receber receitas por e-mail (o formulário é apenas visual — sem backend).

**Matriz de Teste do Avaliador (Critérios de Aceite):**

- [ ] **Markup:** Existe um `<form>` com `<input type=\"email\">` e `<button type=\"submit\">` no HTML final
- [ ] **Zero JS:** O formulário não possui `onsubmit`, `addEventListener` ou qualquer script associado. Ao clicar em Submit, o comportamento é o padrão do browser (recarregar a página) — nenhuma lógica de captura
- [ ] **Visual:** A seção tem fundo diferenciado (ex: `bg-amber-50` ou `bg-stone-100`) para separação visual do grid
- [ ] **Responsividade:** O input e o botão empilham verticalmente em mobile e ficam lado a lado em desktop (flex-col sm:flex-row)
- [ ] **Textos:** Exibe título (ex: \"Receba receitas toda semana\") e subtítulo explicativo hardcoded

---

## 4. Requisitos Funcionais (FR)

| ID | Prioridade | Descrição |
|---|---|---|
| REQ-001 | **MUST** | O projeto deve ser uma aplicação Astro standalone (sem monorepo, sem Turborepo, sem `apps/` ou `packages/`) |
| REQ-002 | **MUST** | O output de `astro build` deve gerar exclusivamente HTML e CSS estáticos — zero arquivos JavaScript no bundle de cliente |
| REQ-003 | **MUST** | Nenhum componente `.astro` deve conter diretiva `client:*` (ex: `client:load`, `client:idle`) |
| REQ-004 | **MUST** | Todo o estilo deve usar classes utilitárias TailwindCSS puras — zero CSS inline, zero arquivos `.css` customizados além do `@tailwind` base |
| REQ-005 | **MUST** | Os dados das 6 receitas devem estar em `src/data/recipes.ts`, exportando o tipo `Recipe` e o array `recipes` conforme o schema da Seção 2.2 |
| REQ-006 | **MUST** | Placeholders de imagem devem ser `div`s com classes de gradiente Tailwind + emoji centralizado — zero `<img>` com URLs externas |
| REQ-007 | **MUST** | A landing page deve ser deployada no Cloudflare Pages com adapter `@astrojs/cloudflare` configurado em modo `static` |
| REQ-008 | **MUST** | O build deve passar sem erros de TypeScript (o `tsconfig.json` deve ter `strict: true`) |
| REQ-009 | **SHOULD** | O `BaseLayout.astro` deve incluir `<meta charset=\"UTF-8\">`, `<meta name=\"viewport\">` e `<title>RecipeHub</title>` |
| REQ-010 | **SHOULD** | A fonte serifa do título principal deve ser carregada via `@font-face` ou importação do Google Fonts no `<head>` do `BaseLayout.astro` sem bloquear o render (usar `rel=\"preconnect\"` + `display=swap`) |
| REQ-011 | **SHOULD** | O layout deve ser responsivo apenas com breakpoints padrão do Tailwind (`sm`, `md`, `lg`) — sem breakpoints customizados |
| REQ-012 | **COULD** | O `<footer>` pode conter copyright hardcoded: `© 2025 RecipeHub. Todos os direitos reservados.` |

---

## 5. Fora do Escopo (Non-Goals)

Esta lista é **definitiva e proibitiva**. Qualquer agente ou desenvolvedor que tente implementar os itens abaixo durante esta sprint viola o escopo acordado.

| Item | Motivo da Exclusão |
|---|---|
| Páginas adicionais (ex: `/receita/[slug]`) | Fora do escopo desta sprint |
| CMS ou fonte de dados dinâmica | Zero backend nesta sprint |
| Backend de newsletter (captura de e-mail) | Formulário é puramente visual |
| Dark mode | Escopo agressivo acordado |
| Internacionalização (i18n) | Escopo agressivo acordado |
| Testes automatizados (Vitest, Playwright) | Escopo agressivo acordado |
| Analytics (Cloudflare Web Analytics ou GA) | Escopo agressivo acordado |
| Bindings Cloudflare (D1, R2, KV, Queues) | Zero infraestrutura server-side |
| `sitemap.xml` | Escopo agressivo acordado |
| Meta tags Open Graph / Twitter Card | Escopo agressivo acordado |
| Favicon customizado | Escopo agressivo acordado |
| Filtros ou categorias de receitas | Sprint futura |
| Animações CSS complexas (keyframes, transitions) | Escopo agressivo acordado |
| Imagens reais (uploads, CDN, Unsplash) | Zero dependência de rede |
| Monorepo / Turborepo / pnpm workspaces | Projeto standalone |
| Qualquer diretiva `client:*` do Astro | Zero JS no cliente é hard constraint |

---

## 6. Cloudflare Bindings & Integrações

**Bindings Cloudflare:**

> Nenhum. Esta sprint não utiliza D1, R2, KV, Queues, Workers ou qualquer binding Cloudflare.

**APIs Externas:**

> Nenhuma. Zero variáveis de ambiente. Zero segredos. Zero chamadas de rede em runtime.

**Configuração de Deploy (Cloudflare Pages):**

```
Framework preset: Astro
Build command:    npm run build
Build output:     dist/
Root directory:   / (raiz do repositório)
Environment variables: (nenhuma)
```

---

## 7. Restrições & Casos Limite

### 7.1 Restrições Técnicas

| Restrição | Detalhe |
|---|---|
| Zero JS no cliente | O Astro deve ser configurado com `output: 'static'`. Confirme com `astro build --verbose` que nenhum chunk `.js` é emitido para o cliente |
| TailwindCSS apenas | Proibido usar `<style>` tags com CSS arbitrário nos componentes `.astro` — toda estilização via classes utilitárias |
| Gradientes Tailwind | As propriedades `gradientFrom` e `gradientTo` no tipo `Recipe` devem usar nomes de classes Tailwind válidas (ex: `from-amber-400`) que existam no safelist ou sejam usadas diretamente no template para evitar purge incorreto pelo Tailwind |
| TypeScript strict | `tsconfig.json` com `strict: true` — nenhum `any` implícito permitido |
| Node.js proibido em runtime | Embora este projeto seja estático (build-time only), não usar `fs`, `path` ou APIs Node.js nos scripts de build Astro para manter compatibilidade futura com edge |

### 7.2 Casos Limite

| Cenário | Comportamento Esperado |
|---|---|
| Classes de gradiente dinâmicas no Tailwind | As classes `from-*` e `to-*` devem estar no array `safelist` do `tailwind.config.mjs` ou referenciadas literalmente no template — o purge do Tailwind não processa interpolação dinâmica de strings |
| Fonte serifa falha ao carregar (offline) | O CSS deve ter fallback: `font-family: 'NomeDaFonte', Georgia, serif` — o layout não quebra sem a fonte customizada |
| Submit do formulário de newsletter | Comportamento nativo do browser (recarrega a página ou navega para `action` vazia) — aceitável pois não há backend |
| Build no Cloudflare Pages (Node.js version) | Adicionar `NODE_VERSION=18` nas variáveis de ambiente de build do Cloudflare Pages para garantir compatibilidade com Astro |

### 7.3 Dependências do Projeto

```json
// package.json — dependências esperadas
{
  \"dependencies\": {},
  \"devDependencies\": {
    \"astro\": \"^4.x\",
    \"@astrojs/tailwind\": \"^5.x\",
    \"tailwindcss\": \"^3.x\",
    \"typescript\": \"^5.x\"
  }
}
```

> **Nota:** `@astrojs/cloudflare` só é necessário se o projeto usar SSR. Como o output é `static`, o deploy no Cloudflare Pages funciona sem adapter — o Cloudflare Pages serve HTML estático nativamente.

---

## 8. Guia de Implementação para Agentes

Esta seção é escrita para agentes executores e desenvolvedores juniores. Seja explícito.

### 8.1 Configuração do Astro (`astro.config.mjs`)

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'static',   // OBRIGATÓRIO — garante zero JS no cliente [Ref: REQ-002]
  integrations: [
    tailwind(),
  ],
});
```

### 8.2 Configuração do Tailwind (`tailwind.config.mjs`)

```javascript
// tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  // ATENÇÃO: As classes de gradiente dinâmicas do tipo Recipe DEVEM estar no safelist [Ref: REQ-006, Caso Limite 7.2]
  safelist: [
    'from-amber-400', 'to-orange-600',
    'from-orange-300', 'to-red-500',
    'from-yellow-400', 'to-amber-600',
    'from-orange-400', 'to-stone-600',
    'from-amber-300', 'to-yellow-600',
    'from-orange-500', 'to-red-700',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],  // título principal
        sans: ['Inter', 'system-ui', 'sans-serif'],       // corpo do texto
      },
    },
  },
  plugins: [],
};
```

### 8.3 Layout Base (`src/layouts/BaseLayout.astro`)

```astro
---
// src/layouts/BaseLayout.astro [Ref: REQ-009, REQ-010]
const { title = 'RecipeHub' } = Astro.props;
---
<!DOCTYPE html>
<html lang=\"pt-BR\">
  <head>
    <meta charset=\"UTF-8\" />
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />
    <title>{title}</title>
    <!-- Fontes: preconnect para performance, display=swap para evitar FOIT [Ref: REQ-010] -->
    <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\" />
    <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin />
    <link
      href=\"https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;500;600&display=swap\"
      rel=\"stylesheet\"
    />
  </head>
  <body class=\"bg-stone-50 text-stone-800 font-sans antialiased\">
    <slot />
  </body>
</html>
```

### 8.4 Estrutura do `index.astro`

```astro
---
// src/pages/index.astro
import BaseLayout from '../layouts/BaseLayout.astro';
import HeroSection from '../components/HeroSection.astro';
import RecipesGrid from '../components/RecipesGrid.astro';
import NewsletterSection from '../components/NewsletterSection.astro';
---
<BaseLayout>
  <HeroSection />
  <RecipesGrid />  <!-- deve ter id=\"recipes\" internamente [Ref: US-002] -->
  <NewsletterSection />
  <footer class=\"text-center py-6 text-stone-400 text-sm\">
    © 2025 RecipeHub. Todos os direitos reservados.
  </footer>
</BaseLayout>
```

### 8.5 Componente `RecipeCard.astro`

```astro
---
// src/components/RecipeCard.astro [Ref: REQ-005, REQ-006]
import type { Recipe } from '../data/recipes';

interface Props {
  recipe: Recipe;
}

const { recipe } = Astro.props;
---
<article class=\"rounded-2xl overflow-hidden bg-white shadow-sm border border-stone-100\">
  <!-- Placeholder com gradiente CSS + emoji [Ref: REQ-006] -->
  <div class={`h-48 bg-gradient-to-br ${recipe.gradientFrom} ${recipe.gradientTo} flex items-center justify-center`}>
    <span class=\"text-6xl\" role=\"img\" aria-label={recipe.title}>{recipe.emoji}</span>
  </div>
  <div class=\"p-4\">
    <span class=\"text-xs font-medium text-amber-600 uppercase tracking-wide\">{recipe.category}</span>
    <h3 class=\"font-serif text-lg font-bold text-stone-800 mt-1\">{recipe.title}</h3>
    <p class=\"text-stone-500 text-sm mt-2 flex items-center gap-1\">
      <span aria-hidden=\"true\">⏱</span>
      {recipe.prepTimeLabel}
    </p>
  </div>
</article>
```

---

## 9. Checklist de Entrega (Definition of Done)

- [ ] `astro build` executa sem erros nem warnings de TypeScript
- [ ] `dist/index.html` existe e contém as 3 seções (Hero, Grid, Newsletter)
- [ ] DevTools → Network: zero arquivos `.js` carregados pelo browser
- [ ] 6 cards de receitas renderizados com gradientes e emojis corretos
- [ ] Link CTA do Hero (`#recipes`) ancora na seção do Grid
- [ ] Formulário de newsletter presente no HTML sem scripts associados
- [ ] Layout responsivo: 1 col mobile / 2 col tablet / 3 col desktop
- [ ] Deploy realizado no Cloudflare Pages via git push
- [ ] URL pública acessível e página carregando corretamente
- [ ] Zero variáveis de ambiente configuradas no painel do Cloudflare Pages
"}}
{"success":true,"message":"File written successfully","path":"architecture/plans/prd-sprint-sp-025.md"}
{"name": "complete_phase", "parameters": {"summary": "Blueprint sp-025 concluído: PRD da landing page estática RecipeHub (Astro standalone + TailwindCSS Warm & Appetizing, 3 seções, zero JS no cliente, deploy Cloudflare Pages) salvo em architecture/plans/prd-sprint-sp-025.md."}}
{"success":true,"message":"Phase completed successfully","phase":"blueprint","sprint":"sp-025"}
PRD salvo com sucesso em `architecture/plans/prd-sprint-sp-025.md`. A Fase 1 (Blueprint) está concluída para o sprint **sp-025**.