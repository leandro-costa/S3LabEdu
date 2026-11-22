## ADDED Requirements

### Requirement: Teacher can create a task within a class
The system SHALL allow a teacher to create a task with a name, description, deadline, a link to a Gitea repository, and an auto-generated enrollment link.

#### Scenario: Task created successfully
- **WHEN** teacher selects a class, fills task name, description, deadline, selects a Gitea repo from the linked organization, and clicks "Criar Tarefa"
- **THEN** the task SHALL be saved to localStorage, a unique enrollment link SHALL be generated, and the task SHALL appear in the task list with the link ready to copy

#### Scenario: Repo selection shows repos from linked org
- **WHEN** teacher opens the repo dropdown during task creation
- **THEN** the dropdown SHALL list all repositories from the class's linked Gitea organization

### Requirement: Teacher can view tasks per class
The system SHALL display a list of all tasks belonging to a selected class with their enrollment links.

#### Scenario: Task list displayed
- **WHEN** teacher selects a class on the classes page
- **THEN** all tasks for that class SHALL appear with name, deadline, linked repo, and a copy button for the enrollment link