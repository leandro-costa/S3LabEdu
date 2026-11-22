# Nav Param Persistence

## Purpose
Ensures all filter selections (org, task, etc.) persist in the URL when teachers navigate between pages, via reactive tab-nav link updates that propagate all query parameters.

## Requirements

### Requirement: Tab-nav preserves all query parameters across navigation
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

### Requirement: Shared class (org) filter on teacher pages
The teacher pages `turmas.html`, `tarefas.html` and `acompanhamento.html` SHALL render the class filter combo through the shared module `components/org-filter.js` (`getSelectedOrg`, `setSelectedOrg`, `orgSelectHtml`).

#### Scenario: Turmas page has the class filter
- **WHEN** the teacher opens `turmas.html` and has at least one class
- **THEN** a "Filtrar por Turma" combo SHALL be shown with "Todas as turmas" and each owned org
- **THEN** the class table SHALL show only the selected org (or all orgs when "Todas as turmas" is selected)

#### Scenario: New class becomes the selected class
- **WHEN** the teacher creates a class on `turmas.html`
- **THEN** the new org SHALL become the selected class

#### Scenario: Selection resolved from URL, then session
- **WHEN** a teacher page loads
- **THEN** the selected class SHALL be the `?org=` param if present, otherwise the value stored in `sessionStorage` (`teacher_selected_org`), otherwise "all"
- **THEN** a stored value SHALL be written back to the URL so tab-nav links carry it
- **THEN** a value that is not one of the teacher's orgs SHALL fall back to "all"

#### Scenario: Changing the class clears the task filter
- **WHEN** the teacher changes the class combo
- **THEN** the `org` param and the stored value SHALL be updated
- **THEN** the `task` param SHALL be removed, since it belongs to the previous class

#### Scenario: Class students page remembers the class
- **WHEN** `turma-alunos.html` loads with `?org=<org>`
- **THEN** that org SHALL be stored as the selected class

### Requirement: detalhes-tarefa.html reads org and task params
The student detail page SHALL use `?org=` for the organization/turma and `?task=` for the task repo name.

#### Scenario: Detail page reads org and task params
- **WHEN** `detalhes-tarefa.html` loads with `?org=<org>&task=<task>`
- **THEN** the system SHALL read the org from the `org` parameter
- **THEN** the system SHALL read the task repo name from the `task` parameter

#### Scenario: Detail page back link preserves all params
- **WHEN** `detalhes-tarefa.html` renders a "Voltar" link to `acompanhamento.html`
- **THEN** the link SHALL preserve all query parameters from the current URL (e.g., `?org=X&task=Y`)
- **THEN** the `task` parameter SHALL be removed (not relevant to the list view)
