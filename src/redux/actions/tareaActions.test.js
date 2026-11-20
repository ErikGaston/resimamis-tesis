import { describe, it, expect } from 'vitest';
import * as actions from './tareaActions';
import * as actionTypes from '../consts/actionTypes';

describe('tareaActions', () => {
  it('getTareas / getTareasDisponibles sin payload', () => {
    expect(actions.getTareas()).toEqual({ type: actionTypes.GET_TAREAS });
    expect(actions.getTareasDisponibles()).toEqual({ type: actionTypes.GET_TAREAS_DISPONIBLES });
  });

  it('getTareaById con el id', () => {
    expect(actions.getTareaById(2)).toEqual({ type: actionTypes.GET_TAREA_BY_ID, payload: 2 });
  });

  it('postTarea con el body', () => {
    const body = { nombre: 'Baño' };
    expect(actions.postTarea(body)).toEqual({ type: actionTypes.POST_TAREA, payload: body });
  });

  it('putTarea arma payload { idTarea, body }', () => {
    const body = { nombre: 'Baño' };
    expect(actions.putTarea(2, body)).toEqual({ type: actionTypes.PUT_TAREA, payload: { idTarea: 2, body } });
  });

  it('postTareaDelete con el id', () => {
    expect(actions.postTareaDelete(2)).toEqual({ type: actionTypes.POST_TAREA_DELETE, payload: 2 });
  });

  it('clearTareaWrites', () => {
    expect(actions.clearTareaWrites()).toEqual({ type: actionTypes.CLEAR_TAREA_WRITES });
  });
});
