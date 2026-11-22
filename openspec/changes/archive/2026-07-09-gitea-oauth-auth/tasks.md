## 1. Server-side OAuth endpoints

- [x] 1.1 Parse OAuth configuration from environment variables (GITEA_URL, OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, OAUTH_REDIRECT_URI) in server.js
- [x] 1.2 Implement `GET /api/oauth/login` endpoint that generates PKCE challenge and redirects to Gitea's authorize URL
- [x] 1.3 Implement `GET /api/oauth/callback` endpoint that exchanges the authorization code for tokens using the client secret
- [x] 1.4 Implement `POST /api/oauth/refresh` endpoint that uses a refresh token to obtain a new access token

## 2. Update teacher login page

- [x] 2.1 Replace token-paste form in `login-professor.html` with "Entrar com Gitea" button
- [x] 2.2 Add PKCE code verifier/challenge generation and redirect to `/api/oauth/login`
- [x] 2.3 Handle callback response: store tokens in localStorage, redirect to teacher dashboard
- [x] 2.4 Show clear error messages if Gitea is unreachable or OAuth app is not configured

## 3. Update Gitea API module

- [x] 3.1 Modify `getToken()` to retrieve the OAuth access token from `localStorage.getItem('oauth_access_token')` instead of the hardcoded fallback
- [x] 3.2 Remove `setToken()` and `clearToken()` functions
- [x] 3.3 Simplify `listOrganizations()` to remove the `owner` parameter — always call `/user/orgs`
- [x] 3.4 Add automatic token refresh: when `_fetch()` gets a 401, call refresh endpoint and retry
- [x] 3.5 Update exported functions list

## 4. Update callers

- [x] 4.1 Update `turmas.html` to call `listOrganizations()` without owner argument
- [x] 4.2 Update `tarefas.html` to call `listOrganizations()` without owner argument

## 5. Start script and documentation

- [x] 5.1 Create `.env.example` with OAuth configuration variables
- [x] 5.2 Add instructions for creating a Gitea OAuth application in the Gitea admin UI
