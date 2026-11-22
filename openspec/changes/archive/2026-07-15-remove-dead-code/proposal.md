## Why

`gitea-api.js` acumula funções mortas ou redundantes que aumentam a superfície de manutenção sem benefício. `setupLogout()` é uma no-op que 5 páginas ainda chamam — o logout real é tratado pelo `<page-header>`. `isOrgOwner()` nunca foi chamada. `broadcastAuth()` foi exposta em `window` mas nunca invocada. `logout` e `isTeamMember` poluem o export desnecessariamente.

## What Changes

- **Remover `setupLogout()`** — deletar a função e parar de importá-la/chamá-la nas 5 páginas
- **Remover `isOrgOwner()`** — função e entrada do export
- **Remover `broadcastAuth()`** — definição, `window.broadcastAuth` e entrada do export (não está no export atualmente, só no `window`)
- **Remover `logout` do export** — ninguém importa, acessam via `window.logout`
- **Remover `isTeamMember` do export** — só usada internamente por `isOrgOwner()` que será removida

## Capabilities

### New Capabilities
*(none)*

### Modified Capabilities
- `shared-auth-layer`: Remover requirement "Logout wiring helper" (`setupLogout()`)

## Impact

- `components/gitea-api.js` — remoção de funções e ajuste no export
- `teacher/turmas.html`, `teacher/tarefas.html`, `teacher/acompanhamento.html`, `student/dashboard.html`, `student/minhas-tarefas.html` — remover import e chamada de `setupLogout()`
- `openspec/specs/shared-auth-layer/spec.md` — remover requirement do `setupLogout()`
