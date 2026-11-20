import { describe, it, expect } from 'vitest';
import reducer from './dashboardReducer';
import * as actionTypes from '../consts/actionTypes';

const initialState = {
  coordinacionHoy: null,
  coberturaHoy: null,
  bebesPorSala: null,
  bebesPorEstado: null,
  bebesRangoEdades: null,
  rankingVoluntarias: null,
  duracionAbrazos: null,
  loading: false,
  error: null,
};

describe('dashboardReducer', () => {
  it('estado inicial ante acción desconocida', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('SHOW_LOADING setea loading', () => {
    expect(reducer(initialState, { type: actionTypes.SHOW_LOADING, payload: true }).loading).toBe(true);
  });

  it('SUCCESS_GET_COORDINACION_HOY guarda data y limpia error/loading', () => {
    const data = { asignados: 3 };
    const next = reducer(
      { ...initialState, loading: true, error: 'x' },
      { type: actionTypes.SUCCESS_GET_COORDINACION_HOY, response: { data } },
    );
    expect(next.coordinacionHoy).toEqual(data);
    expect(next.error).toBeNull();
    expect(next.loading).toBe(false);
  });

  it('SUCCESS_GET_DURACION_ABRAZOS guarda la data compuesta por la saga', () => {
    const data = { general: { promedioMinutos: 10 }, porMes: [] };
    const next = reducer(initialState, { type: actionTypes.SUCCESS_GET_DURACION_ABRAZOS, response: { data } });
    expect(next.duracionAbrazos).toEqual(data);
  });

  it('ERROR_DASHBOARD guarda response (completo) y apaga loading', () => {
    const errResponse = { status: 500 };
    const next = reducer({ ...initialState, loading: true }, { type: actionTypes.ERROR_DASHBOARD, response: errResponse });
    expect(next.error).toEqual(errResponse);
    expect(next.loading).toBe(false);
  });

  it('CLEAR_DASHBOARD vuelve al estado inicial', () => {
    const next = reducer(
      { ...initialState, coordinacionHoy: { x: 1 }, loading: true },
      { type: actionTypes.CLEAR_DASHBOARD },
    );
    expect(next).toEqual(initialState);
  });
});
