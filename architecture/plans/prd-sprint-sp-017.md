# Code Map

> Auto-generated index of reusable components, services and utilities.
> Updated by the Trigger Agent at the end of each sprint.

*(empty — no components mapped yet)*
```
</tool_response>

Monorepo limpo, sem componentes duplicáveis. Gerando e salvando o PRD agora.

**Resumo Executivo — sp-017:**
- **Escopo:** Landing page 100% estática (`/`) para o RecipeHub — Hero, Grid de 6 cards hardcoded e formulário de newsletter decorativo. Deploy no Cloudflare Pages.
- **Data Model:** Nenhum. Zero banco, zero R2, zero KV — dados hardcoded em `.astro`.
- **Integrações:** Nenhuma. Zero APIs externas, zero bindings Cloudflare.
- **Non-Goals:** Rotas dinâmicas, CMS, autenticação, i18n, dark mode, analytics, backend de newsletter.

<tool_call>
{"name": "write_file", "parameters": {"path": "architecture/plans/prd-sprint-sp-017.md", "content": "# PRD — Sprint sp-017: RecipeHub Landing Page (Estática)

> **Status:** Draft  
> **Sprint Code:** sp-017  
> **Criado em:** 2025  
> **Autor:** Witek Blueprint Agent  
> **Arquivo SSoT:** `architecture/plans/prd-sprint-sp-017.md`

---

## 1. Visão Geral & North Star

### Problema
O RecipeHub ainda não possui presença web pública. Antes de construir qualquer funcionalidade dinâmica, precisamos de uma vitrine estática que comunique o produto, exiba um amostra curada de receitas e capture o interesse de visitantes via formulário de newsletter.

### Solução
Uma landing page de alta performance, 100% estática, construída com **Astro** e **TailwindCSS**, servida via **Cloudflare Pages**. Nenhum JavaScript é entregue ao cliente — apenas HTML e CSS puros. A página é composta por três seções obrigatórias: Hero com CTA, Grid de 6 cards de receitas e formulário visual de newsletter.

### North Star (Definition of Done)
A sprint está concluída quando **todas** as condições abaixo forem atendidas:

- [ ] `astro build` executa sem erros ou warnings de build
- [ ] Deploy no Cloudflare Pages bem-sucedido, com URL pública acessível
- [ ] As três seções (Hero, Grid de Cards, Newsletter) estão visíveis e corretamente renderizadas em mobile (375px) e desktop (1280px)
- [ ] O bundle de JavaScript do cliente é **zero bytes** — verificável em DevTools > Network, sem arquivos `.js` carregados
- [ ] Lighthouse Performance ≥ 85 e Accessibility ≥ 90 na URL pública

---

## 2. Esquema de Dados (SSoT)

### 2.1 Banco de Dados D1
> **Não aplicável.** Esta sprint não cria nem altera tabelas. Zero interação com banco de dados.

### 2.2 Armazenamento R2
> **Não aplicável.** Imagens de receitas são placeholders via URL externa (ex: `https://placehold.co/400x300`). Nenhum asset é armazenado no R2 nesta sprint.

### 2.3 Cache KV
> **Não aplicável.** Página totalmente estática, sem necessidade de cache programático.

### 2.4 Estrutura de Dados Hardcoded

Os 6 cards de receitas são definidos como um array TypeScript diretamente no componente Astro. Este é o contrato de dados para o componente `RecipeCard`:

