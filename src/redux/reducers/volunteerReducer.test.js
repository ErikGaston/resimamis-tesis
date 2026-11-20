import { describe, it, expect } from 'vitest';
import reducer from './volunteerReducer';
import * as actionTypes from '../consts/actionTypes';

const initialState = {
  postVolunteer: null,
  putVolunteer: null,
  loading: false,
  error: null,
  postAssistance: null,
  postAssistanceSalida: null,
  getAssistanceToday: null,
  getAssistanceHistoricas: null,
  getAssistanceReporte: null,
  getAssistanceAll: null,
  postAssistanceDelete: null,
  postVolunteerDelete: null,
  getVolunteersFree: null,
  getVolunteers: null,
  getAssistance: null,
  getVolunteerStates: [],
  getVolunteer: null,
};

describe('volunteerReducer', () => {
  it('devuelve el estado inicial', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('SHOW_LOADING setea loading', () => {
    expect(reducer(initialState, { type: actionTypes.SHOW_LOADING, payload: true }).loading).toBe(true);
  });

  it('SUCCESS_GET_VOLUNTEERS guarda data y limpia error/loading', () => {
    const data = [{ id: 1 }];
    const next = reducer(
      { ...initialState, loading: true, error: 'x' },
      { type: actionTypes.SUCCESS_GET_VOLUNTEERS, response: { data } },
    );
    expect(next.getVolunteers).toEqual(data);
    expect(next.error).toBeNull();
    expect(next.loading).toBe(false);
  });

  it('SUCCESS_GET_VOLUNTEER_BY_ID guarda en getVolunteer', () => {
    const data = { id: 9 };
    const next = reducer(initialState, { type: actionTypes.SUCCESS_GET_VOLUNTEER_BY_ID, response: { data } });
    expect(next.getVolunteer).toEqual(data);
  });

  it('SUCCESS_GET_VOLUNTEERS_STATES guarda en getVolunteerStates', () => {
    const data = [{ id: 1, nombre: 'Activa' }];
    const next = reducer(initialState, { type: actionTypes.SUCCESS_GET_VOLUNTEERS_STATES, response: { data } });
    expect(next.getVolunteerStates).toEqual(data);
  });

  it('ERROR_VOLUNTEER guarda el error (response.data) y corta loading', () => {
    const next = reducer(
      { ...initialState, loading: true },
      { type: actionTypes.ERROR_VOLUNTEER, response: { data: { message: 'x' } } },
    );
    expect(next.error).toEqual({ message: 'x' });
    expect(next.loading).toBe(false);
  });

  it('CLEAR_VOLUNTEER_WRITES limpia flags de escritura y conserva getVolunteers', () => {
    const dirty = {
      ...initialState,
      getVolunteers: [{ id: 1 }],
      postAssistance: { ok: 1 },
      postAssistanceSalida: { ok: 1 },
      postAssistanceDelete: { ok: 1 },
      postVolunteerDelete: { ok: 1 },
      error: 'e',
    };
    const next = reducer(dirty, { type: actionTypes.CLEAR_VOLUNTEER_WRITES });
    expect(next.postAssistance).toBeNull();
    expect(next.postAssistanceSalida).toBeNull();
    expect(next.postAssistanceDelete).toBeNull();
    expect(next.postVolunteerDelete).toBeNull();
    expect(next.error).toBeNull();
    expect(next.getVolunteers).toEqual([{ id: 1 }]);
  });

  it('CLEAR_VOLUNTEER resetea al estado inicial', () => {
    const dirty = { ...initialState, getVolunteers: [{ id: 1 }], postVolunteer: { ok: 1 } };
    expect(reducer(dirty, { type: actionTypes.CLEAR_VOLUNTEER })).toEqual(initialState);
  });
});
