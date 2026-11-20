import { describe, it, expect } from 'vitest';
import * as actions from './proveedorActions';
import * as actionTypes from '../consts/actionTypes';

describe('proveedorActions', () => {
  it('getProveedoresAll sin payload', () => {
    expect(actions.getProveedoresAll()).toEqual({ type: actionTypes.GET_PROVEEDORES_ALL });
  });

  it('postProveedor con el body', () => {
    const body = { nombre: 'Acme' };
    expect(actions.postProveedor(body)).toEqual({ type: actionTypes.POST_PROVEEDOR, payload: body });
  });

  it('putProveedor arma payload { idProveedor, body }', () => {
    const body = { nombre: 'Acme' };
    expect(actions.putProveedor(5, body)).toEqual({
      type: actionTypes.PUT_PROVEEDOR,
      payload: { idProveedor: 5, body },
    });
  });

  it('postProveedorDelete con el id', () => {
    expect(actions.postProveedorDelete(9)).toEqual({ type: actionTypes.POST_PROVEEDOR_DELETE, payload: 9 });
  });

  it('clearProveedorWrites', () => {
    expect(actions.clearProveedorWrites()).toEqual({ type: actionTypes.CLEAR_PROVEEDOR_WRITES });
  });
});
