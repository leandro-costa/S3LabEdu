## ADDED Requirements

### Requirement: Teacher can register individual questions for a task
The task form SHALL offer an "Questões individuais" option. When enabled, the questions SHALL be stored in the task repository under `questoes/NN.md` in a single commit, the README.md SHALL contain the reserved block `<!-- s3lab:questao:inicio -->` … `<!-- s3lab:questao:fim -->`, and the repository SHALL receive the topic `questoes-individuais`.

#### Scenario: New repository with questions
- **WHEN** the teacher creates a task with a new repository and at least one question
- **THEN** the system SHALL create `questoes/01.md`, `questoes/02.md`… and add the reserved block to README.md before protecting the branch

#### Scenario: Existing repository is detected
- **WHEN** the teacher selects an existing repository, or types the name of a repository that already exists in the class
- **THEN** the form SHALL say the repository already exists and will be reused
- **THEN** the form SHALL load the questions found in `questoes/` for editing
- **THEN** saving SHALL update edited questions in place, delete removed ones and number new ones with the next unused number

#### Scenario: Questions enabled without content
- **WHEN** "Questões individuais" is enabled and every question is empty
- **THEN** the system SHALL refuse to create the task

### Requirement: Teacher draws a question for each student
Tasks with the topic `questoes-individuais` SHALL show a "Sortear questões" action.

#### Scenario: Draw for forks without a question
- **WHEN** the teacher clicks "Sortear questões"
- **THEN** for each visible fork whose README.md has no question id, the system SHALL pick at random one of the least-used questions and write it into the reserved block of the fork's README.md (creating the block or the file if missing) using the teacher's token
- **THEN** no question SHALL repeat while there are unused questions
- **THEN** forks that already have a question SHALL NOT be changed
- **THEN** the system SHALL show each student's question and report errors and forks hidden from the teacher
