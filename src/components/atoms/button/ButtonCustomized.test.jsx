import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ButtonCustomized from './ButtonCustomized';

describe('ButtonCustomized', () => {
  it('renderiza el children como texto del botón', () => {
    render(<ButtonCustomized>Guardar insumo</ButtonCustomized>);
    expect(screen.getByRole('button', { name: 'Guardar insumo' })).toBeInTheDocument();
  });

  it('llama onClick al hacer click', async () => {
    const onClick = vi.fn();
    render(<ButtonCustomized onClick={onClick}>Ok</ButtonCustomized>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('se renderiza deshabilitado con la prop disabled', () => {
    render(<ButtonCustomized disabled>Ok</ButtonCustomized>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
