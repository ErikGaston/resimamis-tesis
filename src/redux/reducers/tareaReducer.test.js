import { describe, it, expect } from 'vitest';
import reducer from './tareaReducer';
import * as actionTypes from '../consts/actionTypes';

const initialState = {
  getTareas: null,
  getTareasDisponibles: null,
  getTareaById: null,
  postTarea: null,
  putTarea: null,
  postTareaDelete: null,
  loading: false,
  error: null,
};

describe('tareaReducer', () => {
  it('estado inicial ante acción desconocida', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('SHOW_LOADING setea loading', () => {
    expect(reducer(initialState, { type: actionTypes.SHOW_LOADING, payload: true }).loading).toBe(true);
  });

  it('SUCCESS_GET_TAREAS guarda data y limpia error/loading', () => {
    const data = [{ idTarea: 1 }];
    const next = reducer(
      { ...initialState, loading: true, error: 'x' },
      { type: actionTypes.SUCCESS_GET_TAREAS, response: { data } },
    );
    expect(next.getTareas).toEqual(data);
    expect(next.error).toBeNull();
    expect(next.loading).toBe(false);
  });

  it('SUCCESS sin response no cambia la data', () => {
    const next = reducer(initialState, { type: actionTypes.SUCCESS_POST_TAREA });
    expect(next.postTarea).toBeNull();
  });

  it('ERROR_TAREA guarda el error desde response.data y corta loading', () => {
    const next = reducer(
      { ...initialState, loading: true },
      { type: actionTypes.ERROR_TAREA, response: { data: { message: 'boom' } } },
    );
    expect(next.error).toEqual({ message: 'boom' });
    expect(next.loading).toBe(false);
  });

  it('CLEAR_TAREA_WRITES limpia escrituras y conserva listados', () => {
    const dirty = {
      ...initialState,
      getTareas: [{ idTarea: 1 }],
      getTareasDisponibles: [{ idTarea: 2 }],
      postTarea: { ok: 1 },
      putTarea: { ok: 1 },
      postTareaDelete: { ok: 1 },
      error: 'e',
    };
    const next = reducer(dirty, { type: actionTypes.CLEAR_TAREA_WRITES });
    expect(next.postTarea).toBeNull();
    expect(next.putTarea).toBeNull();
    expect(next.postTareaDelete).toBeNull();
    expect(next.error).toBeNull();
    expect(next.getTareas).toEqual([{ idTarea: 1 }]);
    expect(next.getTareasDisponibles).toEqual([{ idTarea: 2 }]);
  });
});
