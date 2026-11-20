import { describe, it, expect, beforeEach } from 'vitest';
import { renderWithProviders } from '../../test/renderWithProviders';
import { ListMotherPage } from './ListMotherPage';

beforeEach(() => localStorage.clear());

describe('ListMotherPage (smoke)', () => {
  it('renderiza sin crashear con el listado vacío', () => {
    const { container } = renderWithProviders(<ListMotherPage />, {
      preloadedState: {
        motherReducer: {
          loading: false, error: null, getMother: { data: [] }, postMotherDelete: null,
        },
      },
    });
    expect(container.firstChild).toBeInTheDocument();
  });
});
