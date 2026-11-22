## ADDED Requirements

### Requirement: Public task enrollment page
The system SHALL provide a public page at `/academic/task/{hash}` that shows the task details and allows student registration.

#### Scenario: Task page displays correctly
- **WHEN** a student (or anyone) accesses `/academic/task/{hash}`
- **THEN** the page SHALL display the task name, description, deadline, class name, and a form with email and Gitea username fields

### Requirement: Student can enroll and accept in one step
The system SHALL allow a student to submit their email and Gitea username, which triggers class enrollment and task acceptance.

#### Scenario: Enrollment + acceptance succeeds
- **WHEN** student fills email and Gitea username, clicks "Inscrever e Aceitar Tarefa"
- **THEN** the system SHALL:
  1. Save enrollment record (email + Gitea username + classId) to localStorage
  2. Call Gitea fork API to fork the task repo into the student's Gitea namespace
  3. Save acceptance record (email, taskId, giteaUser) to localStorage
  4. Display success message: "Inscrição realizada! Tarefa aceita com sucesso."

#### Scenario: Student already enrolled in the class
- **WHEN** the email already has an enrollment record for the task's class
- **THEN** the system SHALL skip enrollment but still attempt the fork and save the acceptance

#### Scenario: Fork already exists
- **WHEN** the fork API returns an error indicating the fork already exists
- **THEN** the system SHALL detect this and save the acceptance record without creating a duplicate fork

#### Scenario: Invalid enrollment link
- **WHEN** the task hash does not match any existing task
- **THEN** the system SHALL display "Link inválido" with no form