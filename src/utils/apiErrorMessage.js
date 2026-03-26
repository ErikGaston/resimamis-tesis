/** Mensaje genérico cuando no hay datos útiles del servidor ni de red. */
export const GENERIC_API_ERROR =
  'No pudimos completar la operación. Intentá de nuevo.';

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
    return err.trim() || GENERIC_API_ERROR;
  }

  const data = err.data;
  if (typeof data === 'string' && data.trim()) return data;

  if (data && typeof data === 'object') {
    if (typeof data.message === 'string' && data.message.trim()) {
      return data.message;
    }
    if (Array.isArray(data.message) && data.message.length) {
      return data.message.join(', ');
    }
    if (typeof data.detail === 'string' && data.detail.trim()) {
      return data.detail;
    }
    if (Array.isArray(data.non_field_errors) && data.non_field_errors.length) {
      return data.non_field_errors.join(', ');
    }
    const firstKey = Object.keys(data)[0];
    if (firstKey) {
      const v = data[firstKey];
      if (Array.isArray(v) && v.length) return `${firstKey}: ${v.join(', ')}`;
      if (typeof v === 'string' && v.trim()) return `${firstKey}: ${v}`;
    }
  }

  if (err.status && typeof err.statusText === 'string' && err.statusText.trim()) {
    if (err.status >= 500) {
      return 'El servidor no está disponible en este momento. Intentá más tarde.';
    }
    return `${err.status}: ${err.statusText}`;
  }

  return GENERIC_API_ERROR;
}
