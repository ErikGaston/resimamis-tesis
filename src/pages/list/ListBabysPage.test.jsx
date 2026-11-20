import { describe, it, expect, beforeEach } from 'vitest';
import { renderWithProviders } from '../../test/renderWithProviders';
import { ListBabysPage } from './ListBabysPage';

beforeEach(() => localStorage.clear());

describe('ListBabysPage (smoke)', () => {
  it('renderiza sin crashear con el listado vacío', () => {
    const { container } = renderWithProviders(<ListBabysPage />, {
      preloadedState: {
        babyReducer: {
          loading: false, error: null, getBabys: { data: [] },
          getBabyByDni: null, postBabyDelete: null,
        },
      },
    });
    expect(container.firstChild).toBeInTheDocument();
  });
});
