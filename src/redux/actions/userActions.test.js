import { describe, it, expect } from 'vitest';
import * as actions from './userActions';
import * as actionTypes from '../consts/actionTypes';

describe('userActions', () => {
  it('postLogin lleva el payload', () => {
    const creds = { dni: 1, contrasena: 'x' };
    expect(actions.postLogin(creds)).toEqual({ type: actionTypes.POST_LOGIN, payload: creds });
  });

  it('postUsuario / putUsuarioContrasena llevan el body', () => {
    expect(actions.postUsuario({ a: 1 })).toEqual({ type: actionTypes.POST_USUARIO, payload: { a: 1 } });
    expect(actions.putUsuarioContrasena({ a: 1 })).toEqual({
      type: actionTypes.PUT_USUARIO_CONTRASENA,
      payload: { a: 1 },
    });
  });

  it('getUsuarioById / postUsuarioDelete llevan el id', () => {
    expect(actions.getUsuarioById(3)).toEqual({ type: actionTypes.GET_USUARIO_BY_ID, payload: 3 });
    expect(actions.postUsuarioDelete(3)).toEqual({ type: actionTypes.POST_USUARIO_DELETE, payload: 3 });
  });

  it('putUsuario arma payload { idUsuario, body }', () => {
    expect(actions.putUsuario(7, { nombre: 'A' })).toEqual({
      type: actionTypes.PUT_USUARIO,
      payload: { idUsuario: 7, body: { nombre: 'A' } },
    });
  });

  it('putUsuarioRol arma payload { idUsuario, idRol }', () => {
    expect(actions.putUsuarioRol(7, 3)).toEqual({
      type: actionTypes.PUT_USUARIO_ROL,
      payload: { idUsuario: 7, idRol: 3 },
    });
  });

  it('creadores sin argumento', () => {
    expect(actions.clearLogin()).toEqual({ type: actionTypes.CLEAR_LOGIN });
    expect(actions.clearUserAdmin()).toEqual({ type: actionTypes.CLEAR_USER_ADMIN });
    expect(actions.getUsuarios()).toEqual({ type: actionTypes.GET_USUARIOS });
    expect(actions.getVoluntariasSinUsuario()).toEqual({ type: actionTypes.GET_VOLUNTARIAS_SIN_USUARIO });
  });
});
