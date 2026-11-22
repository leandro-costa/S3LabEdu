## 1. API function: addRepoCollaborator

- [x] 1.1 Adicionar função `addRepoCollaborator(owner, repo, collaborator, permission)` em `components/gitea-api.js` que faz `PUT /repos/{owner}/{repo}/collaborators/{collaborator}` com body `{ permission }`

## 2. API function: listOrgOwners

- [x] 2.1 Adicionar função `listOrgOwners(orgName)` em `components/gitea-api.js` que:
  - Lista membros da org paginado via `GET /orgs/{org}/members?limit=50`
  - Para cada membro, faz `GET /users/{login}/orgs/{org}/permissions`
  - Filtra apenas `is_owner === true`
  - Cache em `sessionStorage` (chave `org_owners_{orgName}`)
  - Retorna `[{ login, id, full_name }]`

## 3. Student-side: add owners as collaborators after fork

- [x] 3.1 `student/dashboard.html`: após `createForkSafe`, usa `listOrgOwners(owner)` para descobrir professores e adiciona cada um como colaborador `write` no fork
- [x] 3.2 `task/index.html`: mesma lógica — descobre professores via `listOrgOwners` e adiciona como colaboradores `write`

## 4. Teacher-side: Fixar Acesso button on acompanhamento

- [x] 4.1 Adicionar função `window.fixForkAccess(org, repo, btn)` em `teacher/acompanhamento.html` que:
  - Busca time "Owners" da org via `listOrgTeams(org)`
  - Lista forks via `listForks(org, repo)`
  - Para cada fork, chama `addTeamRepo(ownersTeamId, fork.owner.login, fork.name)` com `catch` para "already exists"
  - Re-renderiza a tabela
- [x] 4.2 Adicionar botão "Fixar Acesso" na coluna Ações de cada linha da tabela, visível sempre que houver forks
