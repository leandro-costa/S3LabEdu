## 1. Create unified login page

- [x] 1.1 Create `pages/academic/login.html` — single form with only Gitea URL and Client ID fields, collapsible "Configuração Gitea" section, and "Entrar com Gitea" button
- [x] 1.2 In `login.html`, implement PKCE utilities (`generatePKCE`, `generateRandomString`, `base64URLEncode`) identical to current login pages
- [x] 1.3 In `login.html`, implement `startOAuth()` that stores only `{ verifier, redirect_uri, gitea_url, client_id }` in `oauth_state_<state>` (no email/gitea_user)
- [x] 1.4 In `login.html`, implement `updateRedirectUriDisplay()` showing `window.location.origin + '/pages/academic/oauth-callback.html'`
- [x] 1.5 In `login.html`, support query string params (`gitea_url`, `client_id`) for bookmark links

## 2. Update callback

- [x] 2.1 In `oauth-callback.html`, remove destructuring of `email` and `gitea_user` from the stored state object (line 56)
- [x] 2.2 In `oauth-callback.html`, change `finalEmail`/`finalUser` to use only API data: `const finalEmail = apiEmail || ''` and `const finalUser = apiUsername || ''`

## 3. Remove old pages and update links

- [x] 3.1 Delete `pages/academic/login-professor.html`
- [x] 3.2 Delete `pages/academic/login-aluno.html`
- [x] 3.3 Update `pages/academic/index.html` to link to `login.html` instead of `login-professor.html`
