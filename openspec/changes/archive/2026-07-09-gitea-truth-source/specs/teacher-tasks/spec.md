## MODIFIED Requirements

### Requirement: Teacher can view tasks per class
(Behavior unchanged, but source of truth is now repos in the class's Gitea org.)

#### Scenario: Tasks listed for a class
- **WHEN** teacher selects a class
- **THEN** the system SHALL list repositories in the class's Gitea organization filtered by topic `type:task`

### Requirement: Task creation adds deadline topic
When a teacher creates a task, the system SHALL add the deadline as a repo topic.

#### Scenario: Task created with deadline topic
- **WHEN** teacher creates a task with a deadline
- **THEN** the system SHALL create the repo, then add topics `type:task` and `deadline:YYYY-MM-DD`
