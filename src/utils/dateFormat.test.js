import { describe, it, expect } from 'vitest';
import { formattedDate, fechaSinHora } from './dateFormat';

describe('formattedDate', () => {
  it('formatea a YYYY-MM-DD', () => {
    expect(formattedDate('2026-04-15')).toBe('2026-04-15');
  });
  it('fecha inválida → cadena vacía', () => {
    expect(formattedDate('no-es-fecha')).toBe('');
    expect(formattedDate(null)).toBe('');
  });
});

describe('fechaSinHora', () => {
  it('NO corre un día una fecha de medianoche UTC (regresión)', () => {
    // El back manda "1990-04-15T00:00:00Z"; dayjs la pasaría a hora AR (un día antes).
    expect(fechaSinHora('1990-04-15T00:00:00Z').format('YYYY-MM-DD')).toBe('1990-04-15');
  });
  it('acepta fecha pura YYYY-MM-DD', () => {
    expect(fechaSinHora('1990-04-15').format('YYYY-MM-DD')).toBe('1990-04-15');
  });
  it('respeta una fecha con hora real (queda válida)', () => {
    expect(fechaSinHora('2026-04-15T14:30:00Z').isValid()).toBe(true);
  });
  it('null/vacío/basura → null', () => {
    expect(fechaSinHora(null)).toBeNull();
    expect(fechaSinHora('')).toBeNull();
    expect(fechaSinHora('basura')).toBeNull();
  });
});
