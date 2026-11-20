import { describe, it, expect } from 'vitest';
import { call, put } from 'redux-saga/effects';
import reporteSaga from './reporteSaga';
import * as API from '../api';
import * as actionTypes from '../consts/actionTypes';
import { mapWorkersByType, drainFromThrow } from './sagaTestUtils';

const workers = mapWorkersByType(reporteSaga);

describe('reporteSaga', () => {
  it('registra un takeLatest por cada reporte', () => {
    expect(Object.keys(workers)).toEqual(
      expect.arrayContaining([
        actionTypes.GET_HISTORIAL_BAJAS,
        actionTypes.GET_DIAS_TURNOS,
        actionTypes.GET_REPORTE_DIARIO,
        actionTypes.GET_VISITAS_ESTADISTICAS,
        actionTypes.GET_CIERRES_AUTOMATICOS,
        actionTypes.GET_CIERRE_DIARIO_ESTADO,
      ]),
    );
  });

  it('worker de historial: pasa el payload y despacha SUCCESS', () => {
    const gen = workers[actionTypes.GET_HISTORIAL_BAJAS]({ payload: 'Madre' });
    expect(gen.next().value).toEqual(call(API.getHistorialBajas, 'Madre'));
    const response = { data: { data: [{ idMadre: 1 }] } };
    expect(gen.next(response).value).toEqual(put({ type: actionTypes.SUCCESS_GET_HISTORIAL_BAJAS, response }));
    expect(gen.next().done).toBe(true);
  });

  it('worker de reporte diario: error -> toast + ERROR_REPORTE', () => {
    const gen = workers[actionTypes.GET_REPORTE_DIARIO]({ payload: '2026-11-19' });
    expect(gen.next().value).toEqual(call(API.getReporteDiario, '2026-11-19'));
    const error = new Error('falló');
    const emitted = drainFromThrow(gen, error);
    expect(emitted).toHaveLength(3);
    expect(emitted.at(-1)).toEqual(put({ type: actionTypes.ERROR_REPORTE, response: error }));
  });
});
