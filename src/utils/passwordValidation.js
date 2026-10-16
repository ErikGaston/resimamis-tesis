export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 15;

/** Lo que el backend acepta (`NegUsuarios.ValidarContrasenaNueva`) más complejidad mínima. */
export const PASSWORD_RULES_TEXT =
  `Entre ${PASSWORD_MIN} y ${PASSWORD_MAX} caracteres, con al menos una letra y un número, sin espacios.`;

/**
 * Mensaje del primer requisito incumplido, o null si la contraseña sirve.
 * @param {string} contrasena
 * @returns {string|null}
 */
export function passwordError(contrasena) {
  const valor = contrasena ?? '';
  if (valor.length < PASSWORD_MIN || valor.length > PASSWORD_MAX)
    return `La contraseña debe tener entre ${PASSWORD_MIN} y ${PASSWORD_MAX} caracteres.`;
  if (/\s/.test(valor))
    return 'La contraseña no puede tener espacios.';
  if (!/\p{L}/u.test(valor))
    return 'La contraseña debe incluir al menos una letra.';
  if (!/\d/.test(valor))
    return 'La contraseña debe incluir al menos un número.';
  return null;
}

/**
 * @param {string} contrasena
 * @returns {boolean}
 */
export const isPasswordValid = (contrasena) => passwordError(contrasena) == null;
