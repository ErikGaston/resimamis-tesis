/**
 * Normaliza `esEntrada` para `POST /insumo/registrarMovimiento` (OpenAPI: string nullable).
 * Acepta S/N del formulario y variantes habituales por si el backend o futuros campos usan otros literales.
 * @param {unknown} raw
 * @returns {string|null}
 */
export function normalizeEsEntradaForApi(raw) {
  if (raw == null || raw === '') return null;
  const s = String(raw).trim().toUpperCase();
  if (s === 'S' || s === 'SI' || s === 'TRUE' || s === '1' || s === 'Y' || s === 'ENTRADA') return 'S';
  if (s === 'N' || s === 'NO' || s === 'FALSE' || s === '0' || s === 'SALIDA') return 'N';
  return String(raw).trim() || null;
}

/**
 * @param {Record<string, unknown>|null|undefined} body
 */
export function normalizeSupplyRegisterMovementBody(body) {
  if (!body || typeof body !== 'object') return body;
  return {
    ...body,
    esEntrada: normalizeEsEntradaForApi(body.esEntrada),
  };
}
