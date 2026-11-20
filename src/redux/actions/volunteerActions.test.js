import { describe, it, expect } from 'vitest';
import * as actions from './volunteerActions';
import * as actionTypes from '../consts/actionTypes';

describe('volunteerActions', () => {
  it('creadores con payload', () => {
    expect(actions.postVolunteer({ a: 1 })).toEqual({ type: actionTypes.POST_VOLUNTEER, payload: { a: 1 } });
    expect(actions.putVolunteer({ a: 1 })).toEqual({ type: actionTypes.PUT_VOLUNTEER, payload: { a: 1 } });
    expect(actions.postAssistance({ a: 1 })).toEqual({ type: actionTypes.POST_ASSISTANCE, payload: { a: 1 } });
    expect(actions.postAssistanceSalida(5)).toEqual({ type: actionTypes.POST_ASSISTANCE_SALIDA, payload: 5 });
    expect(actions.getAssistanceHistoricas(5)).toEqual({ type: actionTypes.GET_ASSISTANCE_HISTORICAS, payload: 5 });
    expect(actions.getAssistance({ f: 1 })).toEqual({ type: actionTypes.GET_ASSISTANCE, payload: { f: 1 } });
    expect(actions.getVolunteerById(5)).toEqual({ type: actionTypes.GET_VOLUNTEER_BY_ID, payload: 5 });
    expect(actions.postAssistanceDelete(5)).toEqual({ type: actionTypes.POST_ASSISTANCE_DELETE, payload: 5 });
    expect(actions.postVolunteerDelete(5)).toEqual({ type: actionTypes.POST_VOLUNTEER_DELETE, payload: 5 });
  });

  it('getAssistanceReporte: usa {} cuando no recibe params', () => {
    expect(actions.getAssistanceReporte()).toEqual({ type: actionTypes.GET_ASSISTANCE_REPORTE, payload: {} });
    expect(actions.getAssistanceReporte({ fechaInicio: 'x' })).toEqual({
      type: actionTypes.GET_ASSISTANCE_REPORTE,
      payload: { fechaInicio: 'x' },
    });
  });

  it('creadores sin payload', () => {
    expect(actions.getAssistanceToday()).toEqual({ type: actionTypes.GET_ASSISTANCE_TODAY });
    expect(actions.getVolunteersFree()).toEqual({ type: actionTypes.GET_VOLUNTEERS_FREE });
    expect(actions.getVolunteersStates()).toEqual({ type: actionTypes.GET_VOLUNTEERS_STATES });
    expect(actions.getVolunteers()).toEqual({ type: actionTypes.GET_VOLUNTEERS });
    expect(actions.clearVolunteer()).toEqual({ type: actionTypes.CLEAR_VOLUNTEER });
    expect(actions.clearVolunteerWrites()).toEqual({ type: actionTypes.CLEAR_VOLUNTEER_WRITES });
    expect(actions.getAssistanceAll()).toEqual({ type: actionTypes.GET_ASSISTANCE_ALL });
  });
});
