## ADDED Requirements

### Requirement: Teacher can view issue count per student fork
The task detail page SHALL display the count of open and total issues created by the teacher in each student's fork repository.

#### Scenario: Issue count shown for students with fork
- **WHEN** the task detail page renders a student who has forked the task repo
- **THEN** the system SHALL call `listRepoIssues(studentOwner, forkName)` to fetch all issues
- **THEN** the page SHALL display "open/total" (e.g., "2/5") in the Issues column
- **THEN** open count SHALL be the number of issues with state `"open"`
- **THEN** total count SHALL be all issues regardless of state

#### Scenario: No issues in fork repo
- **WHEN** the student's fork repo has no issues
- **THEN** the cell SHALL display "0/0"

#### Scenario: Student without fork
- **WHEN** a student has not forked the task repo
- **THEN** the cell SHALL display "-"
