import dayjs from 'dayjs';

/**
 * Rangos del histograma. Se alinean con los que usa el backend en
 * `Dashboard/bebes/rango-edades` para que ambas pantallas se lean igual.
 */
export const PERMANENCE_BUCKETS = [
    { label: '0-7 días', min: 0, max: 7 },
    { label: '8-14 días', min: 8, max: 14 },
    { label: '15-28 días', min: 15, max: 28 },
    { label: '29-60 días', min: 29, max: 60 },
    { label: '61+ días', min: 61, max: Infinity },
];

const pick = (obj, ...claves) => {
    for (const c of claves) {
        if (obj?.[c] !== undefined && obj?.[c] !== null) return obj[c];
    }
    return null;
};

function normalizeBebe(bebe) {
    const dias = Number(pick(bebe, 'diasPermanencia', 'DiasPermanencia'));
    if (!Number.isFinite(dias)) return null;

    const fechaIngreso = pick(bebe, 'fechaIngresoNeo', 'FechaIngresoNeo', 'fechaIngresoNEO');
    const nombre = pick(bebe, 'nombre', 'Nombre') ?? '';
    const apellido = pick(bebe, 'apellido', 'Apellido') ?? '';

    return {
        idBebe: pick(bebe, 'idBebe', 'IdBebe'),
        nombreCompleto: `${apellido} ${nombre}`.trim() || 'Sin nombre',
        fechaIngreso: fechaIngreso ? dayjs(fechaIngreso) : null,
        diasPermanencia: dias,
        estadoBebe: pick(bebe, 'estadoBebe', 'EstadoBebe'),
        nombreSala: pick(bebe, 'nombreSala', 'NombreSala'),
    };
}

/** Aplana la respuesta de `GET /dashboard/bebes/permanencia`. */
export function normalizeBabyPermanence(respuesta) {
    const lista = pick(respuesta, 'bebes', 'Bebes');
    if (!Array.isArray(lista)) return null;

    return lista.map(normalizeBebe).filter(Boolean);
}

/**
 * Filtra por fecha de ingreso a NEO. El endpoint no acepta período: devuelve
 * siempre la foto de hoy, así que el recorte temporal se hace acá.
 */
export function filterByIngreso(bebes, desde, hasta) {
    if (!Array.isArray(bebes)) return [];

    return bebes.filter((b) => {
        if (!b.fechaIngreso?.isValid()) return !desde && !hasta;
        if (desde && b.fechaIngreso.isBefore(dayjs(desde).startOf('day'))) return false;
        if (hasta && b.fechaIngreso.isAfter(dayjs(hasta).endOf('day'))) return false;
        return true;
    });
}

/** Promedio, mínimo y máximo recalculados sobre el subconjunto filtrado. */
export function summarizePermanence(bebes) {
    if (!bebes?.length) return { total: 0, promedio: 0, minimo: 0, maximo: 0 };

    const dias = bebes.map((b) => b.diasPermanencia);
    const suma = dias.reduce((acc, d) => acc + d, 0);

    return {
        total: bebes.length,
        promedio: Math.round((suma / dias.length) * 10) / 10,
        minimo: Math.min(...dias),
        maximo: Math.max(...dias),
    };
}

export function buildPermanenceHistogram(bebes) {
    return PERMANENCE_BUCKETS.map(({ label, min, max }) => ({
        label,
        cantidad: (bebes ?? []).filter((b) => b.diasPermanencia >= min && b.diasPermanencia <= max).length,
    }));
}

export const formatDias = (n) => `${Number.isInteger(n) ? n : n.toFixed(1)} ${n === 1 ? 'día' : 'días'}`;
