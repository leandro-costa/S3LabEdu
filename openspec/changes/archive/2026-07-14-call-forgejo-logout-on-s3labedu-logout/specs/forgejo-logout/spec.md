# Forgejo Logout

## Purpose
Server-side Forgejo session invalidation on S3LabEdu logout — revokes OAuth tokens and clears Forgejo session cookies.

## ADDED Requirements

### Requirement: OAuth token revocation on logout
The system SHALL call the Forgejo OAuth token revocation endpoint (`POST /login/oauth/revoke`) when the user initiates logout, using the stored access token.

#### Scenario: Successful token revocation
- **WHEN** user clicks "Sair" and the access token is valid
- **THEN** the system SHALL send `POST {gitea_url}/login/oauth/revoke` with `token={access_token}&token_type_hint=access_token` and receive a 200 response

#### Scenario: Token revocation fails (network error)
- **WHEN** user clicks "Sair" and the revocation request fails due to a network error
- **THEN** the system SHALL proceed with local logout and NOT block the user

#### Scenario: Token revocation with invalid/expired token
- **WHEN** user clicks "Sair" and the access token is already expired or invalid
- **THEN** the system SHALL proceed with local logout and NOT block the user

### Requirement: Forgejo web session logout after revocation
After token revocation, the system SHALL redirect the browser to Forgejo's `/logout` endpoint to clear server-side session cookies.

#### Scenario: Redirect to Forgejo logout
- **WHEN** token revocation completes (or fails best-effort)
- **THEN** the browser SHALL redirect to `{gitea_url}/logout?redirect={app_origin}/index.html`

#### Scenario: Return to app after logout
- **WHEN** Forgejo completes the logout
- **THEN** Forgejo SHALL redirect the browser back to `{app_origin}/index.html` via the `redirect` parameter
