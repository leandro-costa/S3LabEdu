## 1. tab-nav.js — propagar query string completa

- [x] 1.1 Modificar `renderLinks()` para usar `window.location.search` em vez de reconstruir só `?org=`
- [x] 1.2 Remover a lógica que filtrava apenas o parâmetro `org`

## 2. tarefas.html — adicionar filtro de tarefa

- [x] 2.1 Adicionar `<select id="task-filter">` ao lado do filtro de turma, populado com nomes das tarefas do org atual
- [x] 2.2 Implementar `window.taskChanged(select)` que atualiza `?task=` na URL via `URLSearchParams.set/delete` e chama `render()`
- [x] 2.3 No `render()`, ler `?task=` da URL e aplicar filtro na tabela
- [x] 2.4 Atualizar `orgChanged()` para usar `URLSearchParams.set/delete` em vez de substituir query string inteira

## 3. acompanhamento.html — persistir task filter na URL

- [x] 3.1 Implementar `window.taskChanged(select)` (mesmo padrão do `orgChanged`, mas para `?task=`)
- [x] 3.2 Adicionar `onchange="taskChanged(this)"` no select `#track-task`
- [x] 3.3 Atualizar `orgChanged()` para usar `URLSearchParams.set/delete` em vez de substituir query string inteira
