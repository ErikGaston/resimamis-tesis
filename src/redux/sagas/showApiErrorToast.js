import { put } from "redux-saga/effects";
import { showToast } from "../actions/toastActions";
import { showLoading } from "../actions/loadingActions";
import { resolveApiErrorMessage } from "../../utils/apiErrorMessage";

/** Muestra el toast global con mensaje unificado y detiene el loading (desde sagas). */
export function* showApiErrorToast(error) {
  yield put(showToast({ message: resolveApiErrorMessage(error), severity: "error" }));
  yield put(showLoading(false));
}
