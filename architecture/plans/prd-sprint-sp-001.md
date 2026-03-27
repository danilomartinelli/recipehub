# PRD — Sprint sp-001: RecipeHub Landing Page

> **Sprint Code:** sp-001
> **Status:** Approved for Execution
> **Última atualização:** 2025-01-01
> **Autor:** Witek Blueprint Agent

---

## 1. Visão Geral & North Star

### Problema

O RecipeHub ainda não tem presença online. Não há como apresentar o produto a potenciais usuários nem captar interesse antes do lançamento completo.

### Solução desta Sprint

Entregar uma **landing page pública e funcional**, deployada no Cloudflare Pages via Astro com runtime edge, contendo:

- **Hero Section** — apresentação do produto com headline, subheadline e CTA visual.
- **Cards de Receitas em Destaque** — grid com receitas estáticas (imagem, título, tempo de preparo), hardcoded no código.
- **Formulário de Newsletter** — captura de email via `POST /api/newsletter`, persiste no banco D1.

### Definition of Done (North Star)

A sprint está **concluída** quando:

1. A URL pública do Cloudflare Pages retorna HTTP 200 com a landing page renderizada.
2. Hero section, cards de receitas e formulário de newsletter estão visíveis e responsivos.
3. O formulário de newsletter persiste o email no banco D1 e retorna feedback visual ao usuário (sucesso ou erro).
4. O deploy foi realizado via `wrangler` / Cloudflare Pages CI sem erros de build.

---

## 2. Esquema de Dados (SSoT — Fonte Única da Verdade)

### 2.1 Tabelas D1

#### Tabela: `newsletter_subscribers`

Arquivo de definição: `src/db/schema.sql`

```sql
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  email      TEXT    NOT NULL UNIQUE,
  created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
```

| Coluna       | Tipo    | Constraints              | Descrição                        |
|-------------|---------|--------------------------|----------------------------------|
| `id`        | INTEGER | PRIMARY KEY AUTOINCREMENT | Identificador único do subscriber |
| `email`     | TEXT    | NOT NULL, UNIQUE          | Email capturado pelo formulário  |
| `created_at`| TEXT    | NOT NULL, DEFAULT now()   | Timestamp ISO 8601 da inscrição  |

> **Nota:** Não há tabela para receitas. Os dados dos cards são estáticos (hardcoded).

### 2.2 Armazenamento R2

**Não se aplica a esta sprint.** Imagens das receitas em destaque devem ser servidas como assets estáticos na pasta `public/images/recipes/` do projeto Astro, ou referenciadas via URL externa (ex: Unsplash). Nenhum bucket R2 será criado nesta sprint.

### 2.3 Dados Estáticos — Receitas em Destaque

Arquivo: `src/data/featured-recipes.ts`

```typescript
export interface Recipe {
  id: string;
  title: string;
  imageUrl: string;
  prepTimeMinutes: number;
  description: string;
}

export const FEATURED_RECIPES: Recipe[] = [
  {
    id: 'bolo-cenoura',
    title: 'Bolo de Cenoura com Cobertura de Chocolate',
    imageUrl: '/images/recipes/bolo-cenoura.jpg',
    prepTimeMinutes: 50,
    description: 'Um clássico brasileiro fofo por dentro e crocante por fora.',
  },
  {
    id: 'risoto-cogumelos',
    title: 'Risoto de Cogumelos',
    imageUrl: '/images/recipes/risoto-cogumelos.jpg',
    prepTimeMinutes: 35,
    description: 'Cremoso e aromático, perfeito para um jantar especial.',
  },
  {
    id: 'acai-bowl',
    title: 'Açaí Bowl Tropical',
    imageUrl: '/images/recipes/acai-bowl.jpg',
    prepTimeMinutes: 10,
    description: 'Refrescante, nutritivo e pronto em menos de 10 minutos.',
  },
];
```

### 2.4 Payloads JSON — API de Newsletter

#### `POST /api/newsletter` — Request Body

```json
{
  \"email\": \"usuario@exemplo.com\"
}
```

#### `POST /api/newsletter` — Response (Sucesso `201 Created`)

```json
{
  \"success\": true,
  \"message\": \"Email cadastrado com sucesso!\"
}
```

#### `POST /api/newsletter` — Response (Email já cadastrado `409 Conflict`)

