import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import ListBabysTemplate from './ListBabysTemplate';
import { renderWithProviders } from '../../../test/renderWithProviders';

const babys = [
  { idBebe: 1, nombre: 'Ana', apellido: 'García', dni: 11111111 },
  { idBebe: 2, nombre: 'Beto', apellido: 'López', dni: 22222222 },
];

describe('ListBabysTemplate', () => {
  it('muestra el header y el buscador', () => {
    renderWithProviders(<ListBabysTemplate babys={babys} />);
    expect(screen.getByText('Bebés')).toBeInTheDocument();
    expect(screen.getByLabelText(/buscar bebé/i)).toBeInTheDocument();
  });

  it('con bebés renderiza una card por cada uno (nombre y apellido)', () => {
    renderWithProviders(<ListBabysTemplate babys={babys} />);
    expect(screen.getByText('Ana García')).toBeInTheDocument();
    expect(screen.getByText('Beto López')).toBeInTheDocument();
    expect(screen.queryByText(/no hay bebés registrados/i)).not.toBeInTheDocument();
  });

  it('con lista vacía muestra el estado vacío', () => {
    renderWithProviders(<ListBabysTemplate babys={[]} />);
    expect(screen.getByText(/no hay bebés registrados/i)).toBeInTheDocument();
  });

  it('al buscar algo que no matchea muestra el mensaje de sin coincidencias', () => {
    renderWithProviders(<ListBabysTemplate babys={babys} />);
    fireEvent.change(screen.getByPlaceholderText(/buscar por nombre/i), { target: { value: 'zzzzz' } });
    expect(screen.getByText(/no se encontraron bebés con ese criterio/i)).toBeInTheDocument();
  });

  it('el buscador filtra por nombre', () => {
    renderWithProviders(<ListBabysTemplate babys={babys} />);
    fireEvent.change(screen.getByPlaceholderText(/buscar por nombre/i), { target: { value: 'Ana' } });
    expect(screen.getByText('Ana García')).toBeInTheDocument();
    expect(screen.queryByText('Beto López')).not.toBeInTheDocument();
  });

  it('la coordinadora puede dar de baja: dispara onDeleteBaby con id y nombre', () => {
    const onDeleteBaby = vi.fn();
    renderWithProviders(
      <ListBabysTemplate babys={babys} isCoordinator onDeleteBaby={onDeleteBaby} />,
    );
    fireEvent.click(screen.getByLabelText('Dar de baja bebé Ana García'));
    expect(onDeleteBaby).toHaveBeenCalledWith(1, 'Ana García');
  });
});
