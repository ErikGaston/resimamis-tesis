import { describe, it, expect } from 'vitest';
import reducer from './assignmentReducer';
import * as actionTypes from '../consts/actionTypes';

const initialState = {
  postAssignmentGenerate: null,
  postAssignmentGenerateTarea: null,
  postDetailAssignment: null,
  loading: false,
  error: null,
  postStartHug: null,
  postEndHug: null,
  getAssignmentToday: null,
  getAssignmentTodayById: null,
  getAssignmentById: null,
  getStatisticsAssignmentMonth: null,
  putAssignmentById: null,
  deleteAssignmentById: null,
  postResetAbrazosColgados: null,
};

describe('assignmentReducer', () => {
  it('estado inicial ante acción desconocida', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('SHOW_LOADING setea loading con el payload', () => {
    expect(reducer(initialState, { type: actionTypes.SHOW_LOADING, payload: true }).loading).toBe(true);
  });

  it('SUCCESS_GET_ASSIGNMENT_TODAY guarda data y limpia error/loading', () => {
    const data = [{ idAsignacion: 1 }];
    const next = reducer(
      { ...initialState, loading: true, error: 'x' },
      { type: actionTypes.SUCCESS_GET_ASSIGNMENT_TODAY, response: { data } },
    );
    expect(next.getAssignmentToday).toEqual(data);
    expect(next.error).toBeNull();
    expect(next.loading).toBe(false);
  });

  it('un SUCCESS sin response no cambia la data', () => {
    const next = reducer(initialState, { type: actionTypes.SUCCESS_POST_START_HUG });
    expect(next.postStartHug).toBeNull();
  });

  it('ERROR_ASSIGNMENT guarda el error desde response.data y conserva (no null) el error', () => {
    const next = reducer(
      { ...initialState, loading: true },
      { type: actionTypes.ERROR_ASSIGNMENT, response: { data: { message: 'boom' } } },
    );
    expect(next.error).toEqual({ message: 'boom' });
    expect(next.loading).toBe(false);
  });

  it('CLEAR_ASSIGNMENT_WRITES limpia solo escrituras y conserva el listado del día y el detalle por id', () => {
    const dirty = {
      ...initialState,
      getAssignmentToday: [{ idAsignacion: 1 }],
      getAssignmentById: { idAsignacion: 2 },
      putAssignmentById: { ok: 1 },
      deleteAssignmentById: { ok: 1 },
      postResetAbrazosColgados: { cerrados: 3 },
      error: 'e',
    };
    const next = reducer(dirty, { type: actionTypes.CLEAR_ASSIGNMENT_WRITES });
    expect(next.putAssignmentById).toBeNull();
    expect(next.deleteAssignmentById).toBeNull();
    expect(next.postResetAbrazosColgados).toBeNull();
    expect(next.error).toBeNull();
    expect(next.getAssignmentToday).toEqual([{ idAsignacion: 1 }]);
    expect(next.getAssignmentById).toEqual({ idAsignacion: 2 });
  });

  it('CLEAR_ASSIGNMENT limpia también el listado del día y el detalle', () => {
    const dirty = { ...initialState, getAssignmentToday: [{ idAsignacion: 1 }], getAssignmentById: { idAsignacion: 2 } };
    const next = reducer(dirty, { type: actionTypes.CLEAR_ASSIGNMENT });
    expect(next.getAssignmentToday).toBeNull();
    expect(next.getAssignmentById).toBeNull();
  });
});
