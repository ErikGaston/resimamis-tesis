import * as actionTypes from '../consts/actionTypes';

const initialState = {
  getHorarioDias: null,
  postHorario: null,
  loading: false,
  error: null,
};

export default function horarioReducer(state = initialState, action) {
  const DEFAULT = { ...state };
  const ACTIONS = {
    [actionTypes.SHOW_LOADING]: showLoading(),
    [actionTypes.SUCCESS_GET_HORARIO_DIAS]: responseToReturn('getHorarioDias'),
    [actionTypes.SUCCESS_POST_HORARIO]: responseToReturn('postHorario'),
    [actionTypes.SUCCESS_PUT_HORARIO]: responseToReturn('postHorario'),
    [actionTypes.ERROR_HORARIO]: responseToReturn('error'),
    [actionTypes.CLEAR_HORARIO]: clearHorario(),
  };

  function responseToReturn(typeState) {
    let res = { ...state };
    if (!action.response) return res;
    if (typeState === 'error') {
      return { ...state, error: action.response, loading: false };
    }
    res = { ...state, [typeState]: action.response.data, loading: false, error: null };
    return res;
  }

  function showLoading() {
    if (action.type === 'SHOW_LOADING') {
      return { ...state, loading: action.payload };
    }
    return { ...state };
  }

  function clearHorario() {
    if (action.type === 'CLEAR_HORARIO') {
      return { ...initialState };
    }
    return { ...state };
  }

  if (ACTIONS[action.type] !== undefined) {
    return ACTIONS[action.type];
  }
  return DEFAULT;
}
