## Why

O nome do repositório em `tarefas.html` não é sanitizado antes de enviar ao Gitea. Se o usuário digitar espaços, acentos ou caracteres especiais, o Gitea rejeita com erro `[Name]: AlphaDashDot`. O mesmo problema já foi resolvido para nomes de organização em `turmas.html`.

## What Changes

- **Sanitizar nome do repo**: aplicar `.toLowerCase().replace(/[^a-z0-9-]/g, '-')` no valor do campo `task-new-repo` antes de enviar ao `createOrgRepo()`

## Capabilities

### New Capabilities
*(none)*

### Modified Capabilities
*(none — bug fix, sem mudança de requirement)*

## Impact

- `teacher/tarefas.html` — 1 linha: sanitizar nome do repo igual já é feito em `turmas.html`
