## 1. gitea-api.js — createFork aceita forkName

- [x] 1.1 Modificar `createFork(owner, repo)` para aceitar `forkName` opcional e incluir `name` no body quando fornecido
- [x] 1.2 Modificar `createForkSafe` para aceitar e repassar `forkName`

## 2. Callers — passar forkName + usar nome real do fork

- [x] 2.1 `student/dashboard.html`: passar `${owner}-${repo}` ao `createForkSafe`, capturar retorno, usar `fork.name` no `createDeliveryIssue`
- [x] 2.2 `task/index.html`: passar `${owner}-${repo}` ao `createForkSafe`, usar `fork.name` no `createDeliveryIssue` e no link
- [x] 2.3 `student/minhas-tarefas.html`: passar `${owner}-${repo}` ao `createFork`, corrigir link do fork para usar `t.forkName`

## 3. Specs — Sync delta specs to main specs

- [x] 3.1 Sync `gitea-bridge` delta (modified createFork) to `openspec/specs/gitea-bridge/spec.md`