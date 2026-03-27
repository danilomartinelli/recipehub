# PRD — Sprint sp-014: RecipeHub Landing Page

> **Status:** Draft  
> **Sprint Code:** sp-014  
> **Criado em:** 2025  
> **Autor:** Witek Blueprint Agent  
> **Deploy Target:** Cloudflare Pages (deploy manual via `wrangler pages deploy dist/`)

---

## 1. Visão Geral & North Star

### Problema
O RecipeHub não possui presença pública. Não há página que explique o produto, apresente receitas e capture o interesse de novos usuários.

### Solução
Uma landing page estática, rápida e sem JavaScript no cliente, construída com Astro e TailwindCSS. Serve como vitrine do produto com três seções: Hero com CTA, Grid de receitas e formulário de Newsletter visual.

### Definição de Concluído (DoD)
- [ ] URL pública no Cloudflare Pages está acessível.
- [ ] As três seções (Hero, Grid de Receitas, Newsletter) são renderizadas corretamente no navegador.
- [ ] O bundle do cliente contém **zero kilobytes de JavaScript** (verificado via DevTools → Network, filtrando por `.js`).
- [ ] O build `astro build` conclui sem erros ou warnings de TypeScript.
- [ ] Deploy executado com sucesso via `wrangler pages deploy dist/`.

---

## 2. Esquema de Dados (SSoT)

> Esta Sprint não utiliza banco de dados, armazenamento R2, KV ou qualquer serviço de backend. Todo o conteúdo é hardcoded diretamente nos componentes `.astro`.

### 2.1 Estrutura de Dados dos Cards de Receita (hardcoded)

Os 6 cards do grid de receitas devem ser definidos como um array de objetos TypeScript dentro do arquivo `src/pages/index.astro` (ou em `src/data/recipes.ts`). Este é o contrato de dados canônico:

```typescript
// src/data/recipes.ts
export interface Recipe {
  id: number;
  title: string;        // Nome da receita
  prepTime: string;     // Ex: \"30 min\"
  category: string;     // Ex: \"Almoço\", \"Sobremesa\"
  imagePlaceholder: string; // Cor de fundo CSS para o placeholder (ex: \"#d1fae5\")
  imageAlt: string;     // Texto alternativo de acessibilidade
}

export const recipes: Recipe[] = [
  {
    id: 1,
    title: \"Risoto de Cogumelos\",
    prepTime: \"40 min\",
    category: \"Almoço\",
    imagePlaceholder: \"#d1fae5\",
    imageAlt: \"Prato de risoto cremoso com cogumelos frescos\",
  },
  {
    id: 2,
    title: \"Salada Caesar Clássica\",
    prepTime: \"15 min\",
    category: \"Entrada\",
    imagePlaceholder: \"#dcfce7\",
    imageAlt: \"Salada Caesar com croutons e parmesão\",
  },
  {
    id: 3,
    title: \"Bolo de Chocolate Úmido\",
    prepTime: \"55 min\",
    category: \"Sobremesa\",
    imagePlaceholder: \"#fef9c3\",
    imageAlt: \"Fatia de bolo de chocolate com cobertura\",
  },
  {
    id: 4,
    title: \"Frango Grelhado com Ervas\",
    prepTime: \"25 min\",
    category: \"Jantar\",
    imagePlaceholder: \"#d1fae5\",
    imageAlt: \"Peito de frango grelhado com ervas frescas\",
  },
  {
    id: 5,
    title: \"Sopa de Tomate Rústica\",
    prepTime: \"35 min\",
    category: \"Entrada\",
    imagePlaceholder: \"#fee2e2\",
    imageAlt: \"Tigela de sopa de tomate com manjericão\",
  },
  {
    id: 6,
    title: \"Tacos de Carnitas\",
    prepTime: \"20 min\",
    category: \"Jantar\",
    imagePlaceholder: \"#fef3c7\",
    imageAlt: \"Tacos de carnitas com guacamole\",
  },
];
```

### 2.2 Estrutura do Formulário de Newsletter (visual only)

O formulário é puramente visual. **Não deve possuir `action` nem handler JavaScript.** Estrutura HTML esperada:

```html
<!-- Sem action, sem onsubmit, sem fetch —— apenas visual -->
<form>
  <input
    type=\"email\"
    placeholder=\"seu@email.com\"
    disabled
    aria-label=\"Endereço de e-mail para newsletter\"
  />
  <button type=\"button\">Quero Receber</button>
</form>
```

