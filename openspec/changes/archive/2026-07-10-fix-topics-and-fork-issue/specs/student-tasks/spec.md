## MODIFIED Requirements

### Requirement: Student can accept a task by forking

The system SHALL allow a student to accept a task by forking the repo using their own OAuth token. After the fork, a delivery issue SHALL be created automatically in the student's fork.

#### Scenario: Task accepted from dashboard
- **WHEN** student clicks "Aceitar" on an available task
- **THEN** the system SHALL call `createFork(owner, repo)` using the student's own token
- **THEN** after fork succeeds, the system SHALL call `createRepoIssue(student, forkName, taskName, deadline)` to create a delivery issue
- **THEN** the fork SHALL be the acceptance record
