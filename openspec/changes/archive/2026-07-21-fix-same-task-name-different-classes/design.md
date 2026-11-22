## Context

O Set `acceptedRepoNames` em `dashboard.html` armazena apenas `r.name` (ex: "projeto-1"), sem incluir a turma. Se um aluno está em duas turmas com tarefas de mesmo nome, a segunda é considerada já aceita. Além disso, `minhas-tarefas.html` usa `r.repoName` como ID de elementos DOM, causando conflito se houver tarefas com mesmo nome.

## Goals / Non-Goals

**Goals:**
- Usar chave composta `${org}/${repo}` para identificar tarefas aceitas
- Garantir que IDs de DOM em `minhas-tarefas.html` sejam únicos entre turmas

**Non-Goals:**
- Não alterar o nome do fork (`owner + '-' + repo` já é único entre turmas)
- Não alterar a API do Gitea

## Decisions

| Decisão | Alternativa | Razão |
|---------|-------------|-------|
| Chave composta `${org}/${repo}` no Set de tarefas aceitas | Adicionar um Map ou objeto | Simples, mínima mudança |
| Incluir `orgName` nos IDs DOM de `minhas-tarefas.html` | UUID único | Mais legível e consistente com a chave composta |

## Risks / Trade-offs

- [Regression] Nenhum — forks já usam nome composto `owner-repo`, então alunos com tarefas de mesmo nome em turmas diferentes já tinham forks com nomes distintos. Apenas a lógica de detecção no dashboard estava incorreta.
