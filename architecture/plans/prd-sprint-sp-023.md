# 2.2 Paleta de Cores & Tokens de Design

A paleta é **warm food-themed**, implementada via classes utilitárias do TailwindCSS. Nenhuma fonte externa é carregada.

| Token           | Cor               | Uso Principal                        |
|-----------------|-------------------|--------------------------------------|
| `amber-500`     | `#F59E0B`         | CTA principal, destaques, badges     |
| `amber-600`     | `#D97706`         | Hover do CTA                         |
| `amber-50`      | `#FFFBEB`         | Background da Hero section           |
| `orange-600`    | `#EA580C`         | Terracota — links, ícones de receita |
| `stone-800`     | `#292524`         | Títulos e texto principal            |
| `stone-500`     | `#78716C`         | Texto secundário (prepTime, labels)  |
| `stone-100`     | `#F5F5F4`         | Background da seção de receitas      |
| `white`         | `#FFFFFF`         | Cards e background geral             |

**Tipografia:** `font-sans` (system-ui stack nativa do TailwindCSS — zero requisições externas).

---

## 3. Histórias de Usuário & Matriz do Avaliador

> Todas as histórias abaixo são implementáveis dentro desta única sprint. Nenhuma requer backend, autenticação ou JavaScript no cliente.

---

### US-001: Hero Section com Título e CTA

**Descrição:** Como visitante do RecipeHub, eu quero ver uma hero section impactante com título claro e botão de CTA para que eu entenda imediatamente o valor da plataforma e seja motivado a explorar as receitas.

**Matriz de Teste do Avaliador:**

- [ ] **Visual/HTML:** A section renderiza `<h1>` com o nome/tagline do RecipeHub, `<p>` com subtítulo descritivo e `<a>` estilizado como botão CTA com cor amber.
- [ ] **Zero JS:** Inspecionando o HTML gerado em `dist/`, nenhum `<script>` ou atributo `data-astro-*` de hidratação está presente na hero section.
- [ ] **Responsividade:** Em 375px o título usa `text-3xl`, em 768px usa `text-4xl`, em 1280px usa `text-5xl` (ou equivalente via classes Tailwind responsivas).
- [ ] **Semântica:** A section usa `<section aria-label=\"Hero\">` e o CTA usa `<a href=\"#receitas\">` apontando para o grid de receitas (scroll-anchor).
- [ ] **Segurança:** Nenhum dado de usuário é processado nesta section — não aplicável, mas confirmar ausência de forms sem validação.

---

### US-002: Grid de 6 Cards de Receitas

**Descrição:** Como visitante, eu quero ver um grid com 6 exemplos de receitas — cada uma com imagem placeholder, título, categoria e tempo total de preparo — para que eu tenha uma amostra visual do conteúdo da plataforma.

**Matriz de Teste do Avaliador:**

- [ ] **Dados:** O array `recipes` em `src/data/recipes.ts` contém exatamente 6 itens. O componente itera via `.map()` em Astro (build-time), sem fetch ou API call.
- [ ] **Visual/HTML:** Cada card renderiza: (1) div com gradiente CSS como placeholder de imagem contendo o emoji centralizado, (2) badge de categoria, (3) `<h3>` com o título da receita, (4) `<p>` com a descrição truncada, (5) linha com ícone de relógio ⏱ e `totalTime`.
- [ ] **Layout:** Em mobile (375px) o grid é 1 coluna (`grid-cols-1`). Em tablet (768px) é 2 colunas (`grid-cols-2`). Em desktop (1280px) é 3 colunas (`grid-cols-3`).
- [ ] **Placeholder:** Nenhuma tag `<img>` com `src` externo é usada. O placeholder é um `<div>` com classes Tailwind `bg-gradient-to-br` + `placeholderGradient` do data model.
- [ ] **Zero JS:** Nenhum `client:*` directive do Astro é usado no componente de cards.

---

### US-003: Formulário Visual de Newsletter

**Descrição:** Como visitante, eu quero ver um formulário de newsletter visualmente atraente ao final da página para que eu possa deixar meu e-mail e demonstrar interesse na plataforma.

**Matriz de Teste do Avaliador:**

