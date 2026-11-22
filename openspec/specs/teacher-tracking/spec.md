# Teacher Tracking

## Purpose
Teacher dashboard for monitoring task progress across classes, with per-student fork and delivery status.

## Requirements

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

### Requirement: Teacher can view fork details per task
The system SHALL display all forks of a task repo with their approval status.

#### Scenario: Fork details per task
- **WHEN** teacher clicks "Detalhes" on a task row
- **THEN** the system SHALL display a list of all forks with:
  - Gitea username of fork owner
  - Link to the fork repository
  - Status: "Entregue" (PR exists), "Aceita" (fork owner is in "alunos" team), "Pendente" (fork owner not in team)
  - "Aprovar" button for pending forks

### Requirement: Dashboard shows pending approvals
The tracking dashboard SHALL identify forks by users who are NOT members of the "alunos" team and display them as pending.

#### Scenario: Pending approvals displayed
- **WHEN** teacher views the tracking dashboard
- **THEN** each task row SHALL show a count of forks where the fork owner is NOT in the "alunos" team
- **THEN** clicking "Detalhes" SHALL show pending forks with an "Aprovar" button

### Requirement: Teacher can approve pending students
The system SHALL allow the teacher to approve a pending fork owner by adding them to the "alunos" team.

#### Scenario: Student approved
- **WHEN** teacher clicks "Aprovar" on a pending fork
- **THEN** the system SHALL call `addTeamMember(teamId, username)`
- **THEN** the fork owner SHALL be added to the "alunos" team
- **THEN** the approval status SHALL update immediately

### Requirement: Teacher can fix access to private forks
The tracking dashboard SHALL provide a "Fixar Acesso" button per task row that grants the org owners write access to all private forks of that task repo, enabling data visibility for commits, tags and issues.

#### Scenario: Fix access button visible based on forks_count
- **WHEN** the tracking dashboard renders a task row
- **THEN** the system SHALL call `GET /repos/{org}/{repo}` to get the repository object with `forks_count`
- **THEN** the system SHALL call `listForks(org, repo)` to get accessible forks
- **THEN** the "Fixar Acesso" button SHALL be visible only if `forks_count > accessibleForks.length`
- **THEN** if the counts match, the button SHALL be hidden (all forks already accessible)

#### Scenario: Fix access discovers forks via org members
- **WHEN** the teacher clicks "Fixar Acesso" on a task row
- **THEN** the system SHALL list all org members via `GET /orgs/{org}/members`
- **THEN** for each member, the system SHALL check `GET /repos/{member}/{forkName}` where `forkName` is `{org}-{repo}`
- **THEN** members whose repo check succeeds SHALL be considered as having a fork

#### Scenario: Fix access grants org owners write access to forks
- **WHEN** forks are discovered
- **THEN** the system SHALL discover org owners via `listOrgOwners(org)`
- **THEN** for each fork (member/repo), the system SHALL call `addRepoCollaborator(member, forkName, owner.login, 'write')` for each org owner
- **THEN** the task data (commits, tags, collected) SHALL be re-read and displayed

#### Scenario: Fork discovery with correct name pattern
- **WHEN** building the fork name to check
- **THEN** the system SHALL use `forkName = \`${org}-${repo}\`` (e.g., `2026-inf-poo-2b-atividade-polimorfismo-banquete`)
- **THEN** the system SHALL skip org members whose login matches any org owner (e.g., `leandro`) since they are teachers, not students

#### Scenario: addRepoCollaborator failure is visible
- **WHEN** `addRepoCollaborator` fails for a given fork/owner pair
- **THEN** the system SHALL display a per-fork error message in the console
- **THEN** the system SHALL continue processing remaining forks
- **THEN** the button SHALL NOT show "✓ Fixado" unless all forks succeeded

### Requirement: Teacher tracking uses forkName for data fetches
The tracking dashboard SHALL use the compound fork name (`{org}-{repo}`) instead of the original repo name when fetching per-fork data (commits, tags, issues).

#### Scenario: Fork data fetches use correct fork name
- **WHEN** the tracking dashboard iterates over forks for data collection
- **THEN** the system SHALL use `listRepoTags(member, forkName)`, `countCommitsSince(member, forkName, date)`, etc.
- **THEN** `forkName` SHALL be `{org}-{repo}`

### Requirement: Only the fork owner's commits count
Commit counts — and the "Entregaram" (delivered) count derived from them — SHALL consider only commits whose Forgejo author is the fork owner (the student).

#### Scenario: Commits by other authors are ignored
- **WHEN** `countCommitsSince(owner, repo, since)` is called
- **THEN** it SHALL list all commits since `since` (paginating the API)
- **THEN** it SHALL count only commits where `author.login` equals the fork owner (case-insensitive)
- **THEN** commits by other users (e.g. teacher commits synced from the task repo) or whose e-mail is not linked to any account SHALL NOT be counted

#### Scenario: Delivered only with the student's own commits
- **WHEN** the tracking dashboard computes "Entregaram" for a task
- **THEN** a fork SHALL count as delivered only if it has at least one commit authored by its owner after the fork was created

### Requirement: Teacher can delete a student's fork from the detail modal
The system SHALL allow the teacher to delete a student's fork repository from the detail modal to enable re-acceptance with a fresh repo.

#### Scenario: Fork deleted from modal
- **WHEN** teacher clicks "Excluir" next to a student fork (enrolled or pending)
- **THEN** the system SHALL show a confirmation dialog, call `deleteRepo(username, repoName)` (`DELETE /api/v1/repos/{username}/{repo}`), and refresh the modal

#### Scenario: Delete button shown for enrolled students
- **WHEN** the detail modal lists an enrolled student who has a fork
- **THEN** the system SHALL show an "Excluir" button alongside their fork status

#### Scenario: Delete button shown for pending forks
- **WHEN** the detail modal lists a pending/unlinked fork
- **THEN** the system SHALL show both "Aprovar" and "Excluir" buttons in the action column

### Requirement: Tracking dashboard shows collection status
The tracking dashboard SHALL display a "Coleta" column per task showing how many forks have the snapshot tag.

#### Scenario: Collection column displayed per task
- **WHEN** teacher views the tracking dashboard
- **THEN** each task row SHALL include a "Coleta" column
- **THEN** the system SHALL iterate over all forks and call `listRepoTags(fork.owner.login, fork.name)` for each fork
- **THEN** forks with at least one tag starting with `coleta-` SHALL be counted as collected
- **THEN** the column SHALL display `X/Y` where X is collected forks and Y is total forks
- **THEN** if X equals Y, the count SHALL be followed by ✅
- **THEN** if X is less than Y, the count SHALL be followed by ⚠️
- **THEN** if no fork has a `coleta-` tag, the column SHALL display "—"

### Requirement: Enrollment count from Gitea team members
The tracking dashboard SHALL display the total number of students enrolled in each class by counting members of the "alunos" team.

#### Scenario: Enrollment count shown
- **WHEN** teacher views the tracking dashboard
- **THEN** each task row SHALL include a column showing how many students are in the "alunos" team for that org
