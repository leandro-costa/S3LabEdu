## 1. Corrigir dashboard.html — chave composta para tarefas aceitas

- [x] 1.1 Em `getAcceptedRepoNames()` em `student/dashboard.html`, alterar `accepted.add(r.name)` para `accepted.add(org.username + '/' + r.name)`
- [x] 1.2 Em `renderAvailableTasks()`, alterar o filtro `!acceptedRepoNames.has(t.repoName)` para usar chave composta `!acceptedRepoNames.has(t.repoOwner + '/' + t.repoName)`

## 2. Corrigir minhas-tarefas.html — IDs únicos entre turmas

- [x] 2.1 Em `student/minhas-tarefas.html`, alterar IDs de elementos DOM (`repo-${t.repoName}`, `status-${t.repoName}`, `commits-${t.repoName}`, `collect-${t.repoName}`) para incluir a turma: `${t.orgName}-${t.repoName}`
- [x] 2.2 Atualizar os `document.getElementById()` correspondentes no loop de renderização

## 3. Verificação

- [x] 3.1 Logar como aluno em duas turmas com tarefas de mesmo nome e confirmar que ambas aparecem como disponíveis
- [x] 3.2 Aceitar ambas e confirmar que aparecem em "Minhas Tarefas" sem conflito de DOM
