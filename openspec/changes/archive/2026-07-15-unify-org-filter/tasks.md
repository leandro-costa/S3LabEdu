## 1. tab-nav.js — preservar query params nos links

- [x] 1.1 Modificar `tab-nav.js` para concatenar `window.location.search` nos hrefs de cada aba, se a URL atual tiver query string

## 2. tarefas.html — ler e escrever org na URL

- [x] 2.1 No `render()`, ler `org` da query string via `URLSearchParams` e usar como valor default do select (fallback para `ownerOrgs[0].username`)
- [x] 2.2 No `onchange` do select, chamar `history.replaceState(null, '', '?org=' + value)` para refletir a escolha na URL

## 3. acompanhamento.html — ler e escrever org na URL

- [x] 3.1 No `render()`, ler `org` da query string via `URLSearchParams` e usar como valor default; se não houver, manter o comportamento atual (`'all'`)
- [x] 3.2 No `onchange` do select de turma, chamar `history.replaceState(null, '', '?org=' + value)`

## 4. turma-alunos.html — migrar para <tab-nav>

- [x] 4.1 Substituir o `<nav class="tab-nav">` manual por `<tab-nav role="teacher" active="turmas">` e importar `tab-nav.js`
- [x] 4.2 Remover o CSS antigo do `<style>` (`.tab-nav` é definido pelo componente)

## 5. Sync delta spec

- [x] 5.1 Sync `teacher-tasks` delta to `openspec/specs/teacher-tasks/spec.md`
