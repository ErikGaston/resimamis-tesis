#!/usr/bin/env node
/**
 * Stop hook — se ejecuta al finalizar cada turno de Claude.
 * Recuerda actualizar las rules cuando el cambio lo requiere.
 */

const input = JSON.parse(await new Promise((res) => {
  let data = '';
  process.stdin.on('data', (chunk) => (data += chunk));
  process.stdin.on('end', () => res(data || '{}'));
}));

const stopReason = input?.stop_hook_active ? 'hook' : 'normal';

// Solo mostrar recordatorio si hubo actividad de escritura en este turno
const toolsUsed = input?.tool_use ?? [];
const wroteFiles = toolsUsed.some((t) =>
  ['Write', 'Edit'].includes(t?.name)
);

if (wroteFiles) {
  const rulesMap = {
    'redux/api/index.js': '06-endpoints-api.md',
    'redux/sagas/': '06-endpoints-api.md + 03-arquitectura-frontend.md',
    'redux/reducers/': '03-arquitectura-frontend.md',
    'redux/consts/actionTypes': '03-arquitectura-frontend.md',
    'routes/RouterApp': '03-arquitectura-frontend.md',
    'interceptor.js': '02-auth.md',
  };

  const filesChanged = toolsUsed
    .filter((t) => ['Write', 'Edit'].includes(t?.name))
    .map((t) => t?.input?.file_path ?? '')
    .filter(Boolean);

  const rulesToCheck = new Set();
  for (const f of filesChanged) {
    for (const [pattern, rule] of Object.entries(rulesMap)) {
      if (f.includes(pattern)) rulesToCheck.add(rule);
    }
  }

  if (rulesToCheck.size > 0) {
    process.stderr.write(
      `\n📋 Recordatorio: actualizá las rules si el cambio lo requiere:\n` +
      [...rulesToCheck].map((r) => `   → .claude/rules/${r}`).join('\n') +
      '\n'
    );
  }
}

process.exit(0);
