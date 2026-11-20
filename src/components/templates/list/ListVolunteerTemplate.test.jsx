import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import ListVolunteerTemplate from './ListVolunteerTemplate';
import { renderWithProviders } from '../../../test/renderWithProviders';

const volunteers = [
  { idVoluntaria: 1, nombre: 'Ana', apellido: 'García', dni: 11111111, celular: '3511234567', mail: 'ana@mail.com' },
  { idVoluntaria: 2, nombre: 'Rosa', apellido: 'Pérez', dni: 22222222, celular: '3517654321' },
];

describe('ListVolunteerTemplate', () => {
  it('muestra el header y el buscador', () => {
    renderWithProviders(<ListVolunteerTemplate volunteers={volunteers} />);
    expect(screen.getByText('Voluntarias')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/buscar por nombre/i)).toBeInTheDocument();
  });

  it('con voluntarias renderiza una card por cada una', () => {
    renderWithProviders(<ListVolunteerTemplate volunteers={volunteers} />);
    expect(screen.getByText('Ana García')).toBeInTheDocument();
    expect(screen.getByText('Rosa Pérez')).toBeInTheDocument();
  });

  it('con lista vacía muestra el estado vacío', () => {
    renderWithProviders(<ListVolunteerTemplate volunteers={[]} />);
    expect(screen.getByText(/no hay voluntarias registradas/i)).toBeInTheDocument();
  });

  it('busca sin coincidencias muestra el mensaje correspondiente', () => {
    renderWithProviders(<ListVolunteerTemplate volunteers={volunteers} />);
    fireEvent.change(screen.getByPlaceholderText(/buscar por nombre/i), { target: { value: 'zzzzz' } });
    expect(screen.getByText(/no se encontraron voluntarias con ese criterio/i)).toBeInTheDocument();
  });

  it('la coordinadora da de baja: dispara onDeleteVolunteer con id y nombre', () => {
    const onDeleteVolunteer = vi.fn();
    renderWithProviders(
      <ListVolunteerTemplate volunteers={volunteers} isCoordinator onDeleteVolunteer={onDeleteVolunteer} />,
    );
    fireEvent.click(screen.getByLabelText('Eliminar registro de Ana García'));
    expect(onDeleteVolunteer).toHaveBeenCalledWith(1, 'Ana García');
  });

  it('con coordinadora y mail, muestra la acción de enviar mail', () => {
    renderWithProviders(
      <ListVolunteerTemplate volunteers={volunteers} isCoordinator onDeleteVolunteer={vi.fn()} />,
    );
    expect(screen.getByLabelText('Enviar mail a Ana García')).toBeInTheDocument();
    expect(screen.queryByLabelText('Enviar mail a Rosa Pérez')).not.toBeInTheDocument();
  });
});
