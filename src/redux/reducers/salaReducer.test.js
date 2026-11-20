import { describe, it, expect } from 'vitest';
import reducer from './salaReducer';
import * as actionTypes from '../consts/actionTypes';

const initialState = {
  getSalasAll: null,
  postSala: null,
  putSala: null,
  postSalaDelete: null,
  loading: false,
  error: null,
};

describe('salaReducer', () => {
  it('estado inicial ante acción desconocida', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('SHOW_LOADING setea loading', () => {
    expect(reducer(initialState, { type: actionTypes.SHOW_LOADING, payload: true }).loading).toBe(true);
  });

  it('SUCCESS_GET_SALAS_ALL guarda data y limpia error/loading', () => {
    const data = [{ idSala: 1 }];
    const next = reducer(
      { ...initialState, loading: true, error: 'x' },
      { type: actionTypes.SUCCESS_GET_SALAS_ALL, response: { data } },
    );
    expect(next.getSalasAll).toEqual(data);
    expect(next.error).toBeNull();
    expect(next.loading).toBe(false);
  });

  it('SUCCESS sin response no cambia la data', () => {
    const next = reducer(initialState, { type: actionTypes.SUCCESS_POST_SALA });
    expect(next.postSala).toBeNull();
  });

  it('ERROR_SALA guarda el error desde response.data y corta loading', () => {
    const next = reducer(
      { ...initialState, loading: true },
      { type: actionTypes.ERROR_SALA, response: { data: { message: 'boom' } } },
    );
    expect(next.error).toEqual({ message: 'boom' });
    expect(next.loading).toBe(false);
  });

  it('CLEAR_SALA_WRITES limpia escrituras y conserva el listado', () => {
    const dirty = {
      ...initialState,
      getSalasAll: [{ idSala: 1 }],
      postSala: { ok: 1 },
      putSala: { ok: 1 },
      postSalaDelete: { ok: 1 },
      error: 'e',
    };
    const next = reducer(dirty, { type: actionTypes.CLEAR_SALA_WRITES });
    expect(next.postSala).toBeNull();
    expect(next.putSala).toBeNull();
    expect(next.postSalaDelete).toBeNull();
    expect(next.error).toBeNull();
    expect(next.getSalasAll).toEqual([{ idSala: 1 }]);
  });
});
