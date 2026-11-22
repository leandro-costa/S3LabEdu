## ADDED Requirements

### Requirement: Lista de passos numerados
O componente `<ui-steps>` SHALL exibir passos com numeração automática (CSS counter).

#### Scenario: Três passos
- **WHEN** `<ui-steps>` contém 3 elementos com atributos `title` e `desc`
- **THEN** cada passo SHALL exibir número sequencial (1, 2, 3), título e descrição

#### Scenario: Responsivo
- **WHEN** viewport ≥ 769px
- **THEN** passos em 3 colunas
- **WHEN** viewport ≤ 768px
- **THEN** passos empilhados verticalmente

### Requirement: Step item
O elemento filho SHALL aceitar `title` e `desc` como atributos para conteúdo.

#### Scenario: Step com atributos
- **WHEN** um filho tem `title="Instalamos"` e `desc="Texto"`
- **THEN** o número, título e descrição SHALL ser exibidos
