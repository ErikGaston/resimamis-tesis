import { describe, it, expect } from 'vitest';
import { call, put } from 'redux-saga/effects';
import salaSaga from './salaSaga';
import * as API from '../api';
import * as actionTypes from '../consts/actionTypes';
import { mapWorkersByType, drainFromThrow } from './sagaTestUtils';

const workers = mapWorkersByType(salaSaga);

describe('salaSaga', () => {
  it('registra un takeLatest por acción', () => {
    expect(Object.keys(workers)).toEqual(
      expect.arrayContaining([
        actionTypes.GET_SALAS_ALL,
        actionTypes.POST_SALA,
        actionTypes.PUT_SALA,
        actionTypes.POST_SALA_DELETE,
      ]),
    );
  });

  it('asyncGetSalasAll: éxito -> SUCCESS', () => {
    const gen = workers[actionTypes.GET_SALAS_ALL]();
    expect(gen.next().value).toEqual(call(API.getSalasAll));
    const response = { data: [{ idSala: 1 }] };
    expect(gen.next(response).value).toEqual(put({ type: actionTypes.SUCCESS_GET_SALAS_ALL, response }));
    expect(gen.next().done).toBe(true);
  });

  it('asyncGetSalasAll: error -> ERROR_SALA', () => {
    const gen = workers[actionTypes.GET_SALAS_ALL]();
    gen.next();
    const error = new Error('falló');
    const emitted = drainFromThrow(gen, error);
    expect(emitted.at(-1)).toEqual(put({ type: actionTypes.ERROR_SALA, response: error }));
  });

  it('asyncPutSala: pasa idSala y body por separado a la API', () => {
    const body = { nombre: 'NEO A' };
    const gen = workers[actionTypes.PUT_SALA]({ payload: { idSala: 3, body } });
    expect(gen.next().value).toEqual(call(API.putSala, 3, body));
    const response = { data: { idSala: 3 } };
    expect(gen.next(response).value).toEqual(put({ type: actionTypes.SUCCESS_PUT_SALA, response }));
  });

  it('asyncPostSalaDelete: pasa el id a la API', () => {
    const gen = workers[actionTypes.POST_SALA_DELETE]({ payload: 4 });
    expect(gen.next().value).toEqual(call(API.postSalaDelete, 4));
  });
});
