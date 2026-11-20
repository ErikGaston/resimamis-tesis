import { describe, it, expect } from 'vitest';
import dayjs from 'dayjs';
import {
  resolveListadoMadreId,
  getMotherEstadoCivilOptionsForSelect,
  validateMotherForm,
  normalizeMotherPayload,
  MOTHER_ESTADO_CIVIL_OPTIONS,
} from './motherFormValidation';

const validModel = () => ({
  nombre: 'Ana',
  apellido: 'Pérez',
  dni: '47110017',
  fechaNacimiento: dayjs().subtract(30, 'year').format('YYYY-MM-DD'),
  localidad: 5,
  celular: '3511234567',
  motivoAbrazo: 'Acompañamiento',
  cantidadHijos: 2,
  estadoCivil: 1,
});

describe('resolveListadoMadreId', () => {
  it('resuelve las variantes de id', () => {
    expect(resolveListadoMadreId({ idMadre: 5 })).toBe(5);
    expect(resolveListadoMadreId({ IdMadre: 7 })).toBe(7);
    expect(resolveListadoMadreId({ id: '9' })).toBe(9);
  });
  it('null si no hay id válido', () => {
    expect(resolveListadoMadreId({})).toBeNull();
    expect(resolveListadoMadreId(null)).toBeNull();
    expect(resolveListadoMadreId({ idMadre: '' })).toBeNull();
  });
});

describe('getMotherEstadoCivilOptionsForSelect', () => {
  it('usa la lista estática por defecto', () => {
    expect(getMotherEstadoCivilOptionsForSelect(1)).toEqual(MOTHER_ESTADO_CIVIL_OPTIONS);
  });
  it('agrega una opción legacy si el valor actual no está', () => {
    const r = getMotherEstadoCivilOptionsForSelect(99);
    expect(r[0]).toEqual({ label: 'Código 99 (registrado en el sistema)', value: 99 });
    expect(r).toHaveLength(MOTHER_ESTADO_CIVIL_OPTIONS.length + 1);
  });
  it('respeta opciones dinámicas del API', () => {
    const r = getMotherEstadoCivilOptionsForSelect(2, [{ label: 'A', value: 1 }]);
    expect(r).toEqual([{ label: 'Código 2 (registrado en el sistema)', value: 2 }, { label: 'A', value: 1 }]);
  });
});

describe('validateMotherForm', () => {
  it('un modelo válido pasa', () => {
    expect(validateMotherForm(validModel())).toEqual({ ok: true, errors: expect.any(Object) });
  });

  it('marca campos obligatorios vacíos', () => {
    const { ok, errors } = validateMotherForm({});
    expect(ok).toBe(false);
    expect(errors.nombre).toBeTruthy();
    expect(errors.apellido).toBeTruthy();
    expect(errors.dni).toBeTruthy();
    expect(errors.fechaNacimiento).toBeTruthy();
    expect(errors.localidad).toBeTruthy();
    expect(errors.celular).toBeTruthy();
    expect(errors.motivoAbrazo).toBeTruthy();
    expect(errors.cantidadHijos).toBeTruthy();
    expect(errors.estadoCivil).toBeTruthy();
  });

  it('rechaza nombre con números', () => {
    const { ok, errors } = validateMotherForm({ ...validModel(), nombre: 'Ana3' });
    expect(ok).toBe(false);
    expect(errors.nombre).toMatch(/letras/i);
  });

  it('rechaza DNI de longitud inválida', () => {
    expect(validateMotherForm({ ...validModel(), dni: '123' }).errors.dni).toMatch(/dígitos/i);
    expect(validateMotherForm({ ...validModel(), dni: 'abc12345' }).errors.dni).toMatch(/números/i);
  });

  it('detecta DNI duplicado y lo excluye por excludeMadreId', () => {
    const mothers = [{ dni: '47110017', idMadre: 9 }];
    expect(validateMotherForm(validModel(), { mothers }).errors.dni).toMatch(/Ya existe/i);
    expect(validateMotherForm(validModel(), { mothers, excludeMadreId: 9 }).ok).toBe(true);
  });

  it('rechaza fecha futura y menores de 13', () => {
    const futura = dayjs().add(1, 'day').format('YYYY-MM-DD');
    expect(validateMotherForm({ ...validModel(), fechaNacimiento: futura }).errors.fechaNacimiento).toBeTruthy();
    const menor = dayjs().subtract(5, 'year').format('YYYY-MM-DD');
    expect(validateMotherForm({ ...validModel(), fechaNacimiento: menor }).errors.fechaNacimiento).toMatch(/13/);
  });

  it('valida cantidad de hijos (entero 1-40)', () => {
    expect(validateMotherForm({ ...validModel(), cantidadHijos: 0 }).errors.cantidadHijos).toBeTruthy();
    expect(validateMotherForm({ ...validModel(), cantidadHijos: 41 }).errors.cantidadHijos).toBeTruthy();
  });

  it('valida celular (10-15 dígitos, + inicial opcional)', () => {
    expect(validateMotherForm({ ...validModel(), celular: '12345' }).errors.celular).toBeTruthy();
    expect(validateMotherForm({ ...validModel(), celular: 'no-telefono' }).errors.celular).toBeTruthy();
    expect(validateMotherForm({ ...validModel(), celular: '+5493511234567' }).ok).toBe(true);
  });
});

describe('normalizeMotherPayload', () => {
  it('capitaliza, limpia auxiliares y normaliza tipos', () => {
    const p = normalizeMotherPayload({
      nombre: 'ana', apellido: 'perez',
      celular: '351 123 4567', cantidadHijos: '2', estadoCivil: '1',
      nombre_localidad: 'Córdoba', estadoDetalle: {}, localidadDetalle: {}, bebe: [],
    });
    expect(p.nombre).toBe('Ana');
    expect(p.apellido).toBe('Perez');
    expect(p.celular).toBe(3511234567);
    expect(p.cantidadHijos).toBe(2);
    expect(p.estadoCivil).toBe(1);
    expect(p).not.toHaveProperty('nombre_localidad');
    expect(p).not.toHaveProperty('bebe');
    expect(p).not.toHaveProperty('estadoDetalle');
  });
  it('body inválido se devuelve tal cual', () => {
    expect(normalizeMotherPayload(null)).toBeNull();
  });
});