- [ ] **Visual/HTML:** A section renderiza: `<h2>` com headline de newsletter, `<p>` com subtítulo, `<form>` com `<input type=\"email\">` e `<button type=\"submit\">`.
- [ ] **Sem Action Real:** O `<form>` NÃO possui atributo `action` apontando para um endpoint real. Pode ter `action=\"#\"` ou omitir o atributo. Não há `method=\"POST\"` funcional.
- [ ] **Zero JS:** Nenhum `addEventListener`, `fetch`, ou script de submissão está presente. O formulário é puramente visual — sem `onsubmit`.
- [ ] **Responsividade:** Em mobile o input e botão ficam em coluna (`flex-col`). Em tablet+ ficam em linha (`flex-row`).
- [ ] **Acessibilidade:** O `<input>` possui `id=\"newsletter-email\"`, `<label for=\"newsletter-email\">` associado, e `placeholder` descritivo.

---

### US-004: SEO Básico & Estrutura de Página

**Descrição:** Como motor de busca, eu quero encontrar meta tags corretas e estrutura HTML semântica na página para que o RecipeHub possa ser indexado adequadamente desde o primeiro deploy.

**Matriz de Teste do Avaliador:**

- [ ] **Meta Tags:** O `<head>` contém `<title>`, `<meta name=\"description\">`, `<meta property=\"og:title\">`, `<meta property=\"og:description\">`, e `<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">`.
- [ ] **HTML Semântico:** A página usa `<header>`, `<main>`, `<section>`, `<footer>` corretamente — verificável via inspeção do HTML gerado em `dist/index.html`.
- [ ] **Build:** `astro build` conclui sem erros. O arquivo `dist/index.html` existe e tem tamanho > 0.
- [ ] **Zero JS:** `dist/index.html` não referencia nenhum arquivo `.js` externo gerado pelo bundler do Astro.

---

### US-005: Responsividade Cross-Device

**Descrição:** Como visitante em qualquer dispositivo, eu quero que a landing page se adapte corretamente ao meu viewport para que a experiência seja adequada em mobile, tablet e desktop.

**Matriz de Teste do Avaliador:**

- [ ] **Mobile (375px):** Grid de receitas em 1 coluna, hero com texto legível (sem overflow horizontal), form em coluna, navegação/header sem quebra de layout.
- [ ] **Tablet (768px):** Grid de receitas em 2 colunas, hero com espaçamento adequado, form em linha.
- [ ] **Desktop (1280px):** Grid de receitas em 3 colunas, hero centralizado com max-width, conteúdo contido em container com `max-w-7xl mx-auto`.
- [ ] **Sem Scroll Horizontal:** Em nenhum breakpoint existe overflow-x na página principal.

---

## 4. Requisitos Funcionais (FR)

### Estrutura do Projeto

**REQ-001** `[MUST]` O projeto é um Astro standalone (não Turborepo). A estrutura raiz deve ser:

```
recipehub-landing/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── HeroSection.astro
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
├── wrangler.toml
└── package.json
```

**REQ-002** `[MUST]` O `package.json` deve conter as seguintes dependências e scripts:

```json
{
  \"name\": \"recipehub-landing\",
  \"type\": \"module\",
  \"scripts\": {
    \"dev\": \"astro dev\",
    \"build\": \"astro build\",
    \"preview\": \"astro preview\",
    \"deploy\": \"astro build && wrangler pages deploy dist\"
  },
  \"dependencies\": {
    \"astro\": \"^4.x\"
  },
  \"devDependencies\": {
    \"@astrojs/tailwind\": \"^5.x\",
    \"tailwindcss\": \"^3.x\",
    \"wrangler\": \"^3.x\"
  }
}
```

### Configuração do Astro

**REQ-003** `[MUST]` O `astro.config.mjs` deve configurar o output como `'static'` e integrar TailwindCSS. Nenhuma integração de framework JS (React, Vue, Svelte) deve ser adicionada, pois zero hidratação no cliente é obrigatório:

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'static',
  integrations: [tailwind()],
});
```

**REQ-004** `[MUST]` O `wrangler.toml` deve configurar o projeto para Cloudflare Pages:

```toml
# wrangler.toml
name = \"recipehub-landing\"
pages_build_output_dir = \"dist\"
compatibility_date = \"2024-01-01\"
```

### Componentes

**REQ-005** `[MUST]` O `BaseLayout.astro` deve incluir na tag `<head>`:
- `<meta charset=\"UTF-8\">`
- `<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">`
- `<title>RecipeHub — Receitas para Todos os Gostos</title>`
- `<meta name=\"description\" content=\"Descubra receitas deliciosas, do café da manhã à sobremesa. RecipeHub reúne as melhores receitas com instruções simples e ingredientes acessíveis.\">`
- `<meta property=\"og:title\" content=\"RecipeHub — Receitas para Todos os Gostos\">`
- `<meta property=\"og:description\" content=\"Descubra receitas deliciosas, do café da manhã à sobremesa.\">`
- `<meta property=\"og:type\" content=\"website\">`

