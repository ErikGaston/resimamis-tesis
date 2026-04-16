import dayjs from 'dayjs';

export const VOLUNTEER_NAME_MAX = 50;
export const VOLUNTEER_DNI_LEN = 8;
export const VOLUNTEER_PHONE_DIGITS_MIN = 10;
export const VOLUNTEER_PHONE_DIGITS_MAX = 15;
export const VOLUNTEER_EMAIL_MIN = 5;
export const VOLUNTEER_EMAIL_MAX = 100;
export const VOLUNTEER_MIN_AGE = 18;
export const VOLUNTEER_DATE_MIN_YEARS_BACK = 100;
/** Turnos de alta (Mañana/Tarde/Noche) — coincide con valores del formulario. */
export const VOLUNTEER_TURNO_VALUES = [1, 2, 3];

const NAME_REGEX = /^[\p{L}\s]+$/u;
/** Letras, números y @ . _ % + - (sin espacios). */
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const INITIAL_VOLUNTEER_FIELD_ERRORS = {
  nombre: '',
  apellido: '',
  dni: '',
  celular: '',
  mail: '',
  fechaNacimiento: '',
  fechaInicio: '',
  fechaFin: '',
  idEstado: '',
};

function assignmentWindowBounds() {
  const min = dayjs().subtract(1, 'month').startOf('day');
  const max = dayjs().add(1, 'month').endOf('day');
  return { min, max };
}

function isInAssignmentWindow(d) {
  const { min, max } = assignmentWindowBounds();
  return !d.isBefore(min, 'day') && !d.isAfter(max, 'day');
}

function assignmentWindowErrorMsg() {
  const { min, max } = assignmentWindowBounds();
  return `La fecha debe estar entre el ${min.format('DD/MM/YYYY')} y el ${max.format('DD/MM/YYYY')}.`;
}

/**
 * @param {Record<string, unknown>} model
 * @param {{ volunteers?: Array<{ dni?: number|string, idVoluntaria?: number }>, excludeVolunteerId?: number|null }} options
 */
