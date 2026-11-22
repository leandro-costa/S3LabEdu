## MODIFIED Requirements

### Requirement: Enrollment link page requires authentication
The enrollment link page SHALL require the student to be authenticated (OAuth session) to access.

#### Scenario: Unauthenticated access redirected
- **WHEN** an unauthenticated user accesses an enrollment link
- **THEN** the system SHALL redirect to the student login page, preserving the enrollment link hash for return

### Requirement: Enrollment page reads task from Gitea repo
The enrollment link page SHALL read task information from the Gitea repository.

#### Scenario: Task info loaded from repo
- **WHEN** student accesses an enrollment link
- **THEN** the system SHALL look up the task's org and repo from the link hash, fetch repo details from Gitea API

### Requirement: Enrollment link detects existing fork
The enrollment link page SHALL check if the student already has a fork of the task repo before showing the enrollment form.

#### Scenario: Existing fork detected
- **WHEN** an authenticated student accesses an enrollment link and already has a fork of the task repo
- **THEN** the system SHALL call `checkFork(owner, repo, giteaUser)` and display a "Você já aceitou esta tarefa!" message with links to the Gitea repo and "Minhas Tarefas" page, instead of the enrollment form

### Requirement: Enrollment via link forks using student's token
When a student enrolls via the enrollment link, the fork SHALL be created using the student's own OAuth token.

#### Scenario: Student enrolled and accepted via fork
- **WHEN** student confirms enrollment
- **THEN** the system SHALL fork the task repo using the student's token; the fork IS the acceptance record
