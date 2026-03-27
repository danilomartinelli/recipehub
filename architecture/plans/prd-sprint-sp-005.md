# Code Map

> Mapa de componentes, serviços e utilitários do monorepo RecipeHub.
> Atualizado a cada Sprint pelo Trigger Agent.

## Status

Projeto em fase inicial — nenhuma sprint de execução foi concluída ainda.
Este mapa será populado a partir da Sprint 1.

## Componentes

_Nenhum componente registrado ainda._

## Serviços

_Nenhum serviço registrado ainda._

## Utilitários

_Nenhum utilitário registrado ainda._

## Schemas de Banco

_Nenhum schema registrado ainda._
```
</tool_response>

<tool_call>
{"name": "read_file", "parameters": {"path": "architecture/findings.md"}}
</tool_call>
<tool_response>
File: architecture/findings.md
```
# Findings

> Registro de erros, bloqueios e soluções encontradas ao longo das sprints.

## Status

Projeto em fase inicial — nenhum finding registrado ainda.
```
</tool_response>

Projeto em fase inicial, sem código existente para conflitos. Gerando o PRD completo agora.

---

**Resumo Executivo — sp-005:**
**Escopo:** Landing page single-page do RecipeHub em Astro (Cloudflare Pages) com hero section, 6 cards de receitas hardcoded e formulário de newsletter persistindo emails no D1 via Astro API Route (Pages Function). **Data Model:** Tabela `newsletter_subscribers` (id, email, created_at) no D1, sem colunas extras. **Integrações:** Apenas binding D1 nativo (`DB`) — zero APIs externas. **Non-Goals:** Páginas internas, autenticação, CMS, double opt-in, Worker separado, rotas dinâmicas de receitas.

<tool_call>
{"name": "write_file", "parameters": {"path": "architecture/plans/prd-sprint-sp-005.md", "content": "# PRD — Sprint sp-005: RecipeHub Landing Page

> **Status:** Draft  
> **Sprint Code:** sp-005  
> **Gerado por:** Witek Blueprint Agent  
> **Stack de Referência:** Astro + Cloudflare Pages + D1  

---

## 1. Visão Geral & North Star

### Descrição Técnica

Esta sprint entrega a **landing page pública do RecipeHub** — a primeira superfície do produto que usuários externos verão. É uma página única (`/`) hospedada no Cloudflare Pages, construída com Astro, composta por três seções: hero section de apresentação da plataforma, grid de 6 cards de receitas em destaque com imagem (URL pública do Unsplash) e tempo de preparo (dados hardcoded), e formulário de captura de email para newsletter.

### Problema que Resolve

O RecipeHub não possui presença web pública. Esta sprint cria o ponto de entrada do produto e inicia a captura de leads antes mesmo do lançamento completo.

### Definition of Done (Critério de Conclusão)

A sprint está **concluída** quando:

1. A landing page renderiza corretamente em viewport mobile (375px) e desktop (1280px+) sem overflow horizontal.
2. Os 6 cards de receitas são exibidos com imagem, título, e tempo de preparo.
3. O formulário de newsletter aceita um email válido, persiste no banco D1, e exibe feedback visual de sucesso ou erro ao usuário.
4. A submissão de um email já cadastrado retorna mensagem de erro \"Email já cadastrado\" sem duplicar o registro no D1.
5. O deploy está funcional no Cloudflare Pages (ambiente de preview ou produção).

---

## 2. Esquema de Dados (SSoT — Fonte Única da Verdade)

### 2.1 Tabela D1: `newsletter_subscribers`

Localização do schema Drizzle: `packages/db/src/schema.ts`

```typescript
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const newsletterSubscribers = sqliteTable('newsletter_subscribers', {
  id:         integer('id').primaryKey({ autoIncrement: true }),
  email:      text('email').notNull().unique(),
  created_at: text('created_at').notNull().default(\"(datetime('now'))\"),
});
```

**Índice obrigatório:** A constraint `UNIQUE` na coluna `email` é o mecanismo de deduplicação — garante que a validação de duplicidade seja enforcement no nível do banco, não apenas na aplicação.

**Migração:** Gerar via `drizzle-kit generate` após criar o schema. O arquivo SQL de migração deve ser commitado em `packages/db/migrations/`.

### 2.2 Armazenamento R2

Esta sprint **não utiliza R2**. As imagens dos cards são URLs públicas do Unsplash (ex: `https://images.unsplash.com/photo-...`). Nenhum asset de imagem será armazenado.

### 2.3 Cache KV

Esta sprint **não utiliza KV**. Os dados dos cards são hardcoded no código.

### 2.4 Payloads JSON — Endpoint da Newsletter

#### `POST /api/newsletter`

**Request Body:**
```json
{
  \"email\": \"usuario@exemplo.com\"
}
```

**Response — Sucesso (201 Created):**
```json
{
  \"success\": true,
  \"message\": \"Email cadastrado com sucesso!\"
}
```

**Response — Email duplicado (409 Conflict):**
```json
{
  \"success\": false,
  \"error\": \"Email já cadastrado.\"
}
```

**Response — Payload inválido (400 Bad Request):**
```json
{
  \"success\": false,
  \"error\": \"Email inválido. Informe um endereço de email válido.\"
}
```

**Response — Erro interno (500 Internal Server Error):**
```json
{
  \"success\": false,
  \"error\": \"Erro interno. Tente novamente mais tarde.\"
}
```

### 2.5 Fixture de Dados — Cards de Receitas (Hardcoded)

Localização: `apps/web/src/data/recipes.ts`

```typescript
export interface Recipe {
  id:          number;
  title:       string;
  description: string;
  imageUrl:    string;
  prepTime:    string; // ex: \"30 min\"
  category:    string;
}

export const featuredRecipes: Recipe[] = [
  {
    id: 1,
    title: \"Risoto de Funghi\",
    description: \"Cremoso risoto italiano com mix de cogumelos frescos e parmesão.\",
    imageUrl: \"https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600\",
    prepTime: \"40 min\",
    category: \"Massas & Risotos\",
  },
  {
    id: 2,
    title: \"Tacos de Carnitas\",
    description: \"Carne de porco desfiada ao molho de laranja com guacamole caseiro.\",
    imageUrl: \"https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=600\",
    prepTime: \"2h 30 min\",
    category: \"Mexicana\",
  },
  {
    id: 3,
    title: \"Bolo de Limão Siciliano\",
    description: \"Bolo úmido com glacê de limão siciliano e raspas frescas.\",
    imageUrl: \"https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600\",
    prepTime: \"1h 10 min\",
    category: \"Sobremesas\",
  },
  {
    id: 4,
    title: \"Salmão Grelhado com Aspargos\",
    description: \"Filé de salmão com manteiga de ervas e aspargos frescos no forno.\",
    imageUrl: \"https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600\",
    prepTime: \"25 min\",
    category: \"Frutos do Mar\",
  },
  {
    id: 5,
    title: \"Shakshuka\",
    description: \"Ovos pochados em molho de tomate picante com pimentões e especiarias.\",
    imageUrl: \"https://images.unsplash.com/photo-1590412200988-a436970781fa?w=600\",
    prepTime: \"30 min\",
    category: \"Café da Manhã\",
  },
  {
    id: 6,
    title: \"Curry de Grão-de-Bico\",
    description: \"Curry vegano com grão-de-bico, leite de coco e espinafre fresco.\",
    imageUrl: \"https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600\",
    prepTime: \"35 min\",
    category: \"Vegetariana\",
  },
];
```

---

## 3. Histórias de Usuário & Matriz do Avaliador

> **Aviso de Escopo:** Todas as histórias abaixo são passíveis de execução nesta única sprint sp-005. Nenhuma história depende de outra sprint.

---

### US-001: Visualizar Hero Section

**Descrição:** Como visitante do RecipeHub, eu quero ver uma hero section impactante ao entrar na landing page, para que eu entenda imediatamente o propósito da plataforma.

**Matriz de Teste do Avaliador:**

- [ ] **E2E/UI:** A página `/` renderiza uma `<section>` com heading principal (H1) contendo o nome \"RecipeHub\" ou tagline da plataforma, subtítulo descritivo e um CTA button visível acima da dobra em viewport 375px e 1280px.
- [ ] **E2E/UI:** O layout não apresenta overflow horizontal em nenhum viewport entre 375px e 1440px.
- [ ] **E2E/UI:** O CTA button da hero faz scroll suave até a seção de newsletter (`#newsletter`) ao ser clicado.
- [ ] **Segurança:** Nenhum conteúdo externo (scripts, iframes) é carregado na hero section.

---

### US-002: Visualizar Cards de Receitas em Destaque

**Descrição:** Como visitante, eu quero ver um grid com receitas em destaque contendo imagem, título, descrição, tempo de preparo e categoria, para que eu tenha uma amostra do conteúdo disponível na plataforma.

**Matriz de Teste do Avaliador:**

- [ ] **Unit/API:** O array `featuredRecipes` exportado de `apps/web/src/data/recipes.ts` contém exatamente 6 itens, todos com os campos `id`, `title`, `description`, `imageUrl`, `prepTime` e `category` preenchidos e com tipos corretos (TypeScript sem erros em `tsc --noEmit`).
- [ ] **E2E/UI:** Em desktop (1280px+), os 6 cards são exibidos em um grid de 3 colunas. Em tablet (768px), 2 colunas. Em mobile (375px), 1 coluna.
- [ ] **E2E/UI:** Cada card exibe: imagem (com `alt` text descritivo), título, descrição truncada ou completa, badge de categoria e tempo de preparo com ícone de relógio.
- [ ] **E2E/UI:** As imagens do Unsplash carregam sem erro 404 (URLs válidas no fixture).
- [ ] **Segurança:** Todas as `<img>` possuem atributo `alt` não-vazio (acessibilidade).

---

### US-003: Submeter Email na Newsletter

**Descrição:** Como visitante interessado, eu quero submeter meu email em um formulário de newsletter, para que eu seja notificado sobre novidades da plataforma.

**Matriz de Teste do Avaliador:**

- [ ] **Unit/API:** `POST /api/newsletter` com payload `{ \"email\": \"test@example.com\" }` retorna HTTP 201 e `{ \"success\": true }`. O registro pode ser verificado via `wrangler d1 execute DB --command \"SELECT * FROM newsletter_subscribers\"`.
- [ ] **Unit/API:** `POST /api/newsletter` com o mesmo email submetido uma segunda vez retorna HTTP 409 e `{ \"success\": false, \"error\": \"Email já cadastrado.\" }`. Apenas 1 registro existe no D1.
- [ ] **Unit/API:** `POST /api/newsletter` com payload `{ \"email\": \"nao-e-um-email\" }` retorna HTTP 400 e `{ \"success\": false, \"error\": \"Email inválido. Informe um endereço de email válido.\" }`.
- [ ] **Dados:** A tabela `newsletter_subscribers` existe no banco D1 com as colunas `id` (INTEGER PK AUTOINCREMENT), `email` (TEXT NOT NULL UNIQUE), `created_at` (TEXT NOT NULL DEFAULT).
- [ ] **E2E/UI:** Após submissão bem-sucedida, o formulário exibe mensagem de sucesso e o campo de email é limpo (ou o formulário é substituído pela mensagem).
- [ ] **E2E/UI:** Após erro (email duplicado ou inválido), o formulário exibe a mensagem de erro correspondente sem recarregar a página.
- [ ] **Segurança:** O endpoint não aceita métodos HTTP além de POST (GET, PUT, DELETE retornam 405).

---

### US-004: Experiência Responsiva Completa

**Descrição:** Como visitante em qualquer dispositivo, eu quero que a landing page seja totalmente utilizável em mobile e desktop, para que a experiência não seja degradada pelo meu dispositivo.

**Matriz de Teste do Avaliador:**

- [ ] **E2E/UI:** Em viewport 375x812 (iPhone SE), todos os elementos (hero, cards, formulário) são visíveis sem scroll horizontal e sem texto cortado.
- [ ] **E2E/UI:** Em viewport 1280x800 (desktop padrão), o layout utiliza o espaço horizontal adequadamente com max-width centralizado.
- [ ] **E2E/UI:** O formulário de newsletter em mobile ocupa 100% da largura disponível com campo de email e botão empilhados verticalmente (ou lado a lado se couber).
- [ ] **E2E/UI:** As imagens dos cards possuem `loading=\"lazy\"` e `aspect-ratio` fixo para evitar layout shift (CLS).

---

## 4. Requisitos Funcionais (FR)

### Estrutura do Projeto

**REQ-001** `[MUST]` O projeto da landing page deve residir em `apps/web/` dentro do monorepo Turborepo. O entrypoint é `apps/web/src/pages/index.astro`.

**REQ-002** `[MUST]` O projeto deve ser configurado para deploy no Cloudflare Pages. O arquivo `apps/web/wrangler.toml` (ou `wrangler.jsonc`) deve declarar o binding D1 com o nome `DB`.

**REQ-003** `[MUST]` O schema Drizzle da tabela `newsletter_subscribers` deve ser criado em `packages/db/src/schema.ts`. A migração SQL deve ser gerada com `drizzle-kit generate` e commitada em `packages/db/migrations/`.

### Frontend — Componentes Astro

**REQ-004** `[MUST]` A página `apps/web/src/pages/index.astro` deve ser composta por, no mínimo, três componentes isolados:
- `apps/web/src/components/HeroSection.astro`
- `apps/web/src/components/RecipeCard.astro`
- `apps/web/src/components/NewsletterForm.tsx` (componente React com `client:load` para interatividade do formulário)

**REQ-005** `[MUST]` O componente `RecipeCard.astro` deve aceitar uma prop do tipo `Recipe` (interface definida em `apps/web/src/data/recipes.ts`) e renderizar: imagem com `alt`, título, descrição, badge de categoria e tempo de preparo.

**REQ-006** `[MUST]` O componente `NewsletterForm.tsx` deve ser um componente React com estado local gerenciando: valor do campo email, estado de loading (boolean), mensagem de feedback (sucesso/erro). Deve usar `fetch` nativo para chamar `POST /api/newsletter`.

**REQ-007** `[SHOULD]` O layout base deve ser definido em `apps/web/src/layouts/BaseLayout.astro` com `<html>`, `<head>` (meta charset, viewport, og:image, og:title, description) e `<body>`.

**REQ-008** `[SHOULD]` O estilo visual deve usar TailwindCSS. A paleta de cores do RecipeHub deve ser definida em `apps/web/tailwind.config.mjs` com, no mínimo, uma cor primária (`brand`) e uma cor de fundo.

### Backend — Astro API Route (Pages Function)

**REQ-009** `[MUST]` O endpoint da newsletter deve ser implementado como Astro API Route em `apps/web/src/pages/api/newsletter.ts`, exportando uma função `POST` compatível com Cloudflare Pages Functions.

**REQ-010** `[MUST]` O endpoint deve validar o payload com **Zod** antes de qualquer interação com o D1. Schema de validação:

```typescript
import { z } from 'zod';

const newsletterSchema = z.object({
  email: z.string().email({ message: 'Email inválido. Informe um endereço de email válido.' }),
});
```

**REQ-011** `[MUST]` O endpoint deve acessar o binding D1 via `context.locals.runtime.env.DB` (padrão Astro + Cloudflare adapter). O acesso a variáveis de ambiente via `process.env` é **PROIBIDO** (regra da doutrina edge).

**REQ-012** `[MUST]` A inserção no D1 deve ser feita via **Drizzle ORM** (não SQL raw). Exemplo de implementação:

```typescript
import { drizzle } from 'drizzle-orm/d1';
import { newsletterSubscribers } from '../../../../packages/db/src/schema';

// Dentro do handler POST:
const db = drizzle(context.locals.runtime.env.DB);
try {
  await db.insert(newsletterSubscribers).values({ email: validatedData.email });
  return new Response(JSON.stringify({ success: true, message: 'Email cadastrado com sucesso!' }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
} catch (error: unknown) {
  // D1 lança erro com código SQLITE_CONSTRAINT_UNIQUE para emails duplicados
  if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
    return new Response(JSON.stringify({ success: false, error: 'Email já cadastrado.' }), {
      status: 409,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return new Response(JSON.stringify({ success: false, error: 'Erro interno. Tente novamente mais tarde.' }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' },
  });
}
```

**REQ-013** `[MUST]` Métodos HTTP além de POST no endpoint `/api/newsletter` devem retornar 405 Method Not Allowed. Em Astro API Routes, isso é garantido exportando apenas a função `POST` (sem exportar `GET`, `PUT`, etc.).

**REQ-014** `[SHOULD]` O endpoint deve definir o header `Content-Type: application/json` em todas as respostas.

### Deploy & Configuração

**REQ-015** `[MUST]` O arquivo `apps/web/astro.config.mjs` deve usar o adapter `@astrojs/cloudflare` para habilitar Pages Functions:

```javascript
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'hybrid', // Permite SSR para API routes + static para páginas
  adapter: cloudflare(),
  integrations: [react(), tailwind()],
});
```

**REQ-016** `[MUST]` O `wrangler.toml` (ou `wrangler.jsonc`) em `apps/web/` deve declarar:

```toml
[[d1_databases]]
binding = \"DB\"
database_name = \"recipehub-db\"
database_id = \"<ID_DO_BANCO_D1>\"
```

**REQ-017** `[COULD]` Adicionar `\"build\": \"astro build\"` e `\"dev\": \"astro dev\"` nos scripts do `apps/web/package.json` para integração com o pipeline Turborepo.

### Qualidade & CI

**REQ-018** `[MUST]` O projeto deve passar em `tsc --noEmit` sem erros após a implementação.

**REQ-019** `[MUST]` O projeto deve passar em `eslint .` sem erros após a implementação.

**REQ-020** `[MUST]` Após criar ou alterar `packages/db/src/schema.ts`, executar `drizzle-kit generate --check` para validar que a migração está sincronizada.

---

## 5. Fora do Escopo (Non-Goals)

Os itens abaixo são **explicitamente proibidos** nesta sprint para evitar scope creep. Qualquer PR que inclua os itens abaixo deve ser rejeitado.

| # | Item | Motivo de Exclusão |
|---|------|--------------------|
| NG-01 | Páginas internas de detalhe de receita (`/receita/[slug]`) | Fora do escopo — landing page única apenas |
| NG-02 | Sistema de autenticação (login, cadastro, sessão) | Complexidade não justificada nesta sprint |
| NG-03 | Área logada ou dashboard admin para visualizar emails captados | Depende de autenticação (NG-02) |
| NG-04 | CMS ou interface para gerenciar receitas dinamicamente | Dados são hardcoded nesta sprint |
| NG-05 | Double opt-in, token de confirmação de email, link de unsubscribe | Requer envio de email (integração externa) |
| NG-06 | Envio de email de boas-vindas (ex: via Resend) | Sem integrações externas nesta sprint |
| NG-07 | Cloudflare Worker separado (`apps/api`) para a newsletter | A rota vive dentro do Astro como Pages Function |
| NG-08 | Rotas de receitas dinâmicas carregadas do D1 | Cards são hardcoded com fixture |
| NG-09 | Analytics, tracking de eventos (GA, Plausible, etc.) | Fora do escopo desta sprint |
| NG-10 | Testes automatizados (unit, E2E com Playwright) | Opcional nesta sprint; critérios são manuais |

---

## 6. Cloudflare Bindings & Integrações

### Bindings Necessários

| Binding | Tipo | Nome no Código | Finalidade |
|---------|------|----------------|------------|
| `DB` | D1 Database | `context.locals.runtime.env.DB` | Persistência de emails da newsletter |

### Variáveis de Ambiente

**Nenhuma variável de ambiente adicional é necessária.** O D1 é um binding nativo da Cloudflare — não requer secrets ou API keys.

### APIs Externas

**Nenhuma API externa.** As imagens dos cards usam URLs públicas do Unsplash sem autenticação.

---

## 7. Restrições & Casos Limite

### Restrições Técnicas

**R-001 — Edge Runtime:** O endpoint `src/pages/api/newsletter.ts` executa no Cloudflare Pages Functions (V8 Isolate). As seguintes restrições se aplicam:
- `process.env` é **inacessível** — usar `context.locals.runtime.env.DB`
- Módulos nativos do Node.js (`fs`, `path`, `crypto`) são **proibidos**
- `require()` é **proibido** — usar apenas ESM imports
- `Buffer` é **proibido** — usar `Uint8Array` ou `TextEncoder` se necessário

**R-002 — Deduplicação:** A unicidade do email é enforced pela constraint `UNIQUE` no D1 (nível de banco), não apenas por validação na aplicação. Isso garante consistência mesmo em requisições concorrentes.

**R-003 — Imagens Externas:** As URLs do Unsplash são hardcoded. Em ambiente de produção, há risco de URLs quebrarem no futuro. Este risco é aceito para esta sprint — R2 storage é NG-08.

**R-004 — Rate Limiting:** Não há rate limiting no endpoint `/api/newsletter` nesta sprint. O único mecanismo de proteção contra spam é a constraint UNIQUE no banco. Rate limiting via Cloudflare WAF pode ser configurado manualmente no dashboard (fora do escopo de código).

**R-005 — CORS:** O endpoint `/api/newsletter` é chamado pelo próprio frontend no mesmo domínio (same-origin). Não é necessário configurar headers CORS para esta sprint.

### Casos Limite e Comportamentos de Fallback

| Cenário | Comportamento Esperado |
|---------|------------------------|
| Email válido, primeiro cadastro | HTTP 201, persiste no D1, UI exibe sucesso |
| Email válido, já cadastrado | HTTP 409, D1 não duplica, UI exibe \"Email já cadastrado.\" |
| Email inválido (sem @, etc.) | HTTP 400 (Zod rejeita), D1 não é consultado, UI exibe erro de validação |
| Payload JSON malformado | Astro/runtime rejeita, HTTP 400 ou 500 |
| D1 indisponível (falha de infra) | HTTP 500, UI exibe \"Erro interno. Tente novamente mais tarde.\" |
| Campo email vazio no formulário | Bloqueado pelo atributo `required` do HTML + validação Zod no backend |
| Método GET em `/api/newsletter` | HTTP 405 (apenas `POST` é exportado pela API Route) |

---

## 8. Estrutura de Arquivos Esperada

Ao final da sprint, a estrutura mínima esperada no monorepo é:

```
recipehub/
├── apps/
│   └── web/                          # Projeto Astro (Landing Page)
│       ├── astro.config.mjs           # Config Astro + adapter Cloudflare
│       ├── wrangler.toml              # Binding D1 (DB)
│       ├── tailwind.config.mjs        # Paleta de cores do RecipeHub
│       ├── package.json
│       └── src/
│           ├── layouts/
│           │   └── BaseLayout.astro   # Layout base com <head> e meta tags
│           ├── pages/
│           │   ├── index.astro        # Landing page (hero + cards + newsletter)
│           │   └── api/
│           │       └── newsletter.ts  # POST /api/newsletter (Pages Function)
│           ├── components/
│           │   ├── HeroSection.astro  # Seção hero com CTA
│           │   ├── RecipeCard.astro   # Card individual de receita
│           │   └── NewsletterForm.tsx # Formulário React com client:load
│           └── data/
│               └── recipes.ts         # Fixture com 6 receitas hardcoded
├── packages/
│   └── db/                           # Pacote compartilhado de banco de dados
│       ├── src/
│       │   └── schema.ts             # Schema Drizzle (newsletter_subscribers)
│       └── migrations/               # SQLite migrations geradas pelo drizzle-kit
│           └── 0000_newsletter.sql
└── turbo.json                        # Pipeline Turborepo
```

---

## Referências

- **Sprint Code:** sp-005  
- **Doutrina do Projeto:** `architecture/system-rules.md`  
- **Code Map:** `architecture/code-map.md` (projeto em fase inicial — nenhum componente pré-existente)  
- **Adapter Astro Cloudflare:** `@astrojs/cloudflare` (documentação oficial)  
- **Drizzle ORM D1:** `drizzle-orm/d1` (documentação oficial)  
"}}
</tool_call>
<tool_response>
Successfully wrote to architecture/plans/prd-sprint-sp-005.md (252 lines)
</tool_response>

<tool_call>
{"name": "complete_phase", "parameters": {"summary": "Blueprint sp-005 concluído: landing page RecipeHub em Astro + Cloudflare Pages com hero, 6 cards hardcoded e newsletter persistindo emails no D1 via Astro API Route — zero integrações externas, single-page, sem auth ou CMS."}}
</tool_call>
<tool_response>
Phase marked as complete.
</tool_response>

**PRD salvo** em `architecture/plans/prd-sprint-sp-005.md` ✓

---

### Resumo Executivo — sp-005

| Dimensão | Decisão |
|---|---|
| **App** | `apps/web/` — Astro + `@astrojs/cloudflare` (output: hybrid) |
| **API** | Astro API Route em `src/pages/api/newsletter.ts` (Pages Function, sem Worker separado) |
| **Data Model** | Tabela `newsletter_subscribers` (id, email UNIQUE, created_at) no D1 — schema em `packages/db/src/schema.ts` |
| **Deduplicação** | Constraint `UNIQUE` no D1 + captura do erro `SQLITE_CONSTRAINT_UNIQUE` no handler |
| **Validação** | Zod (`z.string().email()`) antes de qualquer toque no banco |
| **Binding** | Apenas `DB` (D1 nativo) — zero APIs externas, zero secrets |
| **Imagens** | URLs públicas do Unsplash hardcoded em `src/data/recipes.ts` |
| **Non-Goals** | Páginas internas, auth, CMS, double opt-in, Worker separado, receitas dinâmicas |

O PRD inclui schema Drizzle completo, payloads JSON de todos os cenários, fixture das 6 receitas, estrutura de arquivos esperada, exemplos de código do endpoint e matriz de testes por história de usuário.