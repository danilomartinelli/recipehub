# PRD — Sprint sp-008: RecipeHub Landing Page

## Metadados

| Campo | Valor |
|---|---|
| Sprint Code | sp-008 |
| Criado em | 2025 |
| Status | Draft → Ready for Execution |
| Autor | Witek Blueprint Agent |
| Deploy Target | Cloudflare Pages |

---

## 1. Visão Geral & North Star

Esta sprint entrega a landing page estática pública do **RecipeHub** — a primeira impressão do produto para usuários orgânicos e campanhas de marketing. A página é gerada 100% em build-time pelo Astro, sem JavaScript no cliente, e deployada no Cloudflare Pages.

O estado de **\"Concluído\"** é: URL pública acessível no Cloudflare Pages, hero section + grid de 6 cards de receitas + formulário visual de newsletter renderizados corretamente, zero JS emitido no bundle do cliente, e `pnpm build` sem erros ou warnings fatais.

**O que esta sprint NÃO é:** não é um sistema de receitas, não tem backend, não tem autenticação, não tem rotas dinâmicas. É uma vitrine estática.

---

## 2. Objetivos Mensuráveis

| # | Objetivo | Métrica de Sucesso |
|---|---|---|
| O-1 | Landing page acessível publicamente | URL do Cloudflare Pages retorna HTTP 200 |
| O-2 | Zero JavaScript no cliente | DevTools → Network → JS = 0 arquivos JS carregados |
| O-3 | Build sem erros | `pnpm build` exit code 0, sem erros no stdout |
| O-4 | Hero section visível | Título principal, subtítulo e botão CTA presentes no DOM |
| O-5 | Grid de receitas visível | Exatamente 6 cards com imagem, título, e tempo de preparo renderizados |
| O-6 | Formulário de newsletter visível | Input de e-mail + botão de submit presentes no DOM (sem action real) |
| O-7 | Layout responsivo | Página renderiza corretamente em 375px (mobile) e 1280px (desktop) |

---

## 3. Estrutura do Projeto (Topologia)

Esta sprint cria um novo workspace dedicado dentro do monorepo Turborepo existente.

```
recipehub/                          ← root do monorepo
├── apps/
│   └── web/                        ← NOVO workspace desta sprint
│       ├── public/
│       │   └── favicon.svg
│       ├── src/
│       │   ├── components/
│       │   │   ├── Hero.astro
│       │   │   ├── RecipeCard.astro
│       │   │   ├── RecipeGrid.astro
│       │   │   └── NewsletterForm.astro
│       │   ├── layouts/
│       │   │   └── BaseLayout.astro
│       │   ├── pages/
│       │   │   └── index.astro
│       │   └── data/
│       │       └── recipes.ts       ← dados hardcoded das 6 receitas
│       ├── astro.config.mjs
│       ├── tailwind.config.mjs
│       ├── tsconfig.json
│       └── package.json
├── packages/                        ← não alterados nesta sprint
├── tooling/                         ← não alterados nesta sprint
├── turbo.json                       ← adicionar pipeline para `web`
└── package.json                     ← adicionar `apps/web` ao pnpm workspace
```

---

## 4. Esquema de Dados (SSoT)

### 4.1 Infraestrutura Cloudflare

**ZERO bindings necessários.** Esta sprint não utiliza D1, R2, KV, Queues ou Workers.

### 4.2 Estrutura de Dados Hardcoded

As receitas são definidas em `apps/web/src/data/recipes.ts` como um array TypeScript estático. Este arquivo é a SSoT dos dados de conteúdo desta sprint.

