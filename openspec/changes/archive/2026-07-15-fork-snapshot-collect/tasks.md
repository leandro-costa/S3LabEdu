## 1. API — createRepoTag e listRepoTags

- [x] 1.1 Adicionar função `createRepoTag(owner, repo, tagName, target?)` em `gitea-api.js`
- [x] 1.2 Adicionar função `listRepoTags(owner, repo)` em `gitea-api.js`
- [x] 1.3 Exportar `createRepoTag` e `listRepoTags`

## 2. Teacher — botão Coletar em tarefas.html

- [x] 2.1 Importar `listForks` e `createRepoTag` em `tarefas.html`
- [x] 2.2 Adicionar botão "Coletar" na coluna Ações da tabela de tarefas
- [x] 2.3 Implementar `collectForks(org, repo, btn)` que lista forks e cria tag em cada um
- [x] 2.4 Exibir resultado (tags criadas / falhas) e botão "Copiar script de coleta"
- [x] 2.5 Armazenar `lastTagName` por tarefa e perguntar antes de re-coletar no mesmo dia

## 3. Teacher — script de coleta .bat

- [x] 3.1 Gerar script batch com `git clone --branch <tag> <clone_url> <username>` para cada fork com tag criada
- [x] 3.2 Copiar script para a área de transferência via `navigator.clipboard.writeText()`

## 4. Teacher — coluna Coleta em acompanhamento.html

- [x] 4.1 Importar `listRepoTags` em `acompanhamento.html`
- [x] 4.2 Adicionar coluna "Coleta" no cabeçalho da tabela
- [x] 4.3 No loop de forks, adicionar `listRepoTags` e contar forks com tag `coleta-*`
- [x] 4.4 Exibir `X/Y` com ✅ (todos) ou ⚠ (parcial)

## 5. Teacher — coluna Coleta em detalhes-tarefa.html

- [x] 5.1 Importar `listRepoTags` em `detalhes-tarefa.html`
- [x] 5.2 Adicionar coluna "Coleta" no cabeçalho e células com id `detail-tag-{username}`
- [x] 5.3 No loop assíncrono de commits, adicionar `listRepoTags` e exibir ✅ ou ✗

## 6. Student — visibilidade da coleta em minhas-tarefas.html

- [x] 6.1 Importar `listRepoTags` em `minhas-tarefas.html`
- [x] 6.2 Adicionar coluna "Coleta" na tabela de tarefas aceitas
- [x] 6.3 Implementar verificação assíncrona de tags `coleta-*` e exibir data da mais recente
