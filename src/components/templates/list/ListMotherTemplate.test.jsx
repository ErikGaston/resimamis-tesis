import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import ListMotherTemplate from './ListMotherTemplate';
import { renderWithProviders } from '../../../test/renderWithProviders';

const mothers = [
  { idMadre: 1, nombre: 'Ana', apellido: 'García', dni: 11111111, celular: '3511234567' },
  { idMadre: 2, nombre: 'Rosa', apellido: 'Pérez', dni: 22222222, celular: '3517654321' },
];

describe('ListMotherTemplate', () => {
  it('muestra el header y el buscador', () => {
    renderWithProviders(<ListMotherTemplate mothers={mothers} />);
    expect(screen.getByText('Madres')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/buscar por nombre/i)).toBeInTheDocument();
  });

  it('con madres renderiza una card por cada una', () => {
    renderWithProviders(<ListMotherTemplate mothers={mothers} />);
    expect(screen.getByText('Ana García')).toBeInTheDocument();
    expect(screen.getByText('Rosa Pérez')).toBeInTheDocument();
  });

  it('con lista vacía muestra el estado vacío', () => {
    renderWithProviders(<ListMotherTemplate mothers={[]} />);
    expect(screen.getByText(/no hay madres registradas/i)).toBeInTheDocument();
  });

  it('busca sin coincidencias muestra el mensaje correspondiente', () => {
    renderWithProviders(<ListMotherTemplate mothers={mothers} />);
    fireEvent.change(screen.getByPlaceholderText(/buscar por nombre/i), { target: { value: 'zzzzz' } });
    expect(screen.getByText(/no se encontraron madres con ese criterio/i)).toBeInTheDocument();
  });

  it('la coordinadora da de baja: dispara onDeleteMother con id y nombre', () => {
    const onDeleteMother = vi.fn();
    renderWithProviders(
      <ListMotherTemplate mothers={mothers} isCoordinator onDeleteMother={onDeleteMother} />,
    );
    fireEvent.click(screen.getByLabelText('Eliminar registro de Ana García'));
    expect(onDeleteMother).toHaveBeenCalledWith(1, 'Ana García');
  });
});
