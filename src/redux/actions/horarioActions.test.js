import { describe, it, expect } from 'vitest';
import * as actions from './horarioActions';
import * as actionTypes from '../consts/actionTypes';

describe('horarioActions', () => {
  it('acciones sin payload', () => {
    expect(actions.getHorarioDias()).toEqual({ type: actionTypes.GET_HORARIO_DIAS });
    expect(actions.clearHorario()).toEqual({ type: actionTypes.CLEAR_HORARIO });
    expect(actions.clearHorarioWrites()).toEqual({ type: actionTypes.CLEAR_HORARIO_WRITES });
  });

  it('postHorario lleva el payload (array de días/turnos)', () => {
    const payload = [{ idDia: 1, turno: 'Mañana' }];
    expect(actions.postHorario(payload)).toEqual({ type: actionTypes.POST_HORARIO, payload });
  });

  it('putHorario arma payload { idVoluntaria, body }', () => {
    const body = [{ idDia: 1, idVoluntaria: 5, turno: 'Tarde' }];
    expect(actions.putHorario(5, body)).toEqual({
      type: actionTypes.PUT_HORARIO,
      payload: { idVoluntaria: 5, body },
    });
  });
});
