import { describe, it, expect } from 'vitest';
import { call, put } from 'redux-saga/effects';
import proveedorSaga from './proveedorSaga';
import * as API from '../api';
import * as actionTypes from '../consts/actionTypes';
import { mapWorkersByType, drainFromThrow } from './sagaTestUtils';

const workers = mapWorkersByType(proveedorSaga);

describe('proveedorSaga', () => {
  it('registra un takeLatest por acción', () => {
    expect(Object.keys(workers)).toEqual(
      expect.arrayContaining([
        actionTypes.GET_PROVEEDORES_ALL,
        actionTypes.POST_PROVEEDOR,
        actionTypes.PUT_PROVEEDOR,
        actionTypes.POST_PROVEEDOR_DELETE,
      ]),
    );
  });

  it('asyncGetProveedoresAll: éxito -> SUCCESS', () => {
    const gen = workers[actionTypes.GET_PROVEEDORES_ALL]();
    expect(gen.next().value).toEqual(call(API.getProveedoresAll));
    const response = { data: [{ idProveedor: 1 }] };
    expect(gen.next(response).value).toEqual(put({ type: actionTypes.SUCCESS_GET_PROVEEDORES_ALL, response }));
    expect(gen.next().done).toBe(true);
  });

  it('asyncGetProveedoresAll: error -> ERROR_PROVEEDOR', () => {
    const gen = workers[actionTypes.GET_PROVEEDORES_ALL]();
    gen.next();
    const error = new Error('falló');
    const emitted = drainFromThrow(gen, error);
    expect(emitted.at(-1)).toEqual(put({ type: actionTypes.ERROR_PROVEEDOR, response: error }));
  });

  it('asyncPutProveedor: pasa idProveedor y body por separado a la API', () => {
    const body = { nombre: 'Acme' };
    const gen = workers[actionTypes.PUT_PROVEEDOR]({ payload: { idProveedor: 5, body } });
    expect(gen.next().value).toEqual(call(API.putProveedor, 5, body));
    const response = { data: { idProveedor: 5 } };
    expect(gen.next(response).value).toEqual(put({ type: actionTypes.SUCCESS_PUT_PROVEEDOR, response }));
  });

  it('asyncPostProveedorDelete: pasa el id a la API', () => {
    const gen = workers[actionTypes.POST_PROVEEDOR_DELETE]({ payload: 7 });
    expect(gen.next().value).toEqual(call(API.postProveedorDelete, 7));
  });
});
