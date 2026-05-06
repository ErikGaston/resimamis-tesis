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
        yield* showApiErrorToast(error);
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

export default function* userSaga() {
    yield takeLatest(actionTypes.POST_LOGIN, asyncPostLogin);
    yield takeLatest(actionTypes.POST_USUARIO, asyncPostUsuario);
    yield takeLatest(actionTypes.GET_USUARIO_BY_ID, asyncGetUsuarioById);
    yield takeLatest(actionTypes.PUT_USUARIO, asyncPutUsuario);
    yield takeLatest(actionTypes.POST_USUARIO_DELETE, asyncPostUsuarioDelete);
}