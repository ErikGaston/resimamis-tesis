const DRAFT_KEY = 'altaMadreBorrador';

/**
 * El alta de madre + bebé se persiste en el backend en una sola operación al final, así que
 * mientras tanto lo cargado vive acá: si la app se cierra a mitad de la ficha del bebé, al
 * volver a `/madre` se recupera todo en lugar de tener que reescribirlo.
 */
export function readMotherAltaDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || typeof parsed.model !== 'object') return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveMotherAltaDraft(model) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ savedAt: new Date().toISOString(), model }));
  } catch {
    // Sin espacio o en modo privado: el borrador es una comodidad, no puede romper el alta.
  }
}

export function clearMotherAltaDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    // idem saveMotherAltaDraft
  }
}
