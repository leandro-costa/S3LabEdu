## Why

O código tem 5 pequenos problemas (code smells) que podem causar bugs, confusão ou experiência inconsistente. Nenhum é crítico, mas todos são fáceis de corrigir e melhoram a robustez do sistema.

## What Changes

1. **Corrigir `redirect_uri` hardcoded** em `login.html` — atualmente usa caminho fixo `/s3lab-infra/S3LabEdu/oauth-callback.html`, que só funciona no deploy atual. Deve ser dinâmico baseado em `window.location.origin`.

2. **Corrigir `deleteTaskRepo`** em `teacher/tarefas.html` — a função não chama a API do Gitea para excluir o repositório. Só desabilita o botão e re-renderiza.

3. **Corrigir link para `login-aluno.html`** em `task/index.html` — aponta para uma página que foi removida no refactor `unify-login-screens`. Deve apontar para `login.html`.

4. **Corrigir referências no README** que ainda mencionam `login-aluno.html` nas documentações de configuração.

5. **Melhorar feedback de erro** em botões de exclusão — unificar para usar mensagens no DOM em vez de `confirm()` + `alert()`, seguindo o padrão do resto do sistema.

## Capabilities

### New Capabilities
Nenhuma — todos os fixes são correções em funcionalidades existentes.

### Modified Capabilities
Nenhuma — não há mudança de comportamento especificado, apenas correções de implementação.

## Impact

- `login.html` — ajuste na construção da `redirect_uri`
- `teacher/tarefas.html` — `deleteTaskRepo` passa a chamar `deleteRepo` do Gitea
- `task/index.html` — link de login corrigido
- `README.md` — documentação atualizada