> **Nota:** O input deve ter o atributo `disabled` para comunicar claramente que a funcionalidade ainda não está ativa, ou alternativamente pode ser interativo visualmente sem nenhum listener JS.

---

## 3. Histórias de Usuário & Matriz do Avaliador

### US-001: Hero Section com CTA

**Descrição:** Como visitante da landing page, eu quero ver imediatamente o que é o RecipeHub e ter um botão de chamada para ação, para que eu entenda o produto e me sinta convidado a explorar.

**Matriz de Teste do Avaliador:**
- [ ] **Visual:** A seção Hero ocupa pelo menos 60vh na viewport desktop e mobile.
- [ ] **Conteúdo:** Título principal (`<h1>`), subtítulo descritivo e botão CTA com cor de fundo `#22c55e` (green-500) estão presentes no HTML renderizado.
- [ ] **Semântica:** O botão CTA usa a tag `<a>` ou `<button>` com texto descritivo (não genérico como \"Clique aqui\").
- [ ] **Zero JS:** Inspecionando o HTML renderizado, não há tag `<script>` com código de comportamento na seção Hero.
- [ ] **Responsivo:** Em viewport 375px (mobile), o texto não transborda e o layout permanece legível.

---

### US-002: Grid de 6 Cards de Receitas

**Descrição:** Como visitante, eu quero ver uma amostra de 6 receitas disponíveis no RecipeHub, com imagem, título e tempo de preparo, para que eu tenha uma prévia do conteúdo da plataforma.

**Matriz de Teste do Avaliador:**
- [ ] **Contagem:** Exatamente 6 cards são renderizados no DOM (verificável via `document.querySelectorAll('[data-recipe-card]').length === 6`).
- [ ] **Conteúdo por card:** Cada card exibe título da receita, tempo de preparo e um placeholder de imagem (div colorida ou `<img>` com `src` de placeholder).
- [ ] **Layout Desktop:** O grid exibe 3 colunas em viewport ≥ 768px.
- [ ] **Layout Mobile:** O grid exibe 1 coluna (ou 2 colunas) em viewport 375px.
- [ ] **Borda e sombra:** Cada card tem `border` sutil (ex: `border border-gray-200`) e `shadow-sm` aplicados via TailwindCSS.
- [ ] **Zero JS:** Nenhum script de carregamento dinâmico — os 6 cards estão no HTML estático gerado pelo `astro build`.

---

### US-003: Formulário Visual de Newsletter

**Descrição:** Como visitante, eu quero ver uma seção de captura de newsletter para que eu saiba que poderei receber conteúdo do RecipeHub no futuro, mesmo que o envio ainda não esteja funcional.

**Matriz de Teste do Avaliador:**
- [ ] **Visual:** Seção com título de convite, campo de input de email e botão de submit são visíveis no navegador.
- [ ] **Estilo do botão:** Botão usa cor `#22c55e` (green-500) consistente com o CTA do Hero.
- [ ] **Sem ação real:** O formulário não possui atributo `action` apontando para uma URL real e não dispara nenhum `fetch` ou `XMLHttpRequest` (verificável via DevTools → Network ao clicar no botão).
- [ ] **Zero JS:** Nenhuma tag `<script>` associada ao formulário no HTML renderizado.
- [ ] **Responsivo:** Em mobile (375px), o input e o botão estão empilhados verticalmente ou dispostos sem overflow.

---

### US-004: Deploy no Cloudflare Pages

**Descrição:** Como desenvolvedor (agente executor), eu quero fazer o deploy da landing page no Cloudflare Pages via Wrangler CLI, para que a URL pública esteja acessível.

**Matriz de Teste do Avaliador:**
- [ ] **Build:** `pnpm build` (ou `npm run build`) executa `astro build` sem erros e gera a pasta `dist/`.
- [ ] **Deploy:** `wrangler pages deploy dist/ --project-name recipehub-landing` executa sem erros e retorna uma URL `*.pages.dev`.
- [ ] **Acesso público:** A URL retornada pelo Wrangler é acessível via browser sem autenticação.
- [ ] **Zero JS no bundle:** Inspecionando a aba Network do DevTools na URL deployada, nenhum arquivo `.js` é carregado.

---

## 4. Requisitos Funcionais (FR)

### Estrutura & Build

**REQ-001** *(Must)*  
O projeto deve ser um repositório Astro standalone (não monorepo). A estrutura de pastas raiz deve seguir:
```
/
├── public/
├── src/
│   ├── components/
│   │   ├── Hero.astro
│   │   ├── RecipeCard.astro
│   │   ├── RecipeGrid.astro
│   │   └── NewsletterSection.astro
│   ├── data/
│   │   └── recipes.ts
│   ├── layouts/
│   │   └── BaseLayout.astro
│   └── pages/
│       └── index.astro
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── package.json
└── wrangler.toml
```

**REQ-002** *(Must)*  
O `astro.config.mjs` deve configurar `output: 'static'` e NÃO deve incluir nenhum adaptador de servidor (ex: `@astrojs/cloudflare`). O build deve gerar arquivos estáticos puros em `dist/`.

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'static',
  integrations: [tailwind()],
});
```

**REQ-003** *(Must)*  
Nenhum componente `.astro` deve usar a diretiva `client:*` (ex: `client:load`, `client:idle`, `client:visible`). Zero islands de JavaScript são permitidos nesta Sprint.

**REQ-004** *(Must)*  
O `package.json` deve incluir os scripts:
```json
{
  \"scripts\": {
    \"dev\": \"astro dev\",
    \"build\": \"astro build\",
    \"preview\": \"astro preview\"
  }
}
```

---

### Design & Estilo

**REQ-005** *(Must)*  
A paleta de cores deve ser aplicada exclusivamente via classes TailwindCSS utilitárias. A cor de destaque `#22c55e` corresponde a `green-500` no Tailwind. Nenhum arquivo CSS customizado com variáveis `:root` é necessário — usar classes `bg-green-500`, `text-green-500`, `hover:bg-green-600` diretamente.

