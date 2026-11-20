import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/renderWithProviders';
import PanelDiaPage from './PanelDiaPage';

beforeEach(() => localStorage.clear());

describe('PanelDiaPage (smoke)', () => {
  it('sin sesión de coordinadora muestra el aviso de acceso restringido', () => {
    renderWithProviders(<PanelDiaPage />, { preloadedState: { dashboardReducer: {}, supplyReducer: {} } });
    expect(screen.getByText(/solo para coordinadoras/i)).toBeInTheDocument();
  });
});
