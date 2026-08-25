/**
 * Aplana las distribuciones de bebés del Dashboard a `{ label, cantidad }`.
 * Cada endpoint nombra distinto la lista y la etiqueta (porSala/nombreSala,
 * porEstado/estadoBebe, rangos/rango), así que la forma común se arma acá y no
 * en el componente.
 */

const pick = (obj, ...claves) => {
    for (const c of claves) {
        if (obj?.[c] !== undefined && obj?.[c] !== null) return obj[c];
    }
    return null;
};

function normalizar(respuesta, claveLista, claveEtiqueta, claveCantidad) {
    const lista = pick(respuesta, claveLista, claveLista.charAt(0).toUpperCase() + claveLista.slice(1));
    if (!Array.isArray(lista)) return null;

    return lista
        .map((item) => {
            const label = pick(item, claveEtiqueta, claveEtiqueta.charAt(0).toUpperCase() + claveEtiqueta.slice(1));
            const cantidad = Number(pick(item, claveCantidad, claveCantidad.charAt(0).toUpperCase() + claveCantidad.slice(1)));
            if (!label || !Number.isFinite(cantidad)) return null;
            return { label: String(label), cantidad };
        })
        .filter(Boolean);
}

export const normalizeBebesPorSala = (r) => normalizar(r, 'porSala', 'nombreSala', 'cantidadBebes');
export const normalizeBebesPorEstado = (r) => normalizar(r, 'porEstado', 'estadoBebe', 'cantidad');
export const normalizeBebesRangoEdades = (r) => normalizar(r, 'rangos', 'rango', 'cantidadBebes');

export const totalDe = (respuesta) => pick(respuesta, 'totalBebes', 'TotalBebes') ?? null;
