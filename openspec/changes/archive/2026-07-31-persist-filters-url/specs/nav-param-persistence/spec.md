## REMOVED Requirements

### Requirement: Tab-nav filters irrelevant parameters
**Reason**: O tab-nav agora propaga TODOS os query parameters, não apenas `?org=`. Cada página lê os params que precisa e ignora os demais. Essa restrição não faz mais sentido.
**Migration**: Use `URLSearchParams` nas páginas para ler os parâmetros relevantes.

## MODIFIED Requirements

### Requirement: Tab-nav preserves org parameter across navigation
The `tab-nav` component SHALL propagate all query parameters from the current URL to all navigation links, ensuring filters persist when the teacher switches between pages.

#### Scenario: Links include all params from current URL
- **WHEN** the page URL contains any query parameters (e.g., `?org=2026-inf-poo-2a&task=projeto-1`)
- **THEN** all tab-nav links SHALL include the full query string in their href

#### Scenario: Links update when any param changes
- **WHEN** the teacher selects an org or task in a filter dropdown
- **THEN** the tab-nav links SHALL update to reflect the new query parameters

#### Scenario: Links update on browser back/forward
- **WHEN** the teacher uses browser back/forward navigation
- **THEN** the tab-nav links SHALL update to match the current URL query parameters
