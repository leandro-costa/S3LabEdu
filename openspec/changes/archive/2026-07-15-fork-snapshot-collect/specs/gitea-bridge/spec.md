# Gitea Bridge

## ADDED Requirements

### Requirement: Gitea API module creates repo tags
The system SHALL provide a function to create a Git tag on a repository via the Gitea API.

#### Scenario: Tag created on repo
- **WHEN** `createRepoTag(owner, repo, tagName, target?)` is called
- **THEN** the function SHALL make `POST /api/v1/repos/{owner}/{repo}/tags` with `{ tag_name: tagName, target: target || 'HEAD' }`
- **THEN** it SHALL return the created tag data

#### Scenario: Tag creation fails on empty repo
- **WHEN** the target repo has no commits
- **THEN** the function SHALL catch the error and return `null` instead of throwing

### Requirement: Gitea API module lists repo tags
The system SHALL provide a function to list all tags on a repository via the Gitea API.

#### Scenario: Tags listed for repo
- **WHEN** `listRepoTags(owner, repo)` is called
- **THEN** the function SHALL make `GET /api/v1/repos/{owner}/{repo}/tags`
- **THEN** it SHALL return the array of tag objects, each containing `name` and `commit` fields
