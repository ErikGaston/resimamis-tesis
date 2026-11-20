import { describe, it, expect } from 'vitest';
import { call, put } from 'redux-saga/effects';
import horarioSaga from './horarioSaga';
import * as API from '../api';
import * as actionTypes from '../consts/actionTypes';
import { mapWorkersByType, drainFromThrow } from './sagaTestUtils';

const workers = mapWorkersByType(horarioSaga);

describe('horarioSaga', () => {
  it('registra un takeLatest por cada acción del dominio', () => {
    expect(Object.keys(workers)).toEqual(
      expect.arrayContaining([
        actionTypes.GET_HORARIO_DIAS,
        actionTypes.POST_HORARIO,
        actionTypes.PUT_HORARIO,
      ]),
    );
  });

  it('asyncGetHorarioDias: éxito -> SUCCESS_GET_HORARIO_DIAS', () => {
    const gen = workers[actionTypes.GET_HORARIO_DIAS]();
    expect(gen.next().value).toEqual(call(API.getHorarioDias));
    const response = { data: [{ idDia: 1 }] };
    expect(gen.next(response).value).toEqual(put({ type: actionTypes.SUCCESS_GET_HORARIO_DIAS, response }));
  });

  it('asyncPostHorario pasa el payload a la API', () => {
    const payload = [{ idDia: 1, turno: 'Mañana' }];
    const gen = workers[actionTypes.POST_HORARIO]({ payload });
    expect(gen.next().value).toEqual(call(API.postHorario, payload));
    const response = { data: {} };
    expect(gen.next(response).value).toEqual(put({ type: actionTypes.SUCCESS_POST_HORARIO, response }));
  });

  it('asyncPutHorario desarma el payload en (idVoluntaria, body)', () => {
    const payload = { idVoluntaria: 5, body: [{ idDia: 1, idVoluntaria: 5, turno: 'Tarde' }] };
    const gen = workers[actionTypes.PUT_HORARIO]({ payload });
    expect(gen.next().value).toEqual(call(API.putHorario, 5, payload.body));
    const response = { data: {} };
    expect(gen.next(response).value).toEqual(put({ type: actionTypes.SUCCESS_PUT_HORARIO, response }));
  });

  it('error en GET_HORARIO_DIAS -> ERROR_HORARIO sin campo message', () => {
    const gen = workers[actionTypes.GET_HORARIO_DIAS]();
    gen.next();
    const error = new Error('falló');
    const emitted = drainFromThrow(gen, error);
    expect(emitted.at(-1)).toEqual(put({ type: actionTypes.ERROR_HORARIO, response: error }));
  });
});
