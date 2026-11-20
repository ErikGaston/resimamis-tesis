import { describe, it, expect } from 'vitest';
import {
  gananciaGramos,
  buildMonthlyAverageGain,
  formatGramos,
  normalizeWeightEvolution,
} from './weightEvolution';

describe('gananciaGramos', () => {
  it('convierte kg a gramos (peso < 20) y calcula la diferencia', () => {
    expect(gananciaGramos({ pesoIngresoNEO: 1.5, pesoAlta: 2.5 })).toBe(1000);
  });
  it('respeta pesos ya en gramos (>= 20)', () => {
    expect(gananciaGramos({ pesoIngresoNeo: 1500, pesoEgreso: 2500 })).toBe(1000);
  });
  it('null si falta un peso o es <= 0', () => {
    expect(gananciaGramos({ pesoIngresoNEO: 1.5 })).toBeNull();
    expect(gananciaGramos({ pesoIngresoNEO: 0, pesoAlta: 2 })).toBeNull();
  });
});

describe('buildMonthlyAverageGain', () => {
  it('agrupa por mes y promedia la ganancia', () => {
    const r = buildMonthlyAverageGain([
      { pesoIngresoNEO: 1, pesoAlta: 2, fechaSalida: '2026-05-10' },
      { pesoIngresoNEO: 1, pesoAlta: 1.5, fechaSalida: '2026-05-20' },
    ]);
    expect(r).toHaveLength(1);
    expect(r[0]).toMatchObject({ key: '2026-05', promedio: 750, cantidad: 2 });
  });
  it('lista vacía → []', () => {
    expect(buildMonthlyAverageGain([])).toEqual([]);
    expect(buildMonthlyAverageGain(null)).toEqual([]);
  });
});

describe('formatGramos', () => {
  it('formatea con separador de miles', () => {
    expect(formatGramos(1450)).toBe('1.450 g');
  });
  it('null → guion', () => {
    expect(formatGramos(null)).toBe('—');
  });
  it('signed antepone signo', () => {
    expect(formatGramos(1000, { signed: true })).toBe('+1.000 g');
    expect(formatGramos(0, { signed: true })).toBe('0 g');
    expect(formatGramos(-500, { signed: true })).toContain('500 g');
    expect(formatGramos(-500, { signed: true })).not.toContain('+');
  });
});

describe('normalizeWeightEvolution', () => {
  it('null → null', () => {
    expect(normalizeWeightEvolution(null)).toBeNull();
  });
  it('acepta envelope {data} y calcula promedio de ganancias', () => {
    const r = normalizeWeightEvolution({
      data: { totalBebes: 1, bebes: [{ pesoIngresoNEO: 1, pesoAlta: 2 }] },
    });
    expect(r.totalBebes).toBe(1);
    expect(r.promedioGanancia).toBe(1000);
    expect(r.gananciaMinima).toBe(1000);
    expect(r.gananciaMaxima).toBe(1000);
  });
});
