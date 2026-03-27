# PRD — Sprint sp-009: RecipeHub Landing Page

## 1. Visão Geral & North Star

O RecipeHub precisa de uma presença web pública imediata. Esta sprint entrega uma **landing page estática, standalone e desacoplada**, construída com Astro + TailwindCSS, hospedada no Cloudflare Pages.

O estado definitivo de "Concluído" é: uma URL pública no ar, renderizando Hero section, grid de 6 cards de receitas e formulário de newsletter, com **zero JavaScript enviado ao cliente** (confirmável via DevTools → Sources ou `astro build` output) e **build passando sem erros**.

Esta sprint não arquiteta o sistema RecipeHub inteiro — ela entrega exclusivamente o incremento da landing page.

---

## 2. Esquema de Dados (SSoT)

Esta sprint é **data-free por design**. Não há banco D1, bucket R2, cache KV nem fila. Todo o conteúdo é hardcoded diretamente nos componentes Astro.

### 2.1 Estrutura de Dados Hardcoded

Os 6 cards de receitas são arrays TypeScript definidos diretamente no componente ou na página `index.astro`. Nenhuma fonte de dados externa.

**Formato do objeto de receita (TypeScript inline):**

```typescript
interface Recipe {
  id: number;
  title: string;
  imageSrc: string;    // caminho relativo: /images/recipe-{id}.jpg (placeholder)
  imageAlt: string;
  prepTime: string;    // ex: "30 min"
  category: string;   // ex: "Massas", "Saladas"
}

const recipes: Recipe[] = [
  { id: 1, title: "Espaguete ao Pomodoro", imageSrc: "/images/recipe-1.jpg", imageAlt: "Prato de espaguete com molho de tomate", prepTime: "30 min", category: "Massas" },
  { id: 2, title: "Salada Caesar Clássica", imageSrc: "/images/recipe-2.jpg", imageAlt: "Salada caesar com croutons", prepTime: "15 min", category: "Saladas" },
  { id: 3, title: "Risoto de Cogumelos", imageSrc: "/images/recipe-3.jpg", imageAlt: "Risoto cremoso com cogumelos", prepTime: "45 min", category: "Arroz" },
  { id: 4, title: "Frango ao Limão", imageSrc: "/images/recipe-4.jpg", imageAlt: "Filé de frango grelhado com limão", prepTime: "25 min", category: "Carnes" },
  { id: 5, title: "Sopa de Tomate", imageSrc: "/images/recipe-5.jpg", imageAlt: "Sopa cremosa de tomate", prepTime: "40 min", category: "Sopas" },
  { id: 6, title: "Brownie de Chocolate", imageSrc: "/images/recipe-6.jpg", imageAlt: "Brownie fudgy de chocolate", prepTime: "50 min", category: "Doces" },
];
```

### 2.2 Payloads / Formulário

O formulário de newsletter é **puramente visual**. Nenhum payload é enviado. O `<form>` não possui atributo `action` nem `method`. Nenhum handler JavaScript. Estrutura HTML esperada:

```html
<form>
  <input type="email" placeholder="seu@email.com" required />
  <button type="submit">Quero receber receitas</button>
</form>
```

---

## 3. Histórias de Usuário & Matriz do Avaliador

> **Aviso de Escopo:** Todas as US abaixo são executáveis dentro desta sprint única. Nada aqui depende de outras sprints ou serviços externos.

---

### US-001: Hero Section

**Descrição:** Como visitante do RecipeHub, eu quero ver uma seção hero impactante com título, subtítulo e CTA ao acessar a landing page, para que eu entenda imediatamente o propósito do produto e seja incentivado a explorar.

**Matriz de Teste do Avaliador:**

- [ ] **Build:** `astro build` conclui sem erros; o arquivo `dist/index.html` existe e contém o título do hero.
- [ ] **Zero JS:** DevTools → aba Sources mostra zero arquivos `.js` carregados pelo cliente; `astro build` output confirma 0 kB de JS.
- [ ] **UI:** Título principal visível, subtítulo descritivo e botão CTA renderizando com TailwindCSS (sem estilo inline, sem `style=` hardcoded).
- [ ] **Semântica:** O título usa tag `<h1>`, o CTA é um `<a>` ou `<button>` — não um `<div>` clicável.

