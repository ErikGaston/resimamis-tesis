import { describe, it, expect } from 'vitest';
import * as actions from './babyActions';
import * as actionTypes from '../consts/actionTypes';

describe('babyActions', () => {
  it('getBabys despacha GET_BABYS sin payload', () => {
    expect(actions.getBabys()).toEqual({ type: actionTypes.GET_BABYS });
  });

  it('postBaby despacha POST_BABY con el payload', () => {
    const body = { nombre: 'Ana' };
    expect(actions.postBaby(body)).toEqual({ type: actionTypes.POST_BABY, payload: body });
  });

  it('putBaby despacha PUT_BABY con el payload', () => {
    const body = { id: 1, nombre: 'Ana' };
    expect(actions.putBaby(body)).toEqual({ type: actionTypes.PUT_BABY, payload: body });
  });

  it('getBabyByDni despacha GET_BABY_BY_DNI con el dni', () => {
    expect(actions.getBabyByDni('44110005')).toEqual({
      type: actionTypes.GET_BABY_BY_DNI,
      payload: '44110005',
    });
  });

  it('postBabyDelete despacha POST_BABY_DELETE con el id', () => {
    expect(actions.postBabyDelete(7)).toEqual({ type: actionTypes.POST_BABY_DELETE, payload: 7 });
  });

  it('getBabyWeightEvolution despacha con params', () => {
    const params = { fechaDesde: '2026-01-01' };
    expect(actions.getBabyWeightEvolution(params)).toEqual({
      type: actionTypes.GET_BABY_WEIGHT_EVOLUTION,
      payload: params,
    });
  });

  it('acciones sin argumento no llevan payload', () => {
    expect(actions.getBabysFree()).toEqual({ type: actionTypes.GET_BABYS_FREE });
    expect(actions.getBabySalas()).toEqual({ type: actionTypes.GET_BABY_SALAS });
    expect(actions.getBabyPermanencia()).toEqual({ type: actionTypes.GET_BABY_PERMANENCIA });
    expect(actions.clearBaby()).toEqual({ type: actionTypes.CLEAR_BABY });
    expect(actions.clearBabyWrites()).toEqual({ type: actionTypes.CLEAR_BABY_WRITES });
  });
});
