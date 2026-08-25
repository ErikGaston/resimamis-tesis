import dayjs from 'dayjs';

export const BABY_NAME_MAX = 50;
export const BABY_LUGAR_NACIMIENTO_MAX = 100;
export const BABY_DIAGNOSTICO_MAX = 500;
export const BABY_DNI_MIN_LEN = 7;
export const BABY_DNI_MAX_LEN = 8;

/** Letras Unicode (incl. eñe, tildes) y espacios — mismo criterio que el backend. */
const NAME_REGEX = /^[\p{L}\s]+$/u;

export const INITIAL_BABY_FIELD_ERRORS = {
  nombre: '',
  apellido: '',
  dni: '',
  sexo: '',
  fechaNacimiento: '',
  fechaIngresoNEO: '',
  lugarNacimiento: '',
  diagnosticoIngreso: '',
  pesoNacimiento: '',
  pesoIngresoNEO: '',
  pesoAlta: '',
  pesoDiaAbrazos: '',
};

const PESO_FIELDS = ['pesoNacimiento', 'pesoIngresoNEO', 'pesoAlta', 'pesoDiaAbrazos'];

const isBlank = (v) => v === null || v === undefined || String(v).trim() === '';

/** Una fila de bebé que el usuario agregó pero nunca completó no debe bloquear el alta. */
export function isBabyRowEmpty(baby) {
  if (!baby || typeof baby !== 'object') return true;
  const relevantes = [
    'nombre', 'apellido', 'dni', 'sexo', 'fechaNacimiento', 'lugarNacimiento',
    'fechaIngresoNEO', 'idSala', 'diagnosticoIngreso', ...PESO_FIELDS,
  ];
  return relevantes.every((k) => isBlank(baby[k]));
}

function validateNombreApellido(value, campo, errors) {
  if (isBlank(value)) {
    errors[campo] = `${campo === 'nombre' ? 'Nombre' : 'Apellido'} es obligatorio.`;
    return;
  }
  const texto = String(value).trim();
  if (!NAME_REGEX.test(texto)) {
    errors[campo] = 'Solo se permiten letras, espacios y tildes.';
  } else if (texto.length > BABY_NAME_MAX) {
    errors[campo] = `No permite más de ${BABY_NAME_MAX} caracteres.`;
  }
}

/**
 * Espeja `NegBebes.ValidarCamposBebe` para que el alta no llegue al backend con datos que
 * va a rechazar: la madre y el bebé se crean en una sola operación, así que un error del
 * servidor a esta altura tira abajo el alta completa.
 */
export function validateBabyForm(baby) {
  const errors = { ...INITIAL_BABY_FIELD_ERRORS };
  const b = baby ?? {};

  validateNombreApellido(b.nombre, 'nombre', errors);
  validateNombreApellido(b.apellido, 'apellido', errors);

  if (isBlank(b.sexo)) {
    errors.sexo = 'Sexo es obligatorio.';
  } else if (!/^[MF]$/i.test(String(b.sexo).trim())) {
    errors.sexo = 'El sistema solo admite Masculino o Femenino.';
  }

  if (!isBlank(b.dni)) {
    const digits = String(b.dni).replace(/\D/g, '');
    if (digits.length < BABY_DNI_MIN_LEN || digits.length > BABY_DNI_MAX_LEN) {
      errors.dni = `El DNI debe tener entre ${BABY_DNI_MIN_LEN} y ${BABY_DNI_MAX_LEN} dígitos.`;
    }
  }

  const nacimiento = isBlank(b.fechaNacimiento) ? null : dayjs(b.fechaNacimiento);
  if (nacimiento === null) {
    errors.fechaNacimiento = 'Fecha de nacimiento es obligatoria.';
  } else if (!nacimiento.isValid()) {
    errors.fechaNacimiento = 'Fecha de nacimiento inválida.';
  } else if (nacimiento.startOf('day').isAfter(dayjs().startOf('day'))) {
    errors.fechaNacimiento = 'La fecha de nacimiento no puede ser futura.';
  }

  const ingresoNeo = isBlank(b.fechaIngresoNEO) ? null : dayjs(b.fechaIngresoNEO);
  if (ingresoNeo !== null && !ingresoNeo.isValid()) {
    errors.fechaIngresoNEO = 'Fecha de ingreso a NEO inválida.';
  } else if (
    ingresoNeo !== null
    && nacimiento !== null
    && nacimiento.isValid()
    && ingresoNeo.startOf('day').isBefore(nacimiento.startOf('day'))
  ) {
    errors.fechaIngresoNEO = 'El ingreso a NEO no puede ser anterior al nacimiento.';
  }

  if (!isBlank(b.lugarNacimiento) && String(b.lugarNacimiento).trim().length > BABY_LUGAR_NACIMIENTO_MAX) {
    errors.lugarNacimiento = `No permite más de ${BABY_LUGAR_NACIMIENTO_MAX} caracteres.`;
  }

  if (!isBlank(b.diagnosticoIngreso) && String(b.diagnosticoIngreso).trim().length > BABY_DIAGNOSTICO_MAX) {
    errors.diagnosticoIngreso = `No permite más de ${BABY_DIAGNOSTICO_MAX} caracteres.`;
  }

  PESO_FIELDS.forEach((campo) => {
    if (isBlank(b[campo])) return;
    const n = Number(b[campo]);
    if (!Number.isFinite(n)) errors[campo] = 'Peso inválido.';
    else if (n < 0) errors[campo] = 'El peso no puede ser negativo.';
  });

  const ok = Object.values(errors).every((e) => e === '');
  return { ok, errors };
}

/** Primer mensaje de error de una lista de bebés, para el resumen del alta. */
export function firstBabyErrorMessage(errorsByBaby) {
  for (let i = 0; i < (errorsByBaby?.length ?? 0); i += 1) {
    const errors = errorsByBaby[i];
    const mensaje = Object.values(errors ?? {}).find((e) => e !== '');
    if (mensaje) {
      return errorsByBaby.length > 1 ? `Bebé ${i + 1}: ${mensaje}` : mensaje;
    }
  }
  return null;
}
