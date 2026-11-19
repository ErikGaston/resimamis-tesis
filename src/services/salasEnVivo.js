import AxiosInstance from '../redux/interceptor/interceptor';

const datos = (r) => {
  const d = r?.data?.data ?? r?.data;
  return Array.isArray(d) ? d : [];
};

/**
 * Todo lo que muestra el panel de salas, en paralelo:
 * salas, bebés, voluntarias presentes hoy y asignaciones de hoy.
 * Usa los mismos endpoints que el resto de la app.
 */
export const cargarSalasEnVivo = async () => {
  const [salas, bebes, presentes, asignaciones] = await Promise.all([
    AxiosInstance.get('/sala').then(datos),
    AxiosInstance.get('/bebe/').then(datos),
    AxiosInstance.get('/voluntaria/libres/').then(datos),
    AxiosInstance.get('/asignacion/listarAsignacionesHoy/').then(datos),
  ]);
  return { salas, bebes, presentes, asignaciones };
};

/** Asignación individual: el mismo endpoint que "Asignación rápida". */
export const asignarVoluntariaABebe = (idVoluntaria, idBebe) =>
  AxiosInstance.post('/asignacion/generarTarea', { idVoluntaria, idTarea: idBebe });

export const moverBebeDeSala = (idBebe, idSala) =>
  AxiosInstance.put(`/bebe/${idBebe}/sala`, { idSala });
