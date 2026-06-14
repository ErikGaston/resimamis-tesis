/** Mensaje genérico cuando no hay datos útiles del servidor ni de red. */
export const GENERIC_API_ERROR =
  'No pudimos completar la operación. Intentá de nuevo.';

/** Quita prefijos tipo "0: " que envía a veces ASP.NET / validación por índice. */
export function stripValidationIndexPrefix(msg) {
  if (typeof msg !== 'string') return msg;
  let s = msg.trim();
  // Variantes: "0: texto", "0:texto", varios segmentos "0: a 1: b"
  s = s.replace(/(?:^\d+\s*:\s*)|(?:\s+\d+\s*:\s*)/g, ' ').trim();
  return s;
}

/** Primer mensaje legible de un valor típico de ModelState (string o array). */
function firstErrorMessage(val) {
  if (val == null) return '';
  const arr = Array.isArray(val) ? val : [val];
  const first = arr.find((m) => m != null && String(m).trim());
  if (first == null) return '';
  return stripValidationIndexPrefix(typeof first === 'string' ? first : String(first));
}

/**
 * Mapea `errors` de ProblemDetails / ASP.NET Core a las claves del formulario madre.
 * @param {unknown} body — suele ser `error.response.data` o el objeto guardado en el reducer.
 * @returns {Record<string, string>} solo entradas con mensaje no vacío
 */
export function mapAspNetErrorsToMotherFieldErrors(body) {
  const out = {};
  if (!body || typeof body !== 'object') return out;
  const errs = body.errors;
  if (!errs || typeof errs !== 'object' || Array.isArray(errs)) return out;

  const normKey = (k) =>
    String(k)
      .toLowerCase()
      .replace(/_/g, '');

  const fieldMap = {
    nombre: 'nombre',
    apellido: 'apellido',
    dni: 'dni',
    fechanacimiento: 'fechaNacimiento',
    fecha_nacimiento: 'fechaNacimiento',
    localidad: 'localidad',
    celular: 'celular',
    motivoabrazo: 'motivoAbrazo',
    motivo_abrazo: 'motivoAbrazo',
    cantidadhijos: 'cantidadHijos',
    cantidad_hijos: 'cantidadHijos',
    estadocivil: 'estadoCivil',
    estado_civil: 'estadoCivil',
  };

  for (const [apiKey, val] of Object.entries(errs)) {
    const fk = fieldMap[normKey(apiKey)];
    if (!fk) continue;
    const msg = firstErrorMessage(val);
    if (msg) out[fk] = msg;
  }
  return out;
}

/** True si el cuerpo de error parece validación por campo (mostrar inline y omitir toast genérico). */
export function isAspNetModelStateErrors(body) {
  if (!body || typeof body !== 'object') return false;
  const errs = body.errors;
  return Boolean(
    errs &&
      typeof errs === 'object' &&
      !Array.isArray(errs) &&
      Object.keys(errs).length > 0,
  );
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

    // Backend Resimamis: errors como array de strings ["mensaje"]
    if (Array.isArray(data.errors) && data.errors.length > 0) {
      const parts = data.errors
        .filter((m) => m != null && String(m).trim())
        .map((m) => stripValidationIndexPrefix(typeof m === 'string' ? m : String(m)))
        .filter(Boolean);
      if (parts.length) return parts[0];
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