```typescript
// apps/web/src/data/recipes.ts

export interface Recipe {
  id: number;
  title: string;
  description: string;
  prepTime: string;       // ex: \"25 min\"
  category: string;       // ex: \"Almoço\", \"Jantar\", \"Café da Manhã\"
  imageUrl: string;       // picsum.photos URL
  imageAlt: string;
}

export const recipes: Recipe[] = [
  {
    id: 1,
    title: \"Risoto de Cogumelos\",
    description: \"Cremoso e aromático, perfeito para um jantar especial.\",
    prepTime: \"35 min\",
    category: \"Jantar\",
    imageUrl: \"https://picsum.photos/seed/risoto/400/300\",
    imageAlt: \"Risoto de Cogumelos em prato fundo\",
  },
  {
    id: 2,
    title: \"Salada Caesar\",
    description: \"Clássica com croutons crocantes e molho autêntico.\",
    prepTime: \"15 min\",
    category: \"Almoço\",
    imageUrl: \"https://picsum.photos/seed/caesar/400/300\",
    imageAlt: \"Salada Caesar com frango grelhado\",
  },
  {
    id: 3,
    title: \"Pancakes de Aveia\",
    description: \"Leves, nutritivos e prontos em menos de 20 minutos.\",
    prepTime: \"20 min\",
    category: \"Café da Manhã\",
    imageUrl: \"https://picsum.photos/seed/pancakes/400/300\",
    imageAlt: \"Pilha de pancakes com frutas vermelhas\",
  },
  {
    id: 4,
    title: \"Sopa de Abóbora\",
    description: \"Reconfortante e aveludada com toque de gengibre.\",
    prepTime: \"40 min\",
    category: \"Jantar\",
    imageUrl: \"https://picsum.photos/seed/sopa/400/300\",
    imageAlt: \"Sopa de abóbora com creme e sementes\",
  },
  {
    id: 5,
    title: \"Frango ao Limão\",
    description: \"Suculento e cítrico, marinado por 2 horas.\",
    prepTime: \"30 min\",
    category: \"Almoço\",
    imageUrl: \"https://picsum.photos/seed/frango/400/300\",
    imageAlt: \"Frango grelhado com rodelas de limão\",
  },
  {
    id: 6,
    title: \"Brownie de Chocolate\",
    description: \"Intenso e fudgy, com casquinha crocante por fora.\",
    prepTime: \"45 min\",
    category: \"Sobremesa\",
    imageUrl: \"https://picsum.photos/seed/brownie/400/300\",
    imageAlt: \"Brownie de chocolate cortado em quadrados\",
  },
];
```

### 4.3 Design Visual (Tokens)

```
Paleta:
  - Background:  #FFFFFF (branco)
  - Surface:     #F9FAFB (gray-50) — cards e seções alternadas
  - Border:      #E5E7EB (gray-200)
  - Text Primary:#111827 (gray-900)
  - Text Muted:  #6B7280 (gray-500)
  - Accent:      #16A34A (green-600) — botões CTA, badges de categoria
  - Accent Hover:#15803D (green-700)

Tipografia:
  - Font Family: Inter (via Google Fonts, preconnect)
  - H1 (Hero):   text-5xl font-bold (mobile: text-3xl)
  - H2 (Section):text-3xl font-semibold
  - Body:        text-base font-normal
  - Badge:       text-xs font-medium

Card:
  - Border Radius: rounded-2xl
  - Shadow:        shadow-md hover:shadow-lg
  - Transition:    transition-shadow duration-200
```

---

## 5. Histórias de Usuário & Matriz do Avaliador

### US-001: Hero Section com CTA

**Descrição:** Como visitante da landing page, eu quero ver uma seção hero clara com o nome do produto, proposta de valor e botão de call-to-action, para que eu entenda imediatamente o que é o RecipeHub e seja incentivado a explorar.

**Matriz de Teste do Avaliador:**

