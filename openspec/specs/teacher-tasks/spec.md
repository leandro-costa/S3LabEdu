# Teacher Tasks

## Purpose
Teacher interface for creating tasks within classes and viewing task lists with enrollment links.

## Requirements

### Requirement: Task metadata stored as repo topics
Tasks SHALL be stored as Gitea repositories with topics indicating type and deadline.

#### Scenario: Topics set on task creation
- **WHEN** a task repo is created or selected
- **THEN** the system SHALL call `setRepoTopic(org, repo, 'type:task')`
- **THEN** if a deadline is provided, the system SHALL ALSO call `setRepoTopic(org, repo, 'deadline:YYYY-MM-DD')`

#### Scenario: Topics read from repo
- **WHEN** teacher views the task list
- **THEN** the system SHALL call `getRepoTopics(org, repo)` for each repo in the org
- **THEN** repos with `type:task` topic SHALL be recognized as tasks
- **THEN** the deadline SHALL be parsed from the `deadline:YYYY-MM-DD` topic if present

### Requirement: Teacher can create a task within a class
The system SHALL allow a teacher to create a task with a name, description, deadline, and a Gitea repository. The repository SHALL be private and SHALL have the organization's "alunos" team added as a read-only collaborator, regardless of whether the repository is new or existing. The repository's default branch SHALL be protected so that only the organization's "Owners" team can push to it, with the rule also applied to administrators.

#### Scenario: Task created with new private repo and team access
- **WHEN** teacher selects a class (org), fills task name, deadline, creates a **new** repo, and clicks "Criar Tarefa"
- **THEN** the system SHALL create the repo as private via `createOrgRepo()`
- **THEN** the system SHALL ensure the "alunos" team exists via `ensureAlunosTeam(org)`
- **THEN** the system SHALL add the "alunos" team to the repo via `addTeamRepo(teamId, org, repo)`
- **THEN** the system SHALL protect the default branch via `protectTaskBranch(org, repo)`, with push allowed only for the "Owners" team (creating the rule or updating it if it already exists)
- **THEN** set topics `type-task` and optionally `deadline-YYYY-MM-DD`
- **THEN** the task SHALL appear in the task list

#### Scenario: Task created with existing repo and team access
- **WHEN** teacher selects a class (org), fills task name, deadline, selects an **existing** repo from the dropdown, and clicks "Criar Tarefa"
- **THEN** the system SHALL ensure the "alunos" team exists via `ensureAlunosTeam(org)`
- **THEN** the system SHALL add the "alunos" team to the repo via `addTeamRepo(teamId, org, repo)`
- **THEN** the system SHALL protect the default branch via `protectTaskBranch(org, repo)`, with push allowed only for the "Owners" team (creating the rule or updating it if it already exists)
- **THEN** set topics `type-task` and optionally `deadline-YYYY-MM-DD`
- **THEN** the task SHALL appear in the task list

#### Scenario: Repo selection shows repos from org
- **WHEN** teacher opens the repo dropdown during task creation
- **THEN** the dropdown SHALL list all repositories from the class's Gitea organization that are not already marked as tasks

### Requirement: Teacher can view tasks per class from Gitea
The system SHALL display a list of all tasks (repos with `type:task` topic) in a selected class org.

#### Scenario: Task list displayed
- **WHEN** teacher selects a class on the tasks page
- **THEN** all repos with `type:task` topic in that org SHALL appear with name, deadline, and a copy button for the enrollment link
- **THEN** the enrollment link SHALL be `?owner={org}&repo={repo}` pointing to the task page

### Requirement: Tasks use Gitea repos as source of truth
Tasks SHALL NOT be stored in localStorage as source of truth. localStorage MAY be used as a read-through cache.

#### Scenario: Cache layer
- **WHEN** teacher loads the tasks page
- **THEN** the system SHALL fetch repos with topics from Gitea and write them to localStorage as cache
- **THEN** the page SHALL render from cache on subsequent loads

### Requirement: Org and task filters persist between pages via query param
The org and task filter selections on `tarefas.html` SHALL persist in the URL when the teacher navigates between teacher pages. All filter changes SHALL use `URLSearchParams.set/delete` to preserve other existing parameters.

#### Scenario: Filter selection reflected in URL
- **WHEN** teacher selects an org or task in a filter dropdown
- **THEN** the URL SHALL update via `history.replaceState` using `URLSearchParams.set/delete` to preserve other existing parameters
- **THEN** the `org-changed` event SHALL be dispatched to update tab-nav links

#### Scenario: Page loads with org and task params
- **WHEN** `tarefas.html` loads with `?org=<org>&task=<task>` in the URL
- **THEN** the org filter dropdown SHALL default to that org
- **THEN** the task filter dropdown SHALL default to that task

