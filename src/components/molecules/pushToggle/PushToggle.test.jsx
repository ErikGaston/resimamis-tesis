import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../test/renderWithProviders';
import PushToggle from './PushToggle';

describe('PushToggle', () => {
  it('renderiza el bloque de notificaciones', () => {
    renderWithProviders(<PushToggle />);
    expect(screen.getByText('Notificaciones')).toBeInTheDocument();
  });

  it('sin soporte de push (jsdom) el switch queda deshabilitado', () => {
    renderWithProviders(<PushToggle />);
    expect(screen.getByRole('checkbox', { name: /activar notificaciones/i })).toBeDisabled();
  });
});