---

### US-002: Grid de 6 Cards de Receitas

**Descrição:** Como visitante, eu quero ver um grid com 6 cards de receitas, cada um exibindo imagem placeholder, nome da receita e tempo de preparo, para que eu tenha uma amostra visual do conteúdo do RecipeHub.

**Matriz de Teste do Avaliador:**

- [ ] **Build:** `dist/index.html` contém exatamente 6 elementos com a classe do card (ex: `.recipe-card` ou estrutura equivalente).
- [ ] **Conteúdo:** Cada card exibe título, tempo de preparo (ex: "30 min") e uma imagem com `alt` descritivo — verificável via inspeção do HTML gerado.
- [ ] **Layout:** Grid responsivo simples: 1 coluna em mobile, 2 em tablet, 3 em desktop — implementado exclusivamente com classes Tailwind (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`).
- [ ] **Zero JS:** Nenhum script de carregamento lazy, carousel ou interação JS nos cards.

---

### US-003: Formulário Visual de Newsletter

**Descrição:** Como visitante, eu quero ver um formulário de newsletter com campo de e-mail e botão de submit, para que eu perceba que posso me cadastrar para receber receitas (mesmo que o envio não esteja implementado nesta sprint).

**Matriz de Teste do Avaliador:**

- [ ] **Build:** `dist/index.html` contém um `<form>` com `<input type="email">` e `<button type="submit">`.
- [ ] **Sem Backend:** O `<form>` NÃO possui atributo `action` com URL real; nenhum fetch/XHR é disparado ao clicar em submit — verificável via DevTools → Network (zero requests).
- [ ] **Zero JS:** Nenhum event listener JavaScript no formulário.
- [ ] **UI:** Seção visualmente distinta do restante da página (ex: fundo diferente, padding generoso).

---

### US-004: Deploy no Cloudflare Pages

**Descrição:** Como time de desenvolvimento, eu quero que a landing page esteja publicada em uma URL pública do Cloudflare Pages, para que o RecipeHub tenha presença web imediata e verificável.

**Matriz de Teste do Avaliador:**

- [ ] **Deploy:** `wrangler pages deploy dist/` retorna sucesso sem erros; URL pública é exibida no output do comando.
- [ ] **URL Acessível:** A URL pública retorna HTTP 200 e renderiza o conteúdo da landing page.
- [ ] **Build Gate:** O deploy só acontece após `astro build` concluir sem erros (`exit code 0`).
- [ ] **Sem Variáveis de Ambiente:** Nenhuma env var é necessária para o build ou deploy — verificável rodando `astro build` em ambiente limpo.

---

## 4. Requisitos Funcionais (FR)

| ID | Prioridade | Requisito |
|----|------------|-----------|
| REQ-001 | **MUST** | O projeto deve ser um repositório Astro standalone (não integrado ao monorepo Turborepo), inicializado com `npm create astro@latest` ou equivalente. |
| REQ-002 | **MUST** | TailwindCSS deve ser instalado e configurado via integração oficial do Astro (`@astrojs/tailwind`). Zero CSS-in-JS, zero `style=` inline para layout. |
| REQ-003 | **MUST** | A página `src/pages/index.astro` deve ser a única rota do projeto. Nenhuma outra página deve ser criada nesta sprint. |
| REQ-004 | **MUST** | Zero JavaScript no cliente. Nenhum componente React, Vue ou Svelte deve ser usado. Nenhuma diretiva `client:*` do Astro deve aparecer no código. O output de `astro build` deve mostrar 0 kB de JS por página. |
| REQ-005 | **MUST** | A Hero Section deve conter: `<h1>` com o nome/slogan do RecipeHub, um parágrafo descritivo e um elemento CTA (`<a>` ou `<button>`). Conteúdo hardcoded. |
| REQ-006 | **MUST** | O grid de receitas deve renderizar exatamente 6 cards. Cada card deve conter: imagem (`<img>` com `alt` descritivo), título da receita (`<h2>` ou `<h3>`) e tempo de preparo. Dados hardcoded como array TypeScript dentro do arquivo `.astro`. |
| REQ-007 | **MUST** | As imagens dos cards devem ser arquivos de imagem placeholder estáticos localizados em `public/images/recipe-{1..6}.jpg`. Usar imagens reais (mesmo que simples), não URLs de serviços externos como `picsum.photos` (evita dependência de rede externa no build). Alternativamente, usar um SVG placeholder gerado inline — a decisão deve ser explicitada no código com comentário. |
| REQ-008 | **MUST** | O formulário de newsletter deve ser um `<form>` HTML puro com `<input type="email">` e `<button type="submit">`. Sem atributo `action`, sem JavaScript, sem fetch. |
| REQ-009 | **MUST** | O layout deve ser responsivo usando exclusivamente classes Tailwind: 1 coluna em mobile (`grid-cols-1`), 2 em tablet (`md:grid-cols-2`), 3 em desktop (`lg:grid-cols-3`). |
| REQ-010 | **MUST** | O `wrangler.toml` (ou configuração equivalente do Cloudflare Pages) deve apontar `pages_build_output_dir = "dist"` e o comando de build deve ser `astro build`. |
| REQ-011 | **MUST** | O deploy final deve ser executado via `wrangler pages deploy dist/` com credenciais Cloudflare já configuradas no ambiente. Nenhuma variável de ambiente adicional é necessária. |
| REQ-012 | **SHOULD** | Componentes Astro devem ser extraídos em arquivos separados em `src/components/` para legibilidade: `HeroSection.astro`, `RecipeCard.astro`, `NewsletterForm.astro`. A página `index.astro` apenas os importa e compõe. |
| REQ-013 | **SHOULD** | O `<head>` deve conter title (`RecipeHub`), meta description básica e `<meta charset="utf-8">` — mínimo para funcionalidade, sem Open Graph ou tags avançadas. |
| REQ-014 | **COULD** | Um `<header>` com o logo/nome do RecipeHub e um `<footer>` simples com copyright podem ser incluídos se não impactarem o tempo da sprint. |

---

## 5. Fora do Escopo (Non-Goals)

Os itens abaixo são **explicitamente proibidos** nesta sprint. Qualquer implementação destes itens deve ser recusada e registrada como scope creep:

| Item | Justificativa |
|------|---------------|
| Dark mode | Complexidade de tema desnecessária neste incremento |
| Animações CSS (keyframes, transitions complexas) | Risco de polução visual e tempo de implementação |
| i18n / internacionalização | Zero múltiplos idiomas nesta sprint |
| SEO avançado (Open Graph, Twitter Cards, JSON-LD) | Fora do critério de Done definido |
| Sitemap (`sitemap-index.xml`) | Não há múltiplas páginas para indexar |
| `robots.txt` customizado | Desnecessário para landing inicial |
| Fontes customizadas via Google Fonts ou similar | Dependência externa de rede; usar font-stack system do Tailwind |
| Favicon elaborado (SVG animado, múltiplos tamanhos) | Favicon simples ou ausente é aceitável |
| Analytics (Cloudflare Web Analytics, GA, Plausible) | Zero rastreamento nesta sprint |
| Testes automatizados (Playwright, Vitest) | Não faz parte do critério de Done desta sprint |
| Páginas adicionais (`/receitas`, `/sobre`, `/contato`) | Apenas `index.astro` existe nesta sprint |
| Integração real do formulário (Mailchimp, ConvertKit, Brevo) | Formulário é puramente visual |
| Backend / API / banco de dados | Zero infraestrutura de servidor nesta sprint |
| Componentes React/Vue/Svelte com hidratação | Zero JS cliente — violação direta do critério de Done |
| CMS (Contentful, Sanity, Notion API) | Conteúdo 100% hardcoded |

---

## 6. Cloudflare Bindings & Integrações

**Bindings Cloudflare:** Nenhum.
> Esta sprint não usa D1, R2, KV, Queues, Workers ou qualquer outro binding Cloudflare. A aplicação é 100% estática — HTML/CSS puro gerado pelo Astro.

**Cloudflare Pages:**
- Plataforma de hospedagem: Cloudflare Pages (static site hosting)
- Comando de build: `astro build`
- Output directory: `dist/`
- Deploy command: `wrangler pages deploy dist/ --project-name=recipehub-landing`

**APIs Externas:** Nenhuma.

**Variáveis de Ambiente:** Nenhuma necessária para build ou deploy.

---

## 7. Restrições & Casos Limite

### 7.1 Restrições Técnicas

| Restrição | Detalhe |
|-----------|---------|
| **Node.js obrigatório para build** | O Astro build roda em Node.js (ambiente de build local), mas o output é HTML/CSS estático. O runtime do Cloudflare Pages para sites estáticos não executa Workers — sem conflito com a diretriz edge. |
| **Versão do Astro** | Use Astro 4.x (estável). Evite Astro 5.x beta se não estiver documentado como estável na data da sprint. |
| **TailwindCSS via integração oficial** | Use `@astrojs/tailwind` — não configure Tailwind manualmente via PostCSS sem a integração, para evitar conflitos com o pipeline de build do Astro. |
| **Imagens placeholder locais** | Imagens devem estar em `public/images/`. Não usar URLs externas (`picsum.photos`, `placehold.co`) para evitar dependência de rede e possível quebra de build em CI sem acesso à internet. |
| **Sem `client:*` directives** | Qualquer componente com `client:load`, `client:idle`, `client:visible` viola REQ-004. O linter/revisor deve rejeitar PRs com essas diretivas. |

### 7.2 Casos Limite

| Cenário | Comportamento Esperado |
|---------|----------------------|
| Build com imagem faltando | O `astro build` falha com erro claro. As 6 imagens placeholder **devem** existir em `public/images/` antes do build. |
| Submit do formulário sem action | O browser exibe comportamento padrão (reload da página ou erro silencioso). Aceitável — o formulário é puramente visual. |
| Deploy sem autenticação Wrangler | `wrangler pages deploy` falha com erro de autenticação. Pré-requisito: `wrangler login` executado no ambiente local. |
| Acesso à URL antes do deploy | Sem URL pública — a sprint só está concluída após `wrangler pages deploy` retornar sucesso com URL. |

---

## 8. Estrutura de Arquivos do Projeto

```
recipehub-landing/          ← raiz do repositório standalone
├── public/
│   ├── images/
│   │   ├── recipe-1.jpg    ← placeholder (REQ-007)
│   │   ├── recipe-2.jpg
│   │   ├── recipe-3.jpg
│   │   ├── recipe-4.jpg
│   │   ├── recipe-5.jpg
│   │   └── recipe-6.jpg
│   └── favicon.ico         ← favicon padrão (pode ser o default do Astro)
├── src/
│   ├── components/
│   │   ├── HeroSection.astro       ← [Ref: REQ-005, REQ-012]
│   │   ├── RecipeCard.astro        ← [Ref: REQ-006, REQ-012]
│   │   └── NewsletterForm.astro    ← [Ref: REQ-008, REQ-012]
│   ├── layouts/
│   │   └── BaseLayout.astro        ← <html>, <head>, <body> wrapper
│   └── pages/
│       └── index.astro             ← [Ref: REQ-003] única rota
├── astro.config.mjs                ← integração @astrojs/tailwind
├── tailwind.config.mjs             ← configuração Tailwind
├── tsconfig.json
├── package.json
└── wrangler.toml                   ← [Ref: REQ-010]
```

### Conteúdo de Referência: `wrangler.toml`

```toml
name = "recipehub-landing"
pages_build_output_dir = "dist"
```

### Conteúdo de Referência: `astro.config.mjs`

```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  // output padrão é 'static' — não alterar para 'server' ou 'hybrid'
});
```

---

## 9. Definição de Done (Checklist de Encerramento)

A sprint sp-009 está **oficialmente concluída** quando TODOS os itens abaixo forem verdadeiros:

- [ ] `astro build` roda sem erros (`exit code 0`)
- [ ] `dist/index.html` existe e contém Hero, 6 cards e formulário newsletter
- [ ] DevTools confirma **zero arquivos JavaScript** carregados pelo cliente
- [ ] `wrangler pages deploy dist/` retorna sucesso com URL pública
- [ ] URL pública retorna HTTP 200 e renderiza o conteúdo completo
- [ ] Nenhum item da lista "Fora do Escopo" (Seção 5) foi implementado
```