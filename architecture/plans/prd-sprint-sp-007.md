# PRD — Sprint sp-007: RecipeHub Landing Page

## 1. Visão Geral & North Star

Esta Sprint entrega a landing page pública do **RecipeHub**: uma página estática, responsiva e de alta performance construída com Astro puro (zero JavaScript no cliente). A página apresenta a proposta de valor do produto, exibe 6 receitas em destaque com imagem e tempo de preparo, e captura o interesse dos visitantes via um formulário de newsletter puramente visual.

**Problema que resolve:** O RecipeHub ainda não possui presença pública. Sem uma landing page, não há como atrair e converter visitantes em futuros usuários.

**Definition of Done (DoD):**
- A rota `/` do workspace `apps/web` renderiza a landing page completa
- A página passa na checagem responsiva (mobile 375px, tablet 768px, desktop 1280px)
- Zero JavaScript é enviado ao cliente (verificável no DevTools → Sources)
- Deploy bem-sucedido via `wrangler pages deploy` no Cloudflare Pages
- Todas as imagens carregam via picsum.photos sem erro 404
- O formulário de newsletter está visível e estilizado, sem `action` ou comportamento dinâmico

---

## 2. Esquema de Dados (SSoT)

> **Esta Sprint não introduz mutação de estado.** Não há tabelas D1, buckets R2 ou namespaces KV envolvidos. Todos os dados são estáticos e hardcoded nos componentes Astro.

### 2.1 Estrutura de Dados das Receitas (Hardcoded)

Os 6 cards de receitas são definidos como um array estático diretamente no componente `RecipeCard` ou na página `index.astro`. Estrutura de cada item:

```typescript
// Tipo de referência — NÃO criar arquivo separado, inline no .astro
type Recipe = {
  id: number;          // 1–6
  title: string;       // Nome da receita
  prepTime: string;    // Ex: \"30 min\"
  imageUrl: string;    // https://picsum.photos/seed/{slug}/400/300
  category: string;    // Ex: \"Jantar\", \"Sobremesa\", \"Café da Manhã\"
};
```

### 2.2 Dados Hardcoded (Fonte Canônica)

```astro
---
const recipes = [
  { id: 1, title: \"Risoto de Cogumelos\", prepTime: \"45 min\", category: \"Jantar\",         imageUrl: \"https://picsum.photos/seed/risoto/400/300\" },
  { id: 2, title: \"Bolo de Cenoura\",    prepTime: \"60 min\", category: \"Sobremesa\",      imageUrl: \"https://picsum.photos/seed/cenoura/400/300\" },
  { id: 3, title: \"Açaí na Tigela\",     prepTime: \"10 min\", category: \"Café da Manhã\", imageUrl: \"https://picsum.photos/seed/acai/400/300\" },
  { id: 4, title: \"Frango Grelhado\",    prepTime: \"35 min\", category: \"Almoço\",        imageUrl: \"https://picsum.photos/seed/frango/400/300\" },
  { id: 5, title: \"Pasta ao Pesto\",     prepTime: \"25 min\", category: \"Jantar\",        imageUrl: \"https://picsum.photos/seed/pasta/400/300\" },
  { id: 6, title: \"Smoothie Verde\",     prepTime: \"5 min\",  category: \"Bebidas\",       imageUrl: \"https://picsum.photos/seed/smoothie/400/300\" },
];
---
```

> **Nota:** As seeds do picsum.photos são determinísticas — a mesma seed sempre retorna a mesma imagem, garantindo consistência visual entre deploys.

### 2.3 Estrutura de Arquivos no Workspace

```
apps/web/
├── src/
│   ├── pages/
│   │   └── index.astro          # Rota principal — monta todas as seções
│   ├── components/
│   │   ├── HeroSection.astro    # Hero com headline, subtítulo e CTA
│   │   ├── RecipeCard.astro     # Card individual de receita
│   │   ├── RecipeGrid.astro     # Grid com os 6 cards + dados hardcoded
│   │   └── NewsletterForm.astro # Formulário visual de captura de email
│   └── layouts/
│       └── BaseLayout.astro     # Layout base com <head>, meta tags e Tailwind
├── public/
│   └── favicon.svg
├── tailwind.config.mjs          # Configuração Tailwind (verificar se já existe)
├── astro.config.mjs             # Verificar output: 'static' já configurado
└── package.json
```

---

## 3. Histórias de Usuário & Matriz do Avaliador

### US-001: Hero Section

**Descrição:** Como visitante do RecipeHub, eu quero ver uma seção hero impactante ao acessar a landing page para entender imediatamente a proposta de valor do produto.

**Requisito associado:** REQ-001

