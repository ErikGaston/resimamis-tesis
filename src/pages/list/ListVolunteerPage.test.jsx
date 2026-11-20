import { describe, it, expect, beforeEach } from 'vitest';
import { renderWithProviders } from '../../test/renderWithProviders';
import { ListVolunteerPage } from './ListVolunteerPage';

beforeEach(() => localStorage.clear());

describe('ListVolunteerPage (smoke)', () => {
  it('renderiza sin crashear con el listado vacío', () => {
    const { container } = renderWithProviders(<ListVolunteerPage />, {
      preloadedState: {
        volunteerReducer: {
          loading: false, error: null, getVolunteers: { data: [] }, postVolunteerDelete: null,
        },
      },
    });
    expect(container.firstChild).toBeInTheDocument();
  });
});
