import AxiosInstance from '../redux/interceptor/interceptor';

/**
 * Llamadas simples de notificaciones (mail a una voluntaria y push del navegador).
 * No pasan por Redux: son acciones puntuales cuyo resultado solo usa el componente que las dispara.
 */

/** La coordinadora le manda un mail a la voluntaria. */
export const enviarMailVoluntaria = (idVoluntaria, { asunto, mensaje }) =>
  AxiosInstance.post(`/voluntaria/id/${idVoluntaria}/mail`, { asunto, mensaje });

/** { clavePublica: string | null, dispositivos: number } de la voluntaria logueada. */
export const obtenerEstadoPush = () =>
  AxiosInstance.get('/push/estado').then((r) => r?.data?.data ?? r?.data);

export const suscribirPush = (suscripcion) => AxiosInstance.post('/push/suscribir', suscripcion);

export const desuscribirPush = (endpoint) => AxiosInstance.post('/push/desuscribir', { endpoint });

export const probarPush = () =>
  AxiosInstance.post('/push/probar').then((r) => r?.data?.data ?? r?.data);
