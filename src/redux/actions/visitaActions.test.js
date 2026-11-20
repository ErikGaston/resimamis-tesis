import { describe, it, expect } from 'vitest';
import * as actions from './visitaActions';
import * as actionTypes from '../consts/actionTypes';

describe('visitaActions', () => {
  it('getVisitas sin payload', () => {
    expect(actions.getVisitas()).toEqual({ type: actionTypes.GET_VISITAS });
    expect(actions.clearVisitaWrites()).toEqual({ type: actionTypes.CLEAR_VISITA_WRITES });
  });

  it('getVisitasByBebe / getVisitaById / postVisitaDelete llevan el id', () => {
    expect(actions.getVisitasByBebe(60)).toEqual({ type: actionTypes.GET_VISITAS_BY_BEBE, payload: 60 });
    expect(actions.getVisitaById(3)).toEqual({ type: actionTypes.GET_VISITA_BY_ID, payload: 3 });
    expect(actions.postVisitaDelete(3)).toEqual({ type: actionTypes.POST_VISITA_DELETE, payload: 3 });
  });

  it('postVisita lleva el body', () => {
    const body = { idBebe: 60, nombreVisitante: 'Ana' };
    expect(actions.postVisita(body)).toEqual({ type: actionTypes.POST_VISITA, payload: body });
  });

  it('putVisita arma payload { idVisita, body }', () => {
    expect(actions.putVisita(3, { nombreVisitante: 'Ana' })).toEqual({
      type: actionTypes.PUT_VISITA,
      payload: { idVisita: 3, body: { nombreVisitante: 'Ana' } },
    });
  });
});
