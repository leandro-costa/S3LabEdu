## Context

The PR-based delivery check requires read access to the original task repo — something students don't have for private repos. The commit count (`countCommitsSince`) already exists and is fetched per fork on detail/acompanhamento pages, making PR checks redundant. Removing PR logic eliminates the 404 errors and simplifies the codebase.

## Goals / Non-Goals

**Goals:**
- Remove all PR-based delivery detection
- Use commit count > 0 as the sole criterion for "Entregue" status
- Remove "Criar Pull Request" button and PR links

**Non-Goals:**
- Not changing the fork or commit tracking mechanisms
- Not removing API functions (kept for flexibility, just not used)

## Decisions

- **Commit count > 0 = entregue**: Reuses existing `countCommitsSince` data already being fetched
- **Status set after commit fetch** (detalhes-tarefa): Use async update pattern (same as existing commit cell) to set status cell after commit count arrives
- **Remove PR button**: No more "Criar Pull Request" link on minhas-tarefas
- **Keep `listPullRequests`/`checkPullRequest` in gitea-api.js**: Just remove from exports. They may be useful later.

## Risks / Trade-offs

- **False positives**: A student who forks and commits but doesn't intend to deliver would be marked "entregue". Acceptable — the act of committing to the fork is delivery.
- **No PR distinction**: Loses "entregue via PR" vs "só mexeu". Not needed for current use case.
