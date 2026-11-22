# Teacher Classes

## Purpose
Teacher interface for managing classes, including listing Gitea organizations, creating classes, and viewing registered classes.

## Requirements

### Requirement: Teacher lists Gitea organizations where they are owner
The system SHALL fetch and display a list of Gitea organizations where the authenticated teacher is owner, using `listOwnerOrganizations()`.

#### Scenario: Owner organizations displayed
- **WHEN** teacher navigates to the classes page
- **THEN** the system SHALL call `GET /api/v1/user/orgs` and filter results where `permission === "owner"`
- **THEN** each org SHALL be displayed as a class

### Requirement: Teacher can create a class (Gitea org)
The system SHALL allow a teacher to create a Gitea organization which represents a class. The organization SHALL be created as **private**.

#### Scenario: Class created as private org
- **WHEN** teacher fills the organization name and description, and clicks "Criar Turma"
- **THEN** the system SHALL call `POST /api/v1/orgs` to create the organization with `visibility: 'private'`
- **THEN** the system SHALL create an "alunos" team via `createOrgTeam(orgName, 'alunos')`
- **THEN** the class SHALL appear in the list immediately

#### Scenario: Validation prevents empty name
- **WHEN** teacher tries to submit without an organization name
- **THEN** the form SHALL show a validation error and not save

### Requirement: Teacher can view registered classes from Gitea
The system SHALL display a list of all Gitea organizations where the teacher is owner as classes.

#### Scenario: Class list displayed
- **WHEN** teacher is on the classes page
- **THEN** each class SHALL show organization name, description, and a link to manage students

### Requirement: Teacher can list enrolled students per class from team membership
The system SHALL display a list of all students enrolled in a class by reading the "alunos" team members via `listTeamMembers()`. The table SHALL show each student's full name (from `full_name`), Gitea username, and email.

#### Scenario: Student list displayed
- **WHEN** teacher accesses the student management page for a class (identified by org name)
- **THEN** the system SHALL call `listTeamMembers(teamId)` for the "alunos" team
- **THEN** show a table of enrolled students with their full name, Gitea username, and email
- **THEN** the full name column SHALL fall back to the Gitea username when `full_name` is empty

### Requirement: Teacher can bulk-add students to a class
The system SHALL provide a textarea-based bulk enrollment form on the student management page.

#### Scenario: Bulk enrollment triggered
- **WHEN** teacher pastes emails (one per line) and clicks "Adicionar em Lote"
- **THEN** the system SHALL process each email, resolve Gitea username, and add to the "alunos" Gitea team via `addTeamMember()`
- **THEN** the enrollment list SHALL refresh from Gitea

### Requirement: Classes use Gitea as source of truth
The system SHALL NOT store classes in localStorage as source of truth. localStorage MAY be used as a read-through cache.

#### Scenario: Cache layer
- **WHEN** teacher loads the classes page
- **THEN** the system SHALL fetch orgs from Gitea and write them to localStorage as cache
- **THEN** the page SHALL render from cache for instant display on subsequent loads
