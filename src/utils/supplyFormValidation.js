export const SUPPLY_NAME_MIN = 2;
export const SUPPLY_NAME_MAX = 100;
export const SUPPLY_DESCRIPTION_MAX = 500;
export const SUPPLY_STOCK_MAX = 999999;

const toNumber = (valor) => {
  if (valor === '' || valor == null) return null;
  const n = Number(valor);
  return Number.isFinite(n) ? n : null;
};

/**
 * Mensaje inline del nombre, o null si está bien.
 * El vacío no devuelve mensaje: lo cubre `required` y no se le grita al campo sin tocar.
 * @param {string} nombre
 * @returns {string|null}
 */
export function supplyNameError(nombre) {
  const valor = (nombre ?? '').trim();
  if (valor === '') return null;
  if (valor.length < SUPPLY_NAME_MIN) return `Mínimo ${SUPPLY_NAME_MIN} caracteres.`;
  if (valor.length > SUPPLY_NAME_MAX) return `Máximo ${SUPPLY_NAME_MAX} caracteres.`;
  return null;
}

/**
 * @param {string} descripcion
 * @returns {string|null}
 */
export function supplyDescriptionError(descripcion) {
  if ((descripcion ?? '').length > SUPPLY_DESCRIPTION_MAX)
    return `Máximo ${SUPPLY_DESCRIPTION_MAX} caracteres.`;
  return null;
}

/**
 * @param {string|number} valor
 * @returns {string|null}
 */
export function supplyStockError(valor) {
  const n = toNumber(valor);
  if (n == null) return 'Ingresá un número.';
  if (n < 0) return 'No puede ser negativo.';
  if (n > SUPPLY_STOCK_MAX) return `Máximo ${SUPPLY_STOCK_MAX}.`;
  return null;
}

/**
 * El stock máximo además no puede quedar por debajo del mínimo: sin este mensaje
 * el botón se deshabilita sin decir por qué.
 * @param {string|number} stockMaximo
 * @param {string|number} stockMinimo
 * @returns {string|null}
 */
export function supplyStockMaxError(stockMaximo, stockMinimo) {
  const propio = supplyStockError(stockMaximo);
  if (propio) return propio;
  const max = toNumber(stockMaximo);
  const min = toNumber(stockMinimo);
  if (max != null && min != null && max < min) return 'No puede ser menor al stock mínimo.';
  return null;
}

/**
 * @param {{nombre?: string, descripcion?: string, stockActual?: string|number,
 *          stockMinimo?: string|number, stockMaximo?: string|number}} valores
 * @returns {boolean}
 */
export function isSupplyFormValid({ nombre, descripcion, stockActual, stockMinimo, stockMaximo }) {
  if ((nombre ?? '').trim() === '') return false;
  return (
    supplyNameError(nombre) == null &&
    supplyDescriptionError(descripcion) == null &&
    supplyStockError(stockActual) == null &&
    supplyStockError(stockMinimo) == null &&
    supplyStockMaxError(stockMaximo, stockMinimo) == null
  );
}
