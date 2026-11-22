## ADDED Requirements

### Requirement: Issue Tracker enabled on student fork repos
Student fork repos SHALL have the Issue Tracker enabled after fork creation if it is currently disabled.

#### Scenario: Fork created with Issue Tracker disabled
- **WHEN** a student forks a task repo
- **AND** the fork response has `has_issues: false`
- **THEN** the system SHALL call `enableRepoIssues(owner, forkName)` to enable it

#### Scenario: Fork created with Issue Tracker already enabled
- **WHEN** a student forks a task repo
- **AND** the fork response has `has_issues: true`
- **THEN** the system SHALL NOT call `enableRepoIssues`

### Requirement: Delivery issue created only when deadline exists
The automatic delivery issue SHALL only be created when the task repo has a deadline defined.

#### Scenario: Task with deadline
- **WHEN** a student forks a task repo that has a deadline
- **THEN** the system SHALL call `createDeliveryIssue(giteaUser, forkName, deadlineDate)`

#### Scenario: Task without deadline
- **WHEN** a student forks a task repo that has no deadline
- **THEN** the system SHALL NOT call `createDeliveryIssue`
