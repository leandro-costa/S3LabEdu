## Why

Quando `ensureAlunosTeam()` tenta criar o time "alunos" via API, o `createOrgTeam` pode retornar `null` (se a resposta do Gitea vier sem corpo JSON). Nesse caso, a função lança "Não foi possível garantir a equipe" mesmo que o time tenha sido criado com sucesso. Também não há logs de diagnóstico para depurar esse tipo de falha.

## What Changes

- Em `ensureAlunosTeam`, após `createOrgTeam`, se o retorno não tiver `id`, tentar `getTeamByName` como fallback
- Em `getTeamByName`, tratar `listOrgTeams` retornar `null` para evitar crash
- Adicionar `console.warn`/`console.error` nos pontos de falha para diagnóstico

## Capabilities

### New Capabilities
- *(nenhuma)*

### Modified Capabilities
- `gitea-bridge`: funções `ensureAlunosTeam` e `getTeamByName` devem ser robustas contra respostas JSON vazias da API

## Impact

- `components/gitea-api.js` — funções `ensureAlunosTeam()` e `getTeamByName()`
