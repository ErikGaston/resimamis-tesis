import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LabelInput from './LabelInput';

describe('LabelInput', () => {
  it('muestra el label', () => {
    render(<LabelInput id="nombre" label="Nombre" />);
    expect(screen.getByText('Nombre')).toBeInTheDocument();
  });

  it('dispara onChange al tipear', async () => {
    const onChange = vi.fn();
    render(<LabelInput id="nombre" label="Nombre" value="" onChange={onChange} />);
    await userEvent.type(screen.getByRole('textbox'), 'A');
    expect(onChange).toHaveBeenCalled();
  });

  it('muestra el helperText cuando hay error', () => {
    render(<LabelInput id="dni" label="DNI" error helperText="DNI inválido" />);
    expect(screen.getByText('DNI inválido')).toBeInTheDocument();
  });

  it('marca el input como requerido', () => {
    render(<LabelInput id="n" label="Nombre" required />);
    expect(screen.getByRole('textbox')).toBeRequired();
  });
});
