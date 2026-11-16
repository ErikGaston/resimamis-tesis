const capitalizarPalabra = (palabra) =>
  palabra
    .split(/([-'’])/)
    .map((parte) => (parte.length ? parte[0].toLocaleUpperCase('es') + parte.slice(1).toLocaleLowerCase('es') : parte))
    .join('');

const normalizarEspacios = (texto) => String(texto).trim().replace(/\s+/g, ' ');

/** Nombres y apellidos de personas: cada palabra con mayúscula inicial ("maría DEL carmen" → "María Del Carmen"). */
export function capitalizarNombre(texto) {
  if (texto == null || texto === '') return texto;
  return normalizarEspacios(texto).split(' ').map(capitalizarPalabra).join(' ');
}

/**
 * Nombres de insumos, salas, proveedores y vínculos: mismo criterio que las personas, pero respeta
 * siglas que ya vienen en mayúsculas ("NEO A", "UCIN") para no convertirlas en "Neo".
 */
export function capitalizarTitulo(texto) {
  if (texto == null || texto === '') return texto;
  return normalizarEspacios(texto)
    .split(' ')
    .map((palabra) => (/^[\p{Lu}\d]{1,4}$/u.test(palabra) ? palabra : capitalizarPalabra(palabra)))
    .join(' ');
}
