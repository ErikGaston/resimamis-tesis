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

export const postLogin = async (param) => {
  return AxiosInstance
    .post(`${postLoginURL}`, param)
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
const getAssistanceURL = '/asistencia/id/';
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
    .get(`${postVolunteerURL}/id/${id}`)
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
const getBabysFreeURL = '/bebes/abrazar';

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

export const getBabysFree = async (param) => {
  return AxiosInstance
    .get(`${getBabysFreeURL}`, param)
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
//#endregion

//#region - ASSIGNMENT
const postAssignmentGenerateURL = '/asignacion/generar/';
const postDetailAssignmentURL = '/asignacion/registrarDetalleAsignacion/';
const postStartHugURL = '/asignacion/iniciarAbrazo/';
const postEndHugURL = '/asignacion/finalizarAbrazo/';
const getDurationHugURL = '/asignacion/duracionAbrazos/';
const getAssignmentTodayURL = '/asignacion/listarAsignacionesHoy/';
const getAssignmentTodayByIdURL = '/asignacion/listarAsignacionesHoyVoluntaria/';
const getStatisticsAssignmentMonthURL = '/asignacion/listarCantidadAsignacionesPorDia/';

export const postAssignmentGenerate = async () => {
  return AxiosInstance
    .post(`${postAssignmentGenerateURL}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

export const postDetailAssignment = async (param) => {
  return AxiosInstance
    .post(`${postDetailAssignmentURL}${param.idAsignacion}/${param.idInsumo}/${param.cantidadInsumo}`)
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

export const postEndHug = async (param) => {
  return AxiosInstance
    .post(`${postEndHugURL}${param.id}/${param.comentario ?? ''}`)
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
//#endregion
