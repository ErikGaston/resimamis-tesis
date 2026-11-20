import { describe, it, expect } from 'vitest';
import reducer from './babyReducer';
import * as actionTypes from '../consts/actionTypes';

const initialState = {
  getBabys: null,
  postBaby: null,
  putBaby: null,
  loading: false,
  error: null,
  getBabysFree: null,
  getBabySalas: null,
  getBabyByDni: null,
  postBabyDelete: null,
  getBabyWeightEvolution: null,
  getBabyPermanencia: null,
};

describe('babyReducer', () => {
  it('devuelve el estado inicial ante una acción desconocida', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('SHOW_LOADING setea loading con el payload', () => {
    expect(reducer(initialState, { type: actionTypes.SHOW_LOADING, payload: true }).loading).toBe(true);
    expect(
      reducer({ ...initialState, loading: true }, { type: actionTypes.SHOW_LOADING, payload: false }).loading,
    ).toBe(false);
  });

  it('SUCCESS_GET_BABYS guarda data y limpia error/loading', () => {
    const data = [{ id: 1 }];
    const next = reducer(
      { ...initialState, loading: true, error: 'previo' },
      { type: actionTypes.SUCCESS_GET_BABYS, response: { data } },
    );
    expect(next.getBabys).toEqual(data);
    expect(next.error).toBeNull();
    expect(next.loading).toBe(false);
  });

  it('un SUCCESS sin response no cambia la data', () => {
    const next = reducer(initialState, { type: actionTypes.SUCCESS_GET_BABYS });
    expect(next.getBabys).toBeNull();
  });

  it('ERROR_BABY guarda el error desde response.data y corta loading', () => {
    const next = reducer(
      { ...initialState, loading: true },
      { type: actionTypes.ERROR_BABY, response: { data: { message: 'boom' } } },
    );
    expect(next.error).toEqual({ message: 'boom' });
    expect(next.loading).toBe(false);
  });

  it('CLEAR_BABY_WRITES limpia solo los flags de escritura y conserva el listado', () => {
    const dirty = {
      ...initialState,
      getBabys: [{ id: 1 }],
      postBaby: { ok: 1 },
      putBaby: { ok: 1 },
      postBabyDelete: { ok: 1 },
      error: 'e',
    };
    const next = reducer(dirty, { type: actionTypes.CLEAR_BABY_WRITES });
    expect(next.postBaby).toBeNull();
    expect(next.putBaby).toBeNull();
    expect(next.postBabyDelete).toBeNull();
    expect(next.error).toBeNull();
    expect(next.getBabys).toEqual([{ id: 1 }]);
  });

  it('CLEAR_BABY limpia escrituras y consultas secundarias pero conserva getBabys', () => {
    const dirty = {
      ...initialState,
      getBabys: [{ id: 1 }],
      getBabyByDni: { id: 2 },
      getBabysFree: [{ id: 3 }],
      postBaby: { ok: 1 },
    };
    const next = reducer(dirty, { type: actionTypes.CLEAR_BABY });
    expect(next.getBabyByDni).toBeNull();
    expect(next.getBabysFree).toBeNull();
    expect(next.postBaby).toBeNull();
    expect(next.getBabys).toEqual([{ id: 1 }]);
  });
});
