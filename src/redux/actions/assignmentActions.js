import * as actionTypes from '../consts/actionTypes';

/**
 * Genera asignaciones en lote. La saga llama a **`postAssignmentGenerateTareas`** (OpenAPI `generarTareas`), no al POST legacy `generar`.
 * @param {{ idVoluntarias: number[], idTareas: number[]|null }} payload
 */
export function postAssignmentGenerate(payload) {
    return {
        type: actionTypes.POST_ASSIGNMENT_GENERATE,
        payload,
    };
}

/** OpenAPI `generarTarea`: una voluntaria y una tarea. */
export function postAssignmentGenerateTarea(payload) {
    return {
        type: actionTypes.POST_ASSIGNMENT_GENERATE_TAREA,
        payload,
    };
}

export function getAssignmentById(idAsignacion) {
    return {
        type: actionTypes.GET_ASSIGNMENT_BY_ID,
        payload: idAsignacion,
    };
}

export function postDetailAssignment(param) {
    return {
        type: actionTypes.POST_DETAIL_ASSIGNMENT,
        payload: param
    };
}

export function postStartHug(param) {
    return {
        type: actionTypes.POST_START_HUG,
        payload: param
    };
}

export function postEndHug(param) {
    return {
        type: actionTypes.POST_END_HUG,
        payload: param
    };
}

export function getDurationHug() {
    return {
        type: actionTypes.GET_DURATION_HUG,
    };
}

export function getAssignmentToday() {
    return {
        type: actionTypes.GET_ASSIGNMENT_TODAY,
    };
}

export function getAssignmentTodayById(param) {
    return {
        type: actionTypes.GET_ASSIGNMENT_TODAY_BY_ID,
        payload: param
    };
}

export function clearAssignment() {
    return {
        type: actionTypes.CLEAR_ASSIGNMENT,
    };
}

/** Solo PUT/DELETE/reset; no borra `getAssignmentById` ni listados del día (Tareas). */
export function clearAssignmentWrites() {
    return {
        type: actionTypes.CLEAR_ASSIGNMENT_WRITES,
    };
}

export function getStatisticsAssignmentMonth() {
    return {
        type: actionTypes.GET_STATISTICS_ASSIGNMENT_MONTH,
    };
}

export function putAssignmentById(idAsignacion, body) {
    return {
        type: actionTypes.PUT_ASSIGNMENT_BY_ID,
        payload: { idAsignacion, body },
    };
}

export function deleteAssignmentById(idAsignacion) {
    return {
        type: actionTypes.DELETE_ASSIGNMENT_BY_ID,
        payload: idAsignacion,
    };
}

export function postResetAbrazosColgados() {
    return {
        type: actionTypes.POST_RESET_ABRAZOS_COLGADOS,
    };
}