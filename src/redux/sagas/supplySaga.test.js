import { describe, it, expect } from 'vitest';
import { call, put } from 'redux-saga/effects';
import supplySaga from './supplySaga';
import * as API from '../api';
import * as actionTypes from '../consts/actionTypes';
import { normalizeSupplyRegisterMovementBody } from '../../utils/supplyMovementPayload';
import { mapWorkersByType, drainFromThrow } from './sagaTestUtils';

const workers = mapWorkersByType(supplySaga);

describe('supplySaga', () => {
  it('registra un takeLatest por cada acción del dominio', () => {
    expect(Object.keys(workers)).toEqual(
      expect.arrayContaining([
        actionTypes.GET_SUPPLIES,
        actionTypes.GET_STATISTICS_SUPPLIES,
        actionTypes.POST_SUPPLY_CONSULT_MOVEMENTS,
        actionTypes.GET_SUPPLY_PROVIDERS,
        actionTypes.POST_SUPPLY_REGISTER_MOVEMENT,
        actionTypes.POST_SUPPLY_CREATE,
        actionTypes.GET_SUPPLY_BY_ID,
        actionTypes.PUT_SUPPLY_BY_ID,
        actionTypes.POST_SUPPLY_DELETE,
        actionTypes.GET_SUPPLY_BAJO_MINIMO,
      ]),
    );
  });

  it('asyncGetSupplies: éxito -> SUCCESS_GET_SUPPLIES', () => {
    const gen = workers[actionTypes.GET_SUPPLIES]();
    expect(gen.next().value).toEqual(call(API.getSupplies));
    const response = { data: [{ idInsumo: 1 }] };
    expect(gen.next(response).value).toEqual(put({ type: actionTypes.SUCCESS_GET_SUPPLIES, response }));
  });

  it('asyncPostSupplyRegisterMovement normaliza esEntrada (boolean true -> "S") antes de llamar a la API', () => {
    const payload = { idInsumo: 1, cantidad: 5, esEntrada: true };
    const expectedBody = normalizeSupplyRegisterMovementBody(payload);
    expect(expectedBody.esEntrada).toBe('S'); // la normalización convierte a "S"/"N"
    const gen = workers[actionTypes.POST_SUPPLY_REGISTER_MOVEMENT]({ payload });
    expect(gen.next().value).toEqual(call(API.postSupplyRegisterMovement, expectedBody));
    const response = { data: {} };
    expect(gen.next(response).value).toEqual(put({ type: actionTypes.SUCCESS_POST_SUPPLY_REGISTER_MOVEMENT, response }));
  });

  it('asyncPostSupplyConsultMovements pasa el body { fechaDesde, fechaHasta }', () => {
    const payload = { fechaDesde: '2026-01-01', fechaHasta: '2026-02-01' };
    const gen = workers[actionTypes.POST_SUPPLY_CONSULT_MOVEMENTS]({ payload });
    expect(gen.next().value).toEqual(call(API.postSupplyConsultMovements, payload));
  });

  it('error en GET_SUPPLIES -> ERROR_SUPPLY con message = error.message', () => {
    const gen = workers[actionTypes.GET_SUPPLIES]();
    gen.next();
    const error = new Error('falló');
    const emitted = drainFromThrow(gen, error);
    expect(emitted.at(-1)).toEqual(put({ type: actionTypes.ERROR_SUPPLY, response: error, message: error.message }));
  });

  it('error en GET_SUPPLY_BY_ID -> ERROR_SUPPLY sin campo message', () => {
    const gen = workers[actionTypes.GET_SUPPLY_BY_ID]({ payload: 1 });
    gen.next();
    const error = new Error('falló');
    const emitted = drainFromThrow(gen, error);
    expect(emitted.at(-1)).toEqual(put({ type: actionTypes.ERROR_SUPPLY, response: error }));
  });
});
