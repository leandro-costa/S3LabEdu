## ADDED Requirements

### Requirement: Formulário de contato autossuficiente
O componente `<app-contact-form>` SHALL exibir formulário com campos nome, e-mail e telefone, validar e exibir feedback.

#### Scenario: Formulário renderizado
- **WHEN** `<app-contact-form>` é inserido no DOM
- **THEN** contém inputs para nome, e-mail e telefone com placeholders e botão de envio

#### Scenario: Submit sem backend
- **WHEN** todos os campos são preenchidos e o formulário é enviado
- **THEN** o reload é prevenido, mensagem "Obrigado!" é exibida e os campos são resetados

### Requirement: Evento customizado de submit
O componente SHALL disparar evento `contact-submit` com dados do formulário.

#### Scenario: Evento disparado
- **WHEN** o formulário é submetido com sucesso
- **THEN** um evento `contact-submit` com `{name, email, phone}` no `detail` SHALL ser disparado
