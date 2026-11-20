import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../interceptor/interceptor', () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import AxiosInstance from '../interceptor/interceptor';
import * as API from './index';
import { capitalizarNombre } from '../../utils/capitalizacion';

beforeEach(() => {
  vi.clearAllMocks();
  const ok = { data: 'ok' };
  AxiosInstance.get.mockResolvedValue(ok);
  AxiosInstance.post.mockResolvedValue(ok);
  AxiosInstance.put.mockResolvedValue(ok);
  AxiosInstance.delete.mockResolvedValue(ok);
});

describe('api/index — contratos no obvios', () => {
  describe('postLogin', () => {
    it('normaliza DNI a número (quita puntos y no-dígitos) y arma { dni, contrasena }', async () => {
      await API.postLogin({ Dni: '44.110.005', Contrasena: 'secreta' });
      expect(AxiosInstance.post).toHaveBeenCalledWith('usuario/login/', {
        dni: 44110005,
        contrasena: 'secreta',
      });
    });

    it('acepta las claves en minúscula (dni/contrasena)', async () => {
      await API.postLogin({ dni: '12345678', contrasena: 'x' });
      expect(AxiosInstance.post).toHaveBeenCalledWith('usuario/login/', { dni: 12345678, contrasena: 'x' });
    });

    it('sin datos => dni 0 y contrasena vacía', async () => {
      await API.postLogin({});
      expect(AxiosInstance.post).toHaveBeenCalledWith('usuario/login/', { dni: 0, contrasena: '' });
    });
  });

  describe('bajas lógicas: POST /x/delete con body vacío e id por query', () => {
    it('postBabyDelete', async () => {
      await API.postBabyDelete(7);
      expect(AxiosInstance.post).toHaveBeenCalledWith('/bebe/delete', null, { params: { idBebe: 7 } });
    });

    it('postMotherDelete', async () => {
      await API.postMotherDelete(3);
      expect(AxiosInstance.post).toHaveBeenCalledWith(expect.stringMatching(/delete$/), null, {
        params: { idMadre: 3 },
      });
    });

    it('postVolunteerDelete', async () => {
      await API.postVolunteerDelete(9);
      expect(AxiosInstance.post).toHaveBeenCalledWith(expect.stringMatching(/delete$/), null, {
        params: { idVoluntaria: 9 },
      });
    });

    it('postVisitaDelete', async () => {
      await API.postVisitaDelete(11);
      expect(AxiosInstance.post).toHaveBeenCalledWith('/visita/delete', null, { params: { idVisita: 11 } });
    });

    it('postProveedorDelete', async () => {
      await API.postProveedorDelete(2);
      expect(AxiosInstance.post).toHaveBeenCalledWith('/proveedor/delete', null, { params: { idProveedor: 2 } });
    });
  });

  describe('putBaby: el id va en el body, no en la URL', () => {
    it('hace PUT /bebe/ con el param completo como body', async () => {
      const body = { id: 5, nombre: 'Ana' };
      await API.putBaby(body);
      expect(AxiosInstance.put).toHaveBeenCalledWith('/bebe/', body);
    });
  });

  describe('postEndHug: body { idAsignacion, comentario }, nunca en la URL', () => {
    it('coerciona idAsignacion a número y comentario vacío => null', async () => {
      await API.postEndHug({ idAsignacion: '5', comentario: '' });
      expect(AxiosInstance.post).toHaveBeenCalledWith(expect.any(String), { idAsignacion: 5, comentario: null });
    });

    it('acepta { id } como alias de idAsignacion y conserva el comentario', async () => {
      await API.postEndHug({ id: '8', comentario: 'todo ok' });
      expect(AxiosInstance.post).toHaveBeenCalledWith(expect.any(String), { idAsignacion: 8, comentario: 'todo ok' });
    });
  });

  describe('postDetailAssignment: body array con coerción numérica', () => {
    it('envuelve un objeto suelto en un array', async () => {
      await API.postDetailAssignment({ idAsignacion: '1', idInsumo: '2', cantidadInsumo: '3' });
      expect(AxiosInstance.post).toHaveBeenCalledWith(expect.any(String), [
        { idAsignacion: 1, idInsumo: 2, cantidadInsumo: 3 },
      ]);
    });

    it('mapea un array respetando cada item', async () => {
      await API.postDetailAssignment([
        { idAsignacion: 1, idInsumo: 2, cantidadInsumo: 4 },
        { idAsignacion: 1, idInsumo: 3, cantidadInsumo: 1 },
      ]);
      expect(AxiosInstance.post).toHaveBeenCalledWith(expect.any(String), [
        { idAsignacion: 1, idInsumo: 2, cantidadInsumo: 4 },
        { idAsignacion: 1, idInsumo: 3, cantidadInsumo: 1 },
      ]);
    });
  });

  describe('postAssignmentGenerateTarea: coerciona ids a número', () => {
    it('idVoluntaria e idTarea pasan a número', async () => {
      await API.postAssignmentGenerateTarea({ idVoluntaria: '1', idTarea: '2' });
      expect(AxiosInstance.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ idVoluntaria: 1, idTarea: 2 }),
      );
    });
  });

  describe('postStartHug: el id va en la URL', () => {
    it('concatena el id a la URL de inicio de abrazo', async () => {
      await API.postStartHug(42);
      expect(AxiosInstance.post).toHaveBeenCalledWith(expect.stringMatching(/42$/));
    });
  });

  describe('putAssignmentById: PUT /asignacion/id/{id}/ con body', () => {
    it('arma la URL con el id y manda el body', async () => {
      const body = { comentario: 'x' };
      await API.putAssignmentById(7, body);
      expect(AxiosInstance.put).toHaveBeenCalledWith('/asignacion/id/7/', body);
    });
  });

  describe('postVisita: normaliza el body (capitaliza nombres, numeriza documento/teléfono)', () => {
    it('documento/teléfono vacíos => null; con valor => número; nombres capitalizados', async () => {
      await API.postVisita({
        idBebe: '5',
        nombreVisitante: 'juan perez',
        familiar: 'padre',
        documentoVisitante: '',
        telefonoVisitante: '3511234567',
        observacion: 'ok',
      });
      expect(AxiosInstance.post).toHaveBeenCalledWith('/visita', {
        idBebe: 5,
        nombreVisitante: capitalizarNombre('juan perez'),
        familiar: capitalizarNombre('padre'),
        documentoVisitante: null,
        telefonoVisitante: 3511234567,
        observacion: 'ok',
      });
    });
  });

  describe('propagación de error', () => {
    it('si AxiosInstance rechaza, la función relanza el error', async () => {
      const boom = new Error('500');
      AxiosInstance.get.mockRejectedValueOnce(boom);
      await expect(API.getLocalities()).rejects.toBe(boom);
    });
  });
});
