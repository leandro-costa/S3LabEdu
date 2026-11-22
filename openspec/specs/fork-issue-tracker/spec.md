# Fork Issue Tracker

## Purpose
Ensure student fork repos have Issue Tracker and deadlines enabled so delivery issues can be created with due dates.

## Requirements

### Requirement: Issue Tracker and deadlines enabled on student fork repos
Student fork repos SHALL have the Issue Tracker and deadlines enabled after fork creation, regardless of the parent repo's settings.

#### Scenario: Fork created — enable issues and deadlines
- **WHEN** a student forks a task repo
- **THEN** the system SHALL call `enableRepoIssues(owner, forkName)` unconditionally
- **THEN** the PATCH SHALL set `has_issues: true` and `has_issue_deadlines: true`

### Requirement: Delivery issue created only when deadline exists
The automatic delivery issue SHALL only be created when the task repo has a deadline defined.

#### Scenario: Task with deadline
- **WHEN** a student forks a task repo that has a deadline
- **THEN** the system SHALL call `createDeliveryIssue(giteaUser, forkName, deadlineDate)`

#### Scenario: Task without deadline
- **WHEN** a student forks a task repo that has no deadline
- **THEN** the system SHALL NOT call `createDeliveryIssue`

### Requirement: Delivery issue has due_date
The delivery issue SHALL include the task deadline as its due date.

#### Scenario: due_date sent in full ISO format
- **WHEN** `createDeliveryIssue` is called with a deadline
- **THEN** the `due_date` SHALL be sent as `"YYYY-MM-DDTHH:MM:SS-03:00"` (ISO 8601 with timezone)
