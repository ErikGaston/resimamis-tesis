/**
 * Con el botón de guardar deshabilitado hasta que el formulario sea válido, hay que mostrar por qué.
 * Combina los errores del último intento de guardar con los de validación de los campos que ya
 * tienen algo cargado; los vacíos no se marcan hasta que se intenta guardar.
 */
export function erroresVisibles(modelo, erroresGuardado = {}, erroresValidacion = {}) {
  const campos = new Set([...Object.keys(erroresGuardado ?? {}), ...Object.keys(erroresValidacion ?? {})]);
  const resultado = {};
  campos.forEach((campo) => {
    const valor = modelo?.[campo];
    const cargado = valor != null && String(valor).trim() !== '';
    resultado[campo] = erroresGuardado?.[campo] || (cargado ? erroresValidacion?.[campo] ?? '' : '');
  });
  return resultado;
}
