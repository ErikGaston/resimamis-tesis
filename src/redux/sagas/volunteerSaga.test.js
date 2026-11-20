import { describe, it, expect } from 'vitest';
import { call, put } from 'redux-saga/effects';
import volunteerSaga from './volunteerSaga';
import * as API from '../api';
import * as actionTypes from '../consts/actionTypes';
import { mapWorkersByType, drainFromThrow } from './sagaTestUtils';

const workers = mapWorkersByType(volunteerSaga);

describe('volunteerSaga', () => {
  it('registra un takeLatest por cada acción del dominio', () => {
    expect(Object.keys(workers)).toEqual(
      expect.arrayContaining([
        actionTypes.POST_VOLUNTEER,
        actionTypes.POST_ASSISTANCE,
        actionTypes.POST_ASSISTANCE_SALIDA,
        actionTypes.GET_ASSISTANCE_TODAY,
        actionTypes.GET_ASSISTANCE_HISTORICAS,
        actionTypes.GET_VOLUNTEERS_FREE,
        actionTypes.GET_ASSISTANCE,
        actionTypes.GET_VOLUNTEERS_STATES,
        actionTypes.GET_VOLUNTEER_BY_ID,
        actionTypes.PUT_VOLUNTEER,
        actionTypes.GET_VOLUNTEERS,
        actionTypes.GET_ASSISTANCE_REPORTE,
        actionTypes.POST_ASSISTANCE_DELETE,
        actionTypes.POST_VOLUNTEER_DELETE,
        actionTypes.GET_ASSISTANCE_ALL,
      ]),
    );
  });

  it('asyncPostAssistance: pasa el payload -> SUCCESS_POST_ASSISTANCE', () => {
    const payload = { idVoluntaria: 1 };
    const gen = workers[actionTypes.POST_ASSISTANCE]({ payload });
    expect(gen.next().value).toEqual(call(API.postAssistance, payload));
    const response = { data: { ok: 1 } };
    expect(gen.next(response).value).toEqual(put({ type: actionTypes.SUCCESS_POST_ASSISTANCE, response }));
  });

  it('asyncGetAssistanceAll: llama API.getAsistenciasAll -> SUCCESS_GET_ASSISTANCE_ALL', () => {
    const gen = workers[actionTypes.GET_ASSISTANCE_ALL]();
    expect(gen.next().value).toEqual(call(API.getAsistenciasAll));
    const response = { data: [{ id: 1 }] };
    expect(gen.next(response).value).toEqual(put({ type: actionTypes.SUCCESS_GET_ASSISTANCE_ALL, response }));
  });

  it('asyncGetVolunteers: error -> ERROR_VOLUNTEER con message', () => {
    const gen = workers[actionTypes.GET_VOLUNTEERS]();
    gen.next();
    const error = new Error('x');
    const emitted = drainFromThrow(gen, error);
    expect(emitted.at(-1)).toEqual(
      put({ type: actionTypes.ERROR_VOLUNTEER, response: error, message: error.message }),
    );
  });

  it('asyncGetAssistanceReporte: error -> ERROR_VOLUNTEER sin message', () => {
    const gen = workers[actionTypes.GET_ASSISTANCE_REPORTE]({ payload: {} });
    expect(gen.next().value).toEqual(call(API.getAssistanceReporte, {}));
    const error = new Error('x');
    const emitted = drainFromThrow(gen, error);
    expect(emitted.at(-1)).toEqual(put({ type: actionTypes.ERROR_VOLUNTEER, response: error }));
  });
});
