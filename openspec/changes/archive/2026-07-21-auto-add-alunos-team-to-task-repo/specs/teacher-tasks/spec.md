## MODIFIED Requirements

### Requirement: Teacher can create a task within a class
The system SHALL allow a teacher to create a task with a name, description, deadline, and a Gitea repository. The repository SHALL be private and SHALL have the organization's "alunos" team added as a read-only collaborator, regardless of whether the repository is new or existing.

#### Scenario: Task created with new private repo and team access
- **WHEN** teacher selects a class (org), fills task name, deadline, creates a **new** repo, and clicks "Criar Tarefa"
- **THEN** the system SHALL create the repo as private via `createOrgRepo()`
- **THEN** the system SHALL ensure the "alunos" team exists via `ensureAlunosTeam(org)`
- **THEN** the system SHALL add the "alunos" team to the repo via `addTeamRepo(teamId, org, repo)`
- **THEN** set topics `type-task` and optionally `deadline-YYYY-MM-DD`
- **THEN** the task SHALL appear in the task list

#### Scenario: Task created with existing repo and team access
- **WHEN** teacher selects a class (org), fills task name, deadline, selects an **existing** repo from the dropdown, and clicks "Criar Tarefa"
- **THEN** the system SHALL ensure the "alunos" team exists via `ensureAlunosTeam(org)`
- **THEN** the system SHALL add the "alunos" team to the repo via `addTeamRepo(teamId, org, repo)`
- **THEN** set topics `type-task` and optionally `deadline-YYYY-MM-DD`
- **THEN** the task SHALL appear in the task list
