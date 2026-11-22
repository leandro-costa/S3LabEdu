## Context

Atualmente, o projeto utiliza um servidor intermediário em Node.js (`server.js`) que serve duas funções críticas adicionais além de servir arquivos estáticos:
1. Servir como agente OAuth2 confidencial, armazenando o `OAUTH_CLIENT_SECRET` e efetuando a troca do código de autorização pelo token de acesso.
2. Servir como proxy reverso para contornar problemas de CORS nas requisições feitas à API do Gitea (redirecionando `/api/*` para o Gitea na porta 3000).

Para rodar o sistema 100% no navegador (servidor estático sem backend próprio), é necessário mover essas responsabilidades diretamente para o frontend.

## Goals / Non-Goals

**Goals:**
- Remover totalmente o arquivo `server.js` e a dependência de execução do Node.js no ambiente de produção.
- Implementar o fluxo de autenticação OAuth2 com PKCE (Proof Key for Code Exchange) diretamente no navegador utilizando a Web Crypto API nativa do HTML5.
- Substituir o proxy `/api/` por requisições diretas à URL configurada da API do Gitea.
- Adicionar uma interface de configuração amigável no frontend para parametrizar e persistir as variáveis do Gitea no `sessionStorage`.
- Substituir todas as instâncias e referências de persistência em disco via `localStorage` (turmas, tarefas, alunos, temas e tokens) por `sessionStorage`, de forma que nenhuma informação do usuário seja mantida após o fechamento da aba.
- Garantir compatibilidade com instâncias do Gitea self-hosted com CORS habilitado.

**Non-Goals:**
- Implementar armazenamento em banco de dados compartilhado.
- Desenvolver um servidor proxy alternativo em outra linguagem.
- Persistir dados do usuário localmente em disco após o encerramento da sessão de navegação.

## Decisions

### 1. Fluxo de Autenticação OAuth2 PKCE no Frontend
- **Decisão**: Utilizar a API criptográfica nativa do navegador (`window.crypto.subtle`) para gerar o `code_verifier` e o `code_challenge` de forma segura.
- **Alternativa Considerada**: Utilizar uma biblioteca de terceiros como `crypto-js`. **Razão de Rejeição**: A Web Crypto API é nativa, rápida e suportada por todos os navegadores modernos, eliminando dependências adicionais.
- **Funcionamento**:
  - Geração de 32 bytes aleatórios via `crypto.getRandomValues`.
  - Codificação dos bytes em formato Base64URL para obter o `code_verifier`.
  - Hash SHA-256 do `code_verifier` via `crypto.subtle.digest`.
  - Codificação do hash em formato Base64URL para obter o `code_challenge`.
  - O `code_verifier` e o `state` (número randômico único de controle) serão persistidos temporariamente em `sessionStorage`.

### 2. Configurações Dinâmicas e Estado Geral no sessionStorage
- **Decisão**: Criar um painel/modal de configurações na página de login (`index.html`) para gerenciar as credenciais da API do Gitea e substituir o uso do `localStorage` globalmente por `sessionStorage` para todas as funcionalidades.
- **Parâmetros de Integração**:
  - `gitea_url`: URL raiz do Gitea (ex: `http://localhost:3000`).
  - `oauth_client_id`: ID do cliente OAuth gerado no Gitea.
  - `oauth_client_secret`: Segredo do cliente OAuth (se exigido pela instância do Gitea).
  - `oauth_redirect_uri`: Computado dinamicamente no navegador baseado em `window.location.origin` (por exemplo: `window.location.origin + '/pages/academic/index.html'`) para facilitar a execução em qualquer porta local sem reconfiguração estática.
- **Armazenamento de Dados de Negócio**:
  - Todos os dados locais que anteriormente eram salvos de forma persistente (dados de turmas, alunos cadastrados em turmas locais, tarefas associadas e temas de cores) passarão a usar a API `sessionStorage`. Isso significa que os dados duram apenas enquanto a aba correspondente estiver ativa, mitigando riscos de vazamento de credenciais ou dados acadêmicos em computadores compartilhados.

### 3. Chamadas Diretas de API (Sem Proxy)
- **Decisão**: Modificar `components/gitea-api.js` para usar a URL completa do Gitea obtida de `gitea_url` + `/api/v1` em vez da rota de proxy relativo `/api/v1`.
- **Requisito do Servidor (Gitea)**: Para que as requisições diretas de origem cruzada funcionem no navegador, a instância do Gitea precisa estar configurada com CORS habilitado no arquivo de configuração do Gitea (`app.ini`):
  ```ini
  [cors]
  ENABLED = true
  ALLOW_DOMAIN = *
  ALLOW_METHODS = GET,POST,PUT,PATCH,DELETE,OPTIONS
  ALLOW_HEADERS = Content-Type,Authorization,Accept
  ```

### 4. Inicialização de Desenvolvimento Simplificada
- **Decisão**: Substituir a dependência do `node server.js` no script `start.ps1` por um comando que inicie um servidor HTTP estático leve, como `npx -y http-server` na porta padrão (ou na porta informada por parâmetro).

## Risks / Trade-offs

- **[Risk] Segurança das Credenciais** → O `OAUTH_CLIENT_SECRET` (se necessário) fica exposto no `sessionStorage` do navegador do usuário.
  - *Mitigação*: O risco é minimizado porque o armazenamento em `sessionStorage` é isolado por aba e limpo automaticamente quando o usuário encerra a sessão ou fecha a aba. Além disso, o usuário pode configurar o Gitea para registrar a aplicação como pública (sem segredo), eliminando totalmente este risco.
- **[Risk] Perda de Dados ao Fechar a Aba** → Como não é utilizado `localStorage`, dados de turmas locais e tarefas são perdidos ao recarregar a aba ou fechá-la.
  - *Mitigação*: Este é o comportamento desejado pelo usuário para evitar persistência permanente em disco. As tarefas e repositórios oficiais criados na organização do Gitea continuam existindo de forma permanente no servidor Gitea; apenas as definições de turmas locais e metadados de controle local são recriados a cada sessão de navegador.
- **[Risk] Bloqueio por CORS** → O navegador bloqueará as chamadas se o Gitea não tiver CORS habilitado.
  - *Mitigação*: A documentação do sistema e a tela de erro de conexão exibirão instruções claras de como habilitar a seção `[cors]` no `app.ini` do Gitea.
