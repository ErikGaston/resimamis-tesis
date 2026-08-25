#!/usr/bin/env node
// PreToolUse (Write|Edit): bloquea escrituras en archivos sensibles.
// Salir con exit 0 y sin JSON deja seguir el flujo normal de permisos.

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
const normalized = filePath.replaceAll('\\', '/');

const BLOCKED = [
  { pattern: /(^|\/)\.env$/, reason: 'archivo de entorno con secretos' },
  { pattern: /(^|\/)\.env\./, reason: 'archivo de entorno con secretos' },
  { pattern: /(^|\/)package-lock\.json$/, reason: 'lockfile: regenerar con el gestor de paquetes' },
  { pattern: /(^|\/)yarn\.lock$/, reason: 'lockfile: regenerar con el gestor de paquetes' },
  { pattern: /(^|\/)pnpm-lock\.yaml$/, reason: 'lockfile: regenerar con el gestor de paquetes' },
  { pattern: /(^|\/)bun\.lock(b)?$/, reason: 'lockfile: regenerar con el gestor de paquetes' },
  { pattern: /(^|\/)appsettings(\.\w+)?\.json$/, reason: 'config backend con credenciales: usar variables de entorno' },
];

const ALLOWLIST = [/(^|\/)\.env\.example$/, /(^|\/)\.env\.template$/];

const allowed = ALLOWLIST.some((p) => p.test(normalized));
const hit = allowed ? null : BLOCKED.find(({ pattern }) => pattern.test(normalized));

if (hit) {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason: `repo-guard: escritura bloqueada en "${filePath}" (${hit.reason}).`,
    },
  }));
}

process.exit(0);
