# PRD — Sprint sp-013: RecipeHub Landing Page Estática

> **Documento gerado por:** Witek Blueprint Agent  
> **Sprint Code:** sp-013  
> **Status:** Aprovado para Execução  
> **Última atualização:** 2025  

---

## 1. Visão Geral & North Star

### Problema
O RecipeHub não possui presença web pública. Usuários e potenciais assinantes não têm um ponto de entrada para descobrir o produto.

### Solução
Criar uma landing page estática de alta performance, servida pelo Cloudflare Pages, que comunica a proposta de valor do RecipeHub, exibe uma amostra de receitas e captura leads via formulário de newsletter (visual, sem backend nesta Sprint).

### Definition of Done (DoD)
- `astro build` completa sem erros, gerando HTML/CSS puro em `dist/`
- Zero JavaScript enviado ao cliente (verificável via DevTools → Sources)
- Deploy funcional no Cloudflare Pages com URL pública acessível via `wrangler pages deploy dist/`
- As 3 seções são visíveis e funcionais: Hero, Grid de Receitas, Newsletter
- Responsivo em mobile (375px) e desktop (1280px)
- SEO básico presente: `<title>`, `<meta name=\"description\">`, e favicon

---

## 2. Esquema de Dados (SSoT)

> Esta Sprint é 100% estática. **Não há banco D1, R2 Storage, KV Cache ou Queues.** Todo conteúdo é hardcoded nos componentes Astro.

### 2.1 Estrutura de Dados Hardcoded

Os 6 cards de receitas devem seguir este contrato de dados interno (definido como um array TypeScript dentro do componente):

```typescript
// src/data/recipes.ts
export interface Recipe {
  id: number;
  title: string;        // Ex: \"Risoto de Cogumelos\"
  prepTime: string;     // Ex: \"30 min\"
  imageAlt: string;     // Texto alternativo para acessibilidade
  imagePlaceholder: string; // URL do placeholder (ex: via Picsum ou SVG inline)
  category: string;     // Ex: \"Massas\", \"Saladas\", \"Sobremesas\"
}

export const FEATURED_RECIPES: Recipe[] = [
  { id: 1, title: \"Risoto de Cogumelos\",      prepTime: \"35 min\", category: \"Massas\",     imageAlt: \"Risoto de cogumelos cremoso\",       imagePlaceholder: \"https://picsum.photos/seed/recipe1/400/300\" },
  { id: 2, title: \"Salada Caesar Clássica\",   prepTime: \"15 min\", category: \"Saladas\",    imageAlt: \"Salada Caesar com croutons\",         imagePlaceholder: \"https://picsum.photos/seed/recipe2/400/300\" },
  { id: 3, title: \"Bolo de Chocolate Úmido\",  prepTime: \"50 min\", category: \"Sobremesas\", imageAlt: \"Bolo de chocolate com cobertura\",    imagePlaceholder: \"https://picsum.photos/seed/recipe3/400/300\" },
  { id: 4, title: \"Frango ao Limão\",           prepTime: \"40 min\", category: \"Carnes\",     imageAlt: \"Frango grelhado com ervas e limão\",  imagePlaceholder: \"https://picsum.photos/seed/recipe4/400/300\" },
  { id: 5, title: \"Sopa de Abóbora\",          prepTime: \"25 min\", category: \"Sopas\",      imageAlt: \"Sopa cremosa de abóbora\",           imagePlaceholder: \"https://picsum.photos/seed/recipe5/400/300\" },
  { id: 6, title: \"Tacos de Carnitas\",        prepTime: \"60 min\", category: \"Mexicana\",   imageAlt: \"Tacos recheados com carnitas\",      imagePlaceholder: \"https://picsum.photos/seed/recipe6/400/300\" },
];
```

### 2.2 Paleta de Cores (Design Tokens via Tailwind)

Configurar em `tailwind.config.mjs`:

```javascript
colors: {
  brand: {
    green:     '#22c55e', // CTA principal, accent
    'green-h': '#16a34a', // hover do CTA
  },
  neutral: {
    50:  '#fafafa', // fundo geral
    100: '#f5f5f5', // fundo de cards
    200: '#e5e5e5', // bordas
    400: '#a3a3a3', // texto secundário
    700: '#404040', // texto corpo
    900: '#171717', // texto título
  },
}
```

