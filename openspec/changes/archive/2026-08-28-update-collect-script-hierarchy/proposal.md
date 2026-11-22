## Why

O script de coleta atual gera uma pasta flat `coleta-YYYY-MM-DD-HHmm/<aluno>` sem hierarquia por turma/tarefa. Quando o professor leciona múltiplas turmas ou tarefas, as coletas se misturam no filesystem, dificultando organização, arquivamento e correção por turma. É necessário estruturar o script como `org/repo/coleta/aluno`.

## What Changes

- **BREAKING**: Script de coleta passa a criar hierarquia `org/repo/coleta-YYYY-MM-DD-HHmm/aluno` em vez de `coleta-YYYY-MM-DD-HHmm/aluno`.
- Script verifica/constrói a hierarquia com `mkdir -Force` (idempotente, cria `org` e `org/repo` recursivamente).
- Para cada aluno, se a pasta já existe, remove com `Remove-Item -Recurse -Force` antes de `git clone` (comportamento de sobrescrever).
- Extrai função `buildCollectScript(org, repo, tagName, forks)` para eliminar duplicação entre `collectForks` e `generateAndCopyScript`.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `fork-snapshot-collect`: Requisito "Teacher can copy a batch clone script" muda estrutura de pastas e semântica de sobrescrita.

## Impact

- `teacher/tarefas.html` — dois pontos de geração de script (linhas ~328 e ~400)
- `openspec/specs/fork-snapshot-collect/spec.md` — cenário do script
- Nenhuma mudança de API Gitea; apenas geração de script PowerShell no cliente
- Breaking para professores que automatizaram sobre o formato antigo (path flat)
