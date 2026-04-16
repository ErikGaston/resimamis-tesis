/**
 * Normaliza fila de bebé del formulario al body esperado por PUT/POST OpenAPI `BEBE`.
 */
export function normalizeBabyApiPayload(baby, idMadreFallback) {
  const b = baby || {};
  const id = b.id ?? b.idBebe;
  const idMadre = b.idMadre ?? idMadreFallback ?? null;
  return {
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
}
