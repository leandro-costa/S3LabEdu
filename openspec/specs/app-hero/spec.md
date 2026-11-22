# app-hero

## Purpose

Seção hero em tela cheia com gradiente, título, subtítulo, botão CTA e pattern decorativo.

## Requirements

### Requirement: Hero section parametrizável
O componente `<app-hero>` SHALL exibir seção hero em tela cheia com fundo gradiente, título, subtítulo e botão CTA.

#### Scenario: Hero com valores padrão
- **WHEN** `<app-hero>` é usado sem atributos
- **THEN** exibe "Sua casa inteligente começa aqui", texto descritivo e botão "Solicitar orçamento grátis"

#### Scenario: Atributos customizados
- **WHEN** `title`, `subtitle`, `cta-text`, `cta-href` são fornecidos
- **THEN** o componente SHALL exibir os valores fornecidos

### Requirement: Pattern decorativo inline no Shadow DOM
O componente SHALL exibir um padrão decorativo de círculos sobre o gradiente de fundo.

#### Scenario: SVG inline com currentColor
- **WHEN** o tema é alterado
- **THEN** os círculos do pattern SHALL usar `fill="currentColor"`, herdando `color: var(--color-btn-text)` do host — círculos claros (branco ou #CDD6F4) sobre o gradiente escuro, visíveis em qualquer tema

#### Scenario: Funcionamento cross-browser
- **WHEN** o SVG está inline no Shadow DOM (não via `url()`)
- **THEN** o `currentColor` SHALL herdar corretamente do elemento host, ao contrário de SVG carregado via `background-image`
