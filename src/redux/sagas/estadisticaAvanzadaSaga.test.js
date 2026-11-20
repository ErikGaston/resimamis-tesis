import { describe, it, expect } from 'vitest';
import { call, put } from 'redux-saga/effects';
import estadisticaAvanzadaSaga from './estadisticaAvanzadaSaga';
import * as API from '../api';
import * as actionTypes from '../consts/actionTypes';
import { mapWorkersByType, drainFromThrow } from './sagaTestUtils';

const workers = mapWorkersByType(estadisticaAvanzadaSaga);

describe('estadisticaAvanzadaSaga', () => {
  it('registra el takeLatest de GET_ESTADISTICA_AVANZADA', () => {
    expect(Object.keys(workers)).toEqual(expect.arrayContaining([actionTypes.GET_ESTADISTICA_AVANZADA]));
  });

  it('éxito: pasa el payload completo y adjunta tipo en el SUCCESS', () => {
    const payload = { tipo: 'impacto', params: { fechaDesde: '2026-01-01' } };
    const gen = workers[actionTypes.GET_ESTADISTICA_AVANZADA]({ payload });
    expect(gen.next().value).toEqual(call(API.getEstadisticaAvanzada, payload));
    const response = { data: { data: [{ x: 1 }] } };
    expect(gen.next(response).value).toEqual(
      put({ type: actionTypes.SUCCESS_GET_ESTADISTICA_AVANZADA, response, tipo: 'impacto' }),
    );
  });

  it('error: toast + ERROR con el tipo adjunto', () => {
    const payload = { tipo: 'impacto', params: {} };
    const gen = workers[actionTypes.GET_ESTADISTICA_AVANZADA]({ payload });
    gen.next();
    const error = new Error('falló');
    const emitted = drainFromThrow(gen, error);
    expect(emitted.at(-1)).toEqual(
      put({ type: actionTypes.ERROR_ESTADISTICA_AVANZADA, response: error, tipo: 'impacto' }),
    );
  });
});