- [ ] **Build:** `pnpm build` em `apps/web` finaliza sem erros
- [ ] **DOM:** O elemento `<h1>` com texto principal existe na página
- [ ] **DOM:** Um elemento `<a>` ou `<button>` com texto de CTA (ex: \"Explorar Receitas\") está presente
- [ ] **Zero JS:** DevTools Network tab não registra nenhum arquivo `.js` sendo carregado
- [ ] **Responsivo:** Em viewport 375px, o título é legível e o CTA está visível sem scroll horizontal

---

### US-002: Grid de 6 Receitas Hardcoded

**Descrição:** Como visitante, eu quero ver um grid visual de 6 receitas com imagem, título, categoria e tempo de preparo, para que eu tenha uma amostra do conteúdo disponível no RecipeHub.

**Matriz de Teste do Avaliador:**

- [ ] **DOM:** Exatamente 6 elementos card estão presentes na página
- [ ] **DOM:** Cada card contém: uma tag `<img>` com `src` e `alt` preenchidos, um título, um badge de categoria, e o tempo de preparo
- [ ] **Imagens:** As URLs `picsum.photos` são válidas e carregam (HTTP 200) no browser
- [ ] **Layout Desktop:** Em 1280px, o grid exibe 3 colunas
- [ ] **Layout Mobile:** Em 375px, o grid exibe 1 coluna
- [ ] **Acessibilidade:** Todos os `<img>` possuem atributo `alt` não-vazio

---

### US-003: Formulário Visual de Newsletter

**Descrição:** Como visitante, eu quero ver uma seção de newsletter com campo de e-mail e botão de envio, para que eu tenha a opção de me cadastrar (mesmo que o envio não seja funcional nesta sprint).

**Matriz de Teste do Avaliador:**

- [ ] **DOM:** Um elemento `<input type=\"email\">` está presente
- [ ] **DOM:** Um elemento `<button type=\"submit\">` está presente dentro ou adjacente ao formulário
- [ ] **Sem Action Real:** O atributo `action` do `<form>` está ausente ou vazio — nenhuma requisição de rede é disparada ao submeter
- [ ] **Zero JS:** Nenhum event listener JavaScript está registrado no formulário
- [ ] **Visual:** A seção de newsletter tem fundo diferenciado (ex: green-50 ou gray-50) para destacá-la do grid

---

### US-004: Deploy no Cloudflare Pages

**Descrição:** Como CTO, eu quero que a landing page esteja acessível via URL pública no Cloudflare Pages, para que o produto seja apresentável externamente.

**Matriz de Teste do Avaliador:**

- [ ] **Config:** O arquivo `apps/web/astro.config.mjs` está configurado com `output: 'static'` e adaptador `@astrojs/cloudflare` (se necessário) ou sem adaptador (default static)
- [ ] **Build Output:** O diretório `apps/web/dist/` é gerado após `pnpm build` e contém `index.html`
- [ ] **Deploy:** URL do Cloudflare Pages retorna HTTP 200 com content-type `text/html`
- [ ] **Headers:** Resposta inclui headers de cache adequados do Cloudflare Pages

---

## 6. Requisitos Funcionais

### Prioridade: MUST (Obrigatório — DoD não é atingido sem estes)

| ID | Requisito | História |
|---|---|---|
| REQ-001 | O projeto `apps/web` DEVE ser um workspace Astro configurado com `output: 'static'` e TailwindCSS v3. O arquivo `astro.config.mjs` não deve incluir nenhum adaptador de servidor (apenas static). | US-004 |
| REQ-002 | O `apps/web/package.json` DEVE definir o script `\"build\": \"astro build\"` e `\"dev\": \"astro dev\"`. O workspace DEVE ser registrado no `pnpm-workspace.yaml` do root. | US-004 |
| REQ-003 | A página `apps/web/src/pages/index.astro` DEVE importar e renderizar os componentes `Hero`, `RecipeGrid` e `NewsletterForm` nesta ordem, sem nenhum `<script>` tag no output final. | US-001, US-002, US-003 |
| REQ-004 | O componente `Hero.astro` DEVE renderizar: (1) um `<h1>` com o nome e tagline do RecipeHub, (2) um parágrafo de subtítulo, (3) um `<a>` estilizado como botão CTA em green-600 com `href=\"#recipes\"`. Sem JavaScript. | US-001 |
| REQ-005 | O componente `RecipeGrid.astro` DEVE importar o array `recipes` de `../data/recipes.ts` e renderizar exatamente 6 `<RecipeCard>` em um grid CSS responsivo: 1 coluna em mobile (< 768px), 2 colunas em tablet (768px–1279px), 3 colunas em desktop (≥ 1280px). | US-002 |
| REQ-006 | O componente `RecipeCard.astro` DEVE aceitar uma prop do tipo `Recipe` e renderizar: `<img>` com `src` e `alt`, badge de `category`, `title` em negrito, `description` truncada em 2 linhas (`line-clamp-2`), e `prepTime` com ícone de relógio (SVG inline ou Heroicons). | US-002 |
| REQ-007 | O componente `NewsletterForm.astro` DEVE renderizar um `<form>` com `<input type=\"email\" placeholder=\"Seu e-mail\">` e `<button type=\"submit\">`. O `<form>` NÃO DEVE ter atributo `action` ou `method` com endpoint real. Sem JavaScript. | US-003 |
| REQ-008 | O atributo `loading=\"lazy\"` DEVE estar presente em todos os `<img>` dos cards de receita. O `<img>` do hero (se houver) DEVE usar `loading=\"eager\"`. | US-002 |
| REQ-009 | O `turbo.json` do root DEVE incluir o pipeline de build para o workspace `web`, garantindo que `turbo build --filter=web` funcione corretamente. | US-004 |

### Prioridade: SHOULD (Importante — degradação aceitável se bloqueado)

| ID | Requisito | História |
|---|---|---|
| REQ-010 | O `BaseLayout.astro` DEVE incluir `<meta charset=\"UTF-8\">`, `<meta name=\"viewport\" content=\"width=device-width\">`, `<title>RecipeHub</title>`, e preconnect para Google Fonts (Inter). | US-001 |
| REQ-011 | O `<section>` do RecipeGrid DEVE ter o atributo `id=\"recipes\"` para que o CTA do Hero (`href=\"#recipes\"`) funcione como âncora interna. | US-001, US-002 |
| REQ-012 | Os cards DEVE ter hover state sutil: `hover:shadow-lg` e `hover:-translate-y-1` via TailwindCSS (não requer JavaScript — é CSS puro). | US-002 |
| REQ-013 | A seção de newsletter DEVE ter fundo em `bg-green-50` para diferenciá-la visualmente do restante da página. | US-003 |

### Prioridade: COULD (Desejável — inclua apenas se não impactar o prazo)

| ID | Requisito | Observação |
|---|---|---|
| REQ-014 | Adicionar `<meta name=\"description\">` básico no BaseLayout com descrição do RecipeHub. | SEO mínimo sem overhead |
| REQ-015 | Adicionar um `<footer>` simples com copyright `© 2025 RecipeHub`. | Completude visual |
| REQ-016 | Configurar `width` e `height` nos `<img>` dos cards para evitar Cumulative Layout Shift (CLS). | Performance |

---

## 7. Especificação de Componentes

### 7.1 BaseLayout.astro

```astro
---
// apps/web/src/layouts/BaseLayout.astro
// [Ref: REQ-010]
interface Props {
  title?: string;
  description?: string;
}
const { title = 'RecipeHub', description = 'Descubra receitas incríveis' } = Astro.props;
---
<!DOCTYPE html>
<html lang=\"pt-BR\">
  <head>
    <meta charset=\"UTF-8\" />
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />
    <meta name=\"description\" content={description} />
    <title>{title}</title>
    <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\" />
    <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin />
    <link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap\" rel=\"stylesheet\" />
  </head>
  <body class=\"bg-white font-sans text-gray-900 antialiased\">
    <slot />
  </body>
</html>
```

### 7.2 Hero.astro

```astro
---
// apps/web/src/components/Hero.astro
// [Ref: REQ-004]
---
<section class=\"bg-white py-20 px-4\">
  <div class=\"max-w-4xl mx-auto text-center\">
    <h1 class=\"text-5xl font-bold text-gray-900 mb-6 leading-tight\">
      Descubra Receitas que
      <span class=\"text-green-600\"> Inspiram</span>
    </h1>
    <p class=\"text-xl text-gray-500 mb-10 max-w-2xl mx-auto\">
      Do café da manhã ao jantar, encontre receitas simples e deliciosas
      para todos os momentos.
    </p>
    <a
      href=\"#recipes\"
      class=\"inline-block bg-green-600 hover:bg-green-700 text-white font-semibold
             px-8 py-4 rounded-xl transition-colors duration-200\"
    >
      Explorar Receitas
    </a>
  </div>
</section>
```

### 7.3 RecipeCard.astro

```astro
---
// apps/web/src/components/RecipeCard.astro
// [Ref: REQ-006, REQ-008]
import type { Recipe } from '../data/recipes';
interface Props { recipe: Recipe; }
const { recipe } = Astro.props;
---
<article
  class=\"bg-white rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1
         transition-all duration-200 overflow-hidden border border-gray-100\"
>
  <img
    src={recipe.imageUrl}
    alt={recipe.imageAlt}
    width=\"400\"
    height=\"300\"
    loading=\"lazy\"
    class=\"w-full h-48 object-cover\"
  />
  <div class=\"p-5\">
    <span class=\"inline-block bg-green-100 text-green-700 text-xs font-medium
                 px-2.5 py-1 rounded-full mb-3\">
      {recipe.category}
    </span>
    <h3 class=\"text-lg font-semibold text-gray-900 mb-2\">{recipe.title}</h3>
    <p class=\"text-gray-500 text-sm line-clamp-2 mb-4\">{recipe.description}</p>
    <div class=\"flex items-center gap-1.5 text-gray-400 text-sm\">
      <!-- Clock icon SVG inline -->
      <svg xmlns=\"http://www.w3.org/2000/svg\" class=\"w-4 h-4\" fill=\"none\"
           viewBox=\"0 0 24 24\" stroke=\"currentColor\" stroke-width=\"2\">
        <path stroke-linecap=\"round\" stroke-linejoin=\"round\"
              d=\"M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z\" />
      </svg>
      <span>{recipe.prepTime}</span>
    </div>
  </div>
</article>
```

### 7.4 RecipeGrid.astro

```astro
---
// apps/web/src/components/RecipeGrid.astro
// [Ref: REQ-005, REQ-011]
import { recipes } from '../data/recipes';
import RecipeCard from './RecipeCard.astro';
---
<section id=\"recipes\" class=\"bg-gray-50 py-20 px-4\">
  <div class=\"max-w-6xl mx-auto\">
    <h2 class=\"text-3xl font-semibold text-gray-900 text-center mb-12\">
      Receitas em Destaque
    </h2>
    <div class=\"grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8\">
      {recipes.map((recipe) => (
        <RecipeCard recipe={recipe} />
      ))}
    </div>
  </div>
</section>
```

### 7.5 NewsletterForm.astro

```astro
---
// apps/web/src/components/NewsletterForm.astro
// [Ref: REQ-007, REQ-013]
---
<section class=\"bg-green-50 py-20 px-4\">
  <div class=\"max-w-xl mx-auto text-center\">
    <h2 class=\"text-3xl font-semibold text-gray-900 mb-4\">
      Receba Receitas Semanais
    </h2>
    <p class=\"text-gray-500 mb-8\">
      Assine nossa newsletter e receba as melhores receitas diretamente
      no seu e-mail, toda semana.
    </p>
    <form class=\"flex flex-col sm:flex-row gap-3 justify-center\">
      <input
        type=\"email\"
        placeholder=\"Seu e-mail\"
        class=\"flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-900
               placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-400
               focus:border-transparent\"
      />
      <button
        type=\"submit\"
        class=\"bg-green-600 hover:bg-green-700 text-white font-semibold
               px-6 py-3 rounded-xl transition-colors duration-200 whitespace-nowrap\"
      >
        Assinar Newsletter
      </button>
    </form>
  </div>
</section>
```

### 7.6 index.astro (página principal)

```astro
---
// apps/web/src/pages/index.astro
// [Ref: REQ-003]
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/Hero.astro';
import RecipeGrid from '../components/RecipeGrid.astro';
import NewsletterForm from '../components/NewsletterForm.astro';
---
<BaseLayout title=\"RecipeHub — Descubra Receitas Incríveis\">
  <main>
    <Hero />
    <RecipeGrid />
    <NewsletterForm />
  </main>
</BaseLayout>
```

---

## 8. Configuração do Workspace

### 8.1 astro.config.mjs

```javascript
// apps/web/astro.config.mjs
// [Ref: REQ-001]
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'static',          // Zero JS no cliente por default
  integrations: [tailwind()],
});
```

> **Nota:** NÃO adicione o adaptador `@astrojs/cloudflare` — ele é para Workers/SSR. Pages com output estático não requerem adaptador. O Cloudflare Pages detecta automaticamente o diretório `dist/`.

### 8.2 tailwind.config.mjs

```javascript
// apps/web/tailwind.config.mjs
import { fontFamily } from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
      },
    },
  },
  plugins: [
    // Se line-clamp não estiver disponível nativamente (Tailwind < 3.3),
    // adicione: require('@tailwindcss/line-clamp')
  ],
};
```

### 8.3 package.json de apps/web

```json
{
  \"name\": \"@recipehub/web\",
  \"version\": \"0.1.0\",
  \"private\": true,
  \"scripts\": {
    \"dev\": \"astro dev\",
    \"build\": \"astro build\",
    \"preview\": \"astro preview\",
    \"check\": \"astro check\"
  },
  \"dependencies\": {
    \"astro\": \"^4.0.0\",
    \"@astrojs/tailwind\": \"^5.0.0\",
    \"tailwindcss\": \"^3.4.0\"
  },
  \"devDependencies\": {
    \"typescript\": \"^5.4.0\"
  }
}
```

### 8.4 tsconfig.json de apps/web

```json
{
  \"extends\": \"astro/tsconfigs/strict\",
  \"compilerOptions\": {
    \"baseUrl\": \".\",
    \"paths\": {
      \"@components/*\": [\"src/components/*\"],
      \"@data/*\": [\"src/data/*\"],
      \"@layouts/*\": [\"src/layouts/*\"]
    }
  }
}
```

### 8.5 Atualização do turbo.json (root)

```json
// turbo.json — adicionar/verificar que o pipeline inclui o workspace web
// [Ref: REQ-009]
{
  \"$schema\": \"https://turbo.build/schema.json\",
  \"tasks\": {
    \"build\": {
      \"dependsOn\": [\"^build\"],
      \"outputs\": [\"dist/**\", \".astro/**\"]
    },
    \"dev\": {
      \"cache\": false,
      \"persistent\": true
    },
    \"check\": {
      \"dependsOn\": [\"^build\"]
    }
  }
}
```

### 8.6 Registro no pnpm-workspace.yaml (root)

Verifique se `apps/*` já está incluso. Se o arquivo não existir ou não incluir apps, adicione:

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'tooling/*'
```

---

## 9. Cloudflare Pages — Configuração de Deploy

Configurar no dashboard do Cloudflare Pages (ou via `wrangler pages project create`):

| Setting | Valor |
|---|---|
| Framework preset | Astro |
| Build command | `pnpm turbo build --filter=@recipehub/web` |
| Build output directory | `apps/web/dist` |
| Root directory | `/` (root do monorepo) |
| Node.js version | 20.x |
| Environment variables | Nenhuma necessária nesta sprint |

> **Importante:** Nenhuma variável de ambiente é necessária. A página é 100% estática e hardcoded.

---

## 10. Integrações e Bindings

| Tipo | Nome | Valor | Obrigatório |
|---|---|---|---|
| Cloudflare Binding | — | — | Nenhum |
| API Externa | — | — | Nenhuma |
| Variável de Ambiente | — | — | Nenhuma |
| CDN Externo | Google Fonts (Inter) | Preconnect no `<head>` | SHOULD (REQ-010) |
| Serviço de Imagens | picsum.photos | URL pública, sem auth | MUST (REQ-006) |

---

## 11. Restrições Técnicas & Casos Limite

| # | Restrição | Mitigação |
|---|---|---|
| R-1 | **Zero JavaScript no cliente.** O Astro emite JS por default para hidratação de componentes React/Vue. Como não há componentes de framework nesta sprint (apenas `.astro`), o output já será zero-JS. Não adicione diretivas `client:*` em nenhum componente. | Verificar com DevTools após build |
| R-2 | **`line-clamp-2` requer TailwindCSS ≥ 3.3** (nativo) ou o plugin `@tailwindcss/line-clamp` em versões anteriores. | Verificar versão antes de usar. Alternativa: `overflow-hidden` + `max-h-[3rem]` |
| R-3 | **picsum.photos pode ser bloqueado em algumas redes** — são imagens de placeholder apenas. Em produção real, serão substituídas. | Documentado como limitation conhecida |
| R-4 | **Google Fonts carrega via rede externa** — impacta LCP em conexões lentas. | Aceitável para landing page estática nesta sprint |
| R-5 | **Formulário sem `action`** — ao clicar em \"Assinar\", o browser pode recarregar a página (comportamento padrão de form sem action). | Comportamento aceitável para sprint visual. Não adicionar JS para prevenir. |
| R-6 | **Deploy no Cloudflare Pages requer root do monorepo** como base, não `apps/web/`. O build command deve incluir o filtro do Turborepo. | Configurado em REQ-009 e Seção 9 |

---

## 12. Fora do Escopo (Non-Goals)

Estes itens são **explicitamente proibidos** nesta sprint. Qualquer PR que os inclua deve ser rejeitado pelo Code Reviewer.

| Item | Motivo da Exclusão |
|---|---|
| Sistema de autenticação (login, cadastro) | Fora do escopo — sprint dedicada em outra iteração |
| Páginas internas de receita (`/recipes/[slug]`) | Rotas dinâmicas = fora de escopo |
| Funcionalidade de busca ou filtro de receitas | Requer JS ou backend — fora de escopo |
| Integração real de newsletter (Resend, Mailchimp) | Requer API key e backend — sprint futura |
| CMS ou painel de administração | Projeto separado |
| Página `/blog`, `/sobre`, `/contato` | Sprints futuras |
| `sitemap.xml` ou `robots.txt` | SEO avançado — sprint futura |
| Open Graph tags, Schema.org, Twitter Cards | SEO avançado — sprint futura |
| Animações complexas (scroll-triggered, GSAP, Framer Motion) | Violaria zero-JS |
| Modo escuro (dark mode) | Sprint futura |
| Internacionalização (i18n) | Fora de escopo |
| Testes automatizados (Playwright, Vitest) | Não há lógica de negócio para testar nesta sprint |
| Componentes React/Vue hidratados | Violaria zero-JS |
| `@astrojs/cloudflare` adapter | Para SSR/Workers apenas — não aplicável aqui |

---

## 13. Checklist de Entrega (DoD Final)

Antes de marcar esta sprint como **Done**, todos os itens abaixo devem ser ✅:

- [ ] `pnpm turbo build --filter=@recipehub/web` executa sem erros
- [ ] `apps/web/dist/index.html` existe e contém `<h1>`, 6 cards e o formulário
- [ ] DevTools → Network: zero arquivos `.js` carregados na página
- [ ] URL pública do Cloudflare Pages retorna HTTP 200
- [ ] Hero section visível com título, subtítulo e CTA verde
- [ ] Grid exibe exatamente 6 cards com imagem (picsum), badge, título e tempo de preparo
- [ ] Formulário de newsletter visível com input e botão, sem JS
- [ ] Layout responsivo verificado em 375px e 1280px
- [ ] Todos os `<img>` têm atributo `alt` não-vazio

---

*PRD gerado pelo Witek Blueprint Agent — Sprint sp-008 — RecipeHub Landing Page*
"}}
</tool_call>

<tool_response>
{"success": true, "path": "architecture/plans/prd-sprint-sp-008.md", "bytes": 14821}
</tool_response>

<tool_call>
{"name": "complete_phase", "parameters": {"summary": "Blueprint sp-008 concluído: landing page estática RecipeHub em apps/web (Astro + TailwindCSS), zero JS no cliente, 3 componentes (Hero, RecipeGrid, NewsletterForm), 6 receitas hardcoded via picsum.photos, deploy Cloudflare Pages — sem infraestrutura, sem bindings, sem APIs externas."}}
</tool_call>

<tool_response>
{"success": true, "phase": "blueprint", "next_phase": "link"}
</tool_response>

**PRD salvo** em `architecture/plans/prd-sprint-sp-008.md` (14.8 KB).

---

**Resumo Executivo — sp-008**

| Campo | Decisão |
|---|---|
| **Escopo** | `apps/web` — landing page estática (`/`) com Hero + RecipeGrid (6 cards) + NewsletterForm |
| **Stack** | Astro 4 (`output: 'static'`) + TailwindCSS 3 + Inter font — zero JS no cliente |
| **Data Model** | 100% hardcoded em `apps/web/src/data/recipes.ts` · imagens via picsum.photos |
| **Infraestrutura** | Nenhuma — zero D1, R2, KV, Workers ou variáveis de ambiente |
| **Deploy** | Cloudflare Pages · build command: `pnpm turbo build --filter=@recipehub/web` · output: `apps/web/dist` |
| **Non-Goals** | Auth, rotas dinâmicas, newsletter real, CMS, busca, modo escuro, SEO avançado, animações, qualquer JS no cliente |