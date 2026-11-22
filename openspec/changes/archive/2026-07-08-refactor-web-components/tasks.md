## 1. Design Tokens e Temas

- [x] 1.1 Criar `tokens/design-tokens.css` com CSS Custom Properties em `:root, [data-theme]`
- [x] 1.2 Definir 4 temas: marrom (padrão), azul, verde e escuro
- [x] 1.3 Criar `components/` e `pages/` diretórios
- [x] 1.4 Adicionar `--color-svg-primary`, `--color-svg-light` para contraste de SVGs no tema escuro
- [x] 1.5 Adicionar `--color-header-bg` para fundo do header adaptável ao tema

## 2. Componentes de UI Genéricos

- [x] 2.1 Implementar `<ui-section-title>` com atributos `title`, `subtitle`
- [x] 2.2 Implementar `<ui-card>` com modos serviço (icon + title + desc) e depoimento (quote + author + city)
- [x] 2.2a Adicionar `height: 100%` + `box-sizing: border-box` no `.card` para altura igual entre cards do mesmo row
- [x] 2.2b Padding do card alterado de 32px 20px para 32px 24px (igual ao original)
- [x] 2.3 Implementar `<ui-grid>` com atributo `cols`, grid responsivo e atributo `responsive` (ex: `"stack-tablet"`)
- [x] 2.4 Implementar `<ui-two-col>` com slots `image`/`text` e atributo `reverse`; breakpoint mobile em 768px
- [x] 2.5 Implementar `<ui-steps>` com numeração CSS counter e atributos `title`/`desc` nos filhos

## 3. Componentes de Página

- [x] 3.1 Implementar `<app-header>` com checkbox hack para menu mobile e fundo via `--color-header-bg`
- [x] 3.1a `<ui-theme-picker>` posicionado antes do hambúrguer no DOM
- [x] 3.2 Implementar `<app-hero>` com atributos `title`, `subtitle`, `cta-text`, `cta-href` e SVG pattern inline no Shadow DOM
- [x] 3.3 Implementar `<app-contact-form>` com validação e evento `contact-submit`
- [x] 3.4 Implementar `<app-footer>` com navegação e ano dinâmico

## 4. Fade-in e Seletor de Temas

- [x] 4.1 ~~Implementar `<ui-fade-in.js>`~~ REMOVIDO — fade-in descartado
- [x] 4.2 Implementar `<ui-theme-picker>` com bolinhas de cor, `data-theme` e localStorage
- [x] 4.3 ~~Adicionar atributo `data-fade`~~ REMOVIDO — todos os `data-fade` removidos do HTML e CSS

## 5. SVGs e Contraste no Tema Escuro

- [x] 5.1 Ilustrações (`wifi-setup.svg`, `integration.svg`): `var(--color-primary)` → `var(--color-svg-primary, ...)` com fallback; opacidades levemente aumentadas
- [x] 5.2 Hero pattern: removidas cores fixas (#3E2723 etc.); SVG convertido para inline no Shadow DOM com `currentColor`
- [x] 5.3 `app-hero.js`: substituído `::before { background: url(...) }` por `<svg>` inline com `currentColor`
- [x] 5.4 Ícones (`assets/icons/*.svg`): mantido `stroke="currentColor"` (já theme-aware via `color: var(--color-primary)` no CSS)

## 6. Ajustes Pós-Refatoração

- [x] 6.1 Depoimentos grid: `cols="1"` → `cols="3"` + `responsive="stack-tablet"` (3→1 col em ≤768px)
- [x] 6.2 Two-col breakpoint unificado em 768px (mobile stacks em 1 coluna)
- [x] 6.3 Ordem do DOM no header: theme-picker antes do hambúrguer

## 7. Montagem e Testes

- [x] 7.1 Montar `pages/index.css` com estilos globais extraídos
- [x] 7.2 Montar `pages/index.html` com todos os componentes como tags HTML (sem `data-fade`)
- [x] 7.3 Extrair SVGs para `assets/icons/`, `assets/illustrations/`, `assets/hero-pattern.svg`
- [ ] 7.4 Verificar responsividade: 360px, 768px, 1200px
- [ ] 7.5 Verificar troca de temas (4 cores)
- [ ] 7.6 Verificar menu mobile sem JS
