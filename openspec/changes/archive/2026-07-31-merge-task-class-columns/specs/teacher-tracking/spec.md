## MODIFIED Requirements

### Requirement: Teacher tracking dashboard with filters
The system SHALL provide a dashboard showing all tasks across all class orgs with filters for org and task, both persisted in the URL.

#### Scenario: Dashboard overview displayed
- **WHEN** teacher accesses the tracking dashboard
- **THEN** the system SHALL show a filterable table with a merged "Tarefa" column (task name + class name + repo link), number of students enrolled (from "alunos" team members), number who accepted (from forks), number who delivered (from PRs), and pending approvals
- **THEN** the "Tarefa" column SHALL display the task name in bold, the org name below it, and a link to the Gitea repository (`{giteaUrl}/{org}/{repo}`)
- **THEN** the system SHALL read `?org=` and `?task=` from the URL to pre-select filters

#### Scenario: Org filter update preserves other params
- **WHEN** teacher selects an org in the filter dropdown
- **THEN** the URL SHALL update via `URLSearchParams.set/delete` to preserve the `?task=` parameter
- **THEN** the `org-changed` event SHALL be dispatched

#### Scenario: Task filter reflected in URL
- **WHEN** teacher selects a task in the filter dropdown
- **THEN** the URL SHALL update via `URLSearchParams.set` to include `?task=<task-name>`
- **THEN** if "Todas as tarefas" is selected, the `task` parameter SHALL be removed from the URL
