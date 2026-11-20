import { describe, it, expect } from 'vitest';
import reducer from './motherReducer';
import * as actionTypes from '../consts/actionTypes';

const initialState = {
  postMother: null,
  getStatisticsLocalities: null,
  getStatisticsAgeMother: null,
  getMother: null,
  getMotherId: null,
  loading: false,
  error: null,
  putMother: null,
  postMotherDelete: null,
};

describe('motherReducer', () => {
  it('devuelve el estado inicial', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('SHOW_LOADING setea loading', () => {
    expect(reducer(initialState, { type: actionTypes.SHOW_LOADING, payload: true }).loading).toBe(true);
  });

  it('SUCCESS_GET_MOTHER guarda data y limpia error/loading', () => {
    const data = [{ id: 1 }];
    const next = reducer(
      { ...initialState, loading: true, error: 'prev' },
      { type: actionTypes.SUCCESS_GET_MOTHER, response: { data } },
    );
    expect(next.getMother).toEqual(data);
    expect(next.error).toBeNull();
    expect(next.loading).toBe(false);
  });

  it('un SUCCESS sin response no cambia la data', () => {
    expect(reducer(initialState, { type: actionTypes.SUCCESS_GET_MOTHER }).getMother).toBeNull();
  });

  it('ERROR_MOTHER guarda el error (response.data) y conserva el error, corta loading', () => {
    const next = reducer(
      { ...initialState, loading: true },
      { type: actionTypes.ERROR_MOTHER, response: { data: { message: 'x' } } },
    );
    expect(next.error).toEqual({ message: 'x' });
    expect(next.loading).toBe(false);
  });

  it('CLEAR_MOTHER_API_ERROR limpia solo el error y conserva listados', () => {
    const next = reducer(
      { ...initialState, error: 'e', getMother: [{ id: 1 }] },
      { type: actionTypes.CLEAR_MOTHER_API_ERROR },
    );
    expect(next.error).toBeNull();
    expect(next.getMother).toEqual([{ id: 1 }]);
  });

  it('CLEAR_MOTHER_WRITES limpia escrituras y conserva getMother/getMotherId', () => {
    const dirty = {
      ...initialState,
      getMother: [{ id: 1 }],
      getMotherId: { id: 2 },
      postMother: { ok: 1 },
      putMother: { ok: 1 },
      postMotherDelete: { ok: 1 },
      error: 'e',
    };
    const next = reducer(dirty, { type: actionTypes.CLEAR_MOTHER_WRITES });
    expect(next.postMother).toBeNull();
    expect(next.putMother).toBeNull();
    expect(next.postMotherDelete).toBeNull();
    expect(next.error).toBeNull();
    expect(next.getMother).toEqual([{ id: 1 }]);
    expect(next.getMotherId).toEqual({ id: 2 });
  });

  it('CLEAR_MOTHER limpia todo, incluido getMother', () => {
    const dirty = { ...initialState, getMother: [{ id: 1 }], postMother: { ok: 1 } };
    const next = reducer(dirty, { type: actionTypes.CLEAR_MOTHER });
    expect(next.getMother).toBeNull();
    expect(next.postMother).toBeNull();
  });
});
