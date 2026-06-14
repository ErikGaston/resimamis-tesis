import { call, put, takeLatest } from "redux-saga/effects";
import * as actionTypes from "../consts/actionTypes";
import * as API from "../api";
import { resolveApiErrorMessage } from "../../utils/apiErrorMessage";
import { showApiErrorToast } from "./showApiErrorToast";

function* asyncPostLogin({ payload }) {
    try {
        let response = yield call(API.postLogin, payload);
        if (response)
            yield put({
                type: actionTypes.SUCCESS_POST_LOGIN,
                response,
            });
    } catch (error) {
        const message = resolveApiErrorMessage(error);
        yield put({
            type: actionTypes.ERROR_LOGIN,
            response: { data: { message } },
        });
    }
}

function* asyncPostUsuario({ payload }) {
    try {
        const response = yield call(API.postUsuario, payload);
        if (response) yield put({ type: actionTypes.SUCCESS_POST_USUARIO, response });
    } catch (error) {
        yield* showApiErrorToast(error);
        yield put({ type: actionTypes.ERROR_USER, response: error });
    }
}

function* asyncGetUsuarioById({ payload }) {
    try {
        const response = yield call(API.getUsuarioById, payload);
        if (response) yield put({ type: actionTypes.SUCCESS_GET_USUARIO_BY_ID, response });
    } catch (error) {
        yield* showApiErrorToast(error);
        yield put({ type: actionTypes.ERROR_USER, response: error });
    }
}

function* asyncPutUsuario({ payload }) {
    try {
        const { idUsuario, body } = payload || {};
        const response = yield call(API.putUsuarioById, idUsuario, body);
        if (response) yield put({ type: actionTypes.SUCCESS_PUT_USUARIO, response });
    } catch (error) {
        yield* showApiErrorToast(error);
        yield put({ type: actionTypes.ERROR_USER, response: error });
    }
}

function* asyncPostUsuarioDelete({ payload }) {
    try {
        const response = yield call(API.postUsuarioDelete, payload);
        if (response) yield put({ type: actionTypes.SUCCESS_POST_USUARIO_DELETE, response });
    } catch (error) {
        yield* showApiErrorToast(error);
        yield put({ type: actionTypes.ERROR_USER, response: error });
    }
}

function* asyncGetUsuarios() {
    try {
        const response = yield call(API.getUsuarios);
        if (response) yield put({ type: actionTypes.SUCCESS_GET_USUARIOS, response });
    } catch (error) {
        yield* showApiErrorToast(error);
        yield put({ type: actionTypes.ERROR_USER, response: error });
    }
}

function* asyncGetVoluntariasSinUsuario() {
    try {
        const response = yield call(API.getVoluntariasSinUsuario);
        if (response) yield put({ type: actionTypes.SUCCESS_GET_VOLUNTARIAS_SIN_USUARIO, response });
    } catch (error) {
        yield* showApiErrorToast(error);
        yield put({ type: actionTypes.ERROR_USER, response: error });
    }
}

function* asyncPutUsuarioContrasena({ payload }) {
    try {
        const response = yield call(API.putUsuarioContrasena, payload);
        if (response) yield put({ type: actionTypes.SUCCESS_PUT_USUARIO_CONTRASENA, response });
    } catch (error) {
        yield* showApiErrorToast(error);
        yield put({ type: actionTypes.ERROR_USER, response: error });
    }
}

export default function* userSaga() {
    yield takeLatest(actionTypes.POST_LOGIN, asyncPostLogin);
    yield takeLatest(actionTypes.POST_USUARIO, asyncPostUsuario);
    yield takeLatest(actionTypes.GET_USUARIO_BY_ID, asyncGetUsuarioById);
    yield takeLatest(actionTypes.PUT_USUARIO, asyncPutUsuario);
    yield takeLatest(actionTypes.POST_USUARIO_DELETE, asyncPostUsuarioDelete);
    yield takeLatest(actionTypes.GET_USUARIOS, asyncGetUsuarios);
    yield takeLatest(actionTypes.GET_VOLUNTARIAS_SIN_USUARIO, asyncGetVoluntariasSinUsuario);
    yield takeLatest(actionTypes.PUT_USUARIO_CONTRASENA, asyncPutUsuarioContrasena);
}