import * as actionTypes from '../consts/actionTypes';

export function getTareas() {
    return { type: actionTypes.GET_TAREAS };
}

export function getTareasDisponibles() {
    return { type: actionTypes.GET_TAREAS_DISPONIBLES };
}

export function getTareaById(idTarea) {
    return { type: actionTypes.GET_TAREA_BY_ID, payload: idTarea };
}

export function postTarea(body) {
    return { type: actionTypes.POST_TAREA, payload: body };
}

export function putTarea(idTarea, body) {
    return { type: actionTypes.PUT_TAREA, payload: { idTarea, body } };
}

export function postTareaDelete(idTarea) {
    return { type: actionTypes.POST_TAREA_DELETE, payload: idTarea };
}

export function clearTareaWrites() {
    return { type: actionTypes.CLEAR_TAREA_WRITES };
}
