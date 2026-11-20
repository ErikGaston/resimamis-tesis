import { describe, it, expect, beforeEach } from 'vitest';
import { getIdVolunteer, getFullNameVolunteer } from './localStorage';

describe('getIdVolunteer', () => {
  beforeEach(() => localStorage.clear());

  it('devuelve el id de la sesión', () => {
    localStorage.setItem('voluntaria', JSON.stringify({ id: 5, nombre: 'Ana' }));
    expect(getIdVolunteer()).toBe(5);
  });
  it('sin sesión no rompe', () => {
    expect(getIdVolunteer()).toBeUndefined();
  });
});

describe('getFullNameVolunteer', () => {
  beforeEach(() => localStorage.clear());

  it('arma nombre y apellido', () => {
    localStorage.setItem('voluntaria', JSON.stringify({ nombre: 'Ana', apellido: 'Pérez' }));
    expect(getFullNameVolunteer()).toBe('Ana Pérez');
  });
  it('sin sesión → cadena vacía', () => {
    expect(getFullNameVolunteer()).toBe('');
  });
});
