## 1. Tab-nav: reactive link rendering

- [x] 1.1 Refatorar `connectedCallback()`: extrair lógica de geração de links para método `renderLinks()`
- [x] 1.2 `renderLinks()` lê `new URLSearchParams(location.search)` e filtra apenas o parâmetro `org`
- [x] 1.3 `renderLinks()` atualiza apenas o `href` dos elementos `<a>` existentes (não recria o DOM)
- [x] 1.4 Adicionar listener para `popstate` que chama `renderLinks()`
- [x] 1.5 Adicionar listener para evento customizado `org-changed` que chama `renderLinks()`

## 2. Pages: dispatch org-changed on dropdown change

- [x] 2.1 `teacher/tarefas.html`: em `orgChanged()`, após `history.replaceState`, adicionar `window.dispatchEvent(new CustomEvent('org-changed'))`
- [x] 2.2 `teacher/acompanhamento.html`: em `orgChanged()`, após `history.replaceState`, adicionar `window.dispatchEvent(new CustomEvent('org-changed'))`

## 3. Standardize parameter: owner → org

- [x] 3.1 `teacher/acompanhamento.html`: mudar link "Detalhes" de `?owner=` para `?org=`
- [x] 3.2 `teacher/detalhes-tarefa.html`: mudar leitura do parâmetro de `params.get('owner')` para `params.get('org')`
- [x] 3.3 `teacher/detalhes-tarefa.html`: remover lógica de inferência de `backOrgParam` via `document.referrer` (agora o tab-nav já propaga `?org=`)
