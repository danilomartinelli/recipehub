# PRD — Sprint sp-011: RecipeHub Landing Page Estática

## 1. Visão Geral & North Star

**Produto:** RecipeHub  
**Sprint Goal:** Criar uma landing page estática e funcional para o RecipeHub usando Astro, com deploy no Cloudflare Pages.  
**Problema que resolve:** O RecipeHub ainda não possui presença web. Esta sprint entrega a vitrine pública mínima do produto — uma página que comunica o valor da plataforma e coleta interesse via formulário visual de newsletter.  
**Estado de Concluído (Definition of Done):** A URL de deploy no Cloudflare Pages retorna HTTP 200 com uma página contendo exatamente: (1) Hero section com título e CTA, (2) grid de 6 cards de receitas com imagem e tempo de preparo, (3) formulário visual de newsletter. Zero JavaScript executado no cliente. Lighthouse Performance Score ≥ 95 em mobile.

---

## 2. Esquema de Dados (SSoT — Fonte Única da Verdade)

Esta sprint **não utiliza banco de dados, KV, R2 ou qualquer binding Cloudflare**. Todos os dados são estáticos e hardcoded diretamente nos componentes Astro.

### 2.1 Estrutura de Diretórios do Projeto

```
recipehub-web/              ← root do repositório standalone
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Hero.astro
│   │   ├── RecipeCard.astro
│   │   ├── RecipeGrid.astro
│   │   └── NewsletterForm.astro
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   └── index.astro
│   └── styles/
│       └── global.css
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── package.json
└── wrangler.toml              ← config mínimo para Cloudflare Pages
```

### 2.2 Dados Hardcoded — Recipe Cards

Os 6 cards são definidos como um array TypeScript dentro do componente `RecipeGrid.astro` (ou arquivo de dados separado `src/data/recipes.ts`). Estrutura do objeto:

```typescript
// src/data/recipes.ts
export interface Recipe {
  id: number;
  title: string;
  prepTime: string;   // ex: \"30 min\"
  imageUrl: string;   // URL do picsum.photos
  imageAlt: string;
}

export const recipes: Recipe[] = [
  {
    id: 1,
    title: \"Risoto de Cogumelos\",
    prepTime: \"35 min\",
    imageUrl: \"https://picsum.photos/seed/risoto/400/300\",
    imageAlt: \"Prato de risoto de cogumelos ao molho\",
  },
  {
    id: 2,
    title: \"Salada Mediterrânea\",
    prepTime: \"15 min\",
    imageUrl: \"https://picsum.photos/seed/salada/400/300\",
    imageAlt: \"Salada fresca com tomate e azeitonas\",
  },
  {
    id: 3,
    title: \"Macarrão ao Pesto\",
    prepTime: \"20 min\",
    imageUrl: \"https://picsum.photos/seed/pesto/400/300\",
    imageAlt: \"Macarrão verde ao molho pesto\",
  },
  {
    id: 4,
    title: \"Frango Assado com Ervas\",
    prepTime: \"60 min\",
    imageUrl: \"https://picsum.photos/seed/frango/400/300\",
    imageAlt: \"Frango dourado assado com ervas frescas\",
  },
  {
    id: 5,
    title: \"Sopa de Tomate\",
    prepTime: \"25 min\",
    imageUrl: \"https://picsum.photos/seed/sopa/400/300\",
    imageAlt: \"Sopa de tomate cremosa com manjericão\",
  },
  {
    id: 6,
    title: \"Brownie de Chocolate\",
    prepTime: \"45 min\",
    imageUrl: \"https://picsum.photos/seed/brownie/400/300\",
    imageAlt: \"Brownie de chocolate com calda\",
  },
];
```

> **Nota:** O parâmetro `seed` na URL do picsum (`/seed/{palavra}/`) garante que a mesma imagem seja retornada em cada build, evitando imagens aleatórias a cada reload.

### 2.3 Design Tokens (Paleta)

```javascript
// tailwind.config.mjs — extend.colors
colors: {
  brand: {
    green: \"#22c55e\",      // accent principal (green-500 do Tailwind)
    \"green-hover\": \"#16a34a\", // hover do CTA (green-600)
  },
}
```