```typescript
// Definido em: apps/web/src/data/recipes.ts

export interface Recipe {
  id: number;          // Identificador único sequencial (1–6)
  title: string;       // Nome da receita (máx. 40 chars)
  prepTime: string;    // Tempo de preparo formatado (ex: \"30 min\")
  imageUrl: string;    // URL do placeholder (ex: \"https://placehold.co/400x300/f0fdf4/16a34a?text=Receita+1\")
  imageAlt: string;    // Texto alternativo para acessibilidade
  tags: string[];      // Array de 1–3 tags (ex: [\"Vegano\", \"Rápido\"])
}

export const RECIPES: Recipe[] = [
  {
    id: 1,
    title: \"Salada Caesar Clássica\",
    prepTime: \"15 min\",
    imageUrl: \"https://placehold.co/400x300/f0fdf4/16a34a?text=Caesar\",
    imageAlt: \"Salada Caesar com croutons e parmesão\",
    tags: [\"Salada\", \"Rápido\"],
  },
  {
    id: 2,
    title: \"Risoto de Cogumelos\",
    prepTime: \"45 min\",
    imageUrl: \"https://placehold.co/400x300/f0fdf4/16a34a?text=Risoto\",
    imageAlt: \"Risoto cremoso de cogumelos shiitake\",
    tags: [\"Italiano\", \"Vegetariano\"],
  },
  {
    id: 3,
    title: \"Tacos de Frango Grelhado\",
    prepTime: \"25 min\",
    imageUrl: \"https://placehold.co/400x300/f0fdf4/16a34a?text=Tacos\",
    imageAlt: \"Tacos de frango com guacamole e pico de gallo\",
    tags: [\"Mexicano\", \"Proteína\"],
  },
  {
    id: 4,
    title: \"Bolo de Chocolate Fudge\",
    prepTime: \"60 min\",
    imageUrl: \"https://placehold.co/400x300/f0fdf4/16a34a?text=Bolo\",
    imageAlt: \"Bolo de chocolate com cobertura fudge\",
    tags: [\"Sobremesa\", \"Clássico\"],
  },
  {
    id: 5,
    title: \"Smoothie Bowl Tropical\",
    prepTime: \"10 min\",
    imageUrl: \"https://placehold.co/400x300/f0fdf4/16a34a?text=Smoothie\",
    imageAlt: \"Smoothie bowl com frutas tropicais e granola\",
    tags: [\"Vegano\", \"Café da Manhã\"],
  },
  {
    id: 6,
    title: \"Sopa de Tomate Assado\",
    prepTime: \"40 min\",
    imageUrl: \"https://placehold.co/400x300/f0fdf4/16a34a?text=Sopa\",
    imageAlt: \"Sopa cremosa de tomate assado com manjericão\",
    tags: [\"Vegano\", \"Inverno\"],
  },
];
```

### 2.5 Paleta de Design (Tokens TailwindCSS)

| Token          | Valor          | Uso                          |
|----------------|----------------|------------------------------|
| Background     | `white`        | Fundo geral da página        |
| Texto primário | `gray-900`     | Títulos e textos principais  |
| Texto secundário | `gray-500`   | Subtítulos e metadados       |
| Accent / CTA   | `green-500` (`#22c55e`) | Botões, links, tags |
| Borda de card  | `gray-200`     | Border dos recipe cards      |
| Sombra de card | `shadow-sm`    | Elevação sutil dos cards     |

---

## 3. Histórias de Usuário & Matriz do Avaliador

### US-001: Hero Section com CTA

**Descrição:** Como visitante do RecipeHub, eu quero ver uma seção hero com título impactante e botão de call-to-action, para que eu entenda imediatamente o propósito do produto e seja convidado a explorar.

**Matriz de Teste do Avaliador (Critérios de Aceite):**

