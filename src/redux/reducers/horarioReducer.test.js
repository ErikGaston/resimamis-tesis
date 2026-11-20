import { describe, it, expect } from 'vitest';
import reducer from './horarioReducer';
import * as actionTypes from '../consts/actionTypes';

const initialState = {
  getHorarioDias: null,
  postHorario: null,
  loading: false,
  error: null,
};

describe('horarioReducer', () => {
  it('estado inicial ante acción desconocida', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('SHOW_LOADING setea loading', () => {
    expect(reducer(initialState, { type: actionTypes.SHOW_LOADING, payload: true }).loading).toBe(true);
  });

  it('SUCCESS_GET_HORARIO_DIAS guarda data y limpia error/loading', () => {
    const data = [{ idDia: 1, nombre: 'Lunes' }];
    const next = reducer(
      { ...initialState, loading: true, error: 'x' },
      { type: actionTypes.SUCCESS_GET_HORARIO_DIAS, response: { data } },
    );
    expect(next.getHorarioDias).toEqual(data);
    expect(next.error).toBeNull();
    expect(next.loading).toBe(false);
  });

  it('SUCCESS_PUT_HORARIO escribe en postHorario (comparte campo con POST)', () => {
    const data = { ok: true };
    const next = reducer(initialState, { type: actionTypes.SUCCESS_PUT_HORARIO, response: { data } });
    expect(next.postHorario).toEqual(data);
  });

  it('ERROR_HORARIO guarda la RESPUESTA COMPLETA (no response.data) y corta loading', () => {
    const response = { data: { message: 'boom' }, status: 400 };
    const next = reducer({ ...initialState, loading: true }, { type: actionTypes.ERROR_HORARIO, response });
    expect(next.error).toBe(response);
    expect(next.loading).toBe(false);
  });

  it('CLEAR_HORARIO_WRITES limpia postHorario y error, conservando getHorarioDias', () => {
    const dirty = { ...initialState, getHorarioDias: [{ idDia: 1 }], postHorario: { ok: 1 }, error: 'e' };
    const next = reducer(dirty, { type: actionTypes.CLEAR_HORARIO_WRITES });
    expect(next.postHorario).toBeNull();
    expect(next.error).toBeNull();
    expect(next.getHorarioDias).toEqual([{ idDia: 1 }]);
  });

  it('CLEAR_HORARIO resetea al estado inicial', () => {
    const dirty = { ...initialState, getHorarioDias: [{ idDia: 1 }], postHorario: { ok: 1 } };
    expect(reducer(dirty, { type: actionTypes.CLEAR_HORARIO })).toEqual(initialState);
  });
});