```json
{
  \"success\": false,
  \"error\": \"EMAIL_ALREADY_EXISTS\",
  \"message\": \"Este email já está cadastrado.\"
}
```

#### `POST /api/newsletter` — Response (Payload inválido `400 Bad Request`)

```json
{
  \"success\": false,
  \"error\": \"VALIDATION_ERROR\",
  \"message\": \"Email inválido. Forneça um endereço de email válido.\"
}
```

#### `POST /api/newsletter` — Response (Erro interno `500 Internal Server Error`)

```json
{
  \"success\": false,
  \"error\": \"INTERNAL_ERROR\",
  \"message\": \"Erro interno. Tente novamente mais tarde.\"
}
```

---

## 3. Histórias de Usuário & Matriz do Avaliador

> **Aviso de Escopo:** Todas as histórias abaixo são passíveis de execução dentro desta única sprint. Qualquer funcionalidade não listada aqui está explicitamente fora do escopo.

---

### US-001: Hero Section

**Descrição:** Como visitante do RecipeHub, eu quero ver uma hero section impactante ao acessar a landing page, para entender imediatamente o propósito do produto e ser incentivado a continuar navegando.

**Matriz de Teste do Avaliador (Critérios de Aceite):**

- [ ] **UI:** A hero section renderiza com headline principal (ex: \"Descubra Receitas que Você Vai Amar\"), subheadline descritivo e ao menos um elemento de CTA visual (botão ou link âncora para a seção de newsletter).
- [ ] **Responsivo:** O layout da hero section adapta corretamente para mobile (375px), tablet (768px) e desktop (1280px) sem overflow horizontal.
- [ ] **Performance:** A hero section renderiza sem JavaScript client-side obrigatório (Astro SSR/SSG). Nenhum layout shift (CLS) visível no carregamento inicial.
- [ ] **Acessibilidade:** A headline é um elemento `<h1>` único na página. Imagens de background/decorativas possuem `alt` apropriado ou `aria-hidden=\"true\"`.

---

### US-002: Cards de Receitas em Destaque

**Descrição:** Como visitante, eu quero ver cards visuais de receitas em destaque com imagem, título e tempo de preparo, para ter uma prévia do conteúdo disponível no RecipeHub.

**Matriz de Teste do Avaliador (Critérios de Aceite):**

- [ ] **UI:** A seção renderiza exatamente 3 cards com os dados de `FEATURED_RECIPES` (definidos em `src/data/featured-recipes.ts`). Cada card exibe: imagem, título, tempo de preparo (em minutos) e descrição curta.
- [ ] **Dados:** Nenhuma chamada de banco de dados é feita para esta seção. Os dados são importados diretamente do arquivo estático `src/data/featured-recipes.ts`.
- [ ] **Responsivo:** Em mobile, os cards empilham verticalmente (1 coluna). Em tablet, 2 colunas. Em desktop, 3 colunas.
- [ ] **Imagens:** Cada card possui uma tag `<img>` com atributo `alt` preenchido com o título da receita, e `loading=\"lazy\"` para as imagens abaixo do fold.

---

### US-003: Formulário de Newsletter (Frontend)

**Descrição:** Como visitante interessado, eu quero preencher meu email em um formulário de newsletter, para receber atualizações do RecipeHub quando o produto for lançado.

**Matriz de Teste do Avaliador (Critérios de Aceite):**

- [ ] **UI:** O formulário contém um campo `<input type=\"email\">` com placeholder, um botão de submit e uma área de feedback de estado (vazia por padrão).
- [ ] **Validação Client-Side:** O submit só é disparado se o campo contiver um email no formato válido (`x@x.x`). Caso inválido, exibe mensagem de erro inline sem fazer request HTTP.
- [ ] **Estado de Loading:** O botão de submit exibe estado desabilitado/loading enquanto o request `POST /api/newsletter` está em andamento.
- [ ] **Feedback de Sucesso:** Após `201`, o formulário exibe mensagem de sucesso (ex: \"Email cadastrado com sucesso!\") e limpa o campo de input.
- [ ] **Feedback de Erro (409):** Exibe mensagem \"Este email já está cadastrado.\" sem derrubar a página.
- [ ] **Feedback de Erro (outros):** Exibe mensagem genérica \"Erro ao cadastrar. Tente novamente.\" para erros `400` e `500`.

---

### US-004: Endpoint de Newsletter (Backend)

**Descrição:** Como sistema, eu preciso de um endpoint `POST /api/newsletter` que valide o email recebido e o persista na tabela `newsletter_subscribers` do banco D1, para captar leads com segurança.

**Matriz de Teste do Avaliador (Critérios de Aceite):**

- [ ] **API:** O endpoint `POST /api/newsletter` existe em `src/pages/api/newsletter.ts` e responde com os payloads JSON definidos na seção 2.4.
- [ ] **Validação Server-Side:** O endpoint valida o campo `email` com Zod antes de qualquer operação no banco. Emails inválidos retornam `400` com `error: \"VALIDATION_ERROR\"`. [Ref: FR-002]
- [ ] **Dados (Sucesso):** Um email válido e inédito é inserido na tabela `newsletter_subscribers` do D1 e o endpoint retorna `201`. [Ref: FR-003]
- [ ] **Dados (Duplicata):** Um email já existente resulta em retorno `409` com `error: \"EMAIL_ALREADY_EXISTS\"` sem lançar exceção não tratada. [Ref: FR-004]
- [ ] **Erro Interno:** Qualquer erro de banco não previsto é capturado em bloco `try/catch` e retorna `500` com `error: \"INTERNAL_ERROR\"`. [Ref: FR-005]
- [ ] **Segurança:** O endpoint aceita apenas método `POST`. Requisições `GET`, `PUT`, `DELETE` retornam `405 Method Not Allowed`. [Ref: FR-006]
- [ ] **Binding D1:** O endpoint acessa o banco via `context.locals.runtime.env.DB` (padrão do adapter `@astrojs/cloudflare`), sem usar `process.env`. [Ref: FR-007]

---

### US-005: Deploy no Cloudflare Pages

**Descrição:** Como time, eu preciso que a landing page esteja acessível via URL pública no Cloudflare Pages, para que o produto tenha presença online ao fim desta sprint.

**Matriz de Teste do Avaliador (Critérios de Aceite):**

- [ ] **Build:** O comando `astro build` conclui sem erros de TypeScript (`tsc --noEmit`) ou de build.
- [ ] **Deploy:** A URL pública do Cloudflare Pages retorna HTTP 200 para a rota `/`.
- [ ] **API no Edge:** A rota `/api/newsletter` responde corretamente no ambiente de produção (Cloudflare Workers runtime), não apenas em dev local.
- [ ] **Binding D1 em Produção:** O banco D1 `recipehub-db` está criado e o binding `DB` está configurado no painel do Cloudflare Pages (ou via `wrangler.toml`), e a tabela `newsletter_subscribers` foi aplicada via `wrangler d1 execute`.
- [ ] **Assets Estáticos:** As imagens em `public/images/recipes/` são servidas corretamente pelo CDN do Cloudflare.

---

## 4. Requisitos Funcionais (FR)

### Estrutura de Arquivos Obrigatória

```
/                               ← raiz do projeto (monorepo single-app)
├── public/
│   └── images/
│       └── recipes/
│           ├── bolo-cenoura.jpg
│           ├── risoto-cogumelos.jpg
│           └── acai-bowl.jpg
├── src/
│   ├── data/
│   │   └── featured-recipes.ts     ← dados estáticos das receitas
│   ├── db/
│   │   └── schema.sql              ← DDL da tabela newsletter_subscribers
│   ├── components/
│   │   ├── HeroSection.astro
│   │   ├── RecipeCard.astro
│   │   ├── RecipesGrid.astro
│   │   └── NewsletterForm.tsx      ← componente React (client-side state)
│   ├── layouts/
│   │   └── BaseLayout.astro
│   └── pages/
│       ├── index.astro             ← landing page
│       └── api/
│           └── newsletter.ts       ← Astro API Route (POST handler)
├── wrangler.toml
└── astro.config.mjs
```

---

**FR-001 — Configuração do Adapter Cloudflare:**
O arquivo `astro.config.mjs` deve configurar o adapter `@astrojs/cloudflare` com `mode: 'advanced'` (ou padrão compatível com D1), habilitando acesso a `context.locals.runtime.env` nas API Routes. O output deve ser `'server'` para habilitar SSR nas rotas de API.

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
  integrations: [react(), tailwind()],
});
```

**FR-002 — Validação de Email com Zod:**
O arquivo `src/pages/api/newsletter.ts` deve importar e usar Zod para validar o body da requisição antes de qualquer operação no D1. O schema Zod obrigatório é:

```typescript
import { z } from 'zod';

