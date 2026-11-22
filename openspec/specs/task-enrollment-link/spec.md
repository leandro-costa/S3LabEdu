# Task Enrollment Link

## Purpose
Public page accessed via a unique hash link that allows students to view task details and enroll in one step.

## Requirements

### Requirement: Task enrollment page requires authentication
The system SHALL require the student to be authenticated via OAuth to access the task enrollment page.

#### Scenario: Unauthenticated access
- **WHEN** a student (or anyone) accesses the task page without being logged in
- **THEN** the system SHALL display a message: "Você precisa estar logado para aceitar esta tarefa."
- **THEN** the system SHALL provide a link to the login page

### Requirement: Task enrollment page reads from Gitea
The system SHALL look up the task by `?owner={org}&repo={repo}` query parameters and verify it via Gitea API.

#### Scenario: Task page displays correctly
- **WHEN** a student accesses `/academic/task/?owner={org}&repo={repo}`
- **THEN** the system SHALL call `getRepoTopics(org, repo)` to verify the repo has `type:task` topic
- **THEN** the page SHALL display the repo name, org name, deadline (from topics), and the authenticated student's info

#### Scenario: Invalid link
- **WHEN** the owner or repo parameter is missing, or the repo does not have `type:task` topic
- **THEN** the system SHALL display "Link inválido" or "Tarefa não encontrada"

### Requirement: Enrollment link detects existing fork before showing form
The enrollment link page SHALL check if the student already has a fork of the task repo before showing the enrollment form.

#### Scenario: Existing fork detected
- **WHEN** an authenticated student accesses an enrollment link and already has a fork of the task repo
- **THEN** the system SHALL call `checkFork(owner, repo, giteaUser)` and display a "Você já aceitou esta tarefa!" message with links to the Gitea repo and "Minhas Tarefas" page, instead of the enrollment form

### Requirement: Student can accept a task by forking
The system SHALL allow an authenticated student to accept a task by forking the repo using their own OAuth token.

#### Scenario: Task accepted
- **WHEN** authenticated student clicks "Aceitar Tarefa (Fork)"
- **THEN** the system SHALL call `createFork(owner, repo)` using the student's own token
- **THEN** display success message: fork is the acceptance record
- **THEN** no data is written to localStorage for enrollment or acceptance

#### Scenario: Fork already exists (fallback)
- **WHEN** the fork API returns an error indicating the fork already exists (unlikely, as pre-check happens first)
- **THEN** the system SHALL detect this and display "Você já possui um fork desta tarefa."

### Requirement: Enrollment link format
The system SHALL generate enrollment links using `?owner={org}&repo={repo}` format instead of hash-based links.

#### Scenario: Link copied
- **WHEN** teacher copies the enrollment link for a task
- **THEN** the link SHALL be in format `{base}/task/?owner={org}&repo={repo}`
