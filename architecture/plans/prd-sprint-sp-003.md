# PRD — Sprint sp-003: RecipeHub Landing Page

## 1. Visão Geral & North Star

Esta sprint entrega a **landing page pública do RecipeHub** — um artefato estático de conversão hospedado via Cloudflare Pages. A página apresenta o produto com uma hero section impactante, 6 cards fixos de receitas em destaque (com imagem via Unsplash e tempo de preparo) e um formulário de newsletter que persiste o email do visitante no banco D1. O estado de **Concluído** é: página deployada em URL pública, formulário enviando email para o D1 com feedback visual de sucesso/erro, zero dependências externas além do binding D1.

---

## 2. Esquema de Dados (SSoT — Fonte Única da Verdade)

### 2.1 Tabela D1 — `newsletter_subscribers`

Arquivo de referência: `packages/db/src/schema.ts` (ou criar caso não exista).

```sql
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id         TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  email      TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

Equivalente em Drizzle ORM:

```ts
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const newsletterSubscribers = sqliteTable('newsletter_subscribers', {
  id: text('id').primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  email: text('email').notNull().unique(),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
});
```

> **Nota:** Nenhuma tabela existente é alterada. Sem R2, sem KV nesta sprint.

### 2.2 Receitas — Dados Hardcoded

As 6 receitas são definidas como um array estático em `apps/web/src/data/featured-recipes.ts`:

```ts
export interface Recipe {
  id: string;
  title: string;
  prepTime: number; // em minutos
  imageUrl: string; // URL pública do Unsplash
  category: string;
}

export const FEATURED_RECIPES: Recipe[] = [
  {
    id: 'r1',
    title: 'Risoto de Cogumelos',
    prepTime: 35,
    imageUrl: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&q=80',
    category: 'Massas & Risotos',
  },
  {
    id: 'r2',
    title: 'Salmão Grelhado com Ervas',
    prepTime: 20,
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80',
    category: 'Frutos do Mar',
  },
  {
    id: 'r3',
    title: 'Bowl de Açaí Tropical',
    prepTime: 10,
    imageUrl: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600&q=80',
    category: 'Saudável',
  },
  {
    id: 'r4',
    title: 'Bolo de Chocolate Intenso',
    prepTime: 50,
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80',
    category: 'Sobremesas',
  },
  {
    id: 'r5',
    title: 'Tacos de Frango com Guacamole',
    prepTime: 25,
    imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80',
    category: 'Mexicano',
  },
  {
    id: 'r6',
    title: 'Sopa de Tomate Assado',
    prepTime: 40,
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80',
    category: 'Sopas',
  },
];
```

### 2.3 Payloads da API

#### `POST /api/subscribe`

**Request Body:**
```json
{
  \"email\": \"usuario@exemplo.com\"
}
```

**Response — Sucesso (201):**
```json
{
  \"success\": true,
  \"message\": \"Email cadastrado com sucesso!\"
}
```

**Response — Email já cadastrado (409):**
```json
{
  \"success\": false,
  \"error\": \"EMAIL_ALREADY_EXISTS\",
  \"message\": \"Este email já está na nossa lista.\"
}
```

**Response — Payload inválido (400):**
```json
{
  \"success\": false,
  \"error\": \"VALIDATION_ERROR\",
  \"message\": \"Email inválido. Por favor, verifique o endereço informado.\"
}
```

**Response — Erro interno (500):**
```json
{
  \"success\": false,
  \"error\": \"INTERNAL_ERROR\",
  \"message\": \"Algo deu errado. Tente novamente em instantes.\"
}
```

---

## 3. Histórias de Usuário & Matriz do Avaliador

### US-001: Hero Section Responsiva

**Descrição:** Como visitante do RecipeHub, eu quero ver uma hero section visualmente impactante ao acessar a landing page para que eu entenda imediatamente o valor do produto.

**Critérios de Aceite:**

- [ ] **UI:** A hero section renderiza com título principal (H1), subtítulo descritivo e um CTA (Call to Action) que ancora até o formulário de newsletter (`#newsletter`)
- [ ] **Responsividade:** Layout correto em mobile (320px+), tablet (768px+) e desktop (1280px+) sem overflow horizontal
- [ ] **Performance:** Imagem de background (se houver) usa `loading=\"eager\"` e tem `alt` descritivo; sem layout shift perceptível (CLS)
- [ ] **Acessibilidade:** H1 único na página, contraste de texto ≥ 4.5:1 conforme WCAG AA