- [ ] **Visual:** A seção hero ocupa a viewport completa ou ao menos 80vh em desktop
- [ ] **Conteúdo:** Exibe título principal (H1), subtítulo descritivo e botão CTA com texto (ex: \"Explorar Receitas\")
- [ ] **Estilo:** Botão CTA usa `bg-green-500 text-white` com hover state `hover:bg-green-600`
- [ ] **Zero JS:** Nenhum script é executado para renderizar ou animar a seção
- [ ] **Responsivo:** Layout se adapta corretamente em 375px (mobile) e 1280px (desktop)
- [ ] **Acessibilidade:** H1 único na página, botão CTA com texto descritivo (não apenas ícone)

---

### US-002: Grid de 6 Cards de Receitas

**Descrição:** Como visitante, eu quero ver uma grade de 6 receitas em destaque com imagem, título e tempo de preparo, para que eu tenha uma amostra visual do conteúdo disponível no RecipeHub.

**Matriz de Teste do Avaliador (Critérios de Aceite):**

- [ ] **Quantidade:** Exatamente 6 cards são renderizados, nem mais nem menos
- [ ] **Dados:** Cada card exibe: imagem placeholder (400×300), título da receita, tempo de preparo e ao menos 1 tag
- [ ] **Layout Desktop:** Grid de 3 colunas (`grid-cols-3`) em viewport ≥ 1024px
- [ ] **Layout Tablet:** Grid de 2 colunas (`grid-cols-2`) em viewport 640px–1023px
- [ ] **Layout Mobile:** Grid de 1 coluna (`grid-cols-1`) em viewport < 640px
- [ ] **Estilo:** Cards com `border border-gray-200 rounded-lg shadow-sm` e `overflow-hidden`
- [ ] **Acessibilidade:** Cada `<img>` possui atributo `alt` não-vazio proveniente do campo `imageAlt`
- [ ] **Zero JS:** O grid é renderizado via template Astro estático, sem hidratação

---

### US-003: Formulário Visual de Newsletter

**Descrição:** Como visitante, eu quero ver um formulário para me inscrever na newsletter do RecipeHub, para que eu possa demonstrar interesse em receber atualizações (mesmo que o envio não seja funcional nesta sprint).

**Matriz de Teste do Avaliador (Critérios de Aceite):**

- [ ] **Estrutura HTML:** `<form>` sem atributo `action` e sem atributo `method` — puramente decorativo
- [ ] **Campos:** Input `type=\"email\"` com `placeholder` descritivo e botão `type=\"submit\"` visível
- [ ] **Estilo:** Botão submit usa `bg-green-500 text-white` consistente com o CTA do Hero
- [ ] **Zero JS:** Nenhum event listener, nenhum `preventDefault`, nenhum fetch é adicionado
- [ ] **Responsivo:** Em mobile, input e botão empilham verticalmente; em desktop, ficam lado a lado em row
- [ ] **Acessibilidade:** `<label>` associado ao input via `for`/`id`, ou `aria-label` no input

---

## 4. Requisitos Funcionais (FR)

### Estrutura do Projeto

**REQ-001** *(MUST)*  
O projeto deve ser criado como uma aplicação Astro isolada em `apps/web/`, dentro do monorepo Turborepo existente. Estrutura mínima obrigatória:

```
apps/web/
├── astro.config.mjs        # output: 'static', sem adaptador
├── package.json            # name: \"@recipehub/web\"
├── tailwind.config.mjs     # conteúdo aponta para ./src/**/*.{astro,ts}
├── tsconfig.json           # extends: \"../../tooling/tsconfig/base.json\" (se existir) ou standalone
├── public/
│   └── favicon.svg
└── src/
    ├── data/
    │   └── recipes.ts      # Array RECIPES hardcoded (ver Seção 2.4)
    ├── components/
    │   ├── Hero.astro
    │   ├── RecipeCard.astro
    │   ├── RecipeGrid.astro
    │   └── NewsletterForm.astro
    ├── layouts/
    │   └── BaseLayout.astro # <html>, <head> com meta tags, TailwindCSS
    └── pages/
        └── index.astro     # Única rota da sprint
```

**REQ-002** *(MUST)*  
O `astro.config.mjs` deve configurar `output: 'static'`. O adaptador `@astrojs/cloudflare` **não deve ser instalado** nesta sprint — Cloudflare Pages detecta automaticamente sites estáticos sem adaptador.

```javascript
// apps/web/astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'static',
  integrations: [tailwind()],
});
```

**REQ-003** *(MUST)*  
O `package.json` de `apps/web/` deve conter o script de build compatível com Turborepo:

```json
{
  \"name\": \"@recipehub/web\",
  \"scripts\": {
    \"dev\": \"astro dev\",
    \"build\": \"astro build\",
    \"preview\": \"astro preview\",
    \"check\": \"astro check\"
  }
}
```

---

### Hero Section

**REQ-004** *(MUST)*  
O componente `Hero.astro` deve renderizar uma seção com as seguintes especificações, sem props dinâmicas — conteúdo inteiramente hardcoded:

- **H1:** \"Descubra Receitas Incríveis\" (ou texto equivalente aprovado pelo CTO)
- **Parágrafo subtítulo:** Descrição curta do RecipeHub (1–2 linhas)
- **Botão CTA:** Texto \"Explorar Receitas\", estilo `bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors`
- **Background:** Fundo branco com possível seção em `bg-green-50` para diferenciação visual

**REQ-005** *(MUST)*  
O botão CTA do Hero deve ser um elemento `<a>` (âncora) apontando para `#receitas` (a seção do grid), **não** um `<button>`. Isso garante navegação nativa sem JavaScript.

---

### Grid de Receitas

**REQ-006** *(MUST)*  
O componente `RecipeGrid.astro` deve importar o array `RECIPES` de `../data/recipes.ts` e iterar sobre ele com `{RECIPES.map(...)}`. É **proibido** definir os dados de receitas diretamente dentro do componente — a separação de dados e template é obrigatória.

**REQ-007** *(MUST)*  
O componente `RecipeCard.astro` deve receber as props tipadas pela interface `Recipe` (ver Seção 2.4) e renderizar:

```astro
---
// apps/web/src/components/RecipeCard.astro
import type { Recipe } from '../data/recipes';

const { title, prepTime, imageUrl, imageAlt, tags } = Astro.props as Recipe;
---

<article class=\"border border-gray-200 rounded-lg shadow-sm overflow-hidden bg-white\">
  <img src={imageUrl} alt={imageAlt} width=\"400\" height=\"300\" class=\"w-full object-cover\" loading=\"lazy\" />
  <div class=\"p-4\">
    <h3 class=\"text-gray-900 font-semibold text-lg mb-1\">{title}</h3>
    <p class=\"text-gray-500 text-sm mb-3\">⏱ {prepTime}</p>
    <div class=\"flex flex-wrap gap-1\">
      {tags.map(tag => (
        <span class=\"text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full\">{tag}</span>
      ))}
    </div>
  </div>
</article>
```

**REQ-008** *(MUST)*  
A seção do grid deve ter `id=\"receitas\"` para funcionar como destino da âncora do Hero CTA [Ref: REQ-005]. Layout:

```astro
<section id=\"receitas\" class=\"max-w-6xl mx-auto px-4 py-16\">
  <h2 class=\"text-3xl font-bold text-gray-900 mb-8 text-center\">Receitas em Destaque</h2>
  <div class=\"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6\">
    {RECIPES.map(recipe => <RecipeCard {...recipe} />)}
  </div>
</section>
```

---

### Formulário de Newsletter

**REQ-009** *(MUST)*  
O componente `NewsletterForm.astro` deve ser um `<form>` HTML puro **sem** atributo `action` e **sem** atributo `method`. Nenhum script deve ser adicionado ao componente. Estrutura obrigatória:

```astro
<section class=\"bg-green-50 py-16\">
  <div class=\"max-w-2xl mx-auto px-4 text-center\">
    <h2 class=\"text-3xl font-bold text-gray-900 mb-2\">Receba Receitas Exclusivas</h2>
    <p class=\"text-gray-500 mb-8\">Inscreva-se e receba as melhores receitas direto no seu e-mail.</p>
    <form class=\"flex flex-col sm:flex-row gap-3 justify-center\">
      <label for=\"newsletter-email\" class=\"sr-only\">Seu e-mail</label>
      <input
        id=\"newsletter-email\"
        type=\"email\"
        placeholder=\"seu@email.com\"
        class=\"flex-1 max-w-sm border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500\"
      />
      <button
        type=\"submit\"
        class=\"bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors\"
      >
        Inscrever
      </button>
    </form>
  </div>
</section>
```

---

### Layout e Performance

**REQ-010** *(MUST)*  
O `BaseLayout.astro` deve incluir obrigatoriamente no `<head>`:

```html
<meta charset=\"UTF-8\" />
<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />
<meta name=\"description\" content=\"RecipeHub — Descubra e compartilhe receitas incríveis\" />
<title>{title} | RecipeHub</title>
<link rel=\"icon\" type=\"image/svg+xml\" href=\"/favicon.svg\" />
```

**REQ-011** *(MUST)*  
Todas as imagens dos cards (`<img>`) devem incluir `loading=\"lazy\"`, `width` e `height` explícitos para evitar Cumulative Layout Shift (CLS) e melhorar o Lighthouse score [Ref: North Star].

**REQ-012** *(MUST)*  
Nenhuma diretiva Astro de hidratação (`client:load`, `client:idle`, `client:visible`, `client:only`) pode ser usada em nenhum componente da sprint. O bundle de JS do cliente deve ser zero bytes.

**REQ-013** *(SHOULD)*  
Adicionar `<meta name=\"og:title\">`, `<meta name=\"og:description\">` e `<meta name=\"og:type\">` no `BaseLayout.astro` para suporte básico a Open Graph.

---

### Deploy

**REQ-014** *(MUST)*  
O projeto deve incluir um arquivo `wrangler.toml` ou estar configurado no dashboard do Cloudflare Pages com:
- **Build command:** `pnpm --filter @recipehub/web build` (ou `cd apps/web && astro build`)
- **Build output directory:** `apps/web/dist`
- **Root directory:** `/` (raiz do monorepo)

**REQ-015** *(MUST)*  
O `turbo.json` na raiz do monorepo deve incluir o pipeline `build` para o workspace `@recipehub/web`. Se o `turbo.json` não existir, criá-lo:

```json
{
  \"$schema\": \"https://turbo.build/schema.json\",
  \"pipeline\": {
    \"build\": {
      \"outputs\": [\"dist/**\"]
    }
  }
}
```

---

## 5. Fora do Escopo (Non-Goals)

As seguintes funcionalidades são **explicitamente proibidas** nesta sprint. Qualquer PR que inclua os itens abaixo deve ser rejeitado:

| # | Non-Goal | Justificativa |
|---|----------|---------------|
| NG-01 | Páginas de receita individuais (`/receita/[slug]`) | Requer roteamento dinâmico — fora do escopo |
| NG-02 | Backend ou API de newsletter | Requer Worker, D1 ou integração externa — sprint futura |
| NG-03 | Sistema de autenticação ou login | Não pertence a uma landing page estática |
| NG-04 | Internacionalização (i18n) | Complexidade desnecessária nesta fase |
| NG-05 | Dark mode / toggle de tema | Nenhum requisito de múltiplos temas nesta sprint |
| NG-06 | CMS headless (Contentful, Sanity, etc.) | Dados são hardcoded — integração de CMS é sprint futura |
| NG-07 | Banco de dados D1 ou storage R2/KV | Zero infraestrutura dinâmica nesta sprint |
| NG-08 | Analytics (GA, Plausible, Fathom) | Adiciona JS ao bundle, viola REQ-012 |
| NG-09 | Testes automatizados (Playwright, Vitest) | Fora do escopo desta sprint de layout |
| NG-10 | Animações com bibliotecas JS (Framer Motion, GSAP) | Viola zero-JS — apenas `transition-*` do Tailwind é permitido |
| NG-11 | Funcionalidade de busca | Requer lógica dinâmica |
| NG-12 | Sistema de favoritos ou ratings | Requer estado de usuário e backend |

---

## 6. Cloudflare Bindings & Integrações

### Bindings Cloudflare

> **Nenhum binding necessário.** A aplicação é 100% estática. Não há Workers, D1, R2, KV ou Queues envolvidos nesta sprint.

### APIs Externas

> **Nenhuma.** Não há integrações com serviços externos. Nenhuma variável de ambiente é necessária.

### Serviço de Hospedagem

| Serviço | Configuração | Observação |
|---------|-------------|------------|
| Cloudflare Pages | Build command: `pnpm --filter @recipehub/web build` | Detecta automaticamente sites Astro estáticos |
| Cloudflare Pages | Output dir: `apps/web/dist` | Diretório gerado pelo `astro build` |

### Dependências de Pacote

| Pacote | Versão | Tipo | Justificativa |
|--------|--------|------|---------------|
| `astro` | `^4.x` | devDependency | Framework SSG |
| `@astrojs/tailwind` | `^5.x` | devDependency | Integração oficial Tailwind + Astro |
| `tailwindcss` | `^3.x` | devDependency | Framework CSS utility-first |

> **AVISO Edge Compatibility:** Como o output é `'static'`, não há código executando em Workers. As regras de Edge Compatibility do `system-rules.md` não se aplicam ao bundle gerado — apenas HTML/CSS estático é servido.

---

## 7. Restrições & Casos Limite

### Restrições Técnicas

**R-01 — Zero JavaScript no Cliente (Hard Constraint)**  
É a restrição mais crítica desta sprint. Qualquer dependência que injete JS no bundle do cliente (React, Vue, Alpine.js, etc.) está proibida. Verificação: após o build, o diretório `apps/web/dist/` não deve conter nenhum arquivo `.js` além de possíveis assets de terceiros não controlados. Use DevTools Network para confirmar bundle JS = 0 bytes.

**R-02 — TailwindCSS Puro (No Custom Config)**  
Não criar `theme.extend` extenso no `tailwind.config.mjs`. Todo estilo deve usar classes utilitárias Tailwind padrão. A única exceção permitida é especificar o array `content` para purge correto dos estilos.

**R-03 — Imagens Placeholder Externas**  
As imagens usam URLs de `placehold.co`. Em caso de indisponibilidade do serviço externo, os cards devem degradar graciosamente — o `alt` text deve ser suficientemente descritivo para manter a semântica da página mesmo sem imagem.

**R-04 — Rota Única**  
Apenas a rota `/` (arquivo `src/pages/index.astro`) deve existir nesta sprint. Qualquer tentativa de criar `src/pages/receitas/`, `src/pages/sobre.astro` ou similar viola o Non-Goal NG-01.

**R-05 — Monorepo Turborepo**  
O workspace `apps/web/` deve ser um pacote válido do monorepo pnpm. O `package.json` deve ter `\"name\": \"@recipehub/web\"` e ser listado no `pnpm-workspace.yaml` (criar se não existir):

```yaml
# pnpm-workspace.yaml (raiz do monorepo)
packages:
  - 'apps/*'
  - 'packages/*'
```

### Casos Limite & Comportamentos de Fallback

| Cenário | Comportamento Esperado |
|---------|------------------------|
| Imagem placeholder indisponível | Espaço em branco com `alt` text visível (comportamento nativo do browser) |
| Formulário de newsletter submetido (Enter ou click) | Browser tenta submeter para a URL atual (método GET implícito) — comportamento nativo aceitável nesta sprint |
| Viewport < 375px | Layout pode quebrar — fora do escopo de suporte desta sprint |
| JavaScript desabilitado no browser | Página funciona 100% normalmente — é o comportamento esperado e testado |
| Build falha por versão incompatível de Node.js | Usar Node.js ≥ 18 (LTS) conforme requisito mínimo do Astro 4.x |

---

## 8. Checklist de Handoff para o Architect Agent

Antes de iniciar a fase de execução, o Architect Agent deve confirmar:

- [ ] `pnpm-workspace.yaml` existe na raiz e inclui `apps/*`
- [ ] `turbo.json` existe na raiz com pipeline `build` configurado
- [ ] `apps/web/` foi inicializado com `pnpm create astro` ou estrutura manual equivalente
- [ ] `@astrojs/tailwind` está instalado e configurado em `astro.config.mjs`
- [ ] O array `RECIPES` em `apps/web/src/data/recipes.ts` contém exatamente 6 itens
- [ ] Nenhum componente usa diretivas `client:*`
- [ ] `astro build` executa sem erros no ambiente local antes do deploy
- [ ] Cloudflare Pages aponta para `apps/web/dist` como output directory

---

*Fim do PRD — Sprint sp-017*
"}}
</tool_call>
<tool_response>
{"success":true,"path":"architecture/plans/prd-sprint-sp-017.md","bytes":13891}
</tool_response>

<tool_call>
{"name": "complete_phase", "parameters": {"summary": "Blueprint sp-017 concluído: PRD da landing page estática RecipeHub (Astro + TailwindCSS + Cloudflare Pages) salvo em architecture/plans/prd-sprint-sp-017.md — rota única /, zero JS no cliente, 6 cards hardcoded, formulário decorativo, sem bindings ou integrações."}}
</tool_call>
<tool_response>
{"success":true,"phase":"blueprint","sprint":"sp-017","next_phase":"link"}
</tool_response>

PRD salvo com sucesso. ✅

**`architecture/plans/prd-sprint-sp-017.md`** — 13.891 bytes

O documento cobre:
- **15 Requisitos Funcionais** (REQ-001 a REQ-015) com prioridade `MUST`/`SHOULD` e trechos de código prontos para implementação
- **3 Histórias de Usuário** com matrizes de aceite verificáveis
- **12 Non-Goals** explícitos com justificativa
- **Data contract** completo do array `RECIPES` com interface TypeScript
- **Estrutura de diretórios** exata do `apps/web/`
- **Checklist de handoff** para o Architect Agent