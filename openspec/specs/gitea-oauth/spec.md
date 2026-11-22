# Gitea OAuth

## Purpose
Gitea OAuth 2.0 authentication flow for teachers — redirect to Gitea authorize URL, callback handler, token exchange and storage, refresh token support, and logout/token revocation.

## Requirements

### Requirement: Server provides OAuth authorize redirect
The server SHALL expose a `GET /api/oauth/login` endpoint that redirects the user to Gitea's OAuth authorization URL with the correct client ID, redirect URI, and PKCE challenge.

#### Scenario: OAuth login redirect
- **WHEN** teacher visits `/api/oauth/login`
- **THEN** the server SHALL redirect to Gitea's OAuth authorize endpoint with `response_type=code`, `client_id`, `redirect_uri`, `code_challenge`, and `code_challenge_method=S256`

### Requirement: Server handles OAuth callback
The server SHALL expose a `GET /api/oauth/callback` endpoint that accepts the authorization code, exchanges it for an access token and refresh token using the client secret, and returns the tokens to the client.

#### Scenario: Successful callback
- **WHEN** Gitea redirects to `/api/oauth/callback?code=<auth_code>`
- **THEN** the server SHALL POST to Gitea's token endpoint with the authorization code, client ID, client secret, and redirect URI, and return the access token, refresh token, and expiry in the JSON response

#### Scenario: Callback with invalid code
- **WHEN** Gitea redirects to `/api/oauth/callback?code=<invalid_code>`
- **THEN** the server SHALL return a 400 error with an error description

### Requirement: Server provides token refresh endpoint
The server SHALL expose a `POST /api/oauth/refresh` endpoint that accepts a refresh token and returns a new access token.

#### Scenario: Successful token refresh
- **WHEN** client sends `POST /api/oauth/refresh` with `{ "refresh_token": "<token>" }`
- **THEN** the server SHALL POST to Gitea's token refresh endpoint and return the new access token, refresh token, and expiry

### Requirement: Teacher login page initiates OAuth flow
The teacher login page SHALL provide a button that redirects to `/api/oauth/login`, generating a PKCE code verifier and challenge before the redirect, and storing the verifier in sessionStorage.

#### Scenario: Teacher clicks "Entrar com Gitea"
- **WHEN** teacher clicks "Entrar com Gitea" on `login-professor.html`
- **THEN** the client SHALL generate a PKCE code verifier and challenge, store the verifier in sessionStorage, and redirect to `/api/oauth/login?code_challenge=<challenge>`

### Requirement: Client stores tokens after callback
The client SHALL store the access token, refresh token, and expiry returned from the callback in localStorage.

#### Scenario: Tokens stored after successful auth
- **WHEN** client receives tokens from `/api/oauth/callback`
- **THEN** the access token, refresh token, and expiry SHALL be persisted in localStorage under keys prefixed with `oauth_`

### Requirement: Client refreshes expired tokens
The client SHALL automatically refresh the access token when it expires, using the stored refresh token.

#### Scenario: Token refresh before API call
- **WHEN** an API call is about to be made and the access token is expired or expires within 60 seconds
- **THEN** the client SHALL call `POST /api/oauth/refresh` with the stored refresh token before proceeding with the API call

### Requirement: Client revokes OAuth tokens on logout
The client SHALL attempt to revoke the OAuth access token on the Forgejo server when the user initiates logout, before clearing local storage.

#### Scenario: OAuth token revoked on logout
- **WHEN** user initiates logout and the access token is stored in sessionStorage
- **THEN** the client SHALL send `POST {gitea_url}/login/oauth/revoke` with `token={access_token}&token_type_hint=access_token`
- **AND** the client SHALL NOT block the logout if revocation fails

### Requirement: Client redirects to Forgejo web logout after revocation
After token revocation, the client SHALL redirect the browser to Forgejo's `/user/logout` endpoint to clear server-side session cookies.

#### Scenario: Forgejo web logout triggered
- **WHEN** token revocation is attempted (success or failure)
- **THEN** the browser SHALL redirect to `{gitea_url}/user/logout?redirect={origin}/index.html`
