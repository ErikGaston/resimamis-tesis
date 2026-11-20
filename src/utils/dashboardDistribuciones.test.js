import { describe, it, expect } from 'vitest';
import {
  normalizeBebesPorSala,
  normalizeBebesPorEstado,
  normalizeBebesRangoEdades,
  totalDe,
} from './dashboardDistribuciones';

describe('normalizeBebesPorSala', () => {
  it('aplana a { label, cantidad }', () => {
    expect(normalizeBebesPorSala({ porSala: [{ nombreSala: 'NEO A', cantidadBebes: 8 }] }))
      .toEqual([{ label: 'NEO A', cantidad: 8 }]);
  });
  it('acepta claves en PascalCase', () => {
    expect(normalizeBebesPorSala({ PorSala: [{ NombreSala: 'UCIN', CantidadBebes: 3 }] }))
      .toEqual([{ label: 'UCIN', cantidad: 3 }]);
  });
  it('descarta items sin label o cantidad no numérica', () => {
    expect(normalizeBebesPorSala({ porSala: [{ cantidadBebes: 2 }, { nombreSala: 'X', cantidadBebes: 'a' }] }))
      .toEqual([]);
  });
  it('sin lista → null', () => {
    expect(normalizeBebesPorSala({})).toBeNull();
  });
});

describe('normalizeBebesPorEstado / RangoEdades', () => {
  it('usan sus propias claves', () => {
    expect(normalizeBebesPorEstado({ porEstado: [{ estadoBebe: 'Abrazado', cantidad: 2 }] }))
      .toEqual([{ label: 'Abrazado', cantidad: 2 }]);
    expect(normalizeBebesRangoEdades({ rangos: [{ rango: '0-7', cantidadBebes: 4 }] }))
      .toEqual([{ label: '0-7', cantidad: 4 }]);
  });
});

describe('totalDe', () => {
  it('lee totalBebes (o null)', () => {
    expect(totalDe({ totalBebes: 10 })).toBe(10);
    expect(totalDe({})).toBeNull();
  });
});
