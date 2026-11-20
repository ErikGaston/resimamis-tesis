import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/renderWithProviders';
import SalasEnVivoPage from './SalasEnVivoPage';

beforeEach(() => localStorage.clear());

describe('SalasEnVivoPage (smoke)', () => {
  it('sin sesión de coordinadora muestra el aviso de acceso restringido', () => {
    renderWithProviders(<SalasEnVivoPage />, { preloadedState: {} });
    expect(screen.getByText(/solo para coordinadoras/i)).toBeInTheDocument();
  });
});
