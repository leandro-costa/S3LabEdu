## MODIFIED Requirements

### Requirement: Student can accept a task by forking
The system SHALL allow an authenticated student to accept a task by forking the repo using their own OAuth token. Both the enrollment link page and the student dashboard SHALL use the shared `acceptTask(owner, repo, giteaUser, deadlineDate)` from `gitea-api.js`.

#### Scenario: Task accepted
- **WHEN** authenticated student clicks "Aceitar tarefa"
- **THEN** `acceptTask` SHALL create the fork `{org}-{login}-{repo}`, enable issues, add the class owners as write collaborators and create the delivery issue when there is a deadline
- **THEN** display success message: fork is the acceptance record

#### Scenario: Fork already exists (fallback)
- **WHEN** the fork API returns an error indicating the fork already exists
- **THEN** `acceptTask` SHALL return null and the page SHALL display that the task was already accepted
