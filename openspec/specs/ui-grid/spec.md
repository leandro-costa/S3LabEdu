# ui-grid

## Purpose

Grid CSS responsivo parametrizável para disposição de filhos em colunas configuráveis.

## Requirements

### Requirement: Grid responsivo parametrizável
O componente `<ui-grid>` SHALL exibir seus filhos em um grid CSS responsivo com número de colunas configurável via atributo.

#### Scenario: Quatro colunas
- **WHEN** `<ui-grid cols="4">` contém 4 filhos
- **THEN** eles SHALL ser dispostos em 4 colunas (viewport ≥ 769px)

#### Scenario: Duas colunas (padrão)
- **WHEN** a viewport está entre 481px e 768px E `responsive` não é "stack-tablet"
- **THEN** os filhos SHALL ser dispostos em 2 colunas

#### Scenario: Uma coluna (padrão)
- **WHEN** a viewport é ≤ 480px
- **THEN** os filhos SHALL ser dispostos em 1 coluna

#### Scenario: stack-tablet (depoimentos)
- **WHEN** `responsive="stack-tablet"` E viewport ≤ 768px
- **THEN** os filhos SHALL ir diretamente para 1 coluna (pula o estado de 2 colunas)

#### Scenario: Colunas padrão
- **WHEN** o atributo `cols` não é informado
- **THEN** o padrão SHALL ser 3 colunas
