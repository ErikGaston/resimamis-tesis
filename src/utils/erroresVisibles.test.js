import { describe, it, expect } from 'vitest';
import { erroresVisibles } from './erroresVisibles';

describe('erroresVisibles', () => {
  it('solo muestra validación de campos que tienen algo cargado', () => {
    const r = erroresVisibles(
      { nombre: 'Ana', dni: '' },
      {},
      { nombre: 'Nombre inválido', dni: 'DNI inválido' },
    );
    expect(r.nombre).toBe('Nombre inválido');
    expect(r.dni).toBe('');
  });

  it('el error del último guardado tiene prioridad aunque el campo esté vacío', () => {
    const r = erroresVisibles(
      { nombre: '' },
      { nombre: 'Requerido (al guardar)' },
      { nombre: 'validación' },
    );
    expect(r.nombre).toBe('Requerido (al guardar)');
  });

  it('sin errores → objeto vacío', () => {
    expect(erroresVisibles({ nombre: 'Ana' }, {}, {})).toEqual({});
  });
});
