import { describe, it, expect } from 'vitest';
import reducer from './supplyReducer';
import * as actionTypes from '../consts/actionTypes';

const initialState = {
  getSupplies: null,
  getStatisticsSupplies: null,
  postSupplyConsultMovements: null,
  getSupplyProviders: null,
  postSupplyRegisterMovement: null,
  postSupplyCreate: null,
  getSupplyById: null,
  putSupplyById: null,
  postSupplyDelete: null,
  getSupplyBajoMinimo: null,
  loading: false,
  error: null,
};

describe('supplyReducer', () => {
  it('estado inicial ante acción desconocida', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('SHOW_LOADING setea loading', () => {
    expect(reducer(initialState, { type: actionTypes.SHOW_LOADING, payload: true }).loading).toBe(true);
  });

  it('SUCCESS_GET_SUPPLIES guarda data y limpia error/loading', () => {
    const data = [{ idInsumo: 1 }];
    const next = reducer(
      { ...initialState, loading: true, error: 'x' },
      { type: actionTypes.SUCCESS_GET_SUPPLIES, response: { data } },
    );
    expect(next.getSupplies).toEqual(data);
    expect(next.error).toBeNull();
    expect(next.loading).toBe(false);
  });

  it('un SUCCESS sin response no cambia la data', () => {
    const next = reducer(initialState, { type: actionTypes.SUCCESS_GET_SUPPLIES });
    expect(next.getSupplies).toBeNull();
  });

  it('ERROR_SUPPLY guarda el error desde response.data y corta loading', () => {
    const next = reducer(
      { ...initialState, loading: true },
      { type: actionTypes.ERROR_SUPPLY, response: { data: { message: 'boom' } } },
    );
    expect(next.error).toEqual({ message: 'boom' });
    expect(next.loading).toBe(false);
  });

  it('CLEAR_SUPPLY_WRITES limpia put/delete y error, conservando el listado', () => {
    const dirty = {
      ...initialState,
      getSupplies: [{ idInsumo: 1 }],
      putSupplyById: { ok: 1 },
      postSupplyDelete: { ok: 1 },
      error: 'e',
    };
    const next = reducer(dirty, { type: actionTypes.CLEAR_SUPPLY_WRITES });
    expect(next.putSupplyById).toBeNull();
    expect(next.postSupplyDelete).toBeNull();
    expect(next.error).toBeNull();
    expect(next.getSupplies).toEqual([{ idInsumo: 1 }]);
  });

  it('CLEAR_SUPPLY limpia también el listado principal', () => {
    const dirty = { ...initialState, getSupplies: [{ idInsumo: 1 }], getSupplyById: { idInsumo: 2 } };
    const next = reducer(dirty, { type: actionTypes.CLEAR_SUPPLY });
    expect(next.getSupplies).toBeNull();
    expect(next.getSupplyById).toBeNull();
  });
});
