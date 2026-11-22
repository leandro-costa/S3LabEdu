## 1. Configuração da Instância do Gitea no Frontend

- [x] 1.1 Criar componente visual ou modal de configurações na página de login (`index.html`) para entrada dos campos `gitea_url`, `oauth_client_id` e `oauth_client_secret`
- [x] 1.2 Implementar script de persistência para salvar as configurações no `sessionStorage` e carregá-las ao inicializar a página
- [x] 1.3 Atualizar os links de login para usar a URL do Gitea configurada dinamicamente no `sessionStorage` em vez de rotas relativas do servidor anterior

## 2. Implementação do Fluxo Criptográfico PKCE

- [x] 2.1 Criar utilitário JavaScript para gerar uma string aleatória (para o `code_verifier` e o `state`) usando `crypto.getRandomValues`
- [x] 2.2 Criar utilitário JavaScript para computar o hash SHA-256 do verifier e convertê-lo em Base64URL para obter o `code_challenge` usando `crypto.subtle.digest`
- [x] 2.3 Atualizar a lógica do botão de login em `login-professor.html` para executar a geração PKCE, salvar o `code_verifier` no `sessionStorage` e redirecionar diretamente para a URL de autorização do Gitea

## 3. Página de Callback do OAuth2 no Cliente

- [x] 3.1 Criar a página HTML estática de callback (ex: `/pages/academic/oauth-callback.html` ou ajustar `index.html` para detectar parâmetros) que receba as query parameters `code` e `state`
- [x] 3.2 Implementar lógica na página de callback para validar o `state` contra o guardado no `sessionStorage`, ler o `code_verifier` correspondente e efetuar o POST de troca direto contra o endpoint `/login/oauth/access_token` do Gitea
- [x] 3.3 Efetuar chamada subsequente a `/api/v1/user` a partir do callback para detectar o papel do usuário (student/teacher), salvar as informações finais de token no `sessionStorage` e realizar o redirecionamento para o dashboard correspondente

## 4. Atualização do Módulo Gitea Bridge (gitea-api.js) e UI para sessionStorage

- [x] 4.1 Atualizar a função `getBaseUrl` para apontar diretamente para a URL do Gitea configurada mais o sufixo `/api/v1`
- [x] 4.2 Reescrever a função `refreshToken` para fazer a requisição de atualização POST direta ao Gitea, sem intermediação do servidor
- [x] 4.3 Substituir globalmente o uso de `localStorage` por `sessionStorage` no módulo `gitea-api.js` e em todas as telas HTML e componentes da aplicação (incluindo turmas, tarefas, alunos matriculados e temas de cor)

## 5. Limpeza e Inicialização com Servidor Estático

- [x] 5.1 Apagar o arquivo `server.js` do projeto
- [x] 5.2 Modificar o script de inicialização `start.ps1` para usar o servidor estático leve (exemplo: `npx -y http-server` ou `python -m http.server`) apontando para a pasta raiz, permitindo que a aplicação seja servida estaticamente no navegador
- [x] 5.3 Adicionar seção de instruções no README explicando como o usuário deve configurar a seção `[cors]` em seu arquivo `app.ini` do Gitea self-hosted para viabilizar as chamadas cliente-side
