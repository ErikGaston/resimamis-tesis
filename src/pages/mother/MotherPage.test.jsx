import { describe, it, expect, beforeEach } from 'vitest';
import { renderWithProviders } from '../../test/renderWithProviders';
import { MotherPage } from './MotherPage';

beforeEach(() => localStorage.clear());

describe('MotherPage (smoke)', () => {
  it('renderiza el alta de madre sin crashear', () => {
    const { container } = renderWithProviders(<MotherPage />, {
      preloadedState: {
        genericsReducer: { getLocalities: { data: [] }, getEstadosCiviles: { data: [] } },
        motherReducer: { loading: false, error: null, getMother: { data: [] }, postMother: null },
        babyReducer: { loading: false, error: null, getBabySalas: { data: [] } },
      },
    });
    expect(container.firstChild).toBeInTheDocument();
  });
});
