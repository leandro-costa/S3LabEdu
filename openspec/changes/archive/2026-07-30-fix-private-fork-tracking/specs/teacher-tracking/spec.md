## ADDED Requirements

### Requirement: Teacher can fix access to private forks
The tracking dashboard SHALL provide a "Fixar Acesso" button per task row that grants the org owners read access to all private forks of that task repo, enabling data visibility for commits, tags and issues.

#### Scenario: Fix access button visible
- **WHEN** a task has forks
- **THEN** the task row SHALL include a "Fixar Acesso" button in the Ações column

#### Scenario: Fix access grants org owners access to forks
- **WHEN** the teacher clicks "Fixar Acesso" on a task row
- **THEN** the system SHALL list all forks via `listForks(org, repo)`
- **THEN** for each fork, the system SHALL call `addTeamRepo(ownersTeamId, fork.owner.login, fork.name)` where `ownersTeamId` is the implicit Owners team of the org
- **THEN** the task data (commits, tags, collected) SHALL be re-read and displayed

#### Scenario: Owners team resolved from org
- **WHEN** "Fixar Acesso" is clicked
- **THEN** the system SHALL find the "Owners" team of the org via `listOrgTeams(org)`
- **THEN** the system SHALL use that team's ID for the `addTeamRepo` call

#### Scenario: Already accessible fork skipped
- **WHEN** a fork already has the org as collaborator
- **THEN** the `addTeamRepo` call SHALL fail silently (already exists)
- **THEN** the system SHALL continue processing remaining forks
