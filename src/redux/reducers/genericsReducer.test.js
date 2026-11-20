import { describe, it, expect } from 'vitest';
import reducer from './genericsReducer';
import * as actionTypes from '../consts/actionTypes';

const initialState = {
  getLocalities: null,
  getEstadosCiviles: null,
  loading: false,
  error: null,
};

describe('genericsReducer', () => {
  it('devuelve el estado inicial', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('SHOW_LOADING setea loading', () => {
    expect(reducer(initialState, { type: actionTypes.SHOW_LOADING, payload: true }).loading).toBe(true);
  });

  it('SUCCESS_GET_LOCALITIES guarda data y corta loading', () => {
    const data = [{ id: 1, nombre: 'Córdoba' }];
    const next = reducer(
      { ...initialState, loading: true },
      { type: actionTypes.SUCCESS_GET_LOCALITIES, response: { data } },
    );
    expect(next.getLocalities).toEqual(data);
    expect(next.loading).toBe(false);
  });

  it('SUCCESS_GET_ESTADOS_CIVILES guarda data', () => {
    const data = [{ id: 1 }];
    expect(reducer(initialState, { type: actionTypes.SUCCESS_GET_ESTADOS_CIVILES, response: { data } }).getEstadosCiviles).toEqual(data);
  });

  it('ERROR_LOCALITIES / ERROR_ESTADOS_CIVILES guardan el error (response.data)', () => {
    const next1 = reducer(initialState, { type: actionTypes.ERROR_LOCALITIES, response: { data: 'e1' } });
    expect(next1.error).toBe('e1');
    const next2 = reducer(initialState, { type: actionTypes.ERROR_ESTADOS_CIVILES, response: { data: 'e2' } });
    expect(next2.error).toBe('e2');
  });

  it('acción desconocida no cambia el estado', () => {
    expect(reducer(initialState, { type: 'NADA' })).toEqual(initialState);
  });
});