---

### US-002: Grid de Cards de Receitas em Destaque

**Descrição:** Como visitante, eu quero ver 6 cards de receitas em destaque com imagem, título, categoria e tempo de preparo para que eu perceba a variedade e qualidade do conteúdo do RecipeHub.

**Critérios de Aceite:**

- [ ] **UI:** Exatamente 6 cards renderizados a partir do array `FEATURED_RECIPES` (dados hardcoded), cada um exibindo: imagem Unsplash, título, categoria e tempo de preparo formatado (ex: \"35 min\")
- [ ] **Responsividade:** Grid de 1 coluna em mobile, 2 colunas em tablet, 3 colunas em desktop
- [ ] **Imagens:** Todas as imagens usam `loading=\"lazy\"`, têm `width` e `height` definidos para evitar CLS, e o atributo `alt` é o título da receita
- [ ] **Hover:** CSS transition suave (max 200ms) no hover do card (ex: leve elevação via `box-shadow` ou `transform: translateY`)
- [ ] **Sem links:** Os cards NÃO são clicáveis e NÃO levam a nenhuma página de detalhe (Non-Goal desta sprint)

---

### US-003: Formulário de Newsletter com Persistência no D1

**Descrição:** Como visitante interessado, eu quero me inscrever na newsletter do RecipeHub para que eu receba novidades sobre o produto.

**Critérios de Aceite:**

- [ ] **UI:** Formulário com campo de email (type=\"email\", required, placeholder descritivo) e botão de submit; âncora `id=\"newsletter\"` presente na section
- [ ] **Validação client-side:** Campo email inválido bloqueia o submit e exibe mensagem de erro inline antes da requisição HTTP
- [ ] **Validação server-side:** O endpoint `POST /api/subscribe` valida o payload com **Zod** antes de qualquer operação no D1 [Ref: REQ-004]
- [ ] **Estado de loading:** Botão exibe estado desabilitado + indicador visual (ex: spinner ou texto \"Enviando...\") durante a requisição
- [ ] **Feedback de sucesso:** Mensagem de confirmação verde exibida após status 201, substituindo ou complementando o formulário
- [ ] **Feedback de erro — email duplicado:** Mensagem amarela/laranja informando que o email já está cadastrado (status 409)
- [ ] **Feedback de erro — genérico:** Mensagem vermelha para erros 400 e 500, sem expor detalhes técnicos ao usuário
- [ ] **Persistência:** Após submit bem-sucedido, o email aparece na tabela `newsletter_subscribers` do D1 com `id` e `created_at` preenchidos
- [ ] **Unicidade:** Tentativa de cadastrar email já existente retorna 409 sem criar registro duplicado no D1

---

### US-004: Deploy Funcional via Cloudflare Pages

**Descrição:** Como time de produto, eu quero a landing page acessível em URL pública via Cloudflare Pages para que o RecipeHub possa ser compartilhado com potenciais usuários.

**Critérios de Aceite:**

- [ ] **Deploy:** `wrangler pages deploy` ou pipeline CI executa sem erros
- [ ] **Binding D1:** O binding `DB` está configurado no `wrangler.toml` (ou `wrangler.jsonc`) do app `apps/web` e o endpoint `/api/subscribe` acessa `c.env.DB` (ou `context.env.DB` no padrão Astro) sem erro de runtime
- [ ] **Build estático:** `astro build` conclui sem erros de TypeScript (tsc --noEmit passa)
- [ ] **SSR parcial:** O modo de output do Astro está configurado como `hybrid` ou `server` para permitir que o endpoint `/api/subscribe` rode como Cloudflare Worker, enquanto o restante da página é estático

---

## 4. Requisitos Funcionais (FR)

| ID | Prioridade | Descrição |
|----|------------|-----------|
| **REQ-001** | MUST | A landing page DEVE ser construída em Astro (`apps/web`) com TailwindCSS para estilização, seguindo o `<global_stack>` definido na doutrina do projeto |
| **REQ-002** | MUST | O arquivo de saída do Astro DEVE usar `output: 'hybrid'` (ou `'server'`) no `astro.config.mjs` com o adapter `@astrojs/cloudflare` para habilitar Cloudflare Workers nos endpoints de API |
| **REQ-003** | MUST | O endpoint `src/pages/api/subscribe.ts` DEVE exportar uma função `POST` compatível com o padrão de API Routes do Astro (não Hono, pois tudo está em `apps/web`) |
| **REQ-004** | MUST | O endpoint DEVE validar o body da requisição usando **Zod** antes de qualquer operação no D1. Schema mínimo: `z.object({ email: z.string().email() })` |
| **REQ-005** | MUST | O acesso ao D1 DEVE usar o binding via `context.locals.runtime.env.DB` (padrão `@astrojs/cloudflare`) e Drizzle ORM para executar as queries |
| **REQ-006** | MUST | O schema Drizzle da tabela `newsletter_subscribers` DEVE ser definido em `packages/db/src/schema.ts` (ou no local equivalente mapeado no `code-map.md`) |
| **REQ-007** | MUST | A migration SQL DEVE ser gerada via `drizzle-kit generate` e aplicada via `wrangler d1 migrations apply` antes do deploy |
| **REQ-008** | MUST | NUNCA usar `process.env` — acessar variáveis de ambiente exclusivamente via `context.locals.runtime.env` no endpoint Astro |
| **REQ-009** | MUST | NUNCA importar módulos Node.js nativos (`fs`, `path`, `crypto`, etc.) ou pacotes do blocklist definido em `architecture/SOPs/SOP-02-edge-compatibility.md` |
| **REQ-010** | MUST | O formulário de newsletter DEVE implementar feedback visual de três estados: **loading** (submit em progresso), **success** (201), **error** (400/409/500) usando estado React ou lógica Astro nativa |
| **REQ-011** | SHOULD | As imagens dos cards DEVE usar o domínio `images.unsplash.com` com parâmetros de otimização (`?w=600&q=80`). O domínio DEVE estar na allowlist de `image.domains` no `astro.config.mjs` |
| **REQ-012** | SHOULD | O campo email no formulário DEVE ser validado no lado cliente (HTML5 `type=\"email\"` + `required`) antes de disparar a requisição ao endpoint |
| **REQ-013** | SHOULD | A hero section DEVE incluir um CTA com âncora `href=\"#newsletter\"` para rolar suavemente até o formulário |
| **REQ-014** | COULD | Adicionar `<meta>` tags básicas de SEO: `title`, `description` e `og:image` estático na `<head>` da landing page |
| **REQ-015** | COULD | Implementar `scroll-behavior: smooth` via CSS global para a âncora do CTA |

---

## 5. Fora do Escopo (Non-Goals)

Os itens abaixo estão **explicitamente proibidos** nesta sprint. Qualquer PR que os inclua deve ser rejeitado.

| Item | Motivo da Exclusão |
|------|--------------------|
| Painel administrativo para visualizar subscribers | Escopo de sprint futura |
| CMS ou conteúdo dinâmico para receitas (banco de receitas) | Escopo de sprint futura |
| Página de detalhe de receita | Escopo de sprint futura |
| Busca ou filtragem de receitas | Escopo de sprint futura |
| Paginação de qualquer tipo | Sem dados dinâmicos nesta sprint |
| Email de confirmação de cadastro (ex: via Resend) | Nenhuma API externa nesta sprint |
| Cloudflare Turnstile / CAPTCHA | Escopo de sprint futura |
| Autenticação de usuários | Escopo de sprint futura |
| Analytics (ex: Cloudflare Web Analytics, Plausible) | Escopo de sprint futura |
| Internacionalização (i18n) | Escopo de sprint futura |
| Animações avançadas / scroll animations | Apenas `transition` CSS nos hovers |
| Sitemap dinâmico / Schema.org markup | Escopo de sprint futura |
| Armazenamento de imagens no R2 | Imagens via Unsplash CDN |
| Uso de KV para cache | Sem necessidade nesta sprint |

---

## 6. Cloudflare Bindings & Integrações

### Bindings Necessários

| Binding | Tipo | Variável no env | Descrição |
|---------|------|-----------------|-----------|
| `DB` | D1 Database | `context.locals.runtime.env.DB` | Banco de dados principal — tabela `newsletter_subscribers` |

### Configuração `wrangler.toml` (fragmento)

```toml
[[d1_databases]]
binding = \"DB\"
database_name = \"recipehub-db\"
database_id = \"<DATABASE_ID_AQUI>\"
```

> O `database_id` deve ser o mesmo já configurado no projeto (verificar `wrangler.toml` existente antes de alterar).

### APIs Externas

**Nenhuma.** Zero APIs externas, zero variáveis de ambiente adicionais, zero segredos novos.

---

## 7. Restrições & Casos Limite

### 7.1 Edge Runtime (Cloudflare Workers)

- **PROIBIDO** usar `process.env`, `Buffer`, `require()` ou qualquer módulo Node.js nativo
- O adapter `@astrojs/cloudflare` DEVE estar instalado e configurado — sem ele, os API Routes não executam como Workers
- O runtime do endpoint é **V8 Isolate**, não Node.js — toda lógica deve ser compatível com Web APIs

### 7.2 Unicidade de Email

- A coluna `email` tem constraint `UNIQUE` no D1
- O endpoint DEVE capturar o erro de constraint violation do D1/Drizzle e retornar **409** (não 500)
- Exemplo de detecção do erro de duplicidade com Drizzle + D1:

```ts
try {
  await db.insert(newsletterSubscribers).values({ email });
} catch (err: unknown) {
  const message = err instanceof Error ? err.message : String(err);
  if (message.includes('UNIQUE constraint failed')) {
    return new Response(
      JSON.stringify({ success: false, error: 'EMAIL_ALREADY_EXISTS', message: 'Este email já está na nossa lista.' }),
      { status: 409, headers: { 'Content-Type': 'application/json' } }
    );
  }
  throw err; // re-throw para o handler de 500
}
```

### 7.3 Unsplash CDN

- As URLs de imagens usam parâmetros de resize (`?w=600&q=80`) para não carregar imagens full-resolution
- O domínio `images.unsplash.com` DEVE estar na allowlist do Astro para otimização de imagem:

```js
// astro.config.mjs
export default defineConfig({
  image: {
    domains: ['images.unsplash.com'],
  },
});
```

### 7.4 Modo Output do Astro

- Com `output: 'static'` (padrão), API Routes NÃO são geradas — o build quebraria
- OBRIGATÓRIO usar `output: 'hybrid'` (permite páginas estáticas + rotas dinâmicas seletivas) ou `output: 'server'`
- A página index DEVE ter `export const prerender = true;` explicitamente se o modo for `'server'`, garantindo geração estática

### 7.5 CORS

- O endpoint `/api/subscribe` é chamado pelo próprio frontend no mesmo origin — sem necessidade de configurar CORS headers nesta sprint

### 7.6 Rate Limiting

- Sem rate limiting nesta sprint (Non-Goal). Em caso de abuso, o constraint `UNIQUE` do banco impede duplicatas, mas não limita tentativas com emails diferentes

---

## 8. Estrutura de Arquivos Esperada

```
apps/
  web/
    src/
      pages/
        index.astro              # Landing page principal
        api/
          subscribe.ts           # POST /api/subscribe — endpoint de newsletter
      components/
        HeroSection.astro        # Hero section com CTA
        RecipeCard.astro         # Card individual de receita
        RecipeGrid.astro         # Grid de 6 cards
        NewsletterForm.tsx       # Formulário interativo (React, para gerenciar estado)
      data/
        featured-recipes.ts      # Array FEATURED_RECIPES hardcoded
      layouts/
        BaseLayout.astro         # Layout base com <head> e meta tags
    astro.config.mjs             # output: 'hybrid', adapter @astrojs/cloudflare
    wrangler.toml                # Binding [[d1_databases]] DB
    package.json

packages/
  db/
    src/
      schema.ts                  # Drizzle schema — newsletterSubscribers table
      index.ts                   # Export do db client (drizzle + D1 binding)
    drizzle.config.ts            # Config do drizzle-kit
    migrations/
      0001_create_newsletter_subscribers.sql
```

> **Nota:** Se `packages/db` já existe com estrutura diferente, respeite o mapeamento atual do `code-map.md` e adapte os caminhos acima.

---

## 9. Checklist de Execução (para os Especialistas)

- [ ] **[REQ-002, REQ-003]** Instalar `@astrojs/cloudflare` e configurar `astro.config.mjs` com `output: 'hybrid'` e o adapter
- [ ] **[REQ-006]** Criar/atualizar `packages/db/src/schema.ts` com a tabela `newsletter_subscribers`
- [ ] **[REQ-007]** Rodar `drizzle-kit generate` e gerar o arquivo SQL de migration em `migrations/`
- [ ] **[REQ-001]** Criar `apps/web/src/data/featured-recipes.ts` com o array de 6 receitas
- [ ] **[REQ-001]** Criar `HeroSection.astro` com título, subtítulo e CTA ancorado em `#newsletter`
- [ ] **[REQ-001, REQ-011]** Criar `RecipeCard.astro` e `RecipeGrid.astro` com grid responsivo e imagens lazy
- [ ] **[REQ-010, REQ-012]** Criar `NewsletterForm.tsx` (React) com estados: idle/loading/success/error
- [ ] **[REQ-003, REQ-004, REQ-005]** Criar `src/pages/api/subscribe.ts` com validação Zod + insert Drizzle + tratamento de erro UNIQUE
- [ ] **[REQ-008, REQ-009]** Validar que nenhum `process.env` ou módulo Node.js foi importado
- [ ] **CI:** Rodar `tsc --noEmit` e `eslint .` sem erros
- [ ] **CI:** Rodar `wrangler pages deploy --dry-run` para validar o config antes do deploy real
- [ ] **[US-004]** Verificar que o binding `DB` está acessível no endpoint e que a tabela foi criada no D1 de produção
"}}
</tool_call>

<tool_response>
{"success":true,"path":"architecture/plans/prd-sprint-sp-003.md"}
</tool_response>

<tool_call>
{"name": "complete_phase", "parameters": {"summary": "Blueprint sp-003 concluído: landing page RecipeHub em apps/web (Astro hybrid + @astrojs/cloudflare), hero + 6 recipe cards hardcoded (Unsplash), formulário de newsletter com endpoint POST /api/subscribe, validação Zod, persistência D1 (tabela newsletter_subscribers via Drizzle), feedback visual de 3 estados (loading/success/error), zero APIs externas, sem admin/CMS/busca/detalhes."}}
</tool_call>

<tool_response>
{"success":true}
</tool_response>

---

**Resumo Executivo — Sprint sp-003**

**Escopo:** Landing page estática do RecipeHub com hero section, grid de 6 recipe cards hardcoded (imagens Unsplash) e formulário de newsletter com persistência real no D1. Tudo em `apps/web` (Astro + TailwindCSS), sem serviços separados.

**Data Model:** Uma única tabela nova — `newsletter_subscribers (id, email UNIQUE, created_at)` no D1, gerenciada via Drizzle ORM. Sem R2, sem KV.

**Integrações:** Zero APIs externas. Único binding necessário: `DB` (D1), já existente no `wrangler.toml`.

**Ponto crítico de arquitetura:** Astro DEVE ser configurado com `output: 'hybrid'` + adapter `@astrojs/cloudflare` para que o endpoint `POST /api/subscribe` rode como Worker — sem isso, o build falha.

**Non-Goals protegidos:** Sem painel admin, sem CMS, sem página de detalhe de receita, sem busca, sem email de confirmação (Resend), sem CAPTCHA, sem analytics.