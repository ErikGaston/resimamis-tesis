import * as actionTypes from '../consts/actionTypes';

const initialState = {
    getTareas: null,
    getTareasDisponibles: null,
    getTareaById: null,
    postTarea: null,
    putTarea: null,
    postTareaDelete: null,
    loading: false,
    error: null,
};

export default function tareaReducer(state = initialState, action) {
    const DEFAULT = { ...state };
    const ACTIONS = {
        [actionTypes.SHOW_LOADING]: showLoading(),
        [actionTypes.SUCCESS_GET_TAREAS]: responseToReturn('getTareas'),
        [actionTypes.SUCCESS_GET_TAREAS_DISPONIBLES]: responseToReturn('getTareasDisponibles'),
        [actionTypes.SUCCESS_GET_TAREA_BY_ID]: responseToReturn('getTareaById'),
        [actionTypes.SUCCESS_POST_TAREA]: responseToReturn('postTarea'),
        [actionTypes.SUCCESS_PUT_TAREA]: responseToReturn('putTarea'),
        [actionTypes.SUCCESS_POST_TAREA_DELETE]: responseToReturn('postTareaDelete'),
        [actionTypes.ERROR_TAREA]: responseToReturn('error'),
        [actionTypes.CLEAR_TAREA_WRITES]: clearTareaWrites(),
    };

    function responseToReturn(typeState) {
        let res = { ...state };
        if (action.response) {
            const patch = { [typeState]: action.response.data, loading: false };
            if (typeState !== 'error') patch.error = null;
            res = { ...state, ...patch };
        }
        return res;
    }

    function showLoading() {
        let res = { ...state };
        if (action.type === 'SHOW_LOADING') res = { ...state, loading: action.payload };
        return res;
    }

    function clearTareaWrites() {
        if (action.type === 'CLEAR_TAREA_WRITES') {
            return {
                ...state,
                postTarea: null,
                putTarea: null,
                postTareaDelete: null,
                error: null,
            };
        }
        return { ...state };
    }

    let receiveAction = DEFAULT;
    if (ACTIONS[action.type] !== undefined) receiveAction = ACTIONS[action.type];
    return receiveAction;
}
