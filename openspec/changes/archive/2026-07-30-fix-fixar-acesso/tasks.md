## 1. Import updates em teacher/acompanhamento.html

- [x] 1.1 Adicionar `listOrgOwners` e `addRepoCollaborator` ao import de `../components/gitea-api.js`
- [x] 1.2 Remover `listOrgTeams` e `addTeamRepo` do import (não mais usados)

## 2. Visibilidade condicional do botão Fixar Acesso

- [x] 2.1 Adicionar função `getRepo(owner, repo)` em `gitea-api.js` — retorna o objeto completo do repositório incluindo `forks_count`
- [x] 2.2 No render de cada task, buscar `forks_count` via `getRepo(org, repo)` e comparar com `listForks.length`
- [x] 2.3 Mostrar o botão "Fixar Acesso" apenas se `forks_count > listForks.length`; esconder (display:none) se já estiverem iguais

## 3. Rewrite fixForkAccess para usar org members + addRepoCollaborator

- [x] 3.1 Criar função auxiliar `findForksViaMembers(org, forkName)` que:
  - Lista membros via `GET /orgs/{org}/members`
  - Para cada membro (excluindo owners), checa `GET /repos/{member}/{forkName}`
  - Retorna array de `{ owner: member.login, name: forkName }`
- [x] 3.2 Reescrever `window.fixForkAccess` para:
  - Descobrir owners via `listOrgOwners(org)`
  - Descobrir forks via `findForksViaMembers(org, forkName)`
  - Para cada fork, para cada owner, chamar `addRepoCollaborator(fork.owner, fork.name, owner.login, 'write')`
  - Remover `.catch(() => {})` silencioso → propagar erros com console.error
  - Mostrar "✓ Fixado" apenas se todas as chamadas tiverem sucesso
- [x] 3.3 Garantir que forkName = `${org}-${repo}` seja usado consistentemente

## 4. Verificação e teste

- [x] 4.1 Testar em produção: rodar console script para confirmar que `addRepoCollaborator` do teacher funciona no Forgejo
- [ ] 4.2 Testar fluxo completo: clicar Fixar Acesso → verificar se forks ficam acessíveis no re-render
- [ ] 4.3 Verificar que o botão desaparece após Fixar Acesso bem-sucedido
