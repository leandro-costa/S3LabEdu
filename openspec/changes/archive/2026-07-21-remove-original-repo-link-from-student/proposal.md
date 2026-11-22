## Why

A tela de tarefas disponíveis do aluno (`dashboard.html`) exibe um link para o repositório original da tarefa (do professor). Isso permite que alunos acessem o repositório base, o que não é desejado — o aluno deve interagir apenas com seu próprio fork. Remover o link evita confusão e acesso indevido ao repositório original.

## What Changes

- Remover o link clicável para o repositório original (`${giteaUrl}/${t.repoOwner}/${t.repoName}`) na tabela de "Tarefas Disponíveis" do dashboard do aluno
- Substituir por exibição textual simples do nome do repositório (sem link)
- Manter o link para o fork do aluno na página "Minhas Tarefas" (inalterado)

## Capabilities

### New Capabilities
- *(nenhuma)*

### Modified Capabilities
- `student-tasks`: a exibição de tarefas disponíveis não deve mais conter link para o repositório original do professor

## Impact

- `student/dashboard.html` — linha do link na tabela de tarefas disponíveis