### 2.3 Estrutura de Arquivos do Projeto

```
recipehub-landing/          ← raiz do repositório standalone
├── src/
│   ├── data/
│   │   └── recipes.ts      ← Dados hardcoded das 6 receitas
│   ├── components/
│   │   ├── Hero.astro
│   │   ├── RecipeCard.astro
│   │   ├── RecipeGrid.astro
│   │   └── NewsletterForm.astro
│   ├── layouts/
│   │   └── BaseLayout.astro ← <head> com SEO, favicon, TailwindCSS
│   └── pages/
│       └── index.astro      ← Página principal que compõe as seções
├── public/
│   └── favicon.svg
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── package.json
└── wrangler.toml
```

---

## 3. Histórias de Usuário & Matriz do Avaliador

### US-001: Hero Section com CTA

**Descrição:** Como visitante do RecipeHub, eu quero ver uma seção hero clara com título impactante e botão de chamada para ação para que eu entenda imediatamente o valor da plataforma.

**Matriz de Teste do Avaliador:**
- [ ] **Build:** `astro build` conclui sem erros; o HTML gerado em `dist/index.html` contém a seção `<section id=\"hero\">`
- [ ] **Conteúdo:** Título principal (`<h1>`), subtítulo descritivo e botão CTA com texto e cor verde `#22c55e` estão presentes no HTML estático
- [ ] **Zero JS:** DevTools → Sources não exibe nenhum arquivo `.js` carregado do domínio
- [ ] **Responsivo:** Em 375px o texto e CTA estão legíveis e não há overflow horizontal; em 1280px o layout utiliza largura máxima centralizada (`max-w-6xl`)

---

### US-002: Grid de 6 Cards de Receitas

**Descrição:** Como visitante, eu quero ver uma grade com 6 receitas em destaque, cada uma com imagem, título, categoria e tempo de preparo, para que eu tenha uma amostra do conteúdo disponível.

**Matriz de Teste do Avaliador:**
- [ ] **Build:** O HTML final contém exatamente 6 elementos com a classe `recipe-card` (ou equivalente)
- [ ] **Conteúdo:** Cada card exibe: imagem placeholder (via Picsum), título da receita, badge de categoria e tempo de preparo com ícone de relógio
- [ ] **Dados:** Os 6 cards correspondem exatamente ao array `FEATURED_RECIPES` definido em `src/data/recipes.ts` — sem dados duplicados ou faltantes
- [ ] **Layout:** Em desktop (1280px) exibe grid de 3 colunas; em tablet (768px) exibe 2 colunas; em mobile (375px) exibe 1 coluna
- [ ] **Acessibilidade:** Cada `<img>` possui atributo `alt` preenchido com o valor de `imageAlt` da receita

---

### US-003: Formulário Visual de Newsletter

**Descrição:** Como visitante interessado, eu quero ver um formulário de inscrição de newsletter com campo de email e botão de submit para que eu possa expressar interesse em receber conteúdo do RecipeHub.

**Matriz de Teste do Avaliador:**
- [ ] **Build:** O HTML contém `<form>` com `<input type=\"email\">` e `<button type=\"submit\">` dentro de `<section id=\"newsletter\">`
- [ ] **Visual:** Seção com fundo diferenciado (verde claro ou cinza), título, subtítulo e o formulário centrados
- [ ] **Sem backend:** O `<form>` NÃO possui `action` apontando para uma URL de API real — pode ter `action=\"#\"` ou ser puramente visual (sem `method` definido)
- [ ] **Zero JS:** Nenhum event listener JavaScript é registrado para o submit do formulário
- [ ] **Responsivo:** Em 375px o input e botão ocupam largura total; em 1280px o formulário tem largura máxima contida

---

### US-004: SEO Básico, Favicon e Meta Tags

**Descrição:** Como dono do produto, eu quero que a landing page tenha metadados básicos de SEO e um favicon para que a página seja indexável e identificável nos browsers.

