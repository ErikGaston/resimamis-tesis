import { describe, it, expect } from 'vitest';
import { call, put } from 'redux-saga/effects';
import genericsSaga from './genericsSaga';
import * as API from '../api';
import * as actionTypes from '../consts/actionTypes';
import { mapWorkersByType, drainFromThrow } from './sagaTestUtils';

const workers = mapWorkersByType(genericsSaga);

describe('genericsSaga', () => {
  it('registra takeLatest de localidades y estados civiles', () => {
    expect(Object.keys(workers)).toEqual(
      expect.arrayContaining([actionTypes.GET_LOCALITIES, actionTypes.GET_ESTADOS_CIVILES]),
    );
  });

  it('asyncGetLocalities: éxito -> SUCCESS_GET_LOCALITIES', () => {
    const gen = workers[actionTypes.GET_LOCALITIES]();
    expect(gen.next().value).toEqual(call(API.getLocalities));
    const response = { data: [{ id: 1 }] };
    expect(gen.next(response).value).toEqual(put({ type: actionTypes.SUCCESS_GET_LOCALITIES, response }));
  });

  it('asyncGetLocalities: error -> ERROR_LOCALITIES con message', () => {
    const gen = workers[actionTypes.GET_LOCALITIES]();
    gen.next();
    const error = new Error('x');
    const emitted = drainFromThrow(gen, error);
    expect(emitted.at(-1)).toEqual(
      put({ type: actionTypes.ERROR_LOCALITIES, response: error, message: error.message }),
    );
  });

  it('asyncGetEstadosCiviles: error -> ERROR_ESTADOS_CIVILES con message', () => {
    const gen = workers[actionTypes.GET_ESTADOS_CIVILES]();
    gen.next();
    const error = new Error('y');
    const emitted = drainFromThrow(gen, error);
    expect(emitted.at(-1)).toEqual(
      put({ type: actionTypes.ERROR_ESTADOS_CIVILES, response: error, message: error.message }),
    );
  });
});
