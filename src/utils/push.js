import { desuscribirPush, obtenerEstadoPush, suscribirPush } from '../services/notificaciones';

const SW_URL = '/sw-push.js';

/** true si el navegador soporta Web Push (en iPhone solo con la app agregada a inicio). */
export const soportaPush = () =>
  typeof window !== 'undefined'
  && 'serviceWorker' in navigator
  && 'PushManager' in window
  && 'Notification' in window;

const urlBase64ToUint8Array = (base64) => {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + padding).replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
};

const registro = async () => {
  const existente = await navigator.serviceWorker.getRegistration(SW_URL);
  return existente ?? navigator.serviceWorker.register(SW_URL);
};

/** Suscripción de este navegador, o null. */
export const suscripcionActual = async () => {
  if (!soportaPush()) return null;
  const reg = await navigator.serviceWorker.getRegistration(SW_URL);
  return reg ? reg.pushManager.getSubscription() : null;
};

/**
 * Pide permiso, suscribe este navegador y lo guarda en el back.
 * Devuelve 'ok' | 'denegado' | 'no-soportado' | 'no-configurado'.
 */
export const activarPush = async () => {
  if (!soportaPush()) return 'no-soportado';
  const estado = await obtenerEstadoPush();
  if (!estado?.clavePublica) return 'no-configurado';
  const permiso = await Notification.requestPermission();
  if (permiso !== 'granted') return 'denegado';
  const reg = await registro();
  await navigator.serviceWorker.ready;
  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(estado.clavePublica),
    });
  }
  await suscribirPush(sub.toJSON());
  return 'ok';
};

export const desactivarPush = async () => {
  const sub = await suscripcionActual();
  if (!sub) return;
  try {
    await desuscribirPush(sub.endpoint);
  } finally {
    await sub.unsubscribe();
  }
};
