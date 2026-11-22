# app-header

## Purpose

Header fixo com logotipo, navegação e menu mobile via checkbox hack (CSS only).

## Requirements

### Requirement: Header com menu mobile via checkbox hack
O componente `<app-header>` SHALL exibir header fixo com logotipo, navegação e menu mobile usando apenas CSS (checkbox hack).

#### Scenario: Header renderizado
- **WHEN** `<app-header>` é inserido no DOM
- **THEN** ele SHALL conter link de logotipo "NovaCasa" e `<nav>` com links para as seções

#### Scenario: Menu mobile via checkbox hack
- **WHEN** a viewport é menor que 768px
- **THEN** um `<label>` hamburger (☰) SHALL aparecer, vinculado a um `<input type="checkbox" hidden>`
- **WHEN** o checkbox está `:checked`
- **THEN** o `<nav>` SHALL ser exibido via CSS (`#menu-toggle:checked ~ nav { display: flex }`)

#### Scenario: Fechar menu ao clicar em link
- **WHEN** o usuário clica em um link no mobile
- **THEN** o checkbox SHALL ser desmarcado (via onclick ou label), fechando o menu

### Requirement: Fundo adaptável ao tema
O fundo do header SHALL usar `--color-header-bg` em vez de cor fixa.

#### Scenario: Tema claro
- **WHEN** o tema é brown, blue ou green
- **THEN** o fundo SHALL ser `rgba(255,255,255,0.97)`

#### Scenario: Tema escuro
- **WHEN** o tema é dark
- **THEN** o fundo SHALL ser `rgba(30,30,46,0.97)` (mesmo tom de `--color-bg`)

### Requirement: Ordem theme-picker antes do hambúrguer
- **WHEN** o header é renderizado
- **THEN** `<ui-theme-picker>` SHALL vir antes do `<label>` hambúrguer no DOM
