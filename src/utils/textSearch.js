const sinTildes = (texto) =>
  String(texto ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

/**
 * Busca `consulta` en los textos (sin distinguir mayúsculas ni tildes) y, si trae dígitos, en el DNI.
 * Comparar el DNI con `consulta.replace(/\D/g, '')` sin chequear que quede algo hacía que
 * cualquier búsqueda por nombre devolviera todos los registros (`'123'.includes('')`).
 */
export function coincideBusqueda(consulta, textos, dni) {
  const q = sinTildes(consulta);
  if (!q) return true;
  if (textos.some((t) => sinTildes(t).includes(q))) return true;
  const digitos = q.replace(/\D/g, '');
  return digitos.length > 0 && String(dni ?? '').includes(digitos);
}

export function ordenarPorNombre(lista, nombreDe) {
  return [...(lista ?? [])].sort((a, b) =>
    sinTildes(nombreDe(a)).localeCompare(sinTildes(nombreDe(b)), 'es'),
  );
}
