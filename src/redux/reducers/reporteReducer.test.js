import { describe, it, expect } from 'vitest';
import reducer from './reporteReducer';
import * as actionTypes from '../consts/actionTypes';

const initialState = {
  historialBajas: null,
  diasTurnos: null,
  reporteDiario: null,
  visitasEstadisticas: null,
  cierresAutomaticos: null,
  cierreDiarioEstado: null,
  loading: false,
  error: null,
};

describe('reporteReducer', () => {
  it('estado inicial ante acción desconocida', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('GET_HISTORIAL_BAJAS prende loading', () => {
    expect(reducer(initialState, { type: actionTypes.GET_HISTORIAL_BAJAS, payload: 'Madre' }).loading).toBe(true);
  });

  it('SUCCESS_GET_HISTORIAL_BAJAS desanida response.data.data (doble envelope) y apaga loading', () => {
    const rows = [{ idMadre: 1 }];
    const next = reducer(
      { ...initialState, loading: true, error: 'x' },
      { type: actionTypes.SUCCESS_GET_HISTORIAL_BAJAS, response: { data: { data: rows } } },
    );
    expect(next.historialBajas).toEqual(rows);
    expect(next.loading).toBe(false);
    expect(next.error).toBeNull();
  });

  it('SUCCESS sin el doble envelope guarda null', () => {
    const next = reducer(initialState, { type: actionTypes.SUCCESS_GET_REPORTE_DIARIO, response: { data: {} } });
    expect(next.reporteDiario).toBeNull();
  });

  it('ERROR_REPORTE guarda response (o true) y apaga loading', () => {
    const errResponse = { status: 500 };
    const next = reducer({ ...initialState, loading: true }, { type: actionTypes.ERROR_REPORTE, response: errResponse });
    expect(next.error).toEqual(errResponse);
    expect(next.loading).toBe(false);

    const sinResponse = reducer(initialState, { type: actionTypes.ERROR_REPORTE });
    expect(sinResponse.error).toBe(true);
  });

  it('CLEAR_REPORTE vuelve al estado inicial', () => {
    const next = reducer(
      { ...initialState, historialBajas: [{ idMadre: 1 }], loading: true },
      { type: actionTypes.CLEAR_REPORTE },
    );
    expect(next).toEqual(initialState);
  });
});
