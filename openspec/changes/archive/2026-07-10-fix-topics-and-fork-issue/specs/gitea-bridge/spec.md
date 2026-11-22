## MODIFIED Requirements

### Requirement: Gitea API module manages repo topics

#### Scenario: Topics read from repo object
- **WHEN** `getRepoTopics(owner, repo)` is called
- **THEN** the function SHALL call `GET /api/v1/repos/{owner}/{repo}` (repo object) instead of the `/topics` endpoint
- **THEN** the function SHALL return the `topics` array from the repo object, or `[]` if missing
- **THEN** the function SHALL NOT produce any console error for repos without topics

## ADDED Requirements

### Requirement: Gitea API module creates repository issues

The system SHALL provide a function to create an issue in a repository.

#### Scenario: Issue created
- **WHEN** `createRepoIssue(owner, repo, title, body, dueDate)` is called
- **THEN** the function SHALL call `POST /repos/{owner}/{repo}/issues` with `title`, `body`, `due_date` parameters
- **THEN** the function SHALL return the created issue data
