## ADDED Requirements

### Requirement: API functions must verify Forgejo compatibility
Toda função de integração com a API do Gitea/Gitea SHALL ser verificada quanto à compatibilidade com Forgejo antes da implementação. Funções com comportamento divergente entre Gitea e Forgejo SHALL documentar essa diferença e tratar erros adequadamente.

#### Scenario: Endpoint testado em Forgejo antes da implementação
- **WHEN** uma nova função de API é adicionada ao módulo `gitea-api.js`
- **THEN** o desenvolvedor SHALL testar o endpoint contra uma instância Forgejo real
- **THEN** se o comportamento diferir do Gitea original, a função SHALL tratar o erro silenciosamente ou adaptar-se conforme a resposta

#### Scenario: Colaboração em forks respeita limitação do Forgejo
- **WHEN** o sistema precisa adicionar um colaborador a um fork de aluno
- **THEN** o sistema SHALL adicionar USUÁRIOS individuais (não organizações) como colaboradores, pois o Forgejo rejeita organizações como collaborator
- **THEN** a adição SHALL ser feita com o token do dono do fork (aluno)
- **THEN** falhas na adição SHALL ser silenciosas (catch) sem interromper o fluxo principal

#### Scenario: addTeamRepo em forks documentado como Forgejo-dependente
- **WHEN** `addTeamRepo` é chamado em um repositório fora da organização (fork de aluno)
- **THEN** o sistema SHALL tratar falhas silenciosamente, pois o comportamento varia entre versões do Forgejo

### Requirement: listOrgOwners descobre donos sem acessar times
O sistema SHALL prover uma função `listOrgOwners(orgName)` que descobre os proprietários (owners) de uma organização Forgejo usando o endpoint `GET /users/{username}/orgs/{org}/permissions`, sem depender de acesso a times (que é bloqueado para tokens de aluno).

#### Scenario: Donos descobertos via permissions endpoint
- **WHEN** `listOrgOwners("minha-org")` é chamada
- **THEN** a função SHALL listar membros paginado via `GET /orgs/{org}/members?limit=50`
- **THEN** a função SHALL verificar cada membro via `GET /users/{login}/orgs/{org}/permissions`
- **THEN** a função SHALL filtrar apenas os que têm `is_owner === true`
- **THEN** a função SHALL retornar `[{ login, id, full_name, avatar_url }]`

#### Scenario: Cache armazena donos no sessionStorage
- **WHEN** `listOrgOwners(orgName)` é chamada com sucesso
- **THEN** a função SHALL salvar o resultado em `sessionStorage` na chave `org_owners_{orgName}`
- **THEN** em chamadas subsequentes, a função SHALL retornar o cache sem fazer novas requisições

#### Scenario: Erro na descoberta não interrompe fluxo
- **WHEN** qualquer requisição dentro de `listOrgOwners` falha
- **THEN** a função SHALL retornar array vazio (`[]`)
- **THEN** a função SHALL não lançar exceção
