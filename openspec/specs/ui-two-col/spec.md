# ui-two-col

## Purpose

Layout de duas colunas lado a lado com slots image/text e suporte a reversão.

## Requirements

### Requirement: Layout duas colunas com slots
O componente `<ui-two-col>` SHALL exibir layout de duas colunas lado a lado com slots `image` (esquerda) e `text` (direita).

#### Scenario: Layout padrão
- **WHEN** `<ui-two-col>` é usado sem atributo `reverse`
- **THEN** o slot `image` SHALL ficar à esquerda e o slot `text` à direita

#### Scenario: Layout invertido
- **WHEN** o atributo `reverse` está presente
- **THEN** via CSS `:host([reverse])`, a ordem das colunas SHALL ser invertida

#### Scenario: Empilhamento mobile
- **WHEN** a viewport é ≤ 768px
- **THEN** as colunas SHALL empilhar-se verticalmente em 1 coluna
- **AND** com `reverse`, a imagem (primeira no Shadow DOM) SHALL aparecer no topo do empilhamento
