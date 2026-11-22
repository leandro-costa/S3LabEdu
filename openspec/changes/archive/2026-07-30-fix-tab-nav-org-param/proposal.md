## Why

O `tab-nav` gera links de navegação uma única vez na carga da página, copiando a query string inteira. Quando o professor seleciona uma turma (dropdown), a URL é atualizada via `history.replaceState` mas os links do tab-nav permanecem congelados — o parâmetro `org` se perde ao navegar entre abas. Além disso, parâmetros específicos de uma página (`?owner=`, `?repo=`) vazam para as outras páginas porque o tab-nav replica a query string inteira sem filtrar.

## What Changes

- **tab-nav.js**: passa a re-renderizar os links quando o parâmetro `org` muda na URL, escutando evento `org-changed` e `popstate`. Filtra a query string para propagar apenas `?org=`.
- **`orgChanged()` em tarefas.html e acompanhamento.html**: após `replaceState`, disparam `CustomEvent('org-changed')`.
- **detalhes-tarefa.html**: padroniza o parâmetro de `?owner=` para `?org=`, mantendo `?repo=`.
- **acompanhamento.html**: link de "Detalhes" usa `?org=` em vez de `?owner=`.

## Capabilities

### New Capabilities
- `nav-param-persistence`: navegação entre páginas teacher preserva o parâmetro `org` na URL de forma consistente.

### Modified Capabilities
<!-- Nenhuma spec existente, apenas correção de comportamento de navegação -->

## Impact

- `components/tab-nav.js`: lógica de renderização e escuta de eventos
- `teacher/tarefas.html`: `orgChanged()` adiciona dispatch de evento
- `teacher/acompanhamento.html`: `orgChanged()` adiciona dispatch de evento + link de Detalhes usa `?org=`
- `teacher/detalhes-tarefa.html`: lê `?org=` em vez de `?owner=`
