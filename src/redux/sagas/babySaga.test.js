import { describe, it, expect } from 'vitest';
import { call, put } from 'redux-saga/effects';
import babySaga from './babySaga';
import * as API from '../api';
import * as actionTypes from '../consts/actionTypes';
import { mapWorkersByType, drainFromThrow } from './sagaTestUtils';

const workers = mapWorkersByType(babySaga);

describe('babySaga', () => {
  it('registra un takeLatest por cada acción del dominio', () => {
    expect(Object.keys(workers)).toEqual(
      expect.arrayContaining([
        actionTypes.GET_BABYS,
        actionTypes.POST_BABY,
        actionTypes.PUT_BABY,
        actionTypes.GET_BABYS_FREE,
        actionTypes.GET_BABY_BY_DNI,
        actionTypes.POST_BABY_DELETE,
        actionTypes.GET_BABY_SALAS,
        actionTypes.GET_BABY_WEIGHT_EVOLUTION,
        actionTypes.GET_BABY_PERMANENCIA,
      ]),
    );
  });

  it('asyncGetBabys: éxito -> SUCCESS_GET_BABYS', () => {
    const gen = workers[actionTypes.GET_BABYS]();
    expect(gen.next().value).toEqual(call(API.getBabys));
    const response = { data: [{ id: 1 }] };
    expect(gen.next(response).value).toEqual(put({ type: actionTypes.SUCCESS_GET_BABYS, response }));
    expect(gen.next().done).toBe(true);
  });

  it('asyncGetBabys: error -> ERROR_BABY (tras el toast de error)', () => {
    const gen = workers[actionTypes.GET_BABYS]();
    gen.next(); // call(API.getBabys)
    const error = new Error('falló');
    const emitted = drainFromThrow(gen, error);
    expect(emitted.at(-1)).toEqual(
      put({ type: actionTypes.ERROR_BABY, response: error, message: error.message }),
    );
  });

  it('asyncPostBaby: pasa el payload a la API', () => {
    const payload = { nombre: 'Ana' };
    const gen = workers[actionTypes.POST_BABY]({ payload });
    expect(gen.next().value).toEqual(call(API.postBaby, payload));
    const response = { data: { id: 9 } };
    expect(gen.next(response).value).toEqual(put({ type: actionTypes.SUCCESS_POST_BABY, response }));
  });

  it('asyncGetBabysFree: si falla disponibles-abrazo, cae a getBabysFree', () => {
    const gen = workers[actionTypes.GET_BABYS_FREE]();
    expect(gen.next().value).toEqual(call(API.getBabysDisponiblesAbrazo));
    expect(gen.throw(new Error('404')).value).toEqual(call(API.getBabysFree));
    const response = { data: [{ id: 2 }] };
    expect(gen.next(response).value).toEqual(put({ type: actionTypes.SUCCESS_GET_BABYS_FREE, response }));
  });
});
