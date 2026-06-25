import { call, put, takeLatest } from 'redux-saga/effects';
import * as actionTypes from '../consts/actionTypes';
import * as API from '../api';
import { showApiErrorToast } from './showApiErrorToast';

function* asyncGetProveedoresAll() {
    try {
        const response = yield call(API.getProveedoresAll);
        if (response) yield put({ type: actionTypes.SUCCESS_GET_PROVEEDORES_ALL, response });
    } catch (error) {
        yield* showApiErrorToast(error);
        yield put({ type: actionTypes.ERROR_PROVEEDOR, response: error });
    }
}

function* asyncPostProveedor({ payload }) {
    try {
        const response = yield call(API.postProveedor, payload);
        if (response) yield put({ type: actionTypes.SUCCESS_POST_PROVEEDOR, response });
    } catch (error) {
        yield* showApiErrorToast(error);
        yield put({ type: actionTypes.ERROR_PROVEEDOR, response: error });
    }
}

function* asyncPutProveedor({ payload }) {
    try {
        const response = yield call(API.putProveedor, payload.idProveedor, payload.body);
        if (response) yield put({ type: actionTypes.SUCCESS_PUT_PROVEEDOR, response });
    } catch (error) {
        yield* showApiErrorToast(error);
        yield put({ type: actionTypes.ERROR_PROVEEDOR, response: error });
    }
}

function* asyncPostProveedorDelete({ payload }) {
    try {
        const response = yield call(API.postProveedorDelete, payload);
        if (response) yield put({ type: actionTypes.SUCCESS_POST_PROVEEDOR_DELETE, response });
    } catch (error) {
        yield* showApiErrorToast(error);
        yield put({ type: actionTypes.ERROR_PROVEEDOR, response: error });
    }
}

export default function* proveedorSaga() {
    yield takeLatest(actionTypes.GET_PROVEEDORES_ALL, asyncGetProveedoresAll);
    yield takeLatest(actionTypes.POST_PROVEEDOR, asyncPostProveedor);
    yield takeLatest(actionTypes.PUT_PROVEEDOR, asyncPutProveedor);
    yield takeLatest(actionTypes.POST_PROVEEDOR_DELETE, asyncPostProveedorDelete);
}
