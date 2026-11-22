## ADDED Requirements

### Requirement: Teacher can list Gitea organizations
The system SHALL fetch and display a list of Gitea organizations accessible with the admin token.

#### Scenario: Organizations displayed
- **WHEN** teacher navigates to the classes page
- **THEN** the system SHALL display a list of Gitea organizations fetched via API

### Requirement: Teacher can create a class
The system SHALL allow a teacher to register a class with a name, description, and linked Gitea organization.

#### Scenario: Class created successfully
- **WHEN** teacher fills the class name, description, selects a Gitea organization, and clicks "Criar Turma"
- **THEN** the class SHALL be saved to localStorage and appear in the class list

#### Scenario: Validation prevents empty name
- **WHEN** teacher tries to submit without a class name
- **THEN** the form SHALL show a validation error and not save

### Requirement: Teacher can view registered classes
The system SHALL display a list of all registered classes with their name, organization, and creation date.

#### Scenario: Class list displayed
- **WHEN** teacher is on the classes page
- **THEN** each class SHALL show name, linked organization, creation date, and action links to manage tasks and copy enrollment links