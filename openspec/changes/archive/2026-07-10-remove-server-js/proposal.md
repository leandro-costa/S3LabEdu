## Why

O atual servidor Node.js (`server.js`) funciona como um intermediário para servir os arquivos estáticos, realizar o fluxo OAuth2 com o Gitea (usando segredos no servidor) e atuar como proxy reverso para as chamadas de API do Gitea. A remoção do `server.js` simplifica a arquitetura para um modelo puramente cliente-side (Single Page Application estática) rodando inteiramente no navegador, permitindo a hospedagem simplificada em qualquer servidor estático ou serviço de hospedagem estática, integrando-se diretamente com o Gitea do usuário (self-hosted).

## What Changes

- **Remoção de Código de Servidor**: Remoção completa do arquivo [server.js](file:///D:/IFBA/OCI/vibe-code/academic-gitea-js-system/remove-server-agy/server.js).
- **Substituição do Proxy Reverso**: Chamadas da API do Gitea deixarão de passar pelo proxy `/api/` e serão enviadas diretamente à URL da instância do Gitea configurada.
- **Configuração no Cliente**: Introdução de persistência em `sessionStorage` de parâmetros de configuração do Gitea (`gitea_url`, `oauth_client_id`, `oauth_client_secret`).
- **Autenticação Client-Side**: Implementação do fluxo de autorização OAuth2 com PKCE inteiramente no navegador usando a API nativa Web Crypto, dispensando dependências de servidor.
- **Simplificação de Inicialização**: Atualização do script de inicialização `start.ps1` para usar um servidor estático leve (por exemplo, `npx http-server`).
- **Escopo de Sessão**: Todos os dados do aplicativo (turmas, tarefas, alunos e tokens) serão persistidos temporariamente em `sessionStorage`, fazendo com que as informações expirem assim que a aba do navegador for fechada (sem persistência permanente em disco).
- **BREAKING**: Requer que a instância do Gitea correspondente esteja configurada com cabeçalhos CORS (Cross-Origin Resource Sharing) habilitados para permitir requisições de origem cruzada a partir do domínio da aplicação cliente.

## Capabilities

### New Capabilities
- `gitea-config`: Interface visual ou modal de configuração para que professores e administradores possam parametrizar os dados da instância self-hosted do Gitea (`URL`, `Client ID`, `Client Secret`) diretamente pelo navegador, com persistência temporária no `sessionStorage`.

### Modified Capabilities
- `gitea-oauth`: O fluxo de login e callback do OAuth2 será realizado completamente no navegador (client-side) utilizando PKCE (`code_challenge` e `code_verifier` gerados via Web Crypto API), trocando o código por token diretamente no Gitea.
- `gitea-bridge`: O módulo `gitea-api.js` consultará as configurações de URL da API diretamente do `sessionStorage` (ou de um arquivo de configuração estático opcional `config.js`) e efetuará chamadas HTTP (incluindo atualização automática de token) apontando diretamente para o endpoint real do Gitea.

## Impact

- **Código Estático**: O projeto torna-se uma aplicação HTML/JS 100% estática.
- **Dependências**: Elimina-se a necessidade do runtime do Node.js (exceto para servir estáticos no ambiente de desenvolvimento).
- **CORS do Gitea**: A instância self-hosted do Gitea precisará ter CORS habilitado (seção `[cors]` em seu `app.ini`) para permitir chamadas do navegador.
- **Ciclo de Vida dos Dados**: Como os dados (como turmas e tarefas locais) agora residem no `sessionStorage`, fechar a aba do navegador resultará em logout e limpeza de todo o estado local (turmas, alunos matriculados, tarefas associadas e tokens).
- **Segurança**: As credenciais OAuth (Client ID / Client Secret) e tokens serão mantidos apenas na memória da sessão (`sessionStorage`) no próprio navegador do usuário, o que é mais seguro do que `localStorage` pois não há persistência em disco após o encerramento da sessão.
