import { describe, it, expect } from 'vitest';
import { call, put } from 'redux-saga/effects';
import assignmentSaga from './assignmentSaga';
import * as API from '../api';
import * as actionTypes from '../consts/actionTypes';
import { mapWorkersByType, drainFromThrow } from './sagaTestUtils';

const workers = mapWorkersByType(assignmentSaga);

describe('assignmentSaga', () => {
  it('registra un takeLatest por cada acción del dominio', () => {
    expect(Object.keys(workers)).toEqual(
      expect.arrayContaining([
        actionTypes.POST_ASSIGNMENT_GENERATE,
        actionTypes.POST_ASSIGNMENT_GENERATE_TAREA,
        actionTypes.GET_ASSIGNMENT_BY_ID,
        actionTypes.POST_DETAIL_ASSIGNMENT,
        actionTypes.POST_START_HUG,
        actionTypes.POST_END_HUG,
        actionTypes.GET_ASSIGNMENT_TODAY,
        actionTypes.PUT_ASSIGNMENT_BY_ID,
        actionTypes.DELETE_ASSIGNMENT_BY_ID,
        actionTypes.POST_RESET_ABRAZOS_COLGADOS,
      ]),
    );
  });

  it('POST_ASSIGNMENT_GENERATE llama a postAssignmentGenerateTareas (no al legacy)', () => {
    const payload = { idVoluntarias: [1], idTareas: [2] };
    const gen = workers[actionTypes.POST_ASSIGNMENT_GENERATE]({ payload });
    expect(gen.next().value).toEqual(call(API.postAssignmentGenerateTareas, payload));
    const response = { data: { ok: true } };
    expect(gen.next(response).value).toEqual(put({ type: actionTypes.SUCCESS_POST_ASSIGNMENT_GENERATE, response }));
  });

  it('asyncPostEndHug pasa el payload { idAsignacion, comentario } a la API', () => {
    const payload = { idAsignacion: 1, comentario: null };
    const gen = workers[actionTypes.POST_END_HUG]({ payload });
    expect(gen.next().value).toEqual(call(API.postEndHug, payload));
    const response = { data: {} };
    expect(gen.next(response).value).toEqual(put({ type: actionTypes.SUCCESS_POST_END_HUG, response }));
  });

  it('asyncPutAssignmentById desarma { idAsignacion, body } en dos argumentos', () => {
    const payload = { idAsignacion: 9, body: { idBebe: 3 } };
    const gen = workers[actionTypes.PUT_ASSIGNMENT_BY_ID]({ payload });
    expect(gen.next().value).toEqual(call(API.putAssignmentById, 9, { idBebe: 3 }));
    const response = { data: {} };
    expect(gen.next(response).value).toEqual(put({ type: actionTypes.SUCCESS_PUT_ASSIGNMENT_BY_ID, response }));
  });

  it('asyncPostResetAbrazosColgados: éxito -> SUCCESS', () => {
    const gen = workers[actionTypes.POST_RESET_ABRAZOS_COLGADOS]();
    expect(gen.next().value).toEqual(call(API.postResetAbrazosColgados));
    const response = { data: 2 };
    expect(gen.next(response).value).toEqual(put({ type: actionTypes.SUCCESS_POST_RESET_ABRAZOS_COLGADOS, response }));
  });

  it('error en GET_ASSIGNMENT_BY_ID -> ERROR_ASSIGNMENT con message = error.message', () => {
    const gen = workers[actionTypes.GET_ASSIGNMENT_BY_ID]({ payload: 1 });
    gen.next();
    const error = new Error('falló');
    const emitted = drainFromThrow(gen, error);
    expect(emitted.at(-1)).toEqual(put({ type: actionTypes.ERROR_ASSIGNMENT, response: error, message: error.message }));
  });

  it('error en PUT_ASSIGNMENT_BY_ID -> ERROR_ASSIGNMENT sin campo message', () => {
    const gen = workers[actionTypes.PUT_ASSIGNMENT_BY_ID]({ payload: { idAsignacion: 1, body: {} } });
    gen.next();
    const error = new Error('falló');
    const emitted = drainFromThrow(gen, error);
    expect(emitted.at(-1)).toEqual(put({ type: actionTypes.ERROR_ASSIGNMENT, response: error }));
  });

  // NOTA (posible bug/typo): asyncPostAssignmentGenerate usa `message: error.mensaje`
  // (propiedad inexistente en un Error) en vez de error.message. El message queda undefined.
  it('error en POST_ASSIGNMENT_GENERATE pone message=undefined por el typo error.mensaje', () => {
    const gen = workers[actionTypes.POST_ASSIGNMENT_GENERATE]({ payload: {} });
    gen.next();
    const error = new Error('falló');
    const emitted = drainFromThrow(gen, error);
    expect(emitted.at(-1)).toEqual(put({ type: actionTypes.ERROR_ASSIGNMENT, response: error, message: undefined }));
  });
});