**REQ-006** *(Must)*  
A página deve ser responsiva com breakpoints `sm` (640px) e `md` (768px) do Tailwind como referência. Layout base é mobile-first. Não é necessário suporte a breakpoints `lg` ou superiores nesta Sprint.

**REQ-007** *(Should)*  
Todos os elementos interativos (botões, links) devem ter estado `hover:` definido via TailwindCSS (ex: `hover:bg-green-600`) para feedback visual sem JavaScript.

---

### Seção Hero (US-001)

**REQ-008** *(Must)*  
O componente `Hero.astro` deve renderizar:
- Um `<h1>` com o título principal do RecipeHub.
- Um parágrafo `<p>` com subtítulo descritivo.
- Um elemento `<a>` com classes de botão (fundo `bg-green-500`, texto branco, padding, border-radius) apontando para a seção de receitas (`href=\"#recipes\"`).

**REQ-009** *(Must)*  
A seção Hero deve ter altura mínima de `min-h-[60vh]` e centralização vertical do conteúdo via `flex items-center justify-center`.

---

### Grid de Receitas (US-002)

**REQ-010** *(Must)*  
O componente `RecipeGrid.astro` deve importar o array `recipes` de `src/data/recipes.ts` e renderizar exatamente 6 cards via iteração `.map()` em tempo de build (Astro template syntax: `{recipes.map(...)}`). 

**REQ-011** *(Must)*  
O componente `RecipeCard.astro` deve receber as props `title`, `prepTime`, `category`, `imagePlaceholder` e `imageAlt` e renderizar:
- Um placeholder de imagem: `<div>` com `style={\\`background-color: ${imagePlaceholder}\\`}` e altura fixa (ex: `h-48`).
- O título da receita em `<h3>`.
- O tempo de preparo com ícone de relógio (SVG inline ou emoji ⏱) e texto `{prepTime}`.
- O atributo `data-recipe-card` na raiz do card para facilitar testes.

**REQ-012** *(Must)*  
O grid deve usar `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6` para responsividade.

**REQ-013** *(Must)*  
Cada card deve ter `rounded-lg border border-gray-200 shadow-sm overflow-hidden bg-white` para borda sutil e elevação leve.

---

### Newsletter (US-003)

**REQ-014** *(Must)*  
O componente `NewsletterSection.astro` deve renderizar um `<form>` com `<input type=\"email\">` e `<button type=\"button\">`. O formulário NÃO deve ter atributo `action`. O botão deve ter `bg-green-500 hover:bg-green-600 text-white`.

**REQ-015** *(Must)*  
A seção Newsletter deve ter fundo diferenciado (ex: `bg-gray-50`) para criar separação visual da seção de receitas.

---

### Deploy (US-004)

**REQ-016** *(Must)*  
O arquivo `wrangler.toml` na raiz do projeto deve ser configurado para Cloudflare Pages:
```toml
name = \"recipehub-landing\"
pages_build_output_dir = \"dist\"
```

**REQ-017** *(Must)*  
O deploy deve ser executado manualmente pelo agente executor (Trigger Phase) com o comando:
```bash
npx wrangler pages deploy dist/ --project-name recipehub-landing
```
Nenhuma variável de ambiente, secret ou binding do Cloudflare é necessário.

