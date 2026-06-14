#!/usr/bin/env node
/**
 * PreToolUse hook (Write | Edit) — bloquea escrituras en archivos sensibles.
 */

const input = JSON.parse(await new Promise((res) => {
  let data = '';
  process.stdin.on('data', (chunk) => (data += chunk));
  process.stdin.on('end', () => res(data || '{}'));
}));

const filePath = input?.tool_input?.file_path ?? '';

const BLOCKED = [
  /\.env$/,
  /\.env\./,
  /package-lock\.json$/,
  /pnpm-lock\.yaml$/,
  /bun\.lock(b)?$/,
];

const blocked = BLOCKED.some((pattern) => pattern.test(filePath));

if (blocked) {
  process.stdout.write(JSON.stringify({
    decision: 'block',
    reason: `repo-guard: escritura bloqueada en archivo sensible: ${filePath}`,
  }));
  process.exit(0);
}

// Permitir
process.stdout.write(JSON.stringify({ decision: 'approve' }));
process.exit(0);
