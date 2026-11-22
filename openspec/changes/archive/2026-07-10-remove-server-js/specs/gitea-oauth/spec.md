## MODIFIED Requirements

### Requirement: Teacher login page initiates OAuth flow
A página de login do professor deve iniciar o fluxo de autenticação OAuth2 gerando o `code_verifier` e o `code_challenge` localmente no navegador, redirecionando o usuário diretamente para a URL de autorização do Gitea.

#### Scenario: Teacher clicks "Entrar com Gitea"
- **WHEN** o professor clica em "Entrar com Gitea" em `login-professor.html`
- **THEN** o cliente SHALL gerar um `code_verifier` criptográfico e o respectivo `code_challenge` usando a Web Crypto API, salvar o `code_verifier` no sessionStorage, e redirecionar o navegador para a URL de autorização do Gitea configurada com o `code_challenge` e `code_challenge_method=S256`

### Requirement: Client stores tokens after callback
O cliente deve processar o código de autorização recebido no redirecionamento de retorno (callback) do Gitea, realizar a troca pelo token de acesso diretamente com a instância do Gitea, e persistir as credenciais no sessionStorage.

#### Scenario: Tokens stored after successful auth
- **WHEN** o Gitea redireciona de volta para a página de callback do cliente com o código de autorização
- **THEN** o cliente SHALL recuperar o `code_verifier` armazenado, efetuar uma requisição POST direta ao endpoint de token do Gitea para obter o token de acesso e de atualização, e salvar `oauth_access_token`, `oauth_refresh_token` e `oauth_token_expiry` no sessionStorage

### Requirement: Client refreshes expired tokens
O cliente deve renovar o token de acesso expirado (ou próximo de expirar) diretamente com a API do Gitea usando o token de atualização.

#### Scenario: Token refresh before API call
- **WHEN** uma chamada de API está prestes a ser efetuada e o token atual expira em menos de 60 segundos
- **THEN** o cliente SHALL enviar uma requisição POST direta ao endpoint de token do Gitea usando o `oauth_refresh_token` armazenado e atualizar as credenciais no sessionStorage antes de prosseguir com a chamada original

## REMOVED Requirements

### Requirement: Server provides OAuth authorize redirect
- **Reason**: O fluxo de autorização agora é iniciado diretamente pelo navegador (client-side) gerando os desafios PKCE no próprio script frontend, sem necessidade de endpoint intermediário no servidor.
- **Migration**: O cliente gera os parâmetros e monta a URL do Gitea para redirecionar diretamente do navegador.

### Requirement: Server handles OAuth callback
- **Reason**: O servidor não processará mais o callback. A página de callback do Gitea redirecionará para uma página estática hospedada pelo frontend (ex: `index.html` ou `oauth-callback.html`), que extrairá o código e fará a troca de tokens diretamente com o Gitea.
- **Migration**: O código estático realiza a requisição POST para o Gitea de forma direta.

### Requirement: Server provides token refresh endpoint
- **Reason**: A atualização do token expirado passa a ocorrer diretamente entre o navegador do usuário e o Gitea.
- **Migration**: A função `refreshToken` no cliente executa a chamada POST diretamente contra o Gitea.