**Matriz de Teste do Avaliador:**
- [ ] **Build:** O `<head>` do HTML gerado contém `<title>RecipeHub — Receitas para Todos os Gostos</title>`
- [ ] **SEO:** `<meta name=\"description\" content=\"...\">` presente com texto descritivo (máx. 160 caracteres)
- [ ] **Favicon:** Arquivo `public/favicon.svg` existe e é referenciado via `<link rel=\"icon\" type=\"image/svg+xml\" href=\"/favicon.svg\">`
- [ ] **Encoding:** `<meta charset=\"UTF-8\">` e `<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">` presentes

---

### US-005: Deploy via Wrangler CLI

**Descrição:** Como agente de execução (Trigger Phase), eu quero executar o deploy da landing page no Cloudflare Pages via Wrangler CLI para que a URL pública fique acessível.

**Matriz de Teste do Avaliador:**
- [ ] **Build local:** `pnpm build` (ou `npx astro build`) executa sem erros e gera o diretório `dist/`
- [ ] **Wrangler config:** `wrangler.toml` existe na raiz com `name = \"recipehub-landing\"` e `pages_build_output_dir = \"dist\"`
- [ ] **Deploy:** Comando `wrangler pages deploy dist/ --project-name recipehub-landing` executa com sucesso e retorna URL pública
- [ ] **Verificação:** URL pública retorna HTTP 200 e o HTML da landing page é servido corretamente

---

## 4. Requisitos Funcionais (FR)

### Configuração do Projeto

**REQ-001** *(MUST)* — Inicializar projeto Astro standalone com template mínimo (`astro add`), TypeScript habilitado e integração oficial do TailwindCSS (`@astrojs/tailwind`).

**REQ-002** *(MUST)* — Configurar `astro.config.mjs` com `output: 'static'` (modo SSG — Static Site Generation) para garantir que NENHUM JavaScript de servidor ou runtime seja enviado ao cliente.

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'static',
  integrations: [tailwind()],
});
```

**REQ-003** *(MUST)* — Criar `tailwind.config.mjs` com os design tokens da seção 2.2 (cores `brand` e `neutral`) e configurar `content` para incluir `./src/**/*.{astro,ts}`.

**REQ-004** *(MUST)* — Criar `src/data/recipes.ts` com a interface `Recipe` e o array `FEATURED_RECIPES` exatamente como definido na seção 2.1.

### Layout e Componentes

**REQ-005** *(MUST)* — Criar `src/layouts/BaseLayout.astro` que aceite props `title` e `description` e renderize o `<head>` completo: charset, viewport, título, meta description, link do favicon e os estilos do TailwindCSS.

**REQ-006** *(MUST)* — Criar `src/components/Hero.astro` com:
  - `<h1>` com título principal do RecipeHub
  - Parágrafo de subtítulo descritivo (máx. 2 linhas)
  - Botão CTA com fundo `brand.green` e texto branco, com estado hover `brand.green-h`
  - Nenhuma prop dinâmica — conteúdo hardcoded no componente [Ref: REQ-002]

**REQ-007** *(MUST)* — Criar `src/components/RecipeCard.astro` que receba uma prop do tipo `Recipe` (importada de `src/data/recipes.ts`) e renderize: imagem placeholder, badge de categoria, título e tempo de preparo com ícone SVG de relógio inline.

**REQ-008** *(MUST)* — Criar `src/components/RecipeGrid.astro` que importe `FEATURED_RECIPES`, itere sobre o array com `Astro.glob` ou loop nativo do Astro (`map`), e renderize 6 instâncias de `RecipeCard`. Layout em grid responsivo: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`. [Ref: US-002]

**REQ-009** *(MUST)* — Criar `src/components/NewsletterForm.astro` com:
  - Seção com fundo diferenciado (ex: `bg-neutral-100`)
  - `<h2>` com chamada para ação
  - `<p>` com subtítulo explicativo
  - `<form action=\"#\">` com `<input type=\"email\" placeholder=\"seu@email.com\" required>` e `<button type=\"submit\">` com estilo verde
  - **PROIBIDO** qualquer tag `<script>` dentro deste componente [Ref: REQ-002]

**REQ-010** *(MUST)* — Criar `src/pages/index.astro` que importe e componha os componentes na ordem: `<Hero />`, `<RecipeGrid />`, `<NewsletterForm />`, todos envolvidos pelo `<BaseLayout>`.

