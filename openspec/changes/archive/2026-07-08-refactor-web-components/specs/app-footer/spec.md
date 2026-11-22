## ADDED Requirements

### Requirement: Footer com navegação e copyright dinâmico
O componente `<app-footer>` SHALL exibir rodapé escuro com links de navegação e copyright com ano corrente.

#### Scenario: Footer renderizado
- **WHEN** `<app-footer>` é inserido no DOM
- **THEN** contém links de navegação e texto "© 2026 Nova Casa Automatizada. Todos os direitos reservados."

#### Scenario: Ano dinâmico
- **WHEN** o componente é carregado
- **THEN** o ano exibido SHALL ser o ano corrente via `new Date().getFullYear()`
