// opencode-chat.js - Usa SDK @opencode-ai/sdk via session.prompt()
// Lê prompt de /tmp/opencode-prompt.txt

const fs = require('fs');

async function main() {
  const model = process.env.MODEL || 'opencode/deepseek-v4-flash-free';
  const [providerID, ...rest] = model.split('/');
  const modelID = rest.join('/');
  const promptText = fs.readFileSync('/tmp/opencode-prompt.txt', 'utf8');

  const { createOpencodeClient } = await import('@opencode-ai/sdk');
  const client = createOpencodeClient({ baseUrl: 'http://127.0.0.1:4096' });

  // Aguardar servidor
  let connected = false;
  for (let i = 0; i < 30; i++) {
    try {
      await client.app.log({ body: { service: 'forgejo-wrapper', level: 'info', message: 'ping' } });
      connected = true;
      break;
    } catch {
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  if (!connected) throw new Error('Could not connect to opencode server');

  // Criar sessão
  const sessionResp = await client.session.create();
  const sessionId = sessionResp.data.id;
  console.error(`Session: ${sessionId} | Model: ${providerID}/${modelID}`);

  // Enviar prompt
  const result = await client.session.prompt({
    path: { id: sessionId },
    body: {
      model: { providerID, modelID },
      parts: [{ type: 'text', text: promptText }],
    },
  });

  // Extrair texto da resposta
  const parts = result.data?.parts || [];
  const textParts = parts.filter(p => p.type === 'text' && !p.synthetic);
  const responseText = textParts[textParts.length - 1]?.text || '';

  console.error('Response received');
  console.log(responseText);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
