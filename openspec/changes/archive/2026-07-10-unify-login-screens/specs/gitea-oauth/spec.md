## MODIFIED Requirements

### Requirement: Login page initiates OAuth flow with PKCE
The login page SHALL provide a form that collects only the Gitea URL and OAuth Client ID, and initiates the PKCE authorization flow.

#### Scenario: User clicks "Entrar com Gitea" with valid config
- **WHEN** user fills in Gitea URL and Client ID on `login.html` and clicks "Entrar com Gitea"
- **THEN** the client SHALL generate a PKCE code verifier and challenge, store the verifier together with the redirect_uri, gitea_url, and client_id in sessionStorage under `oauth_state_<state>`, and redirect the browser to Gitea's `/login/oauth/authorize` endpoint with the PKCE challenge, client_id, redirect_uri, and state

#### Scenario: User clicks "Entrar com Gitea" without Client ID
- **WHEN** user clicks "Entrar com Gitea" without filling in the Client ID
- **THEN** the client SHALL display an error message instructing the user to configure the Client ID

#### Scenario: Unified login page shows configured redirect URI
- **WHEN** the login page loads
- **THEN** it SHALL display the expected redirect URI (`window.location.origin + '/pages/academic/oauth-callback.html'`) so the user can configure it in Gitea

### Requirement: Client handles OAuth callback without form-provided user data
The client SHALL exchange the authorization code for tokens and obtain user info from the Gitea API, without relying on form-provided email or username.

#### Scenario: Successful callback with API data
- **WHEN** Gitea redirects to `/oauth-callback.html?code=<code>&state=<state>`
- **THEN** the client SHALL retrieve the stored state from sessionStorage, POST to `/login/oauth/access_token` (CORS-enabled) to exchange the code for an access token, GET `/api/v1/user` to obtain user info, and redirect to the appropriate dashboard based on the `restricted` flag

#### Scenario: API returns user data
- **WHEN** the GET `/api/v1/user` call succeeds
- **THEN** the client SHALL use `user.email` for the email and `user.login` for the username, stored in the appropriate sessionStorage keys depending on the user's role

### Requirement: Role detection from API
The system SHALL determine the user's role solely from the `restricted` attribute returned by the Gitea API.

#### Scenario: Restricted user is student
- **WHEN** `user.restricted === true`
- **THEN** the client SHALL store data in `student_email` and `student_gitea_user` and redirect to `student/dashboard.html`

#### Scenario: Non-restricted user is professor
- **WHEN** `user.restricted === false`
- **THEN** the client SHALL store data in `teacher_email` and `teacher_gitea_user` and redirect to `teacher/turmas.html`

## REMOVED Requirements

### Requirement: Server provides OAuth authorize redirect
**Reason**: `server.js` was removed in the `remove-server-js` change. The OAuth flow is now entirely client-side with PKCE (no server proxy needed).

### Requirement: Server handles OAuth callback
**Reason**: `server.js` was removed. Token exchange happens directly in the browser via CORS-enabled POST to Gitea's `/login/oauth/access_token`.

### Requirement: Server provides token refresh endpoint
**Reason**: `server.js` was removed. Token refresh happens directly in the browser via CORS-enabled POST to Gitea's `/login/oauth/access_token`.

### Requirement: Teacher login page initiates OAuth flow
**Reason**: Replaced by the unified `login.html` which serves both roles.

### Requirement: Client stores tokens after callback
**Reason**: Moved to using sessionStorage instead of localStorage for better security (tokens cleared when tab closes). Updated in the `remove-server-js` change.

### Requirement: Client refreshes expired tokens
**Reason**: Token refresh is now handled entirely client-side via CORS-enabled fetch to Gitea's token endpoint, without a server proxy.
