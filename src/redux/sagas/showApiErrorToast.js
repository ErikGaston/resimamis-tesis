import { put } from "redux-saga/effects";
import { showToast } from "../actions/toastActions";
import { resolveApiErrorMessage } from "../../utils/apiErrorMessage";

/** Muestra el toast global con mensaje unificado (desde sagas). */
export function* showApiErrorToast(error) {
  yield put(
    showToast({ message: resolveApiErrorMessage(error), severity: "error" }),
  );
}