O layout NÃO deve importar nenhuma fonte externa (Google Fonts, Adobe Fonts, etc.). A fonte deve ser `font-sans` do TailwindCSS (system-ui stack).

**REQ-006** `[MUST]` O `HeroSection.astro` deve renderizar:
- Um `<section>` com `id=\"hero\"` e background `bg-amber-50`
- `<h1>` com a tagline principal do RecipeHub (ex: \"Cozinhe com Confiança\")
- `<p>` com subtítulo descritivo
- `<a href=\"#receitas\">` estilizado como botão com classes `bg-amber-500 hover:bg-amber-600 text-white`
- Transição CSS sutil no botão: `transition-colors duration-200`

NÃO deve conter nenhuma tag `<script>` ou directive `client:*`.

**REQ-007** `[MUST]` O `RecipeCard.astro` deve aceitar uma prop do tipo `Recipe` (importada de `src/data/recipes.ts`) e renderizar:
- `<div>` com altura fixa (ex: `h-48`) usando `bg-gradient-to-br` + `from-{placeholderGradient}` com o emoji centralizado via flexbox
- Badge `<span>` com a `category` da receita
- `<h3>` com o `title`
- `<p>` com a `description` — truncada via `line-clamp-2`
- Linha de metadados com ⏱ e `totalTime`
- Hover sutil no card: `transition-shadow duration-200 hover:shadow-lg`

**REQ-008** `[MUST]` O `RecipeGrid.astro` deve:
- Importar o array `recipes` de `src/data/recipes.ts`
- Ter `id=\"receitas\"` para funcionar como âncora do CTA da Hero
- Renderizar um `<div>` com classes `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- Iterar sobre `recipes` usando `{recipes.map((recipe) => <RecipeCard recipe={recipe} />)}`
- Exatamente 6 cards renderizados — verificável no HTML gerado

**REQ-009** `[MUST]` O `NewsletterSection.astro` deve:
- Ter `<section>` com background `bg-amber-500` (warm, contrastante)
- Conter `<h2>` com headline de newsletter e `<p>` com subtítulo
- `<form>` SEM atributo `action` funcional, SEM `method=\"POST\"`, SEM JavaScript de submissão
- `<label for=\"newsletter-email\">` + `<input type=\"email\" id=\"newsletter-email\" placeholder=\"seu@email.com\">`
- `<button type=\"submit\">` estilizado com background `bg-stone-800 text-white`
- Layout responsivo: `flex flex-col sm:flex-row gap-3`

### Build & Deploy

**REQ-010** `[MUST]` O comando `astro build` deve completar sem erros e gerar o diretório `dist/` com `index.html`.

**REQ-011** `[MUST]` O arquivo `dist/index.html` gerado NÃO deve conter referências a arquivos `.js` originados do bundle da aplicação. Verificação: `grep -r '<script' dist/index.html` não deve retornar scripts de bundle (apenas scripts inline de terceiros eventualmente injetados pelo Cloudflare Pages, fora do controle do desenvolvedor).

**REQ-012** `[MUST]` O deploy deve ser executado via `wrangler pages deploy dist --project-name=recipehub-landing`. O agente executor deve criar o projeto no Cloudflare Pages caso ele não exista ainda.

### Qualidade Visual

**REQ-013** `[SHOULD]` Aplicar transições CSS sutis (`transition-*` classes do Tailwind) nos elementos interativos:
- Botão CTA: `transition-colors duration-200`
- Cards de receita: `transition-shadow duration-200`
- Input de newsletter: `transition-colors duration-150` no focus

**REQ-014** `[SHOULD]` O `tailwind.config.mjs` deve estender a paleta com as cores customizadas do RecipeHub para garantir consistência:

```javascript
// tailwind.config.mjs
import { defineConfig } from 'tailwindcss';

export default defineConfig({
  content: ['./src/**/*.{astro,html,js,ts}'],
  theme: {
    extend: {
      colors: {
        brand: {
          amber: '#F59E0B',
          terracota: '#EA580C',
          dark: '#292524',
        },
      },
    },
  },
  plugins: [],
});
```

**REQ-015** `[COULD]` Adicionar um `<footer>` simples com copyright e nome do produto (ex: `© 2025 RecipeHub`) usando `bg-stone-800 text-stone-400`.

---

## 5. Fora do Escopo (Non-Goals)

Os seguintes itens são **explicitamente proibidos** nesta sprint. Qualquer agente executor que introduzir os itens abaixo estará violando o escopo definido:

| Item Proibido | Motivo |
|---|---|
| JavaScript no cliente (`<script>`, `client:*`) | Viola o DoD de zero JS |
| Integração real de newsletter (Mailchimp, Resend, ConvertKit) | Requer backend e JS |
| Páginas internas (`/receita/[slug]`, `/categorias`, `/busca`) | Fora do sprint |
| Roteamento dinâmico | Não há backend |
| Dark mode | Complexidade desnecessária |
| CMS ou fonte de dados externa | Dados são hardcoded |
| Testes automatizados (Vitest, Playwright, Cypress) | Fora do sprint |
| Internacionalização (i18n) | Fora do sprint |
| Analytics (Google Analytics, Plausible, Cloudflare Web Analytics) | Fora do sprint |
| Sistema de busca ou filtros de receitas | Requer JS |
| Categorias clicáveis ou paginação | Requer roteamento |
| Autenticação ou área de usuário | Sem backend |
| Backend/API/Worker Cloudflare | Projeto 100% estático |
| Imagens externas via `<img src=\"https://...\">` | Dependência externa |
| Fontes externas (Google Fonts, etc.) | Dependência externa |
| Bindings Cloudflare (D1, R2, KV, Queues) | Sem estado |
| Turborepo / pnpm workspaces | Projeto standalone |
| Animações complexas (Framer Motion, GSAP) | Requer JS |

---

## 6. Cloudflare Bindings & Integrações

**Bindings Cloudflare:** Nenhum.

| Binding | Status |
|---|---|
| D1 (Banco de dados) | ❌ Não utilizado |
| R2 (Object Storage) | ❌ Não utilizado |
| KV (Cache) | ❌ Não utilizado |
| Queues (Mensageria) | ❌ Não utilizado |
| Workers (Serverless) | ❌ Não utilizado |

**APIs Externas:** Nenhuma.

**Variáveis de Ambiente:** Nenhuma.

**Deploy:**
```bash
# Comando de deploy executado pelo agente
astro build && wrangler pages deploy dist --project-name=recipehub-landing
```

O `wrangler` usa o token de autenticação da sessão local (`wrangler login`) — nenhuma variável de ambiente precisa ser configurada no código da aplicação.

---

## 7. Restrições & Casos Limite

### Restrições Técnicas

**RST-001:** O output do Astro deve ser `'static'` — NÃO usar `'server'` ou `'hybrid'`, pois estes modos requerem um runtime (Worker) para SSR, o que está fora do escopo.

**RST-002:** TailwindCSS deve ser configurado via integração `@astrojs/tailwind` — NÃO usar CDN do Tailwind via `<script>` tag, pois isso injetaria JS no cliente e violaria o DoD.

**RST-003:** Componentes `.astro` não suportam `client:*` directives sem um framework JS instalado (React, Vue, etc.). Como nenhum framework é adicionado, qualquer diretiva `client:*` causará erro de build — isso é desejável como guarda de segurança.

**RST-004:** O `line-clamp-2` do Tailwind requer que o plugin `@tailwindcss/line-clamp` esteja instalado em versões do Tailwind < 3.3. Em Tailwind >= 3.3, está embutido nativamente. Confirmar a versão instalada antes de usar.

**RST-005:** O `wrangler pages deploy` requer que o usuário esteja autenticado via `wrangler login` ou que `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` estejam disponíveis como variáveis de ambiente do sistema operacional (não do projeto). O agente executor deve verificar autenticação antes do deploy.

### Casos Limite

**CE-001: Gradiente com opacidade insuficiente para texto**
Se o emoji placeholder no card não tiver contraste suficiente com o gradiente de fundo, adicionar `drop-shadow` ou aumentar o `text-4xl` do emoji para garantir visibilidade.

**CE-002: Form submission nativa do browser**
Como o `<form>` não tem `action`, ao clicar em \"submit\", o browser fará um GET para a própria página (`?newsletter-email=valor@email.com`). Isso é aceitável para um formulário visual — o usuário verá a página recarregar. Se isso for indesejável, adicionar `action=\"#\"` é suficiente para manter o comportamento na própria URL sem side effects, mantendo zero JS.

**CE-003: Astro injetando script de prefetch**
O Astro pode injetar automaticamente um script de prefetch de links. Para garantir zero JS, adicionar ao `astro.config.mjs`:
```javascript
export default defineConfig({
  output: 'static',
  prefetch: false, // desabilita prefetch automático
  integrations: [tailwind()],
});
```

**CE-004: Projeto já existente no Cloudflare Pages**
Se o projeto `recipehub-landing` já existir no Cloudflare