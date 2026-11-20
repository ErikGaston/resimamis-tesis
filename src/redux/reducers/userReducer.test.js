import { describe, it, expect } from 'vitest';
import reducer from './userReducer';
import * as actionTypes from '../consts/actionTypes';

const initialState = {
  postLogin: null,
  loading: false,
  error: null,
  postUsuario: null,
  getUsuarioById: null,
  putUsuario: null,
  putUsuarioRol: null,
  postUsuarioDelete: null,
  getUsuarios: null,
  getVoluntariasSinUsuario: null,
  putUsuarioContrasena: null,
  userAdminError: null,
};

describe('userReducer', () => {
  it('devuelve el estado inicial', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('SHOW_LOADING setea loading', () => {
    expect(reducer(initialState, { type: actionTypes.SHOW_LOADING, payload: true }).loading).toBe(true);
  });

  it('SUCCESS_POST_LOGIN guarda postLogin y limpia error/loading', () => {
    const data = { token: 't' };
    const next = reducer(
      { ...initialState, loading: true, error: 'prev' },
      { type: actionTypes.SUCCESS_POST_LOGIN, response: { data } },
    );
    expect(next.postLogin).toEqual(data);
    expect(next.error).toBeNull();
    expect(next.loading).toBe(false);
  });

  it('ERROR_LOGIN guarda error desde response.data', () => {
    const next = reducer(initialState, { type: actionTypes.ERROR_LOGIN, response: { data: { message: 'bad' } } });
    expect(next.error).toEqual({ message: 'bad' });
  });

  it('SUCCESS_GET_USUARIOS guarda data y limpia userAdminError/loading', () => {
    const data = [{ id: 1 }];
    const next = reducer(
      { ...initialState, loading: true, userAdminError: 'x' },
      { type: actionTypes.SUCCESS_GET_USUARIOS, response: { data } },
    );
    expect(next.getUsuarios).toEqual(data);
    expect(next.userAdminError).toBeNull();
    expect(next.loading).toBe(false);
  });

  it('ERROR_USER guarda el response COMPLETO en userAdminError (no response.data)', () => {
    const response = { status: 409, data: { message: 'dup' } };
    const next = reducer({ ...initialState, loading: true }, { type: actionTypes.ERROR_USER, response });
    expect(next.userAdminError).toBe(response);
    expect(next.loading).toBe(false);
  });

  it('CLEAR_LOGIN limpia postLogin y error, conserva el resto', () => {
    const next = reducer(
      { ...initialState, postLogin: { token: 't' }, error: 'e', getUsuarios: [{ id: 1 }] },
      { type: actionTypes.CLEAR_LOGIN },
    );
    expect(next.postLogin).toBeNull();
    expect(next.error).toBeNull();
    expect(next.getUsuarios).toEqual([{ id: 1 }]);
  });

  it('CLEAR_USER_ADMIN limpia campos de admin y conserva postLogin', () => {
    const dirty = {
      ...initialState,
      postLogin: { token: 't' },
      getUsuarios: [{ id: 1 }],
      postUsuario: { ok: 1 },
      userAdminError: 'e',
    };
    const next = reducer(dirty, { type: actionTypes.CLEAR_USER_ADMIN });
    expect(next.getUsuarios).toBeNull();
    expect(next.postUsuario).toBeNull();
    expect(next.userAdminError).toBeNull();
    expect(next.postLogin).toEqual({ token: 't' });
  });
});
