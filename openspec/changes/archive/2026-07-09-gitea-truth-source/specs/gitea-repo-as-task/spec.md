## ADDED Requirements

### Requirement: Tasks are derived from repositories in the class organization
The system SHALL list repositories in a class's Gitea organization and present them as tasks, filtered by topic `type:task`.

#### Scenario: Tasks listed from Gitea repos
- **WHEN** teacher views tasks for a class
- **THEN** the system SHALL call `GET /api/v1/orgs/{org}/repos`, filter by topic `type:task`, and display each repo as a task

### Requirement: Task deadline stored as repo topic
When creating a task, the system SHALL add a topic `deadline:YYYY-MM-DD` to the repository.

#### Scenario: Deadline added as topic
- **WHEN** teacher creates a task with a deadline
- **THEN** the system SHALL create the repo via `createOrgRepo()`, then call `setRepoTopic(org, repo, "deadline:YYYY-MM-DD")` and `setRepoTopic(org, repo, "type:task")`

#### Scenario: Deadline parsed from topics
- **WHEN** the system reads a task's deadline
- **THEN** it SHALL look for a topic matching `deadline:*` and parse the date
