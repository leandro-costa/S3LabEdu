## ADDED Requirements

### Requirement: Tab-nav preserves org parameter across navigation
The `tab-nav` component SHALL propagate the `?org=` query parameter to all navigation links, ensuring the selected class persists when the teacher switches between pages.

#### Scenario: Links include org from current URL
- **WHEN** the page URL contains `?org=<org-name>`
- **THEN** all tab-nav links SHALL include `?org=<org-name>` in their href

#### Scenario: Links update when org changes via dropdown
- **WHEN** the teacher selects an org in a filter dropdown
- **THEN** the tab-nav links SHALL update to reflect the new org parameter

#### Scenario: Links update on browser back/forward
- **WHEN** the teacher uses browser back/forward navigation
- **THEN** the tab-nav links SHALL update to match the current URL org parameter

### Requirement: Tab-nav filters irrelevant parameters
The `tab-nav` SHALL NOT propagate parameters other than `org` to navigation links.

#### Scenario: Only org propagated
- **WHEN** the URL contains `?org=2026-inf-poo-2a&repo=projeto-1`
- **THEN** tab-nav links SHALL only carry `?org=2026-inf-poo-2a`

### Requirement: detalhes-tarefa.html reads org not owner
The student detail page SHALL use `?org=` instead of `?owner=` as the parameter name for the organization/turma.

#### Scenario: Detail page reads org param
- **WHEN** `detalhes-tarefa.html` loads with `?org=<org>&repo=<repo>`
- **THEN** the system SHALL read the org from the `org` parameter
- **THEN** the system SHALL read the repo from the `repo` parameter