export function validateVolunteerAlta(model, options = {}) {
  const volunteers = options.volunteers ?? [];
  const excludeVolunteerId = options.excludeVolunteerId ?? null;
  const errors = { ...INITIAL_VOLUNTEER_FIELD_ERRORS };
  let ok = true;

  const set = (field, msg) => {
    if (msg) {
      errors[field] = msg;
      ok = false;
    }
  };

  const nombre = (model?.nombre ?? '').trim();
  if (!nombre) set('nombre', 'El nombre es obligatorio.');
  else if (nombre.length > VOLUNTEER_NAME_MAX) {
    set('nombre', `El nombre no puede superar los ${VOLUNTEER_NAME_MAX} caracteres.`);
  } else if (!NAME_REGEX.test(nombre)) {
    set(
      'nombre',
      'Solo letras, espacios y tildes. No se permiten números ni caracteres especiales.',
    );
  }

  const apellido = (model?.apellido ?? '').trim();
  if (!apellido) set('apellido', 'El apellido es obligatorio.');
  else if (apellido.length > VOLUNTEER_NAME_MAX) {
    set('apellido', `El apellido no puede superar los ${VOLUNTEER_NAME_MAX} caracteres.`);
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
  else if (dniStr.length !== VOLUNTEER_DNI_LEN) {
    set('dni', `El DNI debe tener exactamente ${VOLUNTEER_DNI_LEN} dígitos.`);
  } else {
    const dup = volunteers.find((v) => {
      if (v == null) return false;
      if (String(v.dni) !== dniStr) return false;
      const vid = v.idVoluntaria ?? v.id;
      if (
        excludeVolunteerId != null &&
        Number(vid) === Number(excludeVolunteerId)
      ) {
        return false;
      }
      return true;
    });
    if (dup) set('dni', 'Ya existe una voluntaria registrada con este DNI.');
  }

  const celRaw = model?.celular == null ? '' : String(model.celular).trim();
  if (!celRaw) set('celular', 'El celular es obligatorio.');
  else {
    const normalized = celRaw.replace(/\s/g, '');
    if (!/^\+?[0-9]+$/.test(normalized)) {
      set('celular', 'Solo números y, si aplica, un único + al inicio.');
    } else {
      const digits = normalized.replace(/\D/g, '');
      if (
        digits.length < VOLUNTEER_PHONE_DIGITS_MIN ||
        digits.length > VOLUNTEER_PHONE_DIGITS_MAX
      ) {
        set(
          'celular',
          `El celular debe tener entre ${VOLUNTEER_PHONE_DIGITS_MIN} y ${VOLUNTEER_PHONE_DIGITS_MAX} dígitos.`,
        );
      }
    }
  }

  const mailRaw = model?.mail ?? '';
  const mail = typeof mailRaw === 'string' ? mailRaw.trim() : String(mailRaw).trim();
  if (!mail) set('mail', 'El correo electrónico es obligatorio.');
  else if (mail.includes(' ')) {
    set('mail', 'El correo no puede contener espacios.');
  } else if (mail.length < VOLUNTEER_EMAIL_MIN || mail.length > VOLUNTEER_EMAIL_MAX) {
    set(
      'mail',
      `El correo debe tener entre ${VOLUNTEER_EMAIL_MIN} y ${VOLUNTEER_EMAIL_MAX} caracteres.`,
    );
  } else if (!EMAIL_REGEX.test(mail)) {
    set(
      'mail',
      'Ingresá un correo válido. Solo letras, números y los caracteres @ . _ % + -.',
    );
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
      const oldestAllowed = dayjs()
        .subtract(VOLUNTEER_MIN_AGE, 'year')
        .startOf('day');
      if (d.isAfter(oldestAllowed, 'day')) {
        set('fechaNacimiento', 'La persona debe ser mayor de edad (al menos 18 años).');
      }
      const minBirth = dayjs()
        .subtract(VOLUNTEER_DATE_MIN_YEARS_BACK, 'year')
        .startOf('day');
      if (d.isBefore(minBirth, 'day')) {
        set('fechaNacimiento', 'La fecha de nacimiento no es válida.');
      }
    }
  }

  if (!model?.fechaInicio) {
    set('fechaInicio', 'La fecha de inicio es obligatoria.');
  } else {
    const d = dayjs(model.fechaInicio);
    if (!d.isValid()) set('fechaInicio', 'La fecha no es válida.');
    else if (!isInAssignmentWindow(d)) {
      set('fechaInicio', assignmentWindowErrorMsg());
    }
  }

  const turno = model?.idEstado;
  const turnoNum = turno === '' || turno === undefined || turno === null ? NaN : Number(turno);
  if (!Number.isInteger(turnoNum) || !VOLUNTEER_TURNO_VALUES.includes(turnoNum)) {
    set('idEstado', 'El turno es obligatorio.');
  }

  return { ok, errors };
}

/**
 * Perfil: sin turno en UI; valida datos personales y fechas (fechaFin opcional).
 */
