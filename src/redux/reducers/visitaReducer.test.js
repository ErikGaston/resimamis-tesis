import { describe, it, expect } from 'vitest';
import reducer from './visitaReducer';
import * as actionTypes from '../consts/actionTypes';

const initialState = {
  getVisitas: null,
  getVisitasByBebe: null,
  getVisitaById: null,
  postVisita: null,
  putVisita: null,
  postVisitaDelete: null,
  loading: false,
  error: null,
};

describe('visitaReducer', () => {
  it('estado inicial ante acción desconocida', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('SHOW_LOADING setea loading', () => {
    expect(reducer(initialState, { type: actionTypes.SHOW_LOADING, payload: true }).loading).toBe(true);
  });

  it('SUCCESS_GET_VISITAS_BY_BEBE guarda data y limpia error/loading', () => {
    const data = [{ idVisita: 1 }];
    const next = reducer(
      { ...initialState, loading: true, error: 'x' },
      { type: actionTypes.SUCCESS_GET_VISITAS_BY_BEBE, response: { data } },
    );
    expect(next.getVisitasByBebe).toEqual(data);
    expect(next.error).toBeNull();
    expect(next.loading).toBe(false);
  });

  it('un SUCCESS sin response no cambia la data', () => {
    const next = reducer(initialState, { type: actionTypes.SUCCESS_GET_VISITAS_BY_BEBE });
    expect(next.getVisitasByBebe).toBeNull();
  });

  it('ERROR_VISITA guarda el error desde response.data y corta loading', () => {
    const next = reducer(
      { ...initialState, loading: true },
      { type: actionTypes.ERROR_VISITA, response: { data: { message: 'boom' } } },
    );
    expect(next.error).toEqual({ message: 'boom' });
    expect(next.loading).toBe(false);
  });

  it('CLEAR_VISITA_WRITES limpia escrituras y error, conservando el listado por bebé', () => {
    const dirty = {
      ...initialState,
      getVisitasByBebe: [{ idVisita: 1 }],
      postVisita: { ok: 1 },
      putVisita: { ok: 1 },
      postVisitaDelete: { ok: 1 },
      error: 'e',
    };
    const next = reducer(dirty, { type: actionTypes.CLEAR_VISITA_WRITES });
    expect(next.postVisita).toBeNull();
    expect(next.putVisita).toBeNull();
    expect(next.postVisitaDelete).toBeNull();
    expect(next.error).toBeNull();
    expect(next.getVisitasByBebe).toEqual([{ idVisita: 1 }]);
  });
});
