import { describe, it, expect } from 'vitest';
import { call, put } from 'redux-saga/effects';
import userSaga from './userSaga';
import * as API from '../api';
import * as actionTypes from '../consts/actionTypes';
import { mapWorkersByType, drainFromThrow } from './sagaTestUtils';

const workers = mapWorkersByType(userSaga);

describe('userSaga', () => {
  it('registra un takeLatest por cada acción del dominio', () => {
    expect(Object.keys(workers)).toEqual(
      expect.arrayContaining([
        actionTypes.POST_LOGIN,
        actionTypes.POST_USUARIO,
        actionTypes.GET_USUARIO_BY_ID,
        actionTypes.PUT_USUARIO,
        actionTypes.PUT_USUARIO_ROL,
        actionTypes.POST_USUARIO_DELETE,
        actionTypes.GET_USUARIOS,
        actionTypes.GET_VOLUNTARIAS_SIN_USUARIO,
        actionTypes.PUT_USUARIO_CONTRASENA,
      ]),
    );
  });

  it('asyncPostLogin: éxito -> SUCCESS_POST_LOGIN', () => {
    const payload = { dni: 1, contrasena: 'x' };
    const gen = workers[actionTypes.POST_LOGIN]({ payload });
    expect(gen.next().value).toEqual(call(API.postLogin, payload));
    const response = { data: { token: 't' } };
    expect(gen.next(response).value).toEqual(put({ type: actionTypes.SUCCESS_POST_LOGIN, response }));
  });

  it('asyncPostLogin: error NO dispara toast y despacha solo ERROR_LOGIN', () => {
    const gen = workers[actionTypes.POST_LOGIN]({ payload: {} });
    gen.next();
    const emitted = drainFromThrow(gen, new Error('401'));
    // la única emisión es el put de ERROR_LOGIN (no hay put de showToast ni showLoading)
    expect(emitted).toHaveLength(1);
    const action = emitted[0].payload.action;
    expect(action.type).toBe(actionTypes.ERROR_LOGIN);
    expect(typeof action.response.data.message).toBe('string');
  });

  it('asyncPutUsuario: llama putUsuarioById con idUsuario y body', () => {
    const gen = workers[actionTypes.PUT_USUARIO]({ payload: { idUsuario: 7, body: { nombre: 'A' } } });
    expect(gen.next().value).toEqual(call(API.putUsuarioById, 7, { nombre: 'A' }));
  });

  it('asyncPutUsuarioRol: llama putUsuarioRol con idUsuario e idRol', () => {
    const gen = workers[actionTypes.PUT_USUARIO_ROL]({ payload: { idUsuario: 7, idRol: 3 } });
    expect(gen.next().value).toEqual(call(API.putUsuarioRol, 7, 3));
  });

  it('asyncGetUsuarios: error -> ERROR_USER sin message', () => {
    const gen = workers[actionTypes.GET_USUARIOS]();
    expect(gen.next().value).toEqual(call(API.getUsuarios));
    const error = new Error('x');
    const emitted = drainFromThrow(gen, error);
    expect(emitted.at(-1)).toEqual(put({ type: actionTypes.ERROR_USER, response: error }));
  });
});
