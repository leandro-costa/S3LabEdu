## Why

The PR-based delivery check (`checkPullRequest`) causes 404 errors because students can't access the teacher's private repos. Since commit count already indicates delivery (aluno fez commits = entregou), the PR mechanism is redundant and problematic.

## What Changes

- Remove `checkPullRequest` usage from all student and teacher pages
- Use commit count (`countCommitsSince > 0`) to determine "Entregue" status instead of PR existence
- Remove "Criar Pull Request" button and PR links from the UI
- Remove `listPullRequests` and `checkPullRequest` from exports (keep functions for compatibility)

## Capabilities

### New Capabilities
- `fix-pr-404-student`: Replace PR-based delivery detection with commit-based detection across all pages

### Modified Capabilities
- (none)

## Impact

- `student/minhas-tarefas.html` — replace PR check with commit count; remove "Criar PR" button
- `teacher/detalhes-tarefa.html` — replace PR check with commit count for status
- `teacher/acompanhamento.html` — replace PR-based delivery count with commit-based
- `components/gitea-api.js` — remove exports of `listPullRequests`, `checkPullRequest`
