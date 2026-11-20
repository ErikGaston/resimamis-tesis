import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/renderWithProviders';
import AsistentePage from './AsistentePage';

// jsdom no implementa scrollIntoView; la página lo usa en un useEffect.
window.HTMLElement.prototype.scrollIntoView = vi.fn();

function setSession(rol) {
  localStorage.setItem('token', 't');
  localStorage.setItem(
    'voluntaria',
    JSON.stringify({ id: 1, nombre: 'Test', apellido: 'User', rol, idRol: rol === 'coordinadora' ? 3 : 2 }),
  );
}

describe('AsistentePage (smoke)', () => {
  beforeEach(() => localStorage.clear());

  it('sin rol coordinadora muestra el aviso de acceso restringido', () => {
    setSession('voluntaria');
    renderWithProviders(<AsistentePage />, { preloadedState: { asistenteReducer: {} } });
    expect(screen.getByText(/solo para coordinadoras/i)).toBeInTheDocument();
  });

  it('como coordinadora renderiza el asistente sin crashear', () => {
    setSession('coordinadora');
    renderWithProviders(<AsistentePage />, { preloadedState: { asistenteReducer: {} } });
    expect(screen.getByText(/preguntá sobre el programa/i)).toBeInTheDocument();
  });
});
