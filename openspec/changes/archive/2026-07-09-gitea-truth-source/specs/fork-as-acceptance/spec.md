## ADDED Requirements

### Requirement: Task acceptance is determined by fork existence
The system SHALL consider a task accepted when a fork of the task's repository exists in a student's namespace, regardless of team membership.

#### Scenario: Fork counted as acceptance (dashboard)
- **WHEN** the system checks if a student accepted a task from the dashboard
- **THEN** it SHALL call `checkFork(orgUsername, repoName, giteaUser)` per task repo (using `GET /api/v1/repos/{owner}/{repo}/forks` internally) to find the fork owned by the student

#### Scenario: Fork counted as acceptance (minhas-tarefas, independent of org membership)
- **WHEN** the system lists all accepted tasks
- **THEN** it SHALL call `listUserRepos()` (`GET /api/v1/user/repos`), filter for repos where `r.fork === true && r.owner.login === giteaUser`, and for each fork inspect `fork.parent` to verify the parent has topic `type:task`

### Requirement: Accepting a task forks the repository
When a student accepts a task, the system SHALL fork the task's repository into the student's Gitea namespace using the student's own token (no `Sudo`).

#### Scenario: Task accepted via fork creation
- **WHEN** student clicks "Aceitar" on a task
- **THEN** the system SHALL call `POST /api/v1/repos/{owner}/{repo}/forks` to create a fork in the student's namespace

### Requirement: Fork without team membership is pending approval
If a fork exists from a user who is NOT a member of the "alunos" team, the system SHALL display it as "Pendente de Aprovação" in the teacher's dashboard.

#### Scenario: Unlinked fork detected
- **WHEN** the system lists forks of a task repo
- **THEN** it SHALL check each fork owner's membership in the "alunos" team; if not a member, show with "Aprovar" option

#### Scenario: Teacher approves unlinked fork
- **WHEN** teacher clicks "Aprovar" on a pending fork
- **THEN** the system SHALL call `addTeamMember(teamId, username)` to add the student to the "alunos" team

### Requirement: Fork without PR is "Aceita", fork with PR is "Entregue"
The system SHALL distinguish between accepted (fork exists) and delivered (fork has open pull request to original repo).

#### Scenario: Status determined by fork + PR
- **WHEN** the system checks a student's delivery status
- **THEN** if only a fork exists, status SHALL be "Aceita"; if a pull request from the fork to the original repo exists, status SHALL be "Entregue"
