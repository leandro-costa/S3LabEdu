## Why

The tracking dashboard table has separate "Tarefa" and "Turma" columns, which is redundant since each task already belongs to a specific class. Merging them into a single column with the repository link saves horizontal space and makes the repo directly accessible.

## What Changes

- Merge the "Tarefa" and "Turma" columns in the tracking dashboard (`acompanhamento.html`) into a single "Tarefa" column
- The merged column displays: task name (bold), org name below it, and a link to the Gitea repository
- Remove the standalone "Turma" column

## Capabilities

### New Capabilities

### Modified Capabilities

- `teacher-tracking`: Tracking dashboard table layout changes — merged task+class column with repo link

## Impact

- `teacher/acompanhamento.html`: Table header and row rendering changes
