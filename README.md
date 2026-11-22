# S3LabEdu

> Guia de Configuração da Autenticação Gitea
> Sistema de Tarefas — IFBA (serverless)
> Versão: PKCE OAuth 2.0 no navegador, sem servidor Node.js

---

## Índice

1. [Visão Geral da Arquitetura](#1-visão-geral-da-arquitetura)
2. [Configuração do Gitea (app.ini)](#2-configuração-do-gitea-appini)
3. [Criação do OAuth App](#3-criação-do-oauth-app)
4. [Configuração de Usuários](#4-configuração-de-usuários)
5. [Configuração no Frontend](#5-configuração-no-frontend)
6. [Iniciando o Sistema](#6-iniciando-o-sistema)
7. [Fluxo Completo de Autenticação](#7-fluxo-completo-de-autenticação)
8. [Solução de Problemas](#8-solução-de-problemas)
9. [Referência das Variáveis de Sessão](#9-referência-das-variáveis-de-sessão)

---

## 1. Visão Geral da Arquitetura

```
┌──────────────────────────────────────────────────────────┐
│                    Navegador (cliente)                    │
│                                                          │
│  ┌──────────┐    ┌──────────────┐    ┌────────────────┐  │
│  │ Página de │    │ oauth-callback│   │  Dashboard /    │  │
│  │   Login   │───▶│   .html      │───▶│  Páginas        │  │
│  └──────────┘    └──────┬───────┘    └────────────────┘  │
│        │                 │                    ▲           │
│        │  ① redirect    │  ② POST + CORS     │  ③ API     │
│        ▼                 ▼                    │  (CORS)    │
├──────────────────────────────────────────────┼───────────┤
│                    Internet                  │           │
└──────────────────────────────────────────────┼───────────┘
                                               │
┌──────────────────────────────────────────────▼───────────┐
│                 Servidor Gitea (self-hosted)              │
│                                                          │
│  Porta 3000 (padrão)                                     │
│  app.ini → [cors] ENABLED = true                         │
│                                                          │
│  Endpoints usados:                                       │
│  • GET  /login/oauth/authorize        ← redirect browser │
│  • POST /login/oauth/access_token     ← troca código     │
│  • GET  /api/v1/user                  ← info do usuário  │
│  • GET  /api/v1/...                   ← API do sistema   │
└──────────────────────────────────────────────────────────┘
```

**Nota:** O `server.js` foi removido. Não há proxy nem backend.
O frontend faz chamadas **diretas** ao Gitea. Isso requer CORS habilitado.

---

## 2. Configuração do Gitea (app.ini)

Localize o arquivo `app.ini` do Gitea. Localizações comuns:

| Instalação | Caminho |
|------------|---------|
| Docker | `/data/gitea/conf/app.ini` |
| Linux (apt) | `/etc/gitea/app.ini` |
| Windows | `C:\ProgramData\Gitea\conf\app.ini` |
| Binário | `./custom/conf/app.ini` |

### 2.1 CORS (obrigatório)

Adicione ou descomente a seção `[cors]`:

```ini
[cors]
ENABLED = true
ALLOWED_ORIGINS = *
```

> ⚠️ `ALLOWED_ORIGINS = *` é adequado para desenvolvimento.
> Em produção, restrinja ao domínio do sistema:
> ```ini
> ALLOWED_ORIGINS = http://meudominio:8080
> ```

### 2.2 Servidor (recomendado)

```ini
[server]
DOMAIN           = localhost
HTTP_PORT        = 3000
ROOT_URL         = http://localhost:3000/
DISABLE_SSH      = false
SSH_DOMAIN       = localhost
START_SSH_SERVER = false
```

### 2.3 Segurança (recomendado para OAuth)

```ini
[security]
INSTALL_LOCK = true
# Mantenha o SECRET_KEY gerado automaticamente na instalação
```

### 2.4 Reiniciar o Gitea

Após alterar o `app.ini`, reinicie o Gitea:

```bash
# Docker
docker restart gitea

# Linux (systemd)
sudo systemctl restart gitea

# Windows (serviço)
net stop gitea && net start gitea
```

---

## 3. Criação do OAuth App

### 3.1 Acessar configurações

1. Faça login no Gitea como **administrador**
2. Vá para: **Settings** (⚙️) → **Applications** → **OAuth2 Applications**
3. Clique em **"Create a new OAuth2 Application"**

### 3.2 Preencher o formulário

| Campo | Valor |
|-------|-------|
| **Application Name** | `Sistema de Tarefas` |
| **Redirect URI** | `http://localhost:8080/pages/academic/oauth-callback.html` |

> 🔄 A porta (8080) deve ser a mesma do servidor estático.
> O path deve ser exatamente este, incluindo `/pages/academic/oauth-callback.html`.

Exemplos para outras portas:
```
http://localhost:5500/pages/academic/oauth-callback.html   # Live Server
http://localhost:5501/pages/academic/oauth-callback.html   # Live Server (outra)
http://localhost:3000/pages/academic/oauth-callback.html   # Mesma porta do Gitea
```

> ⚠️ **Importante:** O `redirect_uri` deve ser **idêntico** ao enviado na
> requisição de autorização. O frontend constrói este valor dinamicamente
> como `window.location.origin + '/pages/academic/oauth-callback.html'`.
> Certifique-se de que a URL configurada no Gitea corresponde exatamente
> ao que o navegador usará (incluindo `http://` ou `https://`, porta, path).

### 3.3 Copiar o Client ID

Após criar, o Gitea mostrará:

- **Client ID**: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` ← COPIE ISSO
- **Client Secret**: `gto_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

> 🔑 Com PKCE, o **Client Secret não é necessário**. O fluxo roda
> inteiramente no navegador sem expor segredos. Guarde apenas o **Client ID**.

---

## 4. Configuração de Usuários

### 4.1 Papéis no sistema

O sistema detecta o papel automaticamente baseado no atributo `restricted`
do usuário no Gitea:

| Papel | restricted | Acesso |
|-------|:----------:|--------|
| **Professor** | `false` | Gerenciar turmas, tarefas, acompanhamento |
| **Aluno** | `true` | Dashboard, tarefas, fork de repositórios |

### 4.2 Criar professor

1. No Gitea, vá em **Site Administration** → **Users** → **Create User**
2. Preencha: login, email, senha
3. **Desmarque** "Restricted" (ou deixe como `false`)
4. O usuário terá acesso de leitura/escrita a organizações que criar

### 4.3 Criar aluno

Para criar alunos com acesso restrito:

1. **Opção A — Via interface:**
   - Em **Site Administration** → **Users** → **Create User**
   - Marque a opção **"This user is a restricted user"**

2. **Opção B — Via API** (útil para matrícula em lote):
   ```bash
   # Criar usuário
   curl -X POST http://localhost:3000/api/v1/admin/users \
     -H "Authorization: token SEU_TOKEN_ADMIN" \
     -H "Content-Type: application/json" \
     -d '{
       "login": "aluno.nome",
       "email": "aluno@email.br",
       "password": "senha123",
       "restricted": true
     }'
   ```

> ✅ Alunos restritos **não podem criar organizações**, apenas forkam
> repositórios e enviam pull requests. É o comportamento desejado.

---

## 5. Configuração no Frontend

A configuração é feita pela interface do próprio sistema, na seção
**"Configuração Gitea"** (expandível) das páginas de login.

### 5.1 Dados necessários

| Campo | Onde obter | Exemplo |
|-------|------------|---------|
| **URL do Gitea** | URL base da instância | `http://localhost:3000` |
| **Client ID** | OAuth App criado no passo 3 | `8587e139-4fef-...` |

### 5.2 Onde configurar

#### Opção A — Pela interface

1. Abra `http://localhost:8080/pages/academic/` no navegador
2. Clique em **"Entrar com Gitea"** (card único na página inicial)
3. Expanda a seção **"Configuração Gitea"**
4. Preencha:
   - **URL do Gitea**: `http://localhost:3000`
   - **Client ID**: o valor copiado do OAuth App
5. Preencha email e usuário Gitea
6. Clique em **"Entrar com Gitea"**

#### Opção B — Link de favoritos (query string)

Você pode criar um link de favorito já com todos os dados preenchidos
usando parâmetros na URL:

```
http://localhost:8080/pages/academic/login-professor.html?gitea_url=http://localhost:3000&client_id=SEU_CLIENT_ID&email=professor@email.br&user=professor
```

Parâmetros disponíveis:

| Parâmetro | Descrição |
|-----------|-----------|
| `gitea_url` | URL base do Gitea |
| `client_id` | Client ID do OAuth App |
| `email` | Email do usuário (opcional) |
| `user` | Login do usuário no Gitea (opcional) |

Exemplo completo (professor):
```
http://localhost:8080/pages/academic/login-professor.html?gitea_url=http://localhost:3000&client_id=8587e139-4fef-4a1d-87cf-14b0b0c03215&email=professor@ifba.edu.br&user=professor
```

Exemplo completo (aluno):
```
http://localhost:8080/pages/academic/login.html?gitea_url=http://localhost:3000&client_id=8587e139-4fef-4a1d-87cf-14b0b0c03215&email=aluno@ifba.edu.br&user=aluno
```

> O papel (professor ou aluno) é detectado **automaticamente** após a
> autenticação, consultando a API do Gitea. Se o usuário tiver a flag
> `restricted = true`, será direcionado ao dashboard do aluno;
> caso contrário, ao painel do professor.

### 5.3 Como os dados são armazenados

Os dados de configuração ficam em `sessionStorage` no navegador:

| Chave | Valor | Exemplo |
|-------|-------|---------|
| `gitea_url` | URL do Gitea | `http://localhost:3000` |
| `gitea_base_url` | URL da API | `http://localhost:3000/api/v1` |
| `oauth_client_id` | Client ID OAuth | `8587e139-...` |

> ℹ️ `sessionStorage` persiste os dados enquanto a aba do navegador
> estiver aberta. Se fechar a aba, será necessário reconfigurar.

---

## 6. Iniciando o Sistema

### 6.1 Pré-requisitos

- Node.js instalado (para `npx serve`)
- Gitea rodando e acessível
- CORS configurado no Gitea (passo 2)
- OAuth App criado (passo 3)

### 6.2 Iniciar o servidor estático

```powershell
# Windows (PowerShell)
.\start.ps1

# Com porta customizada
.\start.ps1 -Port 5501
```

Ou manualmente com `npx serve`:

```bash
npx serve . -l 8080 --cors
```

### 6.3 Acessar o sistema

Abra no navegador:

```
http://localhost:8080/pages/academic/
```

### 6.4 Verificar conectividade

Antes de tentar o login, verifique se o Gitea está acessível:

```bash
# Teste 1: API do Gitea responde?
curl http://localhost:3000/api/v1/version
# → {"data":{"version":"1.22.0"}}

# Teste 2: CORS está funcionando? (via navegador)
# Abra o console do navegador e execute:
# fetch('http://localhost:3000/api/v1/version')
#   .then(r => r.json())
#   .then(console.log)
# → Se funcionar, CORS está OK
```

---

## 7. Fluxo Completo de Autenticação

### 7.1 Diagrama do fluxo

```
Navegador                              Gitea
─────────                              ─────
    │                                     │
    │ ① Gera PKCE verifier + challenge   │
    │   Armazena verifier em              │
    │   sessionStorage (oauth_state_XXX)  │
    │                                     │
    │ ② GET /login/oauth/authorize       │
    │   ?client_id=...                    │
    │   &redirect_uri=...                 │
    │   &response_type=code               │
    │   &code_challenge=...               │
    │   &code_challenge_method=S256       │
    │   &state=XXX                        │
    │────────────────────────────────────▶│
    │                                     │
    │         (usuário autoriza)          │
    │                                     │
    │ ③ Redireciona para callback        │
    │   ?code=YYY&state=XXX              │
    │◀────────────────────────────────────│
    │                                     │
    │ ④ Lê verifier do sessionStorage    │
    │   (remove oauth_state_XXX)          │
    │                                     │
    │ ⑤ POST /login/oauth/access_token   │
    │   (CORS!)                          │
    │   client_id=...                     │
    │   code=YYY                          │
    │   redirect_uri=...                  │
    │   grant_type=authorization_code     │
    │   code_verifier=...                 │
    │────────────────────────────────────▶│
    │                                     │
    │ ⑥ Resposta: access_token +         │
    │   refresh_token + expires_in         │
    │◀────────────────────────────────────│
    │                                     │
    │ ⑦ Salva tokens em sessionStorage   │
    │                                     │
    │ ⑧ GET /api/v1/user                 │
    │   (Authorization: Bearer token)     │
    │────────────────────────────────────▶│
    │                                     │
    │ ⑨ Resposta: { login, email,        │
    │    restricted, ... }                │
    │◀────────────────────────────────────│
    │                                     │
    │ ⑩ Detecta papel:                   │
    │    restricted=true → Aluno          │
    │    restricted=false → Professor     │
    │                                     │
    │ ⑪ Redireciona para dashboard       │
    │                                     │
```

### 7.2 Refresh do token

Quando o token expira (próximo do `expires_in`), o `gitea-api.js`
automaticamente chama o refresh:

```
POST /login/oauth/access_token
  client_id=...
  grant_type=refresh_token
  refresh_token=xxx
```

> Requer CORS no Gitea (mesmo endpoint do token).

---

## 8. Solução de Problemas

### 8.1 Erro: "CORS" / "Failed to fetch"

**Causa:** Gitea sem CORS habilitado.

**Solução:**
```ini
# app.ini
[cors]
ENABLED = true
ALLOWED_ORIGINS = *
```
Reinicie o Gitea após alterar.

### 8.2 Erro: "redirect_uri mismatch"

**Causa:** O redirect_uri configurado no Gitea não corresponde ao que o
navegador está enviando.

**Solução:**
1. Verifique qual URL o navegador está gerando (expandindo "Configuração
   Gitea" → o texto exato do `redirect_uri` é exibido)
2. Atualize o OAuth App no Gitea com esta URL exata, incluindo porta e path
3. Certifique-se de que não há barra final (`/`) na URL

### 8.3 Erro: "state não encontrado"

**Causa:** A sessão expirou ou o `sessionStorage` foi limpo entre o redirect
de ida e volta.

**Solução:**
- O fluxo OAuth deve acontecer na **mesma aba** do navegador
- Feche abas e tente novamente
- Verifique se o navegador não está bloqueando `sessionStorage`

### 8.4 Erro: "Sessão expirada" ao carregar página

**Causa:** Token expirou e refresh também falhou.

**Solução:** Faça login novamente.

### 8.5 Erro 403/401 nas chamadas da API

**Causa:** Token inválido ou usuário sem permissão.

**Solução:**
1. Verifique se o token ainda é válido (`oauth_token_expiry` no sessionStorage)
2. Verifique se o usuário Gitea tem permissão de leitura na organização/repo
3. Para professores: o usuário precisa ser owner das organizações
4. Para alunos: o usuário precisa ser membro do time "alunos" da organização

### 8.6 Aluno não consegue ver tarefas

**Causa:** Aluno não está em nenhuma organização.

**Solução:** O professor precisa adicionar o aluno à organização/turma
pela página de "Alunos da Turma".

### 8.7 Docker: Verificar logs do Gitea

```bash
docker logs gitea --tail 50
docker exec -it gitea cat /data/gitea/conf/app.ini
```

---

## 9. Referência das Variáveis de Sessão

Tudo é armazenado em `sessionStorage` do navegador (limpo ao fechar a aba).

### Autenticação

| Chave | Criado por | Descrição |
|-------|-----------|-----------|
| `oauth_access_token` | oauth-callback.html | Token de acesso Bearer |
| `oauth_refresh_token` | oauth-callback.html | Token para refresh |
| `oauth_token_expiry` | oauth-callback.html | Timestamp de expiração (ms) |
| `oauth_state_{state}` | Página de login | Verifier PKCE (removido pós-uso) |

### Dados do usuário

| Chave | Criado por | Descrição |
|-------|-----------|-----------|
| `teacher_email` | login-professor.html | Email do professor |
| `teacher_gitea_user` | login-professor.html | Login Gitea do professor |
| `student_email` | login.html | Email do aluno |
| `student_gitea_user` | login.html | Login Gitea do aluno |

### Configuração

| Chave | Criado por | Descrição |
|-------|-----------|-----------|
| `gitea_url` | Página de login | URL base do Gitea |
| `gitea_base_url` | oauth-callback.html | URL da API (`gitea_url` + `/api/v1`) |
| `oauth_client_id` | Página de login | Client ID do OAuth App |

### Cache (recarregado da API se vazio)

| Chave | Criado por | Descrição |
|-------|-----------|-----------|
| `academic_classes` | turmas.html | Organizações do professor |
| `academic_tasks_cache` | tarefas.html | Tarefas do professor |
| `academic_enrollments_{org}` | turma-alunos.html | Membros da turma |
| `student_orgs_cache` | student/dashboard.html | Organizações do aluno |
| `student_tasks_cache` | student/dashboard.html | Tarefas disponíveis |

### Preferências

| Chave | Criado por | Descrição |
|-------|-----------|-----------|
| `theme` | ui-theme-picker.js | Tema visual (brown, blue, green, dark) |

---

## Apêndice A: Exemplo de app.ini completo

```ini
[server]
DOMAIN    = localhost
HTTP_PORT = 3000
ROOT_URL  = http://localhost:3000/

[cors]
ENABLED          = true
ALLOWED_ORIGINS  = *
ALLOWED_METHODS  = GET,POST,PUT,DELETE,OPTIONS
ALLOWED_HEADERS  = Content-Type,Authorization
MAX_AGE          = 600

[security]
INSTALL_LOCK = true

[oauth2]
ENABLE = true
```

## Apêndice B: Exemplo de Docker Compose

```yaml
version: "3"
services:
  gitea:
    image: gitea/gitea:latest
    container_name: gitea
    ports:
      - "3000:3000"
      - "22:22"
    volumes:
      - ./gitea-data:/data
    environment:
      - USER_UID=1000
      - USER_GID=1000
      - GITEA__server__DOMAIN=localhost
      - GITEA__server__HTTP_PORT=3000
      - GITEA__server__ROOT_URL=http://localhost:3000/
      - GITEA__cors__ENABLED=true
      - GITEA__cors__ALLOWED_ORIGINS=*
    restart: unless-stopped
```

> ℹ️ Usando variáveis de ambiente `GITEA__{section}__{key}` é possível
> configurar CORS sem editar o `app.ini` manualmente.

