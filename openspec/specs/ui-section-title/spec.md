# ui-section-title

## Purpose

Título de seção padronizado com subtítulo opcional e linha decorativa.

## Requirements

### Requirement: Título de seção padronizado
O componente `<ui-section-title>` SHALL exibir um título e subtítulo estilizados com linha decorativa abaixo.

#### Scenario: Título e subtítulo
- **WHEN** `<ui-section-title title="Serviços" subtitle="Nossas soluções">` é usado
- **THEN** o heading "Serviços" SHALL ser exibido com linha decorativa `::after`, seguido do parágrafo "Nossas soluções"

#### Scenario: Subtítulo opcional
- **WHEN** apenas `title` é fornecido
- **THEN** apenas o título SHALL ser exibido, sem subtítulo
