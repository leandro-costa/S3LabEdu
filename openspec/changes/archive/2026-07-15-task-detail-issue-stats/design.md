## Context

The task detail page (`detalhes-tarefa.html`) shows a table of students with their fork repo, commit count, and PR status. Teachers need visibility into issues created in student forks (e.g., review comments, task questions). The Gitea API already has `createRepoIssue` but no read/listing function.

## Goals / Non-Goals

**Goals:**
- Add a `listRepoIssues(owner, repo)` function to `gitea-api.js`
- Display an "Issues" column on `detalhes-tarefa.html` showing "abertas/total" per student fork
- For students without a fork, show "-"

**Non-Goals:**
- Not modifying issue creation or management
- Not adding issue filtering or search on the detail page

## Decisions

- **Issues criadas pelo professor apenas**: `listRepoIssues(owner, repo, createdBy)` passa `?created_by=<teacher>` na URL, filtrando só as issues do professor. O username do professor vem de `sessionStorage.getItem('teacher_gitea_user')` (já populado no login).
- **Gitea API `/repos/{owner}/{repo}/issues?created_by=<user>`**: Retorna apenas issues do autor especificado. Uma única chamada por fork já traz tudo — contamos `state === 'open'` vs total no cliente.
- **Fetch per fork on render**: Issues são buscadas assincronamente por aluno (mesmo padrão dos commits). Cada célula começa com `<span class="loading">...</span>` e atualiza quando chega a resposta.
- **Cores na célula "Issues"**:
  - `0/0` ou `-` → cinza (sem issues criadas ou sem fork)
  - `0/X` → verde (todas resolvidas)
  - `Y/X` com `Y < X` → amarelo/ laranja (parcial)
  - `X/X` → vermelho (nenhuma resolvida)
- **No new dependency**: Usa `_fetch` existente do `gitea-api.js`.

## Risks / Trade-offs

- **Rate limiting**: 1 chamada extra por fork. Mesmo padrão dos commits (já faz N chamadas para contar commits). Aceitável para turmas típicas (&lt; 50 alunos).
- **Sem issues no fork**: Array vazio → célula mostra `0/0` em cinza.
- **Professor sem username em sessão**: Caso raro, mas se `teacher_gitea_user` estiver vazio, a célula mostra `-` e loga aviso no console.
