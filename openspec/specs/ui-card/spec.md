# ui-card

## Purpose

Card genérico com modos serviço e depoimento, altura igual entre cards do mesmo row e ícones predefinidos.

## Requirements

### Requirement: Card genérico com modos serviço e depoimento
O componente `<ui-card>` SHALL exibir conteúdo de acordo com os atributos fornecidos, suportando dois modos: serviço (ícone + título + descrição) e depoimento (citação + autor + cidade).

#### Scenario: Modo serviço
- **WHEN** `<ui-card icon="shield" title="Segurança" description="Texto">` é usado
- **THEN** o componente SHALL exibir o ícone SVG correspondente, o título e a descrição

#### Scenario: Modo depoimento
- **WHEN** `<ui-card quote="Texto" author="Nome" city="Cidade">` é usado
- **THEN** o componente SHALL exibir a citação com aspas decorativas, nome do autor e cidade

#### Scenario: Efeito hover
- **WHEN** o usuário passa o mouse sobre o card
- **THEN** o card SHALL elevar-se (translateY negativo) com sombra mais pronunciada

### Requirement: Altura igual entre cards do mesmo row
- **WHEN** dois ou mais `<ui-card>` estão no mesmo row de um `<ui-grid>`
- **THEN** todos SHALL ter a mesma altura (`.card` usa `height: 100%` + `box-sizing: border-box`)

### Requirement: Padding do card
- **WHEN** o card é renderizado
- **THEN** o padding interno SHALL ser `32px 24px` (igual ao original)

### Requirement: Ícones predefinidos
O componente SHALL incluir SVGs embutidos para os ícones: light, shield, climate, curtain.

#### Scenario: Ícone light
- **WHEN** `icon="light"` é passado
- **THEN** o SVG de lâmpada/casa SHALL ser renderizado

#### Scenario: Fallback
- **WHEN** um valor de `icon` não reconhecido é passado
- **THEN** um ícone placeholder genérico SHALL ser exibido
