import AxiosInstance from "../interceptor/interceptor";

//#region - GENERICS
const getLocalitiesURL = '/genericos/localidades';

export const getLocalities = async () => {
  return AxiosInstance
    .get(`${getLocalitiesURL}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};
//#endregion

//#region - USER
const postLoginURL = 'usuario/login/';

/** Alineado a OpenAPI `RequestLogin`: `dni` (int), `contrasena` (string). Acepta también `Dni`/`Contrasena` del formulario. */
export const postLogin = async (param) => {
  const dniRaw = param?.dni ?? param?.Dni;
  const digits = dniRaw != null ? String(dniRaw).replace(/\D/g, '') : '';
  const dni = digits ? Number(digits) : 0;
  const contrasena = param?.contrasena ?? param?.Contrasena ?? '';
  const body = { dni, contrasena };
  return AxiosInstance
    .post(`${postLoginURL}`, body)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};
//#endregion

//#region - VOLUNTEER
const postVolunteerURL = '/voluntaria/';
const postAssistanceURL = '/asistencia/entrada/';
const postAssistanceSalidaURL = '/asistencia/salida/';
const getAssistanceURL = '/asistencia/id/';
const getAssistanceHoyURL = '/asistencia/hoy';
const getAssistanceHistoricasURL = '/asistencia/historicas/';
const getVolunteersFreeURL = '/voluntaria/libres/';
const getVolunteersStatesURL = '/voluntaria/estados/';
const getVolunteersURL = '/voluntaria/';

export const postVolunteer = async (param) => {
  return AxiosInstance
    .post(`${postVolunteerURL}`, param)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

export const postAssistance = async (param) => {
  return AxiosInstance
    .post(`${postAssistanceURL}${param}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

export const postAssistanceSalida = async (idVoluntaria) => {
  return AxiosInstance
    .post(`${postAssistanceSalidaURL}${idVoluntaria}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

export const getAssistanceToday = async () => {
  return AxiosInstance
    .get(`${getAssistanceHoyURL}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

export const getAssistanceHistoricas = async (idVoluntaria) => {
  return AxiosInstance
    .get(`${getAssistanceHistoricasURL}${idVoluntaria}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

export const getVolunteersFree = async () => {
  return AxiosInstance
    .get(`${getVolunteersFreeURL}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

export const getAssistance = async (param) => {
  return AxiosInstance
    .get(`${getAssistanceURL}${param}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

export const getVolunteersStates = async () => {
  return AxiosInstance
    .get(`${getVolunteersStatesURL}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

export const getVolunteerById = async (id) => {
  return AxiosInstance
    .get(`${postVolunteerURL}id/${id}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

export const putVolunteer = async (param) => {
  return AxiosInstance
    .put(`${postVolunteerURL}id/${param.idVoluntaria}/`, param)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

export const getVolunteers = async () => {
  return AxiosInstance
    .get(`${getVolunteersURL}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

//#endregion

//#region - MOTHER
const postMotherURL = '/madre/';
const putMotherURL = '/madre/';
const getMotherURL = '/madre/';
const getMotherIdURL = '/madre/id/';
const getStatisticsLocalitiesURL = '/madre/estadisticaLocalidades';
const getStatisticsAgeMotherURL = '/madre/estadisticaEdadesMadre';

export const postMother = async (param) => {
  return AxiosInstance
    .post(`${postMotherURL}`, param)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

export const getMother = async () => {
  return AxiosInstance
    .get(`${getMotherURL}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

export const getMotherId = async (param) => {
  return AxiosInstance
    .get(`${getMotherIdURL}${param}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};


export const getStatisticsLocalities = async () => {
  return AxiosInstance
    .get(`${getStatisticsLocalitiesURL}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

export const getStatisticsAgeMother = async () => {
  return AxiosInstance
    .get(`${getStatisticsAgeMotherURL}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

export const putMother = async (param) => {
  return AxiosInstance
    .put(`${putMotherURL}id/${param.idMadre}/`, param)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};
//#endregion

//#region - BABY
const babyURL = '/bebe/';
/** Listado de bebés disponibles para abrazar (backend: GET .../bebe/abrazar, no /bebes/abrazar). */
const getBabysFreeURL = '/bebe/abrazar';

export const postBaby = async (param) => {
  return AxiosInstance
    .post(`${babyURL}`, param)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

/** OpenAPI: PUT `/api/Bebe` con body `BEBE` (mismo esquema que POST). */
export const putBaby = async (param) => {
  return AxiosInstance
    .put(`${babyURL}`, param)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

export const getBabysFree = async (params) => {
  return AxiosInstance.get(getBabysFreeURL, params ? { params } : undefined)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

export const getBabys = async () => {
  return AxiosInstance
    .get(`${babyURL}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

export const getBabySalas = async () => {
  return AxiosInstance
    .get(`${babyURL}listarSalas`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

export const getBabyByDni = async (dni) => {
  return AxiosInstance
    .get(`${babyURL}id/${dni}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};
//#endregion

//#region - ASSIGNMENT
const postAssignmentGenerateURL = '/asignacion/generar/';
const postAssignmentGenerateTareasURL = '/asignacion/generarTareas/';
const postDetailAssignmentURL = '/asignacion/registrarDetalleAsignacion/';
const postStartHugURL = '/asignacion/iniciarAbrazo/';
const postEndHugURL = '/asignacion/finalizarAbrazo/';
const getDurationHugURL = '/asignacion/duracionAbrazos/';
const getAssignmentTodayURL = '/asignacion/listarAsignacionesHoy/';
const getAssignmentTodayByIdURL = '/asignacion/listarAsignacionesHoyVoluntaria/';
const getStatisticsAssignmentMonthURL = '/asignacion/listarCantidadAsignacionesPorDia/';
const getConsultarAsignacionURL = '/asignacion/consultar/';
const postGenerarTareaURL = '/asignacion/generarTarea';

/**
 * POST vacío a `/asignacion/generar/` (legacy OpenAPI).
 * El flujo de **Tareas → Asignación** usa `postAssignmentGenerateTareas` vía la acción Redux `POST_ASSIGNMENT_GENERATE`.
 * Mantener solo si el backend sigue exponiendo este endpoint y hay un caso de uso explícito.
 */
export const postAssignmentGenerateLegacy = async () => {
  return AxiosInstance
    .post(`${postAssignmentGenerateURL}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

/** Body OpenAPI `RequestAsignacionTareas`: idVoluntarias (int[]), idTareas (int[]|null). */
export const postAssignmentGenerateTareas = async (body) => {
  const payload = {
    idVoluntarias: Array.isArray(body?.idVoluntarias) ? body.idVoluntarias.map((n) => Number(n)) : [],
    idTareas:
      Array.isArray(body?.idTareas) && body.idTareas.length > 0
        ? body.idTareas.map((n) => Number(n))
        : null,
  };
  return AxiosInstance
    .post(`${postAssignmentGenerateTareasURL}`, payload)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

/** OpenAPI `RequestAsignacionTarea`: una voluntaria y una tarea. */
export const postAssignmentGenerateTarea = async (body) => {
  const payload = {
    idVoluntaria: body?.idVoluntaria != null ? Number(body.idVoluntaria) : null,
    idTarea: body?.idTarea != null ? Number(body.idTarea) : null,
  };
  return AxiosInstance
    .post(`${postGenerarTareaURL}`, payload)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

export const getAssignmentById = async (idAsignacion) => {
  return AxiosInstance
    .get(`${getConsultarAsignacionURL}${idAsignacion}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

/** Body: arreglo de RequestDetalleAsignacion (OpenAPI). Acepta un solo objeto o un array. */
export const postDetailAssignment = async (param) => {
  const toItem = (p) => ({
    idAsignacion: p.idAsignacion != null ? Number(p.idAsignacion) : null,
    idInsumo: p.idInsumo != null ? Number(p.idInsumo) : null,
    cantidadInsumo: p.cantidadInsumo != null ? Number(p.cantidadInsumo) : null,
  });
  const body = Array.isArray(param) ? param.map(toItem) : [toItem(param)];
  return AxiosInstance
    .post(`${postDetailAssignmentURL}`, body)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

export const postStartHug = async (param) => {
  return AxiosInstance
    .post(`${postStartHugURL}${param}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

/** Body: ResquestFinalizarAbrazo — idAsignacion, comentario (nullable). */
export const postEndHug = async (param) => {
  const idAsignacion = param.idAsignacion ?? param.id;
  const body = {
    idAsignacion: idAsignacion != null ? Number(idAsignacion) : null,
    comentario: param.comentario != null && param.comentario !== '' ? String(param.comentario) : null,
  };
  return AxiosInstance
    .post(`${postEndHugURL}`, body)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

export const getDurationHug = async () => {
  return AxiosInstance
    .get(`${getDurationHugURL}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

export const getAssignmentToday = async () => {
  return AxiosInstance
    .get(`${getAssignmentTodayURL}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

export const getAssignmentTodayById = async (param) => {
  return AxiosInstance
    .get(`${getAssignmentTodayByIdURL}${param}`,)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

export const getStatisticsAssignmentMonth = async () => {
  return AxiosInstance
    .get(`${getStatisticsAssignmentMonthURL}`,)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};
//#endregion

//#region - SUPPLY
const getSuppliesURL = '/insumo';
const getStatisticsSuppliesURL = '/insumo/estadisticaInsumoCantidad';
const postInsumoConsultaMovimientosURL = '/insumo/consultaMovimientos';
const getInsumoProveedoresURL = '/insumo/proveedores';
const postInsumoRegistrarMovimientoURL = '/insumo/registrarMovimiento';

export const getSupplies = async () => {
  return AxiosInstance
    .get(`${getSuppliesURL}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

export const getStatisticsSupplies = async () => {
  return AxiosInstance
    .get(`${getStatisticsSuppliesURL}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

/** Body OpenAPI `RequestMovimiento`: `fechaDesde`, `fechaHasta` (opcionales, date-time). */
export const postSupplyConsultMovements = async (body = {}) => {
  return AxiosInstance
    .post(`${postInsumoConsultaMovimientosURL}`, body)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

export const getSupplyProviders = async () => {
  return AxiosInstance
    .get(`${getInsumoProveedoresURL}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

/** Body OpenAPI `MOVIMIENTOSTOCK`. */
export const postSupplyRegisterMovement = async (body) => {
  return AxiosInstance
    .post(`${postInsumoRegistrarMovimientoURL}`, body)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};
//#endregion
