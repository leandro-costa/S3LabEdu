## MODIFIED Requirements

### Requirement: Student can accept a task by forking

The system SHALL allow an authenticated student to accept a task by forking the repo using their own OAuth token. After the fork, a delivery issue SHALL be created automatically.

#### Scenario: Task accepted
- **WHEN** authenticated student clicks "Aceitar Tarefa (Fork)"
- **THEN** the system SHALL call `createFork(owner, repo)` using the student's own token
- **THEN** after fork succeeds, the system SHALL call `createRepoIssue(student, forkName, taskName, deadline)` to create a delivery issue
- **THEN** display success message: fork is the acceptance record
