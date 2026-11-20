import { describe, it, expect } from 'vitest';
import {
  GENERIC_API_ERROR,
  stripValidationIndexPrefix,
  mapAspNetErrorsToMotherFieldErrors,
  isAspNetModelStateErrors,
  resolveApiErrorMessage,
} from './apiErrorMessage';

describe('stripValidationIndexPrefix', () => {
  it('quita "0: " al inicio', () => {
    expect(stripValidationIndexPrefix('0: El nombre es obligatorio')).toBe('El nombre es obligatorio');
  });
  it('quita varios segmentos "n:"', () => {
    expect(stripValidationIndexPrefix('0: a 1: b')).toBe('a b');
  });
  it('devuelve no-strings tal cual', () => {
    expect(stripValidationIndexPrefix(42)).toBe(42);
    expect(stripValidationIndexPrefix(null)).toBe(null);
  });
});

describe('mapAspNetErrorsToMotherFieldErrors', () => {
  it('mapea claves ASP.NET a campos del form', () => {
    const body = { errors: { Nombre: ['req'], Fecha_Nacimiento: ['mal'], Dni: ['dup'] } };
    expect(mapAspNetErrorsToMotherFieldErrors(body)).toEqual({
      nombre: 'req', fechaNacimiento: 'mal', dni: 'dup',
    });
  });
  it('ignora claves desconocidas y mensajes vacíos', () => {
    const body = { errors: { Desconocido: ['x'], Nombre: [''] } };
    expect(mapAspNetErrorsToMotherFieldErrors(body)).toEqual({});
  });
  it('body inválido devuelve {}', () => {
    expect(mapAspNetErrorsToMotherFieldErrors(null)).toEqual({});
    expect(mapAspNetErrorsToMotherFieldErrors({ errors: ['arr'] })).toEqual({});
  });
});

describe('isAspNetModelStateErrors', () => {
  it('detecta la forma errors: { campo: [...] }', () => {
    expect(isAspNetModelStateErrors({ errors: { Nombre: ['x'] } })).toBe(true);
  });
  it('false si errors es array o falta', () => {
    expect(isAspNetModelStateErrors({ errors: ['x'] })).toBe(false);
    expect(isAspNetModelStateErrors({})).toBe(false);
    expect(isAspNetModelStateErrors(null)).toBe(false);
  });
});

describe('resolveApiErrorMessage', () => {
  it('null/vacío → genérico', () => {
    expect(resolveApiErrorMessage(null)).toBe(GENERIC_API_ERROR);
    expect(resolveApiErrorMessage('')).toBe(GENERIC_API_ERROR);
  });
  it('detecta Network Error', () => {
    expect(resolveApiErrorMessage('Network Error')).toMatch(/conexión/i);
  });
  it('prioriza data.errors (objeto) uniendo mensajes', () => {
    const err = { data: { errors: { Nombre: ['Requerido'], Dni: ['Inválido'] } } };
    expect(resolveApiErrorMessage(err)).toBe('Requerido Inválido');
  });
  it('toma data.errors como array (backend Resimamis)', () => {
    expect(resolveApiErrorMessage({ data: { errors: ['Primero', 'Segundo'] } })).toBe('Primero');
  });
  it('cae a data.message', () => {
    expect(resolveApiErrorMessage({ data: { message: 'Algo falló' } })).toBe('Algo falló');
  });
  it('mapea status 500 y 400', () => {
    expect(resolveApiErrorMessage({ status: 500, statusText: 'Server Error' })).toMatch(/servidor no está disponible/i);
    expect(resolveApiErrorMessage({ status: 400, statusText: 'Bad Request' })).toMatch(/no son válidos/i);
  });
});
