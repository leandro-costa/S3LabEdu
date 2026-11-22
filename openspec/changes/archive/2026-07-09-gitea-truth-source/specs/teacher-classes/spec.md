## MODIFIED Requirements

### Requirement: Teacher can list Gitea organizations
(Behavior unchanged — already reads from Gitea API, now filtered by owner.)

#### Scenario: Organizations displayed
- **WHEN** teacher navigates to the classes page
- **THEN** the system SHALL display a list of Gitea organizations where the teacher is owner

### Requirement: Teacher can list enrolled students per class
(Behavior unchanged, but source of truth is now the "alunos" team in Gitea.)

#### Scenario: Student list displayed
- **WHEN** teacher accesses the student management page for a class
- **THEN** the system SHALL show a table of enrolled students fetched from the "alunos" team members

### Requirement: Creating a class creates org + "alunos" team
When a teacher creates a class, the system SHALL create the Gitea organization and immediately create the "alunos" team.

#### Scenario: Class created with team
- **WHEN** teacher fills name and description and clicks "Criar Turma"
- **THEN** the system SHALL create the Gitea org, then create the "alunos" team with read permission
