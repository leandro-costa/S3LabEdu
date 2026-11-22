## Context

Landing page HTML monolítica (847 linhas) será refatorada para Web Components (Custom Elements v1 + Shadow DOM) com mínimo de JavaScript — tudo que CSS puder resolver será resolvido em CSS.

Expansão futura para múltiplas páginas (serviços, sobre, contato) exige componentes genéricos reutilizáveis e sistema de temas de cor escolhido pelo usuário.

## Goals / Non-Goals

**Goals:**
- Componentes genéricos com prefixo `ui-` (reuso entre páginas)
- Componentes específicos com prefixo `app-` (header, footer, hero, form)
- CSS encapsulado via Shadow DOM (herança de CSS Custom Properties para temas)
- Design tokens via CSS Custom Properties no `tokens/design-tokens.css`
- Múltiplos temas de cor (marrom, azul, verde, escuro) alternáveis via `data-theme`
- Seletor de temas como componente `<ui-theme-picker>` com persistência em localStorage
- Menu mobile via checkbox hack (zero JavaScript)
- SVG inline no Shadow DOM (app-hero) para herdar `currentColor` dos temas
- Zero dependências externas, zero build tools, zero transpilação

**Non-Goals:**
- Suporte a IE11 ou navegadores antigos
- Roteamento SPA ou estado global
- Testes automatizados (escopo inicial)
- Animação fade-in (removida por simplicidade)

## Decisions

### 1. Componentes
11 componentes JS em `components/` (flat, sem subdiretórios):
- **Genéricos (`ui-*`):** `ui-card`, `ui-grid`, `ui-two-col`, `ui-section-title`, `ui-steps`, `ui-theme-picker`
- **Específicos (`app-*`):** `app-header`, `app-hero`, `app-contact-form`, `app-footer`

### 2. Temas via `data-theme` + CSS Custom Properties
`:root, [data-theme]` define os tokens. Trocar `dataset.theme` re colore instantaneamente todos os componentes (Shadow DOM incluído via herança de custom properties). Nenhum JS de componente precisa saber de temas.

### 3. Tokens específicos por contexto
Além dos tokens genéricos (`--color-primary`, `--color-bg`, etc.), existem tokens específicos:
- `--color-svg-primary`, `--color-svg-light` — cores para ilustrações SVG com contraste adequado no tema escuro (fallback para `--color-primary` nos temas claros)
- `--color-header-bg` — fundo semi-transparente do header (`rgba(255,255,255,0.97)` nos claros, `rgba(30,30,46,0.97)` no escuro)

### 4. SVGs
Ilustrações (`assets/illustrations/*.svg`) são carregadas via `fetch()` + `innerHTML` e usam `var(--color-svg-*)` — herdam cores do tema. Ícones (`assets/icons/*.svg`) usam `stroke="currentColor"` com `color: var(--color-primary)`. O padrão do hero (`hero-pattern.svg`) foi movido para SVG inline no Shadow DOM do `app-hero` para que `currentColor` herde corretamente do tema.

### 5. Checkbox hack para menu mobile
`<input type="checkbox" hidden>` + `<label for="">` + seletor `:checked ~ nav`. Zero JS para abrir/fechar menu. `<ui-theme-picker>` fica antes do hambúrguer no DOM.

### 6. Altura igual para cards
Cards em grid (`ui-card` dentro de `ui-grid`) usam `height: 100%` + `box-sizing: border-box` no `.card` interno para esticar à altura da célula do grid (todos os cards da mesma linha com mesma altura, igual ao original).

### 7. Grid responsivo com atributo `responsive`
`<ui-grid>` aceita `responsive="stack-tablet"` para pular o estado intermediário de 2 colunas em ≤768px e ir direto para 1 coluna (usado nos depoimentos, igual ao original).

### 8. Fade-in: removido
O módulo `ui-fade-in.js` e os atributos `data-fade` foram removidos. A animação fade-in foi descartada por simplicidade — a página depende apenas do carregamento direto sem efeitos de entrada.

## Risks / Trade-offs

- **SVG em background-image com `currentColor`** — `currentColor` em SVG carregado via `url()` NÃO herda do `color` do elemento CSS. Por isso, o padrão do hero foi convertido para SVG inline no Shadow DOM.
- **Formulário em Shadow DOM** — Inputs não participam de form externo. `app-contact-form` gerencia próprio submit com evento customizado `contact-submit`.
- **Checkbox hack** — O label do hamburger precisa estar no mesmo shadow root que o nav. No `app-header`, o checkbox + label + nav ficam dentro do mesmo template.
- **Temas sem transição** — Trocar `data-theme` é instantâneo. Se quiser transição suave, adicionar `transition` nas propriedades que mudam de cor.
- **`color-svg-*` tokens** — Resolvidos em tempo de uso via CSS `var()`. Tema escuro define valores fixos mais claros; temas claros referenciam `--color-primary` e `--color-primary-light`.
