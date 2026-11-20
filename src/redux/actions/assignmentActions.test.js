import { describe, it, expect } from 'vitest';
import * as actions from './assignmentActions';
import * as actionTypes from '../consts/actionTypes';

describe('assignmentActions', () => {
  it('postAssignmentGenerate / postAssignmentGenerateTarea llevan el payload', () => {
    const p = { idVoluntarias: [1], idTareas: [2] };
    expect(actions.postAssignmentGenerate(p)).toEqual({ type: actionTypes.POST_ASSIGNMENT_GENERATE, payload: p });
    expect(actions.postAssignmentGenerateTarea(p)).toEqual({ type: actionTypes.POST_ASSIGNMENT_GENERATE_TAREA, payload: p });
  });

  it('getAssignmentById / getAssignmentTodayById llevan el id', () => {
    expect(actions.getAssignmentById(5)).toEqual({ type: actionTypes.GET_ASSIGNMENT_BY_ID, payload: 5 });
    expect(actions.getAssignmentTodayById(5)).toEqual({ type: actionTypes.GET_ASSIGNMENT_TODAY_BY_ID, payload: 5 });
  });

  it('postDetailAssignment / postStartHug / postEndHug llevan el payload', () => {
    const d = [{ idAsignacion: 1, idInsumo: 2, cantidadInsumo: 3 }];
    expect(actions.postDetailAssignment(d)).toEqual({ type: actionTypes.POST_DETAIL_ASSIGNMENT, payload: d });
    expect(actions.postStartHug(1)).toEqual({ type: actionTypes.POST_START_HUG, payload: 1 });
    expect(actions.postEndHug({ idAsignacion: 1, comentario: null })).toEqual({
      type: actionTypes.POST_END_HUG,
      payload: { idAsignacion: 1, comentario: null },
    });
  });

  it('putAssignmentById arma payload { idAsignacion, body }', () => {
    expect(actions.putAssignmentById(9, { idBebe: 3 })).toEqual({
      type: actionTypes.PUT_ASSIGNMENT_BY_ID,
      payload: { idAsignacion: 9, body: { idBebe: 3 } },
    });
  });

  it('deleteAssignmentById lleva el id', () => {
    expect(actions.deleteAssignmentById(9)).toEqual({ type: actionTypes.DELETE_ASSIGNMENT_BY_ID, payload: 9 });
  });

  it('acciones sin argumento no llevan payload', () => {
    expect(actions.getAssignmentToday()).toEqual({ type: actionTypes.GET_ASSIGNMENT_TODAY });
    expect(actions.getStatisticsAssignmentMonth()).toEqual({ type: actionTypes.GET_STATISTICS_ASSIGNMENT_MONTH });
    expect(actions.postResetAbrazosColgados()).toEqual({ type: actionTypes.POST_RESET_ABRAZOS_COLGADOS });
    expect(actions.clearAssignment()).toEqual({ type: actionTypes.CLEAR_ASSIGNMENT });
    expect(actions.clearAssignmentWrites()).toEqual({ type: actionTypes.CLEAR_ASSIGNMENT_WRITES });
  });
});
