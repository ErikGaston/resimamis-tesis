import * as actionTypes from '../consts/actionTypes';

export function getProveedoresAll() {
    return { type: actionTypes.GET_PROVEEDORES_ALL };
}

export function postProveedor(body) {
    return { type: actionTypes.POST_PROVEEDOR, payload: body };
}

export function putProveedor(idProveedor, body) {
    return { type: actionTypes.PUT_PROVEEDOR, payload: { idProveedor, body } };
}

export function postProveedorDelete(idProveedor) {
    return { type: actionTypes.POST_PROVEEDOR_DELETE, payload: idProveedor };
}

export function clearProveedorWrites() {
    return { type: actionTypes.CLEAR_PROVEEDOR_WRITES };
}
