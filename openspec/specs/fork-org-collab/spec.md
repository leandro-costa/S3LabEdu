# Fork Org Collab

## Purpose
Ensures professors (org owners) have read access to student forks of task repos, enabling the tracking dashboard to display commits, tags and issues. Uses individual collaborator addition with the student's token.

## Requirements

### Requirement: New forks add professors as collaborators
When a student forks a task repo, the system SHALL automatically discover the professors (Owners team members of the org) and add each as an individual collaborator with `read` permission on the fork, ensuring teachers can view commits, tags and issues.

#### Scenario: Professors added as collaborators after fork
- **WHEN** a student completes `createForkSafe(org, repo, forkName)`
- **THEN** the system SHALL list teams of the org via `listOrgTeams(org)`
- **THEN** the system SHALL find the "Owners" team
- **THEN** the system SHALL list members of the Owners team via `listTeamMembers(ownersTeamId)`
- **THEN** for each professor found, the system SHALL call `addRepoCollaborator(studentLogin, forkName, professorLogin, 'read')`

#### Scenario: Owners team not found
- **WHEN** the "Owners" team does not exist on the org
- **THEN** the system SHALL NOT throw an error
- **THEN** the system SHALL continue with post-fork processing normally

#### Scenario: Duplicate collaborator handled gracefully
- **WHEN** a professor is already a collaborator on the fork
- **THEN** the system SHALL NOT throw an error
- **THEN** the system SHALL continue processing remaining professors

### Requirement: addRepoCollaborator API function
The `gitea-api.js` module SHALL export a function `addRepoCollaborator(owner, repo, collaborator, permission)` that adds a user or org as a collaborator on a repository.

#### Scenario: Collaborator added via API
- **WHEN** `addRepoCollaborator(owner, repo, collaborator, 'read')` is called
- **THEN** the system SHALL make a `PUT /repos/{owner}/{repo}/collaborators/{collaborator}` request
- **THEN** the request body SHALL contain `{ permission: 'read' }`
