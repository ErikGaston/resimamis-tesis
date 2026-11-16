import * as actionTypes from "../consts/actionTypes";

const initialState = {
  open: false,
  message: "",
  severity: "error",
  // Sube con cada aviso: el Snackbar se vuelve a montar y reinicia su temporizador. Sin esto,
  // un aviso que llegaba con otro todavía abierto se cerraba con el tiempo del anterior.
  seq: 0,
};

export default function toastReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SHOW_TOAST: {
      const { message, severity } = action.payload || {};
      return {
        ...state,
        open: true,
        message: message || state.message,
        severity: severity || "error",
        seq: (state.seq ?? 0) + 1,
      };
    }
    case actionTypes.HIDE_TOAST:
      return { ...state, open: false };
    default:
      return state;
  }
}
