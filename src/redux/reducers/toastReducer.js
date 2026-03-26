import * as actionTypes from "../consts/actionTypes";

const initialState = {
  open: false,
  message: "",
  severity: "error",
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
      };
    }
    case actionTypes.HIDE_TOAST:
      return { ...state, open: false };
    default:
      return state;
  }
}
