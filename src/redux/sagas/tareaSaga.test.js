import { describe, it, expect } from 'vitest';
import { call, put } from 'redux-saga/effects';
import tareaSaga from './tareaSaga';
import * as API from '../api';
import * as actionTypes from '../consts/actionTypes';
import { mapWorkersByType, drainFromThrow } from './sagaTestUtils';

const workers = mapWorkersByType(tareaSaga);

describe('tareaSaga', () => {
  it('registra un takeLatest por acción', () => {
    expect(Object.keys(workers)).toEqual(
      expect.arrayContaining([
        actionTypes.GET_TAREAS,
        actionTypes.GET_TAREAS_DISPONIBLES,
        actionTypes.GET_TAREA_BY_ID,
        actionTypes.POST_TAREA,
        actionTypes.PUT_TAREA,
        actionTypes.POST_TAREA_DELETE,
      ]),
    );
  });

  it('asyncGetTareas: éxito -> SUCCESS', () => {
    const gen = workers[actionTypes.GET_TAREAS]();
    expect(gen.next().value).toEqual(call(API.getTareas));
    const response = { data: [{ idTarea: 1 }] };
    expect(gen.next(response).value).toEqual(put({ type: actionTypes.SUCCESS_GET_TAREAS, response }));
    expect(gen.next().done).toBe(true);
  });

  it('asyncGetTareas: error -> toast + ERROR_TAREA', () => {
    const gen = workers[actionTypes.GET_TAREAS]();
    gen.next();
    const error = new Error('falló');
    const emitted = drainFromThrow(gen, error);
    expect(emitted).toHaveLength(3); // showToast + showLoading(false) + ERROR_TAREA
    expect(emitted.at(-1)).toEqual(put({ type: actionTypes.ERROR_TAREA, response: error }));
  });

  it('asyncPutTarea: desestructura payload y llama putTareaById(idTarea, body)', () => {
    const body = { nombre: 'Baño' };
    const gen = workers[actionTypes.PUT_TAREA]({ payload: { idTarea: 2, body } });
    expect(gen.next().value).toEqual(call(API.putTareaById, 2, body));
    const response = { data: { idTarea: 2 } };
    expect(gen.next(response).value).toEqual(put({ type: actionTypes.SUCCESS_PUT_TAREA, response }));
  });

  it('asyncPostTarea: un 400 con ModelState NO dispara toast (solo ERROR_TAREA)', () => {
    const gen = workers[actionTypes.POST_TAREA]({ payload: { nombre: '' } });
    gen.next(); // call(API.postTarea, payload)
    const error = { status: 400, data: { errors: { Nombre: ['requerido'] } } };
    const emitted = drainFromThrow(gen, error);
    expect(emitted).toHaveLength(1);
    expect(emitted[0]).toEqual(put({ type: actionTypes.ERROR_TAREA, response: error }));
  });

  it('asyncPostTarea: un error genérico SÍ dispara toast + ERROR_TAREA', () => {
    const gen = workers[actionTypes.POST_TAREA]({ payload: { nombre: 'X' } });
    gen.next();
    const error = new Error('500');
    const emitted = drainFromThrow(gen, error);
    expect(emitted).toHaveLength(3);
    expect(emitted.at(-1)).toEqual(put({ type: actionTypes.ERROR_TAREA, response: error }));
  });
});
