/**
 * Filtros de tipeo compartidos por los ABMs. La idea es no dejar entrar lo que
 * después va a rebotar al guardar: el formulario de voluntarias ya lo hacía y
 * los de madres y bebés dejaban escribir y recién avisaban al enviar.
 */

/** Deja solo letras (con tildes y eñe) y espacios. */
export const filterNameChars = (valor) => String(valor ?? '').replace(/[^\p{L}\s]/gu, '');

/** Deja solo dígitos. */
export const filterDigits = (valor) => String(valor ?? '').replace(/\D/g, '');
