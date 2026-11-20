import { describe, it, expect, beforeEach } from 'vitest';
import AxiosInstance from './interceptor';

const reqHandler = AxiosInstance.interceptors.request.handlers[0];
const resHandler = AxiosInstance.interceptors.response.handlers[0];

beforeEach(() => {
  localStorage.clear();
  Object.defineProperty(window, 'location', {
    configurable: true,
    writable: true,
    value: { href: 'http://localhost/' },
  });
});

describe('interceptor — request', () => {
  it('inyecta Authorization: Bearer <token> si hay token en localStorage', () => {
    localStorage.setItem('token', 'abc123');
    const config = reqHandler.fulfilled({ headers: {} });
    expect(config.headers.Authorization).toBe('Bearer abc123');
  });

  it('no agrega Authorization si no hay token', () => {
    const config = reqHandler.fulfilled({ headers: {} });
    expect(config.headers.Authorization).toBeUndefined();
  });
});

describe('interceptor — response', () => {
  it('deja pasar la respuesta exitosa tal cual', () => {
    const response = { data: { ok: true } };
    expect(resHandler.fulfilled(response)).toBe(response);
  });

  it('ante 401 limpia token y voluntaria y redirige a /login', async () => {
    localStorage.setItem('token', 'abc');
    localStorage.setItem('voluntaria', '{"id":1}');
    const error = { config: {}, response: { status: 401, data: 'no autorizado' } };

    await expect(resHandler.rejected(error)).rejects.toEqual(error.response);

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('voluntaria')).toBeNull();
    expect(window.location.href).toBe('/login');
    expect(error.config._retry).toBe(true);
  });

  it('no re-dispara el flujo 401 si _retry ya está marcado', async () => {
    localStorage.setItem('token', 'abc');
    const error = { config: { _retry: true }, response: { status: 401 } };

    await expect(resHandler.rejected(error)).rejects.toEqual(error.response);

    // no toca localStorage ni redirige
    expect(localStorage.getItem('token')).toBe('abc');
    expect(window.location.href).toBe('http://localhost/');
  });

  it('un error no-401 no borra storage ni redirige', async () => {
    localStorage.setItem('token', 'abc');
    const error = { config: {}, response: { status: 500 } };

    await expect(resHandler.rejected(error)).rejects.toEqual(error.response);

    expect(localStorage.getItem('token')).toBe('abc');
    expect(window.location.href).toBe('http://localhost/');
  });

  it('si no hay response, rechaza con el message', async () => {
    const error = { config: {}, message: 'Network Error' };
    await expect(resHandler.rejected(error)).rejects.toBe('Network Error');
  });
});
