## Why

O filtro de tarefa existe na tela de Acompanhamento mas não na tela de Tarefas do professor. Além disso, ao navegar entre abas, o filtro de tarefa é perdido porque só o `?org=` persiste na URL — o `?task=` ou `?repo=` sequer são propagados pelo `tab-nav`. O professor precisa refiltrar toda vez que troca de página.

## What Changes

- **Adicionar filtro de tarefa em `tarefas.html`**: `<select id="task-filter">` igual ao do acompanhamento
- **Persistir filtro de tarefa na URL**: `?org=X&task=Y` visível na barra de endereços (favoritável)
- **Propagar TODOS os params no `tab-nav`**: em vez de filtrar só `?org=`, propagar qualquer query parameter para os links de navegação
- **Atualizar `orgChanged`/`taskChanged`** nas páginas para usar `URLSearchParams.set/delete` em vez de substituir a query string inteira

## Capabilities

### New Capabilities
- *(none)*

### Modified Capabilities
- `nav-param-persistence`: tab-nav SHALL propagate ALL query parameters, não apenas `?org=`
- `teacher-tasks`: adicionar filtro de tarefa com persistência em URL via `?task=`
- `teacher-tracking`: atualizar `orgChanged` para preservar `?task=` (já existe o filtro, só falta persistir)

## Impact

- `components/tab-nav.js`: `renderLinks()` usa `window.location.search` em vez de reconstruir só `?org=`
- `teacher/tarefas.html`: adicionar `<select id="task-filter">`, função `taskChanged()`, atualizar `orgChanged()` para usar `URLSearchParams`
- `teacher/acompanhamento.html`: atualizar `orgChanged()` para preservar `?task=`; adicionar `taskChanged()` para persistir task na URL
