# Code Map — RecipeHub

_Gerado em: 2025-01-01 | Sprint: sp-001_

## Visão Geral do Monorepo

```
recipehub/
├── apps/
│   └── web/                          # Astro + Cloudflare Pages
├── packages/
│   └── db/                           # Drizzle ORM + D1 schema
├── tooling/
│   └── typescript/                   # tsconfig base compartilhada
├── turbo.json
└── package.json
```

## apps/web — Astro Frontend

**Localização:** `apps/web/`
**Runtime:** Cloudflare Pages (SSR via `@astrojs/cloudflare`)
**Stack:** Astro 5, TailwindCSS, TypeScript

### Estrutura de Arquivos

```
apps/web/
├── src/
│   ├── pages/
│   │   └── index.astro               # Página inicial (placeholder)
│   ├── layouts/
│   │   └── BaseLayout.astro          # Layout base com <head> e meta tags
│   └── env.d.ts                      # Tipos de ambiente Cloudflare
├── public/
├── astro.config.mjs                  # Config Astro com adapter Cloudflare
├── wrangler.toml                     # Binding D1: DB
└── package.json
```

### Páginas Existentes

| Rota | Arquivo | Descrição |
|------|---------|-----------|
| `/` | `src/pages/index.astro` | Placeholder da home — será substituída |

### Layouts Existentes

| Componente | Arquivo | Props |
|------------|---------|-------|
| `BaseLayout` | `src/layouts/BaseLayout.astro` | `title: string` |

### Bindings Cloudflare Configurados

| Binding | Tipo | Nome no wrangler.toml |
|---------|------|-----------------------|
| `DB` | D1 Database | `recipehub-d1` |

## packages/db — Schema e Migrations

**Localização:** `packages/db/`
**Stack:** Drizzle ORM, TypeScript

### Schema Atual

```typescript
// packages/db/src/schema.ts
// VAZIO — nenhuma tabela definida ainda
```

### Migrations

```
packages/db/migrations/   # Vazia — nenhuma migration gerada ainda
```

## Notas de Arquitetura

