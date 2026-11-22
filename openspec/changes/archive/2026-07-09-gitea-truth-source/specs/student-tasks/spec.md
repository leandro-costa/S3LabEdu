## MODIFIED Requirements

### Requirement: Student dashboard shows enrolled classes
(Behavior unchanged, but enrollment is now determined by "alunos" team membership instead of localStorage.)

#### Scenario: Enrolled classes displayed
- **WHEN** student accesses the dashboard
- **THEN** the system SHALL check if the student is a member of the "alunos" team in any org; if yes, display those orgs as enrolled classes

### Requirement: Student can view available tasks
(Behavior unchanged, but tasks are now read from repos in the class org.)

#### Scenario: Available tasks listed
- **WHEN** student views tasks for a class
- **THEN** the system SHALL list repositories in the class's Gitea organization with topic `type:task` that the student has not yet forked

### Requirement: Fork detection uses checkFork per task repo
The system SHALL detect student acceptances by calling `checkFork()` for each task repo, not by scanning org repos for forks (forks live in the student's personal namespace, not inside the org).

#### Scenario: Accepted tasks detected via checkFork
- **WHEN** the system checks which tasks a student has accepted
- **THEN** it SHALL iterate each task repo in the class org, fetch its forks via `GET /api/v1/repos/{org}/{repo}/forks`, and find the fork owned by the student

### Requirement: Minhas-tarefas works without org membership
The system SHALL detect a student's accepted tasks even when the student is not a member of the class org, by listing the student's own repos and inspecting fork parents.

#### Scenario: Accepted tasks from personal repos
- **WHEN** student accesses "Minhas Tarefas"
- **THEN** the system SHALL call `listUserRepos()` (`GET /api/v1/user/repos`), filter for repos where `r.fork === true && r.owner.login === giteaUser`, and verify the parent repo has topic `type:task`

### Requirement: Student can view commit count per accepted task
The system SHALL display the number of commits made to a fork since its creation.

#### Scenario: Commit count shown
- **WHEN** student views accepted tasks
- **THEN** the system SHALL call `listCommits(giteaUser, repoName, forkCreatedAt)` and display the commit count in a "Commits" column, using the `ui-status-badge` component with format `N commits`

### Requirement: Student can accept a task
(Unchanged — forks a repo using the student's own OAuth token.)

#### Scenario: Task accepted
- **WHEN** student clicks "Aceitar" on a task
- **THEN** the system SHALL fork the task repo into the student's namespace; the fork alone counts as acceptance