**Matriz de Teste do Avaliador (Critérios de Aceite):**
- [ ] **Visual:** A hero section ocupa pelo menos 80vh em desktop e exibe headline principal, subtítulo descritivo e um botão CTA visível
- [ ] **Responsivo:** Em mobile (375px), o texto não transborda e o layout permanece legível (sem overflow-x)
- [ ] **Estático:** Zero JavaScript no bundle — verificável em DevTools → Sources (nenhum arquivo `.js` listado)
- [ ] **Semântica:** O elemento `<h1>` contém o nome do produto; existe apenas um `<h1>` na página

---

### US-002: Grid de Receitas em Destaque

**Descrição:** Como visitante, eu quero ver 6 receitas em destaque com imagem, nome e tempo de preparo para ter uma prévia do conteúdo disponível no RecipeHub.

**Requisito associado:** REQ-002, REQ-003

**Matriz de Teste do Avaliador (Critérios de Aceite):**
- [ ] **Contagem:** Exatamente 6 cards são renderizados na página (verificável via `document.querySelectorAll('[data-recipe-card]').length === 6` ou inspeção manual do HTML)
- [ ] **Conteúdo:** Cada card exibe: imagem (src aponta para picsum.photos), título da receita, badge de categoria e tempo de preparo com ícone de relógio
- [ ] **Imagens:** Todas as 6 imagens carregam sem erro 404 (verificar Network tab no DevTools)
- [ ] **Responsivo:** Grid exibe 1 coluna em mobile, 2 colunas em tablet (768px), 3 colunas em desktop (1280px)
- [ ] **Acessibilidade:** Cada `<img>` possui atributo `alt` descritivo com o nome da receita

---

### US-003: Formulário de Newsletter Visual

**Descrição:** Como visitante interessado, eu quero ver um formulário de newsletter para saber que posso me inscrever e acompanhar novidades do RecipeHub.

**Requisito associado:** REQ-004

**Matriz de Teste do Avaliador (Critérios de Aceite):**
- [ ] **Visual:** Seção contém headline, texto de apoio, campo `<input type=\"email\">` e botão de submit estilizados com Tailwind
- [ ] **Sem Backend:** O `<form>` NÃO possui atributo `action` — submissão não dispara requisição de rede (verificável em DevTools → Network ao clicar em submit)
- [ ] **Sem JS:** Nenhum event listener é adicionado ao formulário — é puramente HTML
- [ ] **Responsivo:** Em mobile, o input e o botão empilham verticalmente; em desktop, ficam lado a lado
- [ ] **Placeholder:** O input exibe placeholder \"seu@email.com\" ou equivalente

---

### US-004: Responsividade Global & Performance

**Descrição:** Como visitante em qualquer dispositivo, eu quero que a landing page seja responsiva e carregue rapidamente para ter uma boa primeira impressão do RecipeHub.

**Requisito associado:** REQ-005, REQ-006

**Matriz de Teste do Avaliador (Critérios de Aceite):**
- [ ] **Zero JS:** Nenhum arquivo JavaScript é enviado ao cliente (output Astro estático)
- [ ] **Meta Tags:** `<head>` contém `<title>`, `<meta name=\"description\">` e `<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">`
- [ ] **Sem Overflow:** Nenhuma seção causa scroll horizontal em viewport de 375px
- [ ] **Deploy:** `wrangler pages deploy` executa sem erros e a URL pública retorna HTTP 200
- [ ] **Favicon:** `public/favicon.svg` existe e é referenciado no `<head>`

---

## 4. Requisitos Funcionais (FR)

### Estrutura e Roteamento

