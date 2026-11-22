## ADDED Requirements

### Requirement: Teacher's classes are derived from Gitea organizations
The system SHALL list Gitea organizations where the authenticated teacher is owner and present them as classes.

#### Scenario: Classes listed from Gitea orgs
- **WHEN** teacher accesses the classes page
- **THEN** the system SHALL call `GET /api/v1/user/orgs`, filter by `permission: owner`, and display each org as a class

### Requirement: Creating an org also creates the "alunos" team
When a teacher creates a new Gitea organization (class), the system SHALL immediately create the "alunos" team within it.

#### Scenario: Team created after org
- **WHEN** teacher creates a new class
- **THEN** the system SHALL create the Gitea org via `createOrganization()`, then call `createOrgTeam(org, "alunos")` to create the team with read permission on org repos

### Requirement: Class description stored in org metadata
The class description SHALL be stored in the Gitea organization's description field.

#### Scenario: Description visible in Gitea
- **WHEN** teacher views the org page on Gitea
- **THEN** the class description SHALL appear in the org's description field
