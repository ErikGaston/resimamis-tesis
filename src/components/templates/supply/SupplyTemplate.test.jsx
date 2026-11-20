import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import SupplyTemplate from './SupplyTemplate';
import { renderWithProviders } from '../../../test/renderWithProviders';

function setup(props = {}) {
  const noop = vi.fn();
  const merged = {
    valueTask: 1,
    changeTask: () => () => {},
    supplies: [],
    movementsData: null,
    providersData: [],
    onRegisterSupplyMovement: noop,
    onCreateSupply: noop,
    createSupplyCloseSignal: 0,
    movementCloseSignal: 0,
    idVoluntariaDefault: 1,
    babies: [],
    isCoord: true,
    onEditSupply: noop,
    onDeleteSupply: noop,
    editCloseSignal: 0,
    deleteCloseSignal: 0,
    insumosBajoMinimo: [],
    ...props,
  };
  return { ...merged, ...renderWithProviders(<SupplyTemplate {...merged} />) };
}

describe('SupplyTemplate', () => {
  it('renderiza el header "Insumos"', () => {
    setup();
    expect(screen.getByText('Insumos')).toBeInTheDocument();
  });

  it('muestra el botón para agregar un insumo al catálogo', () => {
    setup();
    expect(screen.getByRole('button', { name: /agregar insumo al catálogo/i })).toBeInTheDocument();
  });

  it('abrir "Nuevo insumo" deja "Guardar insumo" deshabilitado con el form vacío', () => {
    const { container } = setup();
    fireEvent.click(screen.getByRole('button', { name: /agregar insumo al catálogo/i }));
    expect(screen.getByText('Nuevo insumo')).toBeInTheDocument();
    const guardar = screen.getByRole('button', { name: /guardar insumo/i });
    expect(guardar).toBeDisabled();
    expect(container).toBeTruthy();
  });
});
