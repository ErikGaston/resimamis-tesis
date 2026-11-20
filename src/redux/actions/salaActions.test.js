import { describe, it, expect } from 'vitest';
import * as actions from './salaActions';
import * as actionTypes from '../consts/actionTypes';

describe('salaActions', () => {
  it('getSalasAll sin payload', () => {
    expect(actions.getSalasAll()).toEqual({ type: actionTypes.GET_SALAS_ALL });
  });

  it('postSala con el body', () => {
    const body = { nombre: 'NEO A' };
    expect(actions.postSala(body)).toEqual({ type: actionTypes.POST_SALA, payload: body });
  });

  it('putSala arma payload { idSala, body }', () => {
    const body = { nombre: 'NEO A' };
    expect(actions.putSala(3, body)).toEqual({ type: actionTypes.PUT_SALA, payload: { idSala: 3, body } });
  });

  it('postSalaDelete con el id', () => {
    expect(actions.postSalaDelete(4)).toEqual({ type: actionTypes.POST_SALA_DELETE, payload: 4 });
  });

  it('clearSalaWrites', () => {
    expect(actions.clearSalaWrites()).toEqual({ type: actionTypes.CLEAR_SALA_WRITES });
  });
});
