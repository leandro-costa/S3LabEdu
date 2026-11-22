## ADDED Requirements

### Requirement: Migration script imports existing localStorage data into Gitea
The system SHALL provide a one-time migration script that reads existing localStorage data and creates the corresponding Gitea structures.

#### Scenario: Classes migrated to orgs
- **WHEN** migration runs for a teacher
- **THEN** each `academic_class` entry SHALL create a Gitea organization (if not existing) with the class description and an "alunos" team

#### Scenario: Tasks migrated to repos
- **WHEN** migration runs for a class
- **THEN** each `academic_task` entry SHALL create a repository in the class's org (if not existing) with deadline topic

#### Scenario: Enrollments migrated to team members
- **WHEN** migration runs for a class
- **THEN** each student email in `academic_enrollments` with a resolved `giteaUser` SHALL be added to the "alunos" team

#### Scenario: Acceptances verified as forks
- **WHEN** migration runs for a task
- **THEN** each acceptance in `academic_acceptances` SHALL verify that a fork exists for that student; if not, flag for manual review

### Requirement: Migration reports per-class status
The migration script SHALL display a summary of what was created, what already existed, and any errors.

#### Scenario: Migration summary displayed
- **WHEN** migration completes
- **THEN** the system SHALL show counts of orgs created, repos created, students added to teams, and forks verified
