import { describe, it, expect, beforeEach } from 'vitest';
import { renderWithProviders } from '../../test/renderWithProviders';
import { VolunteerPage } from './VolunteerPage';

beforeEach(() => localStorage.clear());

describe('VolunteerPage (smoke)', () => {
  it('renderiza el alta de voluntaria sin crashear', () => {
    const { container } = renderWithProviders(<VolunteerPage />, {
      preloadedState: {
        genericsReducer: { getLocalities: { data: [] } },
        // postVolunteer debe ser null: el efecto dispara success si es !== null
        volunteerReducer: { loading: false, error: null, getVolunteers: { data: [] }, postVolunteer: null },
      },
    });
    expect(container.firstChild).toBeInTheDocument();
  });
});
