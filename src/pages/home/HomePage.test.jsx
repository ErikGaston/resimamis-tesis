import { describe, it, expect, beforeEach } from 'vitest';
import { renderWithProviders } from '../../test/renderWithProviders';
import { HomePage } from './HomePage';

beforeEach(() => {
  localStorage.clear();
  localStorage.setItem('voluntaria', JSON.stringify({ id: 1, nombre: 'Ana', apellido: 'Pérez', rol: 'coordinadora', idRol: 3 }));
});

describe('HomePage (smoke)', () => {
  it('renderiza sin crashear con voluntarias libres vacías', () => {
    const { container } = renderWithProviders(<HomePage />, {
      preloadedState: {
        volunteerReducer: { loading: false, error: null, getVolunteersFree: { data: [] } },
      },
    });
    expect(container.firstChild).toBeInTheDocument();
  });
});