---

### Acessibilidade & SEO

**REQ-018** *(Should)*  
O `BaseLayout.astro` deve incluir as meta tags essenciais no `<head>`:
- `<title>RecipeHub — Receitas para Todos</title>`
- `<meta name=\"description\" content=\"Descubra receitas incríveis no RecipeHub. De entradas a sobremesas, temos tudo para sua cozinha.\" />`
- `<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />`
- `<meta charset=\"UTF-8\" />`

**REQ-019** *(Should)*  
Todas as imagens/placeholders devem ter atributo `alt` preenchido (fornecido via prop `imageAlt` de cada recipe no array de dados).

---

## 5. Fora do Escopo (Non-Goals)

Os itens abaixo estão **explicitamente proibidos** nesta Sprint. Qualquer agente que tente implementar um destes itens deve interromper e reportar ao Blueprint:

| # | Item | Justificativa |
|---|------|---------------|
| NG-01 | Backend ou API de qualquer tipo | Landing 100% estática, sem servidor |
| NG-02 | CMS (Contentful, Sanity, Storyblok, etc.) | Conteúdo hardcoded é suficiente para a Sprint |
| NG-03 | Formulário de newsletter funcional (POST real, Resend, Mailchimp) | Sem integração de email nesta Sprint |
| NG-04 | Animações CSS ou JavaScript (scroll animations, transitions complexas) | Fora do escopo visual desta Sprint |
| NG-05 | Dark mode ou toggle de tema | Tema único (light) nesta Sprint |
| NG-06 | Páginas internas (`/receita/[slug]`, `/sobre`, etc.) | Apenas `index.astro` nesta Sprint |
| NG-07 | Integração com APIs externas (OpenAI, Stripe, Auth, etc.) | Zero dependências externas |
| NG-08 | CI/CD (GitHub Actions, Cloudflare Pages auto-deploy) | Deploy manual via Wrangler CLI |
| NG-09 | Variáveis de ambiente ou secrets | Sem configuração de ambiente nesta Sprint |
| NG-10 | Testes automatizados (Vitest, Playwright, Cypress) | Critérios de aceite verificados manualmente |
| NG-11 | Diretivas Astro `client:*` ou React islands | Zero JS no cliente é regra absoluta |
| NG-12 | Breakpoints avançados (`lg`, `xl`, `2xl`) | Mobile + tablet suficiente (`sm`, `md`) |

---

## 6. Cloudflare Bindings & Integrações

### Bindings Cloudflare

> **Nenhum binding necessário.** Esta Sprint não utiliza D1, R2, KV, Queues, Durable Objects ou qualquer serviço Cloudflare além do Pages para hospedagem estática.

### APIs Externas

> **Nenhuma integração externa.** Zero chaves de API, tokens ou secrets necessários.

### Dependências de Desenvolvimento

```json
{
  \"dependencies\": {},
  \"devDependencies\": {
    \"astro\": \"^4.x\",
    \"@astrojs/tailwind\": \"^5.x\",
    \"tailwindcss\": \"^3.x\",
    \"typescript\": \"^5.x\",
    \"wrangler\": \"^3.x\"
  }
}
```

> **Nota para o agente executor:** Antes de adicionar qualquer dependência, verifique se ela é compatível com build estático (sem runtime Node.js necessário). Para esta Sprint, as dependências acima são suficientes.

---

## 7. Restrições & Casos Limite

### R-01: Zero JavaScript no Cliente (Regra Absoluta)
**Restrição:** O HTML final gerado em `dist/` não deve referenciar nenhum arquivo `.js` nem conter blocos `<script>` com lógica de comportamento.  
**Verificação:** Após `astro build`, inspecionar `dist/index.html` — não deve haver tags `<script src=\"...\">` nem `<script>` inline com código funcional.  
**Causa comum de violação:** Usar componentes React sem `client:*` ainda pode injetar JS em algumas versões do Astro. **Solução:** Usar apenas componentes `.astro` puros, sem nenhum framework UI.

### R-02: Build Estático Puro
**Restrição:** `output: 'static'` no `astro.config.mjs` é obrigatório. Nenhum adaptador de servidor pode ser instalado.  
**Causa comum de violação:** Instalar `@astrojs/cloudflare` (adaptador de Workers) incorretamente — este projeto é Pages estático, não Worker.

