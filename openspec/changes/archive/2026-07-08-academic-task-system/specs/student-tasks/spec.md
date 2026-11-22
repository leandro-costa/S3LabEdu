## ADDED Requirements

### Requirement: Student identifies by email on dashboard
The system SHALL prompt the student to enter their email on the student page to load their data.

#### Scenario: Student enters email
- **WHEN** student navigates to `/academic/student/` and enters their email
- **THEN** the system SHALL load all enrollments, class data, and acceptances associated with that email from localStorage

### Requirement: Student can view enrolled classes
The system SHALL display the classes the student is enrolled in, with a count of active tasks per class.

#### Scenario: Enrolled classes listed
- **WHEN** student email is loaded
- **THEN** the system SHALL show each enrolled class with name and number of active (not past deadline) tasks

### Requirement: Student can view available tasks per class
The system SHALL display tasks from the student's enrolled classes that are available for acceptance.

#### Scenario: Available tasks listed
- **WHEN** student views the available tasks section
- **THEN** each task SHALL show task name, class name, deadline, and an "Aceitar" button

### Requirement: Student can accept a task from dashboard
The system SHALL allow a student to accept a task from the dashboard, creating a fork via the admin token.

#### Scenario: Task accepted from dashboard
- **WHEN** student clicks "Aceitar" on an available task
- **THEN** the system SHALL call the Gitea fork API using the admin token and save the acceptance record to localStorage

### Requirement: Student can view accepted tasks with delivery status
The system SHALL display all accepted tasks with current fork status.

#### Scenario: Accepted tasks listed with status
- **WHEN** student views "Minhas Tarefas"
- **THEN** the system SHALL call `GET /repos/{owner}/{repo}/forks` for each task, filter by student's Gitea username, and display status as:
  - "Entregue" — fork found in the list
  - "Aceita" — fork not found (or API error)