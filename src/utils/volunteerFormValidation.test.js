import { describe, it, expect } from 'vitest';
import dayjs from 'dayjs';
import {
  validateVolunteerAlta,
  validateVolunteerProfile,
  normalizeVolunteerPayload,
} from './volunteerFormValidation';

const validAlta = () => ({
  nombre: 'Ana',
  apellido: 'Gómez',
  dni: '47110017',
  celular: '3511234567',
  mail: 'ana@mail.com',
  fechaNacimiento: dayjs().subtract(25, 'year').format('YYYY-MM-DD'),
  fechaInicio: dayjs().format('YYYY-MM-DD'),
  idTurno: 1,
});

describe('validateVolunteerAlta', () => {
  it('modelo válido pasa', () => {
    expect(validateVolunteerAlta(validAlta()).ok).toBe(true);
  });
  it('DNI debe tener exactamente 8 dígitos', () => {
    expect(validateVolunteerAlta({ ...validAlta(), dni: '1234567' }).errors.dni).toMatch(/8/);
  });
  it('detecta DNI duplicado salvo exclusión', () => {
    const volunteers = [{ dni: '47110017', idVoluntaria: 3 }];
    expect(validateVolunteerAlta(validAlta(), { volunteers }).errors.dni).toMatch(/Ya existe/i);
    expect(validateVolunteerAlta(validAlta(), { volunteers, excludeVolunteerId: 3 }).ok).toBe(true);
  });
  it('valida el correo', () => {
    expect(validateVolunteerAlta({ ...validAlta(), mail: 'noemail' }).errors.mail).toBeTruthy();
    expect(validateVolunteerAlta({ ...validAlta(), mail: 'a b@c.com' }).errors.mail).toMatch(/espacios/i);
  });
  it('exige mayoría de edad (18)', () => {
    const menor = dayjs().subtract(16, 'year').format('YYYY-MM-DD');
    expect(validateVolunteerAlta({ ...validAlta(), fechaNacimiento: menor }).errors.fechaNacimiento).toMatch(/edad/i);
  });
  it('fechaInicio fuera de la ventana ±1 mes', () => {
    const lejos = dayjs().subtract(2, 'month').format('YYYY-MM-DD');
    expect(validateVolunteerAlta({ ...validAlta(), fechaInicio: lejos }).errors.fechaInicio).toBeTruthy();
  });
  it('turno obligatorio y dentro de 1-3', () => {
    expect(validateVolunteerAlta({ ...validAlta(), idTurno: 5 }).errors.idTurno).toBeTruthy();
    expect(validateVolunteerAlta({ ...validAlta(), idTurno: undefined }).errors.idTurno).toBeTruthy();
  });
});

describe('validateVolunteerProfile', () => {
  it('myProfile omite dni, fechas y turno', () => {
    const r = validateVolunteerProfile(
      { nombre: 'Ana', apellido: 'Gómez', celular: '3511234567', mail: 'ana@mail.com' },
      { myProfile: true },
    );
    expect(r.ok).toBe(true);
  });
});

describe('normalizeVolunteerPayload', () => {
  it('id→idVoluntaria, capitaliza, tipa celular/dni y mapea idTurno→idEstado', () => {
    const p = normalizeVolunteerPayload({
      id: 9, nombre: 'ana', apellido: 'gomez',
      celular: '351 123 4567', dni: '47110017', idTurno: '2',
    });
    expect(p.idVoluntaria).toBe(9);
    expect(p).not.toHaveProperty('id');
    expect(p.nombre).toBe('Ana');
    expect(p.celular).toBe(3511234567);
    expect(p.dni).toBe(47110017);
    expect(p.idEstado).toBe(2);
    expect(p).not.toHaveProperty('idTurno');
  });
});
