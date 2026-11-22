## MODIFIED Requirements

### Requirement: Teacher can create a class (Gitea org)
The system SHALL allow a teacher to create a Gitea organization which represents a class. The organization SHALL be created as **private**.

#### Scenario: Class created as private org
- **WHEN** teacher fills the organization name and description, and clicks "Criar Turma"
- **THEN** the system SHALL call `POST /api/v1/orgs` to create the organization with `visibility: 'private'`
- **THEN** the system SHALL create an "alunos" team via `createOrgTeam(orgName, 'alunos')`
- **THEN** the class SHALL appear in the list immediately
