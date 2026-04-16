/**
 * Normaliza la respuesta de GET /bebe/abrazar (estructura puede variar según backend).
 */
export function listBabysFromAbrazarResponse(getBabysFreePayload) {
  const d = getBabysFreePayload;
  if (!d) return [];
  if (Array.isArray(d)) return d;
  return (
    d.listadoBebes ??
    d.listadoBebesAbrazar ??
    d.bebesParaAbrazar ??
    d.bebes ??
    d.resultado ??
    []
  );
}

/**
 * Id enviado en `idTareas` para POST generarTareas (OpenAPI: tareas a asignar).
 * Prioriza idTarea del DTO; si no viene, usa idBebe/id como último recurso.
 */
export function resolveIdTareaForGenerarTareas(baby) {
  if (!baby || typeof baby !== 'object') return null;
  const idTarea = baby.idTarea ?? baby.id_tarea;
  if (idTarea != null && idTarea !== '') return Number(idTarea);
  const idBebe = baby.idBebe ?? baby.id;
  if (idBebe != null && idBebe !== '') return Number(idBebe);
  return null;
}

export function babyRowKey(baby, index) {
  const id = resolveIdTareaForGenerarTareas(baby);
  if (id != null) return `tarea-${id}`;
  return `baby-${index}`;
}
