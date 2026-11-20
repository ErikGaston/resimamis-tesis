import { describe, it, expect } from 'vitest';
import { capitalizarNombre, capitalizarTitulo } from './capitalizacion';

describe('capitalizarNombre', () => {
  it('capitaliza cada palabra', () => {
    expect(capitalizarNombre('maría DEL carmen')).toBe('María Del Carmen');
  });
  it('normaliza espacios de más', () => {
    expect(capitalizarNombre('  juan   perez  ')).toBe('Juan Perez');
  });
  it('respeta guiones y apóstrofos internos', () => {
    expect(capitalizarNombre('ana-maría')).toBe('Ana-María');
    expect(capitalizarNombre("o'brien")).toBe("O'Brien");
  });
  it('null y vacío se devuelven tal cual', () => {
    expect(capitalizarNombre(null)).toBeNull();
    expect(capitalizarNombre('')).toBe('');
  });
});

describe('capitalizarTitulo', () => {
  it('capitaliza palabras normales', () => {
    expect(capitalizarTitulo('sala de partos')).toBe('Sala De Partos');
  });
  it('respeta siglas en mayúsculas (NEO, UCIN)', () => {
    expect(capitalizarTitulo('NEO A')).toBe('NEO A');
    expect(capitalizarTitulo('UCIN')).toBe('UCIN');
  });
  it('capitaliza una palabra larga en minúsculas aunque parezca sigla', () => {
    expect(capitalizarTitulo('neonatologia')).toBe('Neonatologia');
  });
  it('null y vacío se devuelven tal cual', () => {
    expect(capitalizarTitulo(null)).toBeNull();
    expect(capitalizarTitulo('')).toBe('');
  });
});
