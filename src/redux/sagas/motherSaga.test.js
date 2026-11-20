import { describe, it, expect } from 'vitest';
import { call, put } from 'redux-saga/effects';
import motherSaga from './motherSaga';
import * as API from '../api';
import * as actionTypes from '../consts/actionTypes';
import { mapWorkersByType, drainFromThrow } from './sagaTestUtils';

const workers = mapWorkersByType(motherSaga);

describe('motherSaga', () => {
  it('registra un takeLatest por cada acción del dominio', () => {
    expect(Object.keys(workers)).toEqual(
      expect.arrayContaining([
        actionTypes.POST_MOTHER,
        actionTypes.GET_MOTHER,
        actionTypes.GET_MOTHER_ID,
        actionTypes.GET_STATISTICS_LOCALITIES,
        actionTypes.GET_STATISTICS_AGE_MOTHER,
        actionTypes.PUT_MOTHER,
        actionTypes.POST_MOTHER_DELETE,
      ]),
    );
  });

  it('asyncGetMother: éxito -> SUCCESS_GET_MOTHER', () => {
    const gen = workers[actionTypes.GET_MOTHER]();
    expect(gen.next().value).toEqual(call(API.getMother));
    const response = { data: [{ id: 1 }] };
    expect(gen.next(response).value).toEqual(put({ type: actionTypes.SUCCESS_GET_MOTHER, response }));
    expect(gen.next().done).toBe(true);
  });

  it('asyncGetMother: error -> ERROR_MOTHER con message', () => {
    const gen = workers[actionTypes.GET_MOTHER]();
    gen.next();
    const error = new Error('boom');
    const emitted = drainFromThrow(gen, error);
    expect(emitted.at(-1)).toEqual(
      put({ type: actionTypes.ERROR_MOTHER, response: error, message: error.message }),
    );
  });

  it('asyncPostMother: pasa el payload a la API', () => {
    const payload = { dni: '1' };
    const gen = workers[actionTypes.POST_MOTHER]({ payload });
    expect(gen.next().value).toEqual(call(API.postMother, payload));
    const response = { data: { id: 9 } };
    expect(gen.next(response).value).toEqual(put({ type: actionTypes.SUCCESS_POST_MOTHER, response }));
  });

  it('asyncPostMotherDelete: error -> ERROR_MOTHER sin message', () => {
    const gen = workers[actionTypes.POST_MOTHER_DELETE]({ payload: 5 });
    expect(gen.next().value).toEqual(call(API.postMotherDelete, 5));
    const error = new Error('x');
    const emitted = drainFromThrow(gen, error);
    expect(emitted.at(-1)).toEqual(put({ type: actionTypes.ERROR_MOTHER, response: error }));
  });
});
