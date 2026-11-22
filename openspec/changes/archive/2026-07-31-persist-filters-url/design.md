## Context

Hoje o `tab-nav.js` propaga apenas `?org=` entre páginas. Cada página tem seu próprio `orgChanged()` que substitui a query string inteira (`history.replaceState(null, '', '?org=X')`), perdendo outros parâmetros como `?task=`. O acompanhamento já tem filtro de tarefa, mas ele não persiste na URL. A tela de tarefas não tem filtro de tarefa.

```
Estado atual:
  orgChanged() → history.replaceState(null, '', '?org=' + value)
                 ↓
                 destrói ?task, ?repo, etc

  tab-nav renderLinks() → const qs = '?org=' + org
                          ↓
                          só propaga org

  tarefas.html → sem filtro de tarefa
  acompanhamento.html → filtro de tarefa existe, mas não vai pra URL
```

## Goals / Non-Goals

**Goals:**
- Filtro de tarefa em `tarefas.html` (select igual ao acompanhamento)
- `?task=` na URL, favoritável
- `tab-nav` propaga TODOS os query parameters
- `orgChanged` em todas as páginas usa `URLSearchParams.set/delete` em vez de substituir a string

**Non-Goals:**
- Não mudar o comportamento do `turmas.html` (não tem task filter, mas receberá `?task=` na URL — ignora silenciosamente)
- Não adicionar funcionalidade de filtro em páginas do aluno
- Não alterar `detalhes-tarefa.html`

## Decisions

### 1. tab-nav propaga query string inteira

```
Antes:  const qs = org ? `?org=${encodeURIComponent(org)}` : ''
Depois: const qs = window.location.search
```

Efeito: qualquer parâmetro presente na URL é propagado. Páginas que não conhecem um parâmetro simplesmente ignoram.

### 2. orgChanged/taskChanged usam URLSearchParams

Padrão único para todas as páginas:

```javascript
window.orgChanged = function(select) {
  const p = new URLSearchParams(window.location.search);
  if (select.value === 'all') p.delete('org');
  else p.set('org', select.value);
  const qs = p.toString();
  history.replaceState(null, '', qs ? '?' + qs : window.location.pathname);
  window.dispatchEvent(new CustomEvent('org-changed'));
  render();
};
```

O mesmo padrão se aplica ao `taskChanged` (acompanhamento já usa, só falta persistir na URL).

### 3. Filtro de tarefa em tarefas.html

Mesmo layout do acompanhamento:
```html
<div class="form-group" style="min-width:200px">
  <label>Filtrar por Tarefa</label>
  <select id="task-filter" onchange="taskChanged(this)">
    <option value="all">Todas as tarefas</option>
    <!-- opções populadas dinamicamente -->
  </select>
</div>
```

### 4. taskChanged atualiza URL e re-renderiza

```javascript
window.taskChanged = function(select) {
  const p = new URLSearchParams(window.location.search);
  if (select.value === 'all') p.delete('task');
  else p.set('task', select.value);
  const qs = p.toString();
  history.replaceState(null, '', qs ? '?' + qs : window.location.pathname);
  render();
};
```

## Risks / Trade-offs

- [**Parâmetro `?task=` em turmas.html**] → A página ignora. Sem impacto funcional.
- [**bookmarks com ?task=Y ficam obsoletos**] → Se uma tarefa for renomeada, o bookmark quebra. Mesmo comportamento do `?org=`.
- [**Múltiplos filtros na URL**] → `?org=X&task=Y` pode ficar longo. Impacto visual aceitável.
