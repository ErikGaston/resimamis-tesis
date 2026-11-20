import { describe, it, expect } from 'vitest';
import { filterNameChars, filterDigits } from './inputFilters';

describe('filterNameChars', () => {
  it('deja solo letras (con tildes/ñ) y espacios', () => {
    expect(filterNameChars('María José2!')).toBe('María José');
    expect(filterNameChars('Núñez-123')).toBe('Núñez');
  });
  it('null/undefined → cadena vacía', () => {
    expect(filterNameChars(null)).toBe('');
    expect(filterNameChars(undefined)).toBe('');
  });
});

describe('filterDigits', () => {
  it('deja solo dígitos', () => {
    expect(filterDigits('351-15 6000')).toBe('351156000');
    expect(filterDigits('abc')).toBe('');
  });
  it('null/undefined → cadena vacía', () => {
    expect(filterDigits(null)).toBe('');
  });
});
