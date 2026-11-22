## MODIFIED Requirements

### Requirement: Student detail view shows full name
The student detail page (`detalhes-tarefa.html`) SHALL display each student's full name (from `full_name`) alongside their Gitea username.

#### Scenario: Student table shows full name
- **WHEN** the detail page renders enrolled students and fork owners
- **THEN** each row SHALL show the student's full name (or username if full_name is empty) followed by the Gitea username in parentheses