- O adapter `@astrojs/cloudflare` está configurado em modo `directory` para Cloudflare Pages Functions
- O binding D1 `DB` está declarado no `wrangler.toml` de `apps/web` e disponível via `Astro.locals.runtime.env.DB`
- A tabela de schema está vazia — a **sp-002** será responsável por criar o primeiro schema real
```
</tool_response>

Tenho tudo que preciso. Vou gerar o PRD agora.

**Resumo Executivo — sp-002:**
- **Escopo:** Landing page estática do RecipeHub (Astro) com hero section, 6 cards de receitas com dados mockados (imagens Unsplash) e formulário de newsletter com API Route nativa salvando emails no D1.
- **Data Model:** Nova tabela `newsletter_subscribers` (`id`, `email`, `created_at`) no schema Drizzle em `packages/db/src/schema.ts`.
- **Integrações:** Apenas binding D1 (`DB`) — já configurado no `wrangler.toml`. Zero APIs externas.
- **Non-Goals:** Páginas de receita individual, busca/filtro, autenticação, painel admin, double opt-in, envio de email de boas-vindas, analytics, paginação, CMS.

<tool_call>
{"name": "write_file", "parameters": {"path": "architecture/plans/prd-sprint-sp-002.md", "content": "# PRD — Sprint sp-002: RecipeHub Landing Page

> **Status:** Draft  
> **Sprint Code:** sp-002  
> **Criado em:** 2025-01-01  
> **Arquivo SSoT:** `architecture/plans/prd-sprint-sp-002.md`

---

## 1. Visão Geral & North Star

Esta sprint entrega a **primeira página pública do RecipeHub** — uma landing page responsiva, visualmente refinada e estática, construída em Astro e hospedada no Cloudflare Pages. O objetivo é estabelecer a presença online do produto e iniciar a captação de leads via formulário de newsletter integrado ao D1.

**Estado de Concluído (Definition of Done):**
- URL pública do Cloudflare Pages retorna HTTP 200
- Hero section visível e responsiva (desktop + mobile)
- 6 cards de receitas mockados renderizados com imagem (Unsplash), título e tempo de preparo
- Formulário de newsletter funcional: `POST /api/newsletter` salva o email no D1 e retorna resposta de sucesso
- Zero variáveis de ambiente novas além do binding D1 `DB` já existente

---

## 2. Esquema de Dados (SSoT)

### 2.1 Tabela D1 — `newsletter_subscribers`

Adicionar ao arquivo `packages/db/src/schema.ts`:

```typescript
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const newsletterSubscribers = sqliteTable('newsletter_subscribers', {
  id:         integer('id').primaryKey({ autoIncrement: true }),
  email:      text('email').notNull().unique(),
  created_at: text('created_at').notNull().default(\"(datetime('now'))\"),
});
```

> **Nota:** `created_at` usa a função SQLite `datetime('now')` como default do banco para garantir consistência de timezone (UTC) independente do runtime.

### 2.2 Armazenamento R2

Não aplicável nesta sprint. Imagens são referenciadas via URLs públicas do Unsplash.

### 2.3 Payloads JSON — API Route de Newsletter

**Endpoint:** `POST /api/newsletter`  
**Arquivo:** `apps/web/src/pages/api/newsletter.ts`

#### Request Body
```json
{
  \"email\": \"usuario@exemplo.com\"
}
```

#### Response — Sucesso (HTTP 200)
```json
{
  \"success\": true,
  \"message\": \"Email cadastrado com sucesso!\"
}
```

#### Response — Email duplicado (HTTP 409)
```json
{
  \"success\": false,
  \"error\": \"EMAIL_ALREADY_REGISTERED\",
  \"message\": \"Este email já está cadastrado.\"
}
```

#### Response — Validação inválida (HTTP 422)
```json
{
  \"success\": false,
  \"error\": \"VALIDATION_ERROR\",
  \"message\": \"Formato de email inválido.\"
}
```

#### Response — Erro interno (HTTP 500)
```json
{
  \"success\": false,
  \"error\": \"INTERNAL_ERROR\",
  \"message\": \"Erro ao processar sua solicitação. Tente novamente.\"
}
```

### 2.4 Dados Mockados — Cards de Receitas

Os dados das receitas são definidos como constante TypeScript dentro do componente ou página Astro. Estrutura de cada item:

```typescript
interface RecipeCard {
  id: number;
  title: string;
  prepTime: string;       // ex: \"30 min\"
  imageUrl: string;       // URL pública Unsplash
  imageAlt: string;
  category: string;       // ex: \"Massas\", \"Saladas\"
}

const FEATURED_RECIPES: RecipeCard[] = [
  {
    id: 1,
    title: \"Risoto de Cogumelos\",
    prepTime: \"45 min\",
    imageUrl: \"https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&auto=format&fit=crop\",
    imageAlt: \"Risoto cremoso de cogumelos em prato branco\",
    category: \"Risotos\",
  },
  {
    id: 2,
    title: \"Salada Caesar Clássica\",
    prepTime: \"15 min\",
    imageUrl: \"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop\",
    imageAlt: \"Salada Caesar com croutons e parmesão\",
    category: \"Saladas\",
  },
  {
    id: 3,
    title: \"Macarrão ao Molho Pesto\",
    prepTime: \"20 min\",
    imageUrl: \"https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&auto=format&fit=crop\",
    imageAlt: \"Prato de macarrão com molho pesto verde\",
    category: \"Massas\",
  },
  {
    id: 4,
    title: \"Bolo de Cenoura com Ganache\",
    prepTime: \"60 min\",
    imageUrl: \"https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=800&auto=format&fit=crop\",
    imageAlt: \"Fatia de bolo de cenoura coberta com chocolate\",
    category: \"Sobremesas\",
  },
  {
    id: 5,
    title: \"Frango Grelhado com Ervas\",
    prepTime: \"35 min\",
    imageUrl: \"https://images.unsplash.com/photo-1598103442097-8b74394b95c3?w=800&auto=format&fit=crop\",
    imageAlt: \"Peito de frango grelhado com ervas frescas\",
    category: \"Carnes\",
  },
  {
    id: 6,
    title: \"Smoothie Bowl de Açaí\",
    prepTime: \"10 min\",
    imageUrl: \"https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&auto=format&fit=crop\",
    imageAlt: \"Bowl de açaí com frutas e granola\",
    category: \"Saudável\",
  },
];
```

---

## 3. Histórias de Usuário & Matriz do Avaliador

### US-001: Hero Section da Landing Page

**Descrição:** Como visitante do RecipeHub, eu quero ver uma hero section impactante ao abrir o site para que eu entenda imediatamente a proposta de valor do produto.

**Critérios de Aceite:**

- [ ] **Visual:** Hero section renderiza headline principal, subtítulo e call-to-action visíveis acima do fold em viewport 1440px
- [ ] **Responsivo:** Layout se adapta corretamente em 375px (mobile), 768px (tablet) e 1440px (desktop) sem overflow horizontal
- [ ] **Performance:** Imagem de fundo (se presente) usa `loading=\"eager\"` e tem `alt` descritivo
- [ ] **Semântica:** Hero utiliza tag `<section>` com `<h1>` único na página

---

### US-002: Cards de Receitas em Destaque

**Descrição:** Como visitante, eu quero ver cards de receitas em destaque com imagem, título e tempo de preparo para que eu me sinta atraído pelo conteúdo do RecipeHub.

**Critérios de Aceite:**

- [ ] **Visual:** Exatamente 6 cards renderizados na seção de destaque
- [ ] **Conteúdo:** Cada card exibe imagem (Unsplash), título da receita, categoria e tempo de preparo
- [ ] **Imagens:** Todas as imagens possuem atributo `alt` descritivo e `loading=\"lazy\"` (exceto as 2 primeiras que usam `loading=\"eager\"`)
- [ ] **Responsivo:** Grid de cards adapta de 1 coluna (mobile) → 2 colunas (tablet) → 3 colunas (desktop)
- [ ] **Dados:** Os 6 cards correspondem exatamente à constante `FEATURED_RECIPES` definida no schema de dados [Ref: Seção 2.4]

---

### US-003: Formulário de Newsletter — Frontend

**Descrição:** Como visitante interessado, eu quero inserir meu email em um formulário de newsletter para que eu receba novidades do RecipeHub.

**Critérios de Aceite:**

- [ ] **Visual:** Formulário com campo de email e botão de submit renderizado na página
- [ ] **Validação client-side:** Campo de email usa `type=\"email\"` e `required` nativos do HTML
- [ ] **Feedback de sucesso:** Após submit bem-sucedido, exibe mensagem de confirmação inline (sem redirect de página)
- [ ] **Feedback de erro:** Em caso de email duplicado (409) ou erro (500), exibe mensagem de erro específica inline
- [ ] **Estado de loading:** Botão fica desabilitado e exibe texto alternativo durante o fetch
- [ ] **Acessibilidade:** Label associado ao input via `for`/`id` e mensagens de feedback têm `role=\"alert\"`

---

### US-004: API Route de Newsletter — Backend

**Descrição:** Como sistema, eu quero um endpoint `POST /api/newsletter` para que os emails dos visitantes sejam persistidos no D1 com validação e tratamento de erros.

**Critérios de Aceite:**

- [ ] **API:** `POST /api/newsletter` retorna HTTP 200 com `{ success: true }` para email válido e novo [Ref: Seção 2.3]
- [ ] **Validação:** Payload sem `email` ou com formato inválido retorna HTTP 422 [Ref: FR-003]
- [ ] **Idempotência:** Email já cadastrado retorna HTTP 409 sem duplicar o registro no D1 [Ref: FR-004]
- [ ] **Persistência:** Email válido é inserido na tabela `newsletter_subscribers` no D1 [Ref: Seção 2.1]
- [ ] **Método:** Requisições `GET /api/newsletter` retornam HTTP 405 (Method Not Allowed)
- [ ] **Segurança:** Nenhum dado sensível (stack trace, query SQL) é exposto nas respostas de erro

---

### US-005: Schema e Migration do D1

**Descrição:** Como time de desenvolvimento, eu quero a tabela `newsletter_subscribers` definida via Drizzle ORM para que o banco D1 esteja pronto para receber dados da newsletter.

**Critérios de Aceite:**

- [ ] **Schema:** Tabela `newsletter_subscribers` definida em `packages/db/src/schema.ts` com colunas `id`, `email`, `created_at` [Ref: Seção 2.1]
- [ ] **Migration:** Arquivo SQL gerado via `drizzle-kit generate` presente em `packages/db/migrations/`
- [ ] **Unicidade:** Coluna `email` tem constraint `UNIQUE` — verificável via `.schema` do D1
- [ ] **CI:** Comando `drizzle-kit generate --check` passa sem erros [Ref: ci_commands]

---

## 4. Requisitos Funcionais (FR)

### Estrutura e Layout

**REQ-001** `[MUST]` A landing page deve ser implementada substituindo `apps/web/src/pages/index.astro` (arquivo já existente — NÃO criar nova página).

**REQ-002** `[MUST]` O layout base `apps/web/src/layouts/BaseLayout.astro` deve ser utilizado como wrapper da página, passando `title=\"RecipeHub — Receitas que Inspiram\"` (componente já existente — NÃO recriar).

**REQ-003** `[MUST]` A página deve ser totalmente responsiva, suportando viewports de 375px a 1440px sem scroll horizontal.

**REQ-004** `[MUST]` TailwindCSS deve ser usado para toda estilização — proibido criar arquivos `.css` customizados além do já existente no projeto.

### Hero Section

**REQ-005** `[MUST]` A hero section deve conter: (1) `<h1>` com a headline principal, (2) parágrafo com subtítulo descritivo e (3) botão/link âncora `#newsletter` como call-to-action.

**REQ-006** `[SHOULD]` A hero section deve ter uma imagem de fundo ou elemento visual de destaque que comunique o tema de culinária.

### Cards de Receitas

**REQ-007** `[MUST]` Renderizar exatamente 6 cards usando a constante `FEATURED_RECIPES` definida na Seção 2.4 deste PRD. Os dados são fixos no código — proibido buscar de API ou banco nesta sprint.

**REQ-008** `[MUST]` Cada card deve exibir: imagem (tag `<img>` com `src` do Unsplash), título da receita, badge de categoria e tempo de preparo com ícone de relógio.

**REQ-009** `[MUST]` O grid de cards deve seguir: `grid-cols-1` em mobile, `grid-cols-2` em tablet (`md:`), `grid-cols-3` em desktop (`lg:`).

**REQ-010** `[SHOULD]` Cards devem ter estado de hover com transição suave (ex: `hover:shadow-lg transition-shadow duration-200`).

### Formulário de Newsletter

**REQ-011** `[MUST]` O formulário de newsletter deve ser implementado com JavaScript vanilla (sem React) usando o event handler `form.addEventListener('submit', ...)` e `fetch()` para chamar `POST /api/newsletter`.

**REQ-012** `[MUST]` O script do formulário deve ser colocado em uma tag `<script>` dentro do `.astro` com a diretiva `is:inline` para garantir compatibilidade com o runtime Cloudflare Pages.

**REQ-013** `[MUST]` Após submit bem-sucedido, o campo de email deve ser limpo e o formulário substituído por (ou acompanhado de) uma mensagem de confirmação.

### API Route

**REQ-014** `[MUST]` Criar o arquivo `apps/web/src/pages/api/newsletter.ts` como API Route do Astro exportando `export const POST: APIRoute`.

**REQ-015** `[MUST]` O endpoint deve acessar o binding D1 via `context.locals.runtime.env.DB` — NÃO via `process.env` (proibido por doctrine).

**REQ-016** `[MUST]` Validar o campo `email` do request body usando Zod antes de qualquer interação com o D1:

```typescript
import { z } from 'zod';

const newsletterSchema = z.object({
  email: z.string().email({ message: 'Formato de email inválido.' }),
});
```

**REQ-017** `[MUST]` Detectar violação de UNIQUE constraint do D1 e retornar HTTP 409 em vez de propagar o erro interno. O erro do D1 para violação de unique em SQLite contém a string `\"UNIQUE constraint failed\"` — use isso para distinguir o caso.

**REQ-018** `[MUST]` Retornar `Content-Type: application/json` em todas as respostas da API Route.

**REQ-019** `[MUST]` Exportar `export const prerender = false` no topo do arquivo da API Route para garantir que a rota seja tratada como serverless function pelo adapter Cloudflare.

### Schema e Banco de Dados

**REQ-020** `[MUST]` Adicionar o schema `newsletterSubscribers` ao arquivo `packages/db/src/schema.ts` exatamente como especificado na Seção 2.1 deste PRD.

**REQ-021** `[MUST]` Executar `drizzle-kit generate` para gerar o arquivo de migration SQL em `packages/db/migrations/` antes do deploy.

**REQ-022** `[MUST]` Aplicar a migration no banco D1 via `wrangler d1 migrations apply recipehub-d1` (local: `--local`, produção: sem flag).

### Deploy

**REQ-023** `[MUST]` O deploy deve ser feito via Cloudflare Pages a partir do diretório `apps/web/`. A URL pública resultante deve retornar HTTP 200 na rota `/`.

**REQ-024** `[MUST]` Executar `wrangler deploy --dry-run` para validar a configuração antes do deploy efetivo [Ref: ci_commands].

---

## 5. Fora do Escopo (Non-Goals)

As seguintes funcionalidades são **EXPLICITAMENTE PROIBIDAS** nesta sprint para evitar scope creep:

| # | Item Proibido | Justificativa |
|---|---------------|---------------|
| NG-01 | Páginas de receita individual (`/receitas/[slug]`) | Requer roteamento dinâmico e dados do D1 — próxima sprint |
| NG-02 | Busca, filtro ou paginação de receitas | Requer estado dinâmico e API — fora do escopo estático |
| NG-03 | Autenticação de qualquer tipo (admin, user) | Complexidade não justificada nesta sprint |
| NG-04 | Painel de administração para gerenciar receitas | Feature independente, sprint dedicada |
| NG-05 | Double opt-in de email (confirmação via link) | Requer envio de email — não há integração de email nesta sprint |
| NG-06 | Envio de email de boas-vindas ao subscriber | Idem NG-05 |
| NG-07 | Integração com plataformas de email marketing (Mailchimp, ConvertKit) | Zero APIs externas nesta sprint |
| NG-08 | Webhook de notificação de novo subscriber | Complexidade desnecessária |
| NG-09 | Analytics (Google Analytics, Plausible, etc.) | Sprint focada em MVP visual |
| NG-10 | Sistema de categorias ou tags navegáveis | Os badges nos cards são puramente visuais/mockados |
| NG-11 | CMS ou fonte de dados externa para receitas | Dados são hardcoded — intencionalmente |
| NG-12 | Upload ou gerenciamento de imagens no R2 | Imagens via Unsplash URLs — zero storage configurado |
| NG-13 | SEO avançado (sitemap, Open Graph dinâmico, structured data) | Meta tags básicas no BaseLayout são suficientes |
| NG-14 | Testes automatizados (Vitest, Playwright) | Não priorizado nesta sprint de MVP |

---

## 6. Cloudflare Bindings & Integrações

### Bindings Cloudflare

| Binding | Tipo | Nome (wrangler.toml) | Status | Usado por |
|---------|------|----------------------|--------|-----------|
| `DB` | D1 Database | `recipehub-d1` | ✅ Já configurado | `POST /api/newsletter` |

> **Nenhum binding novo** precisa ser criado nesta sprint. O binding `DB` já está declarado em `apps/web/wrangler.toml` e disponível via `context.locals.runtime.env.DB`.

### APIs Externas

**Nenhuma.** Esta sprint não consome APIs externas nem requer novas variáveis de ambiente.

### Imagens (Unsplash)

As URLs do Unsplash são strings hardcodadas na constante `FEATURED_RECIPES`. Não requerem autenticação nem API key para uso de URLs públicas de imagens.

---

## 7. Restrições & Casos Limite

### Restrições Técnicas

**RT-01 — Edge Runtime (Proibições):**
- NUNCA usar `process.env` — acessar bindings via `context.locals.runtime.env`
- NUNCA usar `require()` — apenas ESM imports
- NUNCA usar módulos Node.js nativos (`fs`, `path`, `crypto`)
- NUNCA usar `Buffer` — usar `TextEncoder` se necessário

**RT-02 — Astro API Routes:**
- Todas as API Routes devem exportar `export const prerender = false` [Ref: REQ-019]
- O tipo correto do context é `APIContext` importado de `'astro'`

**RT-03 — Drizzle + D1:**
- Instanciar o cliente Drizzle dentro do handler da API Route (não no módulo top-level), pois o binding D1 só está disponível no contexto da request:
```typescript
import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../../../../packages/db/src/schema';

// CORRETO — dentro do handler:
export const POST: APIRoute = async (context) => {
  const db = drizzle(context.locals.runtime.env.DB, { schema });
  // ...
};
```

**RT-04 — Imagens Unsplash:**
- Adicionar `images.unsplash.com` ao domínio permitido nas configurações do Astro se `astro:assets` for usado. Alternativamente, usar tags `<img>` HTML padrão (recomendado para esta sprint pela simplicidade).

### Casos Limite da API

| Caso | Comportamento Esperado | HTTP Status |
|------|------------------------|-------------|
| Email válido, primeira vez | Inserir no D1, retornar sucesso | 200 |
| Email já cadastrado | Detectar UNIQUE violation, retornar erro amigável | 409 |
| Email com formato inválido | Falhar validação Zod, retornar erro de validação | 422 |
| Body vazio ou sem campo `email` | Falhar validação Zod | 422 |
| Body não-JSON (parse error) | Capturar exceção de parse, retornar erro interno | 500 |
| Método GET na rota | Retornar Method Not Allowed | 405 |
| D1 indisponível | Capturar exceção, retornar erro interno sem expor detalhes | 500 |

### Fallback de Imagens

Não há fallback automático para imagens do Unsplash. Se uma URL do Unsplash retornar erro, o browser exibirá a imagem quebrada. Mitigação: usar o atributo `onerror` inline para exibir um placeholder de cor sólida:

```html
<img
  src=\"https://images.unsplash.com/...\"
  alt=\"...\"
  onerror=\"this.style.background='#f3f4f6'; this.src=''\"
/>
```

---

## 8. Checklist de Execução (Para o Architect Agent)

Ordem recomendada de implementação para minimizar bloqueios:

1. **[packages/db]** Adicionar schema `newsletterSubscribers` em `packages/db/src/schema.ts` [Ref: REQ-020]
2. **[packages/db]** Executar `drizzle-kit generate` e commitar migration [Ref: REQ-021]
3. **[D1]** Aplicar migration no D1 local: `wrangler d1 migrations apply recipehub-d1 --local` [Ref: REQ-022]
4. **[apps/web]** Substituir `src/pages/index.astro` com a landing page completa [Ref: REQ-001, REQ-002]
5. **[apps/web]** Criar `src/pages/api/newsletter.ts` com a API Route [Ref: REQ-014 a REQ-019]
6. **[CI]** Executar `tsc --noEmit` e `eslint .` [Ref: ci_commands]
7. **[CI]** Executar `drizzle-kit generate --check` [Ref: ci_commands]
8. **[Deploy]** Executar `wrangler deploy --dry-run` [Ref: REQ-024]
9. **[Deploy]** Deploy para Cloudflare Pages e aplicar migration em produção [Ref: REQ-023]
10. **[Validação]** Verificar URL pública retornando HTTP 200 e testar submissão de newsletter

---

## Referências

- **Code Map:** `architecture/code-map.md` (sprint sp-001)
- **Stack Global:** `system-rules.md` → `<global_stack>`
- **Edge Compatibility:** `architecture/SOPs/SOP-02-edge-compatibility.md`
- **Binding D1:** `apps/web/wrangler.toml` → binding `DB` → database `recipehub-d1`
"}}
</tool_call>
<tool_response>
File written successfully.
</tool_response>

<tool_call>
{"name": "complete_phase", "parameters": {"summary": "PRD sp-002 gerado: landing page estática do RecipeHub com hero section, 6 cards mockados (Unsplash), formulário de newsletter com API Route Astro nativa salvando emails no D1 (tabela newsletter_subscribers). Zero novas variáveis de ambiente. 5 user stories, 24 requisitos funcionais, 14 non-goals explícitos."}}
</tool_call>
<tool_response>
Phase completed successfully.
</tool_response>

**Blueprint concluído.** PRD salvo em `architecture/plans/prd-sprint-sp-002.md`.