## Why

Teachers need to track issues created in student fork repos to monitor how many task-related issues are open vs resolved. Currently the task detail page shows commits and PR status but no issue visibility.

## What Changes

- Add a new column "Issues" to the student table on `detalhes-tarefa.html`
- Each cell shows "abertas/total" (e.g., "2/5") for the student's fork repo
- Add a `listRepoIssues` function to `gitea-api.js`
- For students without a fork, show "-"

## Capabilities

### New Capabilities
- `task-detail-issue-stats`: Display issue count (open/total) per student fork repo on the task detail page

### Modified Capabilities
- (none)

## Impact

- `teacher/detalhes-tarefa.html` — new column and async issue fetch
- `components/gitea-api.js` — new `listRepoIssues(owner, repo)` function
