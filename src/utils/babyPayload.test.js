import { describe, it, expect } from 'vitest';
import {
  resolveIdLocalidad,
  collectIdMadresForBaby,
  normalizeBabyApiPayload,
  normalizeBabyForAlta,
} from './babyPayload';

describe('resolveIdLocalidad', () => {
  it('toma idLocalidad o localidad (solo > 0)', () => {
    expect(resolveIdLocalidad({ idLocalidad: 5 })).toBe(5);
    expect(resolveIdLocalidad({ localidad: 3 })).toBe(3);
  });
  it('null para 0, vacío o ausente', () => {
    expect(resolveIdLocalidad({ localidad: 0 })).toBeNull();
    expect(resolveIdLocalidad({ localidad: '' })).toBeNull();
    expect(resolveIdLocalidad({})).toBeNull();
  });
});

describe('collectIdMadresForBaby', () => {
  it('junta idMadres + idMadre + fallback sin duplicar ni inválidos', () => {
    expect(collectIdMadresForBaby({ idMadres: [2, 2, 3], idMadre: 3 }, 4)).toEqual([2, 3, 4]);
  });
  it('usa el fallback cuando no hay madres en el bebé', () => {
    expect(collectIdMadresForBaby({}, 5)).toEqual([5]);
  });
  it('descarta 0, negativos, vacíos y null', () => {
    expect(collectIdMadresForBaby({ idMadres: [0, -1, '', null, 7] }, null)).toEqual([7]);
  });
});

describe('normalizeBabyApiPayload', () => {
  it('normaliza tipos, capitaliza y arma idMadres', () => {
    const body = normalizeBabyApiPayload({
      id: 10, dni: '12.345.678', nombre: 'juan', apellido: 'perez',
      pesoNacimiento: '2.5', idSala: '3', localidad: '7', idMadre: 4,
    });
    expect(body.id).toBe(10);
    expect(body.dni).toBe(12345678);
    expect(body.nombre).toBe('Juan');
    expect(body.pesoNacimiento).toBe(2.5);
    expect(body.idSala).toBe(3);
    expect(body.idLocalidad).toBe(7);
    expect(body.idMadre).toBe(4);
    expect(body.idMadres).toEqual([4]);
  });
  it('no agrega idMadres si no hay ninguna', () => {
    const body = normalizeBabyApiPayload({ nombre: 'Ana' });
    expect(body.idMadre).toBeNull();
    expect(body).not.toHaveProperty('idMadres');
  });
  it('preserva fechaSalida (null si no viene)', () => {
    expect(normalizeBabyApiPayload({ fechaSalida: '2026-07-01' }).fechaSalida).toBe('2026-07-01');
    expect(normalizeBabyApiPayload({}).fechaSalida).toBeNull();
  });
});

describe('normalizeBabyForAlta', () => {
  it('omite id/idMadre/idEstado y normaliza sexo a mayúscula', () => {
    const body = normalizeBabyForAlta({
      id: 99, idMadre: 5, idEstado: 2, nombre: 'ana', sexo: 'f', pesoAlta: '3.1',
    });
    expect(body).not.toHaveProperty('id');
    expect(body).not.toHaveProperty('idMadre');
    expect(body).not.toHaveProperty('idEstado');
    expect(body.nombre).toBe('Ana');
    expect(body.sexo).toBe('F');
    expect(body.pesoAlta).toBe(3.1);
  });
});
