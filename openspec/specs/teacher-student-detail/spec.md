# Teacher Student Detail

## Purpose
Standalone page for teachers to view per-task student details, including fork status, commit activity, and actions (approve enrollment, delete fork).

## Requirements

### Requirement: Page loads student detail for a given task
The page SHALL accept `repoOwner` and `repoName` as URL query parameters and load the corresponding forks, enrolled students, PR status, and commit counts from Gitea.

#### Scenario: Detail page loaded with valid parameters
- **WHEN** `?owner=ads-2025-1&repo=atividade-1` is present in the URL
- **THEN** the page SHALL call `listForks(owner, repo)` to get all forks
- **THEN** the page SHALL call `ensureAlunosTeam(owner)` and `listTeamMembers(teamId)` for enrolled students
- **THEN** the page SHALL call `checkPullRequest(owner, repo, username)` for each fork owner
- **THEN** the page SHALL call `countCommitsSince(username, forkName, createdAt)` for each fork owner
- **THEN** the page SHALL render a table with Gitea username, repository link, commit count, status, and action buttons

#### Scenario: Invalid or missing parameters
- **WHEN** `owner` or `repo` query parameters are missing
- **THEN** the page SHALL display an error message and not attempt API calls

### Requirement: Teacher can approve a non-enrolled fork owner
The page SHALL provide an "Aprovar" button for each fork owner who is not yet a member of the "alunos" team.

#### Scenario: Approve clicked
- **WHEN** teacher clicks "Aprovar" for a student
- **THEN** the page SHALL call `addTeamMember(teamId, username)`
- **THEN** the button SHALL update to show "✓ Aprovado" and become disabled
- **THEN** the row background SHALL return to normal (non-warning)

### Requirement: Teacher can delete a fork
The page SHALL provide an "Excluir" button for each fork.

#### Scenario: Delete clicked
- **WHEN** teacher clicks "Excluir" for a fork
- **THEN** the page SHALL show a confirmation dialog
- **THEN** if confirmed, the page SHALL call `deleteRepo(username, forkName)`
- **THEN** the row SHALL be removed or marked as deleted

### Requirement: Student detail shows collection status per fork
The student detail page SHALL display a "Coleta" column per fork indicating whether the fork has a collection tag.

#### Scenario: Collection badge shown per student
- **WHEN** the teacher views the student detail page
- **THEN** for each fork, the system SHALL call `listRepoTags(username, forkName)` alongside existing commit and issue fetches
- **THEN** if a tag starting with `coleta-` exists, the column SHALL display ✅
- **THEN** if no such tag exists, the column SHALL display ✗

### Requirement: Page shows summary counts
The page SHALL display a summary line with counts of enrolled students, total forks, and pending approvals.

#### Scenario: Summary displayed
- **WHEN** the page loads data successfully
- **THEN** it SHALL show "Matriculados: N | Forkaram: M | Pendentes de Aprovação: P"