**REQ-001 — Hero Section [MUST]**
O arquivo `apps/web/src/pages/index.astro` deve importar e renderizar o componente `<HeroSection />`. O componente deve conter:
- Um `<h1>` com o nome do produto (ex: `RecipeHub`)
- Um `<p>` com subtítulo descritivo (máx. 2 linhas)
- Um `<a>` estilizado como botão CTA (ex: \"Explorar Receitas\") apontando para `#receitas`
- Background com cor sólida ou gradiente definido via classes Tailwind

**REQ-002 — Componente RecipeCard [MUST]**
O arquivo `apps/web/src/components/RecipeCard.astro` deve aceitar as seguintes props:
```astro
---
interface Props {
  title: string;
  prepTime: string;
  imageUrl: string;
  category: string;
}
const { title, prepTime, imageUrl, category } = Astro.props;
---
```
O card deve renderizar: imagem com `alt={title}`, badge de categoria, título e tempo de preparo com ícone SVG inline de relógio. Aplicar `data-recipe-card` no elemento raiz para facilitar testes.

**REQ-003 — Grid de Receitas [MUST]**
O arquivo `apps/web/src/components/RecipeGrid.astro` deve:
1. Declarar o array `recipes` com os 6 itens hardcoded (conforme Seção 2.2)
2. Iterar com `recipes.map()` e renderizar `<RecipeCard />` para cada item
3. Usar classes Tailwind para grid responsivo: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
4. A seção deve ter `id=\"receitas\"` para o link do CTA da hero funcionar

**REQ-004 — Formulário de Newsletter Visual [MUST]**
O arquivo `apps/web/src/components/NewsletterForm.astro` deve renderizar:
- Um `<section>` com headline e texto de apoio
- Um `<form>` SEM atributo `action` e SEM atributo `method`
- Um `<input type=\"email\" placeholder=\"seu@email.com\" required>` estilizado
- Um `<button type=\"submit\">` estilizado
- Layout responsivo: `flex flex-col sm:flex-row gap-3` no wrapper do input+button

**REQ-005 — Layout Base [MUST]**
O arquivo `apps/web/src/layouts/BaseLayout.astro` deve:
1. Aceitar prop `title: string`
2. Incluir no `<head>`: charset UTF-8, viewport meta, title dinâmico, description meta e link para favicon
3. NÃO importar nenhum framework JS (React, Vue, etc.) — Astro puro
4. Aplicar classes Tailwind base no `<body>`: `font-sans antialiased bg-white text-gray-900`

**REQ-006 — Configuração Astro Estática [MUST]**
Verificar que `apps/web/astro.config.mjs` possui `output: 'static'` (padrão do Astro, mas deve ser explícito). Se o arquivo não existir, criá-lo:
```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'static',
  integrations: [tailwind()],
});
```

**REQ-007 — Página Principal (Composição) [MUST]**
O arquivo `apps/web/src/pages/index.astro` deve importar e compor todas as seções na seguinte ordem:
1. `<BaseLayout title=\"RecipeHub — Descubra Receitas Incríveis\">`
2. `<HeroSection />`
3. `<RecipeGrid />`
4. `<NewsletterForm />`
5. `</BaseLayout>`

---

## 5. Fora do Escopo (Non-Goals)

Os itens abaixo estão **explicitamente PROIBIDOS** nesta Sprint. Qualquer implementação destes itens representa scope creep e deve ser rejeitada na revisão:

| # | Item Proibido | Motivo |
|---|--------------|--------|
| NG-01 | Backend de newsletter (endpoint Hono, tabela D1, integração Resend) | Escopo de sprint futura |
| NG-02 | Animações CSS, transições, scroll animations, hover elaborados | Aumenta complexidade sem valor de negócio imediato |
| NG-03 | Páginas adicionais (`/receitas`, `/sobre`, `/login`) | Apenas a rota `/` está no escopo |
| NG-04 | Autenticação ou área logada | Fora do contexto de landing page |
| NG-05 | Content Collections do Astro (`.md`, `.json` em `src/content/`) | Dados são hardcoded por decisão explícita |
| NG-06 | Bibliotecas de componentes (shadcn/ui, Radix, Headless UI) | TailwindCSS puro por decisão explícita |
| NG-07 | JavaScript no cliente (React islands, Alpine.js, scripts inline) | Zero JS é requisito core |
| NG-08 | Lazy loading customizado ou otimização de imagens via Astro Image | Imagens via URL externa (picsum.photos), sem processamento |
| NG-09 | Testes automatizados (Playwright, Vitest) | Verificação manual via DevTools é suficiente nesta Sprint |
| NG-10 | Internacionalização (i18n) | Todo conteúdo em pt-BR, sem suporte multi-idioma |

---

## 6. Cloudflare Bindings & Integrações

### Bindings Cloudflare

> **Nenhum binding necessário.** Esta Sprint entrega uma página 100% estática sem acesso a D1, KV, R2 ou Queues.

### APIs Externas

| Serviço | Uso | Chave Necessária |
|---------|-----|------------------|
| picsum.photos | Imagens placeholder dos cards | Não — API pública e gratuita |

### Variáveis de Ambiente

> **Nenhuma variável de ambiente necessária.** Zero secrets, zero tokens, zero configuração de ambiente.

### Deploy

- **Plataforma:** Cloudflare Pages
- **Comando de build:** `pnpm --filter web build` (ou `astro build` dentro de `apps/web`)
- **Diretório de output:** `apps/web/dist`
- **Comando de deploy:** `wrangler pages deploy apps/web/dist --project-name recipehub-web`

---

## 7. Restrições & Casos Limite

### Restrições Técnicas

**RT-01 — Zero JavaScript no Cliente**
O Astro no modo `output: 'static'` não envia JS por padrão. Esta restrição é mantida não usando nenhuma diretiva de ilha (`client:load`, `client:idle`, `client:visible`). Se um componente React/Vue for importado acidentalmente, o Astro emitirá aviso — deve ser tratado como erro bloqueante.

**RT-02 — Imagens Externas (picsum.photos)**
As imagens são carregadas via URL externa em runtime pelo browser. Não usar o componente `<Image />` do Astro (que requer processamento local). Usar `<img>` HTML nativo com `loading=\"lazy\"` para performance. 

> **Caso Limite:** Se picsum.photos estiver indisponível, o browser exibirá a imagem quebrada. Mitigação: adicionar `onerror` não é permitido (seria JS). Alternativa aceitável: definir `width` e `height` nos `<img>` para preservar o layout mesmo com imagem quebrada.

**RT-03 — Tailwind no Astro**
Verificar se `@astrojs/tailwind` já está instalado em `apps/web/package.json`. Se não estiver, adicionar como devDependency. Confirmar que `tailwind.config.mjs` inclui o path `./src/**/*.{astro,html,js,ts}` no array `content`.

**RT-04 — Compatibilidade Edge (Cloudflare Pages)**
Como o output é estático (`dist/`), não há Workers envolvidos. Arquivos HTML, CSS e assets são servidos diretamente pelo CDN do Cloudflare Pages — zero risco de incompatibilidade com V8 Isolates.

**RT-05 — Namespace de IDs HTML**
A seção de receitas deve ter `id=\"receitas\"` para que o link `href=\"#receitas\"` no CTA da hero funcione como scroll anchor nativo do browser (sem JS).

### Casos Limite

**CE-01 — `apps/web` já tem rota `/`**
Se já existir um arquivo `apps/web/src/pages/index.astro`, ele deve ser substituído (não duplicado). Verificar com `list_directory` antes de criar.

**CE-02 — Dependências Tailwind ausentes**
Se `tailwind.config.mjs` ou `@astrojs/tailwind` não existirem em `apps/web`, o especialista deve instalá-los antes de criar os componentes.

**CE-03 — Conflito de Layout Base**
Se já existir um `BaseLayout.astro` com estrutura diferente, adaptar os novos componentes para usá-lo em vez de criar um layout paralelo — respeitar o `code-map.md` como fonte da verdade.

---

## 8. Checklist de Handoff para Execução

Antes de marcar esta Sprint como pronta para execução, confirmar:

- [ ] `apps/web/src/pages/index.astro` criado e compondo todas as seções (REQ-007)
- [ ] `HeroSection.astro` com `<h1>`, subtítulo e CTA (REQ-001)
- [ ] `RecipeGrid.astro` com array hardcoded e grid responsivo (REQ-003)
- [ ] `RecipeCard.astro` com props tipadas e `data-recipe-card` (REQ-002)
- [ ] `NewsletterForm.astro` sem `action`, sem JS (REQ-004)
- [ ] `BaseLayout.astro` com meta tags e sem imports de framework JS (REQ-005)
- [ ] `astro.config.mjs` com `output: 'static'` e integração Tailwind (REQ-006)
- [ ] Zero JavaScript no bundle (verificado em DevTools)
- [ ] Responsivo em 375px, 768px e 1280px
- [ ] Deploy via `wrangler pages deploy` retorna sucesso

---

## Metadados do Sprint

| Campo | Valor |
|-------|-------|
| Sprint Code | sp-007 |
| Fase | Blueprint (Fase 1) |
| Data do PRD | 2025 |
| Stack | Astro 4.x, TailwindCSS, Cloudflare Pages |
| Bindings | Nenhum |
| Integrações Externas | picsum.photos (pública) |
| Estimativa de Complexidade | Baixa — 4 componentes + 1 página |
| Risco Principal | Tailwind não configurado em `apps/web` |
"}}
</tool_call>
<tool_response>
File written successfully</tool_response>

<tool_call>
{"name": "complete_phase", "parameters": {"summary": "PRD sp-007 gerado: landing page estática RecipeHub com hero section, 6 recipe cards hardcoded (picsum.photos) e formulário de newsletter visual — Astro puro, zero JS no cliente, TailwindCSS, deploy Cloudflare Pages, sem bindings ou integrações externas."}}
</tool_call>
<tool_response>
Phase completed successfully
</tool_response>

**PRD salvo** em `architecture/plans/prd-sprint-sp-007.md`. ✅

**Resumo do que foi definido:**
- **4 componentes** a criar: `HeroSection`, `RecipeCard`, `RecipeGrid`, `NewsletterForm` + `BaseLayout` e `index.astro`
- **Zero infraestrutura** — sem D1, KV, R2, Workers ou variáveis de ambiente
- **Único risco** mapeado: verificar se `@astrojs/tailwind` já está instalado em `apps/web` antes de criar os componentes
- **10 Non-Goals** explícitos para evitar scope creep (backend newsletter, JS no cliente, páginas adicionais, etc.)