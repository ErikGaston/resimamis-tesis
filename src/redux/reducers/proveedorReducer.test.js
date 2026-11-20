import { describe, it, expect } from 'vitest';
import reducer from './proveedorReducer';
import * as actionTypes from '../consts/actionTypes';

const initialState = {
  getProveedoresAll: null,
  postProveedor: null,
  putProveedor: null,
  postProveedorDelete: null,
  loading: false,
  error: null,
};

describe('proveedorReducer', () => {
  it('estado inicial ante acción desconocida', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('SHOW_LOADING setea loading', () => {
    expect(reducer(initialState, { type: actionTypes.SHOW_LOADING, payload: true }).loading).toBe(true);
  });

  it('SUCCESS_GET_PROVEEDORES_ALL guarda data y limpia error/loading', () => {
    const data = [{ idProveedor: 1 }];
    const next = reducer(
      { ...initialState, loading: true, error: 'x' },
      { type: actionTypes.SUCCESS_GET_PROVEEDORES_ALL, response: { data } },
    );
    expect(next.getProveedoresAll).toEqual(data);
    expect(next.error).toBeNull();
    expect(next.loading).toBe(false);
  });

  it('SUCCESS sin response no cambia la data', () => {
    const next = reducer(initialState, { type: actionTypes.SUCCESS_POST_PROVEEDOR });
    expect(next.postProveedor).toBeNull();
  });

  it('ERROR_PROVEEDOR guarda el error desde response.data y corta loading', () => {
    const next = reducer(
      { ...initialState, loading: true },
      { type: actionTypes.ERROR_PROVEEDOR, response: { data: { message: 'boom' } } },
    );
    expect(next.error).toEqual({ message: 'boom' });
    expect(next.loading).toBe(false);
  });

  it('CLEAR_PROVEEDOR_WRITES limpia escrituras y conserva el listado', () => {
    const dirty = {
      ...initialState,
      getProveedoresAll: [{ idProveedor: 1 }],
      postProveedor: { ok: 1 },
      putProveedor: { ok: 1 },
      postProveedorDelete: { ok: 1 },
      error: 'e',
    };
    const next = reducer(dirty, { type: actionTypes.CLEAR_PROVEEDOR_WRITES });
    expect(next.postProveedor).toBeNull();
    expect(next.putProveedor).toBeNull();
    expect(next.postProveedorDelete).toBeNull();
    expect(next.error).toBeNull();
    expect(next.getProveedoresAll).toEqual([{ idProveedor: 1 }]);
  });
});