### Requirement: Teacher can view task tracking per class from Gitea
The acompanhamento page SHALL display a task tracking overview (enrolled, accepted, delivered, pending counts) for a selected class org.

#### Scenario: Task tracking displayed for selected org
- **WHEN** teacher selects a class org on the acompanhamento page
- **THEN** the system SHALL load tasks for that org via `getTaskReposForOrg(org)`
- **THEN** for each task, SHALL show enrolled, accepted (forked), delivered (PR), and pending approval counts

### Requirement: Teacher can collect fork snapshots from task list
The task list in `/teacher/tarefas.html` SHALL show a "Coletar" button for each task that, when clicked, creates snapshot tags on all student forks.

#### Scenario: Collect button visible per task
- **WHEN** the teacher views the task list
- **THEN** each task row SHALL include a "Coletar" button in the Ações column

#### Scenario: Collect operation shows progress
- **WHEN** the teacher clicks "Coletar"
- **THEN** the button SHALL be disabled and show a loading indicator
- **THEN** the system SHALL call `listForks`, then `createRepoTag` on each fork
- **THEN** after all forks are processed, the button SHALL re-enable
- **THEN** a brief message SHALL appear with the count of successful tags and failures
- **THEN** a "Copiar script de coleta" button SHALL appear

#### Scenario: Script generation uses fork data
- **WHEN** the collection completes with at least one success
- **THEN** the system SHALL store the tag name and list of { username, clone_url } for successful forks
- **THEN** clicking "Copiar script de coleta" SHALL generate a `.bat` script and copy it to clipboard

#### Scenario: Collect button disabled during operation
- **WHEN** a collect operation is in progress for a task
- **THEN** the button SHALL remain disabled until the operation completes

#### Scenario: Re-collect prompts confirmation
- **WHEN** the teacher clicks "Coletar" and a `lastTagName` with today's date is already stored for that task
- **THEN** the system SHALL show a confirm prompt before proceeding
- **THEN** if confirmed, the same tag name SHALL be reused

### Requirement: Student detail view shows full name
The student detail page (`detalhes-tarefa.html`) SHALL display each student's full name (from `full_name`) alongside their Gitea username.

#### Scenario: Student table shows full name
- **WHEN** the detail page renders enrolled students and fork owners
- **THEN** each row SHALL show the student's full name (or username if full_name is empty) followed by the Gitea username in parentheses

### Requirement: Teacher can filter tasks by name
The tasks page SHALL provide a dropdown to filter tasks by name, alongside the existing org filter.

#### Scenario: Task filter dropdown visible
- **WHEN** teacher views the tasks page
- **THEN** the page SHALL show a "Filtrar por Tarefa" dropdown similar to the acompanhamento page
- **THEN** the dropdown SHALL list all task names from the current org(s)

#### Scenario: Task filter filters the table
- **WHEN** teacher selects a task name in the filter dropdown
- **THEN** the table SHALL show only tasks matching that name
- **THEN** the URL SHALL update to include `?task=<task-name>`
- **THEN** if "Todas as tarefas" is selected, the `task` parameter SHALL be removed from the URL

### Requirement: Deleting a task checks for forks first
Before deleting a task repository, the system SHALL check how many students forked it and require a stronger confirmation when forks exist.

#### Scenario: Task without forks
- **WHEN** teacher clicks "Excluir" on a task whose repo has `forks_count === 0` (from `getRepo`)
- **THEN** the system SHALL ask a simple confirmation and, if confirmed, call `deleteRepo(org, repo)`

#### Scenario: Task with forks
- **WHEN** teacher clicks "Excluir" on a task whose repo has `forks_count > 0`
- **THEN** the system SHALL show a warning in the form area with the number of forks (including private forks the teacher cannot list), how many visible forks already have a `coleta-` tag, and the list of visible forks
- **THEN** the warning SHALL explain that deletion cannot be undone, removes the task from students, detaches the forks and stops tracking/collection
- **THEN** "Excluir definitivamente" SHALL stay disabled until the teacher types the repo name exactly

#### Scenario: Remove from task list instead of deleting
- **WHEN** teacher clicks "Remover da lista de tarefas" in the warning
- **THEN** the system SHALL remove the `type-task` topic via `removeRepoTopic(org, repo, 'type-task')`
- **THEN** the repo and its forks SHALL be kept, and the task SHALL no longer appear in task lists

#### Scenario: Fork check fails
- **WHEN** `getRepo` fails while checking forks
- **THEN** the deletion SHALL be cancelled and an error shown
