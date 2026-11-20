import { describe, it, expect } from 'vitest';
import { esCierreAutomatico } from './cierreAutomatico';

describe('esCierreAutomatico', () => {
  it('true si el flag cierreAutomatico está en true', () => {
    expect(esCierreAutomatico({ cierreAutomatico: true })).toBe(true);
  });
  it('true si el comentario empieza con "Cierre automático"', () => {
    expect(esCierreAutomatico({ comentario: 'Cierre automático: sin finalizar' })).toBe(true);
  });
  it('false para un abrazo normal o sin datos', () => {
    expect(esCierreAutomatico({ comentario: 'Todo bien' })).toBe(false);
    expect(esCierreAutomatico({})).toBe(false);
    expect(esCierreAutomatico(null)).toBe(false);
  });
});
