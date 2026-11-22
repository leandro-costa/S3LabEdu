## Why

The student detail view (fork status, commits, approve/delete actions) currently renders inside a modal on `acompanhamento.html`. This limits usability — the modal loses state on refresh, cannot be bookmarked or shared, and mixes concerns in a single growing page. Extracting it to a dedicated page simplifies navigation and makes the detail view a proper addressable resource.

## What Changes

- Create `teacher/aluno-detalhes.html` as a standalone page that receives `repoOwner` and `repoName` via URL query parameters
- Move the student detail table, commit counts, approve, and delete logic from the modal in `acompanhamento.html` into the new page
- Change the "Detalhes" button in `acompanhamento.html` to navigate to the new page via `window.location` instead of opening a modal
- Remove the `<ui-modal id="student-detail-modal">` element from `acompanhamento.html`
- Remove the `showStudentsDetail`, `approveStudent`, and `deleteFork` functions from `acompanhamento.html` (they move to the new page)

## Capabilities

### New Capabilities

- `teacher-student-detail`: Standalone page for viewing per-task student details, including fork status, commit history, approve, and delete actions

### Modified Capabilities

None — the existing capability requirements (`teacher-tasks`, `teacher-classes`, `gitea-bridge`) remain unchanged. This is a UI restructuring only; no backend or API behavior changes.

## Impact

- `teacher/acompanhamento.html` — remove modal element, remove `showStudentsDetail`/`approveStudent`/`deleteFork` functions, change "Detalhes" button to navigate
- New file `teacher/aluno-detalhes.html` — standalone page with the extracted logic
- Shared imports from `../components/gitea-api.js` remain the same