### R-03: Compatibilidade do Wrangler com Pages
**Restrição:** O comando de deploy usa `wrangler pages deploy`, não `wrangler deploy`.  
**Diferença:** `wrangler deploy` é para Cloudflare Workers (com runtime). `wrangler pages deploy` é para sites estáticos no Cloudflare Pages.  
**Pré-requisito:** O projeto `recipehub-landing` deve ser criado previamente no dashboard Cloudflare Pages, ou o flag `--project-name` criará automaticamente na primeira execução.

### R-04: Placeholder de Imagem sem URLs Externas
**Restrição:** Não use URLs de serviços de placeholder como `picsum.photos`, `placehold.co` ou `via.placeholder.com`. Estes serviços podem estar bloqueados ou gerar requests desnecessários.  
**Solução:** Use `<div>` com `background-color` inline como placeholder, conforme definido em `src/data/recipes.ts` (campo `imagePlaceholder`).

### R-05: TailwindCSS via Integração Astro
**Restrição:** TailwindCSS deve ser instalado via `@astrojs/tailwind` (integração oficial), não configurado manualmente via PostCSS.  
**Razão:** A integração oficial garante purge correto das classes não utilizadas no build estático.

---

## 8. Referências de Implementação

### Estrutura do `BaseLayout.astro`

```astro
---
// src/layouts/BaseLayout.astro
export interface Props {
  title?: string;
  description?: string;
}

const {
  title = 'RecipeHub — Receitas para Todos',
  description = 'Descubra receitas incríveis no RecipeHub.',
} = Astro.props;
---

<!doctype html>
<html lang=\"pt-BR\">
  <head>
    <meta charset=\"UTF-8\" />
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />
    <meta name=\"description\" content={description} />
    <title>{title}</title>
  </head>
  <body class=\"bg-white text-gray-900 font-sans antialiased\">
    <slot />
  </body>
</html>
```

### Estrutura do `index.astro`

```astro
---
// src/pages/index.astro
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/Hero.astro';
import RecipeGrid from '../components/RecipeGrid.astro';
import NewsletterSection from '../components/NewsletterSection.astro';
---

<BaseLayout>
  <main>
    <Hero />
    <section id=\"recipes\">
      <RecipeGrid />
    </section>
    <NewsletterSection />
  </main>
</BaseLayout>
```

### Estrutura do `RecipeCard.astro`

```astro
---
// src/components/RecipeCard.astro
export interface Props {
  title: string;
  prepTime: string;
  category: string;
  imagePlaceholder: string;
  imageAlt: string;
}

const { title, prepTime, category, imagePlaceholder, imageAlt } = Astro.props;
---

<article
  data-recipe-card
  class=\"rounded-lg border border-gray-200 shadow-sm overflow-hidden bg-white\"
>
  <div
    class=\"h-48 w-full\"
    style={`background-color: ${imagePlaceholder}`}
    role=\"img\"
    aria-label={imageAlt}
  ></div>
  <div class=\"p-4\">
    <span class=\"text-xs font-medium text-green-600 uppercase tracking-wide\">
      {category}
    </span>
    <h3 class=\"mt-1 text-lg font-semibold text-gray-900\">{title}</h3>
    <p class=\"mt-2 text-sm text-gray-500 flex items-center gap-1\">
      <span aria-hidden=\"true\">⏱</span>
      {prepTime}
    </p>
  </div>
</article>
```

---

## Checklist de Handoff para o Agente Executor

Antes de iniciar a implementação, o agente executor deve confirmar:

- [ ] Leu este PRD integralmente.
- [ ] Criou o projeto no Cloudflare Pages Dashboard (ou confirmou que `--project-name` criará automaticamente).
- [ ] Possui o Wrangler CLI instalado e autenticado (`wrangler login`).
- [ ] Compreende que zero JS no cliente é uma regra absoluta e inegociável.
- [ ] Compreende que `output: 'static'` é obrigatório no `astro.config.mjs`.
- [ ] Compreende que os 6 cards de receitas são hardcoded — não há CMS ou API a configurar.
- [ ] Compreende que o formulário de newsletter é puramente visual — nenhum handler de submit deve ser implementado.
"}}
</tool_call>
<tool_response>
File written successfully: architecture/plans/prd-sprint-sp-014.md
</tool_response>

<tool_call>
{"name": "complete_phase", "parameters": {"summary": "PRD sp-014 gerado: landing page estática Astro standalone (Hero + Grid 6 cards hardcoded + Newsletter visual), zero JS no cliente, TailwindCSS + verde #22c55e, deploy manual via wrangler pages deploy dist/."}}
</tool_call>
<tool_response>
Phase completed successfully.
</tool_response>