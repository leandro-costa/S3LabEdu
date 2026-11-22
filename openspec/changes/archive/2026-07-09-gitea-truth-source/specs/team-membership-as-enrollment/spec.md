## ADDED Requirements

### Requirement: Enrolled students are members of the "alunos" team
The system SHALL list members of the "alunos" team in a class's organization to determine which students are enrolled.

#### Scenario: Enrollments read from team members
- **WHEN** teacher views enrolled students for a class
- **THEN** the system SHALL call `GET /api/v1/teams/{teamId}/members` and display each member as an enrolled student

### Requirement: Enrolling a student adds them to the "alunos" team
When a teacher enrolls a student, the system SHALL add them as a member of the "alunos" team.

#### Scenario: Student enrolled via team member add
- **WHEN** teacher adds a student by email
- **THEN** the system SHALL resolve the email to a Gitea username, call `PUT /api/v1/teams/{teamId}/members/{username}`, and confirm the student is now enrolled
