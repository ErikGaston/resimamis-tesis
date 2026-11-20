// Utilidad de test (NO es un archivo de test: no matchea *.test.js).
// Extrae los workers que un domain saga registra con takeLatest, leyéndolos de
// su default export, para poder testear cada worker sin tener que exportarlos
// uno por uno desde el saga de dominio.
//
// takeLatest(TIPO, worker) produce un efecto FORK cuyo payload.args es
// [patrón, worker, ...extra]. Recorremos el generator raíz y mapeamos
// patrón -> worker.
export function mapWorkersByType(domainSaga) {
  const byType = {};
  const gen = domainSaga();
  let step = gen.next();
  while (!step.done) {
    const args = step.value?.payload?.args;
    if (Array.isArray(args) && args.length >= 2 && typeof args[1] === 'function') {
      byType[args[0]] = args[1];
    }
    step = gen.next();
  }
  return byType;
}

// Corre un worker hasta el final arrancándolo con gen.throw(error) justo después
// del primer `call`, y devuelve todos los efectos emitidos por el catch.
export function drainFromThrow(gen, error) {
  const emitted = [];
  let step = gen.throw(error);
  while (!step.done) {
    emitted.push(step.value);
    step = gen.next();
  }
  return emitted;
}
