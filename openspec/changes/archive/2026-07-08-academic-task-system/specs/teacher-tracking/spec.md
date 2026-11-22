## ADDED Requirements

### Requirement: Teacher tracking dashboard with filters
The system SHALL provide a dashboard showing all tasks across all classes with filters for class and task.

#### Scenario: Dashboard overview displayed
- **WHEN** teacher accesses the tracking dashboard
- **THEN** the system SHALL show a filterable table with task name, class name, number of students who accepted, and number who delivered

### Requirement: Teacher can view student list per task with fork status
The system SHALL display all students who accepted a specific task, with their fork delivery status checked via the Gitea API.

#### Scenario: Student list per task
- **WHEN** teacher selects a task row
- **THEN** the system SHALL display a list of students (email, Gitea username, acceptance date) and for each student:
  - Call `GET /repos/{owner}/{repo}/forks` and filter by the student's Gitea username
  - Display status as "Entregue" (fork exists) or "Pendente" (fork not found)