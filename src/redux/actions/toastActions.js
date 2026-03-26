import * as actionTypes from "../consts/actionTypes";

/**
 * @param {{ message: string, severity?: 'success' | 'info' | 'warning' | 'error' }} payload
 */
export const showToast = ({ message, severity = "error" }) => ({
  type: actionTypes.SHOW_TOAST,
  payload: { message, severity },
});

export const hideToast = () => ({
  type: actionTypes.HIDE_TOAST,
});
