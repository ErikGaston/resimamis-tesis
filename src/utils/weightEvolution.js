const MESES_CORTOS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const toNumber = (value) => {
    if (value == null || value === '') return null;
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
};

/**
 * Acepta tanto el envelope `{ success, data }` como el payload suelto, porque el reducer
 * guarda la respuesta cruda de Axios y las páginas la desarman de distinta forma.
 */
export function normalizeWeightEvolution(response) {
    if (response == null) return null;
    const raw = response?.data ?? response;
    if (raw == null || typeof raw !== 'object') return null;

    const bebes = Array.isArray(raw.bebes) ? raw.bebes : [];
    return {
        totalBebes: toNumber(raw.totalBebes) ?? bebes.length,
        bebesConComparacionCompleta: toNumber(raw.bebesConComparacionCompleta) ?? 0,
        bebesConGanancia: toNumber(raw.bebesConGanancia) ?? 0,
        bebesConPerdida: toNumber(raw.bebesConPerdida) ?? 0,
        bebesSinCambio: toNumber(raw.bebesSinCambio) ?? 0,
        promedioPesoIngreso: toNumber(raw.promedioPesoIngreso),
        promedioPesoEgreso: toNumber(raw.promedioPesoEgreso),
        promedioGanancia: toNumber(raw.promedioGanancia ?? raw.promedioDiferencia),
        gananciaMinima: toNumber(raw.gananciaMinima),
        gananciaMaxima: toNumber(raw.gananciaMaxima),
        bebes,
    };
}

/** Fecha con la que se ubica al bebé en un mes: egreso, o ingreso si todavía no egresó. */
function resolveFechaBebe(bebe) {
    const raw = bebe?.fechaSalida ?? bebe?.fechaIngresoNeo ?? bebe?.fechaIngresoNEO;
    if (!raw) return null;
    const fecha = new Date(raw);
    return Number.isNaN(fecha.getTime()) ? null : fecha;
}

/**
 * Ganancia promedio (gramos) por mes, sobre los bebés que tienen peso de ingreso y de egreso.
 * Devuelve la serie ordenada cronológicamente.
 */
export function buildMonthlyAverageGain(bebes) {
    const grupos = new Map();

    (bebes ?? []).forEach((bebe) => {
        const ganancia = toNumber(bebe?.diferenciaIngresoEgreso);
        if (ganancia === null) return;
        const fecha = resolveFechaBebe(bebe);
        if (!fecha) return;

        const anio = fecha.getFullYear();
        const mes = fecha.getMonth();
        const key = `${anio}-${String(mes + 1).padStart(2, '0')}`;
        const grupo = grupos.get(key) ?? { key, anio, mes, total: 0, cantidad: 0 };
        grupo.total += ganancia;
        grupo.cantidad += 1;
        grupos.set(key, grupo);
    });

    return [...grupos.values()]
        .sort((a, b) => a.key.localeCompare(b.key))
        .map(({ key, anio, mes, total, cantidad }) => ({
            key,
            label: `${MESES_CORTOS[mes]} ${String(anio).slice(-2)}`,
            promedio: Math.round((total / cantidad) * 100) / 100,
            cantidad,
        }));
}

/** Formatea gramos con separador de miles; `signed` antepone + / − para deltas. */
export function formatGramos(value, { signed = false } = {}) {
    const n = toNumber(value);
    if (n === null) return '—';
    const absoluto = Math.abs(n).toLocaleString('es-AR', { maximumFractionDigits: 0 });
    if (!signed) return `${absoluto} g`;
    if (n > 0) return `+${absoluto} g`;
    if (n < 0) return `−${absoluto} g`;
    return `0 g`;
}
