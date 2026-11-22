## Why

O botão "Fixar Acesso" no painel do professor (`teacher/acompanhamento.html`) não funciona no Forgejo. O `addTeamRepo` (`PUT /teams/{id}/repos/{owner}/{repo}`) falha silenciosamente para forks de alunos (repos fora da org), e o `listForks` retorna 0 forks porque o Forgejo só expõe via REST os forks que o token tem acesso. A web UI mostra 28 forks, mas a API retorna 0.

## What Changes

- **Descoberta de forks**: substituir `listForks(org, repo)` por: listar membros da org via `GET /orgs/{org}/members` + checar `GET /repos/{member}/{forkName}` para cada membro (forkName = `{org}-{repo}`)
- **Concessão de acesso**: substituir `addTeamRepo(ownersTeamId, aluno, forkName)` por `addRepoCollaborator(aluno, forkName, ownerLogin, 'write')` para cada owner da org
- **Remover `.catch(() => {})` silencioso**: propagar erros reais para diagnóstico
- **Importar funções**: adicionar `listOrgOwners` e `addRepoCollaborator` ao import em `teacher/acompanhamento.html`

## Capabilities

### New Capabilities
- *(none)*

### Modified Capabilities
- `teacher-tracking`: requisitos do "Fixar Acesso" alterados — descoberta de forks via membros da org em vez de `listForks`, e concessão via `addRepoCollaborator` em vez de `addTeamRepo`

## Impact

- `teacher/acompanhamento.html`: lógica do `fixForkAccess` reescrita; imports atualizados
- `components/gitea-api.js`: nenhuma mudança necessária (funções já existem)
- `openspec/specs/teacher-tracking/spec.md`: delta spec atualizando os cenários do Fixar Acesso
