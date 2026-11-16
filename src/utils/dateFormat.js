import dayjs from 'dayjs';

/** ISO fecha local YYYY-MM-DD (compatible con dayjs del date picker). */
export const formattedDate = (date) => {
    const d = dayjs(date);
    if (!d.isValid()) return '';
    return d.format('YYYY-MM-DD');
};
// Fechas sin hora (p. ej. nacimiento): el back las devuelve como medianoche UTC
// ("1990-04-15T00:00:00Z") y dayjs las pasaría a hora argentina, un día antes.
// Se toma solo AAAA-MM-DD para que se vea el mismo día que se cargó.
export const fechaSinHora = (valor) => {
    if (!valor) return null;
    const d = dayjs(String(valor).slice(0, 10));
    return d.isValid() ? d : null;
};
