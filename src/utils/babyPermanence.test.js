import { describe, it, expect } from 'vitest';
import {
  normalizeBabyPermanence,
  filterByIngreso,
  summarizePermanence,
  buildPermanenceHistogram,
  formatDias,
} from './babyPermanence';

describe('normalizeBabyPermanence', () => {
  it('aplana la lista y arma nombre completo', () => {
    const r = normalizeBabyPermanence({
      bebes: [{ idBebe: 1, nombre: 'Ana', apellido: 'Pérez', diasPermanencia: 10, fechaIngresoNeo: '2026-05-01' }],
    });
    expect(r).toHaveLength(1);
    expect(r[0]).toMatchObject({ idBebe: 1, nombreCompleto: 'Pérez Ana', diasPermanencia: 10 });
    expect(r[0].fechaIngreso.isValid()).toBe(true);
  });
  it('descarta filas con días no numéricos', () => {
    const r = normalizeBabyPermanence({ bebes: [{ diasPermanencia: 'abc' }] });
    expect(r).toEqual([]);
  });
  it('respuesta sin lista → null', () => {
    expect(normalizeBabyPermanence({})).toBeNull();
    expect(normalizeBabyPermanence(null)).toBeNull();
  });
});

describe('filterByIngreso', () => {
  const bebes = normalizeBabyPermanence({
    bebes: [
      { idBebe: 1, diasPermanencia: 5, fechaIngresoNeo: '2026-05-10' },
      { idBebe: 2, diasPermanencia: 8, fechaIngresoNeo: '2026-07-10' },
    ],
  });
  it('filtra por rango de fecha de ingreso', () => {
    expect(filterByIngreso(bebes, '2026-05-01', '2026-05-31').map((b) => b.idBebe)).toEqual([1]);
    expect(filterByIngreso(bebes, '2026-06-01', null).map((b) => b.idBebe)).toEqual([2]);
  });
  it('no-array → []', () => {
    expect(filterByIngreso(null)).toEqual([]);
  });
});

describe('summarizePermanence', () => {
  it('calcula total, promedio, mínimo y máximo', () => {
    expect(summarizePermanence([{ diasPermanencia: 10 }, { diasPermanencia: 20 }]))
      .toEqual({ total: 2, promedio: 15, minimo: 10, maximo: 20 });
  });
  it('vacío → ceros', () => {
    expect(summarizePermanence([])).toEqual({ total: 0, promedio: 0, minimo: 0, maximo: 0 });
  });
});

describe('buildPermanenceHistogram', () => {
  it('cuenta por bucket', () => {
    const h = buildPermanenceHistogram([
      { diasPermanencia: 5 }, { diasPermanencia: 10 }, { diasPermanencia: 70 },
    ]);
    expect(h.find((x) => x.label === '0-7 días').cantidad).toBe(1);
    expect(h.find((x) => x.label === '8-14 días').cantidad).toBe(1);
    expect(h.find((x) => x.label === '61+ días').cantidad).toBe(1);
  });
});

describe('formatDias', () => {
  it('singular/plural y decimales', () => {
    expect(formatDias(1)).toBe('1 día');
    expect(formatDias(2)).toBe('2 días');
    expect(formatDias(1.5)).toBe('1.5 días');
  });
});
