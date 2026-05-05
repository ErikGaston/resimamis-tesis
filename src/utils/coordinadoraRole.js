/**
 * Rol COORDINADORA: acceso a Tareas → Asignación.
 * Prioridad: texto `rol` (insensible a mayúsculas / acentos); si no alcanza,
 * `import.meta.env.VITE_COORDINADORA_ID_ROL` + `idRol` guardados en sesión.
 */

const stripDiacritics = (s) =>
  String(s)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

/**
 * @returns {{ id?: number, nombre?: string, apellido?: string, mail?: string, dni?: number, celular?: number, idRol?: number|null, rol?: string|null } | null}
 */
export function readVolunteerSession() {
  try {
    const raw = localStorage.getItem('voluntaria');
    if (raw == null || raw === '') return null;
    const v = JSON.parse(raw);
    return v && typeof v === 'object' ? v : null;
  } catch {
    return null;
  }
}

/**
 * @param {{ idRol?: number|null, rol?: string|null, IdRol?: number|null, Rol?: string|null } | null | undefined} v
 */
export function isCoordinadoraVoluntaria(v) {
  if (v == null) return false;

  const rolRaw = v.rol ?? v.Rol;
  if (typeof rolRaw === 'string' && rolRaw.trim() !== '') {
    const n = stripDiacritics(rolRaw.trim().toLowerCase());
    if (n === 'coordinadora' || n === 'coordinador') return true;
  }

  const idRol = v.idRol ?? v.IdRol;
  const envId = import.meta.env.VITE_COORDINADORA_ID_ROL;
  if (envId != null && String(envId).trim() !== '' && idRol != null) {
    return Number(idRol) === Number(envId);
  }

  return false;
}

export function isCoordinadoraSession() {
  return isCoordinadoraVoluntaria(readVolunteerSession());
}
