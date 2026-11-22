## 1. API — remover exports de PR

- [x] 1.1 Remover `listPullRequests` e `checkPullRequest` da exportação em `gitea-api.js` (manter funções)

## 2. minhas-tarefas.html — PR → commit

- [x] 2.1 Remover import de `checkPullRequest`; remover PR check e botão "Criar PR"
- [x] 2.2 Usar `countCommitsSince > 0` para definir "entregue" vs "aceita"

## 3. detalhes-tarefa.html — PR → commit

- [x] 3.1 Remover import e usos de `checkPullRequest`; adicionar id no status cell
- [x] 3.2 Atualizar status assincronamente no loop de commits: "Entregue" se `count > 0`

## 4. acompanhamento.html — PR → commit

- [x] 4.1 Trocar import `checkPullRequest` por `countCommitsSince`
- [x] 4.2 Substituir PR check por `countCommitsSince > 0` no contador de entregas
