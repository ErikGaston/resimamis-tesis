import { describe, it, expect } from 'vitest';
import * as actions from './supplyActions';
import * as actionTypes from '../consts/actionTypes';

describe('supplyActions', () => {
  it('acciones sin payload', () => {
    expect(actions.getSupplies()).toEqual({ type: actionTypes.GET_SUPPLIES });
    expect(actions.getStatisticsSupplies()).toEqual({ type: actionTypes.GET_STATISTICS_SUPPLIES });
    expect(actions.getSupplyProviders()).toEqual({ type: actionTypes.GET_SUPPLY_PROVIDERS });
    expect(actions.getSupplyBajoMinimo()).toEqual({ type: actionTypes.GET_SUPPLY_BAJO_MINIMO });
    expect(actions.clearSupply()).toEqual({ type: actionTypes.CLEAR_SUPPLY });
    expect(actions.clearSupplyWrites()).toEqual({ type: actionTypes.CLEAR_SUPPLY_WRITES });
  });

  it('postSupplyConsultMovements usa {} cuando no se pasa payload', () => {
    expect(actions.postSupplyConsultMovements()).toEqual({
      type: actionTypes.POST_SUPPLY_CONSULT_MOVEMENTS,
      payload: {},
    });
    const p = { fechaDesde: '2026-01-01' };
    expect(actions.postSupplyConsultMovements(p)).toEqual({
      type: actionTypes.POST_SUPPLY_CONSULT_MOVEMENTS,
      payload: p,
    });
  });

  it('postSupplyRegisterMovement / postSupplyCreate llevan el payload', () => {
    const mov = { idInsumo: 1, cantidad: 5, esEntrada: 'S' };
    expect(actions.postSupplyRegisterMovement(mov)).toEqual({ type: actionTypes.POST_SUPPLY_REGISTER_MOVEMENT, payload: mov });
    const nuevo = { nombre: 'Gasa', stockMinimo: 1, stockMaximo: 9, stockActual: 3 };
    expect(actions.postSupplyCreate(nuevo)).toEqual({ type: actionTypes.POST_SUPPLY_CREATE, payload: nuevo });
  });

  it('getSupplyById / postSupplyDelete llevan el id', () => {
    expect(actions.getSupplyById(7)).toEqual({ type: actionTypes.GET_SUPPLY_BY_ID, payload: 7 });
    expect(actions.postSupplyDelete(7)).toEqual({ type: actionTypes.POST_SUPPLY_DELETE, payload: 7 });
  });

  it('putSupplyById arma payload { idInsumo, body }', () => {
    expect(actions.putSupplyById(7, { nombre: 'X' })).toEqual({
      type: actionTypes.PUT_SUPPLY_BY_ID,
      payload: { idInsumo: 7, body: { nombre: 'X' } },
    });
  });
});
