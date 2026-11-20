import { describe, it, expect } from 'vitest';
import dayjs from 'dayjs';
import { isBabyRowEmpty, validateBabyForm } from './babyFormValidation';

const validBaby = () => ({
  nombre: 'Juan',
  apellido: 'Pérez',
  sexo: 'M',
  fechaNacimiento: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
});

describe('isBabyRowEmpty', () => {
  it('fila vacía o no-objeto → true', () => {
    expect(isBabyRowEmpty({})).toBe(true);
    expect(isBabyRowEmpty(null)).toBe(true);
  });
  it('cualquier campo relevante cargado → false', () => {
    expect(isBabyRowEmpty({ nombre: 'Ana' })).toBe(false);
    expect(isBabyRowEmpty({ idSala: 3 })).toBe(false);
  });
});

describe('validateBabyForm', () => {
  it('un bebé válido pasa (dni y pesos opcionales)', () => {
    expect(validateBabyForm(validBaby()).ok).toBe(true);
  });
  it('marca obligatorios vacíos', () => {
    const { ok, errors } = validateBabyForm({});
    expect(ok).toBe(false);
    expect(errors.nombre).toBeTruthy();
    expect(errors.apellido).toBeTruthy();
    expect(errors.sexo).toBeTruthy();
    expect(errors.fechaNacimiento).toBeTruthy();
  });
  it('rechaza sexo inválido y acepta M/F/O', () => {
    expect(validateBabyForm({ ...validBaby(), sexo: 'X' }).errors.sexo).toMatch(/inválido/i);
    expect(validateBabyForm({ ...validBaby(), sexo: 'f' }).ok).toBe(true);
  });
  it('valida DNI (7-8 dígitos) solo si viene', () => {
    expect(validateBabyForm({ ...validBaby(), dni: '123' }).errors.dni).toBeTruthy();
    expect(validateBabyForm({ ...validBaby(), dni: '12345678' }).ok).toBe(true);
  });
  it('rechaza nacimiento futuro', () => {
    const fut = dayjs().add(1, 'day').format('YYYY-MM-DD');
    expect(validateBabyForm({ ...validBaby(), fechaNacimiento: fut }).errors.fechaNacimiento).toMatch(/futura/i);
  });
  it('ingreso a NEO no puede ser anterior al nacimiento', () => {
    const b = { ...validBaby(), fechaNacimiento: '2026-05-10', fechaIngresoNEO: '2026-05-01' };
    expect(validateBabyForm(b).errors.fechaIngresoNEO).toMatch(/anterior al nacimiento/i);
  });
  it('valida rango de peso 0,1-6 kg (acepta coma decimal)', () => {
    expect(validateBabyForm({ ...validBaby(), pesoNacimiento: '7' }).errors.pesoNacimiento).toMatch(/entre 0,1 y 6/);
    expect(validateBabyForm({ ...validBaby(), pesoNacimiento: 'abc' }).errors.pesoNacimiento).toMatch(/inválido/i);
    expect(validateBabyForm({ ...validBaby(), pesoNacimiento: '2,5' }).ok).toBe(true);
  });
});
