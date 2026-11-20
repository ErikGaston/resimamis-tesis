import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InsumoQuantity from './InsumoQuantity';

const item = { idInsumo: 1, nombre: 'Pañales', stockActual: 5, cantidad: 1 };

describe('InsumoQuantity', () => {
  it('muestra nombre, entrega y stock disponible', () => {
    render(<InsumoQuantity item={item} listSupplies={[item]} setListSupplies={() => {}} />);
    expect(screen.getByText('Pañales')).toBeInTheDocument();
    expect(screen.getByText(/Entrega: 1 unidad/)).toBeInTheDocument();
    expect(screen.getByText(/Stock disponible: 5/)).toBeInTheDocument();
  });

  it('sumar incrementa la cantidad vía setListSupplies', async () => {
    const setListSupplies = vi.fn();
    render(<InsumoQuantity item={item} listSupplies={[item]} setListSupplies={setListSupplies} />);
    await userEvent.click(screen.getAllByRole('button')[1]); // botón +
    expect(setListSupplies).toHaveBeenCalledWith([{ ...item, cantidad: 2 }]);
  });

  it('restar decrementa la cantidad', async () => {
    const setListSupplies = vi.fn();
    render(<InsumoQuantity item={item} listSupplies={[item]} setListSupplies={setListSupplies} />);
    await userEvent.click(screen.getAllByRole('button')[0]); // botón −
    expect(setListSupplies).toHaveBeenCalledWith([{ ...item, cantidad: 0 }]);
  });

  it('deshabilita restar en 0 y sumar al tope de stock', () => {
    const { rerender } = render(
      <InsumoQuantity item={{ ...item, cantidad: 0 }} listSupplies={[]} setListSupplies={() => {}} />,
    );
    expect(screen.getAllByRole('button')[0]).toBeDisabled();
    rerender(<InsumoQuantity item={{ ...item, cantidad: 5 }} listSupplies={[]} setListSupplies={() => {}} />);
    expect(screen.getAllByRole('button')[1]).toBeDisabled();
  });
});
