## MODIFIED Requirements

### Requirement: Org filter persists between pages via query param
The org and task filter selections on `tarefas.html` SHALL persist in the URL when the teacher navigates between teacher pages. All filter changes SHALL use `URLSearchParams.set/delete` to preserve other existing parameters.

#### Scenario: Filter selection reflected in URL
- **WHEN** teacher selects an org or task in a filter dropdown
- **THEN** the URL SHALL update via `history.replaceState` using `URLSearchParams.set/delete` to preserve other existing parameters
- **THEN** the `org-changed` event SHALL be dispatched to update tab-nav links

#### Scenario: Page loads with org and task params
- **WHEN** `tarefas.html` loads with `?org=<org>&task=<task>` in the URL
- **THEN** the org filter dropdown SHALL default to that org
- **THEN** the task filter dropdown SHALL default to that task

## ADDED Requirements

### Requirement: Teacher can filter tasks by name
The tasks page SHALL provide a dropdown to filter tasks by name, alongside the existing org filter.

#### Scenario: Task filter dropdown visible
- **WHEN** teacher views the tasks page
- **THEN** the page SHALL show a "Filtrar por Tarefa" dropdown similar to the acompanhamento page
- **THEN** the dropdown SHALL list all task names from the current org(s)

#### Scenario: Task filter filters the table
- **WHEN** teacher selects a task name in the filter dropdown
- **THEN** the table SHALL show only tasks matching that name
- **THEN** the URL SHALL update to include `?task=<task-name>`
- **THEN** if "Todas as tarefas" is selected, the `task` parameter SHALL be removed from the URL
