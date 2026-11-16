// wa.me necesita el número en formato internacional sin "+". En la base los
// celulares se guardan como en Argentina (3516000002, 0351..., 351 15 ...), así
// que se les agrega el 54 9 de los celulares argentinos cuando falta.
export const linkWhatsApp = (celular, texto = 'Hola, ¿cómo estás?') => {
    let numero = String(celular ?? '').replace(/\D/g, '');
    if (!numero) return null;
    if (!numero.startsWith('54')) {
        numero = numero.replace(/^0/, '');
        numero = `549${numero}`;
    } else if (!numero.startsWith('549')) {
        numero = `549${numero.slice(2)}`;
    }
    return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
};
