## ADDED Requirements

### Requirement: System creates delivery issue in fork upon task acceptance

When a student accepts a task by forking the repository, the system SHALL automatically create an issue in the student's fork to serve as a delivery record.

#### Scenario: Issue created after fork
- **WHEN** `createFork(owner, repo)` succeeds
- **THEN** the system SHALL create an issue in the student's fork via `POST /repos/{student}/{repo}/issues`
- **THEN** the issue SHALL have title `"Entrega: {taskName}"`
- **THEN** the issue SHALL have `due_date` matching the task's deadline (if one exists)
- **THEN** the issue SHALL have label `"entrega"`
- **THEN** the system SHALL display a success message to the student

#### Scenario: Issue creation fails gracefully
- **WHEN** the issue API call fails (e.g., label missing, rate limit)
- **THEN** the system SHALL NOT block the task acceptance — the fork is still valid
- **THEN** the system SHALL log the error but still show success to the student
