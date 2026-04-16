/** Mensaje genérico cuando no hay datos útiles del servidor ni de red. */
export const GENERIC_API_ERROR =
  'No pudimos completar la operación. Intentá de nuevo.';

/** Quita prefijos tipo "0: " que envía a veces ASP.NET / validación por índice. */
export function stripValidationIndexPrefix(msg) {
  if (typeof msg !== 'string') return msg;
  return msg.replace(/^\d+:\s*/, '').trim();
}

/**
 * Unifica el mensaje a mostrar al usuario a partir de lo que devuelve Axios
 * (reject con `error.response` o `error.message` según el interceptor).
 * @param {unknown} err
 * @returns {string}
 */
export function resolveApiErrorMessage(err) {
  if (err == null || err === '') return GENERIC_API_ERROR;

  if (typeof err === 'string') {
    if (/network error/i.test(err) || err === 'Network Error') {
      return 'No hay conexión con el servidor. Verificá tu internet o que el servicio esté disponible.';
    }
    return stripValidationIndexPrefix(err) || GENERIC_API_ERROR;
  }

  const data = err.data;
  if (typeof data === 'string' && data.trim()) return stripValidationIndexPrefix(data);

  if (data && typeof data === 'object') {
    // ASP.NET Core ProblemDetails + errors: { Campo: ["msg"] }
    if (data.errors && typeof data.errors === 'object' && !Array.isArray(data.errors)) {
      const parts = [];
      for (const [, val] of Object.entries(data.errors)) {
        const msgs = Array.isArray(val) ? val : [val];
        for (const m of msgs) {
          const s = stripValidationIndexPrefix(typeof m === 'string' ? m : String(m));
          if (s) parts.push(s);
        }
      }
      if (parts.length) return parts.join(' ');
    }

    if (typeof data.message === 'string' && data.message.trim()) {
      return stripValidationIndexPrefix(data.message);
    }
    if (Array.isArray(data.message) && data.message.length) {
      return data.message.map((m) => stripValidationIndexPrefix(m)).filter(Boolean).join(', ');
    }
    if (typeof data.detail === 'string' && data.detail.trim()) {
      return stripValidationIndexPrefix(data.detail);
    }
    if (typeof data.title === 'string' && data.title.trim() && data.title !== 'One or more validation errors occurred.') {
      return stripValidationIndexPrefix(data.title);
    }
    if (Array.isArray(data.non_field_errors) && data.non_field_errors.length) {
      return data.non_field_errors.map(stripValidationIndexPrefix).filter(Boolean).join(', ');
    }
    const skipKeys = new Set(['type', 'title', 'status', 'traceId', 'errors']);
    const keys = Object.keys(data).filter((k) => !skipKeys.has(k));
    const firstKey = keys[0];
    if (firstKey) {
      const v = data[firstKey];
      if (Array.isArray(v) && v.length) {
        return stripValidationIndexPrefix(v.map((x) => (typeof x === 'string' ? x : String(x))).join(', '));
      }
      if (typeof v === 'string' && v.trim()) return stripValidationIndexPrefix(v);
    }
  }

  if (err.status && typeof err.statusText === 'string' && err.statusText.trim()) {
    if (err.status >= 500) {
      return 'El servidor no está disponible en este momento. Intentá más tarde.';
    }
    if (err.status === 400) {
      return 'Los datos enviados no son válidos. Revisá el formulario.';
    }
    return stripValidationIndexPrefix(`${err.status}: ${err.statusText}`);
  }

  return GENERIC_API_ERROR;
}
