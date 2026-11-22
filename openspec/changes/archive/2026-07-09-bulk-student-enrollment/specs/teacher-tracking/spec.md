## MODIFIED Requirements

### Requirement: Teacher tracking dashboard with filters
(Unchanged.)

#### Scenario: Dashboard overview displayed
- **WHEN** teacher accesses the tracking dashboard
- **THEN** the system SHALL show a filterable table with task name, class name, number of students enrolled in the class, number who accepted the task, and number who delivered

### Requirement: Teacher can view student list per task with fork status
(Unchanged.)

#### Scenario: Student list per task
- **WHEN** teacher selects a task row
- **THEN** the system SHALL display a list of students (email, Gitea username, acceptance date) and for each student:
  - Call `GET /repos/{owner}/{repo}/forks` and filter by the student's Gitea username
  - Display status as "Entregue" (fork exists) or "Pendente" (fork not found)

## ADDED Requirements

### Requirement: Dashboard shows enrollment count per class
The tracking dashboard SHALL display the total number of students enrolled in each class (from localStorage), separate from task acceptance counts.

#### Scenario: Enrollment count shown
- **WHEN** teacher views the tracking dashboard
- **THEN** each class row SHALL include a column showing how many students are enrolled in that class