### Assets e SEO

**REQ-011** *(MUST)* — Criar `public/favicon.svg` com um ícone simples representando o RecipeHub (ex: ícone de garfo/faca ou chapéu de chef em SVG inline, monocromático verde `#22c55e`).

**REQ-012** *(MUST)* — O `<title>` da página deve ser `\"RecipeHub — Receitas para Todos os Gostos\"` e a `<meta name=\"description\">` deve ter entre 120–160 caracteres descrevendo a plataforma.

### Deploy

**REQ-013** *(MUST)* — Criar `wrangler.toml` na raiz com:

```toml
name = \"recipehub-landing\"
pages_build_output_dir = \"dist\"
```

**REQ-014** *(MUST)* — O comando de deploy a ser executado na Trigger Phase é:
```bash
npx astro build && wrangler pages deploy dist/ --project-name recipehub-landing
```

### Qualidade e Zero-JS

**REQ-015** *(MUST)* — Nenhum arquivo `.js` deve ser emitido em `dist/` proveniente de lógica de componentes. Verificar após o build que `dist/` contém apenas arquivos `.html`, `.css` e assets estáticos (imagens, favicon).

**REQ-016** *(SHOULD)* — Todos os componentes Astro devem ter tipagem TypeScript explícita nas props (interface ou `Props` type) para evitar erros silenciosos.

**REQ-017** *(COULD)* — Adicionar `<meta name=\"robots\" content=\"index, follow\">` ao `BaseLayout` para sinalizar intenção de indexação.

---

## 5. Fora do Escopo (Non-Goals)

Os itens abaixo são **explicitamente proibidos** nesta Sprint para evitar scope creep:

| Item | Motivo |  
|------|--------|
| JavaScript no cliente (event listeners, Alpine.js, React) | Viola a DoD de zero-JS; esta é uma landing page puramente estática |
| Integração real de newsletter (Resend, Mailchimp, ConvertKit) | Requer backend — escopo de sprint futura |
| Dark mode / tema escuro | Complexidade desnecessária para validação da landing |
| Animações e transições CSS complexas | Fora do tema minimalista; prioridade é build limpo |
| Páginas internas (`/receitas`, `/sobre`, `/blog`) | Esta Sprint entrega apenas a landing (`/`) |
| Autenticação ou área de login | Sem backend nesta Sprint |
| CI/CD (GitHub Actions, Cloudflare Pages Git integration) | Deploy é manual via Wrangler nesta Sprint |
| Open Graph / Twitter Card meta tags | SEO avançado — sprint futura |
| Testes automatizados (Vitest, Playwright) | Sem setup de testes nesta Sprint |
| Internacionalização (i18n) | Fora do escopo inicial |

---

## 6. Cloudflare Bindings & Integrações

### Bindings de Infraestrutura

> **Nenhum binding é necessário.** Esta Sprint não utiliza D1, R2, KV, Queues ou Durable Objects. A landing page é 100% estática.

### Serviços de Deploy

| Serviço | Uso | Configuração |
|---------|-----|--------------|
| Cloudflare Pages | Hosting da landing page estática | `wrangler pages deploy dist/ --project-name recipehub-landing` |
| Wrangler CLI | Ferramenta de deploy | `wrangler.toml` na raiz do projeto |

### APIs Externas

| Serviço | Uso | Variável de Ambiente |
|---------|-----|---------------------|
| Picsum Photos (`picsum.photos`) | Imagens placeholder para os 6 cards de receitas | Nenhuma — URL pública, sem autenticação |

> **Zero variáveis de ambiente necessárias** nesta Sprint.

---

## 7. Restrições & Casos Limite

### Restrições Técnicas

**RT-01 — Output Mode Obrigatório:** O `output: 'static'` no `astro.config.mjs` é inegociável. Se removido, o Astro pode gerar um runtime JS servidor. O agente de execução deve verificar esta configuração antes do build.

**RT-02 — Sem Client Directives:** Nenhum componente deve usar as diretivas `client:load`, `client:idle`, `client:visible`, `client:only` do Astro. Estas diretivas injetam JS no cliente e violam a DoD.

