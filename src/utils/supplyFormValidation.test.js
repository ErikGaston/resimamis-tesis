import { describe, it, expect } from 'vitest';
import {
  supplyNameError,
  supplyDescriptionError,
  supplyStockError,
  supplyStockMaxError,
  isSupplyFormValid,
  SUPPLY_STOCK_MAX,
} from './supplyFormValidation';

describe('supplyNameError', () => {
  it('vacío → null (lo cubre required)', () => {
    expect(supplyNameError('')).toBeNull();
    expect(supplyNameError('  ')).toBeNull();
  });
  it('mínimo/máximo', () => {
    expect(supplyNameError('a')).toMatch(/Mínimo/);
    expect(supplyNameError('ab')).toBeNull();
    expect(supplyNameError('x'.repeat(101))).toMatch(/Máximo/);
  });
});

describe('supplyDescriptionError', () => {
  it('solo falla por exceso de largo', () => {
    expect(supplyDescriptionError('')).toBeNull();
    expect(supplyDescriptionError('x'.repeat(501))).toMatch(/Máximo/);
  });
});

describe('supplyStockError', () => {
  it('exige número no negativo y bajo el máximo', () => {
    expect(supplyStockError('')).toMatch(/número/i);
    expect(supplyStockError('abc')).toMatch(/número/i);
    expect(supplyStockError(-1)).toMatch(/negativo/i);
    expect(supplyStockError(SUPPLY_STOCK_MAX + 1)).toMatch(/Máximo/);
    expect(supplyStockError(10)).toBeNull();
  });
});

describe('supplyStockMaxError', () => {
  it('máximo no puede ser menor al mínimo', () => {
    expect(supplyStockMaxError(5, 10)).toMatch(/menor al stock mínimo/i);
    expect(supplyStockMaxError(10, 5)).toBeNull();
  });
});

describe('isSupplyFormValid', () => {
  it('form completo y coherente → true', () => {
    expect(isSupplyFormValid({
      nombre: 'Pañales', descripcion: 'Talle 1',
      stockActual: 10, stockMinimo: 5, stockMaximo: 50,
    })).toBe(true);
  });
  it('nombre vacío → false', () => {
    expect(isSupplyFormValid({ nombre: '', stockActual: 1, stockMinimo: 1, stockMaximo: 2 })).toBe(false);
  });
  it('máximo < mínimo → false', () => {
    expect(isSupplyFormValid({
      nombre: 'Gasas', stockActual: 1, stockMinimo: 10, stockMaximo: 5,
    })).toBe(false);
  });
});
