import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TextfieldCustomized from './TextfieldCustomized';

describe('TextfieldCustomized', () => {
  it('renderiza la etiqueta y el helperText', () => {
    render(<TextfieldCustomized label="Nombre" helperText="Obligatorio" />);
    expect(screen.getByLabelText('Nombre')).toBeInTheDocument();
    expect(screen.getByText('Obligatorio')).toBeInTheDocument();
  });

  it('dispara onChange al tipear', async () => {
    const onChange = vi.fn();
    render(<TextfieldCustomized label="Nombre" onChange={onChange} />);
    await userEvent.type(screen.getByLabelText('Nombre'), 'Ana');
    expect(onChange).toHaveBeenCalled();
  });
});
