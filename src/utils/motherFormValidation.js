import dayjs from 'dayjs';

export const MOTHER_NAME_MAX = 50;
export const MOTHER_MOTIVO_MAX = 250;
export const MOTHER_DNI_MIN_LEN = 7;
export const MOTHER_DNI_MAX_LEN = 8;
export const MOTHER_PHONE_DIGITS_MIN = 10;
export const MOTHER_PHONE_DIGITS_MAX = 15;
export const MOTHER_MIN_AGE = 13;
export const MOTHER_DATE_MIN_YEARS_BACK = 100;

/** Letras Unicode (incl. enie, tildes), espacios */
const NAME_REGEX = /^[\p{L}\s]+$/u;

/**
 * Valores enviados en `estadoCivil` (int, OpenAPI `MADRE.estadoCivil`).
 * Deben coincidir con la enumeración del backend; si el API devuelve otros ids, actualizar esta lista.
 */
export const MOTHER_ESTADO_CIVIL_OPTIONS = [
  { label: 'Soltera/o', value: 1 },
  { label: 'Casada/o', value: 2 },
  { label: 'Unión convivencial', value: 3 },
  { label: 'Divorciada/o', value: 4 },
  { label: 'Viuda/o', value: 5 },
  { label: 'Separada/o', value: 6 },
];

export const INITIAL_MOTHER_FIELD_ERRORS = {
  nombre: '',
  apellido: '',
  dni: '',
  fechaNacimiento: '',
  localidad: '',
  celular: '',
  motivoAbrazo: '',
  cantidadHijos: '',
  estadoCivil: '',
};

/**
 * @param {Record<string, unknown>} model
 * @param {{ mothers?: Array<{ dni?: number|string, idMadre?: number }>, excludeMadreId?: number|null }} options
 */
export function validateMotherForm(model, options = {}) {
  const mothers = options.mothers ?? [];
  const excludeMadreId = options.excludeMadreId ?? null;
  const errors = { ...INITIAL_MOTHER_FIELD_ERRORS };
  let ok = true;

  const set = (field, msg) => {
    if (msg) {
      errors[field] = msg;
      ok = false;
    }
  };

  const nombre = (model?.nombre ?? '').trim();
  if (!nombre) set('nombre', 'El nombre es obligatorio.');
  else if (nombre.length > MOTHER_NAME_MAX) {
    set('nombre', `El nombre no puede superar los ${MOTHER_NAME_MAX} caracteres.`);
  } else if (!NAME_REGEX.test(nombre)) {
    set(
      'nombre',
      'Solo letras, espacios y tildes. No se permiten números ni caracteres especiales.',
    );
  }

  const apellido = (model?.apellido ?? '').trim();
  if (!apellido) set('apellido', 'El apellido es obligatorio.');
  else if (apellido.length > MOTHER_NAME_MAX) {
    set('apellido', `El apellido no puede superar los ${MOTHER_NAME_MAX} caracteres.`);
  } else if (!NAME_REGEX.test(apellido)) {
    set(
      'apellido',
      'Solo letras, espacios y tildes. No se permiten números ni caracteres especiales.',
    );
  }

  const dniRaw = model?.dni;
  const dniStr =
    dniRaw === '' || dniRaw === undefined || dniRaw === null ? '' : String(dniRaw);
  if (!dniStr) set('dni', 'El DNI es obligatorio.');
  else if (!/^\d+$/.test(dniStr)) set('dni', 'El DNI solo debe contener números.');
  else if (dniStr.length < MOTHER_DNI_MIN_LEN || dniStr.length > MOTHER_DNI_MAX_LEN) {
    set(
      'dni',
      `El DNI debe tener entre ${MOTHER_DNI_MIN_LEN} y ${MOTHER_DNI_MAX_LEN} dígitos.`,
    );
  } else {
    const dup = mothers.find((m) => {
      if (m == null) return false;
      if (String(m.dni) !== dniStr) return false;
      if (excludeMadreId != null && Number(m.idMadre) === Number(excludeMadreId)) {
        return false;
      }
      return true;
    });
    if (dup) set('dni', 'Ya existe una madre registrada con este DNI.');
  }

  if (!model?.fechaNacimiento) {
    set('fechaNacimiento', 'La fecha de nacimiento es obligatoria.');
  } else {
    const d = dayjs(model.fechaNacimiento);
    if (!d.isValid()) set('fechaNacimiento', 'La fecha no es válida.');
    else {
      if (d.isAfter(dayjs(), 'day')) {
        set('fechaNacimiento', 'No se puede seleccionar una fecha futura.');
      }
      const oldestAllowedBirth = dayjs().subtract(MOTHER_MIN_AGE, 'year').startOf('day');
      if (d.isAfter(oldestAllowedBirth, 'day')) {
        set('fechaNacimiento', 'La persona debe tener al menos 13 años.');
      }
    }
  }

  const loc = model?.localidad;
  if (loc === '' || loc === undefined || loc === null) {
    set('localidad', 'La localidad es obligatoria.');
  }

  const celRaw = model?.celular == null ? '' : String(model.celular).trim();
  if (!celRaw) set('celular', 'El celular es obligatorio.');
  else {
    const normalized = celRaw.replace(/\s/g, '');
    if (!/^\+?[0-9]+$/.test(normalized)) {
      set('celular', 'Solo números y, si aplica, un único + al inicio.');
    } else {
      const digits = normalized.replace(/\D/g, '');
      if (digits.length < MOTHER_PHONE_DIGITS_MIN || digits.length > MOTHER_PHONE_DIGITS_MAX) {
        set(
          'celular',
          `El celular debe tener entre ${MOTHER_PHONE_DIGITS_MIN} y ${MOTHER_PHONE_DIGITS_MAX} dígitos.`,
        );
      }
    }
  }

  const motivo = (model?.motivoAbrazo ?? '').trim();
  if (!motivo) set('motivoAbrazo', 'El motivo del abrazo es obligatorio.');
  else if (motivo.length > MOTHER_MOTIVO_MAX) {
    set('motivoAbrazo', `El motivo no puede superar los ${MOTHER_MOTIVO_MAX} caracteres.`);
  }

  const ch = model?.cantidadHijos;
  if (ch === '' || ch === undefined || ch === null) {
    set('cantidadHijos', 'La cantidad de hijos es obligatoria.');
  } else {
    const n = Number(ch);
    if (!Number.isInteger(n) || n < 1 || n > 40) {
      set('cantidadHijos', 'Ingresá un número entero entre 1 y 40.');
    }
  }

  const ec = model?.estadoCivil;
  if (ec === '' || ec === undefined || ec === null) {
    set('estadoCivil', 'El estado civil es obligatorio.');
  } else {
    const n = Number(ec);
    if (!MOTHER_ESTADO_CIVIL_OPTIONS.some((o) => o.value === n)) {
      set('estadoCivil', 'Seleccioná un estado civil de la lista.');
    }
  }

  return { ok, errors };
}

/** Payload listo para POST/PUT (quita auxiliares y normaliza tipos). */
export function normalizeMotherPayload(model) {
  if (!model || typeof model !== 'object') return model;
  const p = { ...model };
  delete p.nombre_localidad;
  if (typeof p.celular === 'string') {
    const digits = p.celular.replace(/\D/g, '');
    p.celular = digits ? Number(digits) : p.celular;
  }
  if (p.cantidadHijos !== '' && p.cantidadHijos != null) {
    p.cantidadHijos = Number(p.cantidadHijos);
  }
  if (p.estadoCivil !== '' && p.estadoCivil != null) {
    p.estadoCivil = Number(p.estadoCivil);
  }
  return p;
}
