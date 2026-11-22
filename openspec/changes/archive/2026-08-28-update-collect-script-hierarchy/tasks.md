## 1. Refactor script generation

- [x] 1.1 Extract `buildCollectScript(org, repo, tagName, forks)` in `teacher/tarefas.html` that returns PowerShell script with `mkdir -Force "org/repo/tag"`, `Set-Location`, per-fork `Remove-Item` guard and `git clone --branch` — verify by inspecting generated string for hierarchy and overwrite lines
- [x] 1.2 Update `collectForks()` to delegate to `buildCollectScript` using `successes[]` — verify collecting a task still shows "Copiar script de coleta" and clipboard content contains `org/repo/tag`

## 2. Update re-generation path

- [x] 2.1 Update `generateAndCopyScript()` to delegate to `buildCollectScript` using `listForks()` results — verify "Script" button with single and multiple tags still copies correct hierarchical script
- [ ] 2.2 Manual QA: run script in PowerShell on Windows, confirm `org/repo/coleta/aluno` folders created, re-running overwrites student folders without error

## 3. Validation

- [x] 3.1 Run `openspec validate --change update-collect-script-hierarchy --strict` and fix any errors
