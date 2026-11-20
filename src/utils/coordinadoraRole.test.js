import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  readVolunteerSession,
  isCoordinadoraVoluntaria,
  isCoordinadoraSession,
} from './coordinadoraRole';

describe('readVolunteerSession', () => {
  beforeEach(() => localStorage.clear());

  it('devuelve null si no hay sesión', () => {
    expect(readVolunteerSession()).toBeNull();
  });
  it('parsea el objeto guardado', () => {
    localStorage.setItem('voluntaria', JSON.stringify({ id: 1, rol: 'Coordinadora' }));
    expect(readVolunteerSession()).toEqual({ id: 1, rol: 'Coordinadora' });
  });
  it('devuelve null si el JSON es inválido', () => {
    localStorage.setItem('voluntaria', '{no es json');
    expect(readVolunteerSession()).toBeNull();
  });
});

describe('isCoordinadoraVoluntaria', () => {
  it('true por rol texto, insensible a tildes/mayúsculas', () => {
    expect(isCoordinadoraVoluntaria({ rol: 'Coordinadora' })).toBe(true);
    expect(isCoordinadoraVoluntaria({ rol: 'Coördinadora' })).toBe(true);
    expect(isCoordinadoraVoluntaria({ Rol: 'COORDINADOR' })).toBe(true);
  });
  it('false para otros roles o null', () => {
    expect(isCoordinadoraVoluntaria({ rol: 'Voluntaria' })).toBe(false);
    expect(isCoordinadoraVoluntaria(null)).toBe(false);
    expect(isCoordinadoraVoluntaria(undefined)).toBe(false);
  });
  it('usa idRol vs env VITE_COORDINADORA_ID_ROL como fallback', () => {
    vi.stubEnv('VITE_COORDINADORA_ID_ROL', '3');
    expect(isCoordinadoraVoluntaria({ idRol: 3 })).toBe(true);
    expect(isCoordinadoraVoluntaria({ idRol: 2 })).toBe(false);
    vi.unstubAllEnvs();
  });
});

describe('isCoordinadoraSession', () => {
  beforeEach(() => localStorage.clear());

  it('lee la sesión de localStorage', () => {
    localStorage.setItem('voluntaria', JSON.stringify({ rol: 'Coordinadora' }));
    expect(isCoordinadoraSession()).toBe(true);
  });
  it('false sin sesión', () => {
    expect(isCoordinadoraSession()).toBe(false);
  });
});
