/**
 * Normaliza fila de bebé del formulario al body esperado por PUT/POST OpenAPI `BEBE`
 * (incl. `idMadres` cuando hay varias madres; `idMadre` refleja la primera para compatibilidad).
 */

/**
 * @param {Record<string, unknown>} baby
 * @param {number|string|null|undefined} idMadreFallback id de la madre del contexto (p. ej. perfil madre)
 * @returns {number[]}
 */
export function collectIdMadresForBaby(baby, idMadreFallback) {
  const b = baby || {};
  const out = [];
  const push = (v) => {
    if (v === '' || v === undefined || v === null) return;
    const n = Number(v);
    if (!Number.isFinite(n) || n <= 0) return;
    if (!out.includes(n)) out.push(n);
  };

  const raw = b.idMadres;
  if (Array.isArray(raw)) {
    raw.forEach(push);
  }
  push(b.idMadre);
  push(idMadreFallback);
  return out;
}

/**
 * @param {Record<string, unknown>} baby
 * @param {number|string|null|undefined} idMadreFallback
 */
export function normalizeBabyApiPayload(baby, idMadreFallback) {
  const b = baby || {};
  const id = b.id ?? b.idBebe;
  const idMadres = collectIdMadresForBaby(b, idMadreFallback);
  const idMadre = idMadres.length ? idMadres[0] : null;

  const body = {
    id: id != null ? Number(id) : null,
    dni: b.dni != null && b.dni !== '' ? Number(String(b.dni).replace(/\D/g, '')) : null,
    nombre: b.nombre ?? null,
    apellido: b.apellido ?? null,
    sexo: b.sexo ?? null,
    fechaNacimiento: b.fechaNacimiento ?? null,
    lugarNacimiento: b.lugarNacimiento ?? null,
    fechaIngresoNEO: b.fechaIngresoNEO ?? null,
    pesoNacimiento: b.pesoNacimiento != null && b.pesoNacimiento !== '' ? Number(b.pesoNacimiento) : null,
    pesoIngresoNEO: b.pesoIngresoNEO != null && b.pesoIngresoNEO !== '' ? Number(b.pesoIngresoNEO) : null,
    pesoDiaAbrazos: b.pesoDiaAbrazos != null && b.pesoDiaAbrazos !== '' ? Number(b.pesoDiaAbrazos) : null,
    pesoAlta: b.pesoAlta != null && b.pesoAlta !== '' ? Number(b.pesoAlta) : null,
    diagnosticoIngreso: b.diagnosticoIngreso ?? null,
    diagnosticoEgreso: b.diagnosticoEgreso ?? null,
    idSala: b.idSala != null && b.idSala !== '' ? Number(b.idSala) : null,
    idMadre: idMadre != null ? Number(idMadre) : null,
    idEstado: b.idEstado != null ? Number(b.idEstado) : null,
  };

  if (idMadres.length > 0) {
    body.idMadres = idMadres;
  }

  return body;
}

/**
 * Fila de bebé para el alta conjunta `POST /madre` (body `MADRE.bebe[]`).
 *
 * A diferencia de `normalizeBabyApiPayload`, omite `id`, `idMadre` y `idEstado`: el bebé se
 * inserta junto con la madre, EF resuelve la FK y el backend le asigna "Sin abrazar".
 * `id` además no puede viajar en null porque `BEBE.ID` es un int no nullable.
 * @param {Record<string, unknown>} baby
 */
export function normalizeBabyForAlta(baby) {
  const b = baby || {};
  const numeroOpcional = (v) => (v != null && v !== '' ? Number(v) : null);

  return {
    dni: b.dni != null && b.dni !== '' ? Number(String(b.dni).replace(/\D/g, '')) : null,
    nombre: b.nombre ?? null,
    apellido: b.apellido ?? null,
    sexo: b.sexo ? String(b.sexo).trim().toUpperCase() : null,
    fechaNacimiento: b.fechaNacimiento || null,
    lugarNacimiento: b.lugarNacimiento ?? null,
    fechaIngresoNEO: b.fechaIngresoNEO || null,
    pesoNacimiento: numeroOpcional(b.pesoNacimiento),
    pesoIngresoNEO: numeroOpcional(b.pesoIngresoNEO),
    pesoDiaAbrazos: numeroOpcional(b.pesoDiaAbrazos),
    pesoAlta: numeroOpcional(b.pesoAlta),
    diagnosticoIngreso: b.diagnosticoIngreso ?? null,
    diagnosticoEgreso: b.diagnosticoEgreso ?? null,
    idSala: numeroOpcional(b.idSala),
  };
}