const NewsletterSchema = z.object({
  email: z.string().email({ message: 'Email inválido.' }),
});
```

> **Nota de dependência:** Zod deve ser adicionado ao `package.json`: `pnpm add zod`.

**FR-003 — Inserção no D1 (Happy Path):**
Após validação bem-sucedida do Zod, o endpoint deve executar:

```typescript
await env.DB.prepare(
  'INSERT INTO newsletter_subscribers (email) VALUES (?)'
).bind(email).run();
```

Retornar `Response` com status `201` e body JSON `{ success: true, message: \"Email cadastrado com sucesso!\" }`.

**FR-004 — Tratamento de Email Duplicado:**
O campo `email` possui constraint `UNIQUE` na tabela D1. Quando o D1 lançar erro de constraint violation (erro contendo `UNIQUE constraint failed` na mensagem), o endpoint deve capturar este erro específico e retornar status `409` com body `{ success: false, error: \"EMAIL_ALREADY_EXISTS\", message: \"Este email já está cadastrado.\" }`.

```typescript
// Exemplo de detecção de duplicata
if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
  return new Response(JSON.stringify({ success: false, error: 'EMAIL_ALREADY_EXISTS', message: 'Este email já está cadastrado.' }), { status: 409 });
}
```

**FR-005 — Tratamento de Erros Genéricos:**
Todo o bloco de acesso ao D1 deve estar dentro de `try/catch`. Erros não identificados como duplicata devem retornar status `500` com body `{ success: false, error: \"INTERNAL_ERROR\", message: \"Erro interno. Tente novamente mais tarde.\" }`. O erro original deve ser logado via `console.error` para visibilidade nos logs do Worker.

**FR-006 — Guard de Método HTTP:**
O arquivo `src/pages/api/newsletter.ts` deve exportar apenas a função `POST`. Requisições com outros métodos devem retornar `405`.

```typescript
// Astro API Route — só exportar POST
export const POST: APIRoute = async ({ request, locals }) => { ... };
// Não exportar GET, PUT, DELETE
```

**FR-007 — Acesso ao Binding D1 via Astro/Cloudflare:**
O acesso ao binding D1 deve usar o padrão do adapter `@astrojs/cloudflare`:

```typescript
export const POST: APIRoute = async ({ locals }) => {
  const env = (locals as any).runtime.env;
  const db = env.DB; // binding D1
  // ...
};
```

**NUNCA** use `process.env.DB` — isso viola a regra edge de `system-rules.md`.

**FR-008 — Componente NewsletterForm como React Client Component:**
O formulário de newsletter deve ser implementado como componente React (`NewsletterForm.tsx`) com diretiva `client:load` no Astro para habilitar interatividade (estados de loading, feedback). Usar `useState` para controlar: valor do input, estado de loading, mensagem de feedback.

```astro
<!-- Em index.astro -->
<NewsletterForm client:load />
```

**FR-009 — Dados Estáticos das Receitas:**
Os 3 cards de receitas em destaque devem ser renderizados via loop sobre o array `FEATURED_RECIPES` importado de `src/data/featured-recipes.ts`. Nenhuma chamada a banco de dados ou API externa deve ocorrer para esta seção.

**FR-010 — Responsividade com TailwindCSS:**
Todas as seções devem usar classes TailwindCSS para responsividade. O grid de receitas deve usar: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`.

**FR-011 — Inicialização do Banco D1:**
O arquivo `src/db/schema.sql` deve conter o DDL completo da tabela `newsletter_subscribers`. O comando para aplicar em produção é:

```bash
wrangler d1 execute recipehub-db --remote --file=src/db/schema.sql
```

Este passo é obrigatório antes do primeiro deploy funcional.

---

## 5. Fora do Escopo (Non-Goals)

Os itens abaixo são **explicitamente proibidos** nesta sprint para evitar scope creep. Qualquer PR que inclua esses itens deve ser rejeitado pelo Code Review.

| # | Item Cortado | Justificativa |
|---|-------------|---------------|
| NG-01 | **Painel Admin / Dashboard** | Nenhuma área autenticada. Sem rotas protegidas, sem login, sem visualização de subscribers. |
| NG-02 | **Autenticação de qualquer tipo** | Sem JWT, sessions, OAuth, Cloudflare Access ou qualquer mecanismo de auth. |
| NG-03 | **Internacionalização (i18n)** | A página é apenas em português. Sem `astro-i18n`, sem rotas `/en/`. |
| NG-04 | **Testes automatizados** | Sem configuração de Vitest, Playwright ou qualquer test runner nesta sprint. |
| NG-05 | **Tabela de Receitas no D1** | Receitas são estáticas. Nenhuma tabela `recipes` no banco. |
| NG-06 | **R2 Bucket para Imagens** | Imagens das receitas são assets locais em `public/`. Nenhum bucket R2 criado. |
| NG-07 | **Email de confirmação (Resend/SMTP)** | Nenhuma integração com serviço de email. O cadastro apenas persiste no D1. |
| NG-08 | **Paginação ou busca de receitas** | A seção de receitas exibe exatamente 3 cards estáticos, sem filtros ou paginação. |
| NG-09 | **Analytics além do nativo** | Sem integração com Google Analytics, Mixpanel ou similar. Cloudflare Analytics nativo pode ser ativado sem código. |
| NG-10 | **CMS ou source de dados externo** | Sem integração com Contentful, Sanity, Notion ou qualquer CMS headless. |

---

## 6. Cloudflare Bindings & Integrações

### Bindings Cloudflare

| Binding | Tipo | Nome no `wrangler.toml` | Uso |
|---------|------|------------------------|-----|
| `DB` | D1 Database | `recipehub-db` | Persistir emails da newsletter |

> O binding `DB` já está declarado no `wrangler.toml` existente com `database_id = \"placeholder-update-with-real-id\"`. **O ID real do banco D1 deve ser criado via `wrangler d1 create recipehub-db` e atualizado no `wrangler.toml` antes do deploy.**

### APIs Externas

**Nenhuma.** Esta sprint não requer nenhuma API externa, secret ou variável de ambiente além do binding D1 nativo.

### Checklist de Infraestrutura (pré-deploy)

```bash
# 1. Criar o banco D1 (se ainda não existir)
wrangler d1 create recipehub-db

# 2. Atualizar o database_id no wrangler.toml com o ID retornado acima

# 3. Aplicar o schema SQL no banco remoto
wrangler d1 execute recipehub-db --remote --file=src/db/schema.sql

# 4. Verificar build local
pnpm build

# 5. Deploy
wrangler pages deploy dist/
```

---

## 7. Restrições & Casos Limite

### R-001 — Runtime Edge (Cloudflare Workers)

O projeto usa `compatibility_flags = [\"nodejs_compat\"]` no `wrangler.toml`. Ainda assim, as regras de `system-rules.md` se aplicam:

- **PROIBIDO:** `import fs from 'node:fs'`, `import path from 'node:path'`, `process.env.*`
- **PERMITIDO:** Web APIs (`fetch`, `Request`, `Response`, `URL`, `TextEncoder`)
- **ACESSO AO ENV:** Exclusivamente via `locals.runtime.env` nas API Routes do Astro

### R-002 — Dependência: Zod não está no package.json

Zod é necessário para FR-002 mas não está listado nas dependências atuais do `package.json`. O especialista de execução deve adicionar antes de implementar o endpoint:

```bash
pnpm add zod
```

### R-003 — Output `'server'` obrigatório para API Routes

O arquivo `astro.config.mjs` atual não está no repositório (não encontrado). Ele deve ser criado com `output: 'server'` — sem isso, as API Routes (`src/pages/api/newsletter.ts`) não funcionam com o adapter Cloudflare. **Sem `output: 'server'`, o endpoint `/api/newsletter` não existirá no build.**

### R-004 — Modo Hybrid vs Full Server

Com `output: 'server'`, todas as páginas são SSR por padrão. Para que a landing page (`index.astro`) seja servida como HTML estático (melhor performance), adicionar `export const prerender = true` no topo do arquivo:

```astro
---
// src/pages/index.astro
export const prerender = true;
---
```

Isso mantém a landing estática (CDN) e apenas as rotas de API são dinâmicas (Worker).

### R-005 — Imagens de Placeholder

Se as imagens reais das receitas não estiverem disponíveis durante o desenvolvimento, usar URLs do Unsplash como placeholder nos dados de `featured-recipes.ts`. As imagens devem ser substituídas por assets locais em `public/images/recipes/` antes do deploy final para evitar dependência de CDN externo.

### R-006 — Constraint UNIQUE no D1 e Erro de Duplicata

O SQLite (base do D1) lança `SqliteError: UNIQUE constraint failed: newsletter_subscribers.email` quando há duplicata. A detecção no catch deve verificar `error.message.includes('UNIQUE constraint failed')` — não dependa de códigos de erro numéricos, pois o D1 pode variar o formato.

### R-007 — wrangler.toml com `pages_build_output_dir`

O `wrangler.toml` atual já contém `pages_build_output_dir = \"./dist\"`, o que indica deploy via Cloudflare Pages (não Workers standalone). O build de produção usa `astro build` que gera o diretório `dist/`. O comando de deploy correto é `wrangler pages deploy dist/`.

---

## 8. Referências de Arquitetura

### Stack Utilizada nesta Sprint

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| Framework | Astro | ^5.7.13 |
| Adapter | @astrojs/cloudflare | ^12.4.0 |
| UI Components | React | ^19.1.0 |
| Estilização | TailwindCSS | ^4.1.6 |
| Validação | Zod | latest (adicionar) |
| Banco de Dados | Cloudflare D1 (SQLite) | nativo |
| Deploy | Cloudflare Pages | nativo |

### Arquivos a Criar (Checklist do Especialista)

```
[ ] astro.config.mjs                          ← FR-001
[ ] src/db/schema.sql                         ← FR-011
[ ] src/data/featured-recipes.ts              ← FR-009
[ ] src/layouts/BaseLayout.astro              ← estrutura base
[ ] src/components/HeroSection.astro          ← US-001
[ ] src/components/RecipeCard.astro           ← US-002
[ ] src/components/RecipesGrid.astro          ← US-002
[ ] src/components/NewsletterForm.tsx         ← US-003, FR-008
[ ] src/pages/index.astro                     ← US-001/002/003, R-004
[ ] src/pages/api/newsletter.ts               ← US-004, FR-002/003/004/005/006/007
[ ] public/images/recipes/bolo-cenoura.jpg    ← US-002 (ou URL placeholder)
[ ] public/images/recipes/risoto-cogumelos.jpg
[ ] public/images/recipes/acai-bowl.jpg
```

### Arquivos a Modificar

```
[ ] package.json       ← adicionar zod (pnpm add zod)
[ ] wrangler.toml      ← atualizar database_id com ID real do D1
```
"}}
</tool_call>
<tool_response>
File written to architecture/plans/prd-sprint-sp-001.md
</tool_response>

<tool_call>
{"name": "complete_phase", "parameters": {"summary": "Blueprint sp-001 concluído: landing page RecipeHub com hero, 3 cards estáticos e newsletter via Astro API Route + D1, deployada no Cloudflare Pages."}}
</tool_call>
<tool_response>
Phase marked as complete.
</tool_response>

**PRD salvo** em `architecture/plans/prd-sprint-sp-001.md`. ✅

**Resumo executivo do Blueprint:**

- **Escopo:** Landing page pública (hero + 3 cards estáticos + newsletter), deployada no Cloudflare Pages com Astro `output: 'server'` + `prerender: true` na index.
- **Data Model:** 1 tabela D1 `newsletter_subscribers` (id, email, created_at com UNIQUE em email). Receitas hardcoded em `src/data/featured-recipes.ts`. Sem R2.
- **Integrações:** Apenas binding `DB` (D1 nativo), já declarado no `wrangler.toml` — apenas o `database_id` precisa ser atualizado com o ID real. Zod deve ser adicionado via `pnpm add zod`.
- **Non-Goals:** Sem admin, sem auth, sem i18n, sem testes, sem tabela de receitas, sem R2, sem email transacional.
- **Atenção crítica:** `astro.config.mjs` ainda não existe no projeto — deve ser criado como primeiro passo da execução (FR-001).