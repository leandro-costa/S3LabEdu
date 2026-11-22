## 1. API — adicionar listRepoIssues

- [x] 1.1 Adicionar função `listRepoIssues(owner, repo)` em `components/gitea-api.js` que chama `GET /repos/{owner}/{repo}/issues` via `_fetch` e exportá-la

## 2. detalhes-tarefa.html — exibir coluna de issues

- [x] 2.1 Importar `listRepoIssues` de `gitea-api.js`
- [x] 2.2 Adicionar `<th>Issues</th>` no cabeçalho da tabela
- [x] 2.3 Adicionar célula `<td id="detail-issues-{username}">` para cada linha (mostrar `-` se não tiver fork)
- [x] 2.4 Após renderizar a tabela, buscar issues assincronamente para cada fork e atualizar célula com "abertas/total"
