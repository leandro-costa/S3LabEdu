## Context

No dashboard do aluno (`student/dashboard.html`), a tabela de "Tarefas Disponíveis" exibe um link clicável para o repositório original da tarefa (`<a href="${giteaUrl}/${t.repoOwner}/${t.repoName}">`). Isso permite que alunos acessem o repositório base do professor, o que não é desejado — o aluno deve trabalhar apenas no seu próprio fork.

## Goals / Non-Goals

**Goals:**
- Remover o link para o repositório original na tabela de tarefas disponíveis
- Manter a exibição do nome do repositório como texto simples

**Non-Goals:**
- Não alterar a página "Minhas Tarefas" (o link para o fork do aluno permanece)
- Não alterar a página de aceite de tarefa (`task/index.html`)

## Decisions

| Decisão | Alternativa | Razão |
|---------|-------------|-------|
| Substituir `<a>` por texto simples em `dashboard.html` | Esconder o link com CSS ou removê-lo do template | Solução direta e sem efeitos colaterais |

## Risks / Trade-offs

- Nenhum risco significativo — é apenas a remoção de um link HTML
