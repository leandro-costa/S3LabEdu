## MODIFIED Requirements

### Requirement: Org filter persists between pages via query param
The org filter selection on `tarefas.html` and `acompanhamento.html` SHALL persist when the teacher navigates between teacher pages, using a query parameter in the URL.

#### Scenario: Filter selection reflected in URL
- **WHEN** teacher selects an org in the filter dropdown
- **THEN** the URL SHALL update to include `?org=<org-name>` via `history.replaceState`

#### Scenario: Navigation preserves filter
- **WHEN** teacher navigates to another teacher page via the tab nav
- **THEN** the `?org=` query parameter SHALL be preserved in the navigation link

#### Scenario: Page loads with org param
- **WHEN** a teacher page loads with `?org=<org-name>` in the URL
- **THEN** the filter dropdown SHALL default to that org

### Requirement: Teacher can view task tracking per class from Gitea
The acompanhamento page SHALL display a task tracking overview (enrolled, accepted, delivered, pending counts) for a selected class org.

#### Scenario: Task tracking displayed for selected org
- **WHEN** teacher selects a class org on the acompanhamento page
- **THEN** the system SHALL load tasks for that org via `getTaskReposForOrg(org)`
- **THEN** for each task, SHALL show enrolled, accepted (forked), delivered (PR), and pending approval counts
