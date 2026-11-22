## Why

Student fork repos need Issue Tracker enabled so teachers can create review issues. Also, the automatic delivery issue should only be created when the task has a deadline — otherwise it creates unnecessary noise.

## What Changes

- Add `enableRepoIssues(owner, repo)` function to `gitea-api.js`
- After creating a fork, check `fork.has_issues` and enable if false
- Only call `createDeliveryIssue` when deadline is set

## Capabilities

### New Capabilities
- `fork-issue-tracker`: Enable Issue Tracker on student fork repos when needed, and conditionally create delivery issue only when deadline exists

### Modified Capabilities
- (none)

## Impact

- `components/gitea-api.js` — new `enableRepoIssues` function
- `task/index.html` — enable issues + conditional delivery issue
- `student/dashboard.html` — enable issues + conditional delivery issue
