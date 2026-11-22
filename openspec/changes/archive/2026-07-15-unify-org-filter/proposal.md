## Why

As telas `tarefas.html` e `acompanhamento.html` têm cada uma seu próprio filtro de turma (org), mas a escolha feita em uma não persiste ao navegar para a outra. O professor precisa selecionar a mesma turma novamente toda vez que troca de aba. Passar o org selecionado como query param na URL resolve isso de forma natural e linkável.

## What Changes

- Ao selecionar uma turma no filtro, a URL é atualizada via `history.replaceState` para incluir `?org=<nome>`
- O componente `tab-nav.js` preserva os query params da URL atual em todos os links de navegação que gera
- Cada tela lê `org` da query string ao carregar e usa como valor inicial do filtro
- `turma-alunos.html` (que tem `<nav>` manual) também atualiza seus links para preservar o param

## Capabilities

### New Capabilities

None — mudança puramente de navegação/UX.

### Modified Capabilities

- `teacher-tasks`: O filtro de turma em tarefas.html e acompanhamento.html agora persiste entre telas via query param

## Impact

- `components/tab-nav.js` — append `location.search` nos hrefs das abas
- `teacher/tarefas.html` — ler `org` da URL no render; update URL no onchange
- `teacher/acompanhamento.html` — ler `org` da URL no render; update URL no onchange
- `teacher/turma-alunos.html` — migrar `<nav>` manual para `<tab-nav>` (ganha query params automaticamente)
