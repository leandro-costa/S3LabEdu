## 1. Corrigir ensureAlunosTeam em gitea-api.js

- [x] 1.1 Em `getTeamByName()`, tratar `listOrgTeams` retornar `null` ou `undefined` — retornar `null` em vez de quebrar
- [x] 1.2 Em `ensureAlunosTeam()`, após `createOrgTeam` retornar time sem `id`, adicionar `console.warn` com detalhes da resposta
- [x] 1.3 Em `ensureAlunosTeam()`, adicionar fallback `getTeamByName` quando `createOrgTeam` retornar time sem `id`
- [x] 1.4 Adicionar `console.error` com detalhes antes de lançar o erro final em `ensureAlunosTeam`
- [x] 1.5 Em `getTeamByName()`, tornar a comparação de nome case-insensitive (`t.name.toLowerCase() === teamName.toLowerCase()`) para evitar erro quando o Gitea cria o time com capitalização diferente (ex: "Alunos" vs "alunos")

## 2. Verificação

- [x] 2.1 Forçar cenário (remover time manualmente no Gitea e recriar via S3LabEdu) — confirmar que não aparece o erro falso
- [x] 2.2 Verificar no console do navegador os logs de diagnóstico
