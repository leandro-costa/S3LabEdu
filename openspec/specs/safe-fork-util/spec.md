# safe-fork-util

## Purpose

Provides safe fork and delivery-issue helpers (`createForkSafe`, `createDeliveryIssue`) to centralize error handling around fork creation and issue generation, avoiding duplication across pages that handle student deliveries.

## Requirements

### Requirement: createForkSafe wrapper
The system SHALL provide a `createForkSafe(owner, repo)` function that wraps `createFork()` and returns the fork data when successful, or returns `null` if the fork already exists.

#### Scenario: Successful fork creation
- **WHEN** `createForkSafe('2024-INF-POO', 'task-01')` is called and the fork does not exist
- **THEN** creates the fork via `createFork()` and returns the fork data

#### Scenario: Fork already exists
- **WHEN** `createForkSafe('2024-INF-POO', 'task-01')` is called and the fork already exists
- **THEN** returns `null`
- **AND** does NOT throw an error

### Requirement: createDeliveryIssue helper
The system SHALL provide a `createDeliveryIssue(giteaUser, repo, deadlineDate)` function that creates an auto-generated delivery issue on the forked repo.

#### Scenario: Creates issue with deadline
- **WHEN** `createDeliveryIssue('student1', 'task-01', '2024-12-15')` is called
- **THEN** calls `createRepoIssue` with title `'Entrega: task-01'`
- **AND** body `'Issue de entrega automática.\n\nPrazo: 2024-12-15'`
- **AND** due_date set to `'2024-12-15T23:59:59-03:00'`
- **AND** errors are silently caught (fire-and-forget)
