import { call, put, takeLatest } from 'redux-saga/effects';
import * as actionTypes from '../consts/actionTypes';
import * as API from '../api';
import { showApiErrorToast } from './showApiErrorToast';

function* asyncGetHorarioDias() {
  try {
    const response = yield call(API.getHorarioDias);
    if (response) {
      yield put({ type: actionTypes.SUCCESS_GET_HORARIO_DIAS, response });
    }
  } catch (error) {
    yield* showApiErrorToast(error);
    yield put({ type: actionTypes.ERROR_HORARIO, response: error });
  }
}

function* asyncPostHorario({ payload }) {
  try {
    const response = yield call(API.postHorario, payload);
    if (response) {
      yield put({ type: actionTypes.SUCCESS_POST_HORARIO, response });
    }
  } catch (error) {
    yield* showApiErrorToast(error);
    yield put({ type: actionTypes.ERROR_HORARIO, response: error });
  }
}

export default function* horarioSaga() {
  yield takeLatest(actionTypes.GET_HORARIO_DIAS, asyncGetHorarioDias);
  yield takeLatest(actionTypes.POST_HORARIO, asyncPostHorario);
}
