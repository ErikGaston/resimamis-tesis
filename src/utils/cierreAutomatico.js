// Una asignación finalizada por el cierre diario, el botón de coordinación o el
// script de la presentación no fue un abrazo real: se marca distinto en pantalla.
export const esCierreAutomatico = (asignacion) =>
    asignacion?.cierreAutomatico === true
    || (typeof asignacion?.comentario === 'string' && asignacion.comentario.startsWith('Cierre automático'));
