import dayjs from 'dayjs';

/** ISO fecha local YYYY-MM-DD (compatible con dayjs del date picker). */
export const formattedDate = (date) => {
    const d = dayjs(date);
    if (!d.isValid()) return '';
    return d.format('YYYY-MM-DD');
};