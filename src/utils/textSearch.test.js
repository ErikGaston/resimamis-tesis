import { describe, it, expect } from 'vitest';
import { coincideBusqueda, ordenarPorNombre } from './textSearch';

describe('coincideBusqueda', () => {
  it('consulta vacía matchea todo', () => {
    expect(coincideBusqueda('', ['Juan'], 123)).toBe(true);
    expect(coincideBusqueda('   ', ['Juan'], 123)).toBe(true);
    expect(coincideBusqueda(null, ['Juan'], 123)).toBe(true);
  });

  it('es insensible a mayúsculas y tildes', () => {
    expect(coincideBusqueda('suarez', ['Suárez'])).toBe(true);
    expect(coincideBusqueda('MARIA', ['María Belén'])).toBe(true);
    expect(coincideBusqueda('belen', ['María Belén'])).toBe(true);
  });

  it('matchea por DNI cuando la consulta trae dígitos', () => {
    expect(coincideBusqueda('4711', ['Pérez'], 47110017)).toBe(true);
    expect(coincideBusqueda('99999', ['Pérez'], 47110017)).toBe(false);
  });

  it('NO devuelve todo con texto sin match (guarda de dígitos)', () => {
    // Regresión del bug histórico: ''.includes('') daba true y devolvía todos.
    expect(coincideBusqueda('zzz', ['Perez'], 47110017)).toBe(false);
  });

  it('dni null/undefined no rompe', () => {
    expect(coincideBusqueda('123', ['x'], null)).toBe(false);
    expect(coincideBusqueda('123', ['x'], undefined)).toBe(false);
  });

  it('textos con valores nulos no rompen', () => {
    expect(coincideBusqueda('ana', [null, undefined, 'Ana'])).toBe(true);
  });
});

describe('ordenarPorNombre', () => {
  it('ordena alfabéticamente ignorando tildes y mayúsculas', () => {
    const lista = [{ n: 'Zapata' }, { n: 'Ábalos' }, { n: 'alvarez' }];
    const r = ordenarPorNombre(lista, (x) => x.n).map((x) => x.n);
    expect(r).toEqual(['Ábalos', 'alvarez', 'Zapata']);
  });

  it('no muta la lista original', () => {
    const lista = [{ n: 'B' }, { n: 'A' }];
    const copia = [...lista];
    ordenarPorNombre(lista, (x) => x.n);
    expect(lista).toEqual(copia);
  });

  it('lista null/undefined devuelve []', () => {
    expect(ordenarPorNombre(null, (x) => x)).toEqual([]);
    expect(ordenarPorNombre(undefined, (x) => x)).toEqual([]);
  });
});
