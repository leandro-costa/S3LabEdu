## ADDED Requirements

### Requirement: Configuration settings for Gitea instance
O sistema deve permitir a configuração e salvamento na sessão (via sessionStorage) dos dados de integração com a instância do Gitea (URL da instância, Client ID e Client Secret).

#### Scenario: Save Gitea settings
- **WHEN** o usuário insere a URL do Gitea, Client ID e Client Secret nas configurações e clica em salvar
- **THEN** o sistema SHALL validar se a URL é válida e persistir as informações no `sessionStorage` sob as chaves `gitea_url`, `oauth_client_id` e `oauth_client_secret`

#### Scenario: Pre-populate settings on load
- **WHEN** a tela de login ou configurações do sistema é carregada
- **THEN** o sistema SHALL recuperar os valores salvos no `sessionStorage` (ou ler de um arquivo estático `config.js` caso configurado) e preencher os respectivos campos de formulário automaticamente
