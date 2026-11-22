## MODIFIED Requirements

### Requirement: Gitea API module manages the OAuth access token
O módulo de API do Gitea deve gerenciar o token de acesso obtido via sessionStorage, incluindo a verificação de expiração e renovação direta contra o endpoint do Gitea configurado na sessão.

#### Scenario: Access token retrieved from localStorage
- **WHEN** o módulo precisa autenticar uma chamada de API do Gitea
- **THEN** ele SHALL recuperar o token de `sessionStorage.getItem('oauth_access_token')` e injetá-lo nos cabeçalhos HTTP como `Bearer`

#### Scenario: Token automatically refreshed when expired
- **WHEN** o token está expirado ou próximo da expiração (menos de 60 segundos)
- **THEN** o módulo SHALL efetuar a chamada direta de renovação de token no Gitea usando o refresh token e em seguida reexecutar a requisição de API com o novo token
