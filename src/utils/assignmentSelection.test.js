import { describe, it, expect } from 'vitest';
import {
  listBabysFromAbrazarResponse,
  resolveIdTareaForGenerarTareas,
  babyRowKey,
} from './assignmentSelection';

describe('listBabysFromAbrazarResponse', () => {
  it('null/undefined → []', () => {
    expect(listBabysFromAbrazarResponse(null)).toEqual([]);
    expect(listBabysFromAbrazarResponse(undefined)).toEqual([]);
  });
  it('un array se devuelve tal cual', () => {
    expect(listBabysFromAbrazarResponse([{ id: 1 }])).toEqual([{ id: 1 }]);
  });
  it('resuelve las distintas formas del envelope', () => {
    expect(listBabysFromAbrazarResponse({ data: [1] })).toEqual([1]);
    expect(listBabysFromAbrazarResponse({ listadoBebesAbrazar: [2] })).toEqual([2]);
    expect(listBabysFromAbrazarResponse({ resultado: [3] })).toEqual([3]);
  });
  it('objeto sin ninguna clave conocida → []', () => {
    expect(listBabysFromAbrazarResponse({ otra: [9] })).toEqual([]);
  });
});

describe('resolveIdTareaForGenerarTareas', () => {
  it('prioriza idTarea', () => {
    expect(resolveIdTareaForGenerarTareas({ idTarea: 5, idBebe: 9 })).toBe(5);
    expect(resolveIdTareaForGenerarTareas({ id_tarea: 6 })).toBe(6);
  });
  it('cae a idBebe/id si no hay idTarea', () => {
    expect(resolveIdTareaForGenerarTareas({ idBebe: 7 })).toBe(7);
    expect(resolveIdTareaForGenerarTareas({ id: 8 })).toBe(8);
    expect(resolveIdTareaForGenerarTareas({ idTarea: '', idBebe: 9 })).toBe(9);
  });
  it('null si no hay nada usable', () => {
    expect(resolveIdTareaForGenerarTareas({})).toBeNull();
    expect(resolveIdTareaForGenerarTareas(null)).toBeNull();
  });
});

describe('babyRowKey', () => {
  it('usa el id resuelto', () => {
    expect(babyRowKey({ idTarea: 5 }, 0)).toBe('tarea-5');
  });
  it('cae al índice si no hay id', () => {
    expect(babyRowKey({}, 2)).toBe('baby-2');
  });
});
