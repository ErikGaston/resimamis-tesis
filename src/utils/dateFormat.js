import dayjs from 'dayjs';

/** ISO fecha local YYYY-MM-DD (compatible con dayjs del date picker). */
export const formattedDate = (date) => {
    const d = dayjs(date);
    if (!d.isValid()) return '';
    return d.format('YYYY-MM-DD');
};
// Fechas sin hora (nacimiento, inicio, baja): el back las devuelve como medianoche UTC
// ("1990-04-15T00:00:00Z") y dayjs las pasaría a hora argentina, un día antes.
// En ese caso se toma solo AAAA-MM-DD; si trae una hora real, se respeta la hora local.
export const fechaSinHora = (valor) => {
    if (!valor) return null;
    const texto = String(valor);
    const medianocheUtc = /^\d{4}-\d{2}-\d{2}(T00:00:00(\.0+)?(Z|\+00:00)?)?$/.test(texto);
    const d = medianocheUtc ? dayjs(texto.slice(0, 10)) : dayjs(texto);
    return d.isValid() ? d : null;
};