export function validateVolunteerProfile(model, options = {}) {
  const volunteers = options.volunteers ?? [];
  const excludeVolunteerId = options.excludeVolunteerId ?? null;
  const errors = { ...INITIAL_VOLUNTEER_FIELD_ERRORS };
  let ok = true;

  const set = (field, msg) => {
    if (msg) {
      errors[field] = msg;
      ok = false;
    }
  };

  const nombre = (model?.nombre ?? '').trim();
  if (!nombre) set('nombre', 'El nombre es obligatorio.');
  else if (nombre.length > VOLUNTEER_NAME_MAX) {
    set('nombre', `El nombre no puede superar los ${VOLUNTEER_NAME_MAX} caracteres.`);
  } else if (!NAME_REGEX.test(nombre)) {
    set(
      'nombre',
      'Solo letras, espacios y tildes. No se permiten números ni caracteres especiales.',
    );
  }

  const apellido = (model?.apellido ?? '').trim();
  if (!apellido) set('apellido', 'El apellido es obligatorio.');
  else if (apellido.length > VOLUNTEER_NAME_MAX) {
    set('apellido', `El apellido no puede superar los ${VOLUNTEER_NAME_MAX} caracteres.`);
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
  else if (dniStr.length !== VOLUNTEER_DNI_LEN) {
    set('dni', `El DNI debe tener exactamente ${VOLUNTEER_DNI_LEN} dígitos.`);
  } else {
    const dup = volunteers.find((v) => {
      if (v == null) return false;
      if (String(v.dni) !== dniStr) return false;
      const vid = v.idVoluntaria ?? v.id;
      if (
        excludeVolunteerId != null &&
        Number(vid) === Number(excludeVolunteerId)
      ) {
        return false;
      }
      return true;
    });
    if (dup) set('dni', 'Ya existe una voluntaria registrada con este DNI.');
  }

  const celRaw = model?.celular == null ? '' : String(model.celular).trim();
  if (!celRaw) set('celular', 'El celular es obligatorio.');
  else {
    const normalized = celRaw.replace(/\s/g, '');
    if (!/^\+?[0-9]+$/.test(normalized)) {
      set('celular', 'Solo números y, si aplica, un único + al inicio.');
    } else {
      const digits = normalized.replace(/\D/g, '');
      if (
        digits.length < VOLUNTEER_PHONE_DIGITS_MIN ||
        digits.length > VOLUNTEER_PHONE_DIGITS_MAX
      ) {
        set(
          'celular',
          `El celular debe tener entre ${VOLUNTEER_PHONE_DIGITS_MIN} y ${VOLUNTEER_PHONE_DIGITS_MAX} dígitos.`,
        );
      }
    }
  }

  const mailRaw = model?.mail ?? '';
  const mail = typeof mailRaw === 'string' ? mailRaw.trim() : String(mailRaw).trim();
  if (!mail) set('mail', 'El correo electrónico es obligatorio.');
  else if (mail.includes(' ')) {
    set('mail', 'El correo no puede contener espacios.');
  } else if (mail.length < VOLUNTEER_EMAIL_MIN || mail.length > VOLUNTEER_EMAIL_MAX) {
    set(
      'mail',
      `El correo debe tener entre ${VOLUNTEER_EMAIL_MIN} y ${VOLUNTEER_EMAIL_MAX} caracteres.`,
    );
  } else if (!EMAIL_REGEX.test(mail)) {
    set(
      'mail',
      'Ingresá un correo válido. Solo letras, números y los caracteres @ . _ % + -.',
    );
  }

  /** Perfil: el contrato VOLUNTARIA del API no siempre incluye fechaNacimiento; si viene vacío no bloqueamos el guardado. */
  if (model?.fechaNacimiento) {
    const d = dayjs(model.fechaNacimiento);
    if (!d.isValid()) set('fechaNacimiento', 'La fecha no es válida.');
    else {
      if (d.isAfter(dayjs(), 'day')) {
        set('fechaNacimiento', 'No se puede seleccionar una fecha futura.');
      }
      const oldestAllowed = dayjs()
        .subtract(VOLUNTEER_MIN_AGE, 'year')
        .startOf('day');
      if (d.isAfter(oldestAllowed, 'day')) {
        set('fechaNacimiento', 'La persona debe ser mayor de edad (al menos 18 años).');
      }
      const minBirth = dayjs()
        .subtract(VOLUNTEER_DATE_MIN_YEARS_BACK, 'year')
        .startOf('day');
      if (d.isBefore(minBirth, 'day')) {
        set('fechaNacimiento', 'La fecha de nacimiento no es válida.');
      }
    }
  }

  if (!model?.fechaInicio) {
    set('fechaInicio', 'La fecha de inicio es obligatoria.');
  } else {
    const d = dayjs(model.fechaInicio);
    if (!d.isValid()) set('fechaInicio', 'La fecha no es válida.');
  }

  const finRaw = model?.fechaFin;
  const hasFin =
    finRaw !== '' &&
    finRaw !== undefined &&
    finRaw !== null &&
    !(typeof finRaw === 'string' && finRaw.trim() === '');
  if (hasFin) {
    const d = dayjs(finRaw);
    if (!d.isValid()) set('fechaFin', 'La fecha no es válida.');
  }

  return { ok, errors };
}

export function normalizeVolunteerPayload(model) {
  if (!model || typeof model !== 'object') return model;
  const p = { ...model };
  delete p.nombre_localidad;
  if (p.idVoluntaria == null && p.id != null) {
    p.idVoluntaria = Number(p.id);
  }
  delete p.id;
  if (typeof p.celular === 'string') {
    const digits = p.celular.replace(/\D/g, '');
    p.celular = digits ? Number(digits) : p.celular;
  }
  if (p.dni !== '' && p.dni != null) {
    p.dni = Number(String(p.dni).replace(/\D/g, ''));
  }
  if (p.idEstado !== '' && p.idEstado != null) {
    p.idEstado = Number(p.idEstado);
  }
  return p;
}