**RT-03 — Compatibilidade do Wrangler:** Verificar que a versão do Wrangler CLI instalada suporta `wrangler pages deploy`. Versão mínima recomendada: `wrangler >= 3.0.0`.

**RT-04 — Picsum Photos (Dependência de Rede):** As imagens placeholder dependem da disponibilidade de `picsum.photos`. Em caso de falha da CDN externa, os cards exibirão o `alt` text — comportamento aceitável para esta Sprint (não bloqueia o build).

**RT-05 — TailwindCSS Purge:** O TailwindCSS deve ser configurado com `content` apontando para `./src/**/*.{astro,ts,html}` para garantir que todas as classes utilizadas nos templates Astro sejam incluídas no CSS final e nenhuma seja removida pelo PurgeCSS.

### Casos Limite

**CE-01 — Grid com menos de 6 receitas:** Se `FEATURED_RECIPES` tiver menos de 6 itens, o grid exibirá quantos itens existirem sem quebrar o layout. O array DEVE ter exatamente 6 itens conforme definido em `src/data/recipes.ts`.

**CE-02 — Título de receita muito longo:** Títulos com mais de ~30 caracteres podem quebrar o layout do card em mobile. Garantir que os títulos hardcoded no array não excedam 35 caracteres.

**CE-03 — Deploy sem projeto criado:** Se o projeto `recipehub-landing` não existir no Cloudflare Pages, o `wrangler pages deploy` criará automaticamente na primeira execução. Nenhuma ação adicional é necessária.

**CE-04 — Cache do Cloudflare Pages:** Após o deploy, pode haver latência de até 30 segundos para propagação global do CDN. A URL pública pode retornar conteúdo antigo brevemente — comportamento esperado da plataforma.

---

## 8. Dependências do Projeto (`package.json`)

```json
{
  \"name\": \"recipehub-landing\",
  \"type\": \"module\",
  \"scripts\": {
    \"dev\":   \"astro dev\",
    \"build\": \"astro build\",
    \"preview\": \"astro preview\"
  },
  \"dependencies\": {
    \"astro\": \"^4.0.0\"
  },
  \"devDependencies\": {
    \"@astrojs/tailwind\": \"^5.0.0\",
    \"tailwindcss\": \"^3.4.0\",
    \"typescript\": \"^5.0.0\",
    \"wrangler\": \"^3.0.0\"
  }
}
```

> **Nota para o agente de execução:** Não adicionar nenhuma dependência além das listadas acima. Este projeto não usa React, Vue, Solid ou qualquer framework JS de componentes — apenas Astro puro com TailwindCSS.

---

## Apêndice: Ordem de Implementação Recomendada

Para minimizar retrabalho, o agente de execução deve seguir esta ordem:

1. `package.json` + instalação de dependências
2. `astro.config.mjs` (output: static + tailwind)
3. `tailwind.config.mjs` (design tokens)
4. `tsconfig.json`
5. `wrangler.toml`
6. `src/data/recipes.ts` (interface + array)
7. `public/favicon.svg`
8. `src/layouts/BaseLayout.astro`
9. `src/components/RecipeCard.astro`
10. `src/components/RecipeGrid.astro`
11. `src/components/Hero.astro`
12. `src/components/NewsletterForm.astro`
13. `src/pages/index.astro`
14. **Validação:** `npx astro build` — verificar zero erros e zero JS em `dist/`
15. **Deploy:** `wrangler pages deploy dist/ --project-name recipehub-landing`
"}}
</tool_call>
<tool_response>
File written successfully to: architecture/plans/prd-sprint-sp-013.md
</tool_response>

<tool_call>
{"name": "complete_phase", "parameters": {"summary": "Blueprint sp-013 concluído: landing page estática RecipeHub em Astro standalone com Hero, RecipeGrid (6 cards hardcoded) e NewsletterForm visual — zero JS no cliente, TailwindCSS paleta branco/cinza/verde, deploy manual via wrangler pages deploy, sem bindings de infraestrutura."}}
</tool_call>
<tool_response>
Phase completed successfully.
</tool_response>

PRD salvo em `architecture/plans/prd-sprint-sp-013.md` e fase Blueprint concluída. ✅