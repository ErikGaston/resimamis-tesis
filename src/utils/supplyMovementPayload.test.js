import { describe, it, expect } from 'vitest';
import {
  normalizeEsEntradaForApi,
  normalizeSupplyRegisterMovementBody,
} from './supplyMovementPayload';

describe('normalizeEsEntradaForApi', () => {
  it('mapea variantes de entrada a "S"', () => {
    for (const v of ['S', 's', 'si', 'SI', 'true', '1', 'Y', 'entrada', true]) {
      expect(normalizeEsEntradaForApi(v)).toBe('S');
    }
  });
  it('mapea variantes de salida a "N"', () => {
    for (const v of ['N', 'n', 'no', 'NO', 'false', '0', 'salida', false]) {
      expect(normalizeEsEntradaForApi(v)).toBe('N');
    }
  });
  it('null/vacío → null', () => {
    expect(normalizeEsEntradaForApi(null)).toBeNull();
    expect(normalizeEsEntradaForApi('')).toBeNull();
    expect(normalizeEsEntradaForApi(undefined)).toBeNull();
  });
});

describe('normalizeSupplyRegisterMovementBody', () => {
  it('normaliza esEntrada y conserva el resto del body', () => {
    expect(normalizeSupplyRegisterMovementBody({ idInsumo: 5, cantidad: 3, esEntrada: 'si' }))
      .toEqual({ idInsumo: 5, cantidad: 3, esEntrada: 'S' });
  });
  it('body inválido se devuelve tal cual', () => {
    expect(normalizeSupplyRegisterMovementBody(null)).toBeNull();
    expect(normalizeSupplyRegisterMovementBody(undefined)).toBeUndefined();
  });
});