---

## 3. Histórias de Usuário & Matriz do Avaliador

### US-001: Hero Section

**Descrição:** Como visitante, eu quero ver uma seção hero com título impactante e botão de CTA para que eu compreenda imediatamente o propósito do RecipeHub e seja convidado a explorar.  
**Prioridade:** MUST

**Matriz de Teste do Avaliador:**
- [ ] **Visual/HTML:** A página renderiza um `<section>` com `<h1>` contendo o nome e tagline do RecipeHub
- [ ] **CTA:** Existe um `<a>` ou `<button>` com texto de chamada para ação (ex: \"Explorar Receitas\") com background `#22c55e`
- [ ] **Zero JS:** O DevTools → Network não carrega nenhum arquivo `.js` (exceto scripts inline do Astro, que devem ser zero)
- [ ] **Responsividade:** A hero section é legível e não quebra layout em viewport de 375px (mobile) e 1280px (desktop)

---

### US-002: Grid de Receitas

**Descrição:** Como visitante, eu quero ver um grid com 6 cards de receitas com imagem e tempo de preparo para que eu tenha uma amostra do conteúdo disponível na plataforma.  
**Prioridade:** MUST

**Matriz de Teste do Avaliador:**
- [ ] **Contagem:** Exatamente 6 cards são renderizados no DOM
- [ ] **Imagem:** Cada card contém um `<img>` com `src` apontando para `https://picsum.photos/seed/{seed}/400/300` e atributo `alt` preenchido
- [ ] **Tempo de Preparo:** Cada card exibe o tempo de preparo (ex: \"35 min\") em texto visível
- [ ] **Layout Grid:** Em desktop (≥ 768px), os cards se organizam em 3 colunas; em mobile, em 1 coluna
- [ ] **Performance:** Imagens possuem atributo `loading=\"lazy\"` e `decoding=\"async\"`

---

### US-003: Formulário Visual de Newsletter

**Descrição:** Como visitante, eu quero ver um formulário de inscrição de newsletter para que eu sinta que posso me conectar com o RecipeHub no futuro.  
**Prioridade:** MUST

**Matriz de Teste do Avaliador:**
- [ ] **HTML:** Existe um elemento `<form>` com campo `<input type=\"email\">` e um `<button type=\"submit\">`
- [ ] **Sem Action:** O `<form>` não possui atributo `action` configurado — é puramente visual
- [ ] **Zero JS:** Nenhum event listener ou script JavaScript é adicionado ao formulário
- [ ] **Visual:** O botão de submit usa o accent color `#22c55e` e o input possui `placeholder` descritivo (ex: \"seu@email.com\")
- [ ] **Acessibilidade:** O `<input>` possui `<label>` associado via `for`/`id` ou é envolvido por um `<label>`

---

### US-004: Layout Base e Deploy

**Descrição:** Como desenvolvedor, eu quero que o projeto Astro esteja configurado corretamente com TailwindCSS e deploy no Cloudflare Pages para que o site seja acessível via URL pública.  
**Prioridade:** MUST

**Matriz de Teste do Avaliador:**
- [ ] **Build:** `pnpm build` (ou `npm run build`) executa sem erros e gera a pasta `dist/`
- [ ] **Output Estático:** `astro.config.mjs` define `output: 'static'` e `adapter: cloudflare()` (ou sem adapter para Pages estático puro)
- [ ] **TailwindCSS:** Classes Tailwind são corretamente aplicadas no output final (verificar HTML gerado em `dist/`)
- [ ] **Deploy:** O projeto faz deploy bem-sucedido no Cloudflare Pages via `wrangler pages deploy dist/` ou integração Git
- [ ] **HTTP 200:** A URL pública retorna status 200 com `Content-Type: text/html`

---

## 4. Requisitos Funcionais (FR)

### Layout & Estrutura

**REQ-001** (MUST) — O projeto deve ser um repositório Astro standalone (não monorepo), inicializado com `npm create astro@latest` ou equivalente, com TypeScript habilitado.

**REQ-002** (MUST) — O arquivo `astro.config.mjs` deve definir `output: 'static'`. Nenhum SSR ou adapter de servidor deve ser configurado — o site é 100% estático.

**REQ-003** (MUST) — TailwindCSS deve ser integrado via `@astrojs/tailwind` com o arquivo `tailwind.config.mjs` na raiz. O arquivo `src/styles/global.css` deve importar as diretivas Tailwind (`@tailwind base; @tailwind components; @tailwind utilities;`).

**REQ-004** (MUST) — O `tailwind.config.mjs` deve estender a paleta padrão com a cor de accent `brand.green: \"#22c55e\"` e `brand.green-hover: \"#16a34a\"`.

**REQ-005** (MUST) — Deve existir um componente `src/layouts/BaseLayout.astro` que encapsula o `<html>`, `<head>` (com meta charset, viewport, title e description) e `<body>`. Todas as páginas usam este layout.

### Componentes

**REQ-006** (MUST) — `src/components/Hero.astro` deve renderizar:
  - Um `<h1>` com o texto: \"Descubra Receitas que Inspiram\"
  - Um `<p>` com subtítulo: \"Milhares de receitas para todos os gostos, níveis e ocasiões.\"
  - Um `<a href=\"#receitas\">` com texto \"Explorar Receitas\", background `#22c55e`, texto branco, padding generoso e border-radius.

**REQ-007** (MUST) — `src/data/recipes.ts` deve exportar o array `recipes` com exatamente 6 objetos do tipo `Recipe` conforme definido na Seção 2.2. Os `imageUrl` devem usar o padrão `https://picsum.photos/seed/{seed}/400/300` com seeds únicos por card.

**REQ-008** (MUST) — `src/components/RecipeCard.astro` deve aceitar uma `Recipe` como prop e renderizar:
  - `<img>` com `src`, `alt`, `loading=\"lazy\"`, `decoding=\"async\"`, `width=\"400\"`, `height=\"300\"`
  - `<h3>` com o título da receita
  - Um elemento (ex: `<span>` ou `<p>`) exibindo o tempo de preparo com um ícone de relógio (pode ser emoji ⏱ ou SVG inline)

**REQ-009** (MUST) — `src/components/RecipeGrid.astro` deve:
  - Importar o array `recipes` de `src/data/recipes.ts`
  - Iterar sobre os dados com `{recipes.map(...)}` dentro do template Astro
  - Renderizar os cards em um `<div>` com grid CSS (`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`)
  - Incluir um `id=\"receitas\"` no container do grid para que o CTA do Hero funcione como âncora

**REQ-010** (MUST) — `src/components/NewsletterForm.astro` deve renderizar:
  - Um `<section>` com fundo diferenciado (ex: `bg-gray-50`) para destacar a seção
  - Um `<h2>` com texto: \"Receba Receitas Toda Semana\"
  - Um `<p>` descritivo abaixo do título
  - Um `<form>` **sem** atributo `action` e **sem** atributo `method`
  - Um `<label>` com `for=\"email\"` e texto \"Seu e-mail\"
  - Um `<input type=\"email\" id=\"email\" name=\"email\" placeholder=\"seu@email.com\" required>`
  - Um `<button type=\"submit\">` com texto \"Inscrever-se\" e estilo de accent color

### Performance & Qualidade

**REQ-011** (MUST) — Zero arquivos JavaScript devem ser enviados ao cliente. Verificar com: após `pnpm build`, nenhum arquivo `.js` deve ser referenciado no HTML de `dist/index.html` (exceto scripts internos do Astro que são automaticamente removidos em modo estático sem `client:*` directives).

**REQ-012** (MUST) — Todos os componentes Astro devem usar apenas a sintaxe de template Astro (`.astro`). Nenhum componente React, Vue ou Svelte deve ser importado — isso garantirá zero JS no cliente sem esforço adicional.

**REQ-013** (SHOULD) — A página deve ter uma meta description relevante no `<head>` via o componente `BaseLayout.astro`.

**REQ-014** (SHOULD) — O `<html>` deve ter o atributo `lang=\"pt-BR\"` para acessibilidade e SEO.

### Deploy

**REQ-015** (MUST) — O projeto deve conter um arquivo `wrangler.toml` mínimo configurado para Cloudflare Pages:

```toml
name = \"recipehub-web\"
pages_build_output_dir = \"dist\"
```

**REQ-016** (MUST) — O script de build no `package.json` deve ser `\"build\": \"astro build\"` e o script de preview `\"preview\": \"astro preview\"`.

---

## 5. Fora do Escopo (Non-Goals)

Os itens abaixo são **explicitamente proibidos** nesta sprint. Qualquer implementação destes itens representa scope creep e deve ser rejeitada na revisão.

| # | Item | Motivo da Exclusão |
|---|------|--------------------|
| NG-01 | Menu de navegação mobile (hambúrguer) | Requer JavaScript para toggle — viola REQ-011 |
| NG-02 | Animações CSS (fade-in, scroll-triggered) | Adiciona complexidade sem valor funcional nesta fase |
| NG-03 | Páginas internas (ex: `/receita/[slug]`, `/about`) | Fora do escopo de \"apenas index\" definido na entrevista |
| NG-04 | Rota de API para submissão real da newsletter | Backend de newsletter é sprint futura |
| NG-05 | Autenticação ou área de usuário | Funcionalidade de produto, não de landing |
| NG-06 | CMS ou dados dinâmicos | Todos os dados são hardcoded nesta sprint |
| NG-07 | Componentes React/Vue/Svelte com `client:*` | Violaria a regra de zero JS no cliente |
| NG-08 | Testes automatizados (Playwright, Vitest) | Não definido como critério desta sprint |
| NG-09 | SEO avançado (sitemap, robots.txt, OG tags dinâmicas) | Pode ser adicionado em sprint de otimização futura |
| NG-10 | Analytics ou scripts de tracking | Adicionaria JavaScript ao cliente |

---

## 6. Cloudflare Bindings & Integrações

**Bindings Cloudflare:** Nenhum. Esta sprint não utiliza D1, KV, R2, Queues ou qualquer binding Cloudflare.

**APIs Externas:**
- **picsum.photos** — Serviço de imagens placeholder público. Nenhuma autenticação necessária. URLs no formato `https://picsum.photos/seed/{seed}/400/300`. Não requer variáveis de ambiente.

**Variáveis de Ambiente:** Nenhuma. O projeto não possui segredos ou configurações de ambiente.

**Deploy:** Cloudflare Pages via `wrangler pages deploy dist/` ou integração direta com repositório Git (GitHub/GitLab) no dashboard da Cloudflare.

---

## 7. Restrições & Casos Limite

### Restrições Técnicas

**RT-01 — Zero JavaScript no Cliente (Absoluto):**  
Nenhuma diretiva `client:load`, `client:idle`, `client:visible` ou `client:only` pode ser usada em nenhum componente. Todos os componentes devem ser puramente Astro (`.astro`) sem hidratação.

**RT-02 — Sem Node.js APIs:**  
Embora o build do Astro rode em Node.js localmente, nenhum código deve depender de APIs Node.js (`fs`, `path`) de forma que quebre o output estático. Usar apenas ESM imports.

**RT-03 — Compatibilidade de Imagens do picsum.photos:**  
Usar sempre o padrão `/seed/{palavra}/largura/altura` (não `/id/{numero}/`) para garantir imagens determinísticas (mesma imagem a cada build). O seed deve ser uma palavra em inglês sem espaços ou caracteres especiais.

**RT-04 — Estrutura de Grid Responsiva:**  
O grid deve usar as classes Tailwind: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`. Não implementar breakpoints customizados fora do padrão Tailwind para manter simplicidade.

**RT-05 — Fonte Tipográfica:**  
Usar a pilha de fontes sans-serif nativa do sistema via Tailwind (`font-sans`), que resolve para: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, ...`. Não importar Google Fonts ou qualquer fonte externa — isso adicionaria uma requisição de rede e potencial bloqueio de renderização.

### Casos Limite

**CL-01 — picsum.photos Indisponível:**  
Se o serviço picsum.photos estiver fora do ar, o `<img>` renderizará com imagem quebrada. Mitigação: o atributo `alt` descritivo garante que o conteúdo seja compreensível mesmo sem imagem. Não é necessário implementar fallback nesta sprint (NG scope).

**CL-02 — Formulário Submetido pelo Usuário:**  
O `<form>` sem `action` irá recarregar a própria página ao ser submetido (comportamento padrão do navegador). Isso é aceitável nesta sprint — o form é puramente visual e o comportamento de reload não causa dano ao usuário.

**CL-03 — Versão do Astro:**  
Usar Astro v4.x (versão estável mais recente no momento da sprint). Não usar Astro v3.x ou v5 beta.

---

## 8. Referências de Implementação

### Configuração do astro.config.mjs

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'static',
  integrations: [tailwind()],
});
```

### Estrutura do BaseLayout.astro

```astro
---
// src/layouts/BaseLayout.astro
interface Props {
  title?: string;
  description?: string;
}

const {
  title = \"RecipeHub — Descubra Receitas que Inspiram\",
  description = \"Milhares de receitas para todos os gostos, níveis e ocasiões.\"
} = Astro.props;
---

<!doctype html>
<html lang=\"pt-BR\">
  <head>
    <meta charset=\"UTF-8\" />
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />
    <meta name=\"description\" content={description} />
    <title>{title}</title>
    <link rel=\"icon\" type=\"image/svg+xml\" href=\"/favicon.svg\" />
  </head>
  <body class=\"bg-white text-gray-900 font-sans antialiased\">
    <slot />
  </body>
</html>
```

### Estrutura do index.astro

```astro
---
// src/pages/index.astro
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/Hero.astro';
import RecipeGrid from '../components/RecipeGrid.astro';
import NewsletterForm from '../components/NewsletterForm.astro';
---

<BaseLayout>
  <main>
    <Hero />
    <RecipeGrid />
    <NewsletterForm />
  </main>
</BaseLayout>
```

### Estrutura do RecipeCard.astro

```astro
---
// src/components/RecipeCard.astro
import type { Recipe } from '../data/recipes';

interface Props {
  recipe: Recipe;
}

const { recipe } = Astro.props;
---

<article class=\"rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow\">
  <img
    src={recipe.imageUrl}
    alt={recipe.imageAlt}
    width=\"400\"
    height=\"300\"
    loading=\"lazy\"
    decoding=\"async\"
    class=\"w-full h-48 object-cover\"
  />
  <div class=\"p-4\">
    <h3 class=\"font-semibold text-gray-900 text-lg mb-2\">{recipe.title}</h3>
    <p class=\"text-sm text-gray-500\">
      <span aria-label=\"Tempo de preparo\">⏱</span>
      {recipe.prepTime}
    </p>
  </div>
</article>
```

---

## Checklist de Aceite Final (QA Gate)

Antes de considerar a sprint concluída, todos os itens abaixo devem ser verificados:

- [ ] `pnpm build` (ou `npm run build`) executa sem erros ou warnings críticos
- [ ] `dist/index.html` não contém referências a arquivos `.js`
- [ ] A página renderiza corretamente em viewport 375px (iPhone SE) e 1280px (desktop)
- [ ] Exatamente 6 cards de receitas são exibidos com imagens e tempo de preparo
- [ ] O formulário de newsletter possui campo de email com label e botão de submit
- [ ] O botão CTA do Hero possui a cor `#22c55e`
- [ ] Deploy no Cloudflare Pages retorna HTTP 200
- [ ] Nenhum componente React, Vue ou Svelte foi importado
- [ ] Todas as imagens possuem atributo `alt` descritivo
- [ ] O `<html>` possui `lang=\"pt-BR\"`
"}}
</tool_call>
<tool_response>
File written successfully.
</tool_response>

<tool_call>
{"name": "complete_phase", "parameters": {"summary": "PRD sp-011 gerado: landing page estática RecipeHub com Hero, grid de 6 cards (picsum.photos) e newsletter visual — zero JS no cliente, Astro standalone + TailwindCSS, deploy Cloudflare Pages."}}
</tool_call>
<tool_response>
Phase marked as complete.
</tool_response>

PRD salvo em `architecture/plans/prd-sprint-sp-011.md` e fase Blueprint concluída.