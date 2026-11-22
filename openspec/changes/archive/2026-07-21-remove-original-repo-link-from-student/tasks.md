## 1. Remover link do repositório original no dashboard do aluno

- [x] 1.1 Em `student/dashboard.html`, localizar o link `<a href="${giteaUrl}/${t.repoOwner}/${t.repoName}">` na tabela de tarefas disponíveis
- [x] 1.2 Substituir por texto simples: `${t.repoOwner}/${t.repoName}` (sem link)
- [x] 1.3 Verificar que a coluna de repositório ainda exibe o nome corretamente

## 2. Verificação

- [x] 2.1 Logar como aluno e confirmar que o nome do repositório aparece como texto, sem link clicável
- [x] 2.2 Confirmar que a página "Minhas Tarefas" ainda exibe o link para o fork do aluno normalmente
