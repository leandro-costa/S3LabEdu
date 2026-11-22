# Student Tasks

## Purpose
Student-facing pages for viewing enrolled classes, available tasks, and accepted tasks with delivery status.

## Requirements

### Requirement: Student authenticates via OAuth
The system SHALL use Gitea OAuth for student authentication. The student's email and Gitea username are stored from the OAuth callback.

#### Scenario: Student authenticated
- **WHEN** student logs in via OAuth
- **THEN** the system SHALL store `student_email` and `student_gitea_user` from the Gitea user info
- **THEN** the student SHALL be redirected to the dashboard

### Requirement: Student can view enrolled classes from org membership
The system SHALL display the Gitea organizations the student is a member of as their enrolled classes.

#### Scenario: Enrolled classes listed
- **WHEN** student loads the dashboard
- **THEN** the system SHALL call `GET /api/v1/user/orgs` to find organizations
- **THEN** each org SHALL be shown with name and number of active (not past deadline) tasks

### Requirement: Student can view available tasks from repos
The system SHALL display tasks (repos with `type-task` topic) from the student's orgs that the student has not yet forked.

#### Scenario: Available tasks listed
- **WHEN** student views the available tasks section
- **THEN** the system SHALL call `listOrgRepos(org)` and `getRepoTopics(org, repo)` for each org
- **THEN** repos with `type-task` topic SHALL be shown with repo name, deadline, and an "Aceitar" button
- **THEN** the repo name SHALL be displayed as plain text only — no clickable link to the original repository
- **THEN** repos already forked by the student SHALL be excluded — detected by calling `checkFork(org, repo, giteaUser)` per task repo, using a compound key `${org}/${repo}` to distinguish tasks with the same name in different classes
- **THEN** the same task name in different classes SHALL be treated as separate tasks

### Requirement: Student can accept a task by forking
The system SHALL allow a student to accept a task by forking the repo using their own OAuth token.

#### Scenario: Task accepted from dashboard
- **WHEN** student clicks "Aceitar" on an available task
- **THEN** the system SHALL call `createFork(owner, repo)` using the student's own token
- **THEN** the fork SHALL be the acceptance record

### Requirement: Student can view accepted tasks without org membership
The system SHALL detect a student's accepted tasks even when the student is not a member of the class org, by listing the student's own repos and inspecting fork parents.

#### Scenario: Accepted tasks from personal repos
- **WHEN** student accesses the dashboard
- **THEN** the system SHALL call `listUserRepos()` (`GET /api/v1/user/repos`), filter for repos where `r.fork === true && r.owner.login === giteaUser`, and verify the parent repo has topic `type-task`
- **THEN** for each fork, display the parent repo name, deadline, fork link, and status
- **THEN** multiple accepted tasks with the same repo name from different classes SHALL all be displayed

### Requirement: Student can view commit count per accepted task
The system SHALL display the number of commits made to a fork since its creation.

#### Scenario: Commit count shown
- **WHEN** student views the accepted tasks section of the dashboard
- **THEN** the system SHALL call `listCommits(giteaUser, repoName, forkCreatedAt)` and display the commit count in a "Commits" column, using the `ui-status-badge` component with format `N commits`

### Requirement: Accepted tasks show delivery status
The system SHALL display delivery status per accepted task.

#### Scenario: Status determined by fork + PR
- **WHEN** student views the accepted tasks section of the dashboard
- **THEN** for each fork, check for PRs to the original repo
- **THEN** display status as:
  - "Entregue" - PR exists from the fork
  - "Aceita" - fork exists without PR
- **THEN** show a link to create a PR if none exists

### Requirement: Student can see collection status per task
The student's accepted tasks section on the dashboard SHALL display whether a collection tag exists on the fork and the date of the most recent collection.

#### Scenario: Collection badge shown
- **WHEN** the student views accepted tasks on the dashboard
- **THEN** for each fork, the system SHALL call `listRepoTags(studentUser, forkName)`
- **THEN** if any tag starting with `coleta-` exists
- **THEN** the system SHALL show the most recent collection date in a "Coleta" column

#### Scenario: No collection indicator
- **WHEN** no tag starting with `coleta-` exists on the fork
- **THEN** the system SHALL display "-" in the "Coleta" column

### Requirement: Student navigation has a single dashboard page
The student area SHALL have a single dashboard page combining enrolled classes, available tasks, and accepted tasks; the standalone "Minhas Tarefas" page SHALL redirect to the dashboard.

#### Scenario: Single student tab in navigation
- **WHEN** the student header renders
- **THEN** the student tab navigation SHALL show a single "Dashboard" tab pointing to `dashboard.html`

#### Scenario: Old tasks page redirects
- **WHEN** a student opens `minhas-tarefas.html`
- **THEN** the system SHALL redirect to `dashboard.html` (e.g., via meta refresh, same pattern as `index.html`)

#### Scenario: Dashboard shows all task sections
- **WHEN** student loads `dashboard.html`
- **THEN** the page SHALL show three sections: "Minhas Turmas", "Tarefas Disponíveis" (available, not yet forked), and "Tarefas Aceitas" (accepted forks with status, commits, and collection date)

### Requirement: Student data uses Gitea as source of truth
The system SHALL NOT store enrollments or acceptances in localStorage as source of truth. localStorage MAY be used as cache.
