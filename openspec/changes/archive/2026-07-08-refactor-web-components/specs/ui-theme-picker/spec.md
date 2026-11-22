## ADDED Requirements

### Requirement: Seletor de temas de cor
O componente `<ui-theme-picker>` SHALL exibir um seletor visual de temas de cor e aplicar o tema selecionado ao documento.

#### Scenario: Bolinhas de cor renderizadas
- **WHEN** `<ui-theme-picker themes='[{"id":"blue","label":"Azul","color":"#1565C0"}]'>` é usado
- **THEN** o componente SHALL exibir uma bolinha circular com a cor correspondente

#### Scenario: Clique altera tema
- **WHEN** o usuário clica em uma bolinha de cor
- **THEN** `document.documentElement.dataset.theme` SHALL ser atualizado com o `id` do tema clicado

#### Scenario: Persistência em localStorage
- **WHEN** um tema é selecionado
- **THEN** o `id` do tema SHALL ser salvo em `localStorage` com chave `theme`

#### Scenario: Tema persistido ao recarregar
- **WHEN** a página é carregada e há um tema salvo em `localStorage`
- **THEN** o tema salvo SHALL ser aplicado automaticamente e a bolinha correspondente marcada como ativa

### Requirement: Quatro temas predefinidos
O componente SHALL definir quatro temas: marrom (padrão), azul, verde e escuro.

#### Scenario: Tema marrom (padrão)
- **WHEN** `data-theme` não está definido ou é `"brown"`
- **THEN** as cores primárias SHALL ser #5D4037 e #3E2723

#### Scenario: Tema azul
- **WHEN** `data-theme="blue"`
- **THEN** as cores SHALL ser #1565C0 (primária) e #0D47A1 (escura)

#### Scenario: Tema verde
- **WHEN** `data-theme="green"`
- **THEN** as cores SHALL ser #2E7D32 (primária) e #1B5E20 (escura)

#### Scenario: Tema escuro
- **WHEN** `data-theme="dark"`
- **THEN** o fundo SHALL ser escuro (#1E1E2E) com texto claro (#CDD6F4)
