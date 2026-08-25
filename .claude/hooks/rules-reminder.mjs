#!/usr/bin/env node
// PostToolUse (Write|Edit): recuerda qué rule revisar según el archivo tocado.
// Reemplaza al viejo stop-checklist.mjs, que leía `input.tool_use` — un campo que el
// payload del evento Stop nunca trae, por lo que el recordatorio jamás se disparaba.
// PostToolUse no puede bloquear ni soporta additionalContext: el canal para hablarle
// a Claude es exit 2 + stderr.

const raw = await new Promise((resolve) => {
  let data = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (chunk) => (data += chunk));
  process.stdin.on('end', () => resolve(data));
});

let input = {};
try {
  input = JSON.parse(raw || '{}');
} catch {
  process.exit(0);
}

const filePath = String(input?.tool_input?.file_path ?? '');
if (!filePath) process.exit(0);

const f = filePath.replaceAll('\\', '/');

const RULES_MAP = [
  [/src\/redux\/api\/index\.js$/, '30-api-contract.md + 11-frontend-redux.md'],
  [/src\/redux\/sagas\//, '11-frontend-redux.md'],
  [/src\/redux\/reducers\//, '11-frontend-redux.md'],
  [/src\/redux\/actions\//, '11-frontend-redux.md'],
  [/src\/redux\/consts\/actionTypes/, '11-frontend-redux.md'],
  [/src\/redux\/interceptor\//, '02-auth.md'],
  [/src\/routes\//, '10-frontend.md (tabla de rutas) + CLAUDE.md'],
  [/src\/components\/(atoms|molecules|organisms|templates)\//, '10-frontend.md (Atomic Design)'],
  [/src\/utils\/coordinadoraRole/, '02-auth.md'],
  [/resimamis\/Controllers\//, '30-api-contract.md + 20-backend.md'],
  [/resimamis\/Negocio\//, '20-backend.md'],
  [/resimamis\/Datos\//, '20-backend.md'],
  [/resimamis\/Migrations\//, '20-backend.md (tabla de migraciones)'],
  [/resimamis\/(Program|Starup)\.cs$/, '20-backend.md (arranque, DI, env vars)'],
  [/package\.json$/, '10-frontend.md (stack) + CLAUDE.md'],
];

const hits = [...new Set(RULES_MAP.filter(([re]) => re.test(f)).map(([, rule]) => rule))];

if (hits.length) {
  process.stderr.write(
    `Recordatorio de gobernanza (.claude/rules/90-gobernanza.md):\n` +
    `Tocaste ${f}\n` +
    `Antes de cerrar la tarea, verificá que siga siendo cierta:\n` +
    hits.map((r) => `  -> .claude/rules/${r}`).join('\n') +
    `\nSi el cambio no afecta lo documentado, ignorá este aviso y seguí.\n`
  );
  process.exit(2);
}

process.exit(0);
