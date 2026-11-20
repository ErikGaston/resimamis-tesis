import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { HomeTemplate } from './HomeTemplate';
import { renderWithProviders } from '../../../test/renderWithProviders';

vi.mock('../../organisms/homeCarousels/Modules', () => ({
  default: ({ nameVolunteer }) => <div data-testid="modules">{nameVolunteer}</div>,
}));
vi.mock('../../organisms/homeCarousels/VolutariasDisponible', () => ({
  default: ({ listVolunteersFree }) => <div data-testid="vols">{(listVolunteersFree ?? []).length}</div>,
}));
vi.mock('../../organisms/homeCarousels/PanelTrabajo', () => ({
  default: () => <div data-testid="panel-trabajo" />,
}));

describe('HomeTemplate', () => {
  it('renderiza los módulos pasando el nombre de la voluntaria, el panel y las voluntarias', () => {
    renderWithProviders(<HomeTemplate nameVolunteer="Ana" volunteersFree={[]} />);
    expect(screen.getByTestId('modules')).toHaveTextContent('Ana');
    expect(screen.getByTestId('panel-trabajo')).toBeInTheDocument();
    expect(screen.getByTestId('vols')).toBeInTheDocument();
  });

  it('enriquece y pasa la lista de voluntarias libres', () => {
    renderWithProviders(
      <HomeTemplate
        nameVolunteer="Ana"
        volunteersFree={[{ nombre: 'Rosa', apellido: 'P' }, { nombre: 'Luz', apellido: 'G' }]}
      />,
    );
    expect(screen.getByTestId('vols')).toHaveTextContent('2');
  });
});
