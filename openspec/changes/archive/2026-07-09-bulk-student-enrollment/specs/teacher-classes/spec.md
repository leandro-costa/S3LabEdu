## MODIFIED Requirements

### Requirement: Teacher can view registered classes
(Unchanged.)

#### Scenario: Class list displayed
- **WHEN** teacher is on the classes page
- **THEN** each class SHALL show name, linked organization, creation date, and action links to manage tasks, copy enrollment links, and manage students

## ADDED Requirements

### Requirement: Teacher can list enrolled students per class
The system SHALL display a list of all students enrolled in a class, with their email, Gitea username (if resolved), and enrollment date.

#### Scenario: Student list displayed
- **WHEN** teacher accesses the student management page for a class
- **THEN** the system SHALL show a table of enrolled students with columns: email, Gitea username, enrollment date

### Requirement: Teacher can bulk-add students to a class
The system SHALL provide a textarea-based bulk enrollment form on the student management page.

#### Scenario: Bulk enrollment triggered
- **WHEN** teacher pastes emails (one per line) and clicks "Adicionar em Lote"
- **THEN** the system SHALL process each email, resolve Gitea username, save to localStorage, and add to the "alunos" Gitea team

### Requirement: Teacher can retry enrollment for unresolved students
The system SHALL allow the teacher to retry Gitea resolution for students whose email was not found.

#### Scenario: Retry single student
- **WHEN** teacher clicks "Tentar novamente" on a student with `giteaUser: ""`
- **THEN** the system SHALL re-attempt the email lookup and, if successful, add the student to the "alunos" team
