import { describe, it, expect } from 'vitest';
import { call, put } from 'redux-saga/effects';
import visitaSaga from './visitaSaga';
import * as API from '../api';
import * as actionTypes from '../consts/actionTypes';
import { mapWorkersByType, drainFromThrow } from './sagaTestUtils';

const workers = mapWorkersByType(visitaSaga);

describe('visitaSaga', () => {
  it('registra un takeLatest por cada acción del dominio', () => {
    expect(Object.keys(workers)).toEqual(
      expect.arrayContaining([
        actionTypes.GET_VISITAS,
        actionTypes.GET_VISITAS_BY_BEBE,
        actionTypes.GET_VISITA_BY_ID,
        actionTypes.POST_VISITA,
        actionTypes.PUT_VISITA,
        actionTypes.POST_VISITA_DELETE,
      ]),
    );
  });

  it('asyncGetVisitasByBebe: éxito -> SUCCESS_GET_VISITAS_BY_BEBE', () => {
    const gen = workers[actionTypes.GET_VISITAS_BY_BEBE]({ payload: 60 });
    expect(gen.next().value).toEqual(call(API.getVisitasByBebe, 60));
    const response = { data: [{ idVisita: 1 }] };
    expect(gen.next(response).value).toEqual(put({ type: actionTypes.SUCCESS_GET_VISITAS_BY_BEBE, response }));
  });

  it('asyncPutVisita desarma { idVisita, body }', () => {
    const payload = { idVisita: 3, body: { nombreVisitante: 'Ana' } };
    const gen = workers[actionTypes.PUT_VISITA]({ payload });
    expect(gen.next().value).toEqual(call(API.putVisitaById, 3, { nombreVisitante: 'Ana' }));
  });

  it('POST_VISITA con error genérico (500): muestra toast y luego ERROR_VISITA', () => {
    const gen = workers[actionTypes.POST_VISITA]({ payload: {} });
    gen.next(); // call
    const error = { status: 500, data: {} };
    const emitted = drainFromThrow(gen, error);
    // showToast + showLoading(false) + ERROR_VISITA
    expect(emitted.length).toBe(3);
    expect(emitted.at(-1)).toEqual(put({ type: actionTypes.ERROR_VISITA, response: error }));
  });

  it('POST_VISITA con validación por campo (400 ModelState): NO muestra toast, solo ERROR_VISITA', () => {
    const gen = workers[actionTypes.POST_VISITA]({ payload: {} });
    gen.next(); // call
    const error = { status: 400, data: { errors: { nombreVisitante: ['requerido'] } } };
    const emitted = drainFromThrow(gen, error);
    expect(emitted.length).toBe(1);
    expect(emitted[0]).toEqual(put({ type: actionTypes.ERROR_VISITA, response: error }));
  });
});
